'use strict';

// Publish the reviewed course as the site's single root-page experience.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { validateManifest } = require('../core/course-package-installer');
const ROOT = path.resolve(__dirname, '..');
const ENTRY = 'poc/learning-path/index.html';
const PACKAGE = 'poc/learning-path/course-package-manifest.json';
const CONFIG = 'deploy/nginx/canranstudio-learning-path.conf';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function sourcePath(url) {
  if (!url.startsWith('/') || url.includes('..') || /[?#\\]/.test(url)) throw Error('Unsafe resource URL: ' + url);
  for (const [prefix, directory] of [
    ['/poc/lesson-1-2/course/', 'poc/lesson1-2-experience/'],
    ['/poc/lesson-1-2/core/', 'core/'],
    ['/poc/lesson-1-2/assets/', 'assets/']
  ]) if (url.startsWith(prefix)) return directory + url.slice(prefix.length);
  return url.slice(1);
}

function prepare(root = ROOT) {
  const sources = new Map();
  function read(relative) {
    const filename = path.join(root, relative);
    if (!fs.lstatSync(filename).isFile() || fs.realpathSync(filename) !== filename) throw Error('Not a regular source: ' + relative);
    const bytes = fs.readFileSync(filename);
    sources.set(relative, bytes);
    return bytes;
  }
  const originalBytes = read(PACKAGE);
  const original = validateManifest(JSON.parse(originalBytes), { scopeUrl: 'https://www.canranstudio.cn/poc/learning-path/' });
  let html = read(ENTRY).toString('utf8');
  if (!html.includes('data-manifest-sha256="' + digest(originalBytes) + '"')) throw Error('Preview HTML and package differ');
  const files = new Map();
  for (const entry of original.entries) {
    if (/\.html?$/i.test(entry.url) || entry.url.includes('/slow-')) throw Error('Unexpected course dependency: ' + entry.url);
    const bytes = read(sourcePath(entry.url));
    if (bytes.length !== entry.bytes || digest(bytes) !== entry.sha256) throw Error('Package resource differs: ' + entry.url);
    files.set(entry.url.slice(1), bytes);
  }
  const manifest = { ...original, packageId: original.packageId + '-home', scopePath: '/' };
  validateManifest(manifest, { scopeUrl: 'https://www.canranstudio.cn/' });
  const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  html = html.replace('data-manifest-sha256="' + digest(originalBytes) + '"', 'data-manifest-sha256="' + digest(bytes) + '"')
    .replace('href="/poc/lesson-1-2/" data-package-return', 'href="/" data-package-return');
  files.set(PACKAGE, bytes);
  files.set('index.html', Buffer.from(html));
  read('scripts/build-learning-path-release.js');
  read('scripts/build-learning-course-package.js');
  read('core/learning-course-catalog.js');
  const authored = JSON.parse(read('content/learning-course.json'));
  const packaged = files.get('poc/learning-path/course-package/unit-catalog.json');
  if (!packaged || !packaged.equals(Buffer.from(JSON.stringify(authored, null, 2) + '\n'))) {
    throw Error('Authored course and package differ; run npm run build:course');
  }
  read('content/textbook-sources.json');
  read(CONFIG);
  return { files, sources, manifest, originalManifestSha256: digest(originalBytes), packageManifestSha256: digest(bytes) };
}

function assertCommitted(sources, root = ROOT) {
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  for (const [relative, bytes] of sources) {
    let committed;
    try { committed = execFileSync('git', ['show', commit + ':' + relative], { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch { throw Error('Release input is not committed: ' + relative); }
    if (!committed.equals(bytes)) throw Error('Release input differs from HEAD: ' + relative);
  }
  return commit;
}

function build() {
  const prepared = prepare();
  const commit = assertCommitted(prepared.sources);
  const visual = require('./visual-proof').assertVisualProof(prepared);
  const out = path.join(ROOT, 'dist/learning-path');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out)) {
    if (!fs.lstatSync(out).isDirectory() || fs.realpathSync(out) !== out) throw Error('Unsafe release output');
    fs.rmSync(out, { recursive: true });
  }
  fs.mkdirSync(out);
  const hashes = {};
  for (const [relative, bytes] of [...prepared.files].sort(([a], [b]) => a.localeCompare(b))) {
    fs.mkdirSync(path.dirname(path.join(out, relative)), { recursive: true });
    fs.writeFileSync(path.join(out, relative), bytes);
    hashes[relative] = digest(bytes);
  }
  const release = {
    schema: 2, commit, revision: prepared.manifest.revision,
    sourceManifestSha256: prepared.originalManifestSha256,
    packageManifestSha256: prepared.packageManifestSha256,
    visualEvidence: { fingerprint: visual.fingerprint, checkedStates: visual.checks.length, finishedAt: visual.finishedAt },
    files: hashes
  };
  fs.writeFileSync(path.join(out, 'release-manifest.json'), JSON.stringify(release, null, 2) + '\n');
  return { out, commit, files: prepared.files.size, bytes: [...prepared.files.values()].reduce((n, b) => n + b.length, 0), packageManifestSha256: prepared.packageManifestSha256 };
}

if (require.main === module) {
  try { process.stdout.write(JSON.stringify(build(), null, 2) + '\n'); }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
module.exports = { prepare, assertCommitted, build, sourcePath, digest };
