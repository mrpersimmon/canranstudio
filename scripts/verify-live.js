'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROUTES = Object.freeze([
  { path: '/', file: 'index.html' },
  { path: '/lesson49/', file: 'lesson49/index.html' },
  { path: '/lesson50/', file: 'lesson50/index.html' },
  { path: '/soundmark/', file: 'soundmark/index.html' },
  { path: '/release-manifest.json', file: 'release-manifest.json' }
].map(route => Object.freeze(route)));

const REQUIRED_HEADERS = Object.freeze({
  'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
});

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function errorMessage(error) {
  return error && error.message ? error.message : String(error);
}

function parseHttpBaseUrl(baseUrl) {
  if (typeof baseUrl !== 'string' || !/^http:\/\/[^/?#\s]+\/?$/.test(baseUrl)) {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }
  if (
    parsed.protocol !== 'http:' || !parsed.hostname || parsed.username || parsed.password ||
    parsed.pathname !== '/' || parsed.search || parsed.hash
  ) {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }
  return parsed;
}

function verifyFinalUrl(responseUrl, approvedBaseUrl, expectedUrl, routePath, failures) {
  if (typeof responseUrl !== 'string' || !responseUrl) {
    failures.push(`${routePath}: invalid final response URL`);
    return;
  }

  let finalUrl;
  try {
    finalUrl = new URL(responseUrl);
  } catch {
    failures.push(`${routePath}: invalid final response URL`);
    return;
  }

  if (finalUrl.protocol !== 'http:') {
    failures.push(`${routePath}: final response URL must use http:`);
  }
  if (finalUrl.origin !== approvedBaseUrl.origin) {
    failures.push(`${routePath}: final response URL origin does not match approved base`);
  }
  if (finalUrl.username || finalUrl.password) {
    failures.push(`${routePath}: final response URL must not include credentials`);
  }
  if (finalUrl.pathname !== expectedUrl.pathname) {
    failures.push(`${routePath}: final response URL pathname does not match expected route`);
  }
  if (finalUrl.search || finalUrl.hash) {
    failures.push(`${routePath}: final response URL must not include query or fragment`);
  }
}

async function verifyBase({
  baseUrl,
  root = path.resolve(__dirname, '../dist'),
  fetchImpl = globalThis.fetch
}) {
  const parsedBaseUrl = parseHttpBaseUrl(baseUrl);
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('live HTTP verifier requires a fetch implementation');
  }

  const failures = [];
  const results = [];

  for (const route of ROUTES) {
    const expectedUrl = new URL(route.path, parsedBaseUrl);
    let localBytes;
    let localSha256;
    try {
      localBytes = await fs.readFile(path.join(root, route.file));
      localSha256 = sha256(localBytes);
    } catch (error) {
      failures.push(`${route.path}: failed to read local artifact ${route.file}: ${errorMessage(error)}`);
    }

    let response;
    try {
      response = await fetchImpl(expectedUrl.href, { redirect: 'follow' });
    } catch (error) {
      failures.push(`${route.path}: request failed: ${errorMessage(error)}`);
      continue;
    }

    if (!response || typeof response !== 'object') {
      failures.push(`${route.path}: invalid response object`);
      continue;
    }

    const status = response.status;
    if (!Number.isInteger(status)) {
      failures.push(`${route.path}: invalid response status`);
    } else if (status !== 200) {
      failures.push(`${route.path}: expected 200, received ${status}`);
    }

    verifyFinalUrl(response.url, parsedBaseUrl, expectedUrl, route.path, failures);

    if (!response.headers || typeof response.headers.get !== 'function' ||
      typeof response.headers.has !== 'function') {
      failures.push(`${route.path}: invalid response headers interface`);
    } else {
      try {
        for (const [header, expectedValue] of Object.entries(REQUIRED_HEADERS)) {
          const actualValue = response.headers.get(header);
          if (!actualValue) {
            failures.push(`${route.path}: missing header ${header}`);
          } else if (actualValue !== expectedValue) {
            failures.push(`${route.path}: unexpected header ${header}`);
          }
        }
        if (response.headers.has('strict-transport-security')) {
          failures.push(`${route.path}: unexpected strict-transport-security`);
        }
      } catch (error) {
        failures.push(`${route.path}: failed to inspect response headers: ${errorMessage(error)}`);
      }
    }

    let liveSha256;
    if (typeof response.arrayBuffer !== 'function') {
      failures.push(`${route.path}: invalid response body interface`);
    } else {
      try {
        liveSha256 = sha256(Buffer.from(await response.arrayBuffer()));
      } catch (error) {
        failures.push(`${route.path}: failed to read response body: ${errorMessage(error)}`);
      }
    }

    if (localSha256 && liveSha256 && localSha256 !== liveSha256) {
      failures.push(`${route.path}: hash mismatch (${localSha256} != ${liveSha256})`);
    }
    if (localSha256 && liveSha256) {
      results.push({
        path: route.path,
        status,
        localSha256,
        liveSha256
      });
    }
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
