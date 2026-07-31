# Lesson 51 Release Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Lesson 51 through the repository's complete release contract and replace its unsafe course-local state, certificate, font, and audio implementations while hardening CI and live artifact verification.

**Architecture:** A deeply frozen published-course registry becomes the source for build and route consumers, with contract tests keeping human-authored HTML, documentation, and Nginx configuration aligned. Lesson 51 reuses the existing storage, progress, assessment, and audio modules; the live verifier checks the manifest plus every runtime-retrievable artifact with bounded concurrency and response sizes.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js 20 CommonJS, `node:test`, Playwright 1.62.0, Nginx 1.28.0 Alpine, GitHub Actions.

## Global Constraints

- Keep production HTTP-only; do not add TLS, HSTS, certificates, or HTTP-to-HTTPS redirects.
- Name the remaining accepted transport risk `RISK-HTTP-01` and never report it as closed.
- Keep runtime package-free and preserve the existing Lesson 49, Lesson 50, soundmark, `/`, and `/home/` behavior.
- Use `canran:l51:progress:v2` with `l1` through `l5`; reset and remove `l51-stars-v1` without inferring ratings.
- Bound each rating to integer `0..3`; historical ratings may rise but never accumulate or fall.
- Award `l2` only when “自动播放全场” reaches the normal end of its final line.
- Read `superpowers:test-driven-development/writing-good-tests.md` before changing tests.
- For every production behavior, add the regression first and observe the expected failure before implementation.
- Do not edit anything under the project mirror's `sources/` directory.

---

### Task 1: Add the Published Course Registry

**Files:**
- Create: `scripts/course-registry.js`
- Create: `tests/unit/course-registry.test.js`

**Interfaces:**
- Produces: `PUBLISHED_COURSES`, a deeply frozen array of `{ id, route, entry, assetDirectories, title }`.
- Consumes: no repository runtime modules.
- Later tasks consume the registry from build scripts, live verification, and tests.

- [ ] **Step 1: Write the failing registry contract**

Create `tests/unit/course-registry.test.js` with a require inside the test so the
missing module is reported as an assertion failure:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

test('published course registry is complete, unique, and deeply frozen', () => {
  let registry;
  assert.doesNotThrow(() => {
    registry = require('../../scripts/course-registry');
  });

  const expected = [
    {
      id: 'lesson49',
      route: '/lesson49/',
      entry: 'lesson49/index.html',
      assetDirectories: ['lesson49/audio'],
      title: '肉店大冒险'
    },
    {
      id: 'lesson50',
      route: '/lesson50/',
      entry: 'lesson50/index.html',
      assetDirectories: ['lesson50/audio'],
      title: '挑食小王子大冒险'
    },
    {
      id: 'soundmark',
      route: '/soundmark/',
      entry: 'soundmark/index.html',
      assetDirectories: ['soundmark/audio'],
      title: '音标魔法乐园'
    },
    {
      id: 'lesson51',
      route: '/lesson51/',
      entry: 'lesson51/index.html',
      assetDirectories: ['lesson51/audio'],
      title: '希腊四季之旅'
    }
  ];

  assert.deepEqual(registry.PUBLISHED_COURSES, expected);
  assert.equal(Object.isFrozen(registry.PUBLISHED_COURSES), true);
  assert.equal(registry.PUBLISHED_COURSES.every(course =>
    Object.isFrozen(course) && Object.isFrozen(course.assetDirectories)
  ), true);
  assert.equal(new Set(expected.map(course => course.id)).size, expected.length);
  assert.equal(new Set(expected.map(course => course.route)).size, expected.length);
  assert.equal(new Set(expected.map(course => course.entry)).size, expected.length);
  assert.equal(expected.every(course => course.route.startsWith('/') &&
    course.route.endsWith('/') &&
    !path.posix.isAbsolute(course.entry)
  ), true);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/unit/course-registry.test.js
```

Expected: one failed test containing `Cannot find module '../../scripts/course-registry'`.

- [ ] **Step 3: Implement the deeply frozen registry**

Create `scripts/course-registry.js`:

```js
'use strict';

function course({ id, route, entry, assetDirectories, title }) {
  return Object.freeze({
    id,
    route,
    entry,
    assetDirectories: Object.freeze([...assetDirectories]),
    title
  });
}

const PUBLISHED_COURSES = Object.freeze([
  course({
    id: 'lesson49',
    route: '/lesson49/',
    entry: 'lesson49/index.html',
    assetDirectories: ['lesson49/audio'],
    title: '肉店大冒险'
  }),
  course({
    id: 'lesson50',
    route: '/lesson50/',
    entry: 'lesson50/index.html',
    assetDirectories: ['lesson50/audio'],
    title: '挑食小王子大冒险'
  }),
  course({
    id: 'soundmark',
    route: '/soundmark/',
    entry: 'soundmark/index.html',
    assetDirectories: ['soundmark/audio'],
    title: '音标魔法乐园'
  }),
  course({
    id: 'lesson51',
    route: '/lesson51/',
    entry: 'lesson51/index.html',
    assetDirectories: ['lesson51/audio'],
    title: '希腊四季之旅'
  })
]);

module.exports = { PUBLISHED_COURSES };
```

- [ ] **Step 4: Verify GREEN**

Run:

```bash
node --test tests/unit/course-registry.test.js
```

Expected: `1` test passed, `0` failed.

- [ ] **Step 5: Commit the registry**

```bash
git add scripts/course-registry.js tests/unit/course-registry.test.js
git commit -m "build: register published courses"
```

---

### Task 2: Drive the Static Build from the Registry

**Files:**
- Modify: `scripts/build-static.js:9-23`
- Modify: `scripts/build-static.js:375-398`
- Modify: `tests/deploy/static-build.test.js:10-132`

**Interfaces:**
- Consumes: `PUBLISHED_COURSES`.
- Produces: registry-derived `REQUIRED_FILES`, `REQUIRED_DIRECTORIES`, and `assertRegisteredLessonEntries(root)`.
- Preserves: current output-ownership, symlink, Git snapshot, and deterministic manifest protections.

- [ ] **Step 1: Add failing Lesson 51 and unknown-lesson build tests**

In `tests/deploy/static-build.test.js`, import the registry and derive
`PUBLIC_INPUTS`:

```js
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

const PUBLIC_INPUTS = [
  'index.html',
  'home/index.html',
  ...PUBLISHED_COURSES.flatMap(course => [
    course.entry,
    ...course.assetDirectories
  ]),
  'core',
  'assets'
];
```

Add these two strings to the file list inside `writeSyntheticPublicRoot()`:

```js
'lesson51/index.html',
'lesson51/audio/clip.mp3',
```

Extend the main artifact assertion with:

```js
'lesson51/index.html',
'lesson51/audio/a_pleasant_climate.mp3',
```

Then add:

```js
test('buildStatic rejects an unregistered lesson entry before creating output', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-unregistered-course-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(path.join(root, 'lesson-draft'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson-draft', 'index.html'), 'draft');
  execFileSync('git', ['add', 'lesson-draft/index.html'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
      'commit', '--quiet', '-m', 'add unregistered lesson'],
    { cwd: root }
  );

  await assert.rejects(
    buildStatic({ root, out }),
    /unregistered lesson entry: lesson-draft\/index\.html/
  );
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});
```

- [ ] **Step 2: Run the focused build test and verify RED**

Run:

```bash
node --test tests/deploy/static-build.test.js
```

Expected failures:

- `lesson51/index.html` is absent from the built artifact;
- the unregistered `lesson-draft/index.html` build resolves instead of rejecting.

- [ ] **Step 3: Derive build inputs and reject unregistered lessons**

At the top of `scripts/build-static.js`, require the registry and replace the
course-specific arrays:

```js
const { PUBLISHED_COURSES } = require('./course-registry');

const REQUIRED_FILES = Object.freeze([
  'index.html',
  'home/index.html',
  ...PUBLISHED_COURSES.map(course => course.entry)
]);
const REQUIRED_DIRECTORIES = Object.freeze([
  ...PUBLISHED_COURSES.flatMap(course => course.assetDirectories),
  'core'
]);
const OPTIONAL_DIRECTORIES = Object.freeze(['assets']);
const PUBLIC_INPUTS = Object.freeze([
  ...REQUIRED_FILES,
  ...REQUIRED_DIRECTORIES,
  ...OPTIONAL_DIRECTORIES
]);
```

Add the preflight:

```js
async function assertRegisteredLessonEntries(root) {
  const registered = new Set(PUBLISHED_COURSES.map(course => course.entry));
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('lesson')) continue;
    const relative = `${entry.name}/index.html`;
    const stat = await lstatIfExists(path.join(root, relative));
    if (stat && !registered.has(relative)) {
      throw new Error(`unregistered lesson entry: ${relative}`);
    }
  }
}
```

Invoke it in `buildStatic()` after output-safety checks and before validating or
removing output:

```js
await assertRegisteredLessonEntries(resolvedRoot);
```

- [ ] **Step 4: Verify GREEN and the full deploy tests**

Run:

```bash
node --test tests/deploy/static-build.test.js
npm run test:deploy
```

Expected: all static-build and deploy tests pass. The generated manifest
contains `lesson51/index.html` and every file under `lesson51/audio/`.

- [ ] **Step 5: Commit the build integration**

```bash
git add scripts/build-static.js tests/deploy/static-build.test.js
git commit -m "build: publish every registered course"
```

---

### Task 3: Close Every Human-Authored Publication Surface

**Files:**
- Create: `tests/deploy/publication-contract.test.js`
- Modify: `tests/e2e/routes.spec.js`
- Modify: `tests/e2e/smoke.spec.js`
- Modify: `tests/e2e/local-fonts.spec.js`
- Modify: `index.html`
- Modify: `lesson51/index.html:7-9`
- Modify: `lesson51/index.html:182-199`
- Modify: `README.md`
- Modify: `deploy/README.md`
- Modify: `deploy/nginx/canranstudio-http.conf`
- Modify: `tests/deploy/nginx-config.test.js`

**Interfaces:**
- Consumes: `PUBLISHED_COURSES`.
- Produces: a clickable Lesson 51 welcome card, `/lesson51` → `/lesson51/`
  redirect, same-origin fonts, and publication-surface contract coverage.
- Preserves: HTTP-only policy and the three `/home` compatibility redirects.

- [ ] **Step 1: Add failing publication and third-party-asset contracts**

Create `tests/deploy/publication-contract.test.js`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

const ROOT = path.resolve(__dirname, '../..');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('every published course appears in authored release surfaces', async () => {
  const [home, readme, runbook, nginx] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/nginx/canranstudio-http.conf'), 'utf8')
  ]);

  for (const course of PUBLISHED_COURSES) {
    assert.match(home, new RegExp(`href=["']${escapeRegExp(course.route)}["']`), course.id);
    assert.match(readme, new RegExp(escapeRegExp(course.route)), course.id);
    assert.match(runbook, new RegExp(escapeRegExp(course.route)), course.id);
    const slashless = course.route.slice(0, -1);
    assert.match(
      nginx,
      new RegExp(`location\\s*=\\s*${escapeRegExp(slashless)}\\s*\\{[\\s\\S]*?return\\s+308\\s+${escapeRegExp(course.route)};`),
      course.id
    );
  }
});

