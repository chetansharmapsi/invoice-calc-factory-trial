# Bulk discount — Requirements

Status: Groomed — ready for /design
Groomed: 2026-11-20 by the billing team (person-led /groom session)
Ticket: 1

## Epic
<!-- standalone -->

## Purpose
Customers who buy in volume are promised a discount in their contracts, and today each internal
tool applies it by hand, so invoices for the same order differ between tools. This feature puts the
bulk discount into `invoice-calc` so every tool gives the same discounted total. It serves the
developers of the billing tools and, through them, volume customers.

## Scope
- `calculateInvoice` applies a bulk discount to the subtotal when the invoice qualifies.
- The result reports the discount as its own amount.
- Tax is calculated on the amount after the discount.

What this does NOT include:
- Any other kind of discount (coupon codes, per-customer rates, per-line discounts).
- Changing tax rates or regions.
- Changing how line totals are calculated.

## Scenarios in scope
1. An invoice whose subtotal reaches the threshold gets the bulk discount.
2. An invoice below the threshold is calculated exactly as today.
3. A caller reads the discount amount from the result.

## Consumer check
- Signal: `subtotalCents` / `taxCents` / `totalCents` in the result of `calculateInvoice`
- Classification: Existing — tax and total are now derived from the discounted amount
- Override: none
- Search terms: `subtotalCents`, `taxCents`, `totalCents`, `calculateInvoice`
- Repos searched: invoice-calc · Not reachable: the internal tools that import this library (see Context)
- Concept map: no concept map found
- Consumers found:
  - `src/index.js` `calculateInvoice` (invoice-calc) → In scope, Scenarios 1–3
- Test-only hits: 1 file
- Map discrepancies: none

## User stories / use cases
- As a billing-tool developer, I want the library to apply the bulk discount, so that my tool and
  every other tool show the same total. (Scenario 1)
- As a billing-tool developer, I want small invoices to be unchanged, so that nothing I already
  rely on breaks. (Scenario 2)
- As a billing-tool developer, I want the discount amount in the result, so that I can print it on
  the invoice. (Scenario 3)

## Functional requirements
1. REQ-1 (Scenario 1): When the subtotal is 100000 cents (1000.00) or more, a discount of 10% of
   the subtotal is applied, rounded half up to a cent.
2. REQ-2 (Scenario 1): Tax is calculated on the subtotal minus the discount.
3. REQ-3 (Scenario 1): The total is the subtotal minus the discount, plus tax.
4. REQ-4 (Scenario 2): When the subtotal is below 100000 cents, the discount is 0 and tax and total
   are exactly what they are today.
5. REQ-5 (Scenario 3): The result includes `discountCents`, a whole number of cents, zero or more,
   on every invoice.
6. REQ-6 (Scenario 3): `subtotalCents` continues to mean the sum of line totals before the discount.

## Non-functional requirements
- Existing fields of the result keep their names and meanings; `discountCents` is an addition.
- Money stays in whole cents; rounding goes through the existing rounding helper.

## Context
- The threshold and the rate are fixed by the business for now (`docs/domain/pricing-rules.md`
  says discounts come off the subtotal before tax). They are not configurable by callers.
- The internal tools that import this library are in other repos and were not searched. Adding a
  field does not break them; the change in `taxCents` and `totalCents` for large invoices is the
  intended effect.

## Out of scope
- Coupon codes, per-customer discounts, per-line discounts.
- Making the threshold or rate configurable.

## Open questions
None.

## Acceptance criteria
- AC-1 (Scenario 1): Subtotal 100000, region US → `discountCents` 10000, `taxCents` 0,
  `totalCents` 90000.
- AC-2 (Scenario 1): Subtotal 150000, region UK → `discountCents` 15000, `taxCents` 27000 (20% of
  135000), `totalCents` 162000.
- AC-3 (Scenario 1): A subtotal whose 10% is not a whole cent rounds half up: subtotal 100005 →
  `discountCents` 10001.
- AC-4 (Scenario 2): Subtotal 99999, region IN → `discountCents` 0, `taxCents` 18000,
  `totalCents` 117999.
- AC-5 (Scenario 3): `discountCents` is present, and is 0, on an invoice that gets no discount.
- AC-6 (Scenario 2): Every existing test still passes without being changed.
