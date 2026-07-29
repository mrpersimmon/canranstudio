'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { buildStatic } = require('../../scripts/build-static');

const ROOT = path.resolve(__dirname, '../..');
const PUBLIC_INPUTS = [
  'index.html',
  'home/index.html',
  'lesson49/index.html',
  'lesson49/audio',
  'lesson50/index.html',
  'lesson50/audio',
  'soundmark/index.html',
  'soundmark/audio',
  'core',
  'assets'
];

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

async function listRegularFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => comparePaths(left.name, right.name))) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listRegularFiles(absolute, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files;
}

async function expectedPublicFiles(root) {
  const files = [];
  for (const relative of PUBLIC_INPUTS) {
    const source = path.join(root, relative);
    try {
      const stat = await fs.lstat(source);
      if (stat.isDirectory()) {
        files.push(...await listRegularFiles(source, relative));
      } else if (stat.isFile()) {
        files.push(relative);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return files.sort(comparePaths);
}

async function writeSyntheticPublicRoot(root) {
  for (const relative of [
    'index.html',
    'home/index.html',
    'lesson49/index.html',
    'lesson49/audio/clip.mp3',
    'lesson50/index.html',
    'lesson50/audio/clip.mp3',
    'soundmark/index.html',
    'soundmark/audio/clip.mp3',
    'core/audio-player.js'
  ]) {
    const file = path.join(root, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, relative);
  }
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    'commit', '--allow-empty', '--quiet', '-m', 'test root'], { cwd: root });
}

test('buildStatic emits only the public route tree plus a hash manifest', async t => {
  const out = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-dist-'));
  t.after(() => fs.rm(out, { recursive: true, force: true }));

  await buildStatic({ root: ROOT, out });

  for (const file of [
    'index.html',
    'home/index.html',
    'lesson49/index.html',
    'lesson49/audio/beef.mp3',
    'lesson50/index.html',
    'soundmark/index.html',
    'core/audio-player.js',
    'release-manifest.json'
  ]) {
    assert.equal((await fs.stat(path.join(out, file))).isFile(), true, file);
  }

  await assert.rejects(fs.stat(path.join(out, 'README.md')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(out, 'docs')), { code: 'ENOENT' });

  const manifest = JSON.parse(await fs.readFile(
    path.join(out, 'release-manifest.json'),
    'utf8'
  ));
  assert.equal(manifest.schema, 1);
  assert.equal(
    manifest.commit,
    execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim()
  );
  assert.match(manifest.files['lesson49/index.html'], /^[a-f0-9]{64}$/);

  const expected = await expectedPublicFiles(ROOT);
  const actual = await listRegularFiles(out);
  assert.deepEqual(actual, [...expected, 'release-manifest.json'].sort(comparePaths));
  assert.deepEqual(Object.keys(manifest.files), expected);
  for (const relative of expected) {
    const source = await fs.readFile(path.join(ROOT, relative));
    const built = await fs.readFile(path.join(out, relative));
    assert.deepEqual(built, source, relative);
    assert.equal(manifest.files[relative], sha256(source), relative);
  }

  const secondOut = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-dist-repeat-'));
  t.after(() => fs.rm(secondOut, { recursive: true, force: true }));
  await buildStatic({ root: ROOT, out: secondOut });
  assert.deepEqual(
    await fs.readFile(path.join(secondOut, 'release-manifest.json')),
    await fs.readFile(path.join(out, 'release-manifest.json'))
  );
});

test('buildStatic refuses output paths that could erase its repository', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-build-sandbox-'));
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  const root = path.join(sandbox, 'repo');
  const marker = path.join(sandbox, 'keep-me.txt');
  await fs.mkdir(root);
  await fs.writeFile(marker, 'must survive');

  await assert.rejects(buildStatic({ root, out: sandbox }), /ancestor/);
  assert.equal(await fs.readFile(marker, 'utf8'), 'must survive');
  assert.equal((await fs.stat(root)).isDirectory(), true);
  await assert.rejects(buildStatic({ root, out: root }), /repository root/);
  await assert.rejects(buildStatic({ root, out: path.parse(root).root }), /filesystem root/);
});

test('buildStatic refuses an output alias that resolves to its repository', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-build-alias-'));
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  const root = path.join(sandbox, 'repo');
  const alias = path.join(sandbox, 'alias');
  const marker = path.join(root, 'keep-me.txt');
  await fs.mkdir(root);
  await fs.writeFile(marker, 'must survive');
  await fs.symlink(sandbox, alias);

  await assert.rejects(buildStatic({ root, out: path.join(alias, 'repo') }), /repository root/);
  assert.equal(await fs.readFile(marker, 'utf8'), 'must survive');
  assert.equal((await fs.stat(root)).isDirectory(), true);
});