test('public HTML contains no third-party runtime asset URL', async () => {
  const entries = ['index.html', 'home/index.html',
    ...PUBLISHED_COURSES.map(course => course.entry)];
  const runtimeTag = /<(script|link|img|audio|video|source)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi;
  const external = [];

  for (const entry of entries) {
    const html = await fs.readFile(path.join(ROOT, entry), 'utf8');
    for (const match of html.matchAll(runtimeTag)) {
      if (/^(?:https?:)?\/\//i.test(match[2])) {
        external.push({ entry, tag: match[1], url: match[2] });
      }
    }
  }

  assert.deepEqual(external, []);
});
```

Modify the three E2E files to import:

```js
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');
```

In `routes.spec.js`, replace the handwritten route table and navigation-loop
course lists with:

```js
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routes = [
  { path: '/', title: /英语闯关乐园/ },
  ...PUBLISHED_COURSES.map(course => ({
    path: course.route,
    title: new RegExp(escapeRegExp(course.title))
  }))
];

test('welcome page and course pages form a closed navigation loop', async ({ page }) => {
  await page.goto('/');
  for (const course of PUBLISHED_COURSES) {
    await expect(page.locator(`a[href="${course.route}"]`)).toHaveCount(1);
  }
  for (const course of PUBLISHED_COURSES) {
    await page.goto(course.route);
    await expect(page.locator('a[href="/"]')).toHaveCount(1);
  }
});
```

In `smoke.spec.js`, use:

```js
const smokeRoutes = ['/', '/home/', ...PUBLISHED_COURSES.map(course => course.route)];
for (const path of smokeRoutes) {
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

In `local-fonts.spec.js`, replace:

```js
for (const route of ['/', '/lesson49/', '/lesson50/', '/soundmark/']) {
```

with:

```js
const fontRoutes = ['/', ...PUBLISHED_COURSES.map(course => course.route)];
for (const route of fontRoutes) {
```

Then replace:

```js
...(route === '/soundmark/' ? FREDOKA_FACES : BALOO_FACES)
```

with:

```js
...(['/soundmark/', '/lesson51/'].includes(route) ? FREDOKA_FACES : BALOO_FACES)
```

Leave the rest of the existing request, response, loaded-face, and expected-path
assertions byte-for-byte unchanged.

- [ ] **Step 2: Run focused contracts and verify RED**

Run:

```bash
node --test tests/deploy/publication-contract.test.js tests/deploy/nginx-config.test.js
npx playwright test tests/e2e/routes.spec.js tests/e2e/smoke.spec.js tests/e2e/local-fonts.spec.js
```

Expected failures identify:

- the missing Lesson 51 welcome link, README route, runbook route, and Nginx redirect;
- Lesson 51 Google Fonts requests;
- the missing Lesson 51 home link.

- [ ] **Step 3: Publish Lesson 51 on the welcome page**

Replace the “Coming Soon” card with an active `a51` card:

```html
<a class="card a51" href="/lesson51/" id="card51">
  <div class="card-inner">
    <div class="card-art"><span class="emoji-big">🏛️</span></div>
    <div class="card-body">
      <span class="card-tag">Lesson 51 · 第一册</span>
      <h2>希腊四季之旅</h2>
      <div class="en-sub">A Pleasant Climate</div>
      <div class="desc">跟着 Dimitri 学天气、季节、月份和频率词，完成五关成为希腊小导游！</div>
      <div class="feat"><span>🎧 听音挑词</span><span>🎭 课文剧场</span><span>🗓️ 月份归队</span><span>🪜 频率阶梯</span><span>🏆 导游证书</span></div>
      <div class="prog">
        <div class="prog-track"><div class="prog-fill" id="pf51"></div></div>
        <span class="prog-txt">⭐ <span id="pt51">0</span>/15</span>
      </div>
      <span class="go-btn" id="btn51">🚀 开始冒险</span>
    </div>
  </div>
</a>
```

Add these Lesson 51 card colors beside the existing `.a49`, `.a50`, and `.asm`
rules:

```css
.a51 .card-art{background:#DFF0FF}
.a51 .card-tag{background:#1D6FB8}
.a51 .go-btn{background:#1D6FB8}
```

Add the progress render call:

```js
renderProg(
  loadTotal('canran:l51:progress:v2', 'l51-stars-v1', COURSE_LEVELS, 'reset'),
  'pf51',
  'pt51',
  'btn51'
);
```

Replace the footer course list with:

```html
<div>🎪 英语闯关乐园 ｜ 新概念英语第一册互动课件 ｜ Lesson 49、50、51 · 音标第一课</div>
```

- [ ] **Step 4: Use local fonts and close Lesson 51 navigation**

Replace the three Google `<link>` elements with:

```html
<link rel="stylesheet" href="/assets/fonts/fonts.css">
```

Turn the topbar logo into a home link without changing its visible wording:

```html
<a class="logo logo-home" href="/" aria-label="返回课程首页">希腊<b>四季之旅</b></a>
```

Add:

```css
.logo-home{color:inherit;text-decoration:none}
```

- [ ] **Step 5: Update Nginx, documentation, and contract expectations**

Add:

```nginx
location = /lesson51 {
    return 308 /lesson51/;
}
```

In `tests/deploy/nginx-config.test.js`, append the exact redirect tuple to
`redirects`:

```js
['/lesson51', '/lesson51/']
```

Add this root README route bullet:

```markdown
- `/lesson51/` — 新概念英语 Lesson 51《A Pleasant Climate》
```

Replace the README certificate paragraph with:

```markdown
Certificate issue, print, and save entry points re-check their own course eligibility before they
act. The four course certificate experiences provide accessible, polite, atomic feedback. Lesson
51 requires at least one star in every level and prints only its certificate; Lesson 49 continues
to export through a Blob and revoke every object URL after preview closure or creation failure.
```

In `deploy/README.md`, make these exact prose replacements:

```text
not just the five live routes
→
including Lesson 51 HTML, its lesson51/audio/ tree, and all other manifest files

affecting /, /lesson49/, /lesson50/, or /soundmark/
→
affecting /, /lesson49/, /lesson50/, /lesson51/, or /soundmark/

It checks five 200 responses, exact bytes, headers, and release-manifest.json.
→
It compares release-manifest.json first, then checks every runtime-retrievable manifest file plus all three /home aliases.
```

Use these exact verification bullets in section 6:

```markdown
- `/lesson51/` returns the exact `lesson51/index.html` bytes;
- every manifest-declared Lesson 51 MP3 under `/lesson51/audio/` returns exact bytes;
```

Replace the two stale accepted-risk sentences with:

```text
RISK-HTTP-01 remains accepted and deferred.
```

Do not add HTTPS directives.

- [ ] **Step 6: Verify GREEN**

Run:

```bash
node --test tests/deploy/publication-contract.test.js tests/deploy/nginx-config.test.js
npx playwright test tests/e2e/routes.spec.js tests/e2e/smoke.spec.js tests/e2e/local-fonts.spec.js
```

Expected: all focused publication, route, smoke, and local-font tests pass with
no request to `fonts.googleapis.com` or `fonts.gstatic.com`.

- [ ] **Step 7: Commit publication surfaces**

```bash
git add index.html lesson51/index.html README.md deploy/README.md \
  deploy/nginx/canranstudio-http.conf tests/deploy/publication-contract.test.js \
  tests/deploy/nginx-config.test.js tests/e2e/routes.spec.js \
  tests/e2e/smoke.spec.js tests/e2e/local-fonts.spec.js
git commit -m "feat: publish lesson 51 through release surfaces"
```

---

### Task 4: Replace Lesson 51 Scalar Stars and Enforce Certificate Eligibility

**Files:**
- Create: `tests/e2e/l51-progress.spec.js`
- Modify: `lesson51/index.html:176-176`
- Modify: `lesson51/index.html:182-199`
- Modify: `lesson51/index.html:231-334`
- Modify: `lesson51/index.html:340-761`
- Modify: `package.json:14`

**Interfaces:**
- Consumes: `CanranCore.storage`, `CanranCore.progress`,
  `CanranCore.assessment`.
- Produces: `canIssueL51Certificate()`, `awardLevel(level, rating)`,
  `totalStars()`, and bounded `ratings`.
- Preserves: current lesson text, games, and five-level layout.

- [ ] **Step 1: Add storage and certificate regression helpers**

Create `tests/e2e/l51-progress.spec.js` with:

```js
'use strict';

const { test, expect } = require('@playwright/test');

const KEY = 'canran:l51:progress:v2';
const IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
const MONTH_TO_SEASON = {
  march: 'spring',
  april: 'spring',
  may: 'spring',
  june: 'summer',
  july: 'summer',
  august: 'summer',
  september: 'autumn',
  october: 'autumn',
  november: 'autumn',
  december: 'winter',
  january: 'winter',
  february: 'winter'
};
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

function progress(ratings) {
  return { version: 2, ratings };
}

async function storedRatings(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)).ratings, KEY);
}

async function completeListeningRun(page, wrongFirstCount) {
  for (let item = 0; item < 5; item += 1) {
    const options = page.locator('#lgOpts .lg-opt');
    await expect(options).toHaveCount(4);
    if (item < wrongFirstCount) await options.nth(1).click();
    await options.nth(0).click();
    if (item < 4) {
      await expect(page.locator('#lgNext')).toBeEnabled();
      await page.locator('#lgNext').click();
    }
  }
}

async function completeMonths(page, wrongFirstCount) {
  const months = await page.locator('#monthPool .mchip').evaluateAll(
    chips => chips.map(chip => chip.dataset.m)
  );
  expect(months).toHaveLength(12);
  for (const [index, month] of months.entries()) {
    await page.locator(`.mchip[data-m="${month}"]`).click();
    const correct = MONTH_TO_SEASON[month];
    if (index < wrongFirstCount) {
      const wrong = SEASONS.find(season => season !== correct);
      await page.locator(`.sbox[data-s="${wrong}"]`).click();
    }
    await page.locator(`.sbox[data-s="${correct}"]`).click();
  }
}

async function completeFrequencyRun(page, wrongFirstCount) {
  const cards = page.locator('#freqCards .fcard');
  await expect(cards).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const card = cards.nth(index);
    const correct = await card.getAttribute('data-lv');
    await card.click();
    if (index < wrongFirstCount) {
      const wrong = ['always', 'often', 'sometimes'].find(level => level !== correct);
      await page.locator(`.rung[data-f="${wrong}"]`).click();
    }
    await page.locator(`.rung[data-f="${correct}"]`).click();
  }
}

async function completeQuiz(page, wrongFirstCount) {
  for (let question = 0; question < 8; question += 1) {
    const answer = await page.evaluate(() => {
      const text = document.getElementById('qQ').textContent;
      return QUIZ.find(item => item.q === text).a;
    });
    const options = page.locator('#qOpts .q-opt');
    const optionCount = await options.count();
    if (question < wrongFirstCount) {
      await options.nth((answer + 1) % optionCount).click();
    }
    await options.nth(answer).click();
    if (question < 7) {
      await expect(page.locator('#qNext')).toBeEnabled();
      await page.locator('#qNext').click();
    }
  }
}
```

Add these tests:

```js
test('Lesson 51 resets a negative legacy scalar without crashing', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('l51-stars-v1', '-1'));

  await page.goto('/lesson51/');

  expect(errors).toEqual([]);
  expect(await storedRatings(page)).toEqual(Object.fromEntries(IDS.map(id => [id, 0])));
  expect(await page.evaluate(() => localStorage.getItem('l51-stars-v1'))).toBeNull();
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#btnPrint')).toBeDisabled();
});

test('Lesson 51 repairs corrupt v2 progress', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      ratings: { l1: -1, l2: 999999, l3: '3', l4: [], l5: null }
    }));
  }, KEY);
  await page.goto('/lesson51/');
  expect(errors).toEqual([]);
  expect(await storedRatings(page)).toEqual({ l1: 0, l2: 3, l3: 0, l4: 0, l5: 0 });
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 repairs invalid JSON', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{not-json'), KEY);
  await page.goto('/lesson51/');
  expect(await storedRatings(page)).toEqual(Object.fromEntries(IDS.map(id => [id, 0])));
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('Lesson 51 survives blocked storage', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[method] = () => {
        throw new DOMException('storage blocked', 'SecurityError');
      };
    }
  });
  await page.goto('/lesson51/');
  expect(errors).toEqual([]);
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#btnPrint')).toBeDisabled();
});

test('Lesson 51 certificate cannot be forged and eligible printing is real', async ({ page }) => {
  await page.addInitScript(key => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify({
        version: 2,
        ratings: { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 }
      }));
    }
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  }, KEY);
  await page.goto('/lesson51/');
  await page.locator('#certName').fill('测试学生');
  await page.evaluate(() => { document.getElementById('btnPrint').disabled = false; });
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(0);

  await page.evaluate(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  }, KEY);
  await page.reload();
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(0);
  await page.locator('#certName').fill('测试学生');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(1);
  await expect(page.locator('#certStars')).toHaveText(/^★{5}☆{10}$/);

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#cert')).toBeVisible();
  await expect(page.locator('#coursenav')).toBeHidden();
  await expect(page.locator('#btnPrint')).toBeHidden();
});

test('Lesson 51 quiz stores one historical rating instead of additive stars', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeQuiz(page, 1);
  expect((await storedRatings(page)).l5).toBe(2);
  await page.reload();
  await completeQuiz(page, 0);
  expect((await storedRatings(page)).l5).toBe(3);
  await page.reload();
  await completeQuiz(page, 8);
  expect((await storedRatings(page)).l5).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 listening ratings improve without accumulating', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/lesson51/');
  await completeListeningRun(page, 2);
  expect((await storedRatings(page)).l1).toBe(2);
  await page.reload();
  await completeListeningRun(page, 0);
  expect((await storedRatings(page)).l1).toBe(3);
  await page.reload();
  await completeListeningRun(page, 5);
  expect((await storedRatings(page)).l1).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 month ratings improve without accumulating', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeMonths(page, 3);
  expect((await storedRatings(page)).l3).toBe(2);
  await page.reload();
  await completeMonths(page, 0);
  expect((await storedRatings(page)).l3).toBe(3);
  await page.reload();
  await completeMonths(page, 12);
  expect((await storedRatings(page)).l3).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 frequency ratings improve without accumulating', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeFrequencyRun(page, 1);
  expect((await storedRatings(page)).l4).toBe(2);
  await page.reload();
  await completeFrequencyRun(page, 0);
  expect((await storedRatings(page)).l4).toBe(3);
  await page.reload();
  await completeFrequencyRun(page, 3);
  expect((await storedRatings(page)).l4).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});
```

These cases use the rendered options and the actual `data-m`, `data-s`,
`data-lv`, and `data-f` attributes. They never call `awardLevel()` from a test.

- [ ] **Step 2: Run the Lesson 51 tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js
```

Expected failures include the original `Invalid count value: -1`, absent v2
progress, an enabled zero-progress certificate action, zero `window.print()`
calls for eligible progress, and additive quiz totals.

- [ ] **Step 3: Load the existing public modules and replace scalar state**

Before the inline Lesson 51 script, add:

```html
<script src="/core/storage.js"></script>
<script src="/core/progress.js"></script>
<script src="/core/assessment.js"></script>
```

Replace `SKEY`, scalar `stars`, `addStar()`, and the old `renderStars()` with:

```js
const L51_KEY = 'canran:l51:progress:v2';
const L51_IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
const l51Loaded = CanranCore.storage.loadProgress({
  storage: localStorage,
  key: L51_KEY,
  legacyKey: 'l51-stars-v1',
  ids: L51_IDS,
  legacyMode: 'reset'
});
let ratings = l51Loaded.progress.ratings;

function totalStars() {
  return CanranCore.progress.totalRatings(ratings, L51_IDS);
}

function canIssueL51Certificate() {
  return CanranCore.progress.allAtLeast(ratings, L51_IDS, 1);
}

function persistRatings() {
  const saved = CanranCore.storage.saveProgress({
    storage: localStorage,
    key: L51_KEY,
    progress: { version: 2, ratings },
    ids: L51_IDS
  });
  ratings = saved.progress.ratings;
}

function awardLevel(level, rating) {
  const awarded = CanranCore.progress.awardRating(ratings, level, rating);
  if (!awarded.changed) return false;
  ratings = awarded.ratings;
  persistRatings();
  renderStars();
  return true;
}

function renderStars() {
  const total = totalStars();
  document.getElementById('starCount').textContent = total;
  document.getElementById('certStars').textContent =
    '★'.repeat(total) + '☆'.repeat(15 - total);
  const button = document.getElementById('btnPrint');
  button.disabled = !canIssueL51Certificate();
  document.getElementById('certGateMsg').textContent = button.disabled
    ? `还需完成 ${L51_IDS.filter(id => ratings[id] < 1).length} 个关卡。`
    : '五关已完成，可以打印证书。';
}

renderStars();
```

Replace the certificate action wrapper with:

```html
<div style="margin-top:26px">
  <button class="btn blue" id="btnPrint" disabled>打印我的证书</button>
  <p id="certGateMsg" role="status" aria-live="polite" aria-atomic="true"></p>
</div>
```

- [ ] **Step 4: Convert listening to first-attempt, bounded ratings**

Replace the listening-game IIFE with the following implementation. It keeps one
attempt per question, ends the run at five solved questions, and makes the
existing Next button an explicit, timer-cancelling advance/replay action:

```js
(function(){
  const ALLW = WORDS_A.concat(WORDS_B.map(([en,ipa,cn])=>[en,ipa,'n.',cn]));
  const opts = document.getElementById('lgOpts');
  const fb = document.getElementById('lgFb');
  const hear = document.getElementById('lgHear');
  const scoreEl = document.getElementById('lgScore');
  const nextButton = document.getElementById('lgNext');
  let cur = null;
  let solved = 0;
  let firstTryScore = 0;
  let attempt = null;
  let nextTimer = null;
  let runComplete = false;

  function shuffle(a){
    return a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
  }
  function clearNextTimer(){
    if(nextTimer !== null){
      clearTimeout(nextTimer);
      nextTimer = null;
    }
  }
  function finishRun(){
    runComplete = true;
    clearNextTimer();
    awardLevel('l1', CanranCore.progress.ratingFor(firstTryScore, [
      {min:5,rating:3},
      {min:3,rating:2},
      {min:0,rating:1}
    ]));
    nextButton.disabled = false;
    nextButton.textContent = '再来一轮';
    scoreEl.textContent = `本关：5 / 5 · 首次答对 ${firstTryScore}`;
    toast('单词关通过！去看课文剧场吧');
  }
  function round(){
    clearNextTimer();
    attempt = CanranCore.assessment.createAttempt();
    nextButton.disabled = true;
    nextButton.textContent = '下一题';
    fb.textContent = '';
    fb.className = 'fb';
    opts.innerHTML = '';
    cur = ALLW[Math.floor(Math.random()*ALLW.length)];
    const distract = shuffle(ALLW.filter(w=>w[0]!==cur[0])).slice(0,3);
    shuffle([cur].concat(distract)).forEach(w=>{
      const button = document.createElement('button');
      button.className = 'lg-opt';
      button.innerHTML = `${w[0]}<br><small style="font-size:13px;opacity:.6">${w[3]}</small>`;
      button.onclick = ()=>pick(button,w);
      opts.appendChild(button);
    });
  }
  function play(){
    if(cur){
      hear.classList.add('playing');
      speak(cur[0],0.8,()=>hear.classList.remove('playing'));
    }
  }
  function pick(button,word){
    if(!attempt || attempt.solved || runComplete || !cur) return;
    const correct = word[0] === cur[0];
    const outcome = CanranCore.assessment.submitAttempt(attempt,correct);
    attempt = outcome.state;
    if(!outcome.accepted) return;
    if(!correct){
      button.classList.add('wrong');
      fb.textContent = '不对哦，再听一次～';
      fb.className = 'fb bad';
      return;
    }
    if(outcome.scored) firstTryScore += 1;
    solved += 1;
    button.classList.add('right');
    opts.querySelectorAll('button').forEach(option=>{ option.disabled = true; });
    scoreEl.textContent = `本关：${solved} / 5`;
    fb.textContent = `答对啦！${cur[0]} 就是「${cur[3]}」`;
    fb.className = 'fb good';
    celebrate(button);
    if(solved === 5){
      finishRun();
      return;
    }
    nextButton.disabled = false;
    nextTimer = setTimeout(round,1400);
  }
  hear.onclick = play;
  nextButton.onclick = ()=>{
    if(runComplete){
      solved = 0;
      firstTryScore = 0;
      runComplete = false;
      round();
      return;
    }
    if(!attempt || !attempt.solved) return;
    clearNextTimer();
    round();
  };
  round();
})();
```

- [ ] **Step 5: Align the frequency dataset with the approved three-card rule**

Replace the six-item `FREQ` constant with exactly one representative card per
approved frequency category:

```js
const FREQ = [
  ['The sun shines every day.','always'],
  ["It's often windy in March.",'often'],
  ['It rains sometimes.','sometimes']
];
```

- [ ] **Step 6: Convert month placement to first-attempt ratings**

Replace the month-game IIFE with:

```js
(function(){
  const pool = document.getElementById('monthPool');
  const fb = document.getElementById('mgFb');
  const months = Object.keys(MONTH2SEASON);
  const attempts = new Map(months.map(month=>[
    month,
    CanranCore.assessment.createAttempt()
  ]));
  let sel = null;
  let done = 0;
  let firstTryScore = 0;

  months.map(m=>[Math.random(),m]).sort((a,b)=>a[0]-b[0]).forEach(([_,m])=>{
    const chip = document.createElement('button');
    chip.className = 'mchip';
    chip.textContent = m[0].toUpperCase()+m.slice(1);
    chip.dataset.m = m;
    chip.onclick = ()=>{
      if(chip.classList.contains('in')) return;
      speak(m,0.8);
      pool.querySelectorAll('.mchip').forEach(item=>item.classList.remove('sel'));
      sel = m;
      chip.classList.add('sel');
      fb.textContent = `要把 ${chip.textContent} 放到哪个季节？`;
      fb.className = 'fb';
    };
    pool.appendChild(chip);
  });

  document.querySelectorAll('.sbox').forEach(box=>{
    box.onclick = ()=>{
      if(!sel){
        fb.textContent = '先点一个月份卡片哦';
        fb.className = 'fb bad';
        return;
      }
      const chip = document.querySelector(`.mchip[data-m="${sel}"]`);
      const correct = MONTH2SEASON[sel] === box.dataset.s;
      const outcome = CanranCore.assessment.submitAttempt(attempts.get(sel),correct);
      attempts.set(sel,outcome.state);
      if(!correct){
        chip.classList.add('wrong');
        setTimeout(()=>chip.classList.remove('wrong'),400);
        fb.textContent = '不对哦，想想课文里怎么说的？';
        fb.className = 'fb bad';
        return;
      }
      if(!outcome.accepted) return;
      if(outcome.scored) firstTryScore += 1;
      box.querySelector('.slot').appendChild(chip);
      chip.classList.remove('sel');
      chip.classList.add('in');
      celebrate(chip);
      done += 1;
      fb.textContent = `对啦！${chip.textContent} 属于 ${box.dataset.s}！`;
      fb.className = 'fb good';
      sel = null;
      if(done === months.length){
        awardLevel('l3', CanranCore.progress.ratingFor(firstTryScore, [
          {min:12,rating:3},
          {min:9,rating:2},
          {min:0,rating:1}
        ]));
        fb.textContent = `12 个月全部归队！首次放对 ${firstTryScore} 个。`;
        toast('月份归队完成！');
      }
    };
  });
})();
```

- [ ] **Step 7: Convert frequency placement to first-attempt ratings**

Replace the frequency-game IIFE with:

```js
(function(){
  const box = document.getElementById('freqCards');
  const fb = document.getElementById('fqFb');
  const attempts = new Map();
  let sel = null;
  let done = 0;
  let firstTryScore = 0;

  FREQ.map(f=>[Math.random(),f]).sort((a,b)=>a[0]-b[0]).forEach(([_,[en,lv]])=>{
    const card = document.createElement('button');
    card.className = 'fcard';
    card.dataset.lv = lv;
    card.innerHTML = `<span>「${en}」</span><span class="arrow">→ 送到哪个台阶？</span>`;
    attempts.set(card,CanranCore.assessment.createAttempt());
    card.onclick = ()=>{
      if(card.classList.contains('done')) return;
      speak(en,0.85);
      box.querySelectorAll('.fcard').forEach(item=>item.classList.remove('sel'));
      sel = card;
      card.classList.add('sel');
    };
    box.appendChild(card);
  });

  document.querySelectorAll('.rung').forEach(rung=>{
    rung.onclick = ()=>{
      if(!sel){
        fb.textContent = '先点一个句子卡片哦';
        fb.className = 'fb bad';
        return;
      }
      const correct = sel.dataset.lv === rung.dataset.f;
      const outcome = CanranCore.assessment.submitAttempt(attempts.get(sel),correct);
      attempts.set(sel,outcome.state);
      if(!correct){
        fb.textContent = sel.dataset.lv === 'always'
          ? '它说的是「每一天」，应该站最高！'
          : (sel.dataset.lv === 'sometimes'
            ? '句子里有 sometimes，是最低台阶哦'
            : '再想想，often 是「常常」');
        fb.className = 'fb bad';
        return;
      }
      if(!outcome.accepted) return;
      if(outcome.scored) firstTryScore += 1;
      sel.classList.remove('sel');
      sel.classList.add('done');
      celebrate(rung);
      done += 1;
      fb.textContent = '放得对！';
      fb.className = 'fb good';
      sel = null;
      if(done === FREQ.length){
        awardLevel('l4', CanranCore.progress.ratingFor(firstTryScore, [
          {min:3,rating:3},
          {min:2,rating:2},
          {min:0,rating:1}
        ]));
        fb.textContent = `全部放对！首次放对 ${firstTryScore} 个。`;
        toast('频率阶梯通过！');
      }
    };
  });
})();
```

- [ ] **Step 8: Convert the final quiz to first-attempt ratings**

Replace the quiz subtitle with:

```html
<p class="sec-sub">完成八题即可过关；首次答对越多，本关评级越高。</p>
```

Replace the quiz IIFE with:

```js
(function(){
  let qi = 0;
  let firstTryScore = 0;
  let attempts = QUIZ.map(()=>CanranCore.assessment.createAttempt());
  const qQ = document.getElementById('qQ');
  const qSub = document.getElementById('qSub');
  const qOpts = document.getElementById('qOpts');
  const fb = document.getElementById('qFb');
  const scoreEl = document.getElementById('qScore');
  const nextButton = document.getElementById('qNext');

  function load(){
    fb.textContent = '';
    fb.className = 'fb';
    qOpts.innerHTML = '';
    nextButton.disabled = true;
    nextButton.textContent = '下一题';
    const question = QUIZ[qi];
    qQ.textContent = question.q;
    qSub.textContent = question.sub || '';
    scoreEl.textContent =
      `第 ${qi+1} / ${QUIZ.length} 题 · 首次答对 ${firstTryScore}`;
    question.opts.forEach((option,index)=>{
      const button = document.createElement('button');
      button.className = 'q-opt';
      button.textContent = option;
      button.onclick = ()=>{
        const correct = index === question.a;
        const outcome = CanranCore.assessment.submitAttempt(attempts[qi],correct);
        attempts[qi] = outcome.state;
        if(!outcome.accepted) return;
        if(!correct){
          button.classList.add('wrong');
          fb.textContent = '再想想～可以回到前面的关卡看看';
          fb.className = 'fb bad';
          return;
        }
        if(outcome.scored) firstTryScore += 1;
        button.classList.add('right');
        qOpts.querySelectorAll('button').forEach(item=>{ item.disabled = true; });
        scoreEl.textContent =
          `第 ${qi+1} / ${QUIZ.length} 题 · 首次答对 ${firstTryScore}`;
        fb.textContent = '答对啦！';
        fb.className = 'fb good';
        celebrate(button);
        nextButton.disabled = false;
        if(qi === QUIZ.length-1){
          awardLevel('l5', CanranCore.progress.ratingFor(firstTryScore, [
            {min:8,rating:3},
            {min:6,rating:2},
            {min:0,rating:1}
          ]));
          nextButton.textContent = '再来一轮';
          toast('考核完成！去领证书吧');
        }
      };
      qOpts.appendChild(button);
    });
  }

  nextButton.onclick = ()=>{
    if(nextButton.disabled) return;
    if(qi < QUIZ.length-1){
      qi += 1;
    }else{
      qi = 0;
      firstTryScore = 0;
      attempts = QUIZ.map(()=>CanranCore.assessment.createAttempt());
      toast('新一轮考核开始');
    }
    load();
  };
  load();
})();
```

- [ ] **Step 9: Enforce and print the certificate**

Add print CSS:

```css
@media print{
  body *{visibility:hidden!important}
  #cert,#cert *{visibility:visible!important}
  #cert{position:absolute;inset:0;padding:0;max-width:none}
  #certCard{box-shadow:none;margin:0 auto}
  #certName{border:0}
  #btnPrint,#certGateMsg,#cert>.tag,#cert>.sec-title,#cert>.sec-sub{display:none!important}
}
```

Replace the click handler:

```js
document.getElementById('btnPrint').onclick = () => {
  if (!canIssueL51Certificate()) {
    renderStars();
    toast('完成五关后才能打印证书');
    return;
  }
  const name = document.getElementById('certName').value.trim();
  if (!name) {
    toast('先写上你的名字哦');
    document.getElementById('certName').focus();
    return;
  }
  renderStars();
  document.getElementById('certDate').textContent =
    '日期：' + new Date().toLocaleDateString('zh-CN');
  celebrate(document.getElementById('certCard'));
  window.print();
};
```

Add the same live-region attributes to the existing toast and four feedback
elements:

```html
<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
<div class="fb" id="lgFb" role="status" aria-live="polite" aria-atomic="true"></div>
<div class="fb" id="mgFb" role="status" aria-live="polite" aria-atomic="true" style="text-align:center"></div>
<div class="fb" id="fqFb" role="status" aria-live="polite" aria-atomic="true" style="text-align:center"></div>
<div class="fb" id="qFb" role="status" aria-live="polite" aria-atomic="true"></div>
```

- [ ] **Step 10: Add Lesson 51 to the state test script and verify GREEN**

Change `package.json`:

```json
"test:state": "playwright test tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js tests/e2e/l50-assessment.spec.js tests/e2e/soundmark-progress.spec.js tests/e2e/l51-progress.spec.js"
```

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js
npm run test:state
```

Expected: all Lesson 51 and existing state tests pass, with totals bounded to
15 and no page error from storage values.

- [ ] **Step 11: Commit state and certificate remediation**

```bash
git add lesson51/index.html tests/e2e/l51-progress.spec.js package.json
git commit -m "fix: bound lesson 51 progress and certificates"
```

---

### Task 5: Replace the Lesson 51 Audio State Machine

**Files:**
- Create: `tests/e2e/l51-audio.spec.js`
- Modify: `lesson51/index.html:340`
- Modify: `lesson51/index.html:397-461`
- Modify: `lesson51/index.html:577-640`

**Interfaces:**
- Consumes: `CanranCore.audio.createAudioPlayer()` and
  `CanranCore.audio.slugify()`.
- Produces: `manualSpeak(text, rate, onFinish)`, `startPlayAll()`,
  `stopPlayAll()`.
- Guarantees: exactly one active request, stale generation isolation, and `l2`
  award only after final-line `ended`.

- [ ] **Step 1: Add a deterministic browser Audio harness**

Create `tests/e2e/l51-audio.spec.js` with this harness and the regression
cases:

```js
'use strict';

const { test, expect } = require('@playwright/test');

async function installMockAudio(page, { speech = 'unsupported' } = {}) {
  await page.addInitScript(({ speechMode }) => {
    window.__mockAudios = [];

    class MockAudio {
      constructor(src) {
        this.src = src;
        this.currentTime = 0;
        this.paused = false;
        this.listeners = new Map();
        window.__mockAudios.push(this);
      }
      addEventListener(type, listener, options = {}) {
        const listeners = this.listeners.get(type) || [];
        listeners.push({ listener, once: Boolean(options && options.once) });
        this.listeners.set(type, listeners);
      }
      removeEventListener(type, listener) {
        this.listeners.set(
          type,
          (this.listeners.get(type) || []).filter(entry => entry.listener !== listener)
        );
      }
      play() {
        this.paused = false;
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
      emit(type) {
        for (const entry of [...(this.listeners.get(type) || [])]) {
          entry.listener.call(this, { type, target: this });
          if (entry.once) this.removeEventListener(type, entry.listener);
        }
      }
    }

    window.Audio = MockAudio;
    if (speechMode === 'pending') {
      class MockUtterance {
        constructor(text) {
          this.text = text;
          this.onend = null;
          this.onerror = null;
        }
      }
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: MockUtterance
      });
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: {
          addEventListener() {},
          getVoices() { return []; },
          speak(utterance) { this.lastUtterance = utterance; },
          cancel() { this.cancelled = true; }
        }
      });
    } else {
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: undefined
      });
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: null
      });
    }
  }, { speechMode: speech });
}

async function storyRating(page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l51:progress:v2')).ratings.l2
  );
}

test('manual speech cancels play-all and clears stale line state', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await expect(page.locator('.line.playing')).toHaveCount(1);

  await page.evaluate(() => document.getElementById('heroQ').click());
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(2);
  await page.evaluate(() => window.__mockAudios.at(-1).emit('ended'));
  await page.waitForTimeout(700);

  await expect(page.locator('.line.playing')).toHaveCount(0);
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(2);
  expect(await page.evaluate(() => window.__mockAudios[0].paused)).toBe(true);
});

test('only uninterrupted final-line completion awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  const lineCount = await page.locator('#scenes .line').count();
  await page.locator('#playAll').click();

  for (let index = 0; index < lineCount; index += 1) {
    expect(await page.evaluate(() => window.__mockAudios.length)).toBe(index + 1);
    await page.evaluate(i => window.__mockAudios[i].emit('ended'), index);
    if (index === lineCount - 2) expect(await storyRating(page)).toBe(0);
    if (index < lineCount - 1) await page.waitForTimeout(550);
  }

  expect(await storyRating(page)).toBe(3);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});

test('audio error with unsupported fallback never awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.evaluate(() => window.__mockAudios[0].emit('error'));

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});

test('manual stop never awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.locator('#stopAll').click();

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
  expect(await page.evaluate(() => window.__mockAudios[0].paused)).toBe(true);
});

test('speech timeout never awards story theatre', async ({ page }) => {
  await installMockAudio(page, { speech: 'pending' });
  await page.clock.install();
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.evaluate(() => window.__mockAudios[0].emit('error'));
  await page.clock.fastForward(60_000);

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});
```

- [ ] **Step 2: Run the audio tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/l51-audio.spec.js
```

Expected: the interruption test retains one `.line.playing`, the full run does
not write `ratings.l2`, timeout/error paths do not settle consistently, and the
old implementation does not use the shared player lifecycle.

- [ ] **Step 3: Load and configure the shared audio player**

Add:

```html
<script src="/core/audio-player.js"></script>
```

Replace the existing block from `speechOK` through the old `speak()` with one
safe voice selector, one player, and one request factory:

```js
const UK_VOICE_KEYS = [
  'google uk english','united kingdom','daniel','kate','serena','stephanie',
  'arthur','martha','libby','sonja','ryan'
];
let ukVoice = null;

function pickBritishVoice() {
  const synthesis = window.speechSynthesis;
  if(!synthesis || typeof synthesis.getVoices !== 'function') return null;
  const voices = synthesis.getVoices() || [];
  const isGB = voice =>
    (voice.lang || '').replace(/_/g,'-').toLowerCase().startsWith('en-gb');
  return voices.find(voice =>
    isGB(voice) &&
    UK_VOICE_KEYS.some(key=>(voice.name || '').toLowerCase().includes(key))
  ) || voices.find(isGB) || null;
}

if(window.speechSynthesis &&
   typeof window.speechSynthesis.addEventListener === 'function'){
  ukVoice = pickBritishVoice();
  window.speechSynthesis.addEventListener('voiceschanged',()=>{
    ukVoice = pickBritishVoice();
  });
}

const lesson51Audio = CanranCore.audio.createAudioPlayer();

function audioRequest(text, rate, onFinish) {
  const value = String(text);
  const source = CanranCore.audio.slugify(value);
  return {
    text: value,
    src: source ? `/lesson51/audio/${source}.mp3` : '',
    rate: Number.isFinite(rate) ? rate : 0.85,
    voice: ukVoice || pickBritishVoice(),
    onFinish
  };
}
```

- [ ] **Step 4: Implement generation-safe manual and automatic playback**

Use:

```js
let playAllGeneration = 0;
let playAllTimer = null;
let playingAll = false;

function clearPlayingLines() {
  document.querySelectorAll('.line').forEach(line => line.classList.remove('playing'));
}

function stopPlayAll() {
  playAllGeneration += 1;
  playingAll = false;
  if (playAllTimer !== null) {
    clearTimeout(playAllTimer);
    playAllTimer = null;
  }
  clearPlayingLines();
  lesson51Audio.stop('cancelled');
}

function manualSpeak(text, rate, onFinish) {
  stopPlayAll();
  return lesson51Audio.play(audioRequest(text, rate, result => {
    if (result.reason === 'unsupported') toast('当前浏览器不支持语音朗读');
    if (onFinish) onFinish(result);
  }));
}

function startPlayAll() {
  stopPlayAll();
  const generation = ++playAllGeneration;
  const lines = Array.from(document.querySelectorAll('#scenes .line'));
  if(lines.length === 0) return;
  playingAll = true;

  function playLine(index) {
    if (!playingAll || generation !== playAllGeneration) return;
    const line = lines[index];
    clearPlayingLines();
    line.classList.add('playing');
    line.scrollIntoView({ block: 'center', behavior: 'smooth' });
    lesson51Audio.play(audioRequest(line.dataset.en, 0.85, result => {
      if (generation !== playAllGeneration) return;
      line.classList.remove('playing');
      if (result.reason !== 'ended') {
        playingAll = false;
        return;
      }
      if (index === lines.length - 1) {
        playingAll = false;
        awardLevel('l2', 3);
        return;
      }
      playAllTimer = setTimeout(() => {
        playAllTimer = null;
        playLine(index + 1);
      }, 500);
    }));
  }

  playLine(0);
}
```

For every manual trigger in the word-card, listening, hero, month, frequency,
and individual-scene handlers, make this exact call-name substitution while
preserving its existing arguments:

```text
speak(  ->  manualSpeak(
```

Replace the individual scene-line handler so it does not call `stopPlayAll()`
twice:

```js
b.onclick = ()=>{
  manualSpeak(en,0.85,()=>b.classList.remove('playing'));
  if(lesson51Audio.isActive()) b.classList.add('playing');
};
```

Replace the two automatic-play assignments with:

```js
document.getElementById('playAll').onclick = startPlayAll;
document.getElementById('stopAll').onclick = stopPlayAll;
```

After the replacement, this audit must return only `manualSpeak`, `startPlayAll`,
and the shared player calls—never an old `speak` definition or invocation:

```bash
rg -n "\bspeak\b|manualSpeak|startPlayAll|lesson51Audio\.play" lesson51/index.html
```

- [ ] **Step 5: Verify GREEN and shared-player compatibility**

Run:

```bash
npx playwright test tests/e2e/l51-audio.spec.js tests/e2e/audio-lifecycle.spec.js
node --test tests/unit/audio-player.test.js
```

Expected: all Lesson 51 interruption/completion tests and all existing shared
audio lifecycle tests pass.

- [ ] **Step 6: Commit the audio remediation**

```bash
git add lesson51/index.html tests/e2e/l51-audio.spec.js
git commit -m "fix: use shared audio lifecycle in lesson 51"
```

---

### Task 6: Verify Every Runtime-Retrievable Manifest Artifact

**Files:**
- Modify: `scripts/verify-live.js`
- Modify: `tests/deploy/live-verifier.test.js`

**Interfaces:**
- Consumes: local `release-manifest.json`, `PUBLISHED_COURSES`,
  `HTTP_HEADER_CONTRACT`.
- Produces: `verifyBase({ baseUrl, root, fetchImpl, concurrency, timeoutMs, maxBytes })`.
- Constants: concurrency `8`, timeout `10_000` ms, maximum response `8 * 1024 * 1024` bytes.
- Exception: `home/index.html` bytes remain pre-deployment-only; live checks
  `/home`, `/home/`, and `/home/index.html` redirect behavior.

- [ ] **Step 1: Rewrite fixtures around a real manifest**

Replace the old route-only fixture with the following manifest fixture and
fetch double. Add `node:crypto` and the registry to the test imports, and
replace the existing verifier destructuring line with the one shown here.

```js
const crypto = require('node:crypto');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');
const { verifyBase, ROUTES, HTTP_HEADER_CONTRACT } = verifier;

const EXPECTED_ROUTES = [
  { path: '/', file: 'index.html' },
  ...PUBLISHED_COURSES.map(course => ({ path: course.route, file: course.entry })),
  { path: '/release-manifest.json', file: 'release-manifest.json' }
];

const FIXTURE_FILES = {
  'index.html': Buffer.from('home'),
  'lesson49/index.html': Buffer.from('lesson49'),
  'lesson50/index.html': Buffer.from('lesson50'),
  'soundmark/index.html': Buffer.from('soundmark'),
  'lesson51/index.html': Buffer.from('lesson51'),
  'core/storage.js': Buffer.from('storage'),
  'assets/fonts/fonts.css': Buffer.from('fonts'),
  'lesson51/audio/a_pleasant_climate.mp3': Buffer.from('mp3'),
  'home/index.html': Buffer.from('compatibility redirect')
};

const HOME_ALIASES = ['/home', '/home/', '/home/index.html'];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function manifestFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-live-manifest-'));
  for (const [file, bytes] of Object.entries(FIXTURE_FILES)) {
    const target = path.join(root, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
  }
  const manifest = {
    schema: 1,
    commit: 'a'.repeat(40),
    files: Object.fromEntries(
      Object.entries(FIXTURE_FILES).map(([file, bytes]) => [file, sha256(bytes)])
    )
  };
  await fs.writeFile(
    path.join(root, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return root;
}

function manifestFetch(root, options = {}) {
  const {
    activity = { active: 0, maximum: 0, calls: [] },
    bodyOverrides = {},
    streamOverrides = {},
    headerOverrides = {},
    statusOverrides = {},
    finalUrlOverrides = {}
  } = options;
  const routeFiles = new Map([
    ['/', 'index.html'],
    ...PUBLISHED_COURSES.map(course => [course.route, course.entry]),
    ['/release-manifest.json', 'release-manifest.json']
  ]);

  return async (url, requestOptions = {}) => {
    const parsed = new URL(url);
    const requestedPath = parsed.pathname;
    activity.calls.push({
      path: requestedPath,
      redirect: requestOptions.redirect,
      signal: requestOptions.signal
    });
    activity.active += 1;
    activity.maximum = Math.max(activity.maximum, activity.active);
    await new Promise(resolve => setImmediate(resolve));
    activity.active -= 1;

    if(HOME_ALIASES.includes(requestedPath) && requestOptions.redirect === 'manual'){
      const response = new Response('', {
        status: 308,
        headers: {
          ...HTTP_HEADER_CONTRACT,
          location: '/',
          ...headerOverrides[requestedPath]
        }
      });
      return {
        status: response.status,
        url,
        headers: response.headers,
        body: response.body,
        arrayBuffer: () => response.arrayBuffer()
      };
    }

    const followedHome = HOME_ALIASES.includes(requestedPath);
    const file = followedHome
      ? 'index.html'
      : (routeFiles.get(requestedPath) || decodeURIComponent(requestedPath.slice(1)));
    const override = bodyOverrides[requestedPath];
    const body = Object.hasOwn(streamOverrides, requestedPath)
      ? streamOverrides[requestedPath]()
      : (override === undefined ? await fs.readFile(path.join(root, file)) : override);
    const response = new Response(body, {
      status: statusOverrides[requestedPath] || 200,
      headers: {
        ...HTTP_HEADER_CONTRACT,
        ...headerOverrides[requestedPath]
      }
    });
    return {
      status: response.status,
      url: finalUrlOverrides[requestedPath] ||
        (followedHome ? `${parsed.origin}/` : url),
      headers: response.headers,
      body: response.body,
      arrayBuffer: () => response.arrayBuffer()
    };
  };
}
```

- [ ] **Step 2: Add failing manifest, asset, bound, and redirect cases**

Replace the old route-only success/mismatch cases with:

```js
test('verifyBase fetches and hashes every runtime artifact with bounded concurrency', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const activity = { active: 0, maximum: 0, calls: [] };
  const results = await verifyBase({
    baseUrl: 'http://59.110.217.36',
    root,
    fetchImpl: manifestFetch(root, { activity }),
    concurrency: 2
  });

  assert.equal(activity.maximum <= 2, true);
  assert.deepEqual(
    results.filter(result => result.kind === 'asset').map(result => result.file).sort(),
    Object.keys(FIXTURE_FILES).filter(file => file !== 'home/index.html').sort()
  );
  assert.deepEqual(
    activity.calls
      .filter(call => HOME_ALIASES.includes(call.path))
      .map(({ path: callPath, redirect }) => ({ path: callPath, redirect })),
    HOME_ALIASES.flatMap(alias => [
      { path: alias, redirect: 'manual' },
      { path: alias, redirect: 'follow' }
    ])
  );
});

test('verifyBase reports changed JavaScript, font, and MP3 bytes together', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        bodyOverrides: {
          '/core/storage.js': 'changed-js',
          '/assets/fonts/fonts.css': 'changed-font',
          '/lesson51/audio/a_pleasant_climate.mp3': 'changed-mp3'
        }
      })
    }),
    error => {
      assert.match(error.message, /core\/storage\.js: hash mismatch/);
      assert.match(error.message, /assets\/fonts\/fonts\.css: hash mismatch/);
      assert.match(error.message, /lesson51\/audio\/a_pleasant_climate\.mp3: hash mismatch/);
      return true;
    }
  );
});

