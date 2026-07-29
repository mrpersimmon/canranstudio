# State Integrity Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the test foundation and make stored progress, first-attempt scoring, shuffled answers, stars, and certificate eligibility internally consistent across all four pages.

**Architecture:** Keep the site build-free at runtime. Add three small dual-environment scripts under `core/` that expose browser APIs through `globalThis.CanranCore` and export the same APIs through CommonJS for Node tests. Migrate one page at a time, preserving its visual design and using Playwright only for browser integration behavior.

**Tech Stack:** HTML5, browser JavaScript, Node.js 20+, `node:test`, Playwright 1.62.0, GitHub Actions

## Global Constraints

- Use the approved design at `docs/superpowers/specs/2026-07-29-canranstudio-remediation-design.md`.
- Keep runtime dependencies at zero; `@playwright/test` is development-only.
- Require Node.js `>=20`.
- Do not add a backend, accounts, signed certificates, HTTPS, HSTS, or a frontend framework.
- Keep the current visual design and course content unchanged.
- Lesson 49 and Lesson 50 legacy ratings migrate and clamp to integers in `0–3`.
- Soundmark legacy integer stars reset to zero; do not infer achievement identities from the old total.
- A correct retry solves the question but scores only when the first submitted answer was correct.
- Certificate handlers must re-check eligibility even if the DOM button is manually enabled.
- Complete this plan before executing the audio, route/deployment, or engineering-hardening plans.

---

### Task 1: Establish the Node and Playwright test foundation

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.gitignore`
- Create: `playwright.config.js`
- Create: `tests/support/static-server.js`
- Create: `tests/e2e/smoke.spec.js`

**Interfaces:**
- Consumes: the current repository layout where Lesson 49 is `/`, the welcome page is `/home/`, Lesson 50 is `/lesson50/`, and soundmark is `/soundmark/`.
- Produces: `npm run test:unit`, `npm run test:e2e`, `npm test`, and a static test server at `http://127.0.0.1:4173`.

- [ ] **Step 1: Create the package manifest**

Create `package.json`:

```json
{
  "name": "canranstudio",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test:unit": "node --test tests/unit/*.test.js",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e"
  },
  "devDependencies": {
    "@playwright/test": "1.62.0"
  }
}
```

Create `.gitignore`:

```gitignore
node_modules/
playwright-report/
test-results/
dist/
```

- [ ] **Step 2: Install the locked development dependency**

Run:

```bash
npm install
npx playwright install chromium
```

Expected:

- `package-lock.json` is created with `@playwright/test@1.62.0`;
- Chromium installation succeeds;
- `npm ls @playwright/test` reports `@playwright/test@1.62.0`.

- [ ] **Step 3: Add the repository-local static server**

Create `tests/support/static-server.js`:

```javascript
'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

const ROOT = process.cwd();
const PORT = 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  const withIndex = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const absolute = path.resolve(ROOT, `.${withIndex}`);
  if (absolute !== ROOT && !absolute.startsWith(`${ROOT}${path.sep}`)) {
    return null;
  }
  return absolute;
}

const server = http.createServer(async (request, response) => {
  let file;
  try {
    file = resolveRequestPath(request.url);
  } catch {
    response.writeHead(400).end('Bad Request');
    return;
  }

  if (!file) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(file);
    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404).end('Not Found');
      return;
    }
    response.writeHead(500).end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`static test server listening on http://127.0.0.1:${PORT}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
```

- [ ] **Step 4: Configure Playwright and write the first smoke test**

Create `playwright.config.js`:

```javascript
'use strict';

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/support/static-server.js',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 10000
  }
});
```

Create `tests/e2e/smoke.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

for (const path of ['/', '/home/', '/lesson50/', '/soundmark/']) {
  test(`${path} loads without an uncaught page error`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    const response = await page.goto(path);

    expect(response.status()).toBe(200);
    expect(pageErrors).toEqual([]);
    await expect(page.locator('body')).toBeVisible();
  });
}
```

- [ ] **Step 5: Run the smoke suite**

Run:

```bash
npm run test:e2e -- tests/e2e/smoke.spec.js
```

Expected: 4 tests pass.

- [ ] **Step 6: Commit the test foundation**

```bash
git add package.json package-lock.json .gitignore playwright.config.js tests/support/static-server.js tests/e2e/smoke.spec.js
git commit -m "test: add browser regression foundation"
```

---

### Task 2: Add schema-driven storage normalization and migration

**Files:**
- Create: `core/storage.js`
- Create: `tests/unit/storage.test.js`

**Interfaces:**
- Consumes: a Storage-compatible object with `getItem`, `setItem`, and `removeItem`.
- Produces:
  - `CanranCore.storage.VERSION: 2`
  - `CanranCore.storage.emptyProgress(ids: string[]): Progress`
  - `CanranCore.storage.clampRating(value: unknown): number`
  - `CanranCore.storage.normalizeProgress(raw: unknown, ids: string[]): Progress`
  - `CanranCore.storage.loadProgress(options): LoadResult`
  - `CanranCore.storage.saveProgress(options): SaveResult`

`Progress` is `{version: 2, ratings: Record<string, number>}`.

- [ ] **Step 1: Write failing storage tests**

Create `tests/unit/storage.test.js`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  VERSION,
  normalizeProgress,
  loadProgress,
  saveProgress
} = require('../../core/storage');

const IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];

function memoryStorage(seed = {}, failure = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem(key) {
      if (failure.get) throw new Error('get blocked');
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (failure.set) throw new Error('set blocked');
      data.set(key, String(value));
    },
    removeItem(key) {
      if (failure.remove) throw new Error('remove blocked');
      data.delete(key);
    }
  };
}

test('normalizeProgress accepts only finite integer ratings in range', () => {
  assert.deepEqual(
    normalizeProgress({
      version: 2,
      ratings: { l1: -1, l2: '2.9', l3: 999, l4: null, l5: [] }
    }, IDS),
    {
      version: VERSION,
      ratings: { l1: 0, l2: 2, l3: 3, l4: 0, l5: 0 }
    }
  );
});

test('loadProgress migrates and removes legacy level ratings only after v2 write', () => {
  const storage = memoryStorage({
    'l49-stars-v1': JSON.stringify({ l1: 1, l2: -8, l3: 2, l4: 4, l5: 3 })
  });

  const result = loadProgress({
    storage,
    key: 'canran:l49:progress:v2',
    legacyKey: 'l49-stars-v1',
    ids: IDS,
    legacyMode: 'ratings'
  });

  assert.equal(result.migrated, true);
  assert.equal(result.persisted, true);
  assert.deepEqual(result.progress.ratings, { l1: 1, l2: 0, l3: 2, l4: 3, l5: 3 });
  assert.equal(storage.getItem('l49-stars-v1'), null);
});

test('loadProgress resets soundmark legacy totals without inferring achievements', () => {
  const storage = memoryStorage({ 'phonics-magic-stars-v1': '12' });
  const result = loadProgress({
    storage,
    key: 'canran:soundmark:progress:v2',
    legacyKey: 'phonics-magic-stars-v1',
    ids: ['vs', 'g1', 'g2', 'g3'],
    legacyMode: 'reset'
  });

  assert.equal(result.resetLegacy, true);
  assert.deepEqual(result.progress.ratings, { vs: 0, g1: 0, g2: 0, g3: 0 });
  assert.equal(storage.getItem('phonics-magic-stars-v1'), null);
});

test('invalid JSON is repaired instead of escaping to page initialization', () => {
  const storage = memoryStorage({ 'canran:l50:progress:v2': '{broken' });
  const result = loadProgress({
    storage,
    key: 'canran:l50:progress:v2',
    ids: IDS
  });

  assert.equal(result.repaired, true);
  assert.deepEqual(result.progress.ratings, { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });
  assert.doesNotThrow(() => JSON.parse(storage.getItem('canran:l50:progress:v2')));
});

test('storage write failure returns normalized in-memory progress and preserves legacy', () => {
  const storage = memoryStorage(
    { 'l49-stars-v1': JSON.stringify({ l1: 2 }) },
    { set: true }
  );
  const result = loadProgress({
    storage,
    key: 'canran:l49:progress:v2',
    legacyKey: 'l49-stars-v1',
    ids: IDS,
    legacyMode: 'ratings'
  });

  assert.equal(result.persisted, false);
  assert.equal(result.progress.ratings.l1, 2);
  assert.notEqual(storage.getItem('l49-stars-v1'), null);
});

test('saveProgress never persists out-of-range ratings', () => {
  const storage = memoryStorage();
  const result = saveProgress({
    storage,
    key: 'canran:l49:progress:v2',
    progress: { version: 2, ratings: { l1: 99, l2: -1 } },
    ids: IDS
  });

  assert.equal(result.persisted, true);
  assert.deepEqual(
    JSON.parse(storage.getItem('canran:l49:progress:v2')).ratings,
    { l1: 3, l2: 0, l3: 0, l4: 0, l5: 0 }
  );
});
```

