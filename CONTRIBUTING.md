# Contributing

## Development model

`main` must remain deployable. Work is delivered through short-lived branches and pull requests containing one complete vertical slice.

## Before coding

- Read `README.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `SECURITY.md`, and `docs/exec-planning.md`.
- Check existing issues, pull requests, and feature status.
- Define acceptance criteria, affected contracts, authorization rules, failure handling, rollout, and rollback.

## Branch and commit conventions

Suggested branch names:

- `feat/<slice-name>`
- `fix/<problem-name>`
- `docs/<topic>`
- `chore/<maintenance>`

Use clear, imperative commit messages. Prefer conventional prefixes such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:`.

## Pull request requirements

Every pull request must include:

- user outcome and bounded scope;
- explicit out-of-scope items;
- architecture/API/schema changes;
- security and tenant-isolation impact;
- failure, retry, cancellation, migration, and rollback behavior;
- validation commands and results;
- documentation, feature-matrix, and changelog updates when applicable.

## Testing expectations

Changes should include the smallest effective combination of:

- unit tests for domain rules;
- contract tests for adapters;
- integration tests for persistence and queues;
- end-to-end tests for user workflows;
- cross-tenant negative tests;
- idempotency, retry, cancellation, and timeout tests;
- security regression tests for high-risk boundaries.

## Review standards

Reviewers evaluate correctness, security, reliability, performance, maintainability, testability, observability, backward compatibility, developer experience, and operational cost.

Do not merge with failing required checks or unresolved review threads.

## Documentation

Documentation is part of the product. Do not mark capabilities as available before implementation evidence exists. Use the status vocabulary in `docs/FEATURE-MATRIX.md`.
