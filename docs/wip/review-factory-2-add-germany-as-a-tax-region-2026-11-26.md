## Review: Add Germany as a tax region
Date: 2026-11-26
Reviewer: factory review stage
Related issue: #2

## Summary
Approve. One-entry change to `RATES` in `src/tax.js`, matching the new row in `docs/domain/pricing-rules.md`. Tests cover DE, the 10000 → 1900/11900 example, refusal of unknown and lowercase regions, and unchanged IN/UK/US. All 10 tests pass.

## Findings
### Blocking
None.
### Non-blocking
None.
### Positive observations
- Minimal diff; rounding untouched; unknown-region error path unchanged (own-property check).

## Architecture conformance
- No docs/architecture or ADRs exist; no conflicts. No new dependencies or layers.

## Requirements coverage
- All acceptance criteria addressed and tested; existing tests unchanged.

## Sign-off
- All blocking findings resolved (none raised)
