'use strict';

const { test, expect } = require('@playwright/test');

const lessons = [
  {
    path: '/lesson49/',
    mapReturn: '/?district=first-book-49-60&focus=lesson49',
    mapLabel: '我的课程',
    mapSmall: '看肉店',
    brand: '我的课程',
    storyNavigation: true,
    brandColor: 'rgb(201, 58, 40)',
    activeColor: 'rgb(232, 80, 58)',
    labels: ['开门准备', '肉店小剧场', '招呼有妙招', '店员训练场', '小店我当家']
  },
  {
    path: '/lesson50/',
    mapReturn: '/?district=first-book-49-60&focus=lesson50',
    mapLabel: '返回王子城堡在世界地图的位置',
    mapSmall: '看城堡',
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
    await expect(brand).toHaveAttribute('href', lesson.mapReturn);
    await expect(brand).toHaveAttribute('aria-label', lesson.mapLabel);
    await expect(brand).toHaveCSS('color', lesson.brandColor);

    if (lesson.storyNavigation) {
      await expect(page.locator('#starCount')).toHaveText('0');
      await expect(page.locator('#starBox')).toContainText('/15');
      const links = page.locator('#chapterNav a');
      await expect(links).toHaveCount(5);
      expect(await links.allTextContents()).toEqual(lesson.labels);
      await expect(page.locator('#chapterNav a[href="#l1"]')).toHaveAttribute('aria-current', 'location');
      await page.locator('#chapterNav a[href="#l2"]').click();
      await expect(page).toHaveURL(/\/lesson49\/#l2$/);
      await expect(page.locator('#chapterNav a[href="#l2"]')).toHaveAttribute('aria-current', 'location');
      await expect(page.getByRole('heading', { name: '肉店小剧场', exact: true })).toBeFocused();
      return;
    }

    await expect(page.locator('#starBox')).toContainText('⭐ 0/15');

    const dots = page.locator('#sectionDots a');
    await expect(dots).toHaveCount(6);
    expect(await dots.allTextContents()).toEqual(lesson.labels);
    await expect(page.locator('#sectionDots a[href="#cover"]')).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#sectionDots a[href="#cover"]')).toHaveCSS('background-color', lesson.activeColor);

    await page.locator('#sectionDots a[href="#l2"]').click();
    await expect(page).toHaveURL(new RegExp(`${lesson.path.replaceAll('/', '\\/')}#l2$`));
    await expect(page.locator('#sectionDots a[href="#l2"]')).toHaveAttribute('aria-current', 'location');

    const map = page.locator(`#coursenav a[href="${lesson.mapReturn}"]`);
    await expect(map).toHaveCount(1);
    await expect(map).toContainText('🗺️');
    await expect(map).toContainText('世界地图');
    await expect(map).toContainText(lesson.mapSmall);
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
        rowHeight: header.querySelector('.wrap').getBoundingClientRect().height,
        brandLeft: brand.left,
        brandRight: brand.right,
        starsLeft: stars.left,
        starsRight: stars.right,
        viewportWidth: document.documentElement.clientWidth
      };
    });

    expect(metrics.rowHeight).toBeLessThanOrEqual(64);
    // Lesson 49's approved long page has a compact utility row and a chapter row.
    expect(metrics.height).toBeLessThanOrEqual(lesson.storyNavigation ? 132 : 64);
    expect(metrics.brandLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.brandRight).toBeLessThanOrEqual(metrics.starsLeft);
    expect(metrics.starsRight).toBeLessThanOrEqual(metrics.viewportWidth);
    if (lesson.storyNavigation) {
      const chapters = page.getByRole('combobox', { name: '选择关卡', exact: true });
      await expect(chapters).toBeVisible();
      const box = await chapters.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(40);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
      await chapters.selectOption('l2');
      await expect(page).toHaveURL(/\/lesson49\/#l2$/);
      await expect(page.getByRole('heading', { name: '肉店小剧场', exact: true })).toBeFocused();
    }
  });
}
