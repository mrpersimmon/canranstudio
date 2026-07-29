'use strict';

const { test, expect } = require('@playwright/test');

async function expectFeedbackRegions(page) {
  const result = await page.locator('.fb').evaluateAll(elements => {
    const originalElements = [...elements];
    initializeLiveRegions();
    initializeLiveRegions();
    return {
      count: elements.length,
      complete: elements.every(element =>
        element.getAttribute('role') === 'status' &&
        element.getAttribute('aria-live') === 'polite' &&
        element.getAttribute('aria-atomic') === 'true'
      ),
      preserved: elements.every((element, index) => element === originalElements[index])
    };
  });

  expect(result.count).toBeGreaterThan(0);
  expect(result.complete).toBe(true);
  expect(result.preserved).toBe(true);
}

async function rememberFeedbackNode(locator) {
  return locator.evaluate(element => {
    window.__eh2FeedbackNode = element;
    return element.textContent;
  });
}

async function expectSameLiveRegion(locator) {
  await expect(locator).toHaveAttribute('role', 'status');
  await expect(locator).toHaveAttribute('aria-live', 'polite');
  await expect(locator).toHaveAttribute('aria-atomic', 'true');
  expect(await locator.evaluate(element => element === window.__eh2FeedbackNode)).toBe(true);
}

