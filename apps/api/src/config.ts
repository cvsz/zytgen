export type RuntimeConfig = Readonly<{
  nodeEnv: "development" | "test" | "production";
  port: number;
  host: string;
  shutdownTimeoutMs: number;
}>;

const DEFAULT_PORT = 3000;
const DEFAULT_SHUTDOWN_TIMEOUT_MS = 10_000;

function parsePositiveInteger(name: string, value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be a positive integer`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed > 65_535) {
    throw new Error(`${name} must be between 1 and 65535`);
  }
  return parsed;
}

function parseEnvironment(value: string | undefined): RuntimeConfig["nodeEnv"] {
  if (value === undefined || value === "") return "development";
  if (value === "development" || value === "test" || value === "production") return value;
  throw new Error("NODE_ENV must be development, test, or production");
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const nodeEnv = parseEnvironment(env["NODE_ENV"]);
  const defaultHost = nodeEnv === "production" ? "0.0.0.0" : "127.0.0.1";

  return Object.freeze({
    nodeEnv,
    port: parsePositiveInteger("PORT", env["PORT"], DEFAULT_PORT),
    host: env["HOST"]?.trim() || defaultHost,
    shutdownTimeoutMs: parsePositiveInteger(
      "SHUTDOWN_TIMEOUT_MS",
      env["SHUTDOWN_TIMEOUT_MS"],
      DEFAULT_SHUTDOWN_TIMEOUT_MS,
    ),
  });
}
