# Bulk discount — Test plan

Ticket: 1 · Requirements: `requirements.md` · Design: `design.md`

## Summary
`calculateInvoice` now applies a fixed 10% discount to subtotals of 100000 cents or more, computes
tax on the discounted amount, and reports `discountCents` on every result. This plan checks that
the numbers match the acceptance criteria, that invoices below the threshold are unchanged, and
that existing behaviour (validation, unknown-region refusal, public result shape) still holds.
A wrong number here reaches customers on invoices, so boundaries and rounding are covered explicitly.

## Scope
In scope: `src/discount.js` (`bulkDiscountFor`), `calculateInvoice` in `src/index.js`, the result
shape, regression of existing tests.
Out of scope: coupons, per-customer or per-line discounts, configurable threshold/rate, changes to
tax rates or line totals, and the other repos' tools that import the library (not searched).
Library only: no UI, so there is no manual UI testing.

## Test cases

### Happy path
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-01 | Subtotal exactly at threshold, US | `calculateInvoice` region US, subtotal 100000 | subtotal 100000, discount 10000, tax 0, total 90000 | Yes (`AC-1`) |
| TC-02 | Above threshold, taxed region UK | region UK, subtotal 150000 | discount 15000, tax 27000, total 162000 | Yes (`AC-2`) |
| TC-03 | `bulkDiscountFor` below / at / above | call with 99999, 100000, 150000 | 0, 10000, 15000 | Yes |
| TC-04 | Below threshold, IN | region IN, subtotal 99999 | discount 0, tax 18000, total 117999 | Yes (`AC-4 / AC-5`) |
| TC-05 | Existing behaviour unchanged | run the pre-existing `test/invoice.test.js` unmodified | all pass | Yes |

### Edge cases
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-10 | Half-cent rounds up | subtotal 100005 (`bulkDiscountFor` and via invoice) | discount 10001 | Yes (`bulkDiscountFor: rounds half up`, `AC-3`) |
| TC-11 | `subtotalCents` stays pre-discount (REQ-6) | any discounted invoice | subtotal equals sum of line totals | Yes (TC-01 asserts 100000) |
| TC-12 | Threshold inclusive, one cent under | subtotal 99999 | discount 0 | Yes (TC-03, TC-04) |
| TC-13 | Discount is a whole number, never negative, at most 10% of subtotal | inspect discount for several subtotals | integer, 0 <= d <= subtotal | Partly: asserted by exact values; no property-style check |
| TC-14 | Subtotal reached by several lines | two lines summing to 100000 | discount applied to the sum, not per line | No existing test — gap, recommend adding |
| TC-15 | Discounted invoice, rounding of tax on net | UK/IN with net not a multiple of 5 | tax rounded half up on net | No existing test — gap, recommend adding |

### Failure / error paths
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-20 | Unknown region on discounted invoice | region XX, subtotal 200000 | throws `Unknown tax region` | Yes |
| TC-21 | Unknown region below threshold | region FR, 100 | throws (existing) | Yes (existing) |
| TC-22 | Invalid lines / empty invoice | zero quantity, fractional price, blank description, no lines | throws as before | Yes (existing) |

## Acceptance criteria coverage
| Criterion | TC ID | Status |
|-----------|-------|--------|
| AC-1 | TC-01 | Covered, passing |
| AC-2 | TC-02 | Covered, passing |
| AC-3 | TC-10 | Covered, passing |
| AC-4 | TC-04 | Covered, passing |
| AC-5 | TC-04 | Covered, passing (also TC-01 shows field present when discounted) |
| AC-6 | TC-05 | Covered: `test/invoice.test.js` unchanged since the initial commit; passing |

## Manual test checklist
None: the library has no UI or deployment. Billing-tool owners should compare totals in their own
tools after upgrading (outside this repo).
- [ ] After release, a consuming tool compares one large invoice against `calculateInvoice` output.

## Known risks
- Consumers in other repos were not searched; `taxCents` and `totalCents` change for subtotals
  >= 100000. That is intended but affects stored or compared values downstream.
- TC-14 and TC-15 are not covered by current tests; the acceptance criteria do not require them.

## Execution result
`npm test` on 2026-11-26: 13 tests, 13 pass, 0 fail.

## Sign-off
- [x] All acceptance criteria covered
- [x] Edge cases documented
- [x] Manual checklist reviewed
- QA: factory test stage — 2026-11-26
