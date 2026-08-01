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

  const dialog = page.getByRole('dialog', { name: '这台设备上的冒险', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('本机一份');
  await expect(dialog).toContainText('这里只保存一份共同进度，不是个人账号');
  await expect(dialog.locator('input')).toHaveCount(0);

  const profile = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:adventure-profile:v1'))
  );
  expect(profile.completedStages.lesson49).toEqual(['l1']);
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

  await expect(page.locator('#pt49')).toHaveText('0');
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
  await expect(page.locator('#lessonStations')).toBeVisible();
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await expect(page.locator('#deviceStorageStatus')).toHaveText(
    '这次进度只能暂时显示，关闭页面后可能不会保留。'
  );
  expect(pageErrors).toEqual([]);
});
