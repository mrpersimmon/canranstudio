'use strict';

const { test, expect } = require('@playwright/test');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routes = [
  { path: '/', title: /英语闯关乐园/ },
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
  await expect(page).toHaveTitle(/英语闯关乐园/);
});

test('/home/ preserves query and hash through the compatibility redirect', async ({ page }) => {
  const response = await page.goto('/home/?course=49#progress');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/?course=49#progress');
  await expect(page).toHaveTitle(/英语闯关乐园/);
});

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

test('Lesson 49 audio is present below the Lesson 49 route', async ({ request }) => {
  const response = await request.get('/lesson49/audio/beef.mp3');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('audio/mpeg');
});
