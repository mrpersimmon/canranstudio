# Lesson 51 Release Remediation Design

**Status:** Approved in conversation on 2026-07-31  
**Baseline:** `main@8690d7dadbef2bfdc60e08dfd512d4f662374c42`

## Goal

Make Lesson 51 a first-class published course and close the validated release,
state-integrity, certificate, font, audio-lifecycle, CI supply-chain, and live
artifact-verification gaps without changing the accepted HTTP-only deployment
decision.

## Constraints

- Production remains HTTP-only until the external filing, domain, certificate,
  and deployment decision changes.
- The transport risk remains open as `RISK-HTTP-01`; repository changes must not
  claim that it is fixed.
- The site remains a package-free static site at runtime.
- Existing public routes and existing Lesson 49, Lesson 50, and soundmark
  behavior remain compatible.
- Lesson 51 must reuse the existing `core` storage, progress, assessment, and
  audio modules instead of creating course-specific replacements.
- The legacy scalar `l51-stars-v1` must never be interpreted as completed
  per-level progress.

## 1. Published Course Registry

Add one Node-consumable course registry under `scripts/`. Each published course
record contains:

- stable course ID;
- canonical route with a trailing slash;
- entry HTML path;
- public asset directories;
- expected page title.

The registry contains Lesson 49, Lesson 50, soundmark, and Lesson 51.

`scripts/build-static.js` derives course HTML files and course asset directories
from the registry. It continues to own non-course entries such as the welcome
page, compatibility page, `core`, and shared `assets`.

Before copying files, the build scans repository directories matching
`lesson*/index.html`. If a discovered lesson is absent from the registry, the
build fails. A draft lesson therefore cannot silently exist on `main` while
remaining outside the release contract.

`scripts/verify-live.js` derives its course entry routes from the same registry.
The E2E route, smoke, local-font, and navigation contracts also consume the
registry.

Human-readable surfaces remain explicitly authored:

- the welcome-page course card;
- root `README.md`;
- `deploy/README.md`;
- `deploy/nginx/canranstudio-http.conf`.

Contract tests compare those surfaces with the registry and fail when a
published course is missing. This keeps the HTML, documentation, and Nginx
configuration readable without allowing their course lists to drift.

Lesson 51 must appear in `dist`, `release-manifest.json`, the welcome page,
public route documentation, the deployment runbook, the Nginx canonical-route
redirects, and all applicable route tests. Its 46 MP3 files are published under
`lesson51/audio/`.

## 2. Lesson 51 Progress Model

Lesson 51 stores versioned progress at:

```text
canran:l51:progress:v2
```

The shape is:

```json
{
  "version": 2,
  "ratings": {
    "l1": 0,
    "l2": 0,
    "l3": 0,
    "l4": 0,
    "l5": 0
  }
}
```

Ratings are finite integers from 0 through 3. Loading, normalization, repair,
and saving use `CanranCore.storage`. Historical ratings only increase through
`CanranCore.progress.awardRating`.

`l51-stars-v1` is passed as a reset-only legacy key. On the first readable,
successful migration, the new empty v2 state is persisted and the scalar key is
removed. Negative numbers, huge values, numeric strings, arrays, objects,
invalid JSON, and browser storage exceptions cannot escape into page
initialization.

The visible total is always calculated from the five normalized ratings and is
therefore bounded to 0 through 15.

## 3. Lesson 51 Rating Rules

Every replay may improve a historical rating but cannot add to it, duplicate
it, or lower it.

| Level | Completion and rating rule |
| --- | --- |
| `l1` Listening words | The run ends after five solved questions. Five first-attempt answers earn 3 stars; three or four earn 2; completing the run earns 1. |
| `l2` Story theatre | Completing “自动播放全场” through the normal end of the final line earns 3 stars. Manual stop, interruption, error, timeout, or unsupported playback does not complete the level. |
| `l3` Month sorting | After all twelve months are placed, twelve first-attempt placements earn 3 stars; nine through eleven earn 2; completion earns 1. |
| `l4` Frequency ladder | After all three cards are placed, three first-attempt placements earn 3 stars; two earn 2; completion earns 1. |
| `l5` Final quiz | After all eight questions are solved, eight first-attempt answers earn 3 stars; six or seven earn 2; completion earns 1. |

First-attempt scoring uses the established assessment semantics: a wrong answer
marks that item ineligible for first-attempt credit, but a correct retry still
allows the learner to finish.

## 4. Certificate Contract

Lesson 51 can issue a certificate only when all five ratings are at least one
star.

The invariant is enforced in two independent locations:

1. while rendering the certificate gate and button state;
2. immediately before the print action.

Removing `disabled` in developer tools cannot bypass the second check.

The certificate also requires a non-empty trimmed learner name. A successful
action updates the displayed name, date, and normalized star total, then calls
`window.print()`.

Dedicated `@media print` rules hide the course interface and print only the
certificate. Failed eligibility or an empty name produces accessible feedback
and never invokes printing.

