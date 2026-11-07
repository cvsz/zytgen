import assert from "node:assert/strict";
import test from "node:test";
import { createApiServer } from "../dist/server.js";

async function withServer(fn) {
  const server = createApiServer({
    nodeEnv: "test",
    host: "127.0.0.1",
    port: 0,
    shutdownTimeoutMs: 1000,
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try {
    return await fn(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("live endpoint is healthy and emits a request id", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/health/live`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("x-request-id") ?? "", /^[0-9a-f-]{36}$/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(
      response.headers.get("content-security-policy"),
      "default-src 'none'; frame-ancestors 'none'",
    );
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "zytgen-api",
      version: "0.0.0",
    });
  }));

test("readiness exposes dependency checks", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/health/ready`, {
      headers: { "x-request-id": "test-request-1" },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-request-id"), "test-request-1");
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "zytgen-api",
      version: "0.0.0",
      checks: { process: "ok" },
    });
  }));

test("malformed Host headers cannot break request-target parsing", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/health/live`, { headers: { host: "[" } });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "zytgen-api",
      version: "0.0.0",
    });
  }));

test("unknown routes return a stable error envelope", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/does-not-exist`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  }));

test("known routes reject unsupported methods", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/health/live`, { method: "POST" });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    assert.deepEqual(await response.json(), {
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
    });
  }));

test("JSON endpoint rejects unsupported media types", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/api/v1/echo`, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "{}",
    });
    assert.equal(response.status, 415);
    assert.deepEqual(await response.json(), {
      error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Content-Type must be application/json" },
    });
  }));

test("JSON endpoint rejects malformed payloads", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/api/v1/echo`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: { code: "INVALID_JSON", message: "Request body must be valid JSON" },
    });
  }));

test("JSON endpoint rejects oversized payloads", async () =>
  withServer(async (base) => {
    const response = await globalThis.fetch(`${base}/api/v1/echo`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: "x".repeat(1_048_577) }),
    });
    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), {
      error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 1 MiB" },
    });
  }));
