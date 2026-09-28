'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { createCoursePackages } = require('../../scripts/course-packages');
const { readPreviewFile } = require('../support/preview-files');

test('static preview serves public files but denies private paths, aliases, symlinks and foreign hosts', { timeout: 30000 }, async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-preview-boundary-'));
  const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-outside-'));
  t.after(async () => { await fs.rm(dir, { recursive: true, force: true }); await fs.rm(outside, { recursive: true, force: true }); });
  const secret = 'SYNTHETIC-PRIVATE-MARKER';
  for (const [name, body] of Object.entries({
    'index.html': '<h1>public control</h1>', 'assets/visible.json': '{"public":true}',
    '.data/lesson-access/private.json': secret, '.git/config': secret,
    'server/app.js': secret, 'docs/private.html': secret,
    'tests/fixtures/root-media-worker.js': '/* public worker */', 'tests/fixtures/private.json': secret
  })) { await fs.mkdir(path.dirname(path.join(dir, name)), { recursive: true }); await fs.writeFile(path.join(dir, name), body); }
  await fs.chmod(path.join(dir, '.data'), 0o700); await fs.chmod(path.join(dir, '.data/lesson-access/private.json'), 0o600);
  await fs.writeFile(path.join(outside, 'private.json'), secret);
  await fs.symlink(path.join(dir, '.data/lesson-access/private.json'), path.join(dir, 'assets/inside.json'));
  await fs.symlink(path.join(outside, 'private.json'), path.join(dir, 'assets/outside.json'));
  const child = spawn(process.execPath, [path.resolve(__dirname, '../support/static-server.js')], { cwd: dir, env: { ...process.env, COURSE_TEST_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await new Promise(resolve => child.once('exit', resolve)); } });
  const port = await new Promise((resolve, reject) => {
    let text = '';
    child.stdout.on('data', bytes => { text += bytes; const match = text.match(/127\.0\.0\.1:(\d+)/); if (match) resolve(Number(match[1])); });
    child.once('error', reject); child.once('exit', code => reject(Error('Preview exited: ' + code)));
  });
  const request = (url, headers = {}, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: url, method, headers }, res => {
      let body = ''; res.on('data', bytes => body += bytes); res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    }); req.on('error', reject); req.end();
  });
  for (const url of ['/.data/lesson-access/private.json', '/%2edata/lesson-access/private.json', '/lesson/.data/lesson-access/private.json', '/lesson/%2edata/lesson-access/private.json', '/.git/config', '/server/app.js', '/docs/private.html', '/tests/fixtures/private.json', '/assets/../.data/lesson-access/private.json', '/assets/%2e%2e%2f.data/lesson-access/private.json', '/assets/inside.json', '/assets/outside.json']) {
    const res = await request(url); assert.equal(res.status, 403, url); assert.ok(!res.body.includes(secret));
  }
  assert.equal((await request('/%ZZ')).status, 400);
  assert.equal((await request('/', { Host: 'attacker.invalid:' + port })).status, 403);
  assert.equal((await request('/', { Origin: 'https://attacker.invalid' })).status, 403);
  assert.equal((await request('/', {}, 'POST')).status, 405);
  const page = await request('/'); assert.equal(page.status, 200); assert.match(page.body, /public control/);
  assert.equal((await request('/', { Host: 'localhost:' + port })).status, 200);
  assert.equal((await request('/assets/visible.json')).status, 200);
  assert.equal((await request('/assets/visible.json', {}, 'HEAD')).body, '');
  const worker = await request('/tests/fixtures/root-media-worker.js'); assert.equal(worker.status, 200); assert.equal(worker.headers['service-worker-allowed'], '/');
  assert.equal((await request('/lesson/tests/fixtures/root-media-worker.js')).status, 200);
});

test('preview package construction rejects private symlinks before hash resource aliases are published', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-package-boundary-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const [name, body] of Object.entries({
    'unit13-14/index.html': '<html><head><title>Public fixture</title></head><body>public</body></html>',
    'core/course-withdrawals.json': '[]', 'core/course-cache.js': '/* cache */',
    'core/course-loader.js': '/* loader */', 'core/course-worker.js': '/* worker */',
    'assets/brand/starflower.png': 'synthetic public brand',
    '.data/private.svg': 'SYNTHETIC-PRIVATE-PACKAGE-MARKER'
  })) { await fs.mkdir(path.dirname(path.join(dir, name)), { recursive: true }); await fs.writeFile(path.join(dir, name), body); }
  await fs.mkdir(path.join(dir, 'assets/unit13-14'));
  await fs.symlink(path.join(dir, '.data/private.svg'), path.join(dir, 'assets/unit13-14/probe.svg'));
  const options = { root: dir, basePath: '/lesson/', courseIds: ['unit13-14'] };
  // Confirm this is a real package-alias trigger, not an unused fixture path.
  const unrestricted = await createCoursePackages(options);
  assert.ok([...unrestricted.generated.values()].some(item => item.body.includes('SYNTHETIC-PRIVATE-PACKAGE-MARKER')));
  const readSource = relative => readPreviewFile(dir, relative);
  await assert.rejects(createCoursePackages({ ...options, readSource }), e => e.status === 403);
  await fs.unlink(path.join(dir, 'assets/unit13-14/probe.svg'));
  await fs.writeFile(path.join(dir, 'assets/unit13-14/probe.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  const safe = await createCoursePackages({ ...options, readSource });
  const manifest = JSON.parse(safe.generated.get(safe.index.courses['unit13-14'].manifest.slice('/lesson/'.length)).body);
  const asset = manifest.required.find(item => item.key === '/lesson/assets/unit13-14/probe.svg');
  assert.ok(asset); assert.equal(safe.generated.get(asset.url.slice('/lesson/'.length)).body.toString(), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  assert.ok([...safe.generated.values()].every(item => !item.body.includes('SYNTHETIC-PRIVATE-PACKAGE-MARKER')));
});
