'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  parseByteRange,
  rangedResponse,
  shouldBypassPackage
} = require('../../core/course-package-service-worker');

test('course-package service worker parses bounded and suffix byte ranges', () => {
  assert.deepEqual(parseByteRange('bytes=2-5', 10), { start: 2, end: 5 });
  assert.deepEqual(parseByteRange('bytes=7-', 10), { start: 7, end: 9 });
  assert.deepEqual(parseByteRange('bytes=-3', 10), { start: 7, end: 9 });
  assert.equal(parseByteRange('bytes=20-30', 10), null);
  assert.equal(parseByteRange('items=0-1', 10), null);
  assert.equal(parseByteRange('bytes=0-1,3-4', 10), null);
});

test('cached audio can satisfy a real Range request without touching the network', async () => {
  const source = new Response(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7]), {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg' }
  });
  const partial = await rangedResponse(source, 'bytes=2-5');
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get('Content-Range'), 'bytes 2-5/8');
  assert.equal(partial.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(partial.headers.get('Content-Length'), '4');
  assert.deepEqual([...new Uint8Array(await partial.arrayBuffer())], [2, 3, 4, 5]);
});

test('navigation and manifest checks bypass the active package cache', () => {
  assert.equal(shouldBypassPackage({
    url: 'https://course.test/poc/lesson/',
    method: 'GET',
    mode: 'navigate',
    headers: new Headers()
  }), true);
  assert.equal(shouldBypassPackage(new Request(
    'https://course.test/poc/lesson/course-package-manifest.json'
  )), true);
  assert.equal(shouldBypassPackage(new Request('https://course.test/core/runtime.js', {
    headers: { 'X-Course-Package-Install': '1' }
  })), true);
  assert.equal(shouldBypassPackage(new Request('https://course.test/core/runtime.js')), false);
});
