Status: Groomed — ready for /design

## Epic
Standalone.

## Purpose
The billing team now invoices customers in Germany, but the library refuses region `DE` as unknown. Tool developers work around it by passing `UK`, so German customers are charged 20% instead of 19%. This feature adds Germany as a known tax region so those invoices are calculated with the correct tax and the workaround is no longer needed.

Basis: ticket #2 text; `docs/domain/pricing-rules.md` (Tax table has only IN, UK, US; unknown regions must be refused); `CLAUDE.md` (the people affected by a wrong number are the invoiced customers).

Classification: small enhancement (one new row in an existing table). Capabilities/roadmap reads skipped; there is no `product-capabilities.md`, no plans, no epics, and the board type is `none`, so the board was not consulted.

## Scope
- Add region `DE` with a 19% rate to the tax rate table in `src/tax.js`.
- Add a Germany row (`DE`, 19%) to the Tax table in `docs/domain/pricing-rules.md` (a change the ticket's acceptance criteria name explicitly).
- Add tests for `DE` (rate, and the 10000-cent example through `calculateInvoice`).

What this does NOT include:
- Any other country or region (the existing IN, UK, US rows are untouched).
- Any change to rounding (`roundCents` in `src/money.js`) or to the order of calculation.
- Any change to how unknown regions are refused (`taxFor` error `Unknown tax region: <code>`).
- Any change to the shape returned by `calculateInvoice`.
- The groomed bulk-discount feature (`docs/features/bulk-discount/`).

## Scenarios in scope
1. A developer passes region `DE` and gets 19% tax; subtotal 10000 gives `taxCents` 1900, `totalCents` 11900.
2. A developer passes a region not in the table (e.g. `FR`) and the invoice is still refused with the same error as today.
3. The business rules document lists Germany with its rate.
4. Existing IN, UK, US behaviour and existing tests are unchanged.

Scenario confirmation: the ticket's acceptance criteria and "out of scope" line state each of these; no person was available in this unattended session, so they are taken as confirmed from the ticket text.

## Consumer check
- Signal: `RATES` / region table (the set of accepted region codes)
- Classification: Existing — the change alters which region codes are accepted by `taxFor`, so the check was run.
- Override: none
- Search terms: `region`, `Region`, `RATES`, `taxFor`, `tax`, `Unknown tax region`
- Repos searched: this repo only (single-repo project) · Not reachable: none
- Concept map: no concept map found
- Consumers found:
  - `calculateInvoice` in `src/index.js` (calls `taxFor`; needs no change, picks up `DE` automatically) → In scope, Scenario 1
  - `docs/domain/pricing-rules.md` Tax table → In scope, Scenario 3
  - `RATES` export of `src/tax.js`: no other importer found → nothing to change
- Test-only hits: 1 file (`test/invoice.test.js`)
- Map discrepancies: none

## User stories / use cases
- As a billing-tool developer, I want to pass `DE` for German customers, so that I no longer have to pass `UK` and charge the wrong tax. (Scenario 1)
- As a billing-tool developer, I want unlisted regions to keep being refused, so that a typo or unsupported country is never silently taxed at zero or at a wrong rate. (Scenario 2)
- As a member of the billing team, I want the business rules document to list Germany at 19%, so that the document and code agree. (Scenario 3)
- As a developer of an existing tool, I want IN, UK and US results to stay identical, so that nothing I already ship changes. (Scenario 4)

## Functional requirements
1. REQ-1 (Scenario 1): Region code `DE` is accepted with a tax rate of 19%.
2. REQ-2 (Scenario 1): Tax for `DE` is computed like every other region (on the amount after discounts, rounded half up via `roundCents`).
3. REQ-3 (Scenario 2): A region not in the table is refused with the same error as today (`Unknown tax region: <code>`), never zero tax.
4. REQ-4 (Scenario 3): `docs/domain/pricing-rules.md` Tax table lists `DE` with 19%.
5. REQ-5 (Scenario 4): Rates and results for IN, UK, US and the shape of the `calculateInvoice` result are unchanged.

## Non-functional requirements
- Money stays integer cents; no floating-point values or strings stored (project convention).
- Backwards compatible: no breaking change to the public API.
- No new dependencies.

## Context
- Board not consulted: the board type is `none` in `.claude/pai-orbit-config.md`, and this session has no board access.
- The 19% rate comes from the ticket's acceptance criteria. The pricing rules are owned by the billing team; the requester is taken to speak for them.
- Assumption: region codes are matched exactly as today, so only uppercase `DE` is accepted and `de` is refused like any other unknown value. The ticket says unlisted regions are refused "exactly as today".

## Out of scope
- Any other country or region.
- Any change to rounding.
- Any change to the error behaviour for unknown regions.
- Case-insensitive or aliased region codes (such as accepting `de` or `GER`).

## Open questions
- [ ] Design (deferred to /design): none functional remain. Test placement (new test file or additions to `test/invoice.test.js`) is left to design; existing tests must pass unchanged. — owner: developer

## Acceptance criteria
- AC-1 (Scenario 1): `calculateInvoice` with region `DE` is accepted and does not throw.
- AC-2 (Scenario 1): An invoice with subtotal 10000 cents for `DE` returns `taxCents` 1900 and `totalCents` 11900.
- AC-3 (Scenario 2): A region not in the table (e.g. `FR`) still throws `Unknown tax region: FR`.
- AC-4 (Scenario 3): The Tax table in `docs/domain/pricing-rules.md` contains a row for `DE` at 19%.
- AC-5 (Scenario 4): All existing tests pass unchanged, and a new test shows IN, UK, US still produce their current tax.