- [ ] **Step 2: Run the storage test and confirm the expected failure**

Run:

```bash
node --test tests/unit/storage.test.js
```

Expected: FAIL with `Cannot find module '../../core/storage'`.

- [ ] **Step 3: Implement the storage module**

Create `core/storage.js`:

```javascript
(function attachStorage(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.storage = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function storageFactory() {
  'use strict';

  const VERSION = 2;

  function clampRating(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(3, Math.trunc(number)));
  }

  function emptyProgress(ids) {
    return {
      version: VERSION,
      ratings: Object.fromEntries(ids.map(id => [id, 0]))
    };
  }

  function normalizeProgress(raw, ids) {
    const object = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const source = object.version === VERSION &&
      object.ratings &&
      typeof object.ratings === 'object' &&
      !Array.isArray(object.ratings)
      ? object.ratings
      : object;
    const progress = emptyProgress(ids);
    for (const id of ids) progress.ratings[id] = clampRating(source[id]);
    return progress;
  }

  function parseJson(text) {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch {
      return { ok: false, value: null };
    }
  }

  function loadProgress({
    storage,
    key,
    legacyKey = null,
    ids,
    legacyMode = 'ratings'
  }) {
    let raw = null;
    let encodedV2 = null;
    let migrated = false;
    let repaired = false;
    let resetLegacy = false;
    let readable = true;

    try {
      encodedV2 = storage.getItem(key);
      if (encodedV2 !== null) {
        const parsed = parseJson(encodedV2);
        raw = parsed.value;
        repaired = !parsed.ok;
      } else if (legacyKey) {
        const encodedLegacy = storage.getItem(legacyKey);
        if (encodedLegacy !== null) {
          migrated = true;
          if (legacyMode === 'reset') {
            resetLegacy = true;
          } else {
            const parsed = parseJson(encodedLegacy);
            raw = parsed.value;
            repaired = !parsed.ok;
          }
        }
      }
    } catch {
      readable = false;
    }

    const progress = normalizeProgress(raw, ids);
    const normalizedText = JSON.stringify(progress);
    let persisted = false;

    if (readable) {
      try {
        if (encodedV2 !== normalizedText) {
          storage.setItem(key, normalizedText);
          if (encodedV2 !== null) repaired = true;
        }
        persisted = true;
        if (migrated && legacyKey) storage.removeItem(legacyKey);
      } catch {
        persisted = false;
      }
    }

    return { progress, migrated, repaired, resetLegacy, persisted };
  }

  function saveProgress({ storage, key, progress, ids }) {
    const normalized = normalizeProgress(progress, ids);
    try {
      storage.setItem(key, JSON.stringify(normalized));
      return { progress: normalized, persisted: true };
    } catch {
      return { progress: normalized, persisted: false };
    }
  }

  return Object.freeze({
    VERSION,
    clampRating,
    emptyProgress,
    normalizeProgress,
    loadProgress,
    saveProgress
  });
});
```

- [ ] **Step 4: Run the storage tests**

Run:

