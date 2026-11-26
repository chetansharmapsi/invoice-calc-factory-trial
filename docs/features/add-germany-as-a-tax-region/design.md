# Design: Add Germany as a tax region

Status: Designed — ready for /build
Requirements: `requirements.md` (REQ-1..5, AC-1..5)

## Impact analysis
No `docs/wip/analysis-*.md` report exists. The change is additive: one new accepted value in the
`RATES` table. No existing region, function signature or result shape changes. The consumer check in
`requirements.md` found `calculateInvoice` as the only caller of `taxFor`, and it needs no change.
Related open-story and board checks skipped (board type `none`, no board access).
No `docs/architecture/` documents exist; single library, no service boundaries involved.

## Decisions

### 1. Where the rate lives
Options: (a) add `DE: 19` to `RATES` in `src/tax.js`; (b) a separate config or data file.
Chosen: (a). It matches the existing pattern, needs no new structure, and keeps one table that
`taxFor` already reads. (b) adds indirection for a single row.

### 2. Calculation and error path
No change. `taxFor` computes `roundCents((netCents * 19) / 100)`; 10000 gives exactly 1900, so
`totalCents` is 11900. Unknown regions still throw `Unknown tax region: <code>`. Matching stays exact
and case-sensitive, so `de` is refused as today (requirements, Out of scope). Rounding is untouched.

### 3. Test placement
Options: (a) append to `test/invoice.test.js`; (b) new file `test/tax.test.js`.
Chosen: (b). "Existing tests pass unchanged" is then true literally, because the existing file is not
edited. Not irreversible; no ADR needed.

### 4. Documentation
Add a `| DE | 19% |` row to the Tax table in `docs/domain/pricing-rules.md`. The ticket's acceptance
criteria name this change. No other edit to that document.

## Build tasks
1. `src/tax.js`: `RATES = { IN: 18, UK: 20, US: 0, DE: 19 }`.
2. `docs/domain/pricing-rules.md`: add the DE row after US.
3. `test/tax.test.js` (`node:test`):
   - `taxFor(10000, 'DE')` is 1900 (AC-1).
   - `calculateInvoice` with subtotal 10000 and region `DE` gives `taxCents` 1900 and `totalCents` 11900 (AC-2). Build the input in the shape the existing tests in `test/invoice.test.js` use.
   - Region `FR` throws `Unknown tax region: FR`; lowercase `de` also throws (AC-3).
   - IN, UK, US still produce 18%, 20% and 0% on 10000 cents (AC-5).
4. Run `npm test`; all existing tests must pass unchanged.

## Risks
- Low. A wrong rate would mis-tax German invoices; the 19% comes from the ticket and the requester is
  taken to speak for the billing team (requirements, Context).

## Open questions
None.
