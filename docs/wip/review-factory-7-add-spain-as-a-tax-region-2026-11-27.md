## Review: Add Spain as a tax region
Date: 2026-11-27
Reviewer: orbit-factory
Related issue: #7

## Summary
Approve. The diff is one new `ES: 21` entry in `RATES`, one row in the pricing-rules Tax table, and three appended tests. `npm test` passes (21/21).

## Findings
### Blocking
None.
### Non-blocking
- [ ] No `docs/architecture/` or `docs/decisions/` exist, so constraint and ADR conformance could not be checked.
### Positive observations
- Purely additive; existing tests untouched; unknown and lowercase regions still refused.

## Architecture conformance
- [x] No violations (no constraints declared)
- [x] No new dependency or service

## Requirements coverage
- [x] REQ-1..5 / AC-1..5 addressed and testable

## Sign-off
- [x] All blocking findings resolved
- Reviewer: orbit-factory — 2026-11-27
