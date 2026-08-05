# AGENTS.md

## Mission

Build `zytgen` as a secure, production-grade AI Content Operations platform. Do not represent planned integrations or workflows as complete until they are implemented and validated.

## Required workflow

1. Inspect current repository state, open pull requests, issues, and CI before changing files.
2. Select one complete vertical slice from `docs/exec-planning.md`.
3. Document acceptance criteria, security boundaries, contracts, failure handling, and rollback.
4. Implement the slice end to end without partial wiring.
5. Run all applicable validation and record exact evidence.
6. Update `README.md`, `ROADMAP.md`, `docs/FEATURE-MATRIX.md`, and `CHANGELOG.md` when status changes.
7. Open one pull request for the slice and do not start the next slice until it is merged.

## Engineering constraints

- Browser and CLI clients must never receive provider credentials.
- External provider SDKs remain behind server-side adapters.
- Every tenant-owned query and mutation is scoped by `workspace_id`.
- High-impact external actions require authorization, grants, approval policy, idempotency, and audit.
- Background work must be retryable, cancellable, observable, and safe under at-least-once delivery.
- Model output, webhook payloads, uploads, and external content are untrusted inputs.
- Prefer stable contracts and modular boundaries over provider-specific shortcuts.
- Do not introduce microservices without an explicit ADR and demonstrated need.

## Quality gates

A pull request is not complete until formatting, linting, type checking, unit tests, integration tests, tenant-isolation tests, and relevant security checks pass. Skipped checks require a written reason and follow-up issue.

## Documentation truthfulness

Use status labels from `docs/FEATURE-MATRIX.md`. Planned capabilities must not be described as available. Clearly distinguish mock, sandbox, beta, and production integrations.
