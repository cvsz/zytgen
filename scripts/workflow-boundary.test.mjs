import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const workflowDirectory = path.join(root, ".github", "workflows");
const helperDirectory = path.join(root, ".github", "scripts");

const retiredArtifacts = [
  ".github/workflows/automated-audit-review-approve.yml",
  ".github/workflows/auto-fix-open-prs.yml",
  ".github/scripts/gpg-loopback.sh",
  ".github/scripts/post-review-comment.sh",
];

function listFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(filePath) : [filePath];
  });
}

test("privileged reviewer and signing artifacts remain absent", () => {
  for (const relativePath of retiredArtifacts) {
    assert.equal(
      existsSync(path.join(root, relativePath)),
      false,
      `Retired privileged artifact must not exist: ${relativePath}`,
    );
  }
});

test("workflow definitions do not reference reviewer or signing credentials", () => {
  const forbiddenReferences =
    /\b(?:POLIEDBC_PAT|GPG_SIGNING_KEY|GPG_PASSPHRASE)\b|\bgh\s+pr\s+(?:review|comment)\b/i;

  for (const filePath of listFiles(workflowDirectory)) {
    if (!/\.ya?ml$/i.test(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");
    assert.doesNotMatch(
      source,
      forbiddenReferences,
      `${path.relative(root, filePath)} must not contain privileged reviewer operations or credentials`,
    );
  }
});

test("GitHub helper scripts do not contain reviewer credential operations", () => {
  const forbiddenReferences =
    /\b(?:POLIEDBC_PAT|GPG_SIGNING_KEY|GPG_PASSPHRASE)\b|\bgh\s+pr\s+(?:review|comment)\b/i;

  for (const filePath of listFiles(helperDirectory)) {
    const source = readFileSync(filePath, "utf8");
    assert.doesNotMatch(
      source,
      forbiddenReferences,
      `${path.relative(root, filePath)} must not contain privileged reviewer operations or credentials`,
    );
  }
});
