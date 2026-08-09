'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES, PRESENTATION_COURSES } = require('./course-registry');
const {
  HTTP_HEADER_CONTRACT,
  LANDMARK_REVIEW_HEADER_CONTRACT
} = require('./http-header-contract');

const ROUTES = Object.freeze([
  Object.freeze({ path: '/', file: 'index.html' }),
  ...PUBLISHED_COURSES.map(course =>
    Object.freeze({ path: course.route, file: course.entry })
  ),
  ...PRESENTATION_COURSES.map(course =>
    Object.freeze({ path: course.presentation.route, file: course.presentation.entry })
  ),
  Object.freeze({
    path: '/poc/landmark-review/',
    file: 'poc/landmark-review/index.html'
  }),
  Object.freeze({
    path: '/poc/keepsake-review/',
    file: 'poc/keepsake-review/index.html'
  }),
  Object.freeze({ path: '/release-manifest.json', file: 'release-manifest.json' })
]);

const HOME_REDIRECTS = Object.freeze(['/home', '/home/', '/home/index.html']);
const LIVE_BYTE_EXCEPTIONS = Object.freeze(['home/index.html']);
const ENTRY_ROUTE_BY_FILE = Object.freeze(Object.fromEntries([
  ['index.html', '/'],
  ...PUBLISHED_COURSES.map(course => [course.entry, course.route]),
  ...PRESENTATION_COURSES.map(course => [course.presentation.entry, course.presentation.route]),
  ['poc/landmark-review/index.html', '/poc/landmark-review/'],
  ['poc/keepsake-review/index.html', '/poc/keepsake-review/']
]));
const NOINDEX_FILES = Object.freeze(new Set([
  'poc/landmark-review/index.html',
  'poc/keepsake-review/index.html'
]));
const LANDMARK_REVIEW_PREFIX = 'poc/landmark-review/';

const DEFAULT_LIVE_PROFILE = Object.freeze({
  concurrency: 2,
  timeoutMs: 60_000,
  maxBytes: 8 * 1024 * 1024
});

