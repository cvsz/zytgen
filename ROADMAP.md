# Roadmap

This roadmap is outcome-based. Dates are intentionally omitted until team capacity, launch market, and integration approval timelines are confirmed.

## Phase 0 — Product and architecture foundation

**Outcome:** the repository has an executable plan and stable boundaries.

- [x] define personas, jobs-to-be-done, product scope, and non-goals;
- [x] approve architecture, security model, and domain boundaries;
- [x] define repository structure and implementation sequence;
- [x] establish coding standards, CI quality gates, dependency audit, and secret scanning;
- [x] consolidate `zadsystem` domain concepts into a typed, deterministic Ads Intelligence package;
- [ ] add typed runtime configuration, structured logging, health/readiness, and local infrastructure test environment;
- [x] record the initial dependency lockfile from a registry-backed install;
- [ ] add ADRs for material technology and infrastructure choices.

**Done when:** a new contributor can bootstrap, understand the system, run validation, and implement a vertical slice without inventing architecture.

## Phase 1 — Identity, tenancy, and content workspace

**Outcome:** authenticated teams can manage content safely inside isolated workspaces.

- organizations, workspaces, memberships, RBAC;
- brand profile and reusable knowledge sources;
- content ideas, briefs, scripts, assets, versions, and status lifecycle;
- comments, review requests, approval decisions, and audit events;
- object upload with malware/type/size validation.

**Done when:** cross-tenant access tests pass, all mutations are audited, and content lifecycle works end to end.

## Phase 2 — AI orchestration and generation

**Outcome:** users can run observable, provider-neutral AI jobs with predictable cost and policy controls.

- provider adapters and capability registry;
- prompt/template versioning and structured outputs;
- durable jobs, progress, cancellation, retry, fallback, and idempotency;
- text generation for hooks, briefs, scripts, captions, and repurposing;
- usage/cost accounting, evaluations, and human feedback;
- image/audio/video interfaces behind feature flags.

**Done when:** provider failure and fallback tests pass; credentials remain server-side; job history is reproducible and auditable.

## Phase 3 — Intelligence and planning

**Outcome:** teams can turn external signals into prioritized content plans.

- [x] deterministic ad hook, angle, CTA, gap, and creative-plan domain foundation;
- Meta Ad Library adapter with pagination, retry, rate limits, provenance, and policy controls;
- trend-source ingestion and normalization;
- competitor profile and public-content tracking within platform policies;
- hook vault, tagging, semantic search, and performance context;
- content-gap recommendations and explainable scoring;
- campaign and content calendar views.

**Done when:** every recommendation links to source evidence, score inputs, and freshness metadata.

## Phase 4 — Publishing and channel operations

**Outcome:** approved content can be scheduled and published reliably.

- OAuth account linking and scoped connector credentials;
- YouTube first, then TikTok, Instagram, and LinkedIn adapters;
- schedule, approval gate, publish attempts, retry, reconciliation, and cancellation;
- media validation per platform;
- webhook ingestion and remote-state synchronization.

**Done when:** duplicate publishing is prevented, connector outage recovery is tested, and every side effect has an audit record.

## Phase 5 — Analytics and attribution

**Outcome:** teams understand what content and campaigns produce business results.

- metric ingestion and common metric taxonomy;
- channel, campaign, content, and creator dashboards;
- historical snapshots and anomaly detection;
- conversion/revenue attribution with documented assumptions;
- executive summaries and next-action recommendations.

**Done when:** reports reconcile against sampled platform data and clearly expose freshness and attribution confidence.

## Phase 6 — Conversations and sales assistance

**Outcome:** content-driven conversations can be qualified and handed off without unsafe autonomous behavior.

- supported inbox ingestion;
- unified conversation timeline;
- suggested replies grounded in brand/product knowledge;
- lead qualification, consent, escalation, and human takeover;
- optional auto-send for low-risk, policy-approved scenarios;
- commerce/CRM adapter boundary.

**Done when:** outbound policies, opt-out handling, escalation, and transcript audit tests pass.

## Phase 7 — Production hardening and commercial platform

**Outcome:** the service is operable, measurable, and ready for paying tenants.

- quotas, plans, entitlements, usage ledger, and billing boundary;
- SLOs, dashboards, alerts, backups, restore drills, and incident runbooks;
- regional/privacy controls, retention, export, and deletion workflows;
- performance, load, chaos, and disaster-recovery tests;
- admin/operator tooling and customer support diagnostics.

**Done when:** launch checklist, threat model, privacy review, restore evidence, and production readiness review are approved.

## Release strategy

- one vertical slice per pull request;
- feature flags for incomplete or risky integrations;
- trunk remains deployable;
- schema changes are backward compatible and reversible;
- no phase advances while required quality gates are red.