## 5. Audio Lifecycle

Lesson 51 loads `/core/audio-player.js` and creates one shared player for all
manual and automatic speech.

Each request includes the same-origin prerecorded MP3 path, British-English
speech fallback settings, and an `onFinish` callback. The public player owns
media errors, rejected play promises, speech errors, timeouts, cancellation,
and exactly-once completion.

Automatic story playback additionally owns a generation token:

- starting a run cancels and invalidates the preceding run;
- each line advances only after an `ended` result from the current generation;
- a `cancelled`, `error`, `timeout`, or `unsupported` result terminates the run;
- manual speech or the stop button clears the active line and automatic state;
- stale callbacks cannot restore styling, advance the queue, or award progress;
- only a normal `ended` result for the final line awards `l2`.

The existing visible controls and content remain unchanged apart from accurate
state and completion feedback.

## 6. Fonts and Content Security Policy

Remove all Google Fonts preconnect and stylesheet elements from Lesson 51.
Load `/assets/fonts/fonts.css`, which already contains the required Fredoka and
ZCOOL KuaiLe faces.

The production CSP remains restrictive. It is not expanded for Lesson 51.

A static public-HTML test rejects external `script`, stylesheet, font, image,
audio, and video URLs. HTTP links used only as text are outside this asset
loading invariant.

## 7. Live Artifact Verification

The live verifier first compares the online `release-manifest.json` bytes with
the local release artifact. It then verifies every file named by the manifest.

Asset verification uses:

- at most eight concurrent requests;
- a ten-second timeout per request;
- an 8 MiB maximum per response;
- an early `Content-Length` rejection when the header exceeds the limit;
- a streaming byte limit even when `Content-Length` is missing or false;
- status 200;
- exact same-origin final URL and canonical path;
- the required HTTP security headers;
- exact SHA-256 equality with the manifest.

Failures are aggregated with the affected path. A timeout, oversized response,
redirect mismatch, header mismatch, read failure, or hash mismatch makes the
verification command fail.

The verifier remains intentionally HTTP-only while `RISK-HTTP-01` is accepted.

## 8. CI Supply-Chain Contract

The GitHub Actions workflow:

- declares `permissions: contents: read`;
- pins `actions/checkout` and `actions/setup-node` to full commit SHAs;
- sets `persist-credentials: false` for checkout;
- pins the Nginx image to its version and immutable multi-platform digest.

Add repository npm configuration that explicitly selects the official npm
registry. Regenerate the lockfile so package tarball URLs use that registry
while preserving exact package versions and integrity hashes.

## 9. Documentation and Risk Naming

Update the root README and deployment runbook with Lesson 51 routes, assets,
checks, and certificate behavior.

Rename the accepted transport-risk reference to `RISK-HTTP-01` everywhere.
The risk remains open and deferred. No HTTPS listener, certificate path, HSTS
header, or HTTP-to-HTTPS redirect is introduced by this remediation.

## 10. Verification Strategy

### Focused regression coverage

- unknown `lesson*/index.html` directories fail the static build;
- Lesson 51 HTML and all 46 audio files appear in `dist` and the manifest;
- every registry course appears in the welcome page, README, runbook, Nginx,
  route tests, smoke tests, and live route set;
- corrupt, negative, huge, malformed, or inaccessible Lesson 51 storage cannot
  crash initialization or unlock a certificate;
- repeated runs only improve per-level historical ratings;
- `l2` is awarded only after uninterrupted normal completion of the final line;
- cancellation clears automatic playback and styling without stale advancement;
- a forged enabled certificate button cannot bypass eligibility;
- successful eligible certificate action invokes printing;
- public HTML loads no third-party runtime assets;
- the live verifier detects modified JS, font, and MP3 responses;
- timeout, oversized body, final-URL, header, and hash failures are bounded and
  reported.

### Preserved behavior

- all existing unit, E2E, deployment, build, font, and Nginx tests remain green;
- Lesson 49, Lesson 50, and soundmark routes and progress behavior are unchanged;
- Lesson 51 lesson text, visual layout, prerecorded audio, and manual
  interactions remain available;
- local static hosting and the accepted production HTTP origin remain supported.

### Release gate

The remediation is complete only when:

1. targeted tests demonstrate the original failures before implementation and
   pass after implementation;
2. the full repository test suite passes;
3. the static build succeeds from a clean Git tree;
4. the release manifest is bound to the exact tested commit and includes
   Lesson 51;
5. the Nginx configuration validates with the pinned image;
6. the original storage, certificate, CSP, and audio reproductions no longer
   reproduce;
7. `RISK-HTTP-01` is explicitly reported as the remaining accepted risk.

## Out of Scope

- obtaining or configuring a domain, ICP filing, TLS certificate, HTTPS, or
  HSTS;
- redesigning Lesson 51 content or visual language;
- adding a backend, accounts, cross-device progress, or server-side
  certificates;
- automatically publishing unregistered lesson directories.
