'use strict';

const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { constants } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES, PRESENTATION_COURSES } = require('./course-registry');
const { assertCourseCatalogContract } = require('./course-catalog-contract');
const { assertPublicV1Boundary } = require('./public-v1-boundary');

const REQUIRED_FILES = Object.freeze([
  'index.html',
  'home/index.html',
  ...PUBLISHED_COURSES.map(course => course.entry),
  ...PRESENTATION_COURSES.map(course => course.presentation.entry)
]);
const REQUIRED_DIRECTORIES = Object.freeze([
  ...PUBLISHED_COURSES.flatMap(course => course.assetDirectories),
  'core'
]);
const REQUIRED_RUNTIME_FILES = Object.freeze([
  'core/growth-reveal.js',
  'core/growth-reveal.css'
]);
const OPTIONAL_DIRECTORIES = Object.freeze(['assets']);
const PUBLIC_INPUTS = Object.freeze([
  ...REQUIRED_FILES,
  ...REQUIRED_DIRECTORIES,
  ...OPTIONAL_DIRECTORIES
]);

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

async function assertRegisteredLessonEntries(root) {
  const registered = new Set(PUBLISHED_COURSES.map(course => course.entry));
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('lesson')) continue;
    const relative = `${entry.name}/index.html`;
    const stat = await lstatIfExists(path.join(root, relative));
    if (stat && !registered.has(relative)) {
      throw new Error(`unregistered lesson entry: ${relative}`);
    }
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

async function assertOutputDoesNotOverlapPublicInputs(root, out) {
  const physicalOut = await resolvePhysicalPath(out);
  for (const relative of PUBLIC_INPUTS) {
    const source = path.join(root, relative);
    const physicalSource = await resolvePhysicalPath(source);
    if (
      isSameOrAncestor(out, source) || isSameOrAncestor(source, out) ||
      isSameOrAncestor(physicalOut, physicalSource) || isSameOrAncestor(physicalSource, physicalOut)
    ) {
      throw new Error(`build output overlaps public input: ${relative}`);
    }
  }
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

async function listOutputTree(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const tree = { files: [], directories: [] };
  for (const entry of entries.sort((left, right) => comparePaths(left.name, right.name))) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      tree.directories.push(relative);
      const child = await listOutputTree(path.join(directory, entry.name), relative);
      tree.files.push(...child.files);
      tree.directories.push(...child.directories);
    } else if (entry.isFile()) {
      tree.files.push(relative);
    } else {
      throw new Error(`unexpected non-regular output entry: ${relative}`);
    }
  }
  return tree;
}

async function listOutputFiles(directory, prefix = '') {
  return (await listOutputTree(directory, prefix)).files;
}

function hash(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function isManifestPath(relative) {
  return relative && relative === path.posix.normalize(relative) && !relative.startsWith('../') && !path.posix.isAbsolute(relative);
}

function isAllowedArtifactFile(relative) {
  return REQUIRED_FILES.includes(relative) || [...REQUIRED_DIRECTORIES, ...OPTIONAL_DIRECTORIES]
    .some(directory => relative.startsWith(`${directory}/`));
}

function hasRequiredArtifactEntries(files) {
  return REQUIRED_FILES.every(file => files.includes(file)) && REQUIRED_DIRECTORIES
    .every(directory => files.some(file => file.startsWith(`${directory}/`)));
}

function artifactAncestors(files) {
  const directories = new Set();
  for (const file of files) {
    for (let current = path.posix.dirname(file); current !== '.'; current = path.posix.dirname(current)) {
      directories.add(current);
    }
  }
  return [...directories].sort(comparePaths);
}

function ownsArtifactManifest(manifest, files) {
  return manifest && manifest.schema === 1 && /^[a-f0-9]{40}$/.test(manifest.commit) &&
    manifest.files && !Array.isArray(manifest.files) && files.length > 0 &&
    files.every(relative => isManifestPath(relative) && isAllowedArtifactFile(relative) && /^[a-f0-9]{64}$/.test(manifest.files[relative])) &&
    hasRequiredArtifactEntries(files);
}

async function assertOwnedOutput(out) {
  const stat = await lstatIfExists(out);
  if (!stat) return;
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error('refusing to replace an unowned build output');
  }
  const entries = await fs.readdir(out);
  if (entries.length === 0) return;

  const manifestFile = path.join(out, 'release-manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8'));
  } catch {
    throw new Error('refusing to replace an unowned build output');
  }
  const files = Object.keys(manifest.files);
  if (!ownsArtifactManifest(manifest, files)) {
    throw new Error('refusing to replace an unowned build output');
  }
  let actual;
  try {
    actual = await listOutputTree(out);
  } catch {
    throw new Error('refusing to replace an unowned build output');
  }
  const expected = [...files, 'release-manifest.json'].sort(comparePaths);
  const actualFiles = [...actual.files].sort(comparePaths);
  const actualDirectories = [...actual.directories].sort(comparePaths);
  const expectedDirectories = artifactAncestors(files);
  if (
    actualFiles.length !== expected.length || actualFiles.some((file, index) => file !== expected[index]) ||
    actualDirectories.length !== expectedDirectories.length ||
    actualDirectories.some((directory, index) => directory !== expectedDirectories[index])
  ) {
    throw new Error('refusing to replace an unowned build output');
  }
  for (const relative of files) {
    const bytes = await fs.readFile(path.join(out, relative));
    if (hash(bytes) !== manifest.files[relative]) {
      throw new Error('refusing to replace an unowned build output');
    }
  }
}

