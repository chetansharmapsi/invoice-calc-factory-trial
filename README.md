# invoice-calc (Agentic Factory trial project)

A small Node.js library that calculates invoice totals: line totals, tax by region, rounding.

**This is a test fixture, not a real product.** It exists to try out the pai-orbit Agentic Factory,
which takes a ticket from the backlog and drives it through grooming, design, build, test, pull
request and release, stopping for a person's answers and approvals. The business, the "billing
team" and the rules in `docs/` are invented for the trial.

## What is in the repo

| Path | What it holds |
|---|---|
| `src/` | The library. Public API: `calculateInvoice`, `formatCents` |
| `test/` | Tests. Run with `npm test` (Node 18+, no dependencies) |
| `docs/domain/pricing-rules.md` | The invented business rules the code must follow |
| `docs/features/bulk-discount/requirements.md` | One feature already groomed by a person, ready to design |
| `CLAUDE.md`, `.claude/pai-orbit-config.md` | Project context and pai-orbit settings |

## How the trial works

Issues in this repo are the tickets. A person adds one label to hand a ticket to the factory:

| Label | Meaning |
|---|---|
| `factory-ready` | A raw ticket. The factory grooms it first |
| `factory-groomed` | Already groomed. The factory starts at design |

The factory sets `factory-owned`, `factory-waiting` and `factory-declined` itself. It asks its
questions as issue comments, and it never merges or releases without a person's approval.

## Branches

- `main` is the starting state of the project.
- `archive/local-docker-run` is the result of an earlier run on a local machine, kept for reference.
- `factory/...` branches are created by the factory, one per ticket.
