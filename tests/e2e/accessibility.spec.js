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
