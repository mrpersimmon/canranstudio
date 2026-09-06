'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer } = require('../../scripts/serve-learning-path');
const { prepare, digest } = require('../../scripts/build-learning-path-release');

async function withServer(run) {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await run('http://127.0.0.1:' + server.address().port); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

test('standalone preview serves the same home and all verified dependencies', async () => {
  const { files } = prepare();
  await withServer(async origin => {
    for (const [relative, expected] of files) {
      const response = await fetch(origin + (relative === 'index.html' ? '/' : '/' + relative));
      assert.equal(response.status, 200, relative);
      assert.equal(digest(Buffer.from(await response.arrayBuffer())), digest(expected), relative);
    }
  });
});

test('standalone preview redirects retired pages without exposing old code or repository files', async () => {
  await withServer(async origin => {
    for (const route of ['/index.html', '/home/', '/lesson49/', '/poc/lesson-1-2/path.html', '/poc/learning-path/']) {
      const response = await fetch(origin + route, { redirect: 'manual' });
      assert.equal(response.status, 302, route);
      assert.equal(response.headers.get('location'), '/');
    }
    for (const route of ['/core/curriculum-catalog.js', '/content/learning-course.json', '/.git/config', '/release-manifest.json', '/missing.mp3']) {
      const response = await fetch(origin + route, { redirect: 'manual' });
      assert.ok([302, 404].includes(response.status), route);
      assert.equal(await response.text(), '', route);
    }
    assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405);
  });
});

test('standalone preview supports native audio range and HEAD requests', async () => {
  const { files } = prepare();
  const relative = 'poc/lesson-1-2/course/audio/l01-d01.mp3';
  const expected = files.get(relative);
  await withServer(async origin => {
    const response = await fetch(origin + '/' + relative, { headers: { Range: 'bytes=0-99' } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-type'), 'audio/mpeg');
    assert.equal(response.headers.get('content-range'), 'bytes 0-99/' + expected.length);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.subarray(0, 100));
    const head = await fetch(origin + '/' + relative, { method: 'HEAD' });
    assert.equal(Number(head.headers.get('content-length')), expected.length);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    const invalid = await fetch(origin + '/' + relative, { headers: { Range: 'bytes=999999999-' } });
    assert.equal(invalid.status, 416);
  });
});