test('Lesson 49 flip cards expose independent keyboard state and isolate speakers', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/lesson49/');

  const cards = page.locator('#cardGrid .fcard-in');
  const card = cards.first();
  const labels = await cards.evaluateAll(elements => elements.map(element => {
    const labelId = element.getAttribute('aria-labelledby');
    const label = labelId && document.getElementById(labelId);
    return {
      expanded: element.getAttribute('aria-expanded'),
      labelId,
      labelText: label && label.textContent,
      labelIdCount: [...document.querySelectorAll('[id]')]
        .filter(candidate => candidate.id === labelId).length,
      role: element.getAttribute('role'),
      tabindex: element.getAttribute('tabindex'),
      frontHidden: element.querySelector('.ffront').getAttribute('aria-hidden'),
      backHidden: element.querySelector('.fback').getAttribute('aria-hidden')
    };
  }));

  expect(new Set(labels.map(label => label.labelId)).size).toBe(labels.length);
  labels.forEach(label => {
    expect(label.labelId).toMatch(/^[A-Za-z][A-Za-z0-9_-]*$/);
    expect(label.labelText.trim()).not.toBe('');
    expect(label.labelIdCount).toBe(1);
    expect(label.role).toBe('button');
    expect(label.tabindex).toBe('0');
    expect(label.expanded).toBe('false');
    expect(label.frontHidden).toBe('false');
    expect(label.backHidden).toBe('true');
  });

  await card.click();
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  await expect(card.locator('.ffront')).toHaveAttribute('aria-hidden', 'true');
  await expect(card.locator('.fback')).toHaveAttribute('aria-hidden', 'false');

  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  expect(await card.evaluate(element => {
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  })).toBe(true);
  await expect(card).toHaveAttribute('aria-expanded', 'false');
  expect(await card.evaluate(element => {
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      repeat: true,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  })).toBe(false);
  await expect(card).toHaveAttribute('aria-expanded', 'false');

  const speaker = page.locator('#cardGrid .fcard').first().locator('.spk');
  await speaker.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-expanded', 'false');
  await speaker.click();
  await expect(card).toHaveAttribute('aria-expanded', 'false');

  await card.evaluate(element => {
    element.querySelector('.fen').firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  expect(errors).toEqual([]);
});

test('Lesson 49 card initialization is idempotent without replacing accessible state', async ({ page }) => {
  await page.goto('/lesson49/');

  const cards = page.locator('#cardGrid .fcard-in');
  await expect(cards).toHaveCount(17);
  await cards.first().evaluate(element => {
    window.__eh2InitialCard = element;
  });

  await page.evaluate(() => {
    buildCards();
    buildCards();
  });

  await expect(cards).toHaveCount(17);
  const evidence = await cards.evaluateAll(elements => {
    const labelIds = elements.map(element => element.getAttribute('aria-labelledby'));
    return {
      sameFirstCard: elements[0] === window.__eh2InitialCard,
      uniqueLabelIds: new Set(labelIds).size,
      exactLabelTargets: labelIds.every(labelId =>
        [...document.querySelectorAll('[id]')]
          .filter(candidate => candidate.id === labelId).length === 1
      )
    };
  });
  expect(evidence.sameFirstCard).toBe(true);
  expect(evidence.uniqueLabelIds).toBe(17);
  expect(evidence.exactLabelTargets).toBe(true);

  const firstCard = cards.first();
  await firstCard.focus();
  await page.keyboard.press('Enter');
  await expect(firstCard).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(firstCard).toHaveAttribute('aria-expanded', 'false');

  const liveRegionsRemainInitialized = await page.locator('.fb').evaluateAll(elements =>
    elements.length > 0 && elements.every(element =>
      element.getAttribute('role') === 'status' &&
      element.getAttribute('aria-live') === 'polite' &&
      element.getAttribute('aria-atomic') === 'true'
    )
  );
  expect(liveRegionsRemainInitialized).toBe(true);
});

test('Lesson 49 retains live feedback semantics after a feedback update', async ({ page }) => {
  await page.goto('/lesson49/');
  await expectFeedbackRegions(page);

  const feedback = page.locator('#daHint');
  const before = await rememberFeedbackNode(feedback);
  await page.locator('#daDo').click();
  await expect(feedback).not.toHaveText(before);
  await expectSameLiveRegion(feedback);
});

test('Lesson 50 retains live feedback semantics after a quiz update', async ({ page }) => {
  await page.goto('/lesson50/');
  await expectFeedbackRegions(page);

  const feedback = page.locator('#quizFb');
  await rememberFeedbackNode(feedback);
  await page.locator('#quizStartBtn').click();
  await page.locator('#quizOpts .opt-btn').first().click();
  await expect(feedback).not.toHaveText('');
  await expectSameLiveRegion(feedback);
});

test('soundmark retains feedback and toast live semantics after updates', async ({ page }) => {
  await page.goto('/soundmark/');
  await expectFeedbackRegions(page);

  const feedback = page.locator('#vsFb');
  const before = await rememberFeedbackNode(feedback);
  await page.locator('.vs-pick').first().click();
  await expect(feedback).not.toHaveText(before);
  await expectSameLiveRegion(feedback);

  const toast = page.locator('#toast');
  await rememberFeedbackNode(toast);
  await expectSameLiveRegion(toast);
  await page.evaluate(() => toast('EH-2 toast feedback'));
  await expect(toast).toHaveText('EH-2 toast feedback');
  await expectSameLiveRegion(toast);
  expect(await page.evaluate(() => {
    document.getElementById('toast').remove();
    try {
      initializeLiveRegions();
      return true;
    } catch (error) {
      return false;
    }
  })).toBe(true);
});

async function seedProgress(page, key, ratings) {
  await page.addInitScript(({ storageKey, values }) => {
    localStorage.setItem(storageKey, JSON.stringify({
      version: 2,
      ratings: values
    }));
  }, { storageKey: key, values: ratings });
}

async function expectModalFocusRoundTrip(page, opener, initialFocus) {
  await page.locator(opener).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator(initialFocus)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => {
    const dialogElement = document.querySelector('dialog[open]');
    return dialogElement && dialogElement.contains(document.activeElement);
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(opener)).toBeFocused();
}

test('Lesson 49 certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:l49:progress:v2',
    { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
  await page.goto('/lesson49/');
  await expectModalFocusRoundTrip(page, '#certBtn', '#certSave');
});

test('Lesson 50 certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:l50:progress:v2',
    { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
  await page.goto('/lesson50/');
  await expectModalFocusRoundTrip(page, '#certBtn', '#certSave');
});

test('soundmark certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:soundmark:progress:v2',
    { vs: 3, g1: 3, g2: 3, g3: 3 });
  await page.goto('/soundmark/');
  await page.locator('#certName').fill('小明');
  await expectModalFocusRoundTrip(page, '#btnOpenCert', '#certPrintAction');
});

