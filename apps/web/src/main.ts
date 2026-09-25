import { createRuntimeStatus } from "./status.js";

const statusElement = document.querySelector<HTMLElement>("#runtime-status");
if (!statusElement) throw new Error("Runtime status element is missing");
statusElement.textContent = createRuntimeStatus(3);

const dialog = document.querySelector<HTMLDialogElement>("#create-dialog");
const createButton = document.querySelector<HTMLButtonElement>('[data-action="create"]');
createButton?.addEventListener("click", () => dialog?.showModal());

document.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
  if (element === createButton) return;
  element.addEventListener("click", () => {
    const action = element.dataset.action;
    if (action && dialog) {
      dialog.querySelector("h2")!.textContent = action === "idea" ? "Generate ideas" : action === "script" ? "Write a script" : action === "video" ? "Create video" : "Analyze ads";
      dialog.showModal();
    }
  });
});

document.querySelectorAll<HTMLAnchorElement>(".nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
