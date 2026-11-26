# Design: Add Germany as a tax region

Status: Designed — ready for /build
Requirements: `requirements.md` (REQ-1..5, AC-1..5)

## Impact analysis
No `docs/wip/analysis-*.md` report exists. The change is purely additive: one entry in the `RATES`
table, which widens the set of accepted region inputs. No field is renamed or removed and the shape
returned by `calculateInvoice` does not change. No shared-interface change detected — skipping
analysis. No `docs/architecture/` documents exist. Related open-story check skipped (no board access).

## Decision: how to add the region
Only one real option exists. Alternatives were considered and rejected:

| Option | Verdict |
|---|---|
| A. Add `DE: 19` to `RATES` in `src/tax.js` | **Chosen.** Smallest change; `taxFor` and `calculateInvoice` already handle any table entry; rounding stays in `roundCents`; unknown-region refusal is untouched. |
| B. Move rates to a config/JSON file | Rejected: out of scope, no need for a second source of truth. |
| C. Normalise region case (accept `de`) | Rejected: requirements REQ-3 / Out of scope keep lowercase refused. |

Not irreversible (a table entry can be removed). No ADR needed.

## Change
- `src/tax.js`: `RATES = { IN: 18, UK: 20, US: 0, DE: 19 }`. No other code change.
- `docs/domain/pricing-rules.md`: add row `| DE | 19% |` to the Tax table (billing team owns the rules).
- `test/invoice.test.js`: add tests only; existing tests unchanged.

## Tests (resolves the open question)
Cover both the exact example and a rounding case; both are cheap and the second guards REQ-2.
1. `DE`, one line of 10000 cents: subtotal 10000, `taxCents` 1900, `totalCents` 11900 (AC-1, AC-2).
2. `DE` half-up rounding: one line of 50 cents → tax 9.5 → 10, total 60 (50×19/100 is exactly 9.5 in
   floating point, so this tests the half-up path through `roundCents`).
3. Lowercase `de` throws `Unknown tax region: de` (REQ-3).
Existing test for `FR` already covers AC-3; existing tests cover AC-5.

## Failure modes
- Unknown region: unchanged, throws `Unknown tax region: <code>`.
- Float risk: `netCents * 19 / 100` is computed as today for other regions; rounding by `roundCents` only.

## Open questions
None.

## Build size
1 source file, 1 doc, 1 test file; about 25 changed lines; no deployable services.
