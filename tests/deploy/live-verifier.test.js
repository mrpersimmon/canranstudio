'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');
const verifier = require('../../scripts/verify-live');
const { verifyBase, ROUTES, HTTP_HEADER_CONTRACT } = verifier;

const EXPECTED_ROUTES = [
  { path: '/', file: 'index.html' },
  ...PUBLISHED_COURSES.map(course => ({ path: course.route, file: course.entry })),
  { path: '/release-manifest.json', file: 'release-manifest.json' }
];

const SECURITY_HEADERS = {
  'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

const FIXTURE_FILES = {
  'index.html': Buffer.from('home'),
  'lesson49/index.html': Buffer.from('lesson49'),
  'lesson50/index.html': Buffer.from('lesson50'),
  'soundmark/index.html': Buffer.from('soundmark'),
  'lesson51/index.html': Buffer.from('lesson51'),
  'core/storage.js': Buffer.from('storage'),
  'assets/fonts/fonts.css': Buffer.from('fonts'),
  'lesson51/audio/climate.mp3': Buffer.from('mp3'),
  'home/index.html': Buffer.from('compatibility redirect')
};

const HOME_ALIASES = ['/home', '/home/', '/home/index.html'];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

test('live verifier exposes the named exact HTTP header contract used by fixtures', () => {
  assert.equal(Object.hasOwn(verifier, 'HTTP_HEADER_CONTRACT'), true);
  assert.deepEqual(HTTP_HEADER_CONTRACT, SECURITY_HEADERS);
});

test('ROUTES is an immutable, registry-derived copy of the route contract', () => {
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

async function manifestFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-live-manifest-'));
  for (const [file, bytes] of Object.entries(FIXTURE_FILES)) {
    const target = path.join(root, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
  }
  const manifest = {
    schema: 1,
    commit: 'a'.repeat(40),
    files: Object.fromEntries(
      Object.entries(FIXTURE_FILES).map(([file, bytes]) => [file, sha256(bytes)])
    )
  };
  await fs.writeFile(
    path.join(root, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return root;
}

async function updateManifest(root, update) {
  const manifestPath = path.join(root, 'release-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  update(manifest);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function manifestFetch(root, options = {}) {
  const {
    activity = { active: 0, maximum: 0, calls: [] },
    bodyOverrides = {},
    streamOverrides = {},
    headerOverrides = {},
    statusOverrides = {},
    finalUrlOverrides = {},
    delayOverrides = {}
  } = options;
  const routeFiles = new Map([
    ['/', 'index.html'],
    ...PUBLISHED_COURSES.map(course => [course.route, course.entry]),
    ['/release-manifest.json', 'release-manifest.json']
  ]);

  return async (url, requestOptions = {}) => {
    const parsed = new URL(url);
    const requestedPath = parsed.pathname;
    activity.calls.push({
      path: requestedPath,
      redirect: requestOptions.redirect,
      signal: requestOptions.signal
    });
    activity.active += 1;
    activity.maximum = Math.max(activity.maximum, activity.active);
    await new Promise(resolve => {
      const delay = delayOverrides[requestedPath];
      if (delay === undefined) setImmediate(resolve);
      else setTimeout(resolve, delay);
    });
    activity.active -= 1;

    if (HOME_ALIASES.includes(requestedPath) && requestOptions.redirect === 'manual') {
      const response = new Response('', {
        status: 308,
        headers: {
          ...HTTP_HEADER_CONTRACT,
          location: '/',
          ...headerOverrides[requestedPath]
        }
      });
      return {
        status: response.status,
        url,
        headers: response.headers,
        body: response.body,
        arrayBuffer: () => response.arrayBuffer()
      };
    }

    const followedHome = HOME_ALIASES.includes(requestedPath);
    const file = followedHome
      ? 'index.html'
      : (routeFiles.get(requestedPath) || decodeURIComponent(requestedPath.slice(1)));
    const override = bodyOverrides[requestedPath];
    const body = Object.hasOwn(streamOverrides, requestedPath)
      ? streamOverrides[requestedPath]()
      : (override === undefined ? await fs.readFile(path.join(root, file)) : override);
    const response = new Response(body, {
      status: statusOverrides[requestedPath] || 200,
      headers: {
        ...HTTP_HEADER_CONTRACT,
        ...headerOverrides[requestedPath]
      }
    });
    return {
      status: response.status,
      url: finalUrlOverrides[requestedPath] ||
        (followedHome ? `${parsed.origin}/` : url),
      headers: response.headers,
      body: response.body,
      arrayBuffer: () => response.arrayBuffer()
    };
  };
}

test('verifyBase fetches and hashes every runtime artifact with bounded concurrency', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const activity = { active: 0, maximum: 0, calls: [] };
  const results = await verifyBase({
    baseUrl: 'http://59.110.217.36',
    root,
    fetchImpl: manifestFetch(root, { activity }),
    concurrency: 2
  });

  assert.equal(activity.maximum <= 2, true);
  assert.deepEqual(
    results.filter(result => result.kind === 'asset').map(result => result.file).sort(),
    Object.keys(FIXTURE_FILES).filter(file => file !== 'home/index.html').sort()
  );
  assert.deepEqual(
    activity.calls
      .filter(call => HOME_ALIASES.includes(call.path))
      .map(({ path: callPath, redirect }) => ({ path: callPath, redirect })),
    HOME_ALIASES.flatMap(alias => [
      { path: alias, redirect: 'manual' },
      { path: alias, redirect: 'follow' }
    ])
  );
});

test('verifyBase reports changed JavaScript, font, and MP3 bytes in manifest order', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      concurrency: 3,
      fetchImpl: manifestFetch(root, {
        bodyOverrides: {
          '/core/storage.js': 'changed-js',
          '/assets/fonts/fonts.css': 'changed-font',
          '/lesson51/audio/climate.mp3': 'changed-mp3'
        },
        delayOverrides: {
          '/core/storage.js': 20,
          '/assets/fonts/fonts.css': 10,
          '/lesson51/audio/climate.mp3': 0
        }
      })
    }),
    error => {
      assert.match(error.message, /core\/storage\.js: hash mismatch/);
      assert.match(error.message, /assets\/fonts\/fonts\.css: hash mismatch/);
      assert.match(error.message, /lesson51\/audio\/climate\.mp3: hash mismatch/);
      assert.equal(
        error.message.indexOf('core/storage.js') <
          error.message.indexOf('assets/fonts/fonts.css'),
        true
      );
      assert.equal(
        error.message.indexOf('assets/fonts/fonts.css') <
          error.message.indexOf('lesson51/audio/climate.mp3'),
        true
      );
      return true;
    }
  );
});

test('verifyBase rejects a manifest mismatch before trusting asset paths', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const activity = { active: 0, maximum: 0, calls: [] };
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        activity,
        bodyOverrides: { '/release-manifest.json': '{"schema":1}' }
      })
    }),
    /release-manifest\.json: bytes differ/
  );
  assert.deepEqual(activity.calls.map(call => call.path), ['/release-manifest.json']);
});

