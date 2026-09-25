import assert from "node:assert/strict";
import test from "node:test";

import { apiComponent } from "../dist/index.js";

test("exports the API foundation descriptor", () => {
  assert.deepEqual(apiComponent, {
    kind: "api",
    name: "zytgen API/BFF",
    status: "foundation",
  });
});
