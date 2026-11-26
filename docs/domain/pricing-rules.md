# Pricing rules

Owner: billing team. These are the rules the business has agreed. Code follows this file.

## Amounts

- Every amount is held in cents as a whole number.
- Rounding is half up to the nearest cent.

## Order of calculation

1. Each line total = quantity × unit price.
2. Subtotal = sum of line totals.
3. Discounts, when there are any, are taken off the subtotal before tax.
4. Tax is calculated on the amount after discounts.
5. Total = amount after discounts + tax.

## Tax

| Region | Rate |
|---|---|
| IN | 18% |
| UK | 20% |
| US | 0% |

An invoice for a region not in this table must be refused. Charging zero tax by mistake is worse
than refusing the invoice.

## Discounts

No discount exists in the product today. The agreed rule for the first one is in
`docs/features/bulk-discount/requirements.md`.

- A discount never makes any amount negative.
- A discount is shown on the invoice as its own amount, so the customer can see it.
