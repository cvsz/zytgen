import assert from "node:assert/strict";
import test from "node:test";

import { createRuntimeStatus } from "../dist/status.js";

test("creates a deterministic runtime status", () => {
  assert.equal(createRuntimeStatus(3), "3 repository components validated");
});

test("rejects invalid component counts", () => {
  assert.throws(() => createRuntimeStatus(0), RangeError);
});
