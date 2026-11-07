export const componentKinds = ["web", "api", "worker"] as const;

export type ComponentKind = (typeof componentKinds)[number];

export interface ComponentDescriptor {
  readonly kind: ComponentKind;
  readonly name: string;
  readonly status: "foundation";
}

export function defineComponent(descriptor: ComponentDescriptor): Readonly<ComponentDescriptor> {
  const normalizedName = descriptor.name.trim();

  if (!normalizedName) {
    throw new TypeError("Component name must not be empty");
  }

  return Object.freeze({ ...descriptor, name: normalizedName });
}

export { workspaceRoles, assertSameTenant, canManageWorkspace } from "./identity.js";
export type { WorkspaceRole, Organization, Workspace, Membership } from "./identity.js";
