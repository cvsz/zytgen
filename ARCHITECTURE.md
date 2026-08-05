# Architecture

## 1. Architectural goals

`zytgen` must support multi-tenant content operations, long-running AI/media jobs, external platform integrations, human approval, and complete auditability. The design optimizes for security, delivery speed, operational clarity, and later service extraction.

## 2. System style

The initial implementation is a **modular monolith plus workers**:

- one deployable API/BFF with strict module boundaries;
- one or more independently scalable worker processes;
- PostgreSQL as the transactional source of truth;
- an outbox relay for reliable event publication;
- a durable queue for asynchronous execution;
- S3-compatible object storage for media and generated artifacts;
- OpenTelemetry-compatible logs, metrics, and traces.

This avoids premature distributed-system complexity while preserving event-driven contracts.

## 3. Bounded contexts

| Context | Responsibilities |
|---|---|
| Identity & Tenancy | users, organizations, workspaces, membership, RBAC, service accounts |
| Brand & Knowledge | brand profile, tone, products, policies, reusable knowledge sources |
| Content | ideas, briefs, scripts, assets, versions, lifecycle and approval |
| Campaigns | objectives, channels, budgets, attribution windows and KPIs |
| AI Orchestration | model routing, prompt templates, jobs, tool grants, evaluations, cost records |
| Intelligence | trends, competitors, hook extraction, content gaps and recommendations |
| Publishing | channel accounts, schedules, publication attempts, retries and reconciliation |
| Analytics | metric ingestion, normalization, aggregates, attribution and reports |
| Conversations | inbound messages, suggested replies, qualification, escalation and handoff |
| Platform Operations | audit, quotas, billing boundary, feature flags, observability and retention |

## 4. Request and job flow

```text
Client request
  -> API authentication and authorization
  -> command validation
  -> transaction writes domain state + outbox event
  -> outbox relay publishes job/event
  -> worker claims job with lease
  -> worker executes through provider/connector adapter
  -> result persisted idempotently
  -> audit event + metrics + status notification
```

No browser or mobile client receives provider secrets. All external calls are server-side.

## 5. Core data model

Every tenant-owned record includes `workspace_id`. High-value entities use immutable identifiers and optimistic concurrency.

Principal entities:

- `users`, `organizations`, `workspaces`, `memberships`, `roles`;
- `brands`, `knowledge_sources`, `products`;
- `content_items`, `content_versions`, `assets`, `approval_requests`;
- `campaigns`, `channel_accounts`, `publication_jobs`, `publication_attempts`;
- `ai_jobs`, `tool_grants`, `provider_usage_records`;
- `trend_signals`, `competitor_profiles`, `hook_entries`;
- `metric_events`, `metric_daily`, `attribution_events`;
- `conversations`, `messages`, `sales_leads`, `handoffs`;
- `audit_events`, `outbox_events`, `idempotency_keys`.

## 6. Security architecture

- OAuth/OIDC for users; short-lived sessions and rotating refresh tokens.
- Workspace-scoped authorization enforced in application services and repository queries.
- Envelope encryption for connector credentials and sensitive configuration.
- Central secret manager; no secrets in source, logs, URLs, or client bundles.
- Approval policy for publishing, ad-spend changes, outbound messages, deletion, and account linking.
- Immutable audit trail for privileged and external side effects.
- Signed webhook verification, replay protection, rate limits, and connector-specific scopes.

## 7. Reliability model

- At-least-once delivery with idempotent handlers.
- Exponential backoff with jitter and connector-aware retry classification.
- Dead-letter queues and operator replay tools.
- Lease-based workers with heartbeat and cancellation checkpoints.
- Outbox/inbox patterns for cross-boundary consistency.
- Reconciliation jobs compare local state against external platforms.

## 8. AI orchestration

AI providers implement internal interfaces for text, structured output, embeddings, image, audio, and video capabilities. Routing considers capability, policy, cost, latency, quality tier, tenant preference, and provider health.

Every AI job records:

- normalized request and schema version;
- provider/model selected and fallback chain;
- prompt/template revision;
- input/output artifact references;
- token/media usage and estimated cost;
- safety and policy decisions;
- evaluation results and human feedback.

## 9. API design

- Versioned HTTP API for synchronous commands and queries.
- Server-sent events or WebSocket for job progress where needed.
- Webhooks for outbound event delivery with signing and retry.
- JSON Schema/OpenAPI contracts generated from shared schemas.
- Cursor pagination and explicit idempotency keys for mutating endpoints.

## 10. Deployment topology

Initial production topology:

```text
CDN/WAF
  -> Web app
  -> API/BFF replicas
  -> PostgreSQL primary + backups
  -> Redis-compatible queue/cache
  -> Worker pools by workload class
  -> S3-compatible object storage
  -> Observability backend
```

Media rendering runs in isolated workers with CPU/GPU and filesystem limits. Connector jobs run separately from untrusted or resource-intensive generation jobs.

## 11. Evolution triggers

Extract a module into a service only when one or more are demonstrated:

- materially different scaling profile;
- independent failure or security boundary;
- separate deployment cadence;
- sustained team ownership boundary;
- database contention that cannot be solved within the modular monolith.
