import assert from "node:assert/strict";
import test from "node:test";
import { createApiServer } from "../dist/server.js";

async function withServer(fn) {
  const server = createApiServer({ nodeEnv: "test", host: "127.0.0.1", port: 0, shutdownTimeoutMs: 1000 });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  try { return await fn(`http://127.0.0.1:${address.port}`); } finally { await new Promise((resolve) => server.close(resolve)); }
}

test("live endpoint is healthy and emits a request id", async () => withServer(async (base) => {
  const response = await fetch(`${base}/health/live`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("x-request-id") ?? "", /^[0-9a-f-]{36}$/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(await response.json(), { status: "ok" });
}));

test("unknown routes return a stable error envelope", async () => withServer(async (base) => {
  const response = await fetch(`${base}/does-not-exist`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Route not found" } });
}));

test("JSON endpoint rejects malformed payloads", async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/v1/echo`, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } });
}));
