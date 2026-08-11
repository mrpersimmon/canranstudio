'use strict';

const { test, expect } = require('@playwright/test');

const EXPERIENCE_PATH = '/poc/lesson49-experience/';
const STORAGE_KEY = 'poc:lesson49-experience:v1';
const rootSelector = '[data-lesson49-experience]';

const ANSWERS = Object.freeze({
  'L49-M01': [
    ['missingInformation', 'wanted'],
    ['missingInformation', 'unwanted'],
    ['missingInformation', 'quantity'],
    ['firstClue', 'preference']
  ],
  'L49-M02': [
    ['worker', 'butcher'],
    ['category', 'meat'],
    ['beefTray', 'beef'],
    ['lambTray', 'lamb'],
    ['steakTray', 'steak'],
    ['minceTray', 'mince'],
    ['chickenTray', 'chicken']
  ],
  'L49-M03': [['response', 'steak']],
  'L49-M04': [
    ['acceptsMeat', 'yes-please'],
    ['selectedItem', 'beef'],
    ['pitchPath', 'beef-rise'],
    ['pitchPath', 'lamb-fall']
  ],
  'L49-M05': [
    ['mrs-bird', 'likes-lamb'],
    ['mr-bird', 'does-not-like-lamb']
  ],
  'L49-M06': [
    ['suggestedItem', 'steak'],
    ['referencedPiece', 'striped-piece'],
    ['quantityItem', 'one-pound-mince']
  ],
  'L49-M07': [
    ['orderAction', 'remove-chicken'],
    ['birdPreference', 'steak', 'likes'],
    ['birdPreference', 'chicken', 'dislikes'],
    ['butcherPreference', 'does-not-like-chicken-either'],
    ['truthPhrase', 'speaking-honestly'],
    ['negativeAlso', 'either']
  ],
  'L49-M08': [
    ['finalOrder', 'beef'],
    ['finalOrder', 'steak'],
    ['finalOrder', 'mince'],
    ['evidence', 'beef-please', 'replaceLamb'],
    ['evidence', 'no-thank-you', 'removeChicken'],
    ['evidence', 'pound-of-mince', 'addMince'],
    ['transaction', 'ask-meat'],
    ['transaction', 'choose-beef-or-lamb'],
    ['transaction', 'compare-lamb-preference'],
    ['transaction', 'choose-steak'],
    ['transaction', 'add-mince'],
    ['transaction', 'refuse-chicken']
  ],
  'L49-M09': [
    ['textbookAnswer', 'steak'],
    ['preferenceSentence', 'he'],
    ['preferenceSentence', 'likes'],
    ['preferenceSentence', 'steak'],
    ['preferenceSentence', 'but'],
    ['preferenceSentence', 'he'],
    ['preferenceSentence', 'does-not'],
    ['preferenceSentence', 'like'],
    ['preferenceSentence', 'chicken'],
    ['purchasedItems', 'beef'],
    ['purchasedItems', 'steak'],
    ['purchasedItems', 'mince']
  ]
});

const PICNIC_M06_WRONG = Object.freeze([
  ['suggestedItem', 'cake'],
  ['referencedPiece', 'square-sandwich'],
  ['quantityItem', 'one-bottle-water']
]);

const PICNIC_M06_CORRECT = Object.freeze([
  ['suggestedItem', 'sandwich'],
  ['referencedPiece', 'round-sandwich'],
  ['quantityItem', 'two-bottles-water']
]);

async function installInstantAudio(page, { fail = false } = {}) {
  await page.addInitScript(({ shouldFail }) => {
    class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.currentTime = 0;
      }
      load() {}
      pause() {}
      play() {
        window.__lesson49AudioPlayCount = (window.__lesson49AudioPlayCount || 0) + 1;
        queueMicrotask(() => this.dispatchEvent(new Event(shouldFail ? 'error' : 'ended')));
        return Promise.resolve();
      }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: FakeAudio });
    if (shouldFail) {
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: null });
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: null });
    }
  }, { shouldFail: fail });
}

async function installManualAudio(page) {
  await page.addInitScript(() => {
    class ManualAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.currentTime = 0;
      }
      load() {}
      pause() {}
      play() {
        window.__lesson49AudioPlayCount = (window.__lesson49AudioPlayCount || 0) + 1;
        window.__lesson49PendingAudio = this;
        return Promise.resolve();
      }
    }
    window.__finishLesson49Audio = () => {
      window.__lesson49PendingAudio?.dispatchEvent(new Event('ended'));
    };
    Object.defineProperty(window, 'Audio', { configurable: true, value: ManualAudio });
  });
}

