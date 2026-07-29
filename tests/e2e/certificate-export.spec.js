'use strict';

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:4173') return route.continue();
    return route.abort();
  });
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

test('Lesson 49 keeps exactly one URL owner when two asynchronous saves complete in reverse order', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    window.__pendingCertificateBlobs = [];
    HTMLCanvasElement.prototype.toBlob = callback => {
      window.__certificate.toBlobCalls += 1;
      window.__pendingCertificateBlobs.push(callback);
    };
    window.__saveResults = [
      saveCertImage().then(() => 'fulfilled', () => 'rejected'),
      saveCertImage().then(() => 'fulfilled', () => 'rejected')
    ];
  });
  await expect.poll(() => page.evaluate(() => window.__pendingCertificateBlobs.length)).toBe(2);

  expect(await page.evaluate(() => ({
    overlays: document.querySelectorAll('#certSaveOverlay').length,
    created: window.__certificate.createdUrls,
    revoked: window.__certificate.revokedUrls
  }))).toEqual({ overlays: 0, created: [], revoked: [] });

  await page.evaluate(() => {
    window.__pendingCertificateBlobs[1](new Blob(['newer'], { type: 'image/png' }));
  });
  await expect(page.locator('#certSaveOverlay')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__certificate.createdUrls.length)).toBe(1);
  expect(await page.evaluate(() => ({
    overlays: document.querySelectorAll('#certSaveOverlay').length,
    owner: document.querySelector('#certSaveOverlay img').getAttribute('src'),
    created: window.__certificate.createdUrls.map(item => item.value),
    revoked: window.__certificate.revokedUrls
  }))).toEqual({
    overlays: 1,
    owner: 'blob:canran-1',
    created: ['blob:canran-1'],
    revoked: []
  });

  await page.evaluate(() => {
    window.__pendingCertificateBlobs[0](new Blob(['older'], { type: 'image/png' }));
  });
  await expect.poll(() => page.evaluate(() => window.__certificate.createdUrls.length)).toBe(2);
  await expect(page.locator('#certSaveOverlay')).toHaveCount(1);
  expect(await page.evaluate(() => ({
    overlays: document.querySelectorAll('#certSaveOverlay').length,
    owner: document.querySelector('#certSaveOverlay img').getAttribute('src'),
    created: window.__certificate.createdUrls.map(item => item.value),
    revoked: window.__certificate.revokedUrls
  }))).toEqual({
    overlays: 1,
    owner: 'blob:canran-2',
    created: ['blob:canran-1', 'blob:canran-2'],
    revoked: ['blob:canran-1']
  });
  expect(await page.evaluate(() => Promise.all(window.__saveResults))).toEqual(['fulfilled', 'fulfilled']);

  await page.locator('#certSaveClose').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual([
    'blob:canran-1',
    'blob:canran-2'
  ]);
});

test('Lesson 49 transfers a URL despite download and logger cleanup failures', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    const removeChild = document.body.removeChild.bind(document.body);
    HTMLAnchorElement.prototype.click = () => { throw new Error('download failed'); };
    HTMLAnchorElement.prototype.remove = () => { throw new Error('remove failed'); };
    console.error = () => { throw new Error('logger failed'); };
    window.__anchorCount = () => document.querySelectorAll('a[download]').length;
    window.__restoreAnchorRemoval = () => removeChild;
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  expect(await page.evaluate(() => window.__anchorCount())).toBe(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual([]);
  await page.locator('#certSaveClose').click();
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 rolls back an overlay appended before its constructor throws', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    const appendChild = document.body.appendChild.bind(document.body);
    document.body.appendChild = node => {
      if (node.id === 'certSaveOverlay') {
        appendChild(node);
        throw new Error('append after insert failed');
      }
      return appendChild(node);
    };
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 removes foreign duplicate overlay IDs before committing a new owner', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    const foreign = document.createElement('div');
    foreign.id = 'certSaveOverlay';
    document.body.appendChild(foreign);
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(1);
  await page.locator('#certSaveClose').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 removes every mixed duplicate overlay and calls available foreign cleanup', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    window.__foreignCleanupCalls = [];
    const makeDuplicate = cleanup => {
      const node = document.createElement('div');
      node.id = 'certSaveOverlay';
      if (cleanup) node.__certCleanup = cleanup;
      document.body.appendChild(node);
    };
    makeDuplicate(null);
    makeDuplicate(() => window.__foreignCleanupCalls.push('cleanup-2'));
    makeDuplicate(() => {
      window.__foreignCleanupCalls.push('cleanup-3');
      throw new Error('foreign cleanup failed');
    });
  });
  expect(await page.locator('#certSaveOverlay').count()).toBe(3);

  await page.locator('#certSave').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(1);
  await expect(page.locator('#certSaveClose')).toHaveCount(1);
  expect(await page.evaluate(() => ({
    cleanupCalls: window.__foreignCleanupCalls,
    created: window.__certificate.createdUrls.map(item => item.value),
    revoked: window.__certificate.revokedUrls
  }))).toEqual({
    cleanupCalls: ['cleanup-2', 'cleanup-3'],
    created: ['blob:canran-1'],
    revoked: []
  });

  await page.locator('#certSaveClose').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 sanitizes DEL controls and truncates by Unicode code point', async ({ page }) => {
  await openCertificate(page, '小明');
  const value = await page.evaluate(() => sanitizeFilenamePart(
    `\u007f\u0080${'x'.repeat(39)}😀suffix`,
    'fallback'
  ));

  expect(value).not.toMatch(/[\u0000-\u001F\u007F-\u009F\\/:*?"<>|]/);
  expect(Array.from(value)).toHaveLength(40);
  expect(value.endsWith('😀')).toBe(true);
  expect(value.isWellFormed()).toBe(true);
  expect(await page.evaluate(() => sanitizeFilenamePart('\u007f\u0080', ' fallback '))).toBe('fallback');
});

