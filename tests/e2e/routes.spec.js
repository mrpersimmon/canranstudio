'use strict';

const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', title: /英语闯关乐园/ },
  { path: '/lesson49/', title: /肉店大冒险/ },
  { path: '/lesson50/', title: /挑食小王子大冒险/ },
  { path: '/soundmark/', title: /音标魔法乐园/ }
];

for (const route of routes) {
  test(`${route.path} has a deterministic static file`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
  });
}

test('/home/ remains a compatibility entry for plain static hosting', async ({ page }) => {
  const response = await page.goto('/home/');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page).toHaveTitle(/英语闯关乐园/);
});

test('/home/ preserves query and hash through the compatibility redirect', async ({ page }) => {
  const response = await page.goto('/home/?course=49#progress');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/?course=49#progress');
  await expect(page).toHaveTitle(/英语闯关乐园/);
});

test('welcome page and course tabs form a closed navigation loop', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/lesson50/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/soundmark/"]')).toHaveCount(1);

  for (const path of ['/lesson49/', '/lesson50/', '/soundmark/']) {
    await page.goto(path);
    await expect(page.locator('#coursenav a[href="/"]')).toHaveCount(1);
  }
});

test('Lesson 49 audio is present below the Lesson 49 route', async ({ request }) => {
  const response = await request.get('/lesson49/audio/beef.mp3');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('audio/mpeg');
});
