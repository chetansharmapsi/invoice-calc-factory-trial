## Summary
Tests that `calculateInvoice` applies the 10% bulk discount at a subtotal of 100000 cents or more, taxes the discounted amount, reports `discountCents` on every invoice, and leaves smaller invoices unchanged. The goal is that every billing tool gets the same total. A wrong number reaches customers on their invoices.

## Scope
In scope: `src/discount.js` (`bulkDiscountFor`), `calculateInvoice` in `src/index.js`, and the existing tests (AC-6).
Out of scope: other discount types, configurable threshold or rate, tax rates, line totals, and the internal tools in other repos that import the library (not reachable from this repo).

## Test cases

### Happy path
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-01 | Exactly at threshold, US (AC-1) | `calculateInvoice` with subtotal 100000, US | discount 10000, tax 0, total 90000 | Yes (`bulk discount: AC-1`) |
| TC-02 | Above threshold, UK, tax after discount (AC-2) | Subtotal 150000, UK | discount 15000, tax 27000, total 162000 | Yes (`bulk discount: AC-2`) |
| TC-03 | Below threshold, IN (AC-4) | Subtotal 99999, IN | discount 0, tax 18000, total 117999 | Yes (`bulk discount: AC-4`) |
| TC-04 | `discountCents` present and 0 without a discount (AC-5) | Small invoice | `discountCents === 0` | Yes (`bulk discount: AC-5`) |

### Edge cases
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-10 | Half-up rounding of the discount (AC-3) | `bulkDiscountFor(100005)` | 10001 | Yes (unit, `rounds half up`) |
| TC-11 | One cent below threshold | `bulkDiscountFor(99999)` | 0 | Yes (unit) |
| TC-12 | Exactly at threshold | `bulkDiscountFor(100000)` | 10000 | Yes (unit) |
| TC-13 | `subtotalCents` stays pre-discount (REQ-6) | Check subtotal in TC-01/TC-02 | 100000 / 150000 | Yes (asserted in TC-01/02) |
| TC-14 | Existing tests unchanged (AC-6) | `git diff main -- test/invoice.test.js` shows additions only; run full suite | No existing test edited, all pass | Yes (suite) plus diff check |

### Failure / error paths
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-20 | Unknown region on a qualifying invoice | Subtotal at or above threshold, region not in table | Throws, no partial result | Yes (`unknown region still throws`) |
| TC-21 | Existing invalid-line / unknown-region errors | Existing tests | Still throw | Yes (existing tests) |

## Acceptance criteria coverage
| Criterion | TC ID | Status |
|-----------|-------|--------|
| AC-1 | TC-01 | Covered |
| AC-2 | TC-02 | Covered |
| AC-3 | TC-10 | Covered at unit level only. No `calculateInvoice` test uses subtotal 100005. Low risk, since `calculateInvoice` calls `bulkDiscountFor` directly |
| AC-4 | TC-03 | Covered |
| AC-5 | TC-04 | Covered |
| AC-6 | TC-14, TC-21 | Covered |

## Manual test checklist
- [ ] None needed: library only, no UI or deployment.
- [ ] Outside this repo: the billing team confirms their tools show the new `taxCents`/`totalCents` for large invoices.

## Known risks
- Importing tools in other repos were not searched. Their `taxCents` and `totalCents` change by design for subtotals of 100000 or more.
- No test covers a discount combined with a taxed region whose tax needs rounding. `taxFor` rounds through `roundCents`, so the risk is low.
- Optional extra case for `/build`: an invoice-level test for AC-3 (subtotal 100005).

## Sign-off
- [x] All acceptance criteria covered (AC-3 at unit level)
- [x] Edge cases documented
- [x] Manual checklist reviewed
- QA: automated run (factory test stage) — 2026-11-26. `npm test`: 14 tests, 14 pass, 0 fail.
