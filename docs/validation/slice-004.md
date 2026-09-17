# Slice 004 — HTTP runtime boundary

## Outcome

Add the first executable API runtime boundary without introducing external dependencies or changing existing contracts.

## Included

- Node `http` server factory and startup helper.
- Liveness endpoint: `GET /health/live`.
- Readiness endpoint: `GET /health/ready`.
- Metadata endpoint: `GET /v1/metadata`.
- Deterministic `x-request-id` propagation with validation and UUID fallback.
- Safe response headers: `nosniff`, `DENY`, `no-referrer`, and `no-store`.
- Explicit `405` and `404` JSON responses.
- Graceful `SIGINT`/`SIGTERM` shutdown with a bounded timeout.
- Package `start` command and server export.

## Security boundary

This slice does not add authentication, authorization, persistence, CORS, credentials, provider integrations, or mutation endpoints. It is intentionally read-only and fail-closed for unknown paths and unsupported methods.

## Validation

The authoritative checks are the repository's format, lint, typecheck, test, and build gates. The next CI run must pass on the exact PR head before merge.

## Rollback

Revert the single slice PR. No migrations, external resources, or irreversible side effects are introduced.

## Remaining production requirements

Authentication/session verification, request body limits, structured logging, dependency-backed readiness, persistence, rate limiting, audit logging, deployment manifests, observability, backups/restore, and end-to-end operational evidence remain required before production status.
