# Product Scope

## Primary users

- creators operating one or more channels;
- brand and commerce content teams;
- agencies managing multiple client workspaces;
- operators responsible for publishing, analytics, and customer conversations.

## Primary jobs to be done

1. Convert trends, audience needs, and campaign goals into a prioritized content plan.
2. Produce on-brand, platform-ready content faster without losing editorial control.
3. Coordinate review, approval, scheduling, and publishing across channels.
4. Understand which content contributes to reach, leads, conversion, and revenue.
5. Respond to content-driven inquiries consistently and escalate when human judgment is required.

## MVP scope

The first usable release focuses on:

- secure multi-tenant workspaces and RBAC;
- brand profile and reusable knowledge;
- content ideas, briefs, scripts, assets, versions, and approvals;
- provider-neutral AI text generation;
- durable job execution and auditability;
- content calendar;
- one production-grade publishing connector, starting with YouTube;
- baseline analytics ingestion and content performance dashboard.

## Post-MVP scope

- TikTok, Instagram, and LinkedIn publishing;
- trend and competitor intelligence;
- image, voice, and video generation pipelines;
- campaign attribution and executive recommendations;
- unified inbox, sales assistance, and CRM/commerce adapters;
- billing, quotas, marketplace, and advanced agency controls.

## Explicit non-goals for the foundation release

- fully autonomous publishing without policy and approval controls;
- automatic ad-spend changes without explicit authorization;
- bypassing platform APIs, scraping restrictions, or account security controls;
- promising exact revenue attribution where source data does not support it;
- storing raw provider credentials in client applications;
- building separate microservices before scaling or security evidence requires them.

## Product principles

- **Human accountable:** AI proposes; policy and approved operators control consequential actions.
- **Evidence over claims:** recommendations expose source, freshness, score inputs, and uncertainty.
- **Tenant safe by default:** every access path is workspace-scoped and tested negatively.
- **Operationally honest:** UI distinguishes queued, processing, partially complete, failed, and reconciled states.
- **Portable:** model and platform providers are adapters, not the product core.
- **Measurable:** each major workflow emits business, reliability, and cost signals.

## Success metrics

- time from idea to approved content;
- approval-cycle duration and revision count;
- publishing success rate and duplicate-publication rate;
- AI job success, fallback, latency, and cost per accepted output;
- weekly active workspaces and completed content workflows;
- content performance lift versus workspace baseline;
- lead response time, qualification rate, and human handoff rate;
- security, privacy, and cross-tenant incident count.