test('buildStatic rejects symbolic links in allowlisted input directories', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-public-root-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  await fs.symlink(path.join(os.tmpdir(), 'outside.mp3'), path.join(root, 'core', 'outside-link'));

  await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  await assert.rejects(fs.stat(path.join(out, 'core', 'outside-link')), { code: 'ENOENT' });
});

test('buildStatic rechecks a source file before copying after preflight', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-copy-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const source = path.join(root, 'index.html');
  const secret = path.join(sandbox, 'private.txt');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.writeFile(secret, 'not public');

  const originalMkdir = fs.mkdir;
  let replaced = false;
  fs.mkdir = async (directory, options) => {
    const result = await originalMkdir(directory, options);
    if (!replaced && path.resolve(directory) === out) {
      replaced = true;
      await fs.rm(source);
      await fs.symlink(secret, source);
    }
    return result;
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  } finally {
    fs.mkdir = originalMkdir;
  }

  assert.equal(replaced, true);
  assert.equal(await fs.readFile(secret, 'utf8'), 'not public');
  await assert.rejects(fs.stat(path.join(out, 'index.html')), { code: 'ENOENT' });
});

test('buildStatic rejects a directory replaced by a link after preflight', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-directory-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const core = path.join(root, 'core');
  const external = path.join(sandbox, 'external-core');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(external);
  await fs.writeFile(path.join(external, 'leaked.js'), 'not public');

  const originalMkdir = fs.mkdir;
  const originalReaddir = fs.readdir;
  const originalOpendir = fs.opendir;
  let outputReady = false;
  let replaced = false;
  const replaceCore = async directory => {
    if (outputReady && !replaced && path.resolve(directory) === core) {
      replaced = true;
      await fs.rm(core, { recursive: true });
      await fs.symlink(external, core);
    }
  };
  fs.mkdir = async (directory, options) => {
    const result = await originalMkdir(directory, options);
    if (path.resolve(directory) === out) outputReady = true;
    return result;
  };
  fs.readdir = async (directory, options) => {
    await replaceCore(directory);
    return originalReaddir(directory, options);
  };
  fs.opendir = async (directory, options) => {
    await replaceCore(directory);
    return originalOpendir(directory, options);
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /symbolic link/);
  } finally {
    fs.mkdir = originalMkdir;
    fs.readdir = originalReaddir;
    fs.opendir = originalOpendir;
  }

  assert.equal(replaced, true);
  await assert.rejects(fs.stat(path.join(out, 'core', 'leaked.js')), { code: 'ENOENT' });
});

test('buildStatic rejects a child path that escapes after directory enumeration', async t => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-child-race-'));
  const root = path.join(sandbox, 'repo');
  const out = path.join(sandbox, 'out');
  const core = path.join(root, 'core');
  const external = path.join(sandbox, 'external-core');
  t.after(() => fs.rm(sandbox, { recursive: true, force: true }));
  await fs.mkdir(root);
  await writeSyntheticPublicRoot(root);
  await fs.mkdir(external);
  await fs.writeFile(path.join(external, 'audio-player.js'), 'not public');

  const originalOpendir = fs.opendir;
  let replaced = false;
  fs.opendir = async (directory, options) => {
    const opened = await originalOpendir(directory, options);
    if (path.resolve(directory) !== core) return opened;
    const originalRead = opened.read.bind(opened);
    opened.read = async () => {
      const entry = await originalRead();
      if (entry && !replaced) {
        replaced = true;
        await fs.rm(core, { recursive: true });
        await fs.symlink(external, core);
      }
      return entry;
    };
    return opened;
  };
  try {
    await assert.rejects(buildStatic({ root, out }), /outside repository/);
  } finally {
    fs.opendir = originalOpendir;
  }

  assert.equal(replaced, true);
  await assert.rejects(fs.stat(path.join(out, 'core', 'audio-player.js')), { code: 'ENOENT' });
});

test('buildStatic rejects non-regular files in allowlisted input directories', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-fifo-root-'));
  const out = path.join(root, 'dist');
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await writeSyntheticPublicRoot(root);
  execFileSync('mkfifo', [path.join(root, 'core', 'unsafe.fifo')]);

  await assert.rejects(buildStatic({ root, out }), /not a regular file/);
  await assert.rejects(fs.stat(path.join(out, 'core', 'unsafe.fifo')), { code: 'ENOENT' });
});
