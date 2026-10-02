import { startApiServer, loadRuntimeConfig } from "./index.js";

const config = loadRuntimeConfig();
const server = await startApiServer(config);

const shutdown = async (signal: string) => {
  console.log(JSON.stringify({ level: "info", event: "shutdown_requested", signal }));
  const timer = setTimeout(() => process.exit(1), config.shutdownTimeoutMs);
  timer.unref();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  clearTimeout(timer);
  process.exit(0);
};

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

console.log(
  JSON.stringify({
    level: "info",
    event: "server_started",
    host: config.host,
    port: config.port,
    environment: config.nodeEnv,
  }),
);