test('verifyBase rejects a manifest mismatch before trusting asset paths', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const activity = { active: 0, maximum: 0, calls: [] };
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        activity,
        bodyOverrides: { '/release-manifest.json': '{"schema":1}' }
      })
    }),
    /release-manifest\.json: bytes differ/
  );
  assert.deepEqual(activity.calls.map(call => call.path), ['/release-manifest.json']);
});

test('verifyBase rejects declared and streamed oversized responses', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: {
          '/core/storage.js': {
            'content-length': String(8 * 1024 * 1024 + 1)
          }
        }
      })
    }),
    /core\/storage\.js: response exceeds 8388608 bytes/
  );

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        streamOverrides: {
          '/assets/fonts/fonts.css': () => new ReadableStream({
            start(controller) {
              controller.enqueue(new Uint8Array(4 * 1024 * 1024 + 1));
              controller.enqueue(new Uint8Array(4 * 1024 * 1024 + 1));
              controller.close();
            }
          })
        }
      })
    }),
    /assets\/fonts\/fonts\.css: response exceeds 8388608 bytes/
  );
});

test('verifyBase passes an aborting timeout signal to requests', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      })
    }),
    /release-manifest\.json: request failed/
  );
});

test('verifyBase enforces exact headers and same-origin URLs for MP3 files', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: {
          '/lesson51/audio/a_pleasant_climate.mp3': {
            'x-frame-options': 'ALLOWALL'
          }
        },
        finalUrlOverrides: {
          '/lesson51/audio/a_pleasant_climate.mp3':
            'http://other.example/lesson51/audio/a_pleasant_climate.mp3'
        }
      })
    }),
    error => {
      assert.match(error.message, /lesson51\/audio\/a_pleasant_climate\.mp3: unexpected header x-frame-options/);
      assert.match(error.message, /lesson51\/audio\/a_pleasant_climate\.mp3: final response URL origin does not match approved base/);
      return true;
    }
  );
});