async function openFresh(page) {
  await page.goto(EXPERIENCE_PATH);
  await page.evaluate(key => localStorage.removeItem(key), STORAGE_KEY);
  return page.reload();
}

function choice(page, fieldId, choiceId, mappingKey) {
  let locator = page.locator(
    `[data-response-fields] button[data-field-id="${fieldId}"][data-choice-id="${choiceId}"]`
  );
  if (mappingKey) locator = locator.filter({ has: page.locator(`xpath=self::*[@data-mapping-key="${mappingKey}"]`) });
  return locator;
}

async function choose(page, choices) {
  for (const [fieldId, choiceId, mappingKey] of choices) {
    await choice(page, fieldId, choiceId, mappingKey).click();
  }
}

async function openCurrentResponse(page) {
  const root = page.locator(rootSelector);
  if (await root.getAttribute('data-runtime-phase') === 'stimulus') {
    await page.locator('[data-audio-play]').click();
  }
  await expect(root).toHaveAttribute('data-runtime-phase', 'response');
  await expect(page.locator('[data-response-dock]')).toBeVisible();
}

async function completeMicrotask(page, microtaskId) {
  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-microtask', microtaskId);
  await openCurrentResponse(page);
  await choose(page, ANSWERS[microtaskId]);
  await expect(page.locator('[data-submit-response]')).toBeEnabled();
  await page.locator('[data-submit-response]').click();
}

async function completeThrough(page, finalNumber) {
  for (let number = 1; number <= finalNumber; number += 1) {
    const microtaskId = `L49-M${String(number).padStart(2, '0')}`;
    await completeMicrotask(page, microtaskId);
    if (number === 1) await page.locator('[data-growth-reveal]').click();
  }
}

test('a child completes all nine Lesson 49 microtasks and grows only after both whole acts', async ({ page }) => {
  await installInstantAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await openFresh(page);

  await page.evaluate(() => {
    localStorage.setItem('canran:l49:progress:v2', 'production-progress-sentinel');
    localStorage.setItem('canran:adventure-map:profile:v1', 'atlas-profile-sentinel');
    sessionStorage.setItem('lesson49:unrelated', 'session-sentinel');
  });

  expect(response.status()).toBe(200);
  const root = page.locator(rootSelector);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(root).toHaveAttribute('data-view', 'arrival');
  await expect(page.locator('[data-header-title]')).toContainText('肉铺订单');
  await expect(page.locator('[data-start-adventure]')).toHaveAccessibleName(/开始冒险/);
  await expect(page.locator('[data-debug-controls]')).toHaveCount(0);

  await page.locator('[data-start-adventure]').click();
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M01');
  await completeMicrotask(page, 'L49-M01');

  const reveal = page.locator('[data-growth-reveal]');
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('订单板');
  await expect(root).toHaveAttribute('data-build-stage', '1');
  await reveal.click();

  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M02');
  await expect(page.locator('[data-response-fields]')).not.toContainText('husband');
  for (let number = 2; number <= 8; number += 1) {
    await completeMicrotask(page, `L49-M${String(number).padStart(2, '0')}`);
    await expect(root).toHaveAttribute('data-build-stage', '1');
    await expect(reveal).toBeHidden();
  }

  await completeMicrotask(page, 'L49-M09');
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('备货台完整');
  await expect(root).toHaveAttribute('data-build-stage', '2');
  await reveal.click();

  await expect(root).toHaveAttribute('data-view', 'complete');
  await expect(page.locator('[data-lesson-complete]')).toContainText('Lesson 49');
  await expect(page.locator('[data-complete-stage]')).toHaveText('2');
  await expect(page.locator('[data-map-return]')).toHaveAttribute(
    'href',
    '/?district=first-book-49-60&focus=lesson49'
  );
  await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(29);

  const projection = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(projection.revision).toBe(10);
  expect(projection.value.units['FLC-U01'].buildStage).toBe(2);
  expect(projection.value.units['FLC-U01'].checkpoint.microtaskId).toBe('L49-M09');
  expect(projection.value.targets['FLC-U01-T01'].lastOutcome).toBe('independent');
  expect(projection.value.targets['FLC-U01-T01'].evidence).toEqual([]);
  expect(projection.value.districts['first-book-49-60'].challengeStars).toBe(0);
  await expect.poll(() => page.evaluate(() => ({
    progress: localStorage.getItem('canran:l49:progress:v2'),
    atlas: localStorage.getItem('canran:adventure-map:profile:v1'),
    session: sessionStorage.getItem('lesson49:unrelated')
  }))).toEqual({
    progress: 'production-progress-sentinel',
    atlas: 'atlas-profile-sentinel',
    session: 'session-sentinel'
  });
});

