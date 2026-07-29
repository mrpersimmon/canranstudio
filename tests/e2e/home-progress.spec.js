'use strict';

const { test, expect } = require('@playwright/test');

test('welcome page reads normalized v2 totals', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
  });

  await page.goto('/home/');

  await expect(page.locator('#pt49')).toHaveText('15');
  await expect(page.locator('#pt50')).toHaveText('5');
  await expect(page.locator('#ptSM')).toHaveText('12');
});
