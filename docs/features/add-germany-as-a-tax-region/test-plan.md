## Summary
Germany (`DE`, 19%) is added as a tax region so invoices for German customers are no longer refused and no longer taxed at the UK rate (20%). This plan checks that `DE` is accepted at 19%, that unknown regions are still refused, that IN/UK/US are unchanged, and that the business rules document lists Germany.

## Scope
In scope: `taxFor` and `calculateInvoice` for `DE`; refusal of unlisted regions; unchanged IN/UK/US; the Tax table in `docs/domain/pricing-rules.md`; existing tests unchanged.
Out of scope: any other country, any change to rounding, case-insensitive region codes, the bulk-discount feature.

## Test cases

### Happy path
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-01 | `DE` accepted at 19% | `taxFor(10000, 'DE')` | 1900, no throw (`test/tax.test.js`: "DE is accepted at 19%") | Yes |
| TC-02 | Invoice example | `calculateInvoice` region `DE`, one line 10000 cents | subtotal 10000, `taxCents` 1900, `totalCents` 11900 | Yes |
| TC-03 | Existing regions unchanged | `taxFor(10000, ...)` for IN, UK, US | 1800, 2000, 0 | Yes |
| TC-04 | Existing tests unchanged | `npm test`; `test/invoice.test.js` has no diff against the base commit | All pass | Yes |

### Edge cases
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-10 | Half-up rounding for `DE` | Subtotal 1050 cents (tax 199.5) | `taxCents` 200 (run once as an ad hoc check; rounding is unchanged and covered by existing rounding tests) | No (ad hoc) |
| TC-11 | Lowercase `de` | `taxFor(10000, 'de')` | Throws `Unknown tax region: de` | Yes |

### Failure / error paths
| ID | Scenario | Steps | Expected result | Automated? |
|----|----------|-------|-----------------|------------|
| TC-20 | Unlisted region via `taxFor` | `taxFor(10000, 'FR')` | Throws `Unknown tax region: FR` | Yes |
| TC-21 | Unlisted region via `calculateInvoice` | Invoice with region `FR` | Throws `Unknown tax region: FR`; no partial result (ad hoc check) | No (ad hoc) |

## Acceptance criteria coverage
| Criterion | TC ID | Status |
|-----------|-------|--------|
| AC-1: `DE` accepted at 19% | TC-01 | Covered |
| AC-2: 10000 cents `DE` gives tax 1900, total 11900 | TC-02 | Covered |
| AC-3: Unlisted regions refused as today | TC-20, TC-11, TC-21 | Covered |
| AC-4: Rules document lists Germany at 19% | Manual check, below | Covered (manual) |
| AC-5: Existing tests unchanged and passing; IN/UK/US unchanged | TC-03, TC-04 | Covered |

## Manual test checklist
- [x] `docs/domain/pricing-rules.md` Tax table contains `| DE | 19% |` (verified).
- [x] Ad hoc: `DE` with 1050 cents gives tax 200; `FR` through `calculateInvoice` throws `Unknown tax region: FR`.

## Known risks
- Callers that pass lowercase `de` are still refused (by design, as today).
- Code-and-document drift: the rate lives in both `src/tax.js` and the rules document, with no automated link between them.

## Test run
`npm test`: 10 tests, 10 pass, 0 fail.

## Sign-off
- [x] All acceptance criteria covered
- [x] Edge cases documented
- [x] Manual checklist reviewed
- QA: orbit-factory (automated) — 2026-11-26
