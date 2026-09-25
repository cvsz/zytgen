import test from "node:test";
import assert from "node:assert/strict";

const identity = await import("../dist/identity.js");

test("workspace roles expose a closed role set", () => {
  assert.deepEqual(identity.workspaceRoles, ["owner", "admin", "member", "viewer"]);
});

test("tenant assertion rejects cross-organization and cross-workspace access", () => {
  const membership = {
    organizationId: "org-a",
    workspaceId: "ws-a",
    userId: "user-a",
    role: "member",
  };

  assert.doesNotThrow(() => identity.assertSameTenant(membership, "org-a", "ws-a"));
  assert.throws(
    () => identity.assertSameTenant(membership, "org-b", "ws-a"),
    /Cross-tenant access denied/,
  );
  assert.throws(
    () => identity.assertSameTenant(membership, "org-a", "ws-b"),
    /Cross-tenant access denied/,
  );
});

test("only owner and admin can manage a workspace", () => {
  assert.equal(identity.canManageWorkspace("owner"), true);
  assert.equal(identity.canManageWorkspace("admin"), true);
  assert.equal(identity.canManageWorkspace("member"), false);
  assert.equal(identity.canManageWorkspace("viewer"), false);
});
