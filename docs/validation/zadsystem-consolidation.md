# zadsystem consolidation validation

## Scope

Consolidate the reusable advertising-intelligence domain from `cvsz/zadsystem` into
`cvsz/zytgen` without importing insecure demo infrastructure or simulated performance data.

## Acceptance criteria

- [x] typed ad records include source provider and observation time;
- [x] Meta Ad Library is represented behind a provider port;
- [x] winning-pattern analysis is deterministic;
- [x] angle-gap output is stable and catalog ordered;
- [x] the 20 creative angles are retained;
- [x] creative plans require human approval and evidence for claims;
- [x] no random CTR, ROAS, confidence, or campaign metrics are emitted;
- [x] no credentials or production side effects are introduced;
- [x] migration and repository-retirement decision are documented.

## Local validation

Executed against the new package before publication:

```text
tsc -p packages/ads-intelligence/tsconfig.build.json
node --test packages/ads-intelligence/test/*.test.mjs
```

Result: three tests passed covering pattern analysis, angle gaps, and the 20-item creative plan.

## Security boundary

This slice does not call Meta, OpenAI, or any external provider. It adds only contracts and
pure deterministic domain functions. Provider credentials remain outside browser and package
code. Live connectors, authentication, tenancy, rate limiting, storage, and jobs remain planned.

## Rollback

Revert the consolidation commit. No database, external account, credential, webhook, or remote
platform state is created by this slice.
