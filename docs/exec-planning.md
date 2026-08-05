# Execution Planning

This document converts the product roadmap into an implementation workflow for contributors and coding agents.

## Current execution state

- Slice 001 — Repository and CI scaffold: **foundation implemented**, pending merged CI evidence.
- Next slice: Slice 002 — Runtime configuration and health.

## Operating rules

1. Revalidate the repository and open work before editing.
2. Implement exactly one complete vertical slice per pull request.
3. Never leave partially wired endpoints, UI, migrations, or background jobs.
4. Preserve backward compatibility unless the slice explicitly defines a migration.
5. Keep provider SDKs and credentials behind server-side adapters.
6. Require explicit tool grants and approval for privileged external side effects.
7. Update documentation, feature status, changelog, and validation evidence in the same pull request.
8. Run formatting, linting, type checking, unit tests, integration tests, and security checks; fix regressions before merge.

## Definition of ready

A slice is ready when it includes:

- user outcome and acceptance criteria;
- affected domain and owner;
- API/event/schema changes;
- authorization and tenant-boundary rules;
- failure, retry, cancellation, and idempotency behavior;
- observability and audit requirements;
- rollout, feature flag, and rollback plan;
- test plan and required fixtures.

## Definition of done

A slice is done only when:

- the user flow works end to end through production-shaped interfaces;
- no secrets or provider credentials are exposed to clients;
- authorization and cross-tenant negative tests pass;
- state changes are transactional and external jobs are idempotent;
- logs, metrics, traces, and audit events are emitted;
- failure paths, retries, timeouts, and cancellation are tested;
- migrations are backward compatible and rollback-safe;
- API/schema documentation and feature matrix are updated;
- CI is green and the pull request contains validation evidence.

Requirements that do not apply to a foundation-only slice must be recorded explicitly in its validation record rather than silently omitted.

## Recommended implementation sequence

### Slice 001 — Repository and CI scaffold

Create workspace layout, package manager configuration, formatting, linting, type checking, unit-test harness, commit conventions, dependency scanning, secret scanning, and baseline CI.

Validation: `docs/validation/slice-001.md`.

### Slice 002 — Runtime configuration and health

Add typed configuration, environment validation, structured logging, request IDs, health/readiness endpoints, and test containers for required infrastructure.

### Slice 003 — Identity and workspace boundary

Implement local/test authentication adapter, users, organizations, workspaces, membership, RBAC policy, workspace-scoped repositories, and cross-tenant tests.

### Slice 004 — Content item lifecycle

Implement content item creation, status transitions, optimistic concurrency, version history, API contracts, audit events, and a minimal UI flow.

### Slice 005 — Approval workflow

Implement approval policy, requests, decisions, comments, expiry, cancellation, notification boundary, and tests for unauthorized or stale decisions.

### Slice 006 — Durable job foundation

Implement jobs, attempts, leases, heartbeats, cancellation, retry classification, idempotency keys, outbox relay, worker execution, and operational views.

### Slice 007 — AI text generation

Add provider-neutral text interface, one production provider adapter, one deterministic test adapter, structured outputs, fallback policy, cost records, and content-generation UI.

### Slice 008 — YouTube publishing sandbox

Add connector contract, OAuth boundary, mocked/sandbox adapter, media validation, scheduling, approval gate, publication attempts, and reconciliation.

Subsequent slices follow the roadmap, always preserving one complete user outcome per PR.

## Pull request template

```markdown
## Outcome

## Scope

## Out of scope

## Architecture and contracts

## Security and tenancy

## Failure and rollback

## Validation
- [ ] format
- [ ] lint
- [ ] typecheck
- [ ] unit tests
- [ ] integration tests
- [ ] security checks
- [ ] docs/feature matrix/changelog

## Evidence
```

## Validation record format

Each PR should record commands, environment, result, and any skipped check with justification. A passing label without command evidence is not sufficient.

## Merge policy

- required reviews and status checks must pass;
- unresolved review threads block merge;
- use squash merge unless preserving a deliberate commit series;
- delete merged feature branches;
- deploy behind a feature flag when behavior is not yet generally available.
