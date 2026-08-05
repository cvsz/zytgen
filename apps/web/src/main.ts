import { createRuntimeStatus } from "./status.js";

const statusElement = document.querySelector<HTMLElement>("#runtime-status");

if (!statusElement) {
  throw new Error("Runtime status element is missing");
}

statusElement.textContent = createRuntimeStatus(3);