test('verifyBase rejects every weakened header value and live HSTS', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const [header, value] of [
    ['content-security-policy', 'default-src *'],
    ['x-content-type-options', 'allow-all'],
    ['x-frame-options', 'ALLOWALL'],
    ['referrer-policy', 'unsafe-url'],
    ['permissions-policy', '*'],
    ['strict-transport-security', 'max-age=31536000']
  ]) {
    await assert.rejects(
      verifyBase({
        baseUrl: 'http://59.110.217.36',
        root,
        fetchImpl: manifestFetch(root, {
          headerOverrides: { '/': { [header]: value } }
        })
      }),
      new RegExp(
        header === 'strict-transport-security'
          ? 'index.html: unexpected strict-transport-security'
          : `index.html: unexpected header ${header}`
      )
    );
  }
});

test('verifyBase enforces all three home redirect locations', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: { '/home/index.html': { location: '/wrong' } }
      })
    }),
    /\/home\/index\.html: expected Location: \//
  );
});

test('verifyBase rejects HTTPS and malformed base URLs before requests', async () => {
  for (const baseUrl of [
    'https://59.110.217.36',
    'http://',
    'http:/59.110.217.36',
    'http:59.110.217.36',
    '59.110.217.36',
    'http://59.110.217.36@evil.example/base?q=1#frag'
  ]) {
    let calls = 0;
    await assert.rejects(
      verifyBase({
        baseUrl,
        fetchImpl: async () => {
          calls += 1;
          throw new Error('must not request');
        }
      }),
      /HTTP-only verifier rejected base URL/
    );
    assert.equal(calls, 0, baseUrl);
  }
});
```

Keep the existing exact `HTTP_HEADER_CONTRACT` and immutable `ROUTES` tests,
now using the registry-derived `EXPECTED_ROUTES`. Remove the obsolete
route-only `fixture()`/`fakeFetch()` helpers and their tests; this audit must
return no matches:

```bash
rg -n "\bfixture\(\)|\bfakeFetch\(" tests/deploy/live-verifier.test.js
```

- [ ] **Step 3: Run live verifier tests and verify RED**

Run:

```bash
node --test tests/deploy/live-verifier.test.js
```

Expected failures show that only five entry routes are requested, response
limits and timeouts are absent, and changed non-entry assets are ignored.

- [ ] **Step 4: Generate entry routes from the registry**

Replace the handwritten course routes:

```js
const { PUBLISHED_COURSES } = require('./course-registry');