```bash
node --test tests/unit/storage.test.js
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit the storage contract**

```bash
git add core/storage.js tests/unit/storage.test.js
git commit -m "feat: normalize persisted course progress"
```

---

### Task 3: Add finite ratings and certificate eligibility

**Files:**
- Create: `core/progress.js`
- Create: `tests/unit/progress.test.js`

**Interfaces:**
- Consumes: normalized `ratings` objects from `core/storage.js`.
- Produces:
  - `ratingFor(score: number, bands: Array<{min:number,rating:number}>): number`
  - `awardRating(ratings, id, rating): {ratings, changed}`
  - `totalRatings(ratings, ids): number`
  - `allAtLeast(ratings, ids, minimum): boolean`

- [ ] **Step 1: Write failing rating tests**

Create `tests/unit/progress.test.js`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ratingFor,
  awardRating,
  totalRatings,
  allAtLeast
} = require('../../core/progress');

test('ratingFor exposes every branch including zero', () => {
  const bands = [
    { min: 7, rating: 3 },
    { min: 5, rating: 2 },
    { min: 1, rating: 1 }
  ];
  assert.equal(ratingFor(8, bands), 3);
  assert.equal(ratingFor(5, bands), 2);
  assert.equal(ratingFor(1, bands), 1);
  assert.equal(ratingFor(0, bands), 0);
});

test('awardRating is finite, immutable, and keeps the historic maximum', () => {
  const original = { l1: 1, l2: 0 };
  const higher = awardRating(original, 'l1', 3);
  const lower = awardRating(higher.ratings, 'l1', 2);
  const oversized = awardRating(lower.ratings, 'l2', 99);

  assert.deepEqual(original, { l1: 1, l2: 0 });
  assert.equal(higher.changed, true);
  assert.equal(lower.changed, false);
  assert.equal(oversized.ratings.l2, 3);
});

test('certificate predicates require every named challenge', () => {
  const ids = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const complete = { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 };
  const missing = { ...complete, l4: 0 };

  assert.equal(allAtLeast(complete, ids, 1), true);
  assert.equal(allAtLeast(missing, ids, 1), false);
  assert.equal(totalRatings(complete, ids), 5);
});

test('every approved course rating table reaches zero through three stars', () => {
  const tables = [
    {
      name: 'lesson49',
      bands: [{ min: 7, rating: 3 }, { min: 5, rating: 2 }, { min: 1, rating: 1 }],
      scores: [0, 1, 5, 7]
    },
    {
      name: 'lesson50',
      bands: [{ min: 7, rating: 3 }, { min: 5, rating: 2 }, { min: 1, rating: 1 }],
      scores: [0, 1, 5, 7]
    },
    {
      name: 'soundmark-vs',
      bands: [{ min: 9, rating: 3 }, { min: 7, rating: 2 }, { min: 5, rating: 1 }],
      scores: [4, 5, 7, 9]
    },
    {
      name: 'soundmark-games',
      bands: [{ min: 5, rating: 3 }, { min: 4, rating: 2 }, { min: 3, rating: 1 }],
      scores: [2, 3, 4, 5]
    }
  ];

  for (const table of tables) {
    assert.deepEqual(
      table.scores.map(score => ratingFor(score, table.bands)),
      [0, 1, 2, 3],
      table.name
    );
  }
});
```

- [ ] **Step 2: Run the test and confirm the missing module**

Run:

```bash
node --test tests/unit/progress.test.js
```

Expected: FAIL with `Cannot find module '../../core/progress'`.

- [ ] **Step 3: Implement finite rating functions**

Create `core/progress.js`:

```javascript
(function attachProgress(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.progress = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function progressFactory() {
  'use strict';

  function clampRating(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(3, Math.trunc(number)));
  }

  function ratingFor(score, bands) {
    const number = Number(score);
    if (!Number.isFinite(number)) return 0;
    for (const band of bands) {
      if (number >= band.min) return clampRating(band.rating);
    }
    return 0;
  }

  function awardRating(ratings, id, rating) {
    const current = clampRating(ratings[id]);
    const candidate = clampRating(rating);
    if (candidate <= current) return { ratings: { ...ratings }, changed: false };
    return { ratings: { ...ratings, [id]: candidate }, changed: true };
  }

  function totalRatings(ratings, ids) {
    return ids.reduce((total, id) => total + clampRating(ratings[id]), 0);
  }

  function allAtLeast(ratings, ids, minimum) {
    const required = clampRating(minimum);
    return ids.every(id => clampRating(ratings[id]) >= required);
  }

  return Object.freeze({ ratingFor, awardRating, totalRatings, allAtLeast });
});
```

- [ ] **Step 4: Run rating tests**

Run:

```bash
node --test tests/unit/progress.test.js
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit finite progress rules**

```bash
git add core/progress.js tests/unit/progress.test.js
git commit -m "feat: add finite course rating rules"
```

---

### Task 4: Add first-attempt assessment state and stable option identity

**Files:**
- Create: `core/assessment.js`
- Create: `tests/unit/assessment.test.js`

**Interfaces:**
- Consumes: page-owned question arrays and an optional random-number function.
- Produces:
  - `createAttempt(): {firstTry:boolean, solved:boolean}`
  - `submitAttempt(state, correct): {state, accepted, solved, scored}`
  - `shuffleOptions(options, correctIndex, random): Array<{id,text,correct}>`

- [ ] **Step 1: Write failing assessment tests**

Create `tests/unit/assessment.test.js`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createAttempt,
  submitAttempt,
  shuffleOptions
} = require('../../core/assessment');

test('a wrong answer followed by a correct retry solves without scoring', () => {
  const wrong = submitAttempt(createAttempt(), false);
  const corrected = submitAttempt(wrong.state, true);

  assert.equal(wrong.scored, false);
  assert.equal(wrong.state.firstTry, false);
  assert.equal(corrected.solved, true);
  assert.equal(corrected.scored, false);
});

test('a first-try correct answer scores exactly once', () => {
  const correct = submitAttempt(createAttempt(), true);
  const duplicate = submitAttempt(correct.state, true);

  assert.equal(correct.scored, true);
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.scored, false);
});

test('shuffleOptions keeps semantic identity independent of output position', () => {
  const values = [0, 0, 0];
  const entries = shuffleOptions(['A', 'B', 'C', 'D'], 2, () => values.shift() ?? 0);
  const correct = entries.find(entry => entry.correct);

  assert.equal(correct.id, 2);
  assert.equal(correct.text, 'C');
  assert.notEqual(entries.indexOf(correct), correct.id);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/unit/assessment.test.js
```

Expected: FAIL with `Cannot find module '../../core/assessment'`.

- [ ] **Step 3: Implement assessment state and option entries**

Create `core/assessment.js`:

```javascript
(function attachAssessment(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.assessment = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function assessmentFactory() {
  'use strict';

  function createAttempt() {
    return { firstTry: true, solved: false };
  }

  function submitAttempt(state, correct) {
    if (state.solved) {
      return { state: { ...state }, accepted: false, solved: true, scored: false };
    }
    if (correct) {
      return {
        state: { firstTry: state.firstTry, solved: true },
        accepted: true,
        solved: true,
        scored: state.firstTry
      };
    }
    return {
      state: { firstTry: false, solved: false },
      accepted: true,
      solved: false,
      scored: false
    };
  }

  function shuffleOptions(options, correctIndex, random = Math.random) {
    const entries = options.map((text, id) => ({
      id,
      text,
      correct: id === correctIndex
    }));
    for (let index = entries.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [entries[index], entries[swap]] = [entries[swap], entries[index]];
    }
    return entries;
  }

  return Object.freeze({ createAttempt, submitAttempt, shuffleOptions });
});
```

- [ ] **Step 4: Run all core unit tests**

Run:

```bash
npm run test:unit
```

Expected: 13 tests pass.

