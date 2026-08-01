'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const catalog = require('../../core/course-catalog');
const { assertCourseCatalogContract } = require('../../scripts/course-catalog-contract');

function validCoursePageSource(course) {
  return `<script>const catalogContract = ${JSON.stringify([
    course.progress.key,
    course.progress.legacyKey,
    course.progress.legacyMode,
    ...course.progress.ids
  ].filter(Boolean))};</script>`;
}

test('static course contract requires real same-origin prerecorded audio', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-course-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await fs.writeFile(path.join(root, 'lesson49/audio/readme.txt'), 'not a recording');

  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: prerecorded audio directory contains no non-empty \.mp3 file/
  );

  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), '');
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: prerecorded audio directory contains no non-empty \.mp3 file/
  );

  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), 'recording');
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published course page must agree with catalog progress and migration metadata', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-progress-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));
  const entry = path.join(root, course.entry);

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), 'recording');
  await fs.writeFile(entry, '<script>const key = "wrong";</script>');
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page does not declare progress key canran:l49:progress:v2/
  );

  await fs.writeFile(entry, `
    <script>
      const key = 'canran:l49:progress:v2';
      const legacy = 'l49-stars-v1';
      const mode = 'ratings';
      const stages = ['l1', 'l2', 'l3', 'l4'];
    </script>
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page does not declare progress stage l5/
  );

  await fs.writeFile(entry, `
    <script>
      const key = 'canran:l49:progress:v2';
      const legacy = 'l49-stars-v1';
      const mode = 'ratings';
      const stages = ['l1', 'l2', 'l3', 'l4', 'l5'];
    </script>
  `);
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published learning location contract requires every declared asset and regression file', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-map-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), 'recording');

  course.map.declaredStatus = 'published';
  course.map.baseAsset = 'assets/adventure-map/lesson49/base.png';
  course.map.stages = course.map.stages.map((stage, index) => ({
    ...stage,
    growthAsset: `assets/adventure-map/lesson49/growth-${index + 1}.png`
  }));
  course.map.souvenir.asset = 'assets/adventure-map/lesson49/food-basket.png';
  course.map.mobilePreview = 'assets/adventure-map/lesson49/mobile-preview.png';
  course.map.regressionTest = 'tests/e2e/lesson49-map.spec.js';

  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: missing file assets\/adventure-map\/lesson49\/base\.png/
  );

  const contractFiles = [
    course.map.baseAsset,
    ...course.map.stages.map(stage => stage.growthAsset),
    course.map.souvenir.asset,
    course.map.mobilePreview,
    course.map.regressionTest
  ];
  for (const relative of contractFiles) {
    const file = path.join(root, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, relative);
  }

  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});
