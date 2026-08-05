# zytgen — AI Content Operations Platform

`zytgen` is evolving from a YouTube channel generator into a production-grade, multi-channel AI Content Operations platform. The product unifies content research, ideation, scripting, asset generation, approval, scheduling, publishing, analytics, and sales-assisted conversations in one workspace.

> Project status: architecture and delivery foundation. External platform integrations and automated publishing are not yet production-ready.

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

See [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), and [docs/exec-planning.md](docs/exec-planning.md).

## Delivery principles

1. Provider credentials never reach browser clients.
2. Mutating external actions require explicit grants and, where configured, approval.
3. Jobs are idempotent, retryable, cancellable, observable, and auditable.
4. Connectors are isolated behind stable internal interfaces.
5. No feature is marked complete without validation evidence.
6. Each pull request delivers one complete vertical slice.

## Planned repository layout

```text
apps/
  web/                 # dashboard and workspace UI
  api/                 # public API and BFF
  worker/              # durable background execution
packages/
  contracts/           # schemas and API contracts
  domain/              # domain model and policies
  ai/                  # provider-neutral AI interfaces
  connectors/          # social, commerce, ads, storage adapters
  observability/       # logging, metrics and tracing
infra/
  docker/
  kubernetes/
docs/
  adr/
  runbooks/
```

## Current milestone

**Foundation:** finalize domain boundaries, contracts, security controls, execution plan, and initial project scaffold before implementing external publishing or autonomous actions.

## License

MIT — see [LICENSE](LICENSE).
