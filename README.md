# zytgen — AI Content Operations Platform

`zytgen` is evolving from a YouTube channel generator into a production-grade, multi-channel AI Content Operations platform. The product unifies content research, ideation, scripting, asset generation, approval, scheduling, publishing, analytics, and sales-assisted conversations in one workspace.

> Project status: repository and CI foundation. Product workflows, external platform integrations, and automated publishing are not yet production-ready.

## Product vision

Build a secure Content OS for creators, brands, agencies, and commerce teams that can:

- discover trends, competitors, and content gaps;
- generate hooks, briefs, scripts, captions, thumbnails, voice, and video assets;
- manage reusable brand knowledge and campaign context;
- route high-impact actions through human approval;
- schedule and publish to YouTube, TikTok, Instagram, and LinkedIn;
- measure reach, conversion, revenue, CPA, and ROAS;
- connect content activity to chatbot-assisted lead qualification and sales.

## Core capabilities

| Domain | Initial capabilities |
|---|---|
| Content workspace | Ideas, briefs, scripts, assets, versions, approvals |
| AI orchestration | Provider-neutral model routing, prompts, jobs, evaluations |
| Intelligence | Trend monitoring, competitor tracking, hook vault, content gaps |
| Publishing | Calendar, scheduler, channel adapters, retries, audit trail |
| Analytics | Content metrics, campaign attribution, conversion and revenue views |
| Sales automation | Inbox ingestion, suggested replies, qualification and handoff |
| Platform | Multi-tenant workspaces, RBAC, quotas, secrets, audit and observability |

## Repository foundation

The current scaffold uses a pnpm workspace and Turborepo to coordinate independently buildable components:

```text
apps/
  web/                 # static dashboard shell for foundation validation
  api/                 # API/BFF package boundary
  worker/              # durable-worker package boundary
packages/
  contracts/           # shared typed contracts
scripts/               # repository automation and policy checks
docs/validation/       # slice validation records
```

Each workspace exposes `build`, `lint`, `typecheck`, and `test` commands. Root commands run the same quality gates locally and in GitHub Actions.

## Bootstrap

Prerequisites:

- Node.js 24 LTS;
- pnpm 11.20 or newer within major version 11.

```bash
corepack enable
pnpm install --no-frozen-lockfile
pnpm check
pnpm security:audit
```

The repository does not yet commit a generated lockfile. Tool versions are pinned, and CI intentionally uses `--no-frozen-lockfile` until a registry-backed install records the initial lockfile.

## Architecture direction

The platform starts as a modular monolith with durable background workers and explicit domain boundaries. It can later split high-throughput workloads into services without changing external contracts.

```text
Web / API clients
        |
API Gateway + BFF
        |
Application modules
  |-- Identity & tenancy
  |-- Content & campaigns
  |-- AI orchestration
  |-- Intelligence
  |-- Publishing
  |-- Analytics
  |-- Conversations
        |
PostgreSQL + Outbox + Queue + Object Storage + Search/Vector Index
        |
Workers and external platform adapters
```

See [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), [docs/exec-planning.md](docs/exec-planning.md), and [docs/validation/slice-001.md](docs/validation/slice-001.md).

## Delivery principles

1. Provider credentials never reach browser clients.
2. Mutating external actions require explicit grants and, where configured, approval.
3. Jobs are idempotent, retryable, cancellable, observable, and auditable.
4. Connectors are isolated behind stable internal interfaces.
5. No feature is marked complete without validation evidence.
6. Each pull request delivers one complete vertical slice.

## Current milestone

**Foundation:** Slice 001 establishes the repository workspace, quality gates, CI, dependency auditing, secret scanning, and contribution conventions. Slice 002 adds typed runtime configuration, structured logging, request IDs, and health/readiness behavior.

## License

MIT — see [LICENSE](LICENSE).
