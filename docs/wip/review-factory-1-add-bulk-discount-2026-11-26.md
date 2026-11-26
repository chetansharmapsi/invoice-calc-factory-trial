## Review: factory/1-add-bulk-discount
Date: 2026-11-26
Reviewer: orbit-factory (automated review stage)
Related issue: #1

## Summary
Approve. The implementation matches REQ-1..6 and AC-1..6, follows the conventions (integer cents, rounding only via `roundCents`, additive result field), and all 13 tests pass, existing tests unchanged.

## Findings

### Blocking
None.

### Non-blocking
- [ ] docs/domain/pricing-rules.md "Discounts" — still says "No discount exists in the product today". Owned by the billing team; not changed here, needs their update.
- [ ] Consumers in other repos were not searched (accepted in requirements); `taxCents`/`totalCents` change for subtotals >= 100000 is intended.

### Positive observations
- `src/discount.js` mirrors `tax.js`; threshold boundary (99999/100000) and half-cent rounding are tested.
- Unknown region still throws on discounted invoices (tested).

## Architecture conformance
- [x] No violations (docs/architecture/ does not exist; no constraints declared)
- [x] No undeclared service or communication path
- [x] No cross-service DB connection
- [x] Stays within layer boundaries
- [x] No ADR conflicts (docs/decisions/ empty)
- [x] No new dependencies

## Requirements coverage
- [x] All functional requirements addressed
- [x] Acceptance criteria testable from shipped code

## Sign-off
- [x] All blocking findings resolved
- Reviewer: orbit-factory — 2026-11-26