const ROUTES = Object.freeze([
  Object.freeze({ path: '/', file: 'index.html' }),
  ...PUBLISHED_COURSES.map(course =>
    Object.freeze({ path: course.route, file: course.entry })
  ),
  Object.freeze({ path: '/release-manifest.json', file: 'release-manifest.json' })
]);

const HOME_REDIRECTS = Object.freeze(['/home', '/home/', '/home/index.html']);
const LIVE_BYTE_EXCEPTIONS = Object.freeze(['home/index.html']);
const ENTRY_ROUTE_BY_FILE = Object.freeze(Object.fromEntries([
  ['index.html', '/'],
  ...PUBLISHED_COURSES.map(course => [course.entry, course.route])
]));

function manifestPathFor(file) {
  if (Object.hasOwn(ENTRY_ROUTE_BY_FILE, file)) return ENTRY_ROUTE_BY_FILE[file];
  return `/${file.split('/').map(encodeURIComponent).join('/')}`;
}
```

- [ ] **Step 5: Implement bounded body reading and concurrency**

Add:

```js
const DEFAULT_CONCURRENCY = 8;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 8 * 1024 * 1024;

async function readBoundedBody(response, maximum, label) {
  const lengthText = response.headers?.get?.('content-length');
  if (lengthText !== null && lengthText !== undefined && lengthText !== '') {
    const length = Number(lengthText);
    if (!Number.isSafeInteger(length) || length < 0) {
      throw new Error(`${label}: invalid content-length`);
    }
    if (length > maximum) throw new Error(`${label}: response exceeds ${maximum} bytes`);
  }

  if (!response.body || typeof response.body.getReader !== 'function') {
    if (typeof response.arrayBuffer !== 'function') {
      throw new Error(`${label}: invalid response body interface`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > maximum) throw new Error(`${label}: response exceeds ${maximum} bytes`);
    return bytes;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximum) {
      try { await reader.cancel(); } catch {}
      throw new Error(`${label}: response exceeds ${maximum} bytes`);
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }));
  return results;
}
```

Every fetch receives:

```js
{
  redirect: 'follow',
  signal: AbortSignal.timeout(timeoutMs)
}
```

Use `redirect: 'manual'` for the first home-alias check. Aggregate failures in
manifest order so concurrent completion does not make output nondeterministic.

- [ ] **Step 6: Verify the local/online manifest, all assets, and home aliases**

Add these validation helpers beside `readBoundedBody()`:

```js
function validatePositiveInteger(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new TypeError(`${label} must be an integer from 1 through ${maximum}`);
  }
}

