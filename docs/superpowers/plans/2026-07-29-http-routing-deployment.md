# Deterministic Routing and HTTP Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for repository changes and superpowers:verification-before-completion before any local or live completion claim.

**Goal:** Make `/`, `/lesson49/`, `/lesson50/`, and `/soundmark/` work from the repository layout itself, produce an auditable static artifact, and make the accepted public-HTTP deployment contract reproducible without hidden Nginx rewrites.

**Architecture:** Move the welcome page to the repository root and Lesson 49 into its own directory. Keep `/home/` as a static-host-compatible redirect. Build `dist/` from an explicit public allowlist and include a source-SHA/hash manifest. Commit one HTTP-only Nginx server block and a verifier that compares live page bytes and response headers with the exact local artifact.

**Tech Stack:** Static HTML/assets, Node.js 20+, Playwright 1.62.0, Nginx 1.28.0 Alpine syntax check, GitHub Actions

## Preconditions and Accepted Risk

- Complete both:
  - `docs/superpowers/plans/2026-07-29-state-integrity-remediation.md`
  - `docs/superpowers/plans/2026-07-29-audio-lifecycle-remediation.md`
- Start from a clean worktree with `npm test` passing.
- The production base URL remains `http://59.110.217.36`.
- Do not add port 443, TLS certificate handling, HTTP-to-HTTPS redirects, HSTS, or
  `upgrade-insecure-requests`.
- Keep CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy` on HTTP responses.
- Public HTTP is an explicitly accepted temporary transport risk; completing this plan does not
  close audit finding RISK-HTTP-01.
- ICP and other regulatory compliance are external gates. A successful HTTP deployment is not a
  compliance approval.
- Do not overwrite an unknown live Nginx configuration. Capture `nginx -T`, identify the loaded
  block currently serving the IP, and obtain operator confirmation before retiring that exact file.

---

### Task 1: Make the repository directory tree match its public routes

**Files:**
- Create: `tests/e2e/routes.spec.js`
- Move: `index.html` → `lesson49/index.html`
- Move: `audio/` → `lesson49/audio/`
- Move: `README.md` → `lesson49/README.md`
- Move: `home/index.html` → `index.html`
- Create: `home/index.html`
- Create: `README.md`
- Modify: `tests/e2e/smoke.spec.js`
- Modify: `tests/e2e/l49-progress.spec.js`
- Modify: `tests/e2e/home-progress.spec.js`
- Modify: `tests/e2e/audio-lifecycle.spec.js`
- Modify: `lesson49/README.md`

**Route contract:**

| URL | Repository file | Expected page |
|---|---|---|
| `/` | `index.html` | welcome/course picker |
| `/home/` | `home/index.html` | compatibility redirect to `/` |
| `/lesson49/` | `lesson49/index.html` | Lesson 49 |
| `/lesson50/` | `lesson50/index.html` | Lesson 50 |
| `/soundmark/` | `soundmark/index.html` | soundmark course |

- [ ] **Step 1: Write the failing deterministic-route tests**

Create `tests/e2e/routes.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

const routes = [
  { path: '/', title: /英语闯关乐园/ },
  { path: '/lesson49/', title: /肉店大冒险/ },
  { path: '/lesson50/', title: /挑食小王子大冒险/ },
  { path: '/soundmark/', title: /音标魔法乐园/ }
];

for (const route of routes) {
  test(`${route.path} has a deterministic static file`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
  });
}

test('/home/ remains a compatibility entry for plain static hosting', async ({ page }) => {
  const response = await page.goto('/home/');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page).toHaveTitle(/英语闯关乐园/);
});

test('welcome page and course tabs form a closed navigation loop', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/lesson50/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/soundmark/"]')).toHaveCount(1);

  for (const path of ['/lesson49/', '/lesson50/', '/soundmark/']) {
    await page.goto(path);
    await expect(page.locator('#coursenav a[href="/"]')).toHaveCount(1);
  }
});