test('the response remains gated until all seven authored vocabulary segments emit ended', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeMicrotask(page, 'L49-M01');
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();

  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M02');
  await expect(root).toHaveAttribute('data-runtime-phase', 'stimulus');
  await expect(page.locator('[data-response-dock]')).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(1);

  for (let ended = 1; ended <= 6; ended += 1) {
    await page.evaluate(() => window.__finishLesson49Audio());
    await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(ended + 1);
    await expect(root).toHaveAttribute('data-runtime-phase', 'stimulus');
    await expect(page.locator('[data-response-dock]')).toBeHidden();
  }
  await page.evaluate(() => window.__finishLesson49Audio());
  await expect(root).toHaveAttribute('data-runtime-phase', 'response');
  await expect(page.locator('[data-response-dock]')).toBeVisible();

  await page.locator('[data-audio-play]').click();
  await expect(root).toHaveAttribute('data-audio-playing', 'true');
  await expect(root).toHaveAttribute('data-runtime-phase', 'response');
  await expect(page.locator('[data-response-dock]')).toBeVisible();
  for (let ended = 1; ended <= 7; ended += 1) {
    await page.evaluate(() => window.__finishLesson49Audio());
  }
  await expect(root).toHaveAttribute('data-audio-playing', 'false');
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M02');
  await expect(page.locator('[data-response-dock]')).toBeVisible();
});

test('the full-dialogue first listen highlights the authored speaker without revealing the transcript', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeMicrotask(page, 'L49-M01');
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();
  for (let ended = 1; ended <= 7; ended += 1) {
    await page.evaluate(() => window.__finishLesson49Audio());
  }
  await choose(page, ANSWERS['L49-M02']);
  await page.locator('[data-submit-response]').click();

  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M03');
  await page.locator('[data-audio-play]').click();
  await expect(page.locator('[data-audio-speaker]')).toHaveText('Butcher');
  await expect(page.locator('[data-scene-items] li[data-active="true"]')).toHaveText('Butcher');
  await expect(page.locator('[data-audio-fallback]')).toBeHidden();
  await expect(page.locator('[data-mission]')).not.toContainText('Do you want any meat today');

  await page.evaluate(() => window.__finishLesson49Audio());
  await expect(page.locator('[data-audio-speaker]')).toHaveText('Mrs. Bird');
  await expect(page.locator('[data-scene-items] li[data-active="true"]')).toHaveText('Mrs. Bird');
});

test('the first wrong composition gives a non-revealing correction cue and never grows the landmark', async ({ page }) => {
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await choose(page, [
    ['missingInformation', 'wanted'],
    ['missingInformation', 'unwanted'],
    ['missingInformation', 'shop'],
    ['firstClue', 'preference']
  ]);
  await page.locator('[data-submit-response]').click();

  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-support-level', '1');
  await expect(root).toHaveAttribute('data-build-stage', '0');
  await expect(page.locator('[data-feedback]')).toContainText('重新观察');
  await expect(page.locator('[data-feedback]')).not.toContainText('正确答案');
  await expect(page.locator('[data-response-field="missingInformation"]')).toHaveAttribute('data-conflict', 'true');
  await expect(page.locator('[data-response-fields] [data-correct="true"]')).toHaveCount(0);
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
});

test('four bounded errors on M06 switch context and require a child-completed assisted correction', async ({ page }) => {
  await installInstantAudio(page);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeThrough(page, 5);
  await expect(page.locator(rootSelector)).toHaveAttribute('data-runtime-microtask', 'L49-M06');
  await openCurrentResponse(page);

  await choose(page, [
    ['suggestedItem', 'beef'],
    ['referencedPiece', 'round-piece'],
    ['quantityItem', 'two-pounds-mince']
  ]);
  await page.locator('[data-submit-response]').click();
  await page.locator('[data-submit-response]').click();
  await page.locator('[data-submit-response]').click();

  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-context', 'picnic-supply');
  await expect(root).toHaveAttribute('data-support-level', '3');
  await choose(page, PICNIC_M06_WRONG);
  await page.locator('[data-submit-response]').click();

  await expect(root).toHaveAttribute('data-assistance-mode', 'true');
  await expect(page.locator('[data-model-card]')).toBeVisible();
  await expect(page.locator('[data-response-hint]')).toContainText('三个高亮槽');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();

  await choose(page, PICNIC_M06_CORRECT);
  await page.locator('[data-submit-response]').click();
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M07');
  await expect(root).toHaveAttribute('data-build-stage', '1');

  const projection = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(projection.value.units['FLC-U01'].checkpoint.microtaskId).toBe('L49-M06');
  expect(projection.value.units['FLC-U01'].checkpoint.completionStatus).toBe('completed-assisted');
  expect(projection.value.targets['FLC-U01-T01'].lastOutcome).toBe('failed');
  expect(projection.value.targets['FLC-U01-T01'].evidence).toEqual([]);
});