function isManifestPath(file) {
  return typeof file === 'string' &&
    file.length > 0 &&
    file === path.posix.normalize(file) &&
    !file.startsWith('../') &&
    !path.posix.isAbsolute(file) &&
    !file.split('/').includes('..') &&
    !file.includes('\\') &&
    !/[\0-\x1f\x7f]/.test(file);
}

function parseManifest(bytes) {
  let manifest;
  try {
    manifest = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('release-manifest.json: invalid JSON');
  }
  if (
    !manifest ||
    Object.keys(manifest).sort().join(',') !== 'commit,files,schema' ||
    manifest.schema !== 1 ||
    !/^[a-f0-9]{40}$/.test(manifest.commit) ||
    !manifest.files ||
    Array.isArray(manifest.files) ||
    Object.keys(manifest.files).length === 0
  ) {
    throw new Error('release-manifest.json: malformed schema');
  }
  for (const [file, digest] of Object.entries(manifest.files)) {
    if (!isManifestPath(file) || !/^[a-f0-9]{64}$/.test(digest)) {
      throw new Error(`release-manifest.json: malformed entry ${file}`);
    }
  }
  if (Object.hasOwn(manifest.files, 'release-manifest.json')) {
    throw new Error('release-manifest.json: must not contain itself');
  }
  for (const route of ROUTES.filter(route => route.file !== 'release-manifest.json')) {
    if (!Object.hasOwn(manifest.files, route.file)) {
      throw new Error(`release-manifest.json: missing ${route.file}`);
    }
  }
  if (!Object.hasOwn(manifest.files, 'home/index.html')) {
    throw new Error('release-manifest.json: missing home/index.html');
  }
  return manifest;
}

