import assert from "node:assert/strict";
import test from "node:test";

import { componentKinds, defineComponent } from "../dist/index.js";

test("defines the supported repository components", () => {
  assert.deepEqual(componentKinds, ["web", "api", "worker"]);
});

test("normalizes and freezes component descriptors", () => {
  const descriptor = defineComponent({ kind: "api", name: " API ", status: "foundation" });

  assert.equal(descriptor.name, "API");
  assert.equal(Object.isFrozen(descriptor), true);
});

test("rejects empty component names", () => {
  assert.throws(
    () => defineComponent({ kind: "worker", name: " ", status: "foundation" }),
    TypeError,
  );
});
