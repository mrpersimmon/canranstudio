'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const catalog = require('../core/course-catalog');

function resolvePublicPath(root, relative) {
  const target = path.resolve(root, relative);
  const within = path.relative(root, target);
  if (within === '..' || within.startsWith(`..${path.sep}`) || path.isAbsolute(within)) {
    throw new Error(`course catalog path escapes repository: ${relative}`);
  }
  return target;
}

async function requireRegularFile(root, relative, label) {
  let stat;
  try {
    stat = await fs.lstat(resolvePublicPath(root, relative));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label}: missing file ${relative}`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`${label}: expected regular file ${relative}`);
  }
}

async function requireDirectory(root, relative, label) {
  let stat;
  try {
    stat = await fs.lstat(resolvePublicPath(root, relative));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label}: missing directory ${relative}`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw new Error(`${label}: expected directory ${relative}`);
  }
}

async function containsNonEmptyMp3(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
      if ((await fs.lstat(child)).size > 0) return true;
    }
    if (entry.isDirectory() && await containsNonEmptyMp3(child)) return true;
  }
  return false;
}

function containsStringLiteral(source, value) {
  return source.includes(`'${value}'`) || source.includes(`"${value}"`);
}

async function assertCoursePageProgressContract(root, course) {
  const source = await fs.readFile(resolvePublicPath(root, course.entry), 'utf8');
  if (!containsStringLiteral(source, course.progress.key)) {
    throw new Error(`${course.id}: course page does not declare progress key ${course.progress.key}`);
  }
  if (course.progress.legacyKey && !containsStringLiteral(source, course.progress.legacyKey)) {
    throw new Error(`${course.id}: course page does not declare legacy progress key ${course.progress.legacyKey}`);
  }
  if (course.progress.legacyMode && !containsStringLiteral(source, course.progress.legacyMode)) {
    throw new Error(`${course.id}: course page does not declare legacy mode ${course.progress.legacyMode}`);
  }
  for (const progressId of course.progress.ids) {
    if (!containsStringLiteral(source, progressId)) {
      throw new Error(`${course.id}: course page does not declare progress stage ${progressId}`);
    }
  }
}

function publishedMapFiles(course) {
  if (course.map.declaredStatus !== 'published') return [];
  return [
    course.map.baseAsset,
    ...course.map.stages.map(stage => stage.growthAsset),
    course.map.souvenir.asset,
    course.map.mobilePreview,
    course.map.regressionTest
  ];
}

async function assertCourseCatalogContract({
  root = path.resolve(__dirname, '..'),
  courses = catalog.COURSES
} = {}) {
  const resolvedRoot = path.resolve(root);
  catalog.assertValidCatalog(courses);

  for (const course of courses.filter(item => item.courseStatus === 'published')) {
    await requireRegularFile(resolvedRoot, course.entry, course.id);
    await assertCoursePageProgressContract(resolvedRoot, course);
    const expectedAudio = `${course.id}/audio`;
    if (!course.assetDirectories.includes(expectedAudio)) {
      throw new Error(`${course.id}: prerecorded audio directory must be ${expectedAudio}`);
    }
    await requireDirectory(resolvedRoot, expectedAudio, course.id);
    if (!await containsNonEmptyMp3(resolvePublicPath(resolvedRoot, expectedAudio))) {
      throw new Error(`${course.id}: prerecorded audio directory contains no non-empty .mp3 file`);
    }
    for (const relative of publishedMapFiles(course)) {
      await requireRegularFile(resolvedRoot, relative, course.id);
    }
  }

  return courses;
}

module.exports = { assertCourseCatalogContract };
