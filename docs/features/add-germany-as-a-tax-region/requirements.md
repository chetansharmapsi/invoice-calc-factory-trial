Status: Groomed — ready for /design

## Epic
Standalone (no `docs/epics/` exist).

## Purpose
The billing team now invoices customers in Germany, but the library refuses region `DE` as unknown, so tool developers pass `UK` and customers are charged 20% instead of 19%. This feature adds Germany as a known tax region at 19% so those invoices are calculated correctly and the workaround can stop.

## Scope
- Add region `DE` with a rate of 19% to the tax rate table in `src/tax.js`.
- Add Germany (`DE`, 19%) to the Tax table in `docs/domain/pricing-rules.md`.
- Add tests in `test/` for `DE` acceptance and the 10000-cent example.

What this does NOT include:
- Any other country or region.
- Any change to rounding (`roundCents` in `src/money.js` is untouched).
- Any change to the unknown-region refusal (`Unknown tax region: <code>` error in `taxFor`) or to the shape returned by `calculateInvoice`.
- The bulk-discount feature (`docs/features/bulk-discount/`).
- Existing regions `IN`, `UK`, `US` and their rates.

## Scenarios in scope
1. A tool developer submits an invoice for region `DE` and receives tax at 19% (e.g. subtotal 10000 → tax 1900, total 11900).
2. A tool developer submits an invoice for a region still not in the table (e.g. `FR`) and it is refused exactly as today.
3. A reader of the business rules document finds Germany and its rate in the tax table.

(Confirmed from the ticket's acceptance criteria and out-of-scope statement; see Context.)

## Consumer check
- Signal: tax rate table `RATES` / accepted region codes
- Classification: Existing — adds an entry to the set of regions `taxFor` accepts, which changes how the region input is gated.
- Override: none
- Search terms: `region`, `Region`, `RATES`, `taxFor`, `tax`, `Unknown tax region`, `UK`, `DE`, `Germany`
- Repos searched: this repo only (single-repo project) · Not reachable: none
- Concept map: no concept map found
- Consumers found:
  - `taxFor` called from `calculateInvoice` in `src/index.js` (invoice-calc) → In scope, Scenario 1 (gets `DE` automatically via the table; no code change there)
  - `RATES` exported from `src/tax.js`; no other reader found in the repo → In scope, Scenario 1
  - `docs/domain/pricing-rules.md` Tax table → In scope, Scenario 3
- Test-only hits: 1 file (`test/invoice.test.js`)
- Map discrepancies: none

## User stories / use cases
- As a tool developer, I want to pass `DE` as the region, so that German invoices are calculated at 19% without the `UK` workaround.
- As a tool developer, I want unlisted regions still refused, so that a mistaken region never silently yields wrong or zero tax.
- As a member of the billing team, I want Germany and its rate listed in the business rules, so that the document and the code agree.

## Functional requirements
1. REQ-1 (Scenario 1): Region code `DE` is accepted by `calculateInvoice` with a tax rate of 19%.
2. REQ-2 (Scenario 1): Tax for `DE` is calculated like every other region: on the amount after discounts, rounded half up via `roundCents`.
3. REQ-3 (Scenario 2): A region not in the table is refused with the same error as today (`Unknown tax region: <code>`). Lowercase `de` is not a listed code and stays refused, as for other codes today.
4. REQ-4 (Scenario 3): `docs/domain/pricing-rules.md` lists `DE` / Germany with 19% in the Tax table.
5. REQ-5 (Scenarios 1–3): Rates and behaviour for `IN`, `UK`, `US` and the returned shape are unchanged; existing tests pass unchanged.

## Non-functional requirements
- Money stays integer cents; rounding only through `roundCents`.
- No new dependencies; Node.js 18+, CommonJS.
- Backwards compatible: no change to the public contract (additions only to accepted input).

## Context
- Classified as a small enhancement (a table entry plus documentation), so the capabilities and roadmap reads were skipped; no specific reason to check them arose. No board access in this session (board type is `none`; the orchestrator handles the board), so the board was not consulted.
- The ticket supplies the rate (19%), region code (`DE`) and acceptance criteria; these were taken as the confirmed business rule. The business-rules owner is the billing team (`docs/domain/pricing-rules.md`).
- Sensitive-area check: the ticket mentions the billing team as requester, but changes only a tax-rate table in a library; no billing, payments, auth, PII, migration or infrastructure paths are touched, so it was not declined.
- Pricing rules say a region not in the table must be refused; this feature keeps that rule.

## Out of scope
- Any other country or region (per ticket).
- Any change to rounding (per ticket).
- Reduced German VAT rates, or any rate other than the standard 19%.
- Case-insensitive or alias handling of region codes.

## Open questions
- [ ] Design: whether tests cover both the exact 10000-cent example and a rounding case for 19% — owner: developer (design deferral; does not change behaviour).

## Acceptance criteria
- AC-1 (Scenario 1): `calculateInvoice` with region `DE` is accepted and does not throw.
- AC-2 (Scenario 1): A `DE` invoice with subtotal 10000 cents has `taxCents` 1900 and `totalCents` 11900.
- AC-3 (Scenario 2): A region not in the table (e.g. `FR`) throws `Unknown tax region: FR`, as today.
- AC-4 (Scenario 3): `docs/domain/pricing-rules.md` Tax table contains Germany (`DE`) at 19%.
- AC-5 (Scenarios 1–3): All existing tests pass unchanged, and `IN`, `UK`, `US` results are unchanged.
