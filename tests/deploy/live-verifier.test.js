'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const verifier = require('../../scripts/verify-live');
const { verifyBase, ROUTES } = verifier;

const EXPECTED_ROUTES = [
  { path: '/', file: 'index.html' },
  { path: '/lesson49/', file: 'lesson49/index.html' },
  { path: '/lesson50/', file: 'lesson50/index.html' },
  { path: '/soundmark/', file: 'soundmark/index.html' },
  { path: '/release-manifest.json', file: 'release-manifest.json' }
];

const SECURITY_HEADERS = {
  'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

test('live verifier exposes the named exact HTTP header contract used by fixtures', () => {
  assert.equal(Object.hasOwn(verifier, 'HTTP_HEADER_CONTRACT'), true);
  assert.deepEqual(verifier.HTTP_HEADER_CONTRACT, SECURITY_HEADERS);
});

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-live-'));
  for (const route of EXPECTED_ROUTES) {
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
    finalUrlOverrides = {},
    malformedResponses = {},
    calls = []
  } = options;

  return async (url, requestOptions) => {
    calls.push({ url, requestOptions });
    const pathname = new URL(url).pathname;
    if (requestErrors[pathname]) throw requestErrors[pathname];
    if (Object.hasOwn(malformedResponses, pathname)) return malformedResponses[pathname];
    const route = EXPECTED_ROUTES.find(candidate => candidate.path === pathname);
    if (!route) return new Response('missing', { status: 404 });
    const body = bodyOverrides[pathname] ??
      await fs.readFile(path.join(root, route.file));
    const response = new Response(body, {
      status: statusOverrides[pathname] ?? 200,
      headers: { ...SECURITY_HEADERS, ...headerOverrides[pathname] }
    });
    return {
      status: response.status,
      url: finalUrlOverrides[pathname] ?? url,
      headers: response.headers,
      arrayBuffer: () => response.arrayBuffer()
    };
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

  assert.equal(result.length, EXPECTED_ROUTES.length);
  assert.equal(result.every(item => item.localSha256 === item.liveSha256), true);
  assert.equal(calls.length, ROUTES.length);
  assert.equal(calls.every(call => call.requestOptions.redirect === 'follow'), true);
});

test('ROUTES is an immutable, exact copy of the independently declared route contract', () => {
  assert.deepEqual(ROUTES, EXPECTED_ROUTES);
  assert.equal(Object.isFrozen(ROUTES), true);
  assert.equal(ROUTES.every(route => Object.isFrozen(route)), true);
  assert.throws(() => {
    ROUTES[0].path = '/rewritten/';
  }, TypeError);
  assert.equal(ROUTES[0].path, '/');
  assert.throws(() => {
    ROUTES.push({ path: '/extra/', file: 'extra.html' });
  }, TypeError);
  assert.equal(ROUTES.length, EXPECTED_ROUTES.length);
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

test('verifyBase rejects every weakened required security header value', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  for (const [header, weakenedValue] of [
    ['content-security-policy', "default-src *"],
    ['x-content-type-options', 'allow-all'],
    ['x-frame-options', 'ALLOWALL'],
    ['referrer-policy', 'unsafe-url'],
    ['permissions-policy', '*']
  ]) {
    await assert.rejects(
      verifyBase({
        baseUrl: 'http://59.110.217.36',
        root,
        fetchImpl: fakeFetch(root, { headerOverrides: { '/': { [header]: weakenedValue } } })
      }),
      new RegExp(`unexpected header ${header}`),
      header
    );
  }
});

test('verifyBase rejects a byte-modified CSP even when it only adds a directive', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {
        headerOverrides: {
          '/': {
            'content-security-policy':
              `${SECURITY_HEADERS['content-security-policy']}; worker-src 'none'`
          }
        }
      })
    }),
    /unexpected header content-security-policy/
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

test('verifyBase aggregates undefined and malformed response interfaces with later request errors', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {
        malformedResponses: {
          '/': undefined,
          '/lesson49/': { status: '200', url: null, headers: null, arrayBuffer: null }
        },
        requestErrors: { '/soundmark/': new Error('socket closed') }
      })
    }),
    error => {
      assert.match(error.message, /^live HTTP verification failed:/);
      assert.match(error.message, /\/: invalid response object/);
      assert.match(error.message, /\/lesson49\/: invalid response status/);
      assert.match(error.message, /\/lesson49\/: invalid final response URL/);
      assert.match(error.message, /\/lesson49\/: invalid response headers interface/);
      assert.match(error.message, /\/lesson49\/: invalid response body interface/);
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
    '59.110.217.36',
    'http://59.110.217.36@evil.example/base?q=1#frag'
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

test('verifyBase rejects final HTTPS, cross-origin, wrong-path, and query response URLs', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {
        finalUrlOverrides: {
          '/': 'https://59.110.217.36/',
          '/lesson49/': 'http://other.example/lesson49/',
          '/lesson50/': 'http://59.110.217.36/not-lesson50/',
          '/soundmark/': 'http://59.110.217.36/soundmark/?cache=1',
          '/release-manifest.json': 'http://59.110.217.36/release-manifest.json#fragment'
        }
      })
    }),
    error => {
      assert.match(error.message, /\/: final response URL must use http:/);
      assert.match(error.message, /\/lesson49\/: final response URL origin does not match approved base/);
      assert.match(error.message, /\/lesson50\/: final response URL pathname does not match expected route/);
      assert.match(error.message, /\/soundmark\/: final response URL must not include query or fragment/);
      assert.match(error.message, /\/release-manifest\.json: final response URL must not include query or fragment/);
      return true;
    }
  );
});