test('Lesson 49 audio is present below the Lesson 49 route', async ({ request }) => {
  const response = await request.get('/lesson49/audio/beef.mp3');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('audio/mpeg');
});
```

- [ ] **Step 2: Run the route tests and confirm the current mismatch**

Run:

```bash
npm run test:e2e -- tests/e2e/routes.spec.js
```

Expected:

- `/` has the Lesson 49 title instead of the welcome title;
- `/lesson49/` returns 404;
- `/home/` does not redirect;
- `/lesson49/audio/beef.mp3` returns 404.

- [ ] **Step 3: Move the public files without rewriting page content**

Run:

```bash
mkdir lesson49
git mv index.html lesson49/index.html
git mv audio lesson49/audio
git mv README.md lesson49/README.md
git mv home/index.html index.html
```

Create `home/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="refresh" content="0;url=/">
  <link rel="canonical" href="/">
  <title>正在前往英语闯关乐园</title>
</head>
<body>
  <p><a href="/">进入英语闯关乐园</a></p>
  <script>
    location.replace('/' + location.search + location.hash);
  </script>
</body>
</html>
```

Relative `audio/...` URLs in Lesson 49 now resolve to `/lesson49/audio/...`. Absolute
`/core/...` script URLs and the existing bottom navigation continue to work without edits.

- [ ] **Step 4: Update all route-sensitive browser tests**

In `tests/e2e/smoke.spec.js`, replace the route array with:

```javascript
for (const path of ['/', '/home/', '/lesson49/', '/lesson50/', '/soundmark/']) {
```

Make these exact replacements:

```text
tests/e2e/l49-progress.spec.js:
  page.goto('/')       -> page.goto('/lesson49/')

tests/e2e/home-progress.spec.js:
  page.goto('/home/')  -> page.goto('/')

tests/e2e/audio-lifecycle.spec.js, Lesson 49 test only:
  page.goto('/')       -> page.goto('/lesson49/')
```

Run this search and inspect every match; root-page tests must intentionally test the welcome page:

```bash
rg -n "page\\.goto\\('/'\\)|page\\.goto\\('/home/'\\)" tests/e2e
```

- [ ] **Step 5: Create the repository-level README**

Create `README.md`:

```markdown
# canranstudio

儿童英语互动课件静态站点。

## Public routes

- `/` — 课程欢迎页
- `/lesson49/` — 新概念英语 Lesson 49
- `/lesson50/` — 新概念英语 Lesson 50
- `/soundmark/` — 音标魔法乐园
- `/home/` — 兼容入口，跳转到 `/`

## Local verification

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm test
```

## Production transport

The current accepted deployment target is `http://59.110.217.36`. HTTPS, HSTS, and an
HTTP-to-HTTPS redirect are intentionally out of scope until the external filing and deployment
decision changes. This is a temporary accepted risk, not a security or compliance closure.

See `deploy/README.md` for the release and verification contract.
```

In `lesson49/README.md`:

- change the online URL to `http://59.110.217.36/lesson49/`;
- state that the page is deployed from `lesson49/index.html`;
- update the progress key to `canran:l49:progress:v2`;
- state that audio lifecycle behavior comes from `/core/audio-player.js`.

- [ ] **Step 6: Run the deterministic-route gate**

Run:

```bash
npm run test:e2e -- tests/e2e/routes.spec.js tests/e2e/smoke.spec.js tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js tests/e2e/audio-lifecycle.spec.js
git diff --check
```

Expected: all targeted tests pass and `git diff --check` prints no output.

- [ ] **Step 7: Commit the repository layout**

```bash
git add README.md index.html home lesson49 tests/e2e
git commit -m "refactor: make public routes match repository layout"
```

---

### Task 2: Build an explicit, hashed static release artifact

**Files:**
- Create: `tests/deploy/static-build.test.js`
- Create: `scripts/build-static.js`
- Modify: `package.json`

**Artifact contract:**
- Output directory: `dist/`
- Public inputs only: the four HTML entries, compatibility HTML, three audio directories,
  `core/`, and optional `assets/`
- Generated: `dist/release-manifest.json`
- Excluded: Git data, repository documentation, tests, deployment scripts, and source plans

- [ ] **Step 1: Write the failing artifact test**

Create `tests/deploy/static-build.test.js`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { buildStatic } = require('../../scripts/build-static');

const ROOT = path.resolve(__dirname, '../..');

test('buildStatic emits only the public route tree plus a hash manifest', async t => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-dist-'));
  t.after(() => fs.rm(out, { recursive: true, force: true }));

  await buildStatic({ root: ROOT, out });

  for (const file of [
    'index.html',
    'home/index.html',
    'lesson49/index.html',
    'lesson49/audio/beef.mp3',
    'lesson50/index.html',
    'soundmark/index.html',
    'core/audio-player.js',
    'release-manifest.json'
  ]) {
    assert.equal((await fs.stat(path.join(out, file))).isFile(), true, file);
  }

  await assert.rejects(fs.stat(path.join(out, 'README.md')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(out, 'docs')), { code: 'ENOENT' });

  const manifest = JSON.parse(await fs.readFile(
    path.join(out, 'release-manifest.json'),
    'utf8'
  ));
  assert.equal(manifest.schema, 1);
  assert.equal(
    manifest.commit,
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim()
  );
  assert.match(manifest.files['lesson49/index.html'], /^[a-f0-9]{64}$/);
});
```

- [ ] **Step 2: Run the test and confirm the missing build module**

Run:

```bash
node --test tests/deploy/static-build.test.js
```

Expected: FAIL with `Cannot find module '../../scripts/build-static'`.

- [ ] **Step 3: Implement the allowlisted builder**

Create `scripts/build-static.js`:

```javascript
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const REQUIRED = [
  'index.html',
  'home/index.html',
  'lesson49/index.html',
  'lesson49/audio',
  'lesson50/index.html',
  'lesson50/audio',
  'soundmark/index.html',
  'soundmark/audio',
  'core'
];
const OPTIONAL = ['assets'];

