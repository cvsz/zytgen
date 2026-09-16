export const workspaceRoles = ["owner", "admin", "member", "viewer"] as const;
export type WorkspaceRole = (typeof workspaceRoles)[number];

export interface Organization {
  readonly id: string;
  readonly name: string;
}

export interface Workspace {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
}

export interface Membership {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly userId: string;
  readonly role: WorkspaceRole;
}

export function assertSameTenant(membership: Membership, organizationId: string, workspaceId: string): void {
  if (membership.organizationId !== organizationId || membership.workspaceId !== workspaceId) {
    throw new Error("Cross-tenant access denied");
  }
}

export function canManageWorkspace(role: WorkspaceRole): boolean {
  return role === "owner" || role === "admin";
}
