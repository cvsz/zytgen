import assert from "node:assert/strict";
import test from "node:test";
import { loadRuntimeConfig } from "../dist/config.js";

test("runtime config defaults safely for local development", () => {
  assert.deepEqual(loadRuntimeConfig({}), {
    nodeEnv: "development",
    port: 3000,
    host: "127.0.0.1",
    shutdownTimeoutMs: 10_000,
  });
});

test("runtime config accepts explicit production values", () => {
  assert.deepEqual(loadRuntimeConfig({
    NODE_ENV: "production",
    PORT: "8080",
    HOST: "0.0.0.0",
    SHUTDOWN_TIMEOUT_MS: "5000",
  }), {
    nodeEnv: "production",
    port: 8080,
    host: "0.0.0.0",
    shutdownTimeoutMs: 5000,
  });
});

test("runtime config rejects invalid environment values", () => {
  assert.throws(() => loadRuntimeConfig({ NODE_ENV: "staging" }), /NODE_ENV/);
});

test("runtime config rejects unsafe port values", () => {
  assert.throws(() => loadRuntimeConfig({ PORT: "0" }), /PORT/);
  assert.throws(() => loadRuntimeConfig({ PORT: "65536" }), /PORT/);
  assert.throws(() => loadRuntimeConfig({ PORT: "abc" }), /PORT/);
});
