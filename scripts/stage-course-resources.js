'use strict';
// Run against an already verified release, before switching /lesson/current.
// This command only adds immutable files. It never deletes a previous release.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function stageCourseResources({ from, store }) {
  const source = await fs.realpath(from), destination = path.resolve(store);
  if (destination === path.parse(destination).root || destination === source || source.startsWith(destination + path.sep) || destination.startsWith(source + path.sep)) throw new Error('Use a separate immutable resource directory');
  const manifest = JSON.parse(await fs.readFile(path.join(source, 'release-manifest.json'), 'utf8'));
  if (!/^[a-f0-9]{40}$/.test(manifest.commit) || manifest.schema !== 1) throw new Error('Expected a verified release manifest');
  const entries = Object.entries(manifest.files).filter(([relative]) => /^(?:resources|course-packages)\//.test(relative));
  if (!entries.length) throw new Error('Release has no immutable course resources');
  for (const [relative, expected] of entries) {
    if (!/^(?:resources\/[a-f0-9]{64}\/[a-zA-Z0-9._-]+|course-packages\/(?:home|unit\d+-\d+|lesson\d+|soundmark)\/[a-f0-9]{64}\.json)$/.test(relative)) throw new Error('Invalid immutable path');
    const file = path.join(source, relative);
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Expected regular resource');
    const bytes = await fs.readFile(file);
    if (sha(bytes) !== expected || relative.startsWith('resources/') && relative.split('/')[1] !== expected) throw new Error('Resource hash mismatch: ' + relative);
    const output = path.join(destination, relative);
    await fs.mkdir(path.dirname(output), { recursive: true });
    // Validate the entire path even if an older deployment created it.
    if (!(await fs.realpath(path.dirname(output))).startsWith((await fs.realpath(destination)) + path.sep)) throw new Error('Immutable path escapes store');
    try { await fs.writeFile(output, bytes, { flag: 'wx', mode: 0o644 }); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const existing = await fs.lstat(output);
      if (!existing.isFile() || existing.isSymbolicLink() || sha(await fs.readFile(output)) !== expected) throw new Error('Refusing to overwrite immutable resource: ' + relative);
    }
  }
  return { files: entries.length, commit: manifest.commit };
}
if (require.main === module) {
  const [from, store] = process.argv.slice(2);
  if (!from || !store) { console.error('Usage: node scripts/stage-course-resources.js <verified-release-directory> <immutable-directory>'); process.exitCode = 1; }
  else stageCourseResources({ from, store }).then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { stageCourseResources };
