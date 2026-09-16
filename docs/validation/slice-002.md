# Slice 002 — Runtime configuration and health contracts

## Acceptance criteria

- Runtime configuration is typed and validated at startup.
- Invalid `NODE_ENV`, `PORT`, and shutdown timeout values fail closed.
- No provider credentials are accepted or exposed by this slice.
- Liveness is independent of downstream dependencies.
- Readiness can represent dependency degradation without exposing secrets.
- Tests cover defaults, invalid configuration, liveness, and degraded readiness.

## Security boundary

Environment variables are treated as untrusted configuration. Numeric values are bounded and invalid values are rejected. Health responses contain service/version metadata and dependency status only; credentials and configuration values are not returned.

## Failure handling

Invalid configuration throws during startup rather than silently falling back to unsafe values. Readiness reports `degraded` whenever a supplied dependency check is not `ok`.

## Rollback

Revert the slice commits if the implementation introduces a regression. No database or external infrastructure changes are included.

## Validation evidence

CI is the authoritative execution environment. The added test suite is `apps/api/test/config-health.test.mjs` and runs after the API TypeScript build generates `dist` output.

## Status

This slice establishes runtime configuration and health domain contracts. It does **not** make the API production-ready by itself; HTTP serving, dependency-backed readiness, structured logging, observability, deployment, and later roadmap phases remain outstanding.