function gitOutput(root, args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    throw new Error('static build requires a Git repository with HEAD');
  }
}

function gitBytes(root, args) {
  try {
    return execFileSync('git', args, { cwd: root });
  } catch {
    throw new Error('static build requires a Git repository with HEAD');
  }
}

async function publicWorkingFiles(root) {
  const files = [...REQUIRED_FILES];
  for (const relative of [...REQUIRED_DIRECTORIES, ...OPTIONAL_DIRECTORIES]) {
    if (await lstatIfExists(path.join(root, relative))) {
      files.push(...await listOutputFiles(path.join(root, relative), relative));
    }
  }
  return files.sort(comparePaths);
}

function headPublicBlobs(root, commit) {
  const records = gitBytes(root, ['ls-tree', '-r', '-z', commit, '--', ...PUBLIC_INPUTS])
    .toString('utf8').split('\0').filter(Boolean);
  const blobs = new Map();
  for (const record of records) {
    const match = record.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/);
    if (!match) throw new Error('static build requires a Git repository with HEAD');
    blobs.set(match[2], match[1]);
  }
  return blobs;
}

function gitBlobOid(bytes, objectFormat) {
  return crypto.createHash(objectFormat)
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
}

async function assertPublicSnapshot(root) {
  const [gitRoot, physicalRoot] = await Promise.all([
    fs.realpath(gitOutput(root, ['rev-parse', '--show-toplevel'])),
    fs.realpath(root)
  ]);
  if (gitRoot !== physicalRoot) throw new Error('static build root must be the Git repository root');
  const commit = gitOutput(root, ['rev-parse', '--verify', 'HEAD']);
  const [workingFiles, blobs] = await Promise.all([publicWorkingFiles(root), headPublicBlobs(root, commit)]);
  const objectFormat = gitOutput(root, ['rev-parse', '--show-object-format']);
  const headFiles = [...blobs.keys()].sort(comparePaths);
  if (workingFiles.length !== headFiles.length || workingFiles.some((file, index) => file !== headFiles[index])) {
    throw new Error('public inputs differ from HEAD; refusing to create a HEAD manifest');
  }
  for (const relative of workingFiles) {
    const bytes = await fs.readFile(path.join(root, relative));
    if (gitBlobOid(bytes, objectFormat) !== blobs.get(relative)) {
      throw new Error('public inputs differ from HEAD; refusing to create a HEAD manifest');
    }
  }
  return commit;
}

async function removeEmptyDirectories(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) await removeEmptyDirectories(path.join(directory, entry.name));
  }
  if ((await fs.readdir(directory)).length === 0) await fs.rmdir(directory);
}

async function buildStatic({
  root = path.resolve(__dirname, '..'),
  out = path.resolve(root, 'dist')
} = {}) {
  const resolvedRoot = path.resolve(root);
  const resolvedOut = path.resolve(out);
  await assertSafeOutput(resolvedRoot, resolvedOut);
  await assertOutputDoesNotOverlapPublicInputs(resolvedRoot, resolvedOut);
  await assertRegisteredLessonEntries(resolvedRoot);
  await assertCourseCatalogContract({ root: resolvedRoot });

  for (const relative of REQUIRED_FILES) await validateFile(resolvedRoot, relative);
  for (const relative of REQUIRED_RUNTIME_FILES) await validateFile(resolvedRoot, relative);
  for (const relative of REQUIRED_DIRECTORIES) await validateDirectory(resolvedRoot, relative);
  const optionalDirectories = [];
  for (const relative of OPTIONAL_DIRECTORIES) {
    if (await validateDirectory(resolvedRoot, relative, true)) optionalDirectories.push(relative);
  }

  const commit = await assertPublicSnapshot(resolvedRoot);
  await assertPublicV1Boundary({ root: resolvedRoot });
  await assertOwnedOutput(resolvedOut);
  await fs.rm(resolvedOut, { recursive: true, force: true });
  await fs.mkdir(resolvedOut, { recursive: true });
  for (const relative of REQUIRED_FILES) await copyFile(resolvedRoot, resolvedOut, relative);
  for (const relative of [...REQUIRED_DIRECTORIES, ...optionalDirectories]) {
    await copyDirectory(resolvedRoot, resolvedOut, relative);
  }

  for (const entry of await fs.readdir(resolvedOut, { withFileTypes: true })) {
    if (entry.isDirectory()) await removeEmptyDirectories(path.join(resolvedOut, entry.name));
  }

  const files = {};
  for (const relative of await listOutputFiles(resolvedOut)) {
    const bytes = await fs.readFile(path.join(resolvedOut, relative));
    files[relative] = hash(bytes);
  }
  if (!hasRequiredArtifactEntries(Object.keys(files))) {
    throw new Error('public inputs are missing required artifact files');
  }
  if (await assertPublicSnapshot(resolvedRoot) !== commit) {
    throw new Error('public inputs changed during static build');
  }
  const manifest = {
    schema: 1,
    commit,
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
