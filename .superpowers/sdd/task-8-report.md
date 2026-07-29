# Task 8 report: CI state-integrity verification

## Changes

- Added `test:state` with the four state-integrity Playwright specifications.
- Added the required `verify` workflow for Node 20, `npm ci`, Chromium installation, unit tests,
  and the full E2E suite on pushes and pull requests.
- Added the exact local verification contract and v1-to-v2 migration behavior to `tests/README.md`.

## Commands and results

| Command | Result |
| --- | --- |
| `npm ci` | Passed; the lockfile did not change. |
| `npm run test:unit` | Passed: 13 tests. |
| `npm run test:e2e` | Passed: 26 tests. |
| `npm run test:state -- --reporter=line` | Passed: 22 tests; `.last-run.json` reported `status: "passed"` and `failedTests: []`. |
| `git diff --check` | Passed with no output. |

## Migration and progress UI audit

- Runtime old-key references: 6. They are the three explicit migration arguments on the welcome
  page plus one `legacyKey` argument in each of Lesson 49, Lesson 50, and Soundmark; all pass
  through `CanranCore.storage.loadProgress`.
- No non-migration business reads of `l49-stars-v1`, `l50-stars-v1`, or
  `phonics-magic-stars-v1` were found in runtime pages or `core/storage.js`.
- Runtime v2-key references: 6. All current progress UI paths use the normalized
  `result.progress.ratings` / saved normalized ratings returned by the v2 storage contract.

## Self-review and concerns

- The workflow exactly uses Node 20 and installs Chromium with Playwright dependencies before
  running both required suites.
- No product pages, core modules, test behavior, dependencies, backend configuration, accounts,
  HTTPS, or HSTS settings were changed.
- Concern: none.

## Plan exit gate

- `npm test` passed: 13 unit tests and 26 full E2E tests. Playwright recorded
  `status: "passed"` with `failedTests: []`.
- `git status --short` produced no output after the gate.
