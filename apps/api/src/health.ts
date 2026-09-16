export type HealthStatus = "ok" | "degraded";

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly service: string;
  readonly version: string;
  readonly checks?: Readonly<Record<string, HealthStatus>>;
}

export function liveness(service: string, version: string): HealthResponse {
  return Object.freeze({ status: "ok", service, version });
}

export function readiness(
  service: string,
  version: string,
  checks: Readonly<Record<string, HealthStatus>>,
): HealthResponse {
  const values = Object.values(checks);
  const status: HealthStatus = values.every((value) => value === "ok") ? "ok" : "degraded";
  return Object.freeze({ status, service, version, checks: Object.freeze({ ...checks }) });
}
