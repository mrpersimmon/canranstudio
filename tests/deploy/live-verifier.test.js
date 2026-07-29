'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { verifyBase, ROUTES } = require('../../scripts/verify-live');

const SECURITY_HEADERS = {
  'content-security-policy': "default-src 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-live-'));
  for (const route of ROUTES) {
    const target = path.join(root, route.file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `body:${route.path}`);
  }
  return root;
}

function fakeFetch(root, options = {}) {
  const {
    headerOverrides = {},
    bodyOverrides = {},
    statusOverrides = {},
    requestErrors = {},
    calls = []
  } = options;

  return async (url, requestOptions) => {
    calls.push({ url, requestOptions });
    const pathname = new URL(url).pathname;
    if (requestErrors[pathname]) throw requestErrors[pathname];
    const route = ROUTES.find(candidate => candidate.path === pathname);
    if (!route) return new Response('missing', { status: 404 });
    const body = bodyOverrides[pathname] ??
      await fs.readFile(path.join(root, route.file));
    return new Response(body, {
      status: statusOverrides[pathname] ?? 200,
      headers: { ...SECURITY_HEADERS, ...headerOverrides[pathname] }
    });
  };
}

test('verifyBase accepts exact artifact bytes and required HTTP headers', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const calls = [];

  const result = await verifyBase({
    baseUrl: 'http://59.110.217.36',
    root,
    fetchImpl: fakeFetch(root, { calls })
  });

  assert.equal(result.length, ROUTES.length);
  assert.equal(result.every(item => item.localSha256 === item.liveSha256), true);
  assert.equal(calls.length, ROUTES.length);
  assert.equal(calls.every(call => call.requestOptions.redirect === 'follow'), true);
});

test('verifyBase rejects a changed page body', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, { bodyOverrides: { '/lesson49/': 'stale body' } })
    }),
    /\/lesson49\/: hash mismatch/
  );
});

test('verifyBase rejects missing security headers and live HSTS', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, { headerOverrides: { '/': { 'x-frame-options': '' } } })
    }),
    /missing header x-frame-options/
  );
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {
        headerOverrides: { '/': { 'strict-transport-security': 'max-age=31536000' } }
      })
    }),
    /unexpected strict-transport-security/
  );
});

test('verifyBase aggregates status, request, and local artifact failures', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.rm(path.join(root, 'index.html'));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {
        statusOverrides: { '/lesson49/': 503 },
        requestErrors: { '/soundmark/': new Error('socket closed') }
      })
    }),
    error => {
      assert.match(error.message, /\/: failed to read local artifact index\.html: ENOENT/);
      assert.match(error.message, /\/lesson49\/: expected 200, received 503/);
      assert.match(error.message, /\/soundmark\/: request failed: socket closed/);
      return true;
    }
  );
});

test('verifyBase rejects HTTPS and malformed base URLs before requests', async () => {
  for (const baseUrl of [
    'https://59.110.217.36',
    'http://',
    'http:/59.110.217.36',
    'http:59.110.217.36',
    '59.110.217.36'
  ]) {
    let calls = 0;
    await assert.rejects(
      verifyBase({
        baseUrl,
        fetchImpl: async () => {
          calls += 1;
          throw new Error('must not request');
        }
      }),
      /HTTP-only verifier rejected base URL/
    );
    assert.equal(calls, 0, baseUrl);
  }
});
