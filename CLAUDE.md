# invoice-calc

A small Node.js library that calculates invoice totals. The billing team's internal tools import it
so that every tool produces the same numbers. Its users are the developers of those tools; the
people affected by a wrong number are the customers who receive the invoices.

## Stack

- Node.js 18+, CommonJS, no dependencies.
- Tests: `node:test`, run with `npm test`. Every behaviour change needs a test.
- Single library, single repo. No UI, no database, no deployment. A release is a git tag.

## Layout

| Path | What it holds |
|---|---|
| `src/index.js` | Public API: `calculateInvoice`, `formatCents` |
| `src/lines.js` | Line validation and line totals |
| `src/tax.js` | Tax rates by region |
| `src/money.js` | Rounding and formatting |
| `test/` | Tests |
| `docs/domain/pricing-rules.md` | The business rules. Read before changing any calculation |
| `docs/features/` | One folder per feature: requirements, design, test plan |

## Conventions

- Money is always an integer number of cents. Never floating point, never strings, inside the library.
- Rounding is half up, and only through `roundCents`.
- Invalid input throws an `Error` with a message a developer can act on. Never return a partial or
  zero result for bad input.
- The shape returned by `calculateInvoice` is a public contract. Adding fields is fine; renaming or
  removing them is a breaking change.
