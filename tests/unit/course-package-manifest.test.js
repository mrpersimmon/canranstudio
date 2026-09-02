'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { validateManifest } = require('../../core/course-package-installer');

const ROOT = path.resolve(__dirname, '../..');
const CASES = [
  ['NCE-U01', 'poc/lesson1-2-experience', '/poc/lesson1-2-experience/', 6 * 1024 * 1024],
  ['NCE-U02', 'poc/lesson3-4-experience', '/poc/lesson3-4-experience/', 4 * 1024 * 1024],
  ['NCE-U03', 'poc/lesson5-6-experience', '/poc/lesson5-6-experience/', 3 * 1024 * 1024],
  ['NCE-U04', 'poc/lesson7-8-experience', '/poc/lesson7-8-experience/', 3 * 1024 * 1024]
];

function digest(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

for (const [unitId, directory, scopePath, byteBudget] of CASES) {
  test(`${unitId} package manifest accounts for every declared byte`, () => {
    const manifestBytes = fs.readFileSync(path.join(ROOT, directory, 'course-package-manifest.json'));
    const manifest = JSON.parse(manifestBytes);
    const html = fs.readFileSync(path.join(ROOT, directory, 'index.html'), 'utf8');
    const embeddedHash = /data-manifest-sha256="([a-f0-9]{64})"/.exec(html)?.[1];

    assert.equal(embeddedHash, digest(manifestBytes));
    assert.equal(manifest.unitId, unitId);
    assert.equal(manifest.scopePath, scopePath);
    assert.ok(manifest.totalBytes <= byteBudget, `${unitId} package exceeds its byte budget`);
    assert.doesNotThrow(() => validateManifest(manifest, {
      origin: 'https://course.test',
      scopeUrl: `https://course.test${scopePath}`
    }));

    for (const entry of manifest.entries) {
      const bytes = fs.readFileSync(path.join(ROOT, entry.url.slice(1)));
      assert.equal(bytes.length, entry.bytes, `${entry.url} byte count`);
      assert.equal(digest(bytes), entry.sha256, `${entry.url} integrity`);
    }
  });

  test(`${unitId} package uses one unit catalog and content-addressed font shards`, () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(ROOT, directory, 'course-package-manifest.json'), 'utf8')
    );
    const urls = new Set(manifest.entries.map(entry => entry.url));
    const catalogUrl = `/${directory}/course-package/unit-catalog.json`;
    const unit = JSON.parse(fs.readFileSync(path.join(ROOT, catalogUrl.slice(1)), 'utf8'));

    assert.equal(unit.unitId, unitId);
    assert.ok(urls.has(catalogUrl));
    assert.ok(urls.has('/core/course-package-entry.js'));
    assert.ok(urls.has('/core/course-package-installer.js'));
    assert.ok(urls.has('/core/course-package-service-worker.js'));
    assert.ok(!urls.has('/core/curriculum-catalog.js'));
    assert.ok(!urls.has('/assets/fonts/zcool-kuaile-chinese-simplified-400.woff2'));
    assert.ok([...urls].some(url => (
      /^\/assets\/fonts\/course-package\/zcool-kuaile-\d+-400-normal-[a-f0-9]{16}\.woff2$/.test(url)
    )));
    for (const frame of [1, 2, 3, 4]) {
      assert.ok(urls.has(
        `/assets/adventure-map/mascot/loader/frame-${frame}-route-page-20260806-01-192.webp`
      ));
    }

    const packagedImageFamilies = new Map();
    for (const entry of manifest.entries.filter(candidate => candidate.kind === 'image')) {
      if (entry.url.includes('/mascot/loader/')) continue;
      const family = entry.url.replace(/\.(?:avif|jpe?g|png|webp)$/i, '');
      const members = packagedImageFamilies.get(family) || [];
      members.push(entry.url);
      packagedImageFamilies.set(family, members);
    }
    assert.deepEqual(
      [...packagedImageFamilies.values()].filter(members => members.length > 1),
      [],
      `${unitId} package must not download duplicate image formats`
    );
  });
}