- [ ] **Step 5: Commit the assessment contract**

```bash
git add core/assessment.js tests/unit/assessment.test.js
git commit -m "feat: model first-attempt assessment state"
```

---

### Task 5: Migrate Lesson 49 and the welcome page to v2 progress

**Files:**
- Modify: `index.html:793-818`
- Modify: `index.html:1033-1054`
- Modify: `index.html:1644-1669`
- Modify: `index.html:1863-1873`
- Modify: `home/index.html:200-221`
- Test: `tests/e2e/l49-progress.spec.js`
- Test: `tests/e2e/home-progress.spec.js`

**Interfaces:**
- Consumes:
  - `CanranCore.storage.loadProgress/saveProgress`
  - `CanranCore.progress.awardRating/totalRatings/allAtLeast/ratingFor`
- Produces:
  - v2 key `canran:l49:progress:v2`
  - `canIssueL49Certificate(): boolean`
  - `renderL49CertificateGate(): void`

- [ ] **Step 1: Write failing browser tests for corrupted legacy state and certificate gating**

Create `tests/e2e/l49-progress.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

test('Lesson 49 repairs legacy ratings and does not crash on negative values', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l49-stars-v1', JSON.stringify({
      l1: -1,
      l2: '2.9',
      l3: 999,
      l4: null,
      l5: 1
    }));
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');

  expect(errors).toEqual([]);
  await expect(page.locator('#st-l1')).toHaveText('☆☆☆');
  await expect(page.locator('#st-l2')).toHaveText('★★☆');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l49:progress:v2'))
  );
  expect(saved.ratings).toEqual({ l1: 0, l2: 2, l3: 3, l4: 0, l5: 1 });
  await expect(page.locator('#certBtn')).toBeDisabled();
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});

test('Lesson 49 certificate requires all five levels', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  });

  await page.goto('/');

  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).toBeVisible();
});
```

Create `tests/e2e/home-progress.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

test('welcome page reads normalized v2 totals', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
  });

  await page.goto('/home/');

  await expect(page.locator('#pt49')).toHaveText('15');
  await expect(page.locator('#pt50')).toHaveText('5');
  await expect(page.locator('#ptSM')).toHaveText('12');
});
```

- [ ] **Step 2: Run the tests and confirm current failures**

Run:

```bash
npm run test:e2e -- tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js
```

Expected:

- the first test reports a page `RangeError`;
- no v2 keys exist;
- certificate gating assertions fail.

- [ ] **Step 3: Load shared scripts and add a certificate status element**

In `index.html`, immediately before the existing main course `<script>` add:

```html
<script src="/core/storage.js"></script>
<script src="/core/progress.js"></script>
```

Inside `#certArea`, after `#certBtn`, add:

```html
<span id="certGateMsg" role="status" aria-live="polite"></span>
```

- [ ] **Step 4: Replace Lesson 49 storage and award logic**

Replace the `STAR_KEY`, `stars`, `getStar`, `starStr`, `totalStars`, `renderStars`, and
`award` block with:

```javascript
const STAR_KEY='canran:l49:progress:v2';
const LVLS=['l1','l2','l3','l4','l5'];
const l49Loaded=CanranCore.storage.loadProgress({
  storage:localStorage,
  key:STAR_KEY,
  legacyKey:'l49-stars-v1',
  ids:LVLS,
  legacyMode:'ratings'
});
let stars=l49Loaded.progress.ratings;
function getStar(l){return stars[l];}
function starStr(n){return '★'.repeat(n)+'☆'.repeat(3-n);}
function totalStars(){return CanranCore.progress.totalRatings(stars,LVLS);}
function canIssueL49Certificate(){return CanranCore.progress.allAtLeast(stars,LVLS,1);}
function renderL49CertificateGate(){
  const area=$('#certArea'),button=$('#certBtn'),message=$('#certGateMsg');
  const attemptedFinal=getStar('l5')>0;
  area.classList.toggle('hidden',!attemptedFinal);
  button.disabled=!canIssueL49Certificate();
  const missing=LVLS.filter(level=>getStar(level)<1).length;
  message.textContent=missing===0?'五关已完成，可以生成证书。':'还需完成 '+missing+' 个关卡。';
}
function persistStars(){
  const saved=CanranCore.storage.saveProgress({
    storage:localStorage,
    key:STAR_KEY,
    progress:{version:2,ratings:stars},
    ids:LVLS
  });
  stars=saved.progress.ratings;
}
function renderStars(){
  LVLS.forEach(l=>{const el=document.getElementById('st-'+l);if(el)el.textContent=starStr(getStar(l));});
  const t=totalStars();
  $('#starCount').textContent=t;
  $('#starFill').style.width=(t/15*100)+'%';
  renderL49CertificateGate();
}
function award(l,n){
  const awarded=CanranCore.progress.awardRating(stars,l,n);
  if(!awarded.changed)return;
  stars=awarded.ratings;
  persistStars();renderStars();sndStar();
}
```

- [ ] **Step 5: Make Lesson 49 zero-star and certificate branches honest**

In `finishEX()`, replace the rating assignment and unconditional award/show logic with:

```javascript
const st=CanranCore.progress.ratingFor(s,[
  {min:7,rating:3},
  {min:5,rating:2},
  {min:1,rating:1}
]);
if(st>0)award('l5',st);
renderStars();
```

Remove the unconditional:

```javascript
$('#certArea').classList.remove('hidden');
```

At the beginning of the `#certBtn` click handler add:

```javascript
if(!canIssueL49Certificate()){
  renderL49CertificateGate();
  return;
}
```

- [ ] **Step 6: Replace welcome-page progress loading**

Add before the existing `home/index.html` script:

```html
<script src="/core/storage.js"></script>
<script src="/core/progress.js"></script>
```

Replace `readStars`, `readIntStars`, and the three render calls with:

```javascript
const COURSE_LEVELS=['l1','l2','l3','l4','l5'];
const SOUND_LEVELS=['vs','g1','g2','g3'];
function loadTotal(key,legacyKey,ids,legacyMode){
  const result=CanranCore.storage.loadProgress({
    storage:localStorage,key,legacyKey,ids,legacyMode
  });
  return CanranCore.progress.totalRatings(result.progress.ratings,ids);
}
renderProg(loadTotal('canran:l49:progress:v2','l49-stars-v1',COURSE_LEVELS,'ratings'),'pf49','pt49','btn49');
renderProg(loadTotal('canran:l50:progress:v2','l50-stars-v1',COURSE_LEVELS,'ratings'),'pf50','pt50','btn50');
renderProg(loadTotal('canran:soundmark:progress:v2','phonics-magic-stars-v1',SOUND_LEVELS,'reset'),'pfSM','ptSM','btnSM',12);
```

