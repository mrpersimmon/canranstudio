'use strict';

const { test, expect } = require('@playwright/test');

const lessons = [
  {
    path: '/lesson49/',
    brand: '🥩 肉店大冒险',
    brandColor: 'rgb(201, 58, 40)',
    activeColor: 'rgb(232, 80, 58)',
    labels: ['封面', '第 1 关 · 单词', '第 2 关 · 课文', '第 3 关 · 句型', '第 4 关 · 三单', '第 5 关 · 考核']
  },
  {
    path: '/lesson50/',
    brand: '🤴 挑食小王子大冒险',
    brandColor: 'rgb(123, 95, 166)',
    activeColor: 'rgb(155, 126, 189)',
    labels: ['封面', '第 1 关 · 单词', '第 2 关 · 餐桌', '第 3 关 · 变身', '第 4 关 · 照妖镜', '第 5 关 · 考核']
  }
];

for (const lesson of lessons) {
  test(`${lesson.path} uses the compact themed course header`, async ({ page }) => {
    await page.goto(lesson.path);

    await expect(page.locator('#topbar .nav-links')).toHaveCount(0);
    await expect(page.locator('#starTrack')).toHaveCount(0);

    const brand = page.locator('#logo');
    await expect(brand).toHaveText(lesson.brand);
    await expect(brand).toHaveAttribute('href', '/');
    await expect(brand).toHaveAttribute('aria-label', '返回世界地图');
    await expect(brand).toHaveCSS('color', lesson.brandColor);

    await expect(page.locator('#starBox')).toContainText('⭐ 0/15');

    const dots = page.locator('#sectionDots a');
    await expect(dots).toHaveCount(6);
    expect(await dots.allTextContents()).toEqual(lesson.labels);
    await expect(page.locator('#sectionDots a[href="#cover"]')).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#sectionDots a[href="#cover"]')).toHaveCSS('background-color', lesson.activeColor);

    await page.locator('#sectionDots a[href="#l2"]').click();
    await expect(page).toHaveURL(new RegExp(`${lesson.path.replaceAll('/', '\\/')}#l2$`));
    await expect(page.locator('#sectionDots a[href="#l2"]')).toHaveAttribute('aria-current', 'location');

    const map = page.locator('#coursenav a[href="/"]');
    await expect(map).toHaveCount(1);
    await expect(map).toContainText('🗺️');
    await expect(map).toContainText('世界地图');
    await expect(map).toContainText('选课程');
  });

  test(`${lesson.path} keeps the compact header usable at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(lesson.path);

    await expect(page.locator('#sectionDots')).toBeHidden();
    await expect(page.locator('#logo')).toBeVisible();
    await expect(page.locator('#starBox')).toBeVisible();

    const metrics = await page.locator('#topbar').evaluate(header => {
      const brand = header.querySelector('#logo').getBoundingClientRect();
      const stars = header.querySelector('#starBox').getBoundingClientRect();
      return {
        height: header.getBoundingClientRect().height,
        brandLeft: brand.left,
        brandRight: brand.right,
        starsLeft: stars.left,
        starsRight: stars.right,
        viewportWidth: document.documentElement.clientWidth
      };
    });

    expect(metrics.height).toBeLessThanOrEqual(64);
    expect(metrics.brandLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.brandRight).toBeLessThanOrEqual(metrics.starsLeft);
    expect(metrics.starsRight).toBeLessThanOrEqual(metrics.viewportWidth);
  });
}
