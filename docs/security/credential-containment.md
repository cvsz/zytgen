# Credential Boundary Containment

## Scope

This repository previously contained manually dispatched workflows that checked out a caller-selected pull-request merge ref, executed candidate-controlled validation/helper code, and made the reviewer PAT available to that execution context. A separate scheduled/manual workflow also coupled routine read-only checks to reviewer and signing-secret presence.

This change removes those automation paths and adds regression tests. It does **not** revoke credentials, rotate signing keys, inspect private audit logs, or establish whether any credential was exfiltrated.

## Required operator actions

1. Disable any remaining legacy reviewer/auto-fix workflows in GitHub Actions before further use. Do not dispatch them against candidate-controlled revisions.
2. Inventory repository and organization secret **names and scopes only**. Do not print, export, or copy secret values into logs or issue comments.
3. Revoke the affected reviewer PAT. Replace it only if a separate, narrowly scoped integration is justified; never expose it to code checked out from an untrusted PR.
4. Inspect GitHub audit events and token activity privately for the relevant time window. Record event identifiers and conclusions without recording token values.
5. Determine whether signing material was ever provisioned to the affected workflows. Rotate the key/passphrase if exposure is plausible or confirmed.
6. Verify old-token rejection using an authorized, non-mutating authentication check. Record only the HTTP/authentication result and timestamp.
7. Keep human independent review in the GitHub review UI. Automation may run secretless read-only checks, but must not create review submissions or comments as the independent reviewer identity.

## Evidence record

Record the following in a restricted operator incident/evidence system:

- affected repository and workflow path;
- secret name and scope (never the value);
- disablement timestamp and administrator identity;
- PAT revocation timestamp and old-token rejection result;
- signing-key rotation decision and verification result;
- relevant audit-event identifiers and investigation conclusion;
- remaining repositories requiring remediation.

## Admission

Keep this remediation in Draft until exact-head CI/security checks, signed provenance, independent human review, and operator credential-disposition evidence are complete. Do not bypass branch protection or force-push protected history.