- [ ] **Step 7: Run Lesson 49 and welcome tests**

Run:

```bash
npm run test:e2e -- tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js
npm run test:unit
```

Expected: all targeted tests and all unit tests pass.

- [ ] **Step 8: Commit the Lesson 49 migration**

```bash
git add index.html home/index.html tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js
git commit -m "fix: make lesson 49 progress self-consistent"
```

---

### Task 6: Repair Lesson 50 scoring, option identity, storage, and certificate gating

**Files:**
- Modify: `lesson50/index.html:711-735`
- Modify: `lesson50/index.html:975-996`
- Modify: `lesson50/index.html:1065-1116`
- Modify: `lesson50/index.html:1120-1178`
- Modify: `lesson50/index.html:1315-1411`
- Modify: `lesson50/index.html:1469-1542`
- Modify: `lesson50/index.html:1713-1727`
- Test: `tests/e2e/l50-assessment.spec.js`

**Interfaces:**
- Consumes all three shared core modules created in Tasks 2–4.
- Produces:
  - v2 key `canran:l50:progress:v2`
  - per-question `attempt` state in `LG`, `FD`, `POT`, and `DD`
  - stable `data-option-id` attributes in the final quiz
  - `canIssueL50Certificate(): boolean`

- [ ] **Step 1: Write the failing Lesson 50 regression test**

Create `tests/e2e/l50-assessment.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

async function installInstantAudio(page) {
  await page.addInitScript(() => {
    window.Audio = class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.currentTime = 0;
      }
      play() {
        setTimeout(() => this.dispatchEvent(new Event('ended')), 0);
        return Promise.resolve();
      }
      pause() {}
    };
  });
}

async function globalValue(page, expression) {
  return page.evaluate(code => window.eval(code), expression);
}

test('final quiz highlights the semantic correct answer after shuffle', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.locator('#quizStartBtn').click();
  const correct = await globalValue(page, 'QUIZ[QZ.idx].a');
  const wrong = correct === 0 ? 1 : 0;

  await page.locator(`#quizOpts [data-option-id="${wrong}"]`).click();

  await expect(page.locator(`#quizOpts [data-option-id="${correct}"]`)).toHaveClass(/good/);
});

test('listen challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => startListen());
  const correct = await globalValue(page, 'LG.cur.en');

  await page.locator('#lgOpts .opt-btn').evaluateAll((buttons, answer) => {
    buttons.find(button => button.dataset.en !== answer).click();
  }, correct);
  await expect.poll(() => globalValue(page, 'LG.lock')).toBe(false);
  await page.locator(`#lgOpts [data-en="${correct}"]`).click();

  await expect.poll(() => globalValue(page, 'LG.round')).toBe(1);
  expect(await globalValue(page, 'LG.score')).toBe(0);
});

test('feeding challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => resetFeed());
  const correct = await globalValue(page, 'TABLE[FD.idx].like');

  await page.locator(correct ? '#feedNo' : '#feedYes').click();
  await expect.poll(() => globalValue(page, 'FD.lock')).toBe(false);
  await page.locator(correct ? '#feedYes' : '#feedNo').click();

  await expect.poll(() => globalValue(page, 'FD.idx')).toBe(1);
  expect(await globalValue(page, 'FD.score')).toBe(0);
});

test('sorting-pot challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => resetPot());
  const correct = await globalValue(page, 'POT.order[POT.idx].pot');

  await page.locator('.pot').evaluateAll((buttons, answer) => {
    buttons.find(button => button.dataset.pot !== answer).click();
  }, correct);
  await expect.poll(() => globalValue(page, 'POT.lock')).toBe(false);
  await page.locator(`.pot[data-pot="${correct}"]`).click();

  await expect.poll(() => globalValue(page, 'POT.idx')).toBe(1);
  expect(await globalValue(page, 'POT.score')).toBe(0);
});

test('do-does challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => startDD());
  const correct = await globalValue(page, 'DD.order[DD.idx].does');

  await page.locator(correct ? '#ddDo' : '#ddDoes').click();
  await expect.poll(() => globalValue(page, 'DD.lock')).toBe(false);
  await page.locator(correct ? '#ddDoes' : '#ddDo').click();

  await expect.poll(() => globalValue(page, 'DD.idx')).toBe(1);
  expect(await globalValue(page, 'DD.score')).toBe(0);
});

test('corrupted Lesson 50 ratings are repaired without a page error', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l50-stars-v1', JSON.stringify({ l1: -1, l2: 8, l3: '2' }));
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/lesson50/');

  expect(errors).toEqual([]);
  await expect(page.locator('#st-l1')).toHaveText('☆☆☆');
  await expect(page.locator('#st-l2')).toHaveText('★★★');
  await expect(page.locator('#st-l3')).toHaveText('★★☆');
});

test('certificate remains disabled until all five levels have ratings', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 0, l5: 1 }
    }));
  });
  await page.goto('/lesson50/');
  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeDisabled();
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});
```

- [ ] **Step 2: Run the Lesson 50 test and verify all three failures**

Run:

```bash
npm run test:e2e -- tests/e2e/l50-assessment.spec.js
```

Expected:

- no `data-option-id` selector exists;
- corrupt ratings raise `RangeError`;
- certificate gating is not derived from all five levels.

- [ ] **Step 3: Load the shared modules and migrate Lesson 50 storage**

Before the main Lesson 50 script add:

```html
<script src="/core/storage.js"></script>
<script src="/core/progress.js"></script>
<script src="/core/assessment.js"></script>
```

Add this after `#certBtn`:

```html
<span id="certGateMsg" role="status" aria-live="polite"></span>
```

Replace the existing `STAR_KEY`, `stars`, `getStar`, `starStr`, `totalStars`, `renderStars`, and
`award` block with:

