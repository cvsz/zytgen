# Feature Matrix

Status values: `planned`, `foundation`, `in-progress`, `beta`, `production`.

| Domain | Capability | Status | Target phase | Completion evidence |
|---|---|---:|---:|---|
| Platform | Repository/CI scaffold | planned | 0 | local bootstrap and green CI |
| Platform | Typed configuration and health | planned | 0 | startup validation and readiness tests |
| Identity | Organizations and workspaces | planned | 1 | CRUD, membership and isolation tests |
| Identity | RBAC and service accounts | planned | 1 | policy matrix and negative authorization tests |
| Brand | Brand profile and knowledge | planned | 1 | versioned knowledge sources and retrieval tests |
| Content | Ideas, briefs and scripts | planned | 1 | end-to-end lifecycle tests |
| Content | Asset storage and versions | planned | 1 | upload validation and immutable history |
| Governance | Review and approvals | planned | 1 | stale/unauthorized decision tests |
| AI | Provider capability registry | planned | 2 | adapter contract test suite |
| AI | Text generation and structured output | planned | 2 | deterministic and production adapter tests |
| AI | Durable jobs and fallback | planned | 2 | retry, cancel, idempotency and outage tests |
| AI | Image/audio/video generation | planned | 2+ | workload-specific validation and policy gates |
| Intelligence | Trend ingestion | planned | 3 | source/freshness provenance tests |
| Intelligence | Competitor tracking | planned | 3 | policy-compliant source adapters |
| Intelligence | Hook vault and content gaps | planned | 3 | explainable scoring and search tests |
| Planning | Campaign and content calendar | planned | 3 | multi-channel planning workflow |
| Publishing | YouTube connector | planned | 4 | sandbox/live reconciliation evidence |
| Publishing | TikTok connector | planned | 4 | platform approval and connector tests |
| Publishing | Instagram connector | planned | 4 | platform approval and connector tests |
| Publishing | LinkedIn connector | planned | 4 | platform approval and connector tests |
| Analytics | Metric ingestion and normalization | planned | 5 | sampled reconciliation report |
| Analytics | Content/campaign dashboard | planned | 5 | freshness and attribution labels |
| Conversations | Unified inbox | planned | 6 | supported-channel ingestion tests |
| Conversations | Suggested replies and handoff | planned | 6 | grounding, opt-out and escalation tests |
| Commerce | CRM/commerce adapter boundary | planned | 6 | contract and idempotency tests |
| Commercial | Quotas, entitlements and usage | planned | 7 | ledger reconciliation tests |
| Operations | SLOs, alerts, backups and restore | planned | 7 | production readiness evidence |
| Privacy | Export, retention and deletion | planned | 7 | end-to-end privacy workflow tests |

A capability may only advance in status when its evidence is linked from a merged pull request or release record.
