# zadsystem consolidation

## Decision

`cvsz/zytgen` is the surviving product repository. The useful domain concepts from
`cvsz/zadsystem` are consolidated into the `@zytgen/ads-intelligence` package.

Source snapshot:

- repository: `cvsz/zadsystem`;
- source commit: `14879cd164a1fd3b5bc124fd99d7315e41f314c7`;
- consolidation type: clean-room domain migration, not a source-tree copy.

## Retained capabilities

- Meta Ad Library connector port and source provenance contracts;
- deterministic hook, angle, and CTA classification;
- winning-pattern summaries without invented performance claims;
- brand-versus-competitor angle-gap analysis;
- the 20-angle creative planning catalog;
- explicit fixture versus observed data modes;
- human approval and evidence requirements for generated creative plans.

## Deliberately excluded

- random CTR, ROAS, confidence, and campaign metrics;
- hard-coded medical, clinical, endorsement, scarcity, and performance claims;
- wildcard credentialed CORS configuration;
- API keys stored in tracked YAML files;
- `__pycache__`, `.pyc`, generated logs, and broken ignore rules;
- mock dashboards that could be mistaken for live analytics;
- provider-specific HTTP code without pagination, rate-limit, retry, and typed errors.

## Repository retirement

After the consolidation pull request is merged and the `main` workflow is green,
`cvsz/zadsystem` may be deleted. The GitHub connector used for this migration does not expose
repository deletion, so deletion must be performed through GitHub repository settings by an
administrator. No deletion should occur before the source commit and migration evidence above
are present on `zytgen/main`.
