'use strict';

const { test, expect } = require('@playwright/test');
const { PUBLISHED_COURSES, PRESENTATION_COURSES } = require('../../scripts/course-registry');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routes = [
  { path: '/', title: /十二城区冒险图鉴/ },
  ...PUBLISHED_COURSES.map(course => ({
    path: course.route,
    title: new RegExp(escapeRegExp(course.title))
  })),
  ...PRESENTATION_COURSES.map(course => ({
    path: course.presentation.route,
    title: /课堂投屏/
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
  await expect(page).toHaveTitle(/十二城区冒险图鉴/);
});

test('/home/ preserves query and hash through the compatibility redirect', async ({ page }) => {
  const response = await page.goto('/home/?course=49#progress');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/?course=49#progress');
  await expect(page).toHaveTitle(/十二城区冒险图鉴/);
});

test('atlas landmarks and course return links form a closed navigation loop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  for (const course of PUBLISHED_COURSES) {
    await expect(page.locator(`#districtLocations a[href="${course.route}"]`)).toHaveCount(1);
  }
  for (const course of PUBLISHED_COURSES) {
    await page.goto(course.route);
    const returnRoute = `/?district=first-book-49-60&focus=${course.id}`;
    expect(await page.locator(`a[href="${returnRoute}"]`).count()).toBeGreaterThanOrEqual(1);
  }
});

test('Lesson 49 audio is present below the Lesson 49 route', async ({ request }) => {
  const response = await request.get('/lesson49/audio/beef.mp3');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('audio/mpeg');
});
