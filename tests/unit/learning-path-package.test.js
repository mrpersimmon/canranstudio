'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { sha256 } = require('../../scripts/build-course-package-manifests');
const { validateManifest } = require('../../core/course-package-installer');
const catalog = require('../../core/curriculum-catalog');
const ROOT = path.resolve(__dirname, '../..');
const PAGE = path.join(ROOT, 'poc/lesson1-2-experience');
const manifestBytes = fs.readFileSync(path.join(PAGE, 'path-package-manifest.json'));
const manifest = JSON.parse(manifestBytes);
const html = fs.readFileSync(path.join(PAGE, 'path.html'), 'utf8');
function sourcePath(url) {
  for (const [prefix, directory] of [['/poc/lesson-1-2/course/', 'poc/lesson1-2-experience/'], ['/poc/lesson-1-2/core/', 'core/'], ['/poc/lesson-1-2/assets/', 'assets/']]) {
    if (url.startsWith(prefix)) return path.join(ROOT, directory, url.slice(prefix.length));
  }
  throw new Error(`unexpected resource outside candidate route: ${url}`);
}
test('V3 candidate package has an exact entry digest and every resource has verified nonempty bytes', () => {
  assert.doesNotThrow(() => validateManifest(manifest, { origin: 'https://course.test', scopeUrl: 'https://course.test/poc/lesson-1-2/' }));
  assert.equal(manifest.revision, 'lesson1-2-v3.6');
  assert.equal(/data-manifest-sha256="([a-f0-9]{64})"/.exec(html)[1], sha256(manifestBytes));
  let bytes = 0;
  for (const entry of manifest.entries) {
    const content = fs.readFileSync(sourcePath(entry.url)); bytes += content.length;
    assert.equal(content.length, entry.bytes, entry.url); assert.equal(sha256(content), entry.sha256, entry.url);
  }
  assert.equal(bytes, manifest.totalBytes); assert.ok(bytes < 3 * 1024 * 1024, 'keep the compact lesson package below 3 MiB');
});
test('the candidate ships one validated V3 catalog and all-cat artwork without the V2 renderer or human assets', () => {
  const unit = JSON.parse(fs.readFileSync(path.join(PAGE, 'course-package/path-unit-catalog.json')));
  assert.deepEqual(catalog.validatePathExperience(unit), []);
  const urls = new Set(manifest.entries.map(e => e.url));
  assert.ok([...urls].every(url => !url.includes('/slow-')), 'retired slow audio is absent from the active course package');
  assert.ok(urls.has('/poc/lesson-1-2/core/learning-path-runtime.js'));
  assert.ok(urls.has('/poc/lesson-1-2/core/learning-path-scene.js'));
  assert.ok(!urls.has('/poc/lesson-1-2/core/learning-runtime.js'));
  assert.ok(!urls.has('/poc/lesson-1-2/core/learning-microtask-scene.js'));
  assert.ok(!urls.has('/poc/lesson-1-2/core/curriculum-catalog.js'));
  for (const id of unit.experience.scene.actorEntityIds) {
    assert.equal(unit.entities[id].characterSpecies, 'cat'); assert.ok(urls.has(unit.entities[id].assetSrc));
  }
  const art = manifest.entries.filter(e => /\.(png|webp|avif)$/.test(e.url));
  assert.equal(art.length, 14); assert.ok(art.every(e => e.url.includes('/assets/v3/')));
  const oldEntry = fs.readFileSync(path.join(PAGE, 'index.html'), 'utf8');
  assert.ok(!oldEntry.includes('learning-path-runtime')); assert.ok(oldEntry.includes('learning-microtask-scene'));
});
test('delivery images decode, and opaque white illustrations are explicitly declared rather than called transparent', async () => {
  const unit = catalog.getPathExperience();
  for (const entity of Object.values(unit.entities)) {
    const file = sourcePath(entity.assetSrc), meta = await sharp(file).metadata();
    assert.ok(meta.width >= 420 && meta.width <= 640); assert.ok(meta.height > 0);
    if (entity.deliveryBackground === 'white') {
      const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (const [x, y] of [[0,0], [info.width - 1,0], [0,info.height - 1], [info.width - 1,info.height - 1]]) {
        const pixel = [...data.slice((y * info.width + x) * info.channels, (y * info.width + x) * info.channels + 3)];
        assert.ok(pixel.every(c => c > 245), `${entity.entityId} white background`);
      }
    } else assert.equal(meta.hasAlpha, true, `${entity.entityId} requires alpha`);
  }
});
