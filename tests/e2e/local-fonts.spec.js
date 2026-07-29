'use strict';

const { test, expect } = require('@playwright/test');

for (const path of ['/', '/lesson49/', '/lesson50/', '/soundmark/']) {
  test(`${path} loads its selected fonts without Google requests`, async ({ page }) => {
    const externalFonts = [];
    page.on('request', request => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) {
        externalFonts.push(request.url());
      }
    });

    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    expect(externalFonts).toEqual([]);
    const checks = await page.evaluate(() => ({
      zcool: document.fonts.check('16px "ZCOOL KuaiLe"'),
      display: location.pathname === '/soundmark/'
        ? document.fonts.check('16px "Fredoka"')
        : document.fonts.check('16px "Baloo 2"')
    }));
    expect(checks).toEqual({ zcool: true, display: true });
  });
}
