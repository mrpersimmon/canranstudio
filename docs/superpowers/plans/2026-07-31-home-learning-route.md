# Home Learning Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the linear homepage course stack with the selected route-based catalogue, scalable 24-lesson ranges, honest continue-course selection, numbered search, and a separate special-skills station.

**Architecture:** Keep the site static. Put range, search, and recommendation decisions in a small UMD module under `core/`; keep catalogue content and DOM rendering in `index.html`; reuse the existing storage/progress modules for totals. Render numbered lessons and specials from one catalogue into separate semantic regions, with responsive CSS matching the selected visual.

**Tech Stack:** Static HTML/CSS/JavaScript, existing `CanranCore` UMD modules, Node test runner, Playwright, local PNG assets.

## Global Constraints

- Visual truth: `/Users/sunnywinter/.codex/generated_images/019fad15-e13e-74b0-be3f-883cdae4e180/exec-2d387a95-8b89-4de2-b411-c93244b632c8.png`.
- Keep the current static HTTP-only publishing model; do not add HTTPS assumptions, a backend, accounts, or new routes.
- Do not modify Lesson 49, Lesson 50, Lesson 51, or soundmark course pages.
- Numbered lessons and specials share catalogue data but render in separate regions.
- Range boundaries are exactly `1–24`, `25–48`, `49–72`, `73–96`, `97–120`, `121–144`.
- Course artwork must be project-local transparent PNG, not CSS drawings, handcrafted SVG, or placeholders.
- Do not push, merge, or deploy.

---

### Task 1: Isolate catalogue decisions

**Files:**
- Create: `core/home-catalog.js`
- Create: `tests/unit/home-catalog.test.js`

**Interfaces:**
- Produces: `CanranCore.homeCatalog.RANGES`, `rangeForLesson(value)`, `pickContinueCourse(courses)`, and `resolveLessonSearch(value, courses)`.
- Consumes: plain course objects shaped as `{ kind, lesson, route, stars, max }`.

- [ ] **Step 1: Write failing unit tests**

Create `tests/unit/home-catalog.test.js` with literal expectations:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/home-catalog');

test('rangeForLesson maps the 1–144 boundaries and rejects other input', () => {
  assert.deepEqual(catalog.rangeForLesson(1), { start: 1, end: 24 });
  assert.deepEqual(catalog.rangeForLesson(49), { start: 49, end: 72 });
  assert.deepEqual(catalog.rangeForLesson(144), { start: 121, end: 144 });
  assert.equal(catalog.rangeForLesson(0), null);
  assert.equal(catalog.rangeForLesson(145), null);
  assert.equal(catalog.rangeForLesson('49.5'), null);
});

test('pickContinueCourse prefers the most progressed unfinished numbered lesson', () => {
  const courses = [
    { kind: 'lesson', lesson: 49, route: '/lesson49/', stars: 6, max: 15 },
    { kind: 'lesson', lesson: 50, route: '/lesson50/', stars: 9, max: 15 },
    { kind: 'lesson', lesson: 51, route: '/lesson51/', stars: 9, max: 15 },
    { kind: 'special', lesson: null, route: '/soundmark/', stars: 12, max: 12 }
  ];
  assert.equal(catalog.pickContinueCourse(courses).lesson, 51);
});

test('pickContinueCourse falls back to first unfinished then latest completed lesson', () => {
  const untouched = [
    { kind: 'lesson', lesson: 49, route: '/lesson49/', stars: 0, max: 15 },
    { kind: 'lesson', lesson: 50, route: '/lesson50/', stars: 0, max: 15 }
  ];
  assert.equal(catalog.pickContinueCourse(untouched).lesson, 49);
  const complete = untouched.map(course => ({ ...course, stars: 15 }));
  assert.equal(catalog.pickContinueCourse(complete).lesson, 50);
});