function manifestPathFor(file) {
  if (Object.hasOwn(ENTRY_ROUTE_BY_FILE, file)) return ENTRY_ROUTE_BY_FILE[file];
  return `/${file.split('/').map(encodeURIComponent).join('/')}`;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function errorMessage(error) {
  return error && error.message ? error.message : String(error);
}

function parseHttpBaseUrl(baseUrl) {
  const authorityMatch = typeof baseUrl === 'string'
    ? /^http:\/\/([^/?#\s]+)\/?$/.exec(baseUrl)
    : null;
  if (!authorityMatch || authorityMatch[1].includes('@')) {
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

function verifyFinalUrl(responseUrl, approvedBaseUrl, expectedUrl, label, failures) {
  if (typeof responseUrl !== 'string' || !responseUrl) {
    failures.push(`${label}: invalid final response URL`);
    return;
  }

  let finalUrl;
  try {
    finalUrl = new URL(responseUrl);
  } catch {
    failures.push(`${label}: invalid final response URL`);
    return;
  }

  if (finalUrl.protocol !== 'http:') {
    failures.push(`${label}: final response URL must use http:`);
  }
  if (finalUrl.origin !== approvedBaseUrl.origin) {
    failures.push(`${label}: final response URL origin does not match approved base`);
  }
  if (finalUrl.username || finalUrl.password) {
    failures.push(`${label}: final response URL must not include credentials`);
  }
  if (finalUrl.pathname !== expectedUrl.pathname) {
    failures.push(`${label}: final response URL pathname does not match expected route`);
  }
  if (finalUrl.search || finalUrl.hash) {
    failures.push(`${label}: final response URL must not include query or fragment`);
  }
}

function validatePositiveInteger(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new TypeError(`${label} must be an integer from 1 through ${maximum}`);
  }
}

function isManifestPath(file) {
  return typeof file === 'string' &&
    file.length > 0 &&
    file !== '.' &&
    !file.endsWith('/') &&
    file === path.posix.normalize(file) &&
    !file.startsWith('../') &&
    !path.posix.isAbsolute(file) &&
    !file.split('/').includes('..') &&
    !file.includes('\\') &&
    !/[\0-\x1f\x7f]/.test(file);
}

function parseManifest(bytes) {
  let manifest;
  try {
    manifest = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error('release-manifest.json: invalid JSON');
  }
  if (
    !manifest ||
    Object.keys(manifest).sort().join(',') !== 'commit,files,schema' ||
    manifest.schema !== 1 ||
    !/^[a-f0-9]{40}$/.test(manifest.commit) ||
    !manifest.files ||
    Array.isArray(manifest.files) ||
    Object.keys(manifest.files).length === 0
  ) {
    throw new Error('release-manifest.json: malformed schema');
  }
  for (const [file, digest] of Object.entries(manifest.files)) {
    if (!isManifestPath(file) || !/^[a-f0-9]{64}$/.test(digest)) {
      throw new Error(`release-manifest.json: malformed entry ${file}`);
    }
  }
  if (Object.hasOwn(manifest.files, 'release-manifest.json')) {
    throw new Error('release-manifest.json: must not contain itself');
  }
  for (const route of ROUTES.filter(route => route.file !== 'release-manifest.json')) {
    if (!Object.hasOwn(manifest.files, route.file)) {
      throw new Error(`release-manifest.json: missing ${route.file}`);
    }
  }
  if (!Object.hasOwn(manifest.files, 'home/index.html')) {
    throw new Error('release-manifest.json: missing home/index.html');
  }
  return manifest;
}

function verifyHeaders(
  response,
  label,
  failures,
  { noindex = false, headerContract = HTTP_HEADER_CONTRACT } = {}
) {
  if (
    !response.headers ||
    typeof response.headers.get !== 'function' ||
    typeof response.headers.has !== 'function'
  ) {
    failures.push(`${label}: invalid response headers interface`);
    return false;
  }
  try {
    for (const [header, expected] of Object.entries(headerContract)) {
      const actual = response.headers.get(header);
      if (!actual) failures.push(`${label}: missing header ${header}`);
      else if (actual !== expected) failures.push(`${label}: unexpected header ${header}`);
    }
    if (response.headers.has('strict-transport-security')) {
      failures.push(`${label}: unexpected strict-transport-security`);
    }
    if (
      noindex &&
      response.headers.get('x-robots-tag') !== 'noindex, nofollow, noarchive'
    ) {
      failures.push(`${label}: unexpected x-robots-tag`);
    }
    return true;
  } catch (error) {
    failures.push(`${label}: failed to inspect response headers: ${errorMessage(error)}`);
    return false;
  }
}

function labelledError(label, error) {
  const message = errorMessage(error);
  return message.startsWith(`${label}:`) ? message : `${label}: ${message}`;
}

async function cancelResponseBody(response, label, reader) {
  const cancellable = reader || response?.body;
  if (!cancellable || typeof cancellable.cancel !== 'function') return;
  try {
    await cancellable.cancel();
  } catch (error) {
    throw new Error(`${label}: response body cancellation failed: ${errorMessage(error)}`);
  }
}

async function readBoundedBody(response, maximum, label) {
  let reader;
  try {
    const lengthText = response.headers?.get?.('content-length');
    if (lengthText !== null && lengthText !== undefined && lengthText !== '') {
      const length = Number(lengthText);
      if (!Number.isSafeInteger(length) || length < 0) {
        throw new Error(`${label}: invalid content-length`);
      }
      if (length > maximum) throw new Error(`${label}: response exceeds ${maximum} bytes`);
    }

    if (!response.body || typeof response.body.getReader !== 'function') {
      if (typeof response.arrayBuffer !== 'function') {
        throw new Error(`${label}: invalid response body interface`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > maximum) throw new Error(`${label}: response exceeds ${maximum} bytes`);
      return bytes;
    }

    reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximum) {
        throw new Error(`${label}: response exceeds ${maximum} bytes`);
      }
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks, total);
  } catch (error) {
    await cancelResponseBody(response, label, reader);
    throw error;
  }
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }));
  return results;
}

