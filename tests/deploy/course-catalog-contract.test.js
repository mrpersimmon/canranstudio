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
  const presentationLink = course.presentation?.declaredStatus === 'published'
    ? `<a href="${course.presentation.route}">课堂投屏</a>`
    : '';
  return `
    ${presentationLink}
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

function validPresentationPageSource(course) {
  const controls = course.presentation.controls.map(control => (
    control === 'exit'
      ? `<a href="${course.route}" data-presentation-control="${control}">退出投屏</a>`
      : `<button data-presentation-control="${control}">${control}</button>`
  )).join('\n');
  return `
    ${controls}
    <script src="/core/course-catalog.js"></script>
    <script src="/core/audio-player.js"></script>
    <script src="/core/classroom-presentation.js"></script>
    <script>
      const CLASSROOM_COURSE = CanranCore.courseCatalog.requirePublishedCourse('${course.id}');
      CanranCore.classroomPresentation.mount({ course: CLASSROOM_COURSE, audioPlayer: CanranCore.audio.createAudioPlayer() });
    </script>
  `;
}

function withoutPresentation(course) {
  course.presentation = structuredClone(
    catalog.COURSES.find(item => item.id === 'lesson50').presentation
  );
  return course;
}

async function writePublishedMapContract(root, course) {
  if (course.map.declaredStatus !== 'published') return;
  const imageFiles = [
    course.map.baseAsset,
    ...course.map.stages.map(stage => stage.growthAsset),
    course.map.souvenir.asset,
    course.map.mobilePreview
  ];
  for (const relative of imageFiles) {
    const file = path.join(root, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, ONE_PIXEL_PNG);
  }
  const regression = path.join(root, course.map.regressionTest);
  await fs.mkdir(path.dirname(regression), { recursive: true });
  await fs.writeFile(regression, `
    'use strict';
    const { test, expect } = require('@playwright/test');
    test('published location journey', async () => { expect(true).toBe(true); });
  `);
}

test('static course contract requires real same-origin prerecorded audio', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-course-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = withoutPresentation(structuredClone(
    catalog.COURSES.find(item => item.id === 'lesson49')
  ));

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await fs.writeFile(path.join(root, 'lesson49/audio/readme.txt'), 'not a recording');
  await writePublishedMapContract(root, course);

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

  await fs.writeFile(
    path.join(root, 'lesson49/index.html'),
    validCoursePageSource(course).replace(
      "const recording = 'audio/clip.mp3';",
      "speechSynthesis.speak(new SpeechSynthesisUtterance('beef'));"
    )
  );
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: course page must reference same-origin prerecorded audio/
  );

  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published course page must consume progress metadata from the shared catalog', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-progress-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = withoutPresentation(structuredClone(
    catalog.COURSES.find(item => item.id === 'lesson49')
  ));
  const entry = path.join(root, course.entry);

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await writePublishedMapContract(root, course);
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

test('a published lesson outside V1 requires a visible V2 map notice on its direct page', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-future-course-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson50'));
  course.id = 'lesson61';
  course.lesson = 61;
  course.route = '/lesson61/';
  course.entry = 'lesson61/index.html';
  course.assetDirectories = ['lesson61/audio'];
  course.progress.key = 'canran:l61:progress:v2';
  delete course.progress.legacyKey;
  delete course.progress.legacyMode;
  course.map = catalog.createLessonMap(61);

  await fs.mkdir(path.join(root, 'lesson61/audio'), { recursive: true });
  await fs.copyFile(
    path.join(ROOT, 'lesson50/audio/bean.mp3'),
    path.join(root, 'lesson61/audio/clip.mp3')
  );
  await fs.writeFile(path.join(root, course.entry), validCoursePageSource(course));

  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson61: direct course page must say its map will arrive in V2/
  );

  await fs.writeFile(path.join(root, course.entry), `
    <!-- <p data-course-map-status="v2">地图将在 V2 到来</p> -->
    <p data-course-map-status="v2" hidden>地图将在 V2 到来</p>
    ${validCoursePageSource(course)}
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson61: direct course page must say its map will arrive in V2/
  );

  await fs.writeFile(path.join(root, course.entry), `
    <p data-course-map-status="v2">课程现在可以直接学习，对应地图将在 V2 到来。</p>
    ${validCoursePageSource(course)}
  `);
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published classroom presentation requires controls, same-origin recordings, regression, and no device data', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-presentation-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = structuredClone(catalog.COURSES.find(item => item.id === 'lesson49'));
  course.map = structuredClone(catalog.COURSES.find(item => item.id === 'lesson50').map);

  await fs.mkdir(path.join(root, 'lesson49/audio'), { recursive: true });
  await fs.mkdir(path.join(root, 'core'), { recursive: true });
  await fs.writeFile(path.join(root, 'lesson49/index.html'), validCoursePageSource(course));
  await fs.writeFile(path.join(root, 'core/classroom-presentation.js'), 'const runtime = "device-data free";');
  await fs.copyFile(
    path.join(ROOT, course.presentation.steps[0].audioAsset),
    path.join(root, course.presentation.steps[0].audioAsset)
  );

  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: missing file lesson49\/present\/index\.html/
  );

  await fs.mkdir(path.join(root, 'lesson49/present'), { recursive: true });
  await fs.writeFile(
    path.join(root, course.presentation.entry),
    validPresentationPageSource(course).replace(`href="${course.route}"`, 'href="/"')
  );
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: classroom presentation exit must return to its course/
  );

  await fs.writeFile(path.join(root, course.presentation.entry), `
    <p>localStorage.getItem('private')</p>
    ${validPresentationPageSource(course)}
  `);
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: classroom presentation must not read device data or request services/
  );

  await fs.writeFile(path.join(root, course.presentation.entry), validPresentationPageSource(course));
  for (const step of course.presentation.steps.slice(0, -1)) {
    const target = path.join(root, step.audioAsset);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(ROOT, step.audioAsset), target);
  }
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: missing file lesson49\/audio\/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either\.mp3/
  );

  const lastStep = course.presentation.steps.at(-1);
  await fs.copyFile(path.join(ROOT, lastStep.audioAsset), path.join(root, lastStep.audioAsset));
  await assert.rejects(
    assertCourseCatalogContract({ root, courses: [course] }),
    /lesson49: missing file tests\/e2e\/classroom-presentation\.spec\.js/
  );

  const regression = path.join(root, course.presentation.regressionTest);
  await fs.mkdir(path.dirname(regression), { recursive: true });
  await fs.writeFile(regression, `
    'use strict';
    const { test, expect } = require('@playwright/test');
    test('classroom presentation journey', async () => { expect(true).toBe(true); });
  `);
  await assert.doesNotReject(assertCourseCatalogContract({ root, courses: [course] }));
});

test('published learning location contract requires every declared asset and regression file', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-map-contract-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const course = withoutPresentation(structuredClone(
    catalog.COURSES.find(item => item.id === 'lesson49')
  ));

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

test('Lesson 49 landmark layers and souvenir are fixed 1024px transparent PNG assets', async () => {
  const course = catalog.COURSES.find(item => item.id === 'lesson49');
  const transparentAssets = [
    course.map.baseAsset,
    ...course.map.stages.map(stage => stage.growthAsset),
    course.map.souvenir.asset
  ];

  for (const relative of transparentAssets) {
    const bytes = await fs.readFile(path.join(ROOT, relative));
    assert.equal(bytes.subarray(12, 16).toString('ascii'), 'IHDR', relative);
    assert.equal(bytes.readUInt32BE(16), 1024, `${relative} width`);
    assert.equal(bytes.readUInt32BE(20), 1024, `${relative} height`);
    assert.ok([4, 6].includes(bytes[25]), `${relative} must carry an alpha channel`);
  }

  const preview = await fs.readFile(path.join(ROOT, course.map.mobilePreview));
  assert.equal(preview.readUInt32BE(16), 1024, 'mobile preview width');
  assert.equal(preview.readUInt32BE(20), 1024, 'mobile preview height');
});