test('Lesson 49 rejects malformed fallback data URLs without creating a URL', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = undefined;
    HTMLCanvasElement.prototype.toDataURL = () => 'not-data,cG5n';
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    createdUrls: [],
    revokedUrls: [],
    alerts: ['😢 证书生成失败，请再点一次试试']
  });
});

test('Lesson 49 reports fallback atob failure without creating a URL or overlay', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = undefined;
    HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,cG5n';
    window.atob = () => { throw new Error('decode failed'); };
  });
  await page.locator('#certSave').click();

  await expect.poll(() => page.evaluate(() => window.__certificate.alerts.length)).toBe(1);
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    createdUrls: [],
    revokedUrls: [],
    alerts: ['😢 证书生成失败，请再点一次试试']
  });
});

test('Lesson 49 reports fallback Blob construction failure without leaking browser state', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = undefined;
    HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,cG5n';
    const NativeBlob = window.Blob;
    window.__restoreCertificateBlob = () => { window.Blob = NativeBlob; };
    window.Blob = function ThrowingBlob() { throw new Error('Blob unavailable'); };
  });
  await page.locator('#certSave').click();

  await expect.poll(() => page.evaluate(() => window.__certificate.alerts.length)).toBe(1);
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    createdUrls: [],
    revokedUrls: [],
    alerts: ['😢 证书生成失败，请再点一次试试']
  });
  await page.evaluate(() => window.__restoreCertificateBlob());
});

test('Lesson 49 resolves a synchronous toBlob failure to user feedback', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = () => { throw new Error('encode failed'); };
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate)).toMatchObject({
    createdUrls: [],
    alerts: ['😢 证书生成失败，请再点一次试试']
  });
});

test('Lesson 49 keeps the first toBlob callback result', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = callback => {
      callback(new Blob(['first'], { type: 'image/png' }));
      callback(null);
    };
  });
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  expect(await page.evaluate(() => window.__certificate.createdUrls)).toEqual([
    { value: 'blob:canran-1', type: 'image/png' }
  ]);
  await page.locator('#certSaveClose').click();
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 keeps URL ownership when an anchor isConnected getter throws', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    const original = document.createElement.bind(document);
    document.createElement = tag => {
      const node = original(tag);
      if (tag === 'a') Object.defineProperty(node, 'isConnected', { get() { throw new Error('getter failed'); } });
      return node;
    };
  });
  await page.locator('#certSave').click();
  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  await page.locator('#certSaveClose').click();
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});

test('Lesson 49 uses replaceWith when anchor removal APIs throw', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    HTMLAnchorElement.prototype.remove = () => { throw new Error('remove failed'); };
    const original = document.createElement.bind(document);
    document.createElement = tag => {
      const node = original(tag);
      if (tag === 'a') {
        Object.defineProperty(node, 'parentNode', { get() { return { removeChild() { throw new Error('remove child failed'); } }; } });
      }
      return node;
    };
  });
  await page.locator('#certSave').click();
  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  expect(await page.locator('a[download]').count()).toBe(0);
});

test('Lesson 49 removes residual download references when every anchor removal API fails', async ({ page }) => {
  await openCertificate(page, '小明');
  await page.evaluate(() => {
    console.error = () => { throw new Error('logger failed'); };
    HTMLAnchorElement.prototype.remove = () => { throw new Error('remove failed'); };
    const original = document.createElement.bind(document);
    document.createElement = tag => {
      const node = original(tag);
      if (tag === 'a') {
        window.__failedRemovalAnchor = node;
        node.click = () => { throw new Error('download failed'); };
        node.replaceWith = () => { throw new Error('replace failed'); };
        Object.defineProperty(node, 'parentNode', { get() { throw new Error('parent failed'); } });
      }
      return node;
    };
  });
  const settled = await page.evaluate(() => saveCertImage().then(
    () => 'fulfilled',
    error => `rejected: ${error && error.message}`
  ));
  expect(settled).toBe('fulfilled');
  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  expect(await page.evaluate(() => {
    const anchor = window.__failedRemovalAnchor;
    return {
      href: anchor.hasAttribute('href'),
      download: anchor.hasAttribute('download'),
      hidden: anchor.hidden,
      ariaHidden: anchor.getAttribute('aria-hidden'),
      overlays: document.querySelectorAll('#certSaveOverlay').length,
      revoked: window.__certificate.revokedUrls
    };
  })).toEqual({
    href: false,
    download: false,
    hidden: true,
    ariaHidden: 'true',
    overlays: 1,
    revoked: []
  });
  await page.locator('#certSaveClose').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__certificate.revokedUrls)).toEqual(['blob:canran-1']);
});
