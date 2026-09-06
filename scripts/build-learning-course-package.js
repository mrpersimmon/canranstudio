'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const catalog = require('../core/learning-course-catalog');
const { sourcePath } = require('./build-learning-path-release');
const ROOT = path.resolve(__dirname, '..');
const PAGE = 'poc/learning-path';
const MANIFEST_URL = '/poc/learning-path/course-package-manifest.json';
const CATALOG_URL = '/poc/learning-path/course-package/unit-catalog.json';
const EXTENSION = /\.(avif|css|jpe?g|json|js|mp3|png|svg|webp|woff2)$/i;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const localPath = url => path.join(ROOT, sourcePath(url));

function resourceURL(value, base = '/') {
  if (typeof value !== 'string' || /^(data:|blob:|#)/.test(value)) return null;
  let url;
  try { url = new URL(value, 'https://course.invalid' + base); } catch { return null; }
  if (url.origin !== 'https://course.invalid' || !EXTENSION.test(url.pathname)) return null;
  return url.pathname;
}

function build() {
  const unit = catalog.getCourse();
  const errors = catalog.validateCourse(unit);
  if (errors.length) throw Error(errors.join('\n'));
  // Keep the reviewed raster, font and audio bytes intact. New media is authored
  // separately; building the course only collects and verifies its dependencies.
  const bootstrap = fs.readFileSync(path.join(ROOT, 'core/course-package-entry.js'));
  const bootName = 'course-entry-' + sha256(bootstrap).slice(0, 12) + '.js';
  const bootDirectory = path.join(ROOT, PAGE, 'boot');
  fs.mkdirSync(bootDirectory, { recursive: true });
  fs.writeFileSync(path.join(bootDirectory, bootName), bootstrap);
  for (const name of fs.readdirSync(bootDirectory)) {
    if (/^course-entry-[a-f0-9]+\.js$/.test(name) && name !== bootName) fs.unlinkSync(path.join(bootDirectory, name));
  }
  const bootURL = '/' + PAGE + '/boot/' + bootName;
  const htmlPath = path.join(ROOT, PAGE, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8').replace(/\/poc\/learning-path\/boot\/course-entry-[a-f0-9]+\.js/g, bootURL);
  if (!html.includes('src="' + bootURL + '"')) throw Error('Missing course bootstrap script');
  fs.mkdirSync(path.dirname(localPath(CATALOG_URL)), { recursive: true });
  fs.writeFileSync(localPath(CATALOG_URL), JSON.stringify(unit, null, 2) + '\n');

  const resources = new Set([CATALOG_URL, bootURL, '/core/course-package-installer.js', '/core/course-package-service-worker.js']);
  function add(value, base) {
    const url = resourceURL(value, base);
    if (url && url !== MANIFEST_URL) resources.add(url);
  }
  function scanObject(value) {
    if (typeof value === 'string') add(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(scanObject);
  }
  function scanText(text, base) {
    const absolute = /\/(?:assets|core|poc)\/[A-Za-z0-9._~!$&'()*+,;=:@%/\-]+\.(?:avif|css|jpe?g|json|js|mp3|png|svg|webp|woff2)/gi;
    for (const match of text.matchAll(absolute)) add(match[0], base);
    if (base.endsWith('.css')) {
      for (const match of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/gi)) add(match[1], base);
    }
  }
  scanObject(unit);
  scanText(html, '/' + PAGE + '/index.html');
  // Iterating a Set also visits newly discovered dependencies.
  for (const url of resources) {
    const bytes = fs.readFileSync(localPath(url));
    if (/\.json$/.test(url)) scanObject(JSON.parse(bytes));
    else if (/\.(css|js)$/.test(url)) scanText(bytes.toString('utf8'), url);
  }
  const kinds = { avif: 'image', jpg: 'image', jpeg: 'image', png: 'image', svg: 'image', webp: 'image', mp3: 'audio', woff2: 'font', css: 'style', js: 'script', json: 'data' };
  const entries = [...resources].sort().map(url => {
    const bytes = fs.readFileSync(localPath(url));
    return { url, kind: kinds[path.extname(url).slice(1).toLowerCase()], bytes: bytes.length, sha256: sha256(bytes) };
  });
  const manifest = {
    schema: 1, packageId: unit.unitId + '@' + unit.experienceRevision + '-course-package-v1',
    unitId: unit.unitId, revision: unit.experienceRevision, scopePath: '/poc/learning-path/',
    totalBytes: entries.reduce((n, entry) => n + entry.bytes, 0), entries
  };
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  const hash = sha256(manifestBytes);
  html = html.replace(/data-manifest-sha256="[a-f0-9]{64}"/, 'data-manifest-sha256="' + hash + '"');
  if (!html.includes('data-manifest-sha256="' + hash + '"')) throw Error('Missing package digest');
  fs.writeFileSync(localPath(MANIFEST_URL), manifestBytes);
  fs.writeFileSync(htmlPath, html);
  return { unitId: unit.unitId, resources: entries.length, bytes: manifest.totalBytes, manifestSha256: hash };
}

if (require.main === module) {
  try { process.stdout.write(JSON.stringify(build(), null, 2) + '\n'); }
  catch (error) { process.stderr.write(error.stack + '\n'); process.exitCode = 1; }
}
module.exports = { build, sha256 };
