import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const sourceDirectory = resolve(process.cwd(), "public");
const outputDirectory = resolve(process.cwd(), "dist");

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