const certificatePages = [
  {
    label: 'Lesson 49',
    path: '/lesson49/',
    key: 'canran:l49:progress:v2',
    ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 },
    opener: '#certBtn',
    primary: '#certSave',
    close: '#certClose',
    title: '肉店小学徒 · 结业证书'
  },
  {
    label: 'Lesson 50',
    path: '/lesson50/',
    key: 'canran:l50:progress:v2',
    ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 },
    opener: '#certBtn',
    primary: '#certSave',
    close: '#certClose',
    title: '皇家营养小顾问 · 结业证书'
  },
  {
    label: 'soundmark',
    path: '/soundmark/',
    key: 'canran:soundmark:progress:v2',
    ratings: { vs: 3, g1: 3, g2: 3, g3: 3 },
    opener: '#btnOpenCert',
    primary: '#certPrintAction',
    close: '#certClose',
    title: '毕业证书',
    name: '小明'
  }
];

async function prepareCertificatePage(page, config) {
  await seedProgress(page, config.key, config.ratings);
  await page.goto(config.path);
  if (config.name) await page.locator('#certName').fill(config.name);
}

for (const config of certificatePages) {
  test(`${config.label} certificate dialog has one name and three reliable close paths`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await prepareCertificatePage(page, config);

    const opener = page.locator(config.opener);
    const dialog = page.getByRole('dialog', { name: config.title, exact: true });
    await opener.focus();
    await opener.click();
    await expect(dialog).toHaveCount(1);
    await expect(page.locator(config.primary)).toBeFocused();
    await page.locator('#certCard').click({ position: { x: 30, y: 30 } });
    await expect(dialog).toBeVisible();
    await page.locator(config.close).click();
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.locator('#certModal').click({ position: { x: 2, y: 2 } });
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();

    await opener.click();
    await expect(dialog).toBeVisible();
    await page.locator(config.close).click();
    expect(errors).toEqual([]);
  });

  test(`${config.label} rapid Escape beats deferred primary focus and duplicate lifecycle is safe`, async ({ page }) => {
    await seedProgress(page, config.key, config.ratings);
    await page.addInitScript(() => {
      window.__certificateRafQueue = [];
      window.requestAnimationFrame = callback => {
        window.__certificateRafQueue.push(callback);
        return window.__certificateRafQueue.length;
      };
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(config.path);
    if (config.name) await page.locator('#certName').fill(config.name);

    const opener = page.locator(config.opener);
    const dialog = page.locator('#certModal');
    await opener.focus();
    await opener.click();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await page.evaluate(() => {
      const callbacks = window.__certificateRafQueue.splice(0);
      callbacks.forEach(callback => callback(performance.now()));
    });
    await expect(opener).toBeFocused();

    await page.evaluate(openFunctionName => {
      window[openFunctionName]();
      window[openFunctionName]();
    }, config.label === 'Lesson 49'
      ? 'openL49CertificateDialog'
      : config.label === 'Lesson 50'
        ? 'openL50CertificateDialog'
        : 'openSoundmarkCertificateDialog');
    await expect(dialog).toBeVisible();
    await page.evaluate(closeFunctionName => {
      window[closeFunctionName]();
      window[closeFunctionName]();
    }, config.label === 'Lesson 49'
      ? 'closeL49CertificateDialog'
      : config.label === 'Lesson 50'
        ? 'closeL50CertificateDialog'
        : 'closeSoundmarkCertificateDialog');
    await expect(dialog).not.toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${config.label} safely falls back when its remembered opener is disabled or removed`, async ({ page }) => {
    await prepareCertificatePage(page, config);
    const opener = page.locator(config.opener);
    const dialog = page.locator('#certModal');
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await opener.focus();
    await opener.click();
    await opener.evaluate(element => {
      element.disabled = true;
      element.remove();
    });
    await page.keyboard.press('Escape');

    await expect(dialog).not.toBeVisible();
    await expect(page.locator('#certName')).toBeFocused();
    expect(errors).toEqual([]);
  });
}

for (const lesson of [
  {
    label: 'Lesson 49',
    path: '/lesson49/',
    key: 'canran:l49:progress:v2',
    stateName: 'stars',
    gate: 'renderL49CertificateGate',
    save: 'saveCertImage'
  },
  {
    label: 'Lesson 50',
    path: '/lesson50/',
    key: 'canran:l50:progress:v2',
    stateName: 'stars',
    gate: 'renderL50CertificateGate',
    save: 'saveCertImage'
  }
]) {
  test(`${lesson.label} save and print reject eligibility lost after opening`, async ({ page }) => {
    await seedProgress(page, lesson.key, { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
    await page.addInitScript(() => {
      window.__certificateSaved = false;
      window.__certificatePrinted = false;
      window.print = () => { window.__certificatePrinted = true; };
    });
    await page.goto(lesson.path);
    await page.evaluate(saveName => {
      window[saveName] = () => { window.__certificateSaved = true; };
    }, lesson.save);

    await page.locator('#certBtn').click();
    await page.evaluate(stateName => {
      window.eval(`${stateName}={l1:1,l2:1,l3:1,l4:0,l5:1}`);
    }, lesson.stateName);
    await page.locator('#certSave').click();
    await expect(page.locator('#certModal')).not.toBeVisible();
    await expect(page.locator('#certBtn')).toBeDisabled();
    expect(await page.evaluate(() => window.__certificateSaved)).toBe(false);

    await page.evaluate(({ stateName, gate }) => {
      window.eval(`${stateName}={l1:1,l2:1,l3:1,l4:1,l5:1}`);
      window[gate]();
    }, { stateName: lesson.stateName, gate: lesson.gate });
    await page.locator('#certBtn').click();
    await page.evaluate(stateName => {
      window.eval(`${stateName}={l1:1,l2:1,l3:1,l4:0,l5:1}`);
    }, lesson.stateName);
    await page.locator('#certPrint').click();
    await expect(page.locator('#certModal')).not.toBeVisible();
    await expect(page.locator('#certBtn')).toBeDisabled();
    expect(await page.evaluate(() => window.__certificatePrinted)).toBe(false);
  });

  test(`${lesson.label} saved preview remains operable after the modal closes`, async ({ page }) => {
    await seedProgress(page, lesson.key, { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
    await page.addInitScript(() => {
      window.__previewRevoked = [];
      HTMLCanvasElement.prototype.toBlob = callback =>
        callback(new Blob(['png'], { type: 'image/png' }));
      URL.createObjectURL = () => 'blob:certificate-preview';
      URL.revokeObjectURL = url => window.__previewRevoked.push(url);
      HTMLAnchorElement.prototype.click = () => {};
    });
    await page.goto(lesson.path);
    await page.locator('#certBtn').click();
    await page.locator('#certSave').click();

    await expect(page.locator('#certModal')).not.toBeVisible();
    await expect(page.locator('#certSaveOverlay')).toBeVisible();
    await expect(page.locator('#certSaveClose')).toBeFocused();
    await page.locator('#certSaveClose').click();
    await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
    await expect(page.locator('#certBtn')).toBeFocused();
    expect(await page.evaluate(() => window.__previewRevoked)).toEqual([
      'blob:certificate-preview'
    ]);
  });
}
