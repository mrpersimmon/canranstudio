'use strict';
// Read the current checkout only. The inventory is not a pronunciation approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const catalog = require('../../core/course-catalog');
const root = path.resolve(__dirname, '../..');
const dirs = fs.readdirSync(root).filter(x => /^(?:lesson\d+|unit\d+-\d+|soundmark)$/.test(x) && fs.statSync(path.join(root, x)).isDirectory()).sort();
const bindings = new Map();
const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
function bind(file, text, owner, basis, ipa) {
  if (!file || !/\.(mp3|wav|ogg|m4a)$/.test(file) || !text) return;
  file = file.replace(/^\//, '');
  const entries = bindings.get(file) || [];
  const existing = entries.find(x => x.text === text && x.owner === owner);
  if (existing && ipa) existing.ipa = ipa;
  if (!existing) entries.push({ text, owner, basis, ...(ipa ? { ipa } : {}) });
  bindings.set(file, entries);
}
function learningBindings(learning, owner, basis) {
  if (!learning) return;
  for (const [text, file] of Object.entries(learning.AUDIO || {})) bind(file, text, owner, basis);
  for (const word of learning.WORDS || []) bind(word.audio || learning.AUDIO?.[word.en], word.en, owner, basis, word.ph);
  for (const line of learning.DIALOGUE || []) bind(line.audio, line.text, owner, basis);
}
for (const course of catalog.PUBLISHED_COURSES) learningBindings(course.learning, course.id, 'course-catalog');
const manifests = new Map();
const manifestIssues = [];
for (const dir of dirs) {
  const content = path.join(root, dir, 'content.js');
  if (fs.existsSync(content)) {
    const context = { CanranCore: { courseCatalog: catalog } };
    vm.runInNewContext(fs.readFileSync(content, 'utf8'), context, { filename: content, timeout: 5000 });
    for (const value of Object.values(context.CanranCore)) if (value?.learning) learningBindings(value.learning, dir, 'unit-content');
  }
  const manifestFile = path.join(root, dir, 'audio/manifest.json');
  if (fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    for (const item of manifest.files || []) {
      manifests.set(item.path, { ...item, manifest: path.relative(root, manifestFile), packStatus: manifest.status, engine: manifest.engine });
      bind(item.path, item.text, dir, 'audio-manifest');
    }
  }
  // Older pages generate paths from English labels. Exact source literals are
  // stronger evidence than reconstructing English from a filename.
  const entry = path.join(root, dir, 'index.html');
  if (fs.existsSync(entry) && (dir.startsWith('lesson') || dir === 'soundmark')) {
    const source = fs.readFileSync(entry, 'utf8');
    for (const match of source.matchAll(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g)) {
      let text;
      try { text = vm.runInNewContext(match[0], {}, { timeout: 20 }); } catch { continue; }
      if (typeof text !== 'string' || !/^[A-Za-z]/.test(text) || /[<>\n\u3400-\u9fff]/.test(text)) continue;
      const file = `${dir}/audio/${slug(text)}.mp3`;
      if (fs.existsSync(path.join(root, file))) bind(file, text, dir, 'page-literal');
    }
  }
}
// Optional DOM observations come from real, isolated browser visits. They can
// establish labels assembled at runtime in older pages, without guessing text.
const domOption = process.argv.indexOf('--dom-bindings');
if (domOption !== -1) {
  const observed = JSON.parse(fs.readFileSync(process.argv[domOption + 1], 'utf8'));
  for (const page of observed) for (const item of page.matches) bind(item.path, item.text, page.dir, 'rendered-page');
}
const files = [];
for (const dir of dirs) {
  const folder = path.join(root, dir, 'audio');
  if (!fs.existsSync(folder)) continue;
  for (const name of fs.readdirSync(folder).sort()) {
    if (!/\.(mp3|wav|ogg|m4a)$/.test(name)) continue;
    const file = `${dir}/audio/${name}`, bytes = fs.readFileSync(path.join(root, file));
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const manifest = manifests.get(file), uses = bindings.get(file) || [];
    if (manifest && manifest.sha256 !== sha256) manifestIssues.push({ file, issue: 'checksum-mismatch' });
    const expected = manifest?.text || uses[0]?.text || path.parse(name).name.replaceAll('_', ' ');
    files.push({ path: file, directory: dir, bytes: bytes.length, sha256, expected,
      expectedBasis: manifest ? 'audio-manifest' : uses[0]?.basis || 'filename-inferred', uses,
      ...(manifest ? { manifest } : {}) });
  }
}
const missing = [...bindings].filter(([file]) => !fs.existsSync(path.join(root, file))).map(([file, uses]) => ({ file, uses }));
process.stdout.write(JSON.stringify({ scope: dirs, files, missing, manifestIssues }, null, 2) + '\n');
