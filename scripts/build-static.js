'use strict';

const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { constants } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');

const REQUIRED_FILES = [
  'index.html',
  'home/index.html',
  'lesson49/index.html',
  'lesson50/index.html',
  'soundmark/index.html'
];
const REQUIRED_DIRECTORIES = [
  'lesson49/audio',
  'lesson50/audio',
  'soundmark/audio',
  'core'
];
const OPTIONAL_DIRECTORIES = ['assets'];

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isSameOrAncestor(ancestor, child) {
  const relative = path.relative(ancestor, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function lstatIfExists(file) {
  try {
    return await fs.lstat(file);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

function assertSafeOutputPath(root, out) {
  if (out === root) {
    throw new Error('refusing to use the repository root as build output');
  }
  if (out === path.parse(out).root) {
    throw new Error('refusing to use a filesystem root as build output');
  }
  if (isSameOrAncestor(out, root)) {
    throw new Error('refusing to use a repository ancestor as build output');
  }
}

async function resolvePhysicalPath(target) {
  const suffix = [];
  let current = target;
  for (;;) {
    try {
      return path.resolve(await fs.realpath(current), ...suffix.reverse());
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
      const parent = path.dirname(current);
      if (parent === current) throw error;
      suffix.push(path.basename(current));
      current = parent;
    }
  }
}

async function assertSafeOutput(root, out) {
  assertSafeOutputPath(root, out);
  const physicalRoot = await fs.realpath(root);
  const physicalOut = await resolvePhysicalPath(out);
  assertSafeOutputPath(physicalRoot, physicalOut);
}

async function assertWithinRepository(root, source, relative) {
  // Node path APIs cannot atomically bind ancestor directories; builds require a stable source tree.
  const [physicalRoot, physicalSource] = await Promise.all([
    fs.realpath(root),
    fs.realpath(source)
  ]);
  if (!isSameOrAncestor(physicalRoot, physicalSource)) {
    throw new Error(`refusing public input outside repository: ${relative}`);
  }
}

function assertSafeEntry(stat, relative) {
  if (stat.isSymbolicLink()) {
    throw new Error(`refusing symbolic link in public input: ${relative}`);
  }
}

async function validateFile(root, relative) {
  const stat = await lstatIfExists(path.join(root, relative));
  if (!stat) throw new Error(`missing public input: ${relative}`);
  assertSafeEntry(stat, relative);
  if (!stat.isFile()) throw new Error(`public input is not a regular file: ${relative}`);
}

async function validateDirectory(root, relative, optional = false) {
  const directory = path.join(root, relative);
  const stat = await lstatIfExists(directory);
  if (!stat) {
    if (optional) return false;
    throw new Error(`missing public input: ${relative}`);
  }
  assertSafeEntry(stat, relative);
  if (!stat.isDirectory()) throw new Error(`public input is not a directory: ${relative}`);

  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      await validateDirectory(root, child);
    } else {
      await validateFile(root, child);
    }
  }
  return true;
}

async function copyFile(root, out, relative) {
  await validateFile(root, relative);
  const source = path.join(root, relative);
  await assertWithinRepository(root, source, relative);
  const destination = path.join(out, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  let input;
  try {
    input = await fs.open(source, constants.O_RDONLY | constants.O_NOFOLLOW);
    if (!(await input.stat()).isFile()) {
      throw new Error(`public input is not a regular file: ${relative}`);
    }
    await fs.writeFile(destination, await input.readFile());
  } catch (error) {
    if (error.code === 'ELOOP') {
      throw new Error(`refusing symbolic link in public input: ${relative}`);
    }
    throw error;
  } finally {
    await input?.close();
  }
}

async function copyDirectory(root, out, relative) {
  const source = path.join(root, relative);
  const initialStat = await lstatIfExists(source);
  if (!initialStat) throw new Error(`missing public input: ${relative}`);
  assertSafeEntry(initialStat, relative);
  if (!initialStat.isDirectory()) throw new Error(`public input is not a directory: ${relative}`);
  await assertWithinRepository(root, source, relative);
  let directory;
  try {
    directory = await fs.opendir(source);
    const stat = await lstatIfExists(source);
    if (!stat) throw new Error(`missing public input: ${relative}`);
    assertSafeEntry(stat, relative);
    if (!stat.isDirectory()) throw new Error(`public input is not a directory: ${relative}`);

    const entries = [];
    for (;;) {
      const entry = await directory.read();
      if (!entry) break;
      entries.push(entry);
    }
    const destination = path.join(out, relative);
    await fs.mkdir(destination, { recursive: true });
    for (const entry of entries.sort((left, right) => comparePaths(left.name, right.name))) {
      const child = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(root, out, child);
      } else {
        await copyFile(root, out, child);
      }
    }
  } finally {
    await directory?.close();
  }
}

async function listOutputFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => comparePaths(left.name, right.name))) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listOutputFiles(path.join(directory, entry.name), relative));
    } else if (entry.isFile()) {
      files.push(relative);
    } else {
      throw new Error(`unexpected non-regular output entry: ${relative}`);
    }
  }
  return files;
}

async function buildStatic({
  root = path.resolve(__dirname, '..'),
  out = path.resolve(root, 'dist')
} = {}) {
  const resolvedRoot = path.resolve(root);
  const resolvedOut = path.resolve(out);
  await assertSafeOutput(resolvedRoot, resolvedOut);

  for (const relative of REQUIRED_FILES) await validateFile(resolvedRoot, relative);
  for (const relative of REQUIRED_DIRECTORIES) await validateDirectory(resolvedRoot, relative);
  const optionalDirectories = [];
  for (const relative of OPTIONAL_DIRECTORIES) {
    if (await validateDirectory(resolvedRoot, relative, true)) optionalDirectories.push(relative);
  }

  await fs.rm(resolvedOut, { recursive: true, force: true });
  await fs.mkdir(resolvedOut, { recursive: true });
  for (const relative of REQUIRED_FILES) await copyFile(resolvedRoot, resolvedOut, relative);
  for (const relative of [...REQUIRED_DIRECTORIES, ...optionalDirectories]) {
    await copyDirectory(resolvedRoot, resolvedOut, relative);
  }

  const files = {};
  for (const relative of await listOutputFiles(resolvedOut)) {
    const bytes = await fs.readFile(path.join(resolvedOut, relative));
    files[relative] = crypto.createHash('sha256').update(bytes).digest('hex');
  }
  const manifest = {
    schema: 1,
    commit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: resolvedRoot,
      encoding: 'utf8'
    }).trim(),
    files
  };
  await fs.writeFile(
    path.join(resolvedOut, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return manifest;
}

if (require.main === module) {
  buildStatic()
    .then(manifest => process.stdout.write(`built dist for ${manifest.commit}\n`))
    .catch(error => {
      process.stderr.write(`${error.stack || error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = { buildStatic };
