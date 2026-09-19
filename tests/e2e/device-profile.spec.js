'use strict';

const { test, expect } = require('@playwright/test');

test('home exposes one shared device profile without identity controls', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 2, l3: 0, l4: 0, l5: 0 }
    }));
  });

  await page.goto('/');
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: '设备冒险设置', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('进度会保存在这台设备上');
  await expect(dialog.locator('input')).toHaveCount(0);

  const profile = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:adventure-profile:v1'))
  );
  expect(profile.completedStages.lesson49).toEqual(['l1', 'l2']);
});

test('restart requires two confirmations, cancellation is safe, and old progress cannot return', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 0, l4: 0, l5: 0 }
    }));
    localStorage.setItem('another-site:preference', 'keep-me');
  });
  await page.reload();
  await page.evaluate(() => {
    localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3 }));
  });

  const readOwnedState = () => page.evaluate(() => ({
    profile: localStorage.getItem('canran:adventure-profile:v1'),
    progress: localStorage.getItem('canran:l49:progress:v2'),
    legacy: localStorage.getItem('l49-stars-v1')
  }));
  const before = await readOwnedState();

  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  expect(await readOwnedState()).toEqual(before);

  await page.getByRole('button', { name: '取消重开', exact: true }).click();
  expect(await readOwnedState()).toEqual(before);

  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();

  await expect(page.locator('#courses')).toBeVisible();
  await expect(page.getByRole('link', { name: '开始学习', exact: true })).toBeVisible();
  const after = await page.evaluate(() => ({
    profile: JSON.parse(localStorage.getItem('canran:adventure-profile:v1')),
    progress: JSON.parse(localStorage.getItem('canran:l49:progress:v2')),
    legacy: localStorage.getItem('l49-stars-v1'),
    unrelated: localStorage.getItem('another-site:preference')
  }));
  expect(after.profile.completedStages.lesson49).toEqual([]);
  expect(after.progress.ratings).toEqual({ l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });
  expect(after.legacy).toBeNull();
  expect(after.unrelated).toBe('keep-me');
});

test('blocked browser storage keeps the public course experience usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage is blocked', 'SecurityError');
      }
    });
  });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#courses')).toBeVisible();
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await expect(page.locator('#deviceStorageStatus')).toHaveText(
    '当前浏览器无法永久保存进度。'
  );
  expect(pageErrors).toEqual([]);
});

test('readable but unwritable browser storage stays usable with neutral feedback', async ({ page }) => {
  await page.addInitScript(() => {
    const rejectWrite = () => {
      throw new DOMException('Storage writes are blocked', 'QuotaExceededError');
    };
    Object.defineProperty(Storage.prototype, 'setItem', {
      configurable: true,
      value: rejectWrite
    });
    Object.defineProperty(Storage.prototype, 'removeItem', {
      configurable: true,
      value: rejectWrite
    });
  });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#courses')).toBeVisible();
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await expect(page.locator('#deviceStorageStatus')).toHaveText(
    '当前浏览器无法永久保存进度。'
  );

  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();

  await expect(page.locator('#deviceStorageStatus')).toHaveText(
    '部分记录暂时无法清除，请重试。'
  );
  await expect(page.locator('#courses')).toBeVisible();

  await expect(page.getByRole('button', { name: '重开冒险', exact: true })).toBeVisible();
  expect(pageErrors).toEqual([]);
});
