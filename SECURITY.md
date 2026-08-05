# Security Policy and Engineering Baseline

## Supported versions

Security support begins with the first tagged release. Until then, `main` is pre-release and may change without compatibility guarantees.

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in public issues. Contact the repository owner through a private GitHub security advisory or another private channel configured for the project. Include impact, affected component, reproduction steps, and any suggested mitigation.

## Security objectives

1. Prevent cross-tenant data access.
2. Keep AI provider, social platform, ads, commerce, and storage credentials server-side.
3. Require explicit authorization and approval for consequential external actions.
4. Make privileged actions and external side effects auditable.
5. Limit blast radius through least privilege, isolation, quotas, and short-lived credentials.
6. Provide secure deletion, export, retention, and incident response workflows.

## Mandatory controls

### Identity and tenancy

- OIDC/OAuth-compatible identity boundary.
- Workspace-scoped authorization on every tenant-owned resource.
- Deny by default; roles grant explicit actions.
- Cross-tenant tests for endpoints, repositories, workers, webhooks, and exports.
- Service accounts use narrowly scoped, revocable grants.

### Secrets and connector credentials

- Secrets are stored only in an approved secret manager or encrypted credential store.
- Envelope encryption uses a managed KMS where available.
- Credentials never appear in browser bundles, URLs, analytics payloads, logs, traces, or exception messages.
- Refresh/access tokens are rotated and revoked on disconnect.
- Connector scopes are minimized and displayed to operators.

### External actions

Publishing, outbound messaging, account linking, deletions, exports, spend changes, and other privileged actions must enforce:

- authenticated actor or service identity;
- workspace-scoped authorization;
- explicit tool/connector grant;
- configured human approval policy;
- idempotency key and replay protection;
- immutable audit event;
- timeout, retry classification, and reconciliation.

### Webhooks and APIs

- Verify signatures against raw request bodies.
- Enforce timestamp tolerance and replay protection.
- Apply rate limits, payload limits, schema validation, and safe content-type handling.
- Use cursor pagination and bounded query complexity.
- Do not expose internal identifiers or stack traces unnecessarily.

### AI and generated content

- Treat model output as untrusted input.
- Validate structured output against strict schemas.
- Isolate tools and rendering workloads with filesystem, network, CPU, memory, and time limits.
- Require provenance for recommendations based on external sources.
- Record model, prompt revision, policy result, usage, and operator decision.
- Defend retrieval and tool workflows against prompt injection and unauthorized data exfiltration.

### Software supply chain

- Pin dependencies and lockfiles.
- Run dependency, license, secret, and static-analysis scans in CI.
- Use least-privilege GitHub Actions permissions and pin third-party actions by commit SHA.
- Produce build provenance and an SBOM for releases.
- Sign release artifacts when release automation is introduced.

### Data protection

- TLS in transit and encryption at rest.
- Data classification and retention policy per resource type.
- Tenant-aware backup, restore, export, and deletion design.
- Sensitive fields excluded or redacted from telemetry.
- Media uploads validated for type, size, malware risk, and decompression bombs.

## Security review gates

A change requires explicit security review when it affects authentication, authorization, tenant scoping, secrets, encryption, external publishing, outbound messaging, money/spend, webhooks, uploads, untrusted execution, privacy deletion, or audit integrity.

## Incident readiness

Before production launch, maintain runbooks for credential compromise, cross-tenant exposure, malicious upload, webhook abuse, provider outage, accidental publication, data deletion failure, and suspicious automated messaging.