```javascript
const STAR_KEY='canran:l50:progress:v2';
const LVLS=['l1','l2','l3','l4','l5'];
const l50Loaded=CanranCore.storage.loadProgress({
  storage:localStorage,
  key:STAR_KEY,
  legacyKey:'l50-stars-v1',
  ids:LVLS,
  legacyMode:'ratings'
});
let stars=l50Loaded.progress.ratings;
function getStar(l){return stars[l];}
function starStr(n){return '★'.repeat(n)+'☆'.repeat(3-n);}
function totalStars(){return CanranCore.progress.totalRatings(stars,LVLS);}
function canIssueL50Certificate(){
  return CanranCore.progress.allAtLeast(stars,LVLS,1);
}
function renderL50CertificateGate(){
  const area=$('#certArea'),button=$('#certBtn'),message=$('#certGateMsg');
  const attemptedFinal=getStar('l5')>0;
  area.classList.toggle('hidden',!attemptedFinal);
  button.disabled=!canIssueL50Certificate();
  const missing=LVLS.filter(level=>getStar(level)<1).length;
  message.textContent=missing===0
    ?'五关已完成，可以领取证书。'
    :'还需完成 '+missing+' 个关卡。';
}
function persistStars(){
  const saved=CanranCore.storage.saveProgress({
    storage:localStorage,
    key:STAR_KEY,
    progress:{version:2,ratings:stars},
    ids:LVLS
  });
  stars=saved.progress.ratings;
}
function renderStars(){
  LVLS.forEach(l=>{
    const el=document.getElementById('st-'+l);
    if(el)el.textContent=starStr(getStar(l));
  });
  const total=totalStars();
  $('#starCount').textContent=total;
  $('#starFill').style.width=(total/15*100)+'%';
  renderL50CertificateGate();
}
function award(level,rating){
  const awarded=CanranCore.progress.awardRating(stars,level,rating);
  if(!awarded.changed)return;
  stars=awarded.ratings;
  persistStars();renderStars();sndStar();
}
```

- [ ] **Step 4: Add first-attempt state to all four retry challenges**

Change initial/reset state so each challenge owns an attempt:

```javascript
LG={round:0,score:0,order:shuffle(WORDS).slice(0,8),cur:null,lock:false,attempt:CanranCore.assessment.createAttempt()};
FD={idx:0,score:0,lock:false,attempt:CanranCore.assessment.createAttempt()};
POT={idx:0,score:0,lock:false,order:shuffle(POTS),attempt:CanranCore.assessment.createAttempt()};
DD={idx:0,score:0,lock:false,done:false,order:shuffle(DDS),attempt:CanranCore.assessment.createAttempt()};
```

In `ansLG`, replace direct score mutation with:

```javascript
const outcome=CanranCore.assessment.submitAttempt(LG.attempt,o.en===LG.cur.en);
LG.attempt=outcome.state;
if(outcome.solved){
  if(outcome.scored)LG.score++;
  b.classList.add('good');$('#lgScore').textContent=LG.score;sndCorrect();
  LG.round++;LG.attempt=CanranCore.assessment.createAttempt();
  setTimeout(nextLG,800);
}else{
  b.classList.add('bad','shake');sndWrong();
  setTimeout(()=>{b.classList.remove('bad','shake');LG.lock=false;},650);
}
```

In `feedAnswer`, compute and store the outcome before the branch:

```javascript
const outcome=CanranCore.assessment.submitAttempt(FD.attempt,guess===t.like);
FD.attempt=outcome.state;
if(outcome.solved){
  if(outcome.scored)FD.score++;
```

Immediately after `FD.idx++` reset:

```javascript
FD.attempt=CanranCore.assessment.createAttempt();
```

In `ansPot`, compute:

```javascript
const outcome=CanranCore.assessment.submitAttempt(POT.attempt,btn.dataset.pot===p.pot);
POT.attempt=outcome.state;
if(outcome.solved){
  if(outcome.scored)POT.score++;
```

Immediately after `POT.idx++` reset:

```javascript
POT.attempt=CanranCore.assessment.createAttempt();
```

In `ansDD`, compute:

```javascript
const outcome=CanranCore.assessment.submitAttempt(DD.attempt,pickDoes===d.does);
DD.attempt=outcome.state;
if(outcome.solved){
  if(outcome.scored)DD.score++;
```

Immediately after `DD.idx++` reset:

```javascript
DD.attempt=CanranCore.assessment.createAttempt();
```

Keep the existing feedback, animation, audio, and advancement code inside the corresponding
solved/wrong branches. Remove each old unconditional `score++`.

- [ ] **Step 5: Replace final-quiz DOM-position identity**

In `renderQ()`, replace the existing shuffled-index loop with:

```javascript
CanranCore.assessment.shuffleOptions(q.opts,q.a).forEach(entry=>{
  const b=document.createElement('button');
  b.className='opt-btn';
  b.dataset.optionId=String(entry.id);
  b.textContent=entry.text;
  b.addEventListener('click',()=>ansQ(b,entry.id));
  box.appendChild(b);
});
```

In the wrong-answer branch of `ansQ()`, replace DOM positional access with:

```javascript
box.querySelector('[data-option-id="'+q.a+'"]')?.classList.add('good');
```

- [ ] **Step 6: Enforce the Lesson 50 certificate gate**

After any rating award and during initialization call:

```javascript
renderL50CertificateGate();
```

At the start of the `#certBtn` handler add:

```javascript
if(!canIssueL50Certificate()){
  renderL50CertificateGate();
  return;
}
```

Replace the final-quiz-only visibility check with a call to the shared gate renderer. The area is
visible only when `getStar('l5')>0`, while the button is enabled only when every level is at least 1.

- [ ] **Step 7: Run Lesson 50 and full core tests**

Run:

```bash
npm run test:e2e -- tests/e2e/l50-assessment.spec.js
npm run test:unit
```

Expected: all targeted tests pass; all core tests remain green.

- [ ] **Step 8: Commit Lesson 50 state repair**

```bash
git add lesson50/index.html tests/e2e/l50-assessment.spec.js
git commit -m "fix: preserve first-attempt scoring in lesson 50"
```

---

### Task 7: Replace soundmark integer stars with four finite ratings

**Files:**
- Modify: `soundmark/index.html:438-506`
- Modify: `soundmark/index.html:647-658`
- Modify: `soundmark/index.html:726-752`
- Modify: `soundmark/index.html:856-980`
- Modify: `soundmark/index.html:1016-1022`
- Test: `tests/e2e/soundmark-progress.spec.js`

**Interfaces:**
- Consumes all three shared core modules.
- Produces:
  - v2 key `canran:soundmark:progress:v2`
  - finite challenge IDs `vs`, `g1`, `g2`, `g3`
  - `awardSoundmark(id, rating)`
  - `canIssueSoundmarkCertificate()`

- [ ] **Step 1: Write failing soundmark migration, gate, and print tests**

