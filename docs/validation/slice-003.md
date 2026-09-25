# Slice 003 — Identity and workspace boundary

## Objective
Establish a fail-closed identity contract and tenant boundary that every future API, worker, persistence, and AI workflow must honor.

## Included
- Organizations and workspaces are explicitly represented.
- Memberships bind a user to an organization and workspace with a closed role set.
- Cross-organization and cross-workspace access is rejected by the contract helper.
- Only `owner` and `admin` can manage workspace configuration at the policy layer.
- Negative isolation tests cover mismatched organization and workspace identifiers.
- Web UI now presents the workspace as the primary operating context.

## Security boundary
This slice does not add authentication, session storage, database persistence, external identity providers, or privileged integrations. The contract is intentionally fail-closed and is not evidence that production authentication has been implemented.

## Acceptance criteria
- [x] Typed organization/workspace/membership contracts.
- [x] Closed role vocabulary.
- [x] Cross-tenant denial helper.
- [x] Management authorization helper.
- [x] Negative authorization/isolation tests.
- [x] Workspace-first web UX shell.
- [ ] Durable persistence and unique database constraints.
- [ ] Authentication/session/token verification.
- [ ] API middleware enforcing the boundary on every request.

## Rollback
Revert this slice. No migration or external side effect is introduced.

## Production status
This slice is a security boundary foundation only. It must not be represented as a complete identity system until authentication, durable persistence, request middleware, auditability, and deployment evidence are merged and validated.
