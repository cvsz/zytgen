# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and the project will use semantic versioning after the first release.

## [Unreleased]

### Added

- Typed `@zytgen/ads-intelligence` package consolidated from the reusable domain concepts in `cvsz/zadsystem`.
- Source-backed ad records and a Meta Ad Library connector port.
- Deterministic hook, angle, CTA, and brand-versus-competitor gap analysis.
- Twenty-angle creative planning catalog with human approval and claim-evidence requirements.
- Consolidation decision and validation records for retiring the standalone `zadsystem` repository.
- pnpm monorepo with web, API/BFF, worker, and shared-contract package boundaries.
- Shared TypeScript compiler baseline and independently buildable workspace packages.
- ESLint, Prettier, type-check, build, and Node test-runner quality gates.
- GitHub Actions workflows for quality, dependency audit, and secret scanning.
- Dependabot configuration, pull-request template, and Conventional Commit title validation.
- Slice 001 validation record with acceptance criteria, security boundary, rollback, and deferred scope.
- Product vision for a multi-channel AI Content Operations platform.
- Modular-monolith and worker architecture baseline.
- Outcome-based product roadmap and implementation sequence.
- Product scope, explicit non-goals, and success metrics.
- Feature matrix with evidence-based status transitions.
- Security engineering baseline for tenancy, credentials, external actions, AI workloads, webhooks, uploads, privacy, and supply chain.
- Contributor instructions for one complete vertical slice per pull request.

### Changed

- Designated `zytgen` as the surviving platform repository and `zadsystem` as a retired source prototype after consolidation.
- Removed random performance metrics and unsupported claims from the migrated Ads Intelligence design.
- Advanced the repository status from documentation-only planning to a buildable repository/CI foundation.
- Expanded the repository purpose from a YouTube-only generator to the broader `zytgen` Content OS while retaining YouTube as the first publishing connector.
