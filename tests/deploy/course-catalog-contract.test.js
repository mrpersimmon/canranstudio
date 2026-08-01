'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const catalog = require('../../core/course-catalog');
const { assertCourseCatalogContract } = require('../../scripts/course-catalog-contract');
const ROOT = path.resolve(__dirname, '../..');
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

function validCoursePageSource(course) {
  return `
    <script src="/core/course-catalog.js"></script>
    <script>
      const COURSE_PROGRESS = CanranCore.courseCatalog.requirePublishedCourse('${course.id}').progress;
      const loaded = CanranCore.storage.loadProgress({
        storage: localStorage,
        key: COURSE_PROGRESS.key,
        legacyKey: COURSE_PROGRESS.legacyKey,
        ids: COURSE_PROGRESS.ids,
        legacyMode: COURSE_PROGRESS.legacyMode
      });
      const saved = CanranCore.storage.saveProgress({
        storage: localStorage,
        key: COURSE_PROGRESS.key,
        progress: loaded.progress,
        ids: COURSE_PROGRESS.ids
      });
      const recording = 'audio/clip.mp3';
    </script>
  `;
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
    /lesson49: prerecorded audio directory contains no \.mp3 file/
  );

  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), '');
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid MP3 file lesson49\/audio\/clip\.mp3/
  );

  await fs.writeFile(path.join(root, 'lesson49/audio/clip.mp3'), 'recording');
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid MP3 file lesson49\/audio\/clip\.mp3/
  );

  await fs.writeFile(
    path.join(root, 'lesson49/audio/clip.mp3'),
    Buffer.from([0xff, 0xf3, 0x64, 0xc4, 0, 0, 0, 3, 0x48, 0, 0, 0])
  );
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid MP3 file lesson49\/audio\/clip\.mp3/
  );

  await fs.copyFile(
    path.join(ROOT, 'lesson49/audio/beef.mp3'),
    path.join(root, 'lesson49/audio/clip.mp3')
  );
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published course page must consume progress metadata from the shared catalog', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-progress-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));
  const entry = path.join(root, course.entry);

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.copyFile(
    path.join(ROOT, 'lesson49/audio/beef.mp3'),
    path.join(root, 'lesson49/audio/clip.mp3')
  );
  await fs.writeFile(entry, `<script>const forged = ${JSON.stringify([
    course.progress.key,
    course.progress.legacyKey,
    course.progress.legacyMode,
    ...course.progress.ids,
    'audio/clip.mp3'
  ])};</script>`);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page must load \/core\/course-catalog\.js/
  );

  await fs.writeFile(entry, `
    <script src="/core/course-catalog.js"></script>
    <script>
      const forged = ${JSON.stringify([
        course.progress.key,
        course.progress.legacyKey,
        course.progress.legacyMode,
        ...course.progress.ids,
        'audio/clip.mp3'
      ])};
    </script>
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page must resolve lesson49 from the shared catalog/
  );

  await fs.writeFile(entry, `
    <script src="/core/course-catalog.js"></script>
    <script>
      const COURSE_PROGRESS = CanranCore.courseCatalog.requirePublishedCourse('lesson49').progress;
      const loaded = CanranCore.storage.loadProgress({
        storage: localStorage,
        key: 'canran:wrong:progress:v2',
        ids: ['wrong']
      });
      const recording = 'audio/clip.mp3';
    </script>
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page must not hard-code progress storage metadata/
  );

  await fs.writeFile(entry, validCoursePageSource(course));
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published learning location contract requires every declared asset and regression file', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-map-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await fs.copyFile(
    path.join(ROOT, 'lesson49/audio/beef.mp3'),
    path.join(root, 'lesson49/audio/clip.mp3')
  );

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
    await fs.writeFile(
      file,
      relative.endsWith('.png') ? ONE_PIXEL_PNG.subarray(0, 8) : relative
    );
  }

  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid map image assets\/adventure-map\/lesson49\/base\.png/
  );

  for (const relative of contractFiles.filter(file => file.endsWith('.png'))) {
    await fs.writeFile(path.join(root, relative), ONE_PIXEL_PNG);
  }
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid Playwright regression test tests\/e2e\/lesson49-map\.spec\.js/
  );

  await fs.writeFile(path.join(root, course.map.regressionTest), `
    'use strict';
    const { test } = require('@playwright/test');
    class Helper { test() {} }
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid Playwright regression test tests\/e2e\/lesson49-map\.spec\.js/
  );

  await fs.writeFile(path.join(root, course.map.regressionTest), `
    'use strict';
    const note = "require('@playwright/test')";
    function test() {}
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid Playwright regression test tests\/e2e\/lesson49-map\.spec\.js/
  );

  await fs.writeFile(path.join(root, course.map.regressionTest), `
    /*
      const { test, expect } = require('@playwright/test');
      test('comment-only regression', async () => { expect(true).toBe(true); });
    */
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid Playwright regression test tests\/e2e\/lesson49-map\.spec\.js/
  );

  await fs.writeFile(path.join(root, course.map.regressionTest), `
    'use strict';
    const { test } = require('@playwright/test');
    test.skip('disabled regression', async () => {});
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: invalid Playwright regression test tests\/e2e\/lesson49-map\.spec\.js/
  );

  await fs.writeFile(path.join(root, course.map.regressionTest), `
    'use strict';
    const { test, expect } = require('@playwright/test');
    test('lesson 49 map regression', async () => { expect(true).toBe(true); });
  `);

  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});
