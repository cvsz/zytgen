import assert from "node:assert/strict";
import test from "node:test";

import { workerComponent } from "../dist/index.js";

test("exports the worker foundation descriptor", () => {
  assert.deepEqual(workerComponent, {
    kind: "worker",
    name: "zytgen durable worker",
    status: "foundation",
  });
});
