import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const targets = ["dist", ".turbo", "coverage"];

await Promise.all(
  targets.map((target) => rm(resolve(process.cwd(), target), { force: true, recursive: true })),
);