test('resolveLessonSearch distinguishes available, placeholder, missing, and invalid lessons', () => {
  const courses = [
    { kind: 'lesson', lesson: 51, route: '/lesson51/' },
    { kind: 'lesson', lesson: 52, route: null }
  ];
  assert.deepEqual(catalog.resolveLessonSearch('51', courses), {
    status: 'available', lesson: 51, range: { start: 49, end: 72 }
  });
  assert.equal(catalog.resolveLessonSearch('52', courses).status, 'placeholder');
  assert.equal(catalog.resolveLessonSearch('100', courses).status, 'missing');
  assert.equal(catalog.resolveLessonSearch('145', courses).status, 'invalid');
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/unit/home-catalog.test.js`

Expected: FAIL with `Cannot find module '../../core/home-catalog'`.

- [ ] **Step 3: Implement the pure helper module**

Create `core/home-catalog.js` using the same UMD shape as `core/progress.js`. It must:

```js
const RANGES = Object.freeze([
  { start: 1, end: 24 }, { start: 25, end: 48 },
  { start: 49, end: 72 }, { start: 73, end: 96 },
  { start: 97, end: 120 }, { start: 121, end: 144 }
].map(range => Object.freeze(range)));
```

`rangeForLesson` accepts only integer-valued input in 1–144. `pickContinueCourse` ignores specials, placeholders, malformed progress and completed courses until the fallbacks described in the spec. `resolveLessonSearch` returns one of `available`, `placeholder`, `missing`, or `invalid` and always includes the calculated range for valid numbers.

- [ ] **Step 4: Run unit tests and verify GREEN**

Run: `node --test tests/unit/home-catalog.test.js`

Expected: 4 tests pass.

- [ ] **Step 5: Commit the catalogue decision module**

```bash
git add core/home-catalog.js tests/unit/home-catalog.test.js
git commit -m "feat: add scalable home catalogue decisions"
```

### Task 2: Make the selected homepage interactions real

**Files:**
- Modify: `tests/e2e/home-progress.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `CanranCore.storage`, `CanranCore.progress`, and `CanranCore.homeCatalog`.
- Produces: `#continueCourse`, `#lessonRoute`, `#specialStation`, `[data-range-start]`, `#lessonSearch`, `#lessonSearchStatus`, and `[data-lesson]`.

- [ ] **Step 1: Add failing E2E coverage**

Append three behavior tests to `tests/e2e/home-progress.spec.js`:

```js
test('welcome page separates numbered lessons from the special station', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#lessonRoute a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson50/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson51/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/soundmark/"]')).toHaveCount(0);
  await expect(page.locator('#specialStation a[href="/soundmark/"]')).toHaveCount(1);
  await expect(page.locator('[data-range-start="49"]')).toHaveAttribute('aria-pressed', 'true');
});

test('range tickets and numbered search expose one bounded catalogue segment', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-range-start="1"]').click();
  await expect(page.locator('#routeEmpty')).toBeVisible();
  await expect(page.locator('#specialStation')).toBeVisible();

  await page.locator('#lessonSearch').fill('51');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('[data-lesson="51"]')).toBeFocused();

  await page.locator('#lessonSearch').fill('100');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('[data-range-start="97"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#lessonSearchStatus')).toHaveText('Lesson 100 还未加入目录。');
});

test('continue learning chooses the highest-progress unfinished numbered lesson', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 2, l2: 2, l3: 2, l4: 2, l5: 2 }
    }));
    localStorage.setItem('canran:l51:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  });
  await page.goto('/');
  await expect(page.locator('#continueCourse')).toHaveAttribute('href', '/lesson50/');
  await expect(page.locator('#continueCourse')).toContainText('挑食小王子大冒险');
});
```

- [ ] **Step 2: Run focused E2E and verify RED**

Run: `npx playwright test tests/e2e/home-progress.spec.js`

Expected: the existing progress test passes and the three new tests fail because the route, special station, range and search selectors do not exist.

- [ ] **Step 3: Replace the linear markup with semantic regions**

Rewrite the homepage content and CSS in `index.html` while preserving the document title, local fonts, cream paper background and footer copy. Add:

```html
<section id="continuePanel" aria-labelledby="continueTitle"></section>
<section id="lessonRoute" aria-labelledby="routeTitle">
  <nav id="rangeTickets" aria-label="Lesson 分段"></nav>
  <form id="lessonSearchForm" role="search">
    <label for="lessonSearch">按编号查找</label>
    <input id="lessonSearch" name="lesson" inputmode="numeric" autocomplete="off">
    <button type="submit">跳转</button>
  </form>
  <p id="lessonSearchStatus" aria-live="polite"></p>
  <div id="lessonStations"></div>
  <p id="routeEmpty" hidden>这个分段还没有开放课程。</p>
</section>
<section id="specialStation" aria-labelledby="specialTitle"></section>
```

Load `/core/home-catalog.js` before the homepage script. Define one `HOME_COURSES` array with Lesson 49–56 and soundmark. Load totals with the existing storage/progress modules, render numbered and special items into separate sections, and keep each published course route present exactly once.

- [ ] **Step 4: Wire range, search, and recommendation behavior**

Implement these page-local functions:

```js
function loadCourseProgress(course) {
  if (!course.progress) return { ...course, stars: 0, max: 0 };
  const result = CanranCore.storage.loadProgress({
    storage: localStorage,
    key: course.progress.key,
    legacyKey: course.progress.legacyKey,
    ids: course.progress.ids,
    legacyMode: course.progress.legacyMode
  });
  const stars = CanranCore.progress.totalRatings(
    result.progress.ratings,
    course.progress.ids
  );
  return { ...course, stars, max: course.progress.max };
}

function selectRange(start, focusLesson = null) {
  selectedRangeStart = start;
  renderRanges(start);
  renderLessonRange(start);
  if (focusLesson !== null) {
    requestAnimationFrame(() => {
      const station = document.querySelector(`[data-lesson="${focusLesson}"]`);
      if (station) station.focus();
    });
  }
}

function handleLessonSearch(event) {
  event.preventDefault();
  const result = CanranCore.homeCatalog.resolveLessonSearch(
    lessonSearch.value,
    hydratedCourses
  );
  if (result.status === 'invalid') {
    lessonSearchStatus.textContent = '请输入 1–144 的 Lesson 编号。';
    return;
  }
  selectRange(result.range.start,
    result.status === 'available' || result.status === 'placeholder'
      ? result.lesson
      : null);
  lessonSearchStatus.textContent = result.status === 'missing'
    ? `Lesson ${result.lesson} 还未加入目录。`
    : `已定位到 Lesson ${result.lesson}。`;
}
```

`renderContinue`, `renderRanges`, `renderLessonRange`, and `renderSpecials` must produce the semantic regions and selectors named in this task. Do not navigate for search. Station links remain ordinary anchors.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx playwright test tests/e2e/home-progress.spec.js tests/e2e/routes.spec.js`

Expected: all focused homepage and route tests pass.

- [ ] **Step 6: Commit functional homepage navigation**

```bash
git add index.html tests/e2e/home-progress.spec.js
git commit -m "feat: organize lessons into a scalable home route"
```

### Task 3: Match the selected visual and responsive states

**Files:**
- Create: `assets/home/lesson49-steak.png`
- Create: `assets/home/lesson50-crown.png`
- Create: `assets/home/lesson51-temple.png`
- Create: `assets/home/park-tent.png`
- Create: `assets/home/soundmark-phonics.png`
- Modify: `tests/e2e/home-progress.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: the selected image and local transparent PNG artwork.
- Produces: a desktop three-column route, separated orange special station, keyboard states, and a 390 px single-column layout without horizontal page overflow.

- [ ] **Step 1: Add a failing mobile-layout test**

```js
test('home route stays within a 390px viewport while range tickets remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    range: document.getElementById('rangeTickets').scrollWidth
  }));
  expect(sizes.page).toBe(sizes.viewport);
  expect(sizes.range).toBeGreaterThanOrEqual(sizes.viewport - 36);
  const columns = await page.locator('#lessonStations').evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length
  );
  expect(columns).toBe(1);
});
```

- [ ] **Step 2: Run the mobile test and verify RED**

Run: `npx playwright test tests/e2e/home-progress.spec.js -g "390px"`

Expected: FAIL because the new route layout/responsive behavior is not finished.

- [ ] **Step 3: Place final raster assets**

Validate each PNG has an alpha channel, transparent corners, no chroma fringe, and an appropriate subject crop. Use the same artwork in the continue panel and station card where applicable; do not duplicate source images.

- [ ] **Step 4: Implement the visual system**

Match the source hierarchy and proportions:

- compact hero;
- left-art/right-copy continue panel;
- centered “第一册 · 学习路线” heading;
- ticket-like range controls;
- three-column station grid with a lightweight dashed route behind it;
- red, purple and blue course tones;
- orange “番外站 · 专项技能” pavilion;
- deep-brown borders, offset shadows and consistent focus rings.

At `max-width: 760px`, stack the hero panels, make tickets horizontally scrollable, hide the decorative route, and use one station column. Respect `prefers-reduced-motion`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx playwright test tests/e2e/home-progress.spec.js tests/e2e/local-fonts.spec.js`

Expected: all focused tests pass with no page errors.

- [ ] **Step 6: Commit the visual implementation**

```bash
git add index.html tests/e2e/home-progress.spec.js assets/home
git commit -m "feat: match the home learning route visual"
```

### Task 4: Browser QA, visual comparison, and release gates

**Files:**
- Create or replace: `design-qa.md`

**Interfaces:**
- Consumes: source visual, browser-rendered homepage, and primary homepage controls.
- Produces: a local preview left open for review and a passing design QA report.

- [ ] **Step 1: Start the local static server and open the homepage**

Run: `node tests/support/static-server.js`

Use the in-app browser at `http://127.0.0.1:4173/`. Seed the same visible progress as the source: Lesson 49 = 12/15, Lesson 50 = 0/15, Lesson 51 = 5/15, soundmark = 3/12.

- [ ] **Step 2: Verify primary interactions**

Check range switching, boundary-disabled state, search for 51, search for 100, invalid input, course navigation targets, the special station remaining visible, keyboard focus, 390 px layout, and browser console warnings/errors.

- [ ] **Step 3: Capture and compare equal states**

Capture the desktop implementation as `/tmp/canranstudio-home-route-implemented.png`. Normalize the 1001 × 1570 source and implementation to equal displayed width, create `/tmp/canranstudio-home-route-comparison.png`, and inspect the combined image. Add focused crops only if typography or station details are too small in the full comparison.

- [ ] **Step 4: Fix every P0/P1/P2 and repeat the comparison**

Keep `design-qa.md` blocked while any material hierarchy, layout, typography, color, asset, copy, interaction, responsiveness, or accessibility mismatch remains. Record each iteration and its post-fix evidence.

- [ ] **Step 5: Save a passing QA report**

`design-qa.md` must include source path, implementation path, viewport, pixel dimensions, density normalization, state, full/focused evidence, findings, comparison history, interactions, console result, and exactly `final result: passed`.

- [ ] **Step 6: Run final verification on the exact final tree**

Run:

```bash
git diff --check
npm test
npm run test:deploy
```

Expected: all unit, browser and deployment tests pass with zero failures.

- [ ] **Step 7: Commit final QA refinements**

```bash
git add index.html tests/e2e/home-progress.spec.js assets/home design-qa.md
git commit -m "fix: finish home learning route QA"
```

- [ ] **Step 8: Keep the verified local preview open**

Restart the static server if the test runner stopped it, open `http://127.0.0.1:4173/`, keep the selected route view visible, and do not push, merge or deploy.
