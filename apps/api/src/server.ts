import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { loadRuntimeConfig, type RuntimeConfig } from "./config.js";
import { liveness, readiness, type HealthResponse } from "./health.js";

const SERVICE_NAME = "zytgen-api";
const SERVICE_VERSION = "0.0.0";

function writeJson(response: ServerResponse, statusCode: number, body: unknown, requestId: string): void {
  const payload = JSON.stringify(body);
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.setHeader("x-request-id", requestId);
  response.end(payload);
}

function requestIdFrom(request: IncomingMessage): string {
  const incoming = request.headers["x-request-id"];
  if (typeof incoming === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(incoming)) return incoming;
  return randomUUID();
}

function route(request: IncomingMessage, response: ServerResponse, requestId: string): void {
  const url = new URL(request.url ?? "/", "http://localhost");
  const method = request.method ?? "GET";

  if (method !== "GET" && method !== "HEAD") {
    writeJson(response, 405, { error: "method_not_allowed", requestId }, requestId);
    return;
  }

  let body: HealthResponse | { service: string; version: string; requestId: string };
  if (url.pathname === "/health/live") {
    body = liveness(SERVICE_NAME, SERVICE_VERSION);
  } else if (url.pathname === "/health/ready") {
    body = readiness(SERVICE_NAME, SERVICE_VERSION, { runtime: "ok" });
  } else if (url.pathname === "/v1/metadata") {
    body = { service: SERVICE_NAME, version: SERVICE_VERSION, requestId };
  } else {
    writeJson(response, 404, { error: "not_found", requestId }, requestId);
    return;
  }

  if (method === "HEAD") {
    response.statusCode = 200;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.setHeader("x-request-id", requestId);
    response.end();
    return;
  }

  writeJson(response, 200, body, requestId);
}

export function createApiServer(_config: RuntimeConfig = loadRuntimeConfig()): Server {
  return createServer((request, response) => {
    const requestId = requestIdFrom(request);
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("x-frame-options", "DENY");
    response.setHeader("referrer-policy", "no-referrer");
    route(request, response, requestId);
  });
}

export async function startApiServer(config: RuntimeConfig = loadRuntimeConfig()): Promise<Server> {
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadRuntimeConfig();
  const server = await startApiServer(config);
  const address = server.address();
  const bound = typeof address === "object" && address ? `${address.address}:${address.port}` : "unknown";
  process.stdout.write(`zytgen API listening on ${bound}\n`);

  const shutdown = (signal: string) => {
    const timer = setTimeout(() => process.exit(1), config.shutdownTimeoutMs);
    timer.unref();
    server.close(() => {
      clearTimeout(timer);
      process.exit(0);
    });
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}
