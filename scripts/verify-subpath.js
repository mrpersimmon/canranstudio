'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { normalizeBasePath } = require('./public-base-path');
const { LESSON_HEADER_CONTRACT } = require('./http-header-contract');

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function verifySubpath({ baseUrl, root = path.resolve(__dirname, '../dist'), concurrency = 3 }) {
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw Error('Expected a public HTTPS URL');
  normalizeBasePath(base.pathname);
  if (base.pathname === '/') throw Error('Use verify-live.js for a root deployment');
  const localBytes = await fs.readFile(path.join(root, 'release-manifest.json'));
  const manifest = JSON.parse(localBytes);
  if (manifest.schema !== 1 || !/^[a-f0-9]{40}$/.test(manifest.commit) || !manifest.files || Array.isArray(manifest.files)) throw Error('Invalid manifest');
  const files = Object.keys(manifest.files);
  for (const file of files) {
    if (!file || file.startsWith('/') || file.split('/').some(part => !part || part === '.' || part === '..') || file.includes('\\') || !/^[a-f0-9]{64}$/.test(manifest.files[file])) throw Error('Unsafe manifest entry');
  }
  for (const file of ['index.html', 'unit49-50/index.html', 'unit49-50/certificate.js', 'core/subpath-worker.js']) if (!files.includes(file)) throw Error('Incomplete unit deployment');
  async function request(relative, options = {}) {
    const url = new URL(relative, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw Error('Request escapes deployment');
    let last;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { return await fetch(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(60000) }); }
      catch (error) { last = error; }
    }
    throw last;
  }
  function checkHeaders(response, file) {
    if (response.headers.get('x-content-type-options') !== 'nosniff' || response.headers.get('x-frame-options') !== 'DENY' || !response.headers.get('strict-transport-security')?.includes('max-age=31536000') || !response.headers.get('content-security-policy')?.includes("object-src 'none'")) throw Error('Missing security headers: ' + file);
    if (manifest.files['course-index.json']) {
      if (response.headers.get('content-security-policy') !== LESSON_HEADER_CONTRACT['content-security-policy']) throw Error('Course cache CSP differs: ' + file);
      const immutable = /^(?:resources|course-packages)\//.test(file);
      if (response.headers.get('cache-control') !== (immutable ? 'public, max-age=31536000, immutable' : 'no-cache')) throw Error('Course cache header differs: ' + file);
      if (file === 'core/subpath-worker.js' && response.headers.get('service-worker-allowed') !== base.pathname) throw Error('Wrong course worker scope');
    }
  }
  const remote = await request('release-manifest.json');
  if (remote.status !== 200 || !Buffer.from(await remote.arrayBuffer()).equals(localBytes)) throw Error('Published manifest differs from this artifact');
  checkHeaders(remote, 'release-manifest.json');
  const pending = files.filter(file => file !== 'home/index.html');
  let cursor = 0, checked = 0, bytes = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < pending.length) {
      const file = pending[cursor++];
      const response = await request(file.split('/').map(encodeURIComponent).join('/'));
      if (response.status !== 200) throw Error(file + ': HTTP ' + response.status);
      checkHeaders(response, file);
      const body = Buffer.from(await response.arrayBuffer());
      if (digest(body) !== manifest.files[file]) throw Error('Hash mismatch: ' + file);
      checked++; bytes += body.length;
    }
  }));
  const navigation = await request('');
  if (navigation.status !== 200 || digest(Buffer.from(await navigation.arrayBuffer())) !== manifest.files['index.html']) throw Error('Navigation entry differs');
  for (const legacy of ['home', 'home/', 'home/index.html']) {
    const response = await request(legacy);
    const location = response.headers.get('location');
    if (response.status !== 308 || !location || new URL(location, base).href !== base.href) throw Error('Wrong legacy redirect: ' + legacy);
    await response.body?.cancel();
  }
  for (const hidden of ['.git/config', 'docs/README.md', 'package.json', 'missing-course/']) {
    const response = await request(hidden);
    if (response.status !== 404) throw Error('Unexpected public path: ' + hidden);
    await response.body?.cancel();
  }
  const audioFile = 'lesson49/audio/butcher.mp3';
  const ranged = await request(audioFile, { headers: { Range: 'bytes=0-31' } });
  const chunk = Buffer.from(await ranged.arrayBuffer());
  const original = await fs.readFile(path.join(root, audioFile));
  if (ranged.status !== 206 || !chunk.equals(original.subarray(0, 32))) throw Error('Audio range response failed');
  return { baseUrl: base.href, commit: manifest.commit, checkedFiles: checked, bytes, redirects: 3, hiddenPaths: 4, audioRange: 206 };
}
if (require.main === module) {
  verifySubpath({ baseUrl: process.argv[2] }).then(result => console.log(JSON.stringify(result, null, 2))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { verifySubpath };