test('audio failure opens the complete authored text fallback without blocking the task', async ({ page }) => {
  await installInstantAudio(page, { fail: true });
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeMicrotask(page, 'L49-M01');
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();

  await expect(page.locator('[data-audio-fallback]')).toBeVisible();
  await expect(page.locator('[data-audio-fallback]')).toContainText('butcher');
  await expect(page.locator('[data-audio-fallback]')).toContainText('chicken');
  await expect(page.locator('[data-response-dock]')).toBeVisible();
});

test('a checkpoint after M05 resumes at M06 instead of replaying an earlier growth moment', async ({ page }) => {
  await installInstantAudio(page);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeThrough(page, 5);
  await page.reload();

  await expect(page.locator('[data-start-adventure]')).toContainText('继续冒险');
  await page.locator('[data-start-adventure]').click();
  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M06');
  await expect(root).toHaveAttribute('data-runtime-phase', 'stimulus');
  await expect(root).toHaveAttribute('data-build-stage', '1');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
});

test('a failed local checkpoint save leaves the landmark at its last durable stage', async ({ page }) => {
  await page.addInitScript(key => {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function guardedSetItem(candidate, value) {
      if (candidate === key) throw new DOMException('quota unavailable', 'QuotaExceededError');
      return nativeSetItem.call(this, candidate, value);
    };
  }, STORAGE_KEY);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeMicrotask(page, 'L49-M01');

  const root = page.locator(rootSelector);
  await expect(root).toHaveAttribute('data-runtime-microtask', 'L49-M01');
  await expect(root).toHaveAttribute('data-build-stage', '0');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
  await expect(page.locator('[data-feedback]')).toContainText('暂时没有保存');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test('reduced motion can complete the same nine-microtask durable flow', async ({ page }) => {
  await installInstantAudio(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await completeThrough(page, 8);
  await completeMicrotask(page, 'L49-M09');
  await page.locator('[data-growth-reveal]').click();

  await expect(page.locator(rootSelector)).toHaveAttribute('data-view', 'complete');
  await expect(page.locator(rootSelector)).toHaveAttribute('data-build-stage', '2');
});

for (const viewport of [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Huawei', width: 466, height: 980 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
]) {
  test(`${viewport.name} keeps navigation and response controls in one viewport`, async ({ page }) => {
    await installInstantAudio(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openFresh(page);
    const startBox = await page.locator('[data-start-adventure]').boundingBox();
    const backBox = await page.locator('.map-back').boundingBox();
    expect(startBox.height).toBeGreaterThanOrEqual(44);
    expect(backBox.height).toBeGreaterThanOrEqual(44);
    await page.locator('[data-start-adventure]').click();

    const headerBox = await page.locator('.story-header').boundingBox();
    for (let number = 1; number <= 9; number += 1) {
      const microtaskId = `L49-M${String(number).padStart(2, '0')}`;
      await expect(page.locator(rootSelector)).toHaveAttribute('data-runtime-microtask', microtaskId);
      await openCurrentResponse(page);

      for (const button of await page.locator('[data-response-fields] button').all()) {
        const box = await button.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      const submitBox = await page.locator('[data-submit-response]').boundingBox();
      expect(submitBox.height).toBeGreaterThanOrEqual(44);
      const missionBox = await page.locator('[data-mission]').boundingBox();
      const dockBox = await page.locator('[data-response-dock]').boundingBox();
      expect(missionBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);
      expect(missionBox.y + missionBox.height).toBeLessThanOrEqual(viewport.height + 1);
      expect(dockBox.y + dockBox.height).toBeLessThanOrEqual(viewport.height + 1);

      const geometry = await page.evaluate(() => ({
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        },
        body: {
          width: document.body.scrollWidth,
          height: document.body.scrollHeight
        }
      }));
      expect(geometry.document.width).toBeLessThanOrEqual(geometry.viewport.width + 1);
      expect(geometry.document.height).toBeLessThanOrEqual(geometry.viewport.height + 1);
      expect(geometry.body.width).toBeLessThanOrEqual(geometry.viewport.width + 1);
      expect(geometry.body.height).toBeLessThanOrEqual(geometry.viewport.height + 1);

      await choose(page, ANSWERS[microtaskId]);
      await page.locator('[data-submit-response]').click();
      if (number === 1 || number === 9) await page.locator('[data-growth-reveal]').click();
    }

    await expect(page.locator(rootSelector)).toHaveAttribute('data-view', 'complete');
    for (const control of await page.locator('.complete-actions a, .complete-actions button').all()) {
      const box = await control.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
}
