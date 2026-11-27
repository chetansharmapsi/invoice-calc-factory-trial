# Design: Add Spain as a tax region

Status: Designed — ready for /build
Requirements: `requirements.md` (REQ-1..5, AC-1..5)

## Impact analysis
No `docs/wip/analysis-*.md` report exists. No shared-interface change detected — skipping analysis:
the change is purely additive (one new accepted value in the `RATES` table). No existing region,
function signature or result shape changes. The consumer check in `requirements.md` found
`calculateInvoice` as the only caller of `taxFor`; it needs no change.
Related open-story and board checks skipped (no board access in this unattended session).
No `docs/architecture/` documents exist; single library, no service boundaries involved.

## Decisions

### 1. Where the rate lives
Options: (a) add `ES: 21` to `RATES` in `src/tax.js`; (b) a separate config or data file.
Chosen: (a). Same pattern as IN/UK/US/DE, no new structure. Reversible; no ADR.

### 2. Calculation and error path
No change. `taxFor` computes `roundCents((netCents * 21) / 100)`; 10000 gives exactly 2100, so
`totalCents` is 12100. Unknown regions still throw `Unknown tax region: <code>`. Matching stays
exact and case-sensitive, so `es` is refused as today. Rounding is untouched.

### 3. Test placement
Options: (a) new file `test/spain.test.js`; (b) append ES tests to `test/tax.test.js`, which already
holds the per-region tax tests.
Chosen: (b), append only. Existing tests in the file are not edited, so "existing tests pass
unchanged" holds. Not irreversible; no ADR.

### 4. Documentation
Add a `| ES | 21% |` row to the Tax table in `docs/domain/pricing-rules.md` after DE. The ticket's
acceptance criteria name this change. No other edit to that document.

## Build tasks
1. `src/tax.js`: `RATES = { IN: 18, UK: 20, US: 0, DE: 19, ES: 21 }`.
2. `docs/domain/pricing-rules.md`: add the ES row after DE.
3. `test/tax.test.js` (append):
   - `taxFor(10000, 'ES')` is 2100 (AC-1).
   - `calculateInvoice` with one line totalling 10000 and region `ES` gives `taxCents` 2100 and `totalCents` 12100 (AC-2).
   - `FR` still throws `Unknown tax region: FR`; lowercase `es` also throws (AC-3).
   - Existing IN/UK/US/DE tests stay as they are (AC-5).

## Open questions
None.
