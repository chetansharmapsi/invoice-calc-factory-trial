## Summary
Verifies that region `ES` is accepted at 21% tax, that unlisted regions are still refused exactly as before, that the business rules document lists Spain, and that existing behaviour is unchanged. A wrong rate would put a wrong number on customers' invoices.

## Scope
In scope: `taxFor` and `calculateInvoice` for `ES`; refusal of unknown regions; the Tax table in `docs/domain/pricing-rules.md`; regression of existing tests.
Out of scope: any other country, any change to rounding, case-insensitive region codes.

## Test cases

### Happy path
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-01 | ES accepted at 21% | `taxFor(10000, 'ES')` | 2100 (`test/tax.test.js`: "ES is accepted at 21%") | Yes |
| TC-02 | ES invoice end to end | `calculateInvoice` region ES, one line totalling 10000 | subtotal 10000, `taxCents` 2100, `totalCents` 12100 | Yes |
| TC-03 | Docs list Spain | Read Tax table in `docs/domain/pricing-rules.md` | Row `\| ES \| 21% \|` present | No (manual/grep) |

### Edge cases
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-10 | Other regions unchanged | Existing IN/UK/US/DE tests | Pass unchanged | Yes |
| TC-11 | Lowercase `es` | `taxFor(10000, 'es')` | Throws `Unknown tax region: es` | Yes |

### Failure / error paths
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-20 | Unlisted region FR | `taxFor(10000, 'FR')` | Throws `Unknown tax region: FR` (existing test) | Yes |

## Acceptance criteria coverage
| Criterion | TC ID | Status |
|-----------|-------|--------|
| AC-1: ES accepted at 21% | TC-01, TC-02 | Covered |
| AC-2: 10000 cents gives tax 2100, total 12100 | TC-02 | Covered |
| AC-3: Unlisted regions refused as today | TC-20, TC-11 | Covered |
| AC-4: Docs list Spain with its rate | TC-03 | Covered (checked by grep: row present at line 26) |
| AC-5: Existing tests pass unchanged | TC-10 | Covered (existing tests not edited; diff against main is append-only) |

## Manual test checklist
- [x] TC-03: `docs/domain/pricing-rules.md` contains `| ES | 21% |`.

## Known risks
- The 21% rate comes from the ticket; the billing team owns the rule and has not separately confirmed it.
- Case-sensitive matching means `es` is refused; callers must pass uppercase.

## Run result
`npm test`: 21 tests, 21 pass, 0 fail.

## Sign-off
- [x] All acceptance criteria covered
- [x] Edge cases documented
- [x] Manual checklist reviewed
- QA: orbit-factory — 2026-11-27
