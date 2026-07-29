'use strict';

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    window.__certificate = {
      alerts: [],
      createdUrls: [],
      downloads: [],
      revokedUrls: [],
      toBlobCalls: 0,
      toDataUrlCalls: 0
    };
    HTMLCanvasElement.prototype.toBlob = function toBlob(callback) {
      window.__certificate.toBlobCalls += 1;
      callback(new Blob(['png'], { type: 'image/png' }));
    };
    HTMLCanvasElement.prototype.toDataURL = function toDataURL() {
      window.__certificate.toDataUrlCalls += 1;
      throw new Error('toDataURL must not be used while toBlob is available');
    };
    URL.createObjectURL = blob => {
      const value = `blob:canran-${window.__certificate.createdUrls.length + 1}`;
      window.__certificate.createdUrls.push({ value, type: blob.type });
      return value;
    };
    URL.revokeObjectURL = value => window.__certificate.revokedUrls.push(value);
    HTMLAnchorElement.prototype.click = function click() {
      window.__certificate.downloads.push({ href: this.href, download: this.download });
    };
    window.alert = message => window.__certificate.alerts.push(message);
  });
});

async function openCertificate(page, name = 'A/B:*?"<>| C') {
  await page.goto('/lesson49/');
  await page.locator('#certName').fill(name);
  await page.locator('#certBtn').click();
}

test('Lesson 49 exports through Blob, sanitizes the name, and revokes on close', async ({ page }) => {
  await openCertificate(page);
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  const evidence = await page.evaluate(() => window.__certificate);
  expect(evidence.toBlobCalls).toBe(1);
  expect(evidence.toDataUrlCalls).toBe(0);
  expect(evidence.createdUrls).toEqual([{ value: 'blob:canran-1', type: 'image/png' }]);
  expect(evidence.downloads).toEqual([{
    href: 'blob:canran-1',
    download: '肉店小学徒结业证书-AB C.png'
  }]);
  expect(evidence.downloads[0].download).toMatch(/^肉店小学徒结业证书-[^\\/:*?"<>|]+\.png$/);

  await page.locator('#certSaveClose').evaluate(close => { close.click(); close.click(); });
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 backdrop close revokes exactly once', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.locator('#certSave').click();
  await page.locator('#certSaveOverlay').click({ position: { x: 4, y: 4 } });

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 reports an empty Blob without creating or leaking a URL', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = callback => callback(null);
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    createdUrls: [],
    revokedUrls: [],
    alerts: ['😢 证书生成失败，请再点一次试试']
  });
});

test('Lesson 49 revokes a URL when overlay construction fails', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    const appendChild = document.body.appendChild.bind(document.body);
    document.body.appendChild = node => {
      if (node.id === 'certSaveOverlay') throw new Error('overlay unavailable');
      return appendChild(node);
    };
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 uses a data URL fallback only when toBlob is unavailable', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = undefined;
    HTMLCanvasElement.prototype.toDataURL = function toDataURL() {
      window.__certificate.toDataUrlCalls += 1;
      return 'data:image/png;base64,cG5n';
    };
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    toDataUrlCalls: 1,
    createdUrls: [{ value: 'blob:canran-1', type: 'image/png' }]
  });
  await page.locator('#certSaveClose').click();
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 replaces an active overlay without leaking either URL', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    void saveCertImage();
    void saveCertImage();
  });

  await expect(page.locator('#certSaveOverlay')).toHaveCount(1);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
  await page.locator('#certSaveClose').click();
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual([
    'blob:canran-1',
    'blob:canran-2'
  ]);
});
