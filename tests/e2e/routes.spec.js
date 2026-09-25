'use strict';

const { test, expect } = require('@playwright/test');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routes = [
  { path: '/', title: /我的课程/ },
  ...PUBLISHED_COURSES.map(course => ({
    path: course.route,
    title: new RegExp(escapeRegExp(course.title))
  }))
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
  await expect(page).toHaveTitle(/我的课程/);
});

test('/home/ preserves query and hash through the compatibility redirect', async ({ page }) => {
  const response = await page.goto('/home/?course=49#progress');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/?course=49#progress');
  await expect(page).toHaveTitle(/我的课程/);
});

test('paired unit navigation excludes retired standalone course cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.featured-course')).toHaveCount(16);
  await expect(page.locator('main a[href^="/lesson49/"], main a[href^="/lesson50/"], main a[href^="/soundmark/"]')).toHaveCount(0);
  await page.locator('#unit12Entry').click();
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(page.locator('#unit12Entry')).toBeVisible();
});

test('Lesson 49 audio is present below the Lesson 49 route', async ({ request }) => {
  const response = await request.get('/lesson49/audio/beef.mp3');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('audio/mpeg');
});