function verifyHeaders(response, label, failures) {
  if (
    !response.headers ||
    typeof response.headers.get !== 'function' ||
    typeof response.headers.has !== 'function'
  ) {
    failures.push(`${label}: invalid response headers interface`);
    return false;
  }
  try {
    for (const [header, expected] of Object.entries(HTTP_HEADER_CONTRACT)) {
      const actual = response.headers.get(header);
      if (!actual) failures.push(`${label}: missing header ${header}`);
      else if (actual !== expected) failures.push(`${label}: unexpected header ${header}`);
    }
    if (response.headers.has('strict-transport-security')) {
      failures.push(`${label}: unexpected strict-transport-security`);
    }
    return true;
  } catch (error) {
    failures.push(`${label}: failed to inspect response headers: ${errorMessage(error)}`);
    return false;
  }
}

function labelledError(label, error) {
  const message = errorMessage(error);
  return message.startsWith(`${label}:`) ? message : `${label}: ${message}`;
}
```

Replace `verifyBase()` with:

```js
async function verifyBase({
  baseUrl,
  root = path.resolve(__dirname, '../dist'),
  fetchImpl = globalThis.fetch,
  concurrency = DEFAULT_CONCURRENCY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxBytes = DEFAULT_MAX_BYTES
}) {
  const parsedBaseUrl = parseHttpBaseUrl(baseUrl);
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('live HTTP verifier requires a fetch implementation');
  }
  validatePositiveInteger(concurrency, 'concurrency', 64);
  validatePositiveInteger(timeoutMs, 'timeoutMs');
  validatePositiveInteger(maxBytes, 'maxBytes');

  const failures = [];
  const results = [];
  let localManifestBytes;
  try {
    localManifestBytes = await fs.readFile(path.join(root, 'release-manifest.json'));
    if (localManifestBytes.length > maxBytes) {
      throw new Error(`response exceeds ${maxBytes} bytes`);
    }
  } catch (error) {
    throw new Error(`live HTTP verification failed:\n${
      labelledError('release-manifest.json', error)
    }`);
  }

  async function request(urlPath, redirect) {
    const expectedUrl = new URL(urlPath, parsedBaseUrl);
    return {
      expectedUrl,
      response: await fetchImpl(expectedUrl.href, {
        redirect,
        signal: AbortSignal.timeout(timeoutMs)
      })
    };
  }

  let manifestResponse;
  let manifestExpectedUrl;
  try {
    const requested = await request('/release-manifest.json', 'follow');
    manifestResponse = requested.response;
    manifestExpectedUrl = requested.expectedUrl;
  } catch (error) {
    throw new Error(
      `live HTTP verification failed:\nrelease-manifest.json: request failed: ${errorMessage(error)}`
    );
  }
  if (!manifestResponse || typeof manifestResponse !== 'object') {
    throw new Error('live HTTP verification failed:\nrelease-manifest.json: invalid response object');
  }
  if (manifestResponse.status !== 200) {
    failures.push(
      `release-manifest.json: expected 200, received ${manifestResponse.status}`
    );
  }
  verifyFinalUrl(
    manifestResponse.url,
    parsedBaseUrl,
    manifestExpectedUrl,
    'release-manifest.json',
    failures
  );
  verifyHeaders(manifestResponse, 'release-manifest.json', failures);
  let onlineManifestBytes;
  try {
    onlineManifestBytes = await readBoundedBody(
      manifestResponse,
      maxBytes,
      'release-manifest.json'
    );
  } catch (error) {
    failures.push(labelledError('release-manifest.json', error));
  }
  if (
    onlineManifestBytes &&
    !localManifestBytes.equals(onlineManifestBytes)
  ) {
    failures.push('release-manifest.json: bytes differ');
  }
  if (failures.length) {
    throw new Error(`live HTTP verification failed:\n${failures.join('\n')}`);
  }

  let manifest;
  try {
    manifest = parseManifest(localManifestBytes);
  } catch (error) {
    throw new Error(`live HTTP verification failed:\n${errorMessage(error)}`);
  }
  results.push({
    kind: 'manifest',
    path: '/release-manifest.json',
    file: 'release-manifest.json',
    status: 200,
    liveSha256: sha256(onlineManifestBytes)
  });

  async function inspectLiveFile(file) {
    const localFailures = [];
    const urlPath = manifestPathFor(file);
    let response;
    let expectedUrl;
    try {
      const requested = await request(urlPath, 'follow');
      response = requested.response;
      expectedUrl = requested.expectedUrl;
    } catch (error) {
      return {
        failures: [`${file}: request failed: ${errorMessage(error)}`],
        result: null
      };
    }
    if (!response || typeof response !== 'object') {
      return { failures: [`${file}: invalid response object`], result: null };
    }
    if (!Number.isInteger(response.status)) {
      localFailures.push(`${file}: invalid response status`);
    } else if (response.status !== 200) {
      localFailures.push(`${file}: expected 200, received ${response.status}`);
    }
    verifyFinalUrl(response.url, parsedBaseUrl, expectedUrl, file, localFailures);
    verifyHeaders(response, file, localFailures);
    let bytes;
    try {
      bytes = await readBoundedBody(response, maxBytes, file);
    } catch (error) {
      localFailures.push(labelledError(file, error));
    }
    const liveSha256 = bytes ? sha256(bytes) : null;
    if (liveSha256 && liveSha256 !== manifest.files[file]) {
      localFailures.push(
        `${file}: hash mismatch (${manifest.files[file]} != ${liveSha256})`
      );
    }
    return {
      failures: localFailures,
      result: liveSha256 ? {
        kind: 'asset',
        path: urlPath,
        file,
        status: response.status,
        localSha256: manifest.files[file],
        liveSha256
      } : null
    };
  }

  const assetFiles = Object.keys(manifest.files)
    .filter(file => !LIVE_BYTE_EXCEPTIONS.includes(file));
  const assetOutcomes = await mapLimit(assetFiles, concurrency, inspectLiveFile);
  for (const outcome of assetOutcomes) {
    failures.push(...outcome.failures);
    if (outcome.result) results.push(outcome.result);
  }

  const rootDigest = manifest.files['index.html'];
  for (const alias of HOME_REDIRECTS) {
    let manual;
    let manualExpected;
    try {
      const requested = await request(alias, 'manual');
      manual = requested.response;
      manualExpected = requested.expectedUrl;
    } catch (error) {
      failures.push(`${alias}: manual request failed: ${errorMessage(error)}`);
      continue;
    }
    if (!manual || typeof manual !== 'object') {
      failures.push(`${alias}: invalid manual response object`);
      continue;
    }
    if (manual.status !== 308) {
      failures.push(`${alias}: expected 308, received ${manual.status}`);
    }
    verifyFinalUrl(manual.url, parsedBaseUrl, manualExpected, alias, failures);
    const manualHeadersValid = verifyHeaders(manual, alias, failures);
    if (manualHeadersValid && manual.headers.get('location') !== '/') {
      failures.push(`${alias}: expected Location: /`);
    }

    let followed;
    try {
      followed = (await request(alias, 'follow')).response;
    } catch (error) {
      failures.push(`${alias}: followed request failed: ${errorMessage(error)}`);
      continue;
    }
    if (!followed || typeof followed !== 'object') {
      failures.push(`${alias}: invalid followed response object`);
      continue;
    }
    if (followed.status !== 200) {
      failures.push(`${alias}: followed response expected 200, received ${followed.status}`);
    }
    verifyFinalUrl(
      followed.url,
      parsedBaseUrl,
      new URL('/', parsedBaseUrl),
      alias,
      failures
    );
    verifyHeaders(followed, alias, failures);
    let bytes;
    try {
      bytes = await readBoundedBody(followed, maxBytes, alias);
    } catch (error) {
      failures.push(labelledError(alias, error));
    }
    const liveSha256 = bytes ? sha256(bytes) : null;
    if (liveSha256 && liveSha256 !== rootDigest) {
      failures.push(`${alias}: root hash mismatch (${rootDigest} != ${liveSha256})`);
    }
    if (liveSha256) {
      results.push({
        kind: 'redirect',
        path: alias,
        file: 'index.html',
        status: followed.status,
        localSha256: rootDigest,
        liveSha256
      });
    }
  }

  if (failures.length) {
    throw new Error(`live HTTP verification failed:\n${failures.join('\n')}`);
  }
  return results;
}
```

Keep `sha256()` as a hex digest helper:

```js
function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}
```

- [ ] **Step 7: Verify GREEN and all deploy contracts**

Run:

```bash
node --test tests/deploy/live-verifier.test.js
npm run test:deploy
```

Expected: all live-verifier and deployment tests pass, including modified JS,
font, MP3, timeout, size, concurrency, and redirect cases.

- [ ] **Step 8: Commit full live verification**

```bash
git add scripts/verify-live.js tests/deploy/live-verifier.test.js
git commit -m "fix: verify all live release assets"
```

---

### Task 7: Pin CI and Package Sources to Immutable or Explicit Origins

**Files:**
- Create: `.npmrc`
- Create: `tests/deploy/workflow-contract.test.js`
- Modify: `.github/workflows/verify.yml`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: read-only GitHub token permissions, immutable Action/image
  references, non-persisted checkout credentials, official npm tarball origins.
- Preserves: Node 20 and the existing workflow command sequence.

- [ ] **Step 1: Add a failing workflow and package-source contract**

Create `tests/deploy/workflow-contract.test.js`:

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const CHECKOUT = 'actions/checkout@11d5960a326750d5838078e36cf38b85af677262';
const SETUP_NODE = 'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020';
const NGINX = 'nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284';

test('workflow uses read-only permissions and immutable dependencies', async () => {
  const workflow = await fs.readFile(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8');
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.match(workflow, new RegExp(`uses: ${CHECKOUT}`));
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.match(workflow, new RegExp(`uses: ${SETUP_NODE}`));
  assert.match(workflow, new RegExp(NGINX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d/);
});

test('npm configuration and lockfile use the official registry', async () => {
  const [config, lock] = await Promise.all([
    fs.readFile(path.join(ROOT, '.npmrc'), 'utf8'),
    fs.readFile(path.join(ROOT, 'package-lock.json'), 'utf8')
  ]);
  assert.match(config, /^registry=https:\/\/registry\.npmjs\.org\/$/m);
  assert.match(config, /^replace-registry-host=always$/m);
  assert.doesNotMatch(lock, /registry\.npmmirror\.com/);
  for (const resolved of [...lock.matchAll(/"resolved":\s*"([^"]+)"/g)].map(match => match[1])) {
    assert.match(resolved, /^https:\/\/registry\.npmjs\.org\//);
  }
});
```

