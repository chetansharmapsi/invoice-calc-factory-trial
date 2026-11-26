## Review: factory/1-add-bulk-discount
Date: 2026-11-26
Reviewer: factory review stage
Related issue: #1

## Summary
Approve. The change matches REQ-1..REQ-6 and AC-1..AC-6. Discount is computed in `src/discount.js` via `roundCents`, tax is taken on the net amount, `discountCents` is added to the result without renaming existing fields. All 14 tests pass; existing tests are unchanged.

## Findings

### Blocking
None.

### Non-blocking
- [ ] test/invoice.test.js — AC-3 (100005 -> 10001) is covered only at unit level in test/discount.test.js, not through `calculateInvoice`. Acceptable.
- [ ] `docs/architecture/` is absent, so constraint conformance could not be checked.

### Positive observations
- Constants are named and documented; integer-cent math; unknown region still throws on qualifying invoices.

## Architecture conformance
- [x] No violations of declared rules (none declared)
- [x] No new dependency, service or path
- [x] Stays within layer boundaries in CLAUDE.md

## Requirements coverage
- [x] All functional requirements addressed
- [x] Acceptance criteria testable from shipped code

## Sign-off
- [x] All blocking findings resolved
