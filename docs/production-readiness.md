# Production Readiness Status

This document is an evidence-based gate, not a declaration that the platform is production-ready.

## Verified in repository

- API HTTP runtime exposes liveness, readiness, versioned API metadata, request IDs, bounded JSON bodies, stable JSON errors, security headers, and graceful startup/shutdown behavior.
- Container build uses a multi-stage image and runs as a non-root user.
- CI runs formatting, lint, type checking, tests, build, dependency audit, and secret scanning.
- Docker build context excludes local dependencies, build output, VCS metadata, logs, and environment files.

## Current blockers before a production claim

1. No committed `pnpm-lock.yaml`; dependency installation is not yet fully reproducible.
2. No durable PostgreSQL-backed persistence, migrations, transactional outbox, or restore evidence.
3. No verified identity, authentication, authorization, tenant isolation, or security policy enforcement on application routes.
4. Readiness currently validates process health only; external dependencies are not checked.
5. No production-grade structured logging, metrics, tracing, rate limiting, or alerting evidence.
6. No executable deployment, rollback, backup/restore, disaster-recovery, or live integration evidence.

## Required evidence for promotion

- Immutable commit SHA and passing CI for the exact release artifact.
- Reproducible install from a committed lockfile.
- Database migration and restore tests against a real PostgreSQL service.
- Authentication/authorization and cross-tenant isolation tests.
- Dependency-backed readiness checks and operational telemetry.
- Health-gated deployment plus rollback validation.
- Provider integration evidence for each enabled external connector, including scopes, failure handling, idempotency, and reconciliation.

Until these items are implemented and validated, the repository must be treated as **not production-ready**.
