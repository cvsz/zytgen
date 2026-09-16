import assert from "node:assert/strict";
import test from "node:test";

import { loadRuntimeConfig } from "../dist/config.js";
import { liveness, readiness } from "../dist/health.js";

test("loads safe runtime defaults", () => {
  assert.deepEqual(loadRuntimeConfig({ NODE_ENV: "test" }), {
    nodeEnv: "test",
    port: 3000,
    host: "127.0.0.1",
    shutdownTimeoutMs: 10_000,
  });
});

test("rejects invalid runtime configuration", () => {
  assert.throws(() => loadRuntimeConfig({ PORT: "0" }), /PORT must be between/);
  assert.throws(() => loadRuntimeConfig({ NODE_ENV: "invalid" }), /NODE_ENV must be/);
});

test("reports liveness without dependency checks", () => {
  assert.deepEqual(liveness("zytgen-api", "0.0.0"), {
    status: "ok",
    service: "zytgen-api",
    version: "0.0.0",
  });
});

test("reports degraded readiness when a dependency is unhealthy", () => {
  assert.deepEqual(readiness("zytgen-api", "0.0.0", { database: "degraded", queue: "ok" }), {
    status: "degraded",
    service: "zytgen-api",
    version: "0.0.0",
    checks: { database: "degraded", queue: "ok" },
  });
});
