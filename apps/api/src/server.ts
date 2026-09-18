import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { liveness, readiness } from "./health.js";
import { loadRuntimeConfig, type RuntimeConfig } from "./config.js";

const MAX_BODY_BYTES = 1_048_576;
const ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const SERVICE_NAME = "zytgen-api";
const SERVICE_VERSION = "0.0.0";

function json(res: ServerResponse, status: number, body: unknown, requestId: string): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
    "x-request-id": requestId,
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    allow: ALLOWED_METHODS,
  });
  res.end(payload);
}

function requestId(req: IncomingMessage): string {
  const supplied = req.headers["x-request-id"];
  if (typeof supplied === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(supplied)) return supplied;
  return randomUUID();
}

async function readBody(req: IncomingMessage): Promise<string> {
  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export function createApiServer(config: RuntimeConfig = loadRuntimeConfig()) {
  return createServer(async (req, res) => {
    const id = requestId(req);
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    try {
      if (method === "OPTIONS") {
        res.writeHead(204, {
          "access-control-allow-methods": ALLOWED_METHODS,
          "access-control-allow-headers": "content-type, authorization, x-request-id",
          "access-control-max-age": "600",
          "x-request-id": id,
        });
        res.end();
        return;
      }

      if (url.pathname === "/health/live" && method === "GET") {
        json(res, 200, liveness(SERVICE_NAME, SERVICE_VERSION), id);
        return;
      }
      if (url.pathname === "/health/ready" && method === "GET") {
        json(res, 200, readiness(SERVICE_NAME, SERVICE_VERSION, { process: "ok" }), id);
        return;
      }
      if (url.pathname === "/api/v1" && method === "GET") {
        json(res, 200, { service: SERVICE_NAME, version: "v1", environment: config.nodeEnv }, id);
        return;
      }
      if (url.pathname === "/api/v1/echo" && method === "POST") {
        const raw = await readBody(req);
        if (!raw) {
          json(res, 400, { error: { code: "EMPTY_BODY", message: "Request body is required" } }, id);
          return;
        }
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          json(res, 400, { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } }, id);
          return;
        }
        json(res, 200, { data: parsed }, id);
        return;
      }

      json(res, 404, { error: { code: "NOT_FOUND", message: "Route not found" } }, id);
    } catch (error) {
      if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") {
        json(res, 413, { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 1 MiB" } }, id);
        return;
      }
      json(res, 500, { error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, id);
    }
  });
}

export async function startApiServer(config: RuntimeConfig = loadRuntimeConfig()): Promise<ReturnType<typeof createApiServer>> {
  const server = createApiServer(config);
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(config.port, config.host);
  });
  return server;
}
