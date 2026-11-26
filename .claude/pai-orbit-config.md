# pai-orbit Configuration

## Agile Board
Type: none
<!-- Tickets for this trial live on the Agentic Factory's local board. -->

## Git
Branching model: GitHub Flow
Main branch: main
Branch naming: feat/<slug>, fix/<slug>
PR process: squash merge

## Deploy
Provider: none — a release is a git tag

Release steps:
| Step | Command |
|------|---------|
| Run tests | `npm test` |
| Tag | `git tag v<next patch version>` |

## Docs
Home: local
Path: docs/

## MCP
git: none
board: none
docs: none
