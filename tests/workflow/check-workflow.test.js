'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { runTask, changedFiles, checkDocuments, planChecks } = require('../../scripts/check-workflow');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-check-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'src'));
  fs.mkdirSync(path.join(root, 'test-results'));
  fs.writeFileSync(path.join(root, 'src/app.js'), 'original');
  fs.writeFileSync(path.join(root, 'package-lock.json'), '{}');
  fs.writeFileSync(path.join(root, '.gitignore'), 'test-results/\n.cache/\n');
  execFileSync('git', ['init', '-q', root]);
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '-qm', 'fixture'], { cwd: root });
  return root;
}
const context = { node: 'test', browser: 'test-browser-1' };
const task = {
  args: ['-e', "require('node:fs').appendFileSync('test-results/count', 'x')"],
  inputs: ['src', 'package-lock.json', 'tests'],
};
const run = (root, overrides = {}) => runTask({ root, id: 'sample', task, context, log: () => {}, ...overrides });
const count = root => fs.readFileSync(path.join(root, 'test-results/count'), 'utf8').length;

test('unchanged successful inputs reuse evidence without executing the command again', async t => {
  const root = fixture(t);
  assert.equal((await run(root)).cached, false);
  const reused = await run(root);
  assert.equal(reused.cached, true);
  assert.equal(count(root), 1);
  assert.equal(typeof reused.durationMs, 'number');
  fs.writeFileSync(path.join(root, 'notes.md'), 'Unrelated prose');
  assert.equal((await run(root)).cached, true);
});

test('source, added file, deletion, lockfile, test code, command and environment invalidate evidence', async t => {
  const root = fixture(t);
  await run(root);
  for (const mutate of [
    () => fs.writeFileSync(path.join(root, 'src/app.js'), 'changed'),
    () => fs.writeFileSync(path.join(root, 'src/new.js'), 'new'),
    () => fs.unlinkSync(path.join(root, 'src/new.js')),
    () => fs.writeFileSync(path.join(root, 'package-lock.json'), '{"changed":true}'),
    () => { fs.mkdirSync(path.join(root, 'tests')); fs.writeFileSync(path.join(root, 'tests/new.test.js'), 'new assertion'); },
  ]) {
    mutate();
    assert.equal((await run(root)).cached, false);
    assert.equal((await run(root)).cached, true);
  }
  assert.equal((await run(root, { context: { ...context, browser: 'test-browser-2' } })).cached, false);
  assert.equal((await run(root, { task: { ...task, args: [...task.args, 'extra argument'] } })).cached, false);
});

test('force reruns; failed commands remove previous evidence and cannot become cache hits', async t => {
  const root = fixture(t);
  await run(root);
  await run(root, { force: true });
  assert.equal(count(root), 2);
  await assert.rejects(run(root, { force: true, task: { ...task, args: ['-e', 'process.exit(3)'] } }), /failed/);
  assert.equal((await run(root)).cached, false);
});

test('a source change during a successful command invalidates the run', async t => {
  const root = fixture(t);
  await assert.rejects(run(root, { task: { ...task, args: ['-e',
    "require('node:fs').writeFileSync('src/app.js', 'changed during test')"] } }), /changed during/);
  assert.equal((await run(root)).cached, false);
});

test('missing required artifacts force a rerun and missing new outputs fail', async t => {
  const root = fixture(t);
  const withOutput = { ...task, outputs: ['test-results/count'] };
  await run(root, { task: withOutput });
  fs.unlinkSync(path.join(root, 'test-results/count'));
  assert.equal((await run(root, { task: withOutput })).cached, false);
  await assert.rejects(run(root, { task: { ...task, outputs: ['test-results/missing.json'] } }), /output/);
});

test('malformed evidence is ignored; concurrent runs do not share a partial receipt', async t => {
  const root = fixture(t);
  await run(root);
  const dir = path.join(root, '.cache/check-workflow');
  fs.writeFileSync(path.join(dir, 'sample.json'), '{invalid');
  assert.equal((await run(root)).cached, false);
  fs.mkdirSync(path.join(dir, 'sample.lock'));
  await assert.rejects(run(root, { force: true }), /already running/);
});

test('change discovery includes staged, unstaged, deleted and untracked paths', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'staged.md'), 'staged');
  execFileSync('git', ['add', 'staged.md'], { cwd: root });
  fs.writeFileSync(path.join(root, 'package-lock.json'), 'changed');
  fs.unlinkSync(path.join(root, 'src/app.js'));
  fs.writeFileSync(path.join(root, 'new file.md'), 'new');
  assert.deepEqual(changedFiles(root, 'HEAD'), ['new file.md', 'package-lock.json', 'src/app.js', 'staged.md']);
  assert.throws(() => changedFiles(root, 'missing-ref'), /./);
});

test('document checks resolve relative links, ignore web and code examples, and reject broken links', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'README.md'), '[source](src/app.js) [web](https://example.com)\n```md\n[example](missing)\n```');
  checkDocuments(root, ['README.md']);
  fs.appendFileSync(path.join(root, 'README.md'), '\n[broken](missing.md)');
  assert.throws(() => checkDocuments(root, ['README.md']), /missing.md/);
});

test('a documentation-only plan avoids runtime tests; source changes retain relevant checks', () => {
  const config = require('../../scripts/check-workflow.config');
  assert.deepEqual(planChecks(config, ['docs/note.md']), []);
  assert.ok(planChecks(config, ['core/audio-player.js']).includes('unit'));
  assert.ok(planChecks(config, ['core/audio-player.js']).some(id => id.startsWith('browser')));
  assert.ok(planChecks(config, ['scripts/check-workflow.js']).includes('workflow'));
  assert.ok(planChecks(config, ['some-new-runtime.js']).includes('unit'));
});

test('expired evidence reruns, while clearing browser reports does not erase unrelated successful checks', async t => {
  const root = fixture(t);
  await run(root);
  const receipt = path.join(root, '.cache/check-workflow/sample.json');
  const saved = JSON.parse(fs.readFileSync(receipt, 'utf8'));
  saved.finishedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
  fs.writeFileSync(receipt, JSON.stringify(saved));
  assert.equal((await run(root)).cached, false);
  assert.equal(count(root), 2);
  fs.rmSync(path.join(root, 'test-results'), { recursive: true });
  assert.equal((await run(root)).cached, true);
});
