## Summary
Verifies that region `DE` is accepted at 19% tax, that unlisted regions are still refused as before, that the business rules document lists Germany, and that existing behaviour for `IN`, `UK`, `US` is unchanged. The ticket is a one-entry table change, so the plan is small and fully automatable except one document check.

## Scope
In scope: `DE` acceptance and rate, the 10000-cent example, half-up rounding at 19%, refusal of unlisted regions (`FR`, lowercase `de`), the Tax table in `docs/domain/pricing-rules.md`, regression of existing tests.
Out of scope: any other country, any rounding change, reduced German VAT rates, case-insensitive region codes.

## Test cases

### Happy path
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-01 | `DE` accepted, 10000-cent invoice | `calculateInvoice({region:'DE', lines:[1 x 10000]})` | No throw; subtotal 10000, `taxCents` 1900, `totalCents` 11900 | Yes (`DE is taxed at 19%`) |
| TC-02 | Existing regions unchanged | Run existing tests for `IN`/`UK`/`US`/no region | All pass, test file only had additions | Yes (tests 1-3) |

### Edge cases
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-10 | Half-up rounding at 19% | `DE`, one line of 50 cents | tax 9.5 -> 10, total 60 | Yes (`DE tax is rounded half up`) |
| TC-11 | Lowercase `de` | `region:'de'` | Throws `Unknown tax region: de` | Yes (`lowercase de is still refused`) |

### Failure / error paths
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-20 | Unlisted region refused | `region:'FR'` | Throws `Unknown tax region: FR` | Yes (existing `an unknown region is an error, not zero tax`) |
| TC-21 | Invalid lines still rejected | Existing invalid-line cases | Same errors as before | Yes (existing test 5) |

## Acceptance criteria coverage
| Criterion | TC ID | Status |
|-----------|-------|--------|
| AC-1: `DE` accepted at 19% | TC-01 | Covered, passing |
| AC-2: 10000 -> tax 1900, total 11900 | TC-01 | Covered, passing |
| AC-3: unlisted regions refused as today | TC-20, TC-11 | Covered, passing |
| AC-4: rules document lists Germany | Manual M-1 | Covered, verified (row `\| DE \| 19% \|` at line 25) |
| AC-5: existing tests pass unchanged | TC-02, TC-21 | Covered, passing (git diff shows additions only) |

## Test run
`npm test`: 9 tests, 9 pass, 0 fail (6 existing + 3 new).

## Manual test checklist
- [x] M-1: `docs/domain/pricing-rules.md` Tax table contains `DE | 19%` (checked by reading the file).

## Known risks
- Doc/code agreement is not machine-checked; a future rate change could update one and not the other.
- Rate correctness (19%) rests on the ticket; the billing team owns the rule.

## Sign-off
- [x] All acceptance criteria covered
- [x] Edge cases documented
- [x] Manual checklist reviewed
- QA: automated (factory test stage) — 2026-11-26
