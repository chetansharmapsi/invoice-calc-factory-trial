Status: Groomed — ready for /design

## Epic
Standalone.

## Purpose
The billing team now invoices customers in Spain, but the library refuses region `ES` as unknown, so those invoices cannot be calculated. This feature adds Spain as a known tax region at 21%, so tool developers get correct invoices for Spanish customers without workarounds.

Basis: ticket #7 text; `docs/domain/pricing-rules.md` (Tax table has IN, UK, US, DE; unknown regions must be refused); `CLAUDE.md` (the people affected by a wrong number are the invoiced customers).

Classification: small enhancement (one new row in an existing table, same shape as the Germany feature, `docs/features/add-germany-as-a-tax-region/`). Capabilities and roadmap reads skipped: no specific reason to check. The board was not consulted (no board access in this unattended session).

## Scope
- Add region `ES` with a 21% rate to the tax rate table in `src/tax.js`.
- Add a Spain row (`ES`, 21%) to the Tax table in `docs/domain/pricing-rules.md` (a change the ticket's acceptance criteria name explicitly).
- Add tests for `ES` (rate, and the 10000-cent example through `calculateInvoice`).

What this does NOT include:
- Any other country or region (the existing IN, UK, US, DE rows are untouched).
- Any change to rounding (`roundCents` in `src/money.js`) or to the order of calculation.
- Any change to how unknown regions are refused (`taxFor` error `Unknown tax region: <code>`).
- Any change to the shape returned by `calculateInvoice`.
- The groomed bulk-discount feature (`docs/features/bulk-discount/`).

## Scenarios in scope
1. A developer passes region `ES` and gets 21% tax; subtotal 10000 gives `taxCents` 2100, `totalCents` 12100.
2. A developer passes a region not in the table (e.g. `FR`) and the invoice is still refused with the same error as today.
3. The business rules document lists Spain with its rate.
4. Existing behaviour for other regions and existing tests are unchanged.

Scenario confirmation: the ticket's acceptance criteria and "out of scope" line state each of these; no person was available in this unattended session, so they are taken as confirmed from the ticket text.

## Consumer check
- Signal: `RATES` / region table (the set of accepted region codes)
- Classification: Existing — the change alters which region codes `taxFor` accepts, so the check was run.
- Override: none
- Search terms: `region`, `Region`, `RATES`, `taxFor`, `Unknown tax region`
- Repos searched: this repo only (single-repo project) · Not reachable: none
- Concept map: no concept map found
- Consumers found:
  - `calculateInvoice` in `src/index.js` (calls `taxFor`; picks up `ES` automatically) → In scope, Scenario 1
  - `docs/domain/pricing-rules.md` Tax table → In scope, Scenario 3
  - `RATES` export of `src/tax.js`: no other importer found → nothing to change
- Test-only hits: 3 files (`test/invoice.test.js`, `test/tax.test.js`, `test/discount.test.js`)
- Map discrepancies: none

## User stories / use cases
- As a billing-tool developer, I want to pass `ES` for Spanish customers, so that their invoices are calculated instead of refused. (Scenario 1)
- As a billing-tool developer, I want unlisted regions to keep being refused, so that a typo or unsupported country is never silently taxed at zero or a wrong rate. (Scenario 2)
- As a member of the billing team, I want the business rules document to list Spain at 21%, so that the document and code agree. (Scenario 3)
- As a developer of an existing tool, I want results for other regions to stay identical, so that nothing I already ship changes. (Scenario 4)

## Functional requirements
1. REQ-1 (Scenario 1): Region code `ES` is accepted with a tax rate of 21%.
2. REQ-2 (Scenario 1): Tax for `ES` is computed like every other region (on the amount after discounts, rounded half up via `roundCents`).
3. REQ-3 (Scenario 2): A region not in the table is refused with the same error as today (`Unknown tax region: <code>`), never zero tax.
4. REQ-4 (Scenario 3): `docs/domain/pricing-rules.md` Tax table lists `ES` with 21%.
5. REQ-5 (Scenario 4): Rates and results for IN, UK, US, DE and the shape of the `calculateInvoice` result are unchanged.

## Non-functional requirements
- Money stays integer cents; no floating point or strings inside the library.
- Backwards compatible: no breaking change to the public API.
- No new dependencies.

## Context
- Board not consulted: no board access in this session; the board was not read.
- The 21% rate comes from the ticket's acceptance criteria. The pricing rules are owned by the billing team; the requester is taken to speak for them.
- Assumption: region codes are matched exactly as today, so only uppercase `ES` is accepted and `es` is refused like any other unknown value. The ticket says unlisted regions are refused "exactly as today".

## Out of scope
- Any other country or region.
- Any change to rounding.
- Any change to the error behaviour for unknown regions.
- Case-insensitive or aliased region codes (such as accepting `es`).

## Open questions
- [ ] Design (deferred to /design): none functional remain. Test placement (e.g. `test/tax.test.js`) is left to design; existing tests must pass unchanged. — owner: developer

## Acceptance criteria
- AC-1 (Scenario 1): `calculateInvoice` with region `ES` is accepted and does not throw.
- AC-2 (Scenario 1): An invoice with subtotal 10000 cents for `ES` returns `taxCents` 2100 and `totalCents` 12100.
- AC-3 (Scenario 2): A region not in the table (e.g. `FR`) still throws `Unknown tax region: FR`.
- AC-4 (Scenario 3): The Tax table in `docs/domain/pricing-rules.md` contains a row for `ES` at 21%.
- AC-5 (Scenario 4): All existing tests not concerning ES pass unchanged.
