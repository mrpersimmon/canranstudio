# Tests

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm run test:unit
npm run test:state
npm test
```

`test:unit` verifies storage, finite ratings, first-attempt scoring, and stable option identity.
`test:state` verifies the home page, Lessons 49, 50, 51, and 54, and soundmark against the repository-local static server.
`npm test` is the complete pre-commit gate.
`npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js` verifies terminal playback,
interruption cleanup, and the Lesson 50 queue.
`npm run test:deploy` checks the public artifact and HTTP-only Nginx policy.
`npm run build:static` creates the exact `dist/` release and hash manifest.
`npm run verify:live:http` is a post-deploy gate and must use that exact local artifact.

Run these focused hardening checks when changing the corresponding behavior:

```bash
npm run test:e2e -- tests/e2e/certificate-export.spec.js
npm run test:e2e -- tests/e2e/accessibility.spec.js
npm run test:e2e -- tests/e2e/local-fonts.spec.js
npm run test:e2e -- tests/e2e/lesson49-map.spec.js tests/e2e/lesson50-story.spec.js
```

The browser runtime remains static and package-free. `npm run vendor:fonts` rebuilds the committed
WOFF2, `fonts.css`, and OFL license copies under `assets/fonts/` from the pinned Fontsource 5.3.0
packages; CI rejects a regenerated font directory that differs from the committed assets. The
focused suites cover certificate eligibility re-checks, Lesson 49 Blob URL cleanup, native modal
certificate dialogs, polite atomic live feedback, and same-origin font loading.

The soundmark v1 integer cannot identify completed challenges. Its one-time v2 migration therefore
resets soundmark progress to zero. Lesson 49 and Lesson 50 preserve and clamp legacy level ratings.
