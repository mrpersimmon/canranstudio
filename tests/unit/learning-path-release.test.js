'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { prepare, assertCommitted, digest } = require('../../scripts/build-learning-path-release');
const { validateManifest } = require('../../core/course-package-installer');

test('the home release contains one HTML page and the verified course dependency closure', () => {
  const { files, manifest } = prepare();
  assert.deepEqual([...files.keys()].filter(f => /\.html?$/.test(f)), ['index.html']);
  assert.equal(files.size, manifest.entries.length + 2);
  validateManifest(manifest, { scopeUrl: 'https://www.canranstudio.cn/' });
  assert.throws(() => validateManifest(manifest, { scopeUrl: 'https://www.canranstudio.cn/poc/learning-path/' }));
  for (const entry of manifest.entries) {
    const content = files.get(entry.url.slice(1));
    assert.equal(content.length, entry.bytes, entry.url);
    assert.equal(digest(content), entry.sha256, entry.url);
  }
  const html = files.get('index.html').toString();
  const packageBytes = files.get('poc/learning-path/course-package-manifest.json');
  assert.ok(html.includes('data-manifest-sha256="' + digest(packageBytes) + '"'));
  assert.ok(html.includes('href="/" data-package-return'));
  assert.ok(![...files.keys()].some(f => /^lesson\d+\//.test(f) || f.includes('/slow-')));
});

test('the release refuses changed or untracked input instead of labelling it as HEAD', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-release-git-'));
  const git = args => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  try {
    git(['init', '-q']);
    fs.writeFileSync(path.join(dir, 'asset.js'), 'verified');
    git(['add', 'asset.js']);
    git(['-c', 'user.name=Release Test', '-c', 'user.email=release@example.test', 'commit', '-qm', 'fixture']);
    assert.match(assertCommitted(new Map([['asset.js', Buffer.from('verified')]]), dir), /^[a-f0-9]{40}$/);
    assert.throws(() => assertCommitted(new Map([['asset.js', Buffer.from('changed')]]), dir), /differs from HEAD/);
    assert.throws(() => assertCommitted(new Map([['missing.js', Buffer.from('new')]]), dir), /not committed/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