async function verifyBase({
  baseUrl,
  root = path.resolve(__dirname, '../dist'),
  fetchImpl = globalThis.fetch,
  concurrency = DEFAULT_LIVE_PROFILE.concurrency,
  timeoutMs = DEFAULT_LIVE_PROFILE.timeoutMs,
  maxBytes = DEFAULT_LIVE_PROFILE.maxBytes
}) {
  const parsedBaseUrl = parseHttpBaseUrl(baseUrl);
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('live HTTP verifier requires a fetch implementation');
  }
  validatePositiveInteger(concurrency, 'concurrency', 64);
  validatePositiveInteger(timeoutMs, 'timeoutMs');
  validatePositiveInteger(maxBytes, 'maxBytes');

  const failures = [];
  const results = [];
  let localManifestBytes;
  try {
    localManifestBytes = await fs.readFile(path.join(root, 'release-manifest.json'));
    if (localManifestBytes.length > maxBytes) {
      throw new Error(`response exceeds ${maxBytes} bytes`);
    }
  } catch (error) {
    throw new Error(`live HTTP verification failed:\n${
      labelledError('release-manifest.json', error)
    }`);
  }

  async function request(urlPath, redirect) {
    const expectedUrl = new URL(urlPath, parsedBaseUrl);
    return {
      expectedUrl,
      response: await fetchImpl(expectedUrl.href, {
        redirect,
        signal: AbortSignal.timeout(timeoutMs)
      })
    };
  }

  let manifestResponse;
  let manifestExpectedUrl;
  try {
    const requested = await request('/release-manifest.json', 'follow');
    manifestResponse = requested.response;
    manifestExpectedUrl = requested.expectedUrl;
  } catch (error) {
    throw new Error(
      `live HTTP verification failed:\nrelease-manifest.json: request failed: ${errorMessage(error)}`
    );
  }
  if (!manifestResponse || typeof manifestResponse !== 'object') {
    throw new Error('live HTTP verification failed:\nrelease-manifest.json: invalid response object');
  }
  if (manifestResponse.status !== 200) {
    failures.push(
      `release-manifest.json: expected 200, received ${manifestResponse.status}`
    );
  }
  verifyFinalUrl(
    manifestResponse.url,
    parsedBaseUrl,
    manifestExpectedUrl,
    'release-manifest.json',
    failures
  );
  verifyHeaders(manifestResponse, 'release-manifest.json', failures);
  let onlineManifestBytes;
  try {
    onlineManifestBytes = await readBoundedBody(
      manifestResponse,
      maxBytes,
      'release-manifest.json'
    );
  } catch (error) {
    failures.push(labelledError('release-manifest.json', error));
  }
  if (
    onlineManifestBytes &&
    !localManifestBytes.equals(onlineManifestBytes)
  ) {
    failures.push('release-manifest.json: bytes differ');
  }
  if (failures.length) {
    throw new Error(`live HTTP verification failed:\n${failures.join('\n')}`);
  }

  let manifest;
  try {
    manifest = parseManifest(localManifestBytes);
  } catch (error) {
    throw new Error(`live HTTP verification failed:\n${errorMessage(error)}`);
  }
  results.push({
    kind: 'manifest',
    path: '/release-manifest.json',
    file: 'release-manifest.json',
    status: 200,
    liveSha256: sha256(onlineManifestBytes)
  });

  async function inspectLiveFile(file) {
    const localFailures = [];
    const urlPath = manifestPathFor(file);
    let response;
    let expectedUrl;
    try {
      const requested = await request(urlPath, 'follow');
      response = requested.response;
      expectedUrl = requested.expectedUrl;
    } catch (error) {
      return {
        failures: [`${file}: request failed: ${errorMessage(error)}`],
        result: null
      };
    }
    if (!response || typeof response !== 'object') {
      return { failures: [`${file}: invalid response object`], result: null };
    }
    if (!Number.isInteger(response.status)) {
      localFailures.push(`${file}: invalid response status`);
    } else if (response.status !== 200) {
      localFailures.push(`${file}: expected 200, received ${response.status}`);
    }
    verifyFinalUrl(response.url, parsedBaseUrl, expectedUrl, file, localFailures);
    verifyHeaders(response, file, localFailures, {
      noindex: NOINDEX_FILES.has(file),
      headerContract: file.startsWith(LANDMARK_REVIEW_PREFIX)
        ? LANDMARK_REVIEW_HEADER_CONTRACT
        : HTTP_HEADER_CONTRACT
    });
    let bytes;
    try {
      bytes = await readBoundedBody(response, maxBytes, file);
    } catch (error) {
      localFailures.push(labelledError(file, error));
    }
    const liveSha256 = bytes ? sha256(bytes) : null;
    if (liveSha256 && liveSha256 !== manifest.files[file]) {
      localFailures.push(
        `${file}: hash mismatch (${manifest.files[file]} != ${liveSha256})`
      );
    }
    return {
      failures: localFailures,
      result: liveSha256 ? {
        kind: 'asset',
        path: urlPath,
        file,
        status: response.status,
        localSha256: manifest.files[file],
        liveSha256
      } : null
    };
  }

  const assetFiles = Object.keys(manifest.files)
    .filter(file => !LIVE_BYTE_EXCEPTIONS.includes(file));
  const assetOutcomes = await mapLimit(assetFiles, concurrency, inspectLiveFile);
  for (const outcome of assetOutcomes) {
    failures.push(...outcome.failures);
    if (outcome.result) results.push(outcome.result);
  }

  const rootDigest = manifest.files['index.html'];
  for (const alias of HOME_REDIRECTS) {
    let manual;
    let manualExpected;
    try {
      const requested = await request(alias, 'manual');
      manual = requested.response;
      manualExpected = requested.expectedUrl;
    } catch (error) {
      failures.push(`${alias}: manual request failed: ${errorMessage(error)}`);
      continue;
    }
    if (!manual || typeof manual !== 'object') {
      failures.push(`${alias}: invalid manual response object`);
      continue;
    }
    if (manual.status !== 308) {
      failures.push(`${alias}: expected 308, received ${manual.status}`);
    }
    verifyFinalUrl(manual.url, parsedBaseUrl, manualExpected, alias, failures);
    const manualHeadersValid = verifyHeaders(manual, alias, failures);
    if (manualHeadersValid && manual.headers.get('location') !== '/') {
      failures.push(`${alias}: expected Location: /`);
    }
    try {
      await cancelResponseBody(manual, alias);
    } catch (error) {
      failures.push(labelledError(alias, error));
      continue;
    }

    let followed;
    try {
      followed = (await request(alias, 'follow')).response;
    } catch (error) {
      failures.push(`${alias}: followed request failed: ${errorMessage(error)}`);
      continue;
    }
    if (!followed || typeof followed !== 'object') {
      failures.push(`${alias}: invalid followed response object`);
      continue;
    }
    if (followed.status !== 200) {
      failures.push(`${alias}: followed response expected 200, received ${followed.status}`);
    }
    verifyFinalUrl(
      followed.url,
      parsedBaseUrl,
      new URL('/', parsedBaseUrl),
      alias,
      failures
    );
    verifyHeaders(followed, alias, failures);
    let bytes;
    try {
      bytes = await readBoundedBody(followed, maxBytes, alias);
    } catch (error) {
      failures.push(labelledError(alias, error));
    }
    const liveSha256 = bytes ? sha256(bytes) : null;
    if (liveSha256 && liveSha256 !== rootDigest) {
      failures.push(`${alias}: root hash mismatch (${rootDigest} != ${liveSha256})`);
    }
    if (liveSha256) {
      results.push({
        kind: 'redirect',
        path: alias,
        file: 'index.html',
        status: followed.status,
        localSha256: rootDigest,
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

module.exports = {
  ROUTES,
  HTTP_HEADER_CONTRACT,
  LANDMARK_REVIEW_HEADER_CONTRACT,
  DEFAULT_LIVE_PROFILE,
  verifyBase
};