- [ ] **Step 2: Run the contract and verify RED**

Run:

```bash
node --test tests/deploy/workflow-contract.test.js
```

Expected failures: `.npmrc` is absent, mutable Action and image tags remain,
permissions and `persist-credentials` are absent, and lock URLs use
`registry.npmmirror.com`.

- [ ] **Step 3: Pin the workflow**

Update `.github/workflows/verify.yml` to include:

```yaml
permissions:
  contents: read
```

Use:

```yaml
- uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262
  with:
    persist-credentials: false
- uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020
```

Use this exact image:

```text
nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284
```

- [ ] **Step 4: Make the npm source explicit**

Create `.npmrc`:

```ini
registry=https://registry.npmjs.org/
replace-registry-host=always
```

Change the seven `package-lock.json` resolved hosts from
`https://registry.npmmirror.com/` to `https://registry.npmjs.org/` without
changing package versions or integrity fields. Then run:

```bash
npm install --package-lock-only --ignore-scripts
npm ci
```

Expected: install succeeds from the official registry and the lockfile contains
no `registry.npmmirror.com`.

- [ ] **Step 5: Verify GREEN and deploy tests**

Run:

```bash
node --test tests/deploy/workflow-contract.test.js
npm run test:deploy
git diff --check
```

Expected: all workflow, package-source, and deploy tests pass.

- [ ] **Step 6: Commit supply-chain hardening**

```bash
git add .npmrc .github/workflows/verify.yml package-lock.json \
  tests/deploy/workflow-contract.test.js
git commit -m "ci: pin release verification dependencies"
```

---

### Task 8: Run the Ordered Security and Release Gates

**Files:**
- Inspect: all files changed since `8690d7dadbef2bfdc60e08dfd512d4f662374c42`
- Generate only ignored output: `dist/`, `playwright-report/`, `test-results/`

**Interfaces:**
- Consumes: the completed remediation branch.
- Produces: exact command evidence for applicability, original-trigger closure,
  bypass review, preserved behavior, and repository checks.

- [ ] **Step 1: Verify applicability and patch scope**

Run:

```bash
git status -sb
git diff --check
git diff --stat 8690d7dadbef2bfdc60e08dfd512d4f662374c42..HEAD
git diff 8690d7dadbef2bfdc60e08dfd512d4f662374c42..HEAD -- \
  scripts lesson51 index.html README.md deploy .github package.json \
  package-lock.json .npmrc tests docs/superpowers
```

Expected: no uncommitted source changes, no whitespace errors, and no files
outside the approved remediation scope.

- [ ] **Step 2: Re-run the original vulnerable boundaries**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js tests/e2e/l51-audio.spec.js \
  tests/e2e/local-fonts.spec.js
node --test tests/deploy/publication-contract.test.js \
  tests/deploy/live-verifier.test.js tests/deploy/workflow-contract.test.js
```

Expected:

- legacy `-1` and corrupt storage produce no page error;
- zero-progress forged certificate never prints;
- eligible certificate prints once;
- repeated quiz/game runs remain bounded per level;
- interrupted auto-play clears state and does not advance;
- normal final-line completion awards only `l2`;
- no Google or other third-party runtime asset is requested;
- changed JS/font/MP3, timeout, oversize, redirect, and header violations fail.

- [ ] **Step 3: Review alternate bypasses**

Read the final diff and verify:

```bash
rg -n "l51-stars-v1|localStorage|getItem|setItem|addStar|window\.print|btnPrint|playingAll|playAllGeneration|fonts\.googleapis|fonts\.gstatic" \
  lesson51/index.html tests/e2e/l51-*.spec.js
rg -n "lesson51|PUBLISHED_COURSES|RISK-HTTP-01" \
  scripts index.html README.md deploy tests
rg -n "actions/(checkout|setup-node)@v|nginx:1\.28\.0-alpine( |$)|registry\.npmmirror\.com|H-01" \
  .github package-lock.json README.md deploy tests || true
```

Expected:

- legacy scalar appears only as reset migration input and tests;
- certificate execution contains an internal eligibility check;
- no course-local additive `addStar` path remains;
- no external font host, mutable CI reference, mirror URL, or stale risk ID
  remains.

- [ ] **Step 4: Run all repository checks**

Ensure port 4173 is free, then run:

```bash
npm test
npm run test:deploy
```

Expected: all unit, E2E, and deploy tests pass with zero failures.

- [ ] **Step 5: Commit any test-driven correction before building**

If Step 4 exposed a defect, return to the owning task's RED/GREEN cycle, commit
only that correction, and repeat Steps 1 through 4. Do not build from a dirty
public tree.

- [ ] **Step 6: Build the exact clean release artifact**

Run:

```bash
test -z "$(git status --porcelain=v1)"
npm run build:static
node - <<'NODE'
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const manifest = JSON.parse(fs.readFileSync('dist/release-manifest.json', 'utf8'));
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const files = Object.keys(manifest.files);
if (manifest.commit !== head) throw new Error('manifest commit differs from HEAD');
if (!files.includes('lesson51/index.html')) throw new Error('Lesson 51 HTML missing');
const audio = files.filter(file => file.startsWith('lesson51/audio/') && file.endsWith('.mp3'));
if (audio.length !== 46) throw new Error(`expected 46 Lesson 51 MP3 files, got ${audio.length}`);
console.log(JSON.stringify({ head, fileCount: files.length, lesson51Audio: audio.length }, null, 2));
NODE
```

Expected: manifest commit equals HEAD, Lesson 51 HTML is present, and exactly 46
Lesson 51 MP3 files are present.

- [ ] **Step 7: Validate the pinned Nginx image when a container runtime exists**

Check:

```bash
command -v docker
```

If available, run:

```bash
docker run --rm \
  -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284 \
  nginx -t
```

Expected: `syntax is ok` and `test is successful`.

If Docker is unavailable, record this gate as unrun rather than claiming it
passed. The structural Nginx tests remain required, and GitHub Actions must run
the pinned container before production closure.

- [ ] **Step 8: Record the remaining risk and handoff**

Final reporting must state:

```text
Outcome: fixed locally, subject to any explicitly unrun container/remote gates.
Original release, storage, certificate, CSP, and audio triggers no longer reproduce.
Lesson 49, Lesson 50, soundmark, and HTTP-only behavior remain supported.
RISK-HTTP-01 remains accepted and open until the domain/TLS decision changes.
No production deployment or live-IP verification was performed unless separately authorized.
```

Do not push, merge, deploy, or run the verifier against production without
separate user authorization.