Create `tests/e2e/soundmark-progress.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

test('legacy integer stars reset once and cannot crash rendering', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('phonics-magic-stars-v1', '-1');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/soundmark/');

  expect(errors).toEqual([]);
  await expect(page.locator('#starCount')).toHaveText('0');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:soundmark:progress:v2'))
  );
  expect(saved.ratings).toEqual({ vs: 0, g1: 0, g2: 0, g3: 0 });
  expect(await page.evaluate(() => localStorage.getItem('phonics-magic-stars-v1'))).toBeNull();
});

test('soundmark certificate requires twelve finite stars and prints', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
    window.__printed = false;
    window.print = () => { window.__printed = true; };
  });

  await page.goto('/soundmark/');
  await page.locator('#certName').fill('小明');
  await expect(page.locator('#btnPrint')).toBeEnabled();
  await page.locator('#btnPrint').click();

  expect(await page.evaluate(() => window.__printed)).toBe(true);
});

test('eleven stars cannot issue the soundmark certificate', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 2 }
    }));
    window.__printed = false;
    window.print = () => { window.__printed = true; };
  });

  await page.goto('/soundmark/');

  await expect(page.locator('#starCount')).toHaveText('11');
  await expect(page.locator('#btnPrint')).toBeDisabled();
  await expect(page.locator('#certNeed')).toContainText('还差 1 颗星');
  await page.locator('#btnPrint').evaluate(button => { button.disabled = false; });
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printed)).toBe(false);
});
```

- [ ] **Step 2: Run the soundmark tests and verify current failures**

Run:

```bash
npm run test:e2e -- tests/e2e/soundmark-progress.spec.js
```

Expected: negative legacy stars throw, the new key is absent, the button is never eligibility-gated,
and clicking it does not call `window.print()`.

- [ ] **Step 3: Load core scripts and replace integer storage**

Before the main soundmark script add:

```html
<script src="/core/storage.js"></script>
<script src="/core/progress.js"></script>
<script src="/core/assessment.js"></script>
```

After `#btnPrint`, add:

```html
<div id="certNeed" role="status" aria-live="polite"></div>
```

Replace `SKEY`, integer `stars`, `renderStars`, and `addStar` with:

```javascript
const SKEY='canran:soundmark:progress:v2';
const SOUND_IDS=['vs','g1','g2','g3'];
const soundLoaded=CanranCore.storage.loadProgress({
  storage:localStorage,
  key:SKEY,
  legacyKey:'phonics-magic-stars-v1',
  ids:SOUND_IDS,
  legacyMode:'reset'
});
let soundRatings=soundLoaded.progress.ratings;
function soundTotal(){return CanranCore.progress.totalRatings(soundRatings,SOUND_IDS);}
function canIssueSoundmarkCertificate(){
  return CanranCore.progress.allAtLeast(soundRatings,SOUND_IDS,3);
}
function renderStars(){
  const total=soundTotal();
  document.getElementById('starCount').textContent=total;
  document.getElementById('certStars').textContent='★'.repeat(total)+'☆'.repeat(12-total);
  const missing=12-total;
  document.getElementById('btnPrint').disabled=!canIssueSoundmarkCertificate();
  document.getElementById('certNeed').textContent=missing===0
    ?'四项挑战满星，可以打印证书。'
    :'还差 '+missing+' 颗星。';
}
function awardSoundmark(id,rating){
  const awarded=CanranCore.progress.awardRating(soundRatings,id,rating);
  if(!awarded.changed)return;
  soundRatings=awarded.ratings;
  const saved=CanranCore.storage.saveProgress({
    storage:localStorage,
    key:SKEY,
    progress:{version:2,ratings:soundRatings},
    ids:SOUND_IDS
  });
  soundRatings=saved.progress.ratings;
  renderStars();
}
```

Move the first `renderStars()` call until after the `toast` function and `toastTimer` declaration.
Immediately before it add:

```javascript
if(soundLoaded.resetLegacy)toast('进度规则已升级，请重新挑战');
```

- [ ] **Step 4: Make the vowel/consonant challenge a finite ten-question round**

Replace the vowel/consonant quiz IIFE with:

```javascript
(function(){
  const target=document.getElementById('vsTarget'),fb=document.getElementById('vsFb');
  const picks=document.querySelectorAll('.vs-pick');
  let start=0,index=0,score=0,attempt=CanranCore.assessment.createAttempt(),finished=false;
  function begin(){
    start=Math.floor(Math.random()*VS_QUIZ.length);
    index=0;score=0;finished=false;attempt=CanranCore.assessment.createAttempt();
    next();
  }
  function next(){
    const item=VS_QUIZ[(start+index)%VS_QUIZ.length];
    target.textContent=item[0];
    fb.textContent='第 '+(index+1)+' / '+VS_QUIZ.length+' 题';
    fb.className='fb';
    picks.forEach(p=>p.classList.remove('right','wrong'));
  }
  function finish(){
    finished=true;
    const rating=CanranCore.progress.ratingFor(score,[
      {min:9,rating:3},{min:7,rating:2},{min:5,rating:1}
    ]);
    awardSoundmark('vs',rating);
    fb.textContent='本轮首次答对 '+score+' / 10，获得 '+rating+' 星。点击任意选项开始新一轮。';
    fb.className='fb good';
  }
  picks.forEach(p=>{
    p.onclick=()=>{
      if(finished){begin();return;}
      const correct=p.dataset.a===VS_QUIZ[(start+index)%VS_QUIZ.length][1];
      const outcome=CanranCore.assessment.submitAttempt(attempt,correct);
      attempt=outcome.state;
      if(!outcome.solved){
        p.classList.add('wrong');fb.textContent='再想想～';fb.className='fb bad';return;
      }
      if(outcome.scored)score++;
      p.classList.add('right');celebrate(p);
      index++;attempt=CanranCore.assessment.createAttempt();
      if(index===VS_QUIZ.length)setTimeout(finish,500);else setTimeout(next,500);
    };
  });
  begin();
})();
```

- [ ] **Step 5: Make each soundmark game a finite five-question first-attempt challenge**

In each game IIFE, replace `score` with:

```javascript
let cur=null,rounds=0,score=0,locked=false,attempt=CanranCore.assessment.createAttempt();
```

For game 1, replace `pick` with:

```javascript
function pick(b){
  if(locked||!cur||rounds>=5)return;
  const outcome=CanranCore.assessment.submitAttempt(attempt,b.dataset.sym===cur.sym);
  attempt=outcome.state;
  if(!outcome.solved){
    b.classList.add('wrong');fb.textContent='不对哦，再听一次试试！';fb.className='fb bad';return;
  }
  locked=true;b.classList.add('right');
  if(outcome.scored)score++;
  rounds++;scoreEl.textContent=`本关：${rounds} / 5`;
  fb.textContent=`答对啦！${cur.w} 里藏着 /${cur.sym}/`;fb.className='fb good';celebrate(b);
  attempt=CanranCore.assessment.createAttempt();
  if(rounds===5){
    const rating=CanranCore.progress.ratingFor(score,[{min:5,rating:3},{min:4,rating:2},{min:3,rating:1}]);
    awardSoundmark('g1',rating);gameDone('g1Score',rating);return;
  }
  setTimeout(round,1400);
}
```