test('verifyBase rejects malformed manifest paths before asset requests', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await updateManifest(root, manifest => {
    manifest.files['../escape.js'] = manifest.files['core/storage.js'];
    delete manifest.files['core/storage.js'];
  });
  const activity = { active: 0, maximum: 0, calls: [] };

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, { activity })
    }),
    /release-manifest\.json: malformed entry \.\.\/escape\.js/
  );
  assert.deepEqual(activity.calls.map(call => call.path), ['/release-manifest.json']);
});

test('verifyBase rejects declared and streamed oversized responses', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: {
          '/core/storage.js': {
            'content-length': String(8 * 1024 * 1024 + 1)
          }
        }
      })
    }),
    /core\/storage\.js: response exceeds 8388608 bytes/
  );

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        streamOverrides: {
          '/assets/fonts/fonts.css': () => new ReadableStream({
            start(controller) {
              controller.enqueue(new Uint8Array(4 * 1024 * 1024 + 1));
              controller.enqueue(new Uint8Array(4 * 1024 * 1024 + 1));
              controller.close();
            }
          })
        }
      })
    }),
    /assets\/fonts\/fonts\.css: response exceeds 8388608 bytes/
  );
});

test('verifyBase passes an aborting timeout signal to requests', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => {
        if (!signal) throw new Error('missing timeout signal');
        return new Promise((resolve, reject) => {
          const keepAlive = setTimeout(
            () => reject(new Error('timeout signal did not abort')),
            100
          );
          signal.addEventListener('abort', () => {
            clearTimeout(keepAlive);
            reject(signal.reason);
          }, { once: true });
        });
      }
    }),
    /release-manifest\.json: request failed: The operation was aborted due to timeout/
  );
});

test('verifyBase validates resource bounds before requests', async () => {
  for (const options of [
    { concurrency: 0 },
    { concurrency: 65 },
    { timeoutMs: 0 },
    { maxBytes: 0 }
  ]) {
    let calls = 0;
    await assert.rejects(
      verifyBase({
        baseUrl: 'http://59.110.217.36',
        ...options,
        fetchImpl: async () => {
          calls += 1;
          throw new Error('must not request');
        }
      }),
      /must be an integer/
    );
    assert.equal(calls, 0);
  }
});

test('verifyBase enforces exact headers and same-origin URLs for MP3 files', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: {
          '/lesson51/audio/climate.mp3': {
            'x-frame-options': 'ALLOWALL'
          }
        },
        finalUrlOverrides: {
          '/lesson51/audio/climate.mp3':
            'http://other.example/lesson51/audio/climate.mp3'
        }
      })
    }),
    error => {
      assert.match(error.message, /lesson51\/audio\/climate\.mp3: unexpected header x-frame-options/);
      assert.match(error.message, /lesson51\/audio\/climate\.mp3: final response URL origin does not match approved base/);
      return true;
    }
  );
});

test('verifyBase rejects every weakened header value and live HSTS', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const [header, value] of [
    ['content-security-policy', 'default-src *'],
    ['x-content-type-options', 'allow-all'],
    ['x-frame-options', 'ALLOWALL'],
    ['referrer-policy', 'unsafe-url'],
    ['permissions-policy', '*'],
    ['strict-transport-security', 'max-age=31536000']
  ]) {
    await assert.rejects(
      verifyBase({
        baseUrl: 'http://59.110.217.36',
        root,
        fetchImpl: manifestFetch(root, {
          headerOverrides: { '/': { [header]: value } }
        })
      }),
      new RegExp(
        header === 'strict-transport-security'
          ? 'index.html: unexpected strict-transport-security'
          : `index.html: unexpected header ${header}`
      )
    );
  }
});

test('verifyBase enforces all three home redirect locations', async t => {
  const root = await manifestFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: manifestFetch(root, {
        headerOverrides: { '/home/index.html': { location: '/wrong' } }
      })
    }),
    /\/home\/index\.html: expected Location: \//
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