async function exists(file) {
  try {
    await fs.stat(file);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function listFiles(directory, prefix = '') {
  const output = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      output.push(...await listFiles(absolute, relative));
    } else if (entry.isFile()) {
      output.push(relative);
    }
  }
  return output;
}

async function buildStatic({
  root = path.resolve(__dirname, '..'),
  out = path.resolve(root, 'dist')
} = {}) {
  if (path.resolve(out) === path.resolve(root)) {
    throw new Error('refusing to use the repository root as build output');
  }
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(out, { recursive: true });

  for (const relative of REQUIRED) {
    const source = path.join(root, relative);
    if (!await exists(source)) throw new Error(`missing public input: ${relative}`);
    await fs.cp(source, path.join(out, relative), { recursive: true });
  }
  for (const relative of OPTIONAL) {
    const source = path.join(root, relative);
    if (await exists(source)) {
      await fs.cp(source, path.join(out, relative), { recursive: true });
    }
  }

  const files = {};
  for (const relative of await listFiles(out)) {
    const bytes = await fs.readFile(path.join(out, relative));
    files[relative] = crypto.createHash('sha256').update(bytes).digest('hex');
  }
  const manifest = {
    schema: 1,
    commit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8'
    }).trim(),
    files
  };
  await fs.writeFile(
    path.join(out, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return manifest;
}

if (require.main === module) {
  buildStatic()
    .then(manifest => {
      process.stdout.write(`built dist for ${manifest.commit}\n`);
    })
    .catch(error => {
      process.stderr.write(`${error.stack || error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = { buildStatic };
```

- [ ] **Step 4: Add build and deployment-test scripts**

Add to `package.json` scripts:

```json
{
  "build:static": "node scripts/build-static.js",
  "test:deploy": "node --test tests/deploy/*.test.js"
}
```

- [ ] **Step 5: Build twice and verify stable hashes**

Run:

```bash
npm run test:deploy
npm run build:static
cp dist/release-manifest.json /tmp/canran-manifest-first.json
npm run build:static
cmp /tmp/canran-manifest-first.json dist/release-manifest.json
```

Expected:

- the deployment unit test passes;
- `dist/` contains only public files and the manifest;
- `cmp` exits 0.

- [ ] **Step 6: Commit the artifact builder**

```bash
git add package.json scripts/build-static.js tests/deploy/static-build.test.js
git commit -m "build: create hashed static release artifact"
```

---

### Task 3: Commit and syntax-check the HTTP-only Nginx contract

**Files:**
- Create: `deploy/nginx/canranstudio-http.conf`
- Create: `tests/deploy/nginx-config.test.js`
- Modify: `.github/workflows/verify.yml`

- [ ] **Step 1: Write a failing policy test for the server block**

Create `tests/deploy/nginx-config.test.js`:

```javascript
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

test('Nginx contract serves the public IP over HTTP from the atomic release link', () => {
  assert.match(config, /\blisten\s+80;/);
  assert.match(config, /\bserver_name\s+59\.110\.217\.36;/);
  assert.match(config, /\broot\s+\/var\/www\/canranstudio\/current;/);
  assert.match(config, /location = \/home\/\s*\{\s*return 308 \/;\s*\}/);
  assert.match(config, /try_files \$uri \$uri\/ =404;/);
});

test('Nginx contract keeps the approved HTTP security headers', () => {
  for (const header of [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy'
  ]) {
    assert.match(config, new RegExp(`add_header ${header} `));
  }
});

test('Nginx contract has no accidental TLS or upgrade policy', () => {
  assert.doesNotMatch(config, /\blisten\s+443\b/);
  assert.doesNotMatch(config, /\bssl_(certificate|protocols|ciphers)\b/);
  assert.doesNotMatch(config, /Strict-Transport-Security/i);
  assert.doesNotMatch(config, /\breturn\s+30[178]\s+https:\/\//i);
  assert.doesNotMatch(config, /upgrade-insecure-requests/i);
});
```

- [ ] **Step 2: Run the policy test and confirm the missing config**

Run:

```bash
node --test tests/deploy/nginx-config.test.js
```

Expected: FAIL with `ENOENT` for `deploy/nginx/canranstudio-http.conf`.

- [ ] **Step 3: Create the complete HTTP server block**

Create `deploy/nginx/canranstudio-http.conf`:

```nginx
# canranstudio public HTTP contract.
# HTTPS/HSTS are intentionally absent while the accepted HTTP-only deployment remains in force.
server {
    listen 80;
    listen [::]:80;
    server_name 59.110.217.36;

    root /var/www/canranstudio/current;
    index index.html;
    charset utf-8;
    server_tokens off;

    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Cache-Control "no-cache" always;

    location = /home {
        return 308 /;
    }

    location = /home/ {
        return 308 /;
    }

    location = /home/index.html {
        return 308 /;
    }

    location = /lesson49 {
        return 308 /lesson49/;
    }

    location = /lesson50 {
        return 308 /lesson50/;
    }

    location = /soundmark {
        return 308 /soundmark/;
    }

    location / {
        try_files $uri $uri/ =404;
        limit_except GET HEAD {
            deny all;
        }
    }

    location ~ /\. {
        deny all;
    }
}
```

- [ ] **Step 4: Run semantic and real Nginx syntax checks**

Run:

```bash
node --test tests/deploy/nginx-config.test.js
docker run --rm \
  -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.28.0-alpine nginx -t
```

Expected:

- all three Node policy tests pass;
- Nginx prints `syntax is ok` and `test is successful`.

- [ ] **Step 5: Add the Nginx syntax check to CI**

After `npm run test:e2e` in `.github/workflows/verify.yml`, add:

```yaml
      - run: npm run test:deploy
      - run: npm run build:static
      - run: |
          docker run --rm \
            -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
            nginx:1.28.0-alpine nginx -t
```

- [ ] **Step 6: Commit the HTTP contract**

```bash
git add deploy/nginx/canranstudio-http.conf tests/deploy/nginx-config.test.js .github/workflows/verify.yml
git commit -m "deploy: codify public HTTP routing"
```

---

### Task 4: Verify live HTTP bytes and headers against `dist/`

**Files:**
- Create: `scripts/verify-live.js`
- Create: `tests/deploy/live-verifier.test.js`
- Modify: `package.json`

**Verification scope:**
- Exact body hash for four HTML routes and `release-manifest.json`
- Status 200 for every checked route
- Five required security headers on every checked response
- Explicit rejection of a live HSTS header while HTTP-only mode is in force

- [ ] **Step 1: Write the failing verifier tests**

Create `tests/deploy/live-verifier.test.js`:

```javascript
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

function fakeFetch(root, headerOverrides = {}, bodyOverrides = {}) {
  return async url => {
    const pathname = new URL(url).pathname;
    const route = ROUTES.find(candidate => candidate.path === pathname);
    if (!route) return new Response('missing', { status: 404 });
    const body = bodyOverrides[pathname] ??
      await fs.readFile(path.join(root, route.file));
    return new Response(body, {
      status: 200,
      headers: { ...SECURITY_HEADERS, ...headerOverrides }
    });
  };
}

test('verifyBase accepts exact artifact bytes and required HTTP headers', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = await verifyBase({
    baseUrl: 'http://59.110.217.36',
    root,
    fetchImpl: fakeFetch(root)
  });

  assert.equal(result.length, ROUTES.length);
  assert.equal(result.every(item => item.localSha256 === item.liveSha256), true);
});

test('verifyBase rejects a changed page body', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, {}, { '/lesson49/': 'stale body' })
    }),
    /hash mismatch.*\/lesson49\//
  );
});

test('verifyBase rejects a missing security header or live HSTS', async t => {
  const root = await fixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, { 'x-frame-options': '' })
    }),
    /missing header x-frame-options/
  );
  await assert.rejects(
    verifyBase({
      baseUrl: 'http://59.110.217.36',
      root,
      fetchImpl: fakeFetch(root, { 'strict-transport-security': 'max-age=31536000' })
    }),
    /unexpected strict-transport-security/
  );
});
```

- [ ] **Step 2: Run the tests and confirm the missing verifier**

Run:

```bash
node --test tests/deploy/live-verifier.test.js
```

Expected: FAIL with `Cannot find module '../../scripts/verify-live'`.

- [ ] **Step 3: Implement the live verifier**

Create `scripts/verify-live.js`:

```javascript
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const ROUTES = Object.freeze([
  { path: '/', file: 'index.html' },
  { path: '/lesson49/', file: 'lesson49/index.html' },
  { path: '/lesson50/', file: 'lesson50/index.html' },
  { path: '/soundmark/', file: 'soundmark/index.html' },
  { path: '/release-manifest.json', file: 'release-manifest.json' }
]);
const REQUIRED_HEADERS = Object.freeze([
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy'
]);

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

async function verifyBase({
  baseUrl,
  root = path.resolve(__dirname, '../dist'),
  fetchImpl = globalThis.fetch
}) {
  if (!/^http:\/\//.test(baseUrl)) {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }
  const results = [];
  const failures = [];

  for (const route of ROUTES) {
    const url = new URL(route.path, baseUrl).href;
    let response;
    try {
      response = await fetchImpl(url, { redirect: 'follow' });
    } catch (error) {
      failures.push(`${route.path}: request failed: ${error.message}`);
      continue;
    }
    if (response.status !== 200) {
      failures.push(`${route.path}: expected 200, received ${response.status}`);
      continue;
    }

    for (const header of REQUIRED_HEADERS) {
      if (!response.headers.get(header)) {
        failures.push(`${route.path}: missing header ${header}`);
      }
    }
    if (response.headers.get('strict-transport-security')) {
      failures.push(`${route.path}: unexpected strict-transport-security`);
    }

    const localBytes = await fs.readFile(path.join(root, route.file));
    const liveBytes = Buffer.from(await response.arrayBuffer());
    const localSha256 = sha256(localBytes);
    const liveSha256 = sha256(liveBytes);
    if (localSha256 !== liveSha256) {
      failures.push(`${route.path}: hash mismatch (${localSha256} != ${liveSha256})`);
    }
    results.push({
      path: route.path,
      status: response.status,
      localSha256,
      liveSha256
    });
  }

  if (failures.length) {
    throw new Error(`live HTTP verification failed:\n${failures.join('\n')}`);
  }
  return results;
}

if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://59.110.217.36';
  verifyBase({ baseUrl })
    .then(results => {
      for (const result of results) {
        process.stdout.write(`${result.status} ${result.path} ${result.liveSha256}\n`);
      }
    })
    .catch(error => {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = { ROUTES, REQUIRED_HEADERS, verifyBase };
```

- [ ] **Step 4: Add the live verification script**

Add to `package.json`:

```json
{
  "verify:live:http": "node scripts/verify-live.js http://59.110.217.36"
}
```

- [ ] **Step 5: Run deployment tests without mutating the live server**

Run:

```bash
npm run test:deploy
npm run build:static
```

Expected: all deployment tests pass and the local artifact is rebuilt. Do not run
`verify:live:http` as evidence for a new release until that exact `dist/` has been deployed.

- [ ] **Step 6: Commit the live verifier**

```bash
git add scripts/verify-live.js tests/deploy/live-verifier.test.js package.json
git commit -m "test: verify live HTTP artifact and headers"
```

---

### Task 5: Document the atomic HTTP release procedure and final gates

**Files:**
- Create: `deploy/README.md`
- Modify: `tests/README.md`
- Modify: `.github/workflows/verify.yml`

- [ ] **Step 1: Write the deployment runbook**

Create `deploy/README.md` with the following content. Use a four-backtick outer fence so the inner
command blocks render correctly:

````markdown
# HTTP deployment runbook

## Scope

Production is intentionally served at `http://59.110.217.36`. This runbook does not configure
TLS, redirect HTTP to HTTPS, or add HSTS. Passing it does not close the accepted transport finding
or establish ICP compliance.

## 1. Local release gate

Use a clean commit:

```bash
npm ci
npx playwright install chromium
npm test
npm run test:deploy
npm run build:static
git diff --check
git status --short
git rev-parse HEAD
```

`git status --short` must be empty. Record the printed SHA as `RELEASE_SHA`.

## 2. Read-only server preflight

Set the SSH destination in the shell; it is deliberately not stored in the repository:

```bash
test -n "$CANRAN_DEPLOY_TARGET"
ssh "$CANRAN_DEPLOY_TARGET" 'sudo nginx -T 2>&1'
ssh "$CANRAN_DEPLOY_TARGET" 'readlink -f /var/www/canranstudio/current || true'
```

Inspect the `nginx -T` output and identify every loaded server block that can answer
`59.110.217.36:80`, including wildcard/default blocks. Do not continue while an unaccounted hidden
rewrite or alias still owns one of the four public routes.

If an older site file must be retired, back up and disable that exact observed file only. This is a
manual operator gate because its path cannot be inferred safely from the repository.

## 3. Upload an immutable release

```bash
RELEASE_SHA="$(git rev-parse HEAD)"
RELEASE_ARCHIVE="/tmp/canranstudio-${RELEASE_SHA}.tar.gz"
tar -C dist -czf "$RELEASE_ARCHIVE" .
scp "$RELEASE_ARCHIVE" "$CANRAN_DEPLOY_TARGET:/tmp/canranstudio-${RELEASE_SHA}.tar.gz"
scp deploy/nginx/canranstudio-http.conf "$CANRAN_DEPLOY_TARGET:/tmp/canranstudio-http.conf"
```

## 4. Install and atomically activate

```bash
RELEASE_SHA="$(git rev-parse HEAD)"
ssh "$CANRAN_DEPLOY_TARGET" "
  set -eu
  sudo install -d -m 0755 /var/www/canranstudio/releases/${RELEASE_SHA}
  sudo tar -xzf /tmp/canranstudio-${RELEASE_SHA}.tar.gz \
    -C /var/www/canranstudio/releases/${RELEASE_SHA}
  sudo install -m 0644 /tmp/canranstudio-http.conf \
    /etc/nginx/conf.d/canranstudio-http.conf
  sudo ln -sfnT /var/www/canranstudio/releases/${RELEASE_SHA} \
    /var/www/canranstudio/current
  sudo nginx -t
  sudo systemctl reload nginx
"
```

Do not delete older release directories in the same change. The previous symlink target is the
rollback artifact.

## 5. Exact-release verification

```bash
npm run verify:live:http
ssh "$CANRAN_DEPLOY_TARGET" \
  'cat /var/www/canranstudio/current/release-manifest.json'
```

The live verifier must report status 200 and equal SHA-256 values for all five resources. The live
manifest commit must equal local `git rev-parse HEAD`.

## 6. Rollback

Point `current` to the exact previously recorded release directory, then test and reload:

```bash
test -n "$CANRAN_PREVIOUS_RELEASE"
ssh "$CANRAN_DEPLOY_TARGET" "
  set -eu
  sudo test -f /var/www/canranstudio/releases/${CANRAN_PREVIOUS_RELEASE}/release-manifest.json
  sudo ln -sfnT /var/www/canranstudio/releases/${CANRAN_PREVIOUS_RELEASE} \
    /var/www/canranstudio/current
  sudo nginx -t
  sudo systemctl reload nginx
"
```

Run `npm run verify:live:http` only against a local checkout and `dist/` built from the rollback
SHA; otherwise hash mismatch is expected.
````

- [ ] **Step 2: Update test documentation**

Add to `tests/README.md`:

```markdown
`npm run test:deploy` checks the public artifact and HTTP-only Nginx policy.
`npm run build:static` creates the exact `dist/` release and hash manifest.
`npm run verify:live:http` is a post-deploy gate and must use that exact local artifact.
```

- [ ] **Step 3: Make the CI sequence match the design**

The final `.github/workflows/verify.yml` order must be:

```yaml
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:deploy
      - run: npm run build:static
      - run: |
          docker run --rm \
            -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
            nginx:1.28.0-alpine nginx -t
```

- [ ] **Step 4: Run the local release-readiness gate**

Run:

```bash
npm ci
npm run test:unit
npm run test:e2e
npm run test:deploy
npm run build:static
docker run --rm \
  -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.28.0-alpine nginx -t
git diff --check
```

Expected: every command exits 0. This proves local release readiness only; it is not live evidence.

- [ ] **Step 5: Commit deployment documentation**

```bash
git add deploy/README.md tests/README.md .github/workflows/verify.yml
git commit -m "docs: add atomic HTTP deployment runbook"
```

## Plan Exit Gate

Before starting engineering hardening:

```bash
npm test
npm run test:deploy
npm run build:static
git status --short
```

Expected:

- all local tests pass;
- the worktree is clean;
- `dist/release-manifest.json` names the current commit;
- a plain static server serves all four main routes without rewrites;
- Nginx configuration is repository-owned and HTTP-only;
- RISK-HTTP-01 remains explicitly accepted/deferred.