For game 2, replace `pick` with:

```javascript
function pick(b){
  if(locked||!cur||rounds>=5)return;
  const outcome=CanranCore.assessment.submitAttempt(attempt,b.dataset.w===cur.w);
  attempt=outcome.state;
  if(!outcome.solved){
    b.classList.add('wrong');fb.textContent='再仔细听听，差别就在那个小音里！';fb.className='fb bad';return;
  }
  locked=true;b.classList.add('right');
  if(outcome.scored)score++;
  rounds++;scoreEl.textContent=`本关：${rounds} / 5`;
  fb.textContent='耳朵真灵！';fb.className='fb good';celebrate(b);
  attempt=CanranCore.assessment.createAttempt();
  if(rounds===5){
    const rating=CanranCore.progress.ratingFor(score,[{min:5,rating:3},{min:4,rating:2},{min:3,rating:1}]);
    awardSoundmark('g2',rating);gameDone('g2Score',rating);return;
  }
  setTimeout(round,1300);
}
```

For game 3, replace `pick` with:

```javascript
function pick(b,w){
  if(locked||!cur||rounds>=5)return;
  const outcome=CanranCore.assessment.submitAttempt(attempt,w===cur[1]);
  attempt=outcome.state;
  if(!outcome.solved){
    b.classList.add('wrong');fb.textContent='差一点点～把音标一个一个拼起来再试试！';fb.className='fb bad';return;
  }
  locked=true;b.classList.add('right');
  if(outcome.scored)score++;
  rounds++;scoreEl.textContent=`本关：${rounds} / 5`;
  fb.textContent=`拼读成功！${cur[0]} 就是 ${w}`;fb.className='fb good';celebrate(b);speak(w);
  attempt=CanranCore.assessment.createAttempt();
  if(rounds===5){
    const rating=CanranCore.progress.ratingFor(score,[{min:5,rating:3},{min:4,rating:2},{min:3,rating:1}]);
    awardSoundmark('g3',rating);gameDone('g3Score',rating);return;
  }
  setTimeout(round,1400);
}
```

Change `gameDone` to receive a rating:

```javascript
function gameDone(scoreId,rating){
  document.getElementById(scoreId).textContent=`本轮完成 · 获得 ${rating} 星`;
  toast('本轮完成，可以切换游戏或点击换一题重新开始');
}
```

In game 1, replace the `g1Next` handler with:

```javascript
document.getElementById('g1Next').onclick=()=>{
  if(rounds>=5){
    rounds=0;score=0;
    scoreEl.textContent='本关：0 / 5';
  }
  attempt=CanranCore.assessment.createAttempt();
  round();
};
```

In game 2, replace the `g2Next` handler with:

```javascript
document.getElementById('g2Next').onclick=()=>{
  if(rounds>=5){
    rounds=0;score=0;
    scoreEl.textContent='本关：0 / 5';
  }
  attempt=CanranCore.assessment.createAttempt();
  round();
};
```

In game 3, replace the `g3Next` handler with:

```javascript
document.getElementById('g3Next').onclick=()=>{
  if(rounds>=5){
    rounds=0;score=0;
    scoreEl.textContent='本关：0 / 5';
  }
  attempt=CanranCore.assessment.createAttempt();
  round();
};
```

- [ ] **Step 6: Enforce the soundmark certificate and real print action**

Replace `btnPrint.onclick` with:

```javascript
document.getElementById('btnPrint').onclick=()=>{
  const name=document.getElementById('certName').value.trim();
  if(!canIssueSoundmarkCertificate()){
    renderStars();toast('集满 12 颗星后才能打印证书');return;
  }
  if(!name){
    toast('先写上你的名字哦');document.getElementById('certName').focus();return;
  }
  celebrate(document.getElementById('certCard'));
  window.print();
};
```

- [ ] **Step 7: Run soundmark and full regression tests**

Run:

```bash
npm run test:unit
npm run test:e2e -- tests/e2e/soundmark-progress.spec.js tests/e2e/home-progress.spec.js
```

Expected: all tests pass; home shows soundmark totals from the new four-rating schema.

- [ ] **Step 8: Commit finite soundmark progress**

```bash
git add soundmark/index.html tests/e2e/soundmark-progress.spec.js
git commit -m "fix: make soundmark stars finite and idempotent"
```

---

### Task 8: Add CI and document the state-integrity verification contract

**Files:**
- Create: `.github/workflows/verify.yml`
- Create: `tests/README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: all tests created in Tasks 1–7.
- Produces: a required `verify` workflow that runs unit and Chromium tests on every push and pull request.

- [ ] **Step 1: Add explicit package scripts**

Update `package.json` scripts to:

```json
{
  "test:unit": "node --test tests/unit/*.test.js",
  "test:e2e": "playwright test",
  "test:state": "playwright test tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js tests/e2e/l50-assessment.spec.js tests/e2e/soundmark-progress.spec.js",
  "test": "npm run test:unit && npm run test:e2e"
}
```

- [ ] **Step 2: Create the CI workflow**

Create `.github/workflows/verify.yml`:

```yaml
name: verify

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:unit
      - run: npm run test:e2e
```

- [ ] **Step 3: Document exact local verification commands**

Create `tests/README.md`:

````markdown
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
`test:state` verifies the four pages against the repository-local static server.
`npm test` is the complete pre-commit gate.

The soundmark v1 integer cannot identify completed challenges. Its one-time v2 migration therefore
resets soundmark progress to zero. Lesson 49 and Lesson 50 preserve and clamp legacy level ratings.
````

- [ ] **Step 4: Run the complete state-integrity gate**

Run:

```bash
npm ci
npm run test:unit
npm run test:e2e
git diff --check
```

Expected:

- all unit tests pass;
- all Playwright tests pass;
- `git diff --check` prints no output.

- [ ] **Step 5: Commit CI and test documentation**

```bash
git add package.json package-lock.json .github/workflows/verify.yml tests/README.md
git commit -m "ci: verify state integrity regressions"
```

## Plan Exit Gate

Before starting the audio lifecycle plan, run:

```bash
npm test
git status --short
```

Expected:

- `npm test` exits 0;
- the working tree is clean;
- no page loads `l49-stars-v1`, `l50-stars-v1`, or `phonics-magic-stars-v1` except through
  the explicit migration arguments in `CanranCore.storage.loadProgress`;
- all current progress UI reads from v2 normalized ratings.
