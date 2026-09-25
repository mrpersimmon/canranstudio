'use strict';
// Repackage the observed former homepage without disabling its integrity checks.
const fs = require('node:fs/promises'), path = require('node:path'), crypto = require('node:crypto');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function migrate(source, output) {
  if (!source || !output || path.resolve(source) === path.resolve(output)) throw Error('Use distinct source and new output directories');
  const files = new Map();
  async function walk(directory, prefix = '') {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name;
      if (entry.isDirectory()) await walk(path.join(directory, entry.name), name + '/');
      else if (entry.isFile()) files.set(name, await fs.readFile(path.join(directory, entry.name)));
      else throw Error('Unsupported source entry: ' + name);
    }
  }
  await walk(source);
  const originalManifest = JSON.parse(files.get('release-manifest.json'));
  const declared = originalManifest.files;
  if (!declared || Object.keys(declared).length !== files.size - 1) throw Error('Source file inventory differs from release manifest');
  for (const [name, value] of Object.entries(declared)) if (digest(files.get(name)) !== (typeof value === 'string' ? value : value.sha256)) throw Error('Source integrity mismatch: ' + name);
  for (const [name, bytes] of files) {
    if (!/\.(?:html|js|css|json|svg)$/.test(name) || name === 'release-manifest.json') continue;
    const relocated = bytes.toString()
      .replace(/(["'`(])\/(?=(?:poc|core|assets)\/)/g, '$1/exercise/')
      .replace(/(\b(?:href|src)=["'])\/(?=["'])/g, '$1/exercise/')
      .replace(/("scopePath"\s*:\s*")\//g, '$1/exercise/')
      .replace(/(\blocation\.(?:assign|replace)\(\s*["'])\/(?=["'])/g, '$1/exercise/');
    files.set(name, Buffer.from(relocated));
  }
  const mediaName = 'poc/learning-path/course-package/media-index.json';
  const packageName = 'poc/learning-path/course-package-manifest.json';
  function rebuild(name) {
    const manifest = JSON.parse(files.get(name));
    for (const entry of manifest.entries) {
      if (!entry.url.startsWith('/exercise/')) throw Error('Escaping package URL: ' + entry.url);
      const filename = entry.url.slice('/exercise/'.length).split(/[?#]/)[0];
      if (filename.includes('..') || !files.has(filename) || filename === name) throw Error('Invalid package dependency: ' + filename);
      const bytes = files.get(filename); entry.bytes = bytes.length; entry.sha256 = digest(bytes);
    }
    manifest.totalBytes = manifest.entries.reduce((sum, entry) => sum + entry.bytes, 0);
    files.set(name, Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
  }
  rebuild(mediaName); rebuild(packageName);
  const packageHash = digest(files.get(packageName));
  files.set('index.html', Buffer.from(files.get('index.html').toString().replace(/data-manifest-sha256="[a-f0-9]{64}"/, 'data-manifest-sha256="' + packageHash + '"')));
  for (const name of [mediaName, packageName]) {
    const manifest = JSON.parse(files.get(name));
    for (const entry of manifest.entries) {
      const bytes = files.get(entry.url.slice('/exercise/'.length).split(/[?#]/)[0]);
      if (entry.sha256 !== digest(bytes) || entry.bytes !== bytes.length) throw Error('Package integrity mismatch: ' + entry.url);
    }
  }
  files.delete('release-manifest.json');
  const manifest = { schema: 1, sourceCommit: originalManifest.commit, sourceManifestSha256: digest(await fs.readFile(path.join(source, 'release-manifest.json'))), basePath: '/exercise/', packageManifestSha256: packageHash, files: Object.fromEntries([...files].map(([name, bytes]) => [name, digest(bytes)])) };
  files.set('release-manifest.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
  await fs.mkdir(output);
  for (const [name, bytes] of files) { await fs.mkdir(path.dirname(path.join(output, name)), { recursive: true }); await fs.writeFile(path.join(output, name), bytes); }
  console.log(JSON.stringify({ basePath: '/exercise/', files: files.size, packageManifestSha256: packageHash, sourceCommit: originalManifest.commit }));
}
if (require.main === module) migrate(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { migrate };
