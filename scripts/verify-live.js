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

function errorMessage(error) {
  return error && error.message ? error.message : String(error);
}

function parseHttpBaseUrl(baseUrl) {
  if (typeof baseUrl !== 'string' || !/^http:\/\/[^/?#\s]+(?:[/?#]|$)/.test(baseUrl)) {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }
  if (parsed.protocol !== 'http:' || !parsed.hostname) {
    throw new Error(`HTTP-only verifier rejected base URL: ${baseUrl}`);
  }
  return parsed;
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
      response = await fetchImpl(new URL(route.path, parsedBaseUrl).href, { redirect: 'follow' });
    } catch (error) {
      failures.push(`${route.path}: request failed: ${errorMessage(error)}`);
      continue;
    }

    if (response.status !== 200) {
      failures.push(`${route.path}: expected 200, received ${response.status}`);
    }

    try {
      for (const header of REQUIRED_HEADERS) {
        if (!response.headers.get(header)) {
          failures.push(`${route.path}: missing header ${header}`);
        }
      }
      if (response.headers.has('strict-transport-security')) {
        failures.push(`${route.path}: unexpected strict-transport-security`);
      }
    } catch (error) {
      failures.push(`${route.path}: failed to inspect response headers: ${errorMessage(error)}`);
    }

    let liveSha256;
    try {
      liveSha256 = sha256(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      failures.push(`${route.path}: failed to read response body: ${errorMessage(error)}`);
    }

    if (localSha256 && liveSha256 && localSha256 !== liveSha256) {
      failures.push(`${route.path}: hash mismatch (${localSha256} != ${liveSha256})`);
    }
    if (localSha256 && liveSha256) {
      results.push({
        path: route.path,
        status: response.status,
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
