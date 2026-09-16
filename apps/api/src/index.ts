import { defineComponent } from "@zytgen/contracts";

export { loadRuntimeConfig } from "./config.js";
export type { RuntimeConfig } from "./config.js";
export { liveness, readiness } from "./health.js";
export type { HealthResponse, HealthStatus } from "./health.js";

export const apiComponent = defineComponent({
  kind: "api",
  name: "zytgen API/BFF",
  status: "foundation",
});
