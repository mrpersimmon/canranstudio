'use strict';
const { test, expect } = require('@playwright/test');

// Editorial expectations checked against Cambridge US entries, not runtime data.
const vocabulary = [
  ['handbag', '/ˈhændbæɡ/'], ['pen', '/pen/'], ['pencil', '/ˈpensəl/'],
  ['book', '/bʊk/'], ['watch', '/wɑːtʃ/'], ['coat', '/koʊt/'],
  ['dress', '/dres/'], ['skirt', '/skɝːt/'], ['shirt', '/ʃɝːt/'],
  ['car', '/kɑːr/'], ['house', '/haʊs/'], ['excuse', '/ɪkˈskjuːz/'],
  ['me', '/miː/'], ['yes', '/jes/'], ['is', '/ɪz/'], ['this', '/ðɪs/'],
  ['your', '/jʊr/'], ['pardon', '/ˈpɑːrdən/'], ['it', '/ɪt/'],
  ['thank you', '/ˈθæŋk ˌjuː/'], ['very much', '/ˈveri mʌtʃ/']
];

for (const width of [320, 1280]) test(`${width} 像素：21 张词卡正面有美式音标，点读翻面、再翻回与刷新不丢失`, async ({ page }) => {
  await page.setViewportSize({ width, height: 850 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() {}
    };
  });
  await page.goto('/unit1-2/#learn/words');
  await page.evaluate(() => document.fonts.ready);
  const words = page.getByRole('region', { name: '物品小图鉴', exact: true });
  for (let i = 0; i < vocabulary.length; i++) {
    if (i && i % 6 === 0) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
    const [en, ph] = vocabulary[i], card = words.getByRole('button', { name: en, exact: true });
    const pronunciation = card.getByText(ph, { exact: true });
    await expect(pronunciation).toBeVisible();
    const fitting = () => card.evaluate(button => {
      const box = button.getBoundingClientRect();
      return [...button.children].filter(child => child.getClientRects().length).every(child => {
        const rect = child.getBoundingClientRect();
        return rect.left >= box.left && rect.right <= box.right && rect.top >= box.top && rect.bottom <= box.bottom;
      });
    });
    expect(await fitting(), `${en} 正面不裁切`).toBe(true);
    await card.click(); await expect(card).toHaveAttribute('aria-expanded', 'true');
    await expect(pronunciation).toBeHidden();
    expect(await fitting(), `${en} 词义不裁切`).toBe(true);
    await card.click(); await expect(pronunciation).toBeVisible();
  }
  await page.reload();
  await expect(words.getByRole('button', { name: 'very much', exact: true }).getByText('/ˈveri mʌtʃ/', { exact: true })).toBeVisible();
  for (let i = 0; i < 3; i++) await words.getByRole('button', { name: '上一组词卡', exact: true }).click();
  await expect(words.getByRole('button', { name: 'handbag', exact: true }).getByText('/ˈhændbæɡ/', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  await words.screenshot({ path: `output/playwright/unit12-standard/words-${width}.png` });
});
