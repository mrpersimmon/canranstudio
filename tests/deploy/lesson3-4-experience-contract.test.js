'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');
const unit = catalog.getTeachingUnit('NCE-U02');

test('Lesson 3–4 is a catalog-driven local POC with ten stable stages', () => {
  assert.equal(unit.status, 'candidate');
  assert.equal(unit.publicationScope, 'local-poc');
  assert.equal(unit.runtimeProfile, 'story-stage-v1');
  assert.equal(unit.experienceRevision, 'lesson3-4-v2');
  assert.equal(unit.curriculumContract.publicationAllowed, false);
  assert.equal(unit.experience.stages.length, 10);
  assert.deepEqual(
    unit.experience.stages.map(stage => stage.stageId),
    Array.from({ length: 10 }, (_, index) => `NCE-U02-S${String(index + 1).padStart(2, '0')}`)
  );
  assert.equal(unit.title, '5号牌与两把雨伞');
  assert.deepEqual(
    unit.experience.stages.map(stage => stage.title),
    [
      '走进衣帽间', '听完整故事', '递交号码牌', '第一把雨伞', '再找一把',
      '角色扮演', '换物问一问', '肯定与否定', '人物关系', '换个角色'
    ]
  );
  assert.deepEqual(unit.experience.navigation, {
    mode: 'compact-progress-stage-map',
    completedStageAction: 'replay',
    skippedStageAction: 'make-up',
    futureStageAction: 'locked'
  });
  assert.deepEqual(unit.experience.adventureHearts, {
    maximum: 3,
    rescuePartnerEntityId: 'explorer-cat',
    rescueResult: 'assisted'
  });
  const sampledStage = unit.experience.stages[6];
  assert.equal(sampledStage.kind, 'sampled-prompt-groups');
  assert.deepEqual(
    sampledStage.groups.map(group => group.retrievalSourceRef),
    ['L04-P03', 'L04-P08', 'L04-P12']
  );
  assert.ok(unit.experience.stages[5].skippableRoleRound);
  assert.ok(unit.experience.stages[9].skippableRoleRound);
  assert.deepEqual(catalog.validate(), []);
  const completion = unit.authoredContent[unit.experience.completionContentRef];
  assert.equal(completion.sceneTitle, '故事顺利结束');
  assert.equal(completion.sceneInstruction, '两把雨伞都回到了正确的位置');
});

test('Lesson 3–4 page owns no authored question or answer data', async () => {
  const [page, bootstrap, scene] = await Promise.all([
    fs.readFile(path.join(ROOT, 'poc/lesson3-4-experience/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson3-4-experience/experience.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/story-stage-scene.js'), 'utf8')
  ]);
  assert.match(page, /name="robots"[^>]*noindex/i);
  assert.match(page, /data-course-package-shell[^>]*data-package-state="checking"/);
  assert.match(page, /data-package-progress/);
  assert.match(page, /data-manifest-sha256="[a-f0-9]{64}"/);
  assert.doesNotMatch(page, /curriculum-catalog\.js/);
  assert.match(page, /<title>Lesson 3–4 · 5号牌与两把雨伞<\/title>/);
  assert.match(page, /story-stage-runtime\.js\?v=story-stage-v2/);
  assert.match(page, /story-stage-scene\.js\?v=story-stage-v2/);
  assert.match(bootstrap, /getTeachingUnit\?\.\(UNIT_ID\)/);
  assert.match(bootstrap, /BOOT_REVISION = 'lesson3-4-v2'/);
  assert.doesNotMatch(`${page}\n${bootstrap}`, /acceptedOptionId|acceptedEntityId|Is this your watch/);
  assert.match(scene, /dataset\.fixedSceneBackground/);
  assert.match(scene, /dataset\.fixedActor/);
  assert.match(scene, /dataset\.stableProp/);
  assert.match(scene, /dataset\.stageMap/);
  assert.match(scene, /dataset\.adventureHearts/);
  assert.doesNotMatch(scene, /[\u3400-\u9fff]/, 'shared scene must not own child-facing Chinese copy');
  assert.doesNotMatch(scene, /root\.innerHTML\s*=/);
});

test('diagnostic question copy does not repeat its accepted visible answer', () => {
  for (const stage of unit.experience.stages) {
    const subjects = stage.rounds || [stage];
    for (const subject of subjects) {
      if (
        stage.kind === 'entity-action'
        || stage.kind === 'dialogue-comprehension'
        || !subject.answerRule?.acceptedOptionId
      ) continue;
      const accepted = subject.options.find(option => (
        option.optionId === subject.answerRule.acceptedOptionId
      ));
      assert.ok(accepted, `${stage.stageId} accepted option exists`);
      const questionCopy = [stage.title, subject.prompt || stage.prompt]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('en-US');
      assert.equal(
        questionCopy.includes(accepted.label.toLocaleLowerCase('en-US')),
        false,
        `${stage.stageId} must not reveal ${accepted.label}`
      );
    }
  }
});

test('new Lesson 3–4 visual assets are transparent and have responsive derivatives', async () => {
  const bases = [
    'item-umbrella-star-v1', 'item-umbrella-stripe-v1', 'item-umbrella-dot-v1',
    'item-ticket-five-v1', 'item-suit-v1', 'scene-school-v1',
    'character-teacher-card-v1', 'character-son-card-v1', 'character-daughter-card-v1'
  ];
  for (const base of bases) {
    const png = path.join(ROOT, 'poc/lesson3-4-experience/assets', `${base}.png`);
    const [metadata, stats] = await Promise.all([sharp(png).metadata(), sharp(png).stats()]);
    assert.deepEqual(
      { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
      { width: 988, height: 988, hasAlpha: true },
      base
    );
    assert.equal(stats.channels[3].min, 0, base);
    assert.equal(stats.channels[3].max, 255, base);
    for (const extension of ['webp', 'avif']) {
      const derived = await sharp(path.join(
        ROOT,
        'poc/lesson3-4-experience/assets',
        `${base}.${extension}`
      )).metadata();
      assert.deepEqual(
        { width: derived.width, height: derived.height, hasAlpha: derived.hasAlpha },
        { width: 640, height: 640, hasAlpha: true },
        `${base}.${extension}`
      );
    }
  }
});

test('narrow generated props never acquire opaque resize letterboxes', async () => {
  const ticketPath = path.join(
    ROOT,
    'poc/lesson3-4-experience/assets/item-ticket-five-v1.png'
  );
  const { data, info } = await sharp(ticketPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let opaqueDarkPixels = 0;
  let opaquePixels = 0;
  for (let offset = 0; offset < data.length; offset += info.channels) {
    if (data[offset + 3] <= 200) continue;
    opaquePixels += 1;
    if (Math.max(data[offset], data[offset + 1], data[offset + 2]) < 40) {
      opaqueDarkPixels += 1;
    }
  }
  assert.ok(opaquePixels > 0, 'ticket contains visible pixels');
  assert.ok(
    opaqueDarkPixels / opaquePixels < 0.15,
    'transparent padding must not turn into opaque black bars'
  );
});

test('no-flicker contract keeps background and actors outside the changing task ledger', async () => {
  const [scene, css] = await Promise.all([
    fs.readFile(path.join(ROOT, 'core/story-stage-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/story-stage-experience.css'), 'utf8')
  ]);
  assert.match(scene, /root\.replaceChildren\(shell\)/);
  assert.match(scene, /nodes\.taskPanel\.replaceChildren/);
  assert.doesNotMatch(scene, /nodes\.(?:background|actorLayer|propLayer)\.replaceChildren/);
  assert.doesNotMatch(scene, /taskPanel\.setAttribute\(['"]aria-live/);
  assert.match(scene, /preloadImages\(backgroundUrls\)/);
  assert.match(scene, /await preloadImages\(currentAssetGroups\)/);
  assert.match(scene, /entity\?\.assets\?\.avif/);
  assert.match(scene, /image\.decode\(\)/);
  assert.match(css, /\.counter-prop img\s*{[^}]*position:\s*absolute[^}]*width:\s*100%[^}]*height:\s*100%/s);
  assert.doesNotMatch(css, /\.cloakroom-experience[^}]*opacity\s*:\s*0/);
  assert.doesNotMatch(css, /animation\s*:[^;]*(flash|blink)/i);
});

test('Lesson 3–4 cross-day review is catalog-driven and isolated from mainline progress', async () => {
  const [page, client, runtime] = await Promise.all([
    fs.readFile(path.join(ROOT, 'poc/lesson3-4-review/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson3-4-review/review.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/story-review-runtime.js'), 'utf8')
  ]);
  const reviewRun = unit.experience.reviewRun;

  assert.deepEqual(reviewRun.availability, { mode: 'next-local-calendar-day' });
  assert.equal(reviewRun.heartPool, 'isolated-three-hearts');
  assert.equal(reviewRun.zeroAction, 'restart-entire-review-run');
  assert.equal(reviewRun.items.length, 3);
  assert.match(page, /name="robots"[^>]*noindex/i);
  assert.match(page, /story-review-runtime\.js\?v=lesson3-4-v2/);
  assert.match(client, /const contract = unit\.experience\.reviewRun/);
  assert.match(client, /runtime\.isEligible\(unit, progress, new Date\(\)\)/);
  assert.match(client, /poc:learning-review:/);
  assert.doesNotMatch(client, /localStorage\.setItem\(unit\.experience\.storageKey/);
  assert.doesNotMatch(`${page}\n${client}`, /acceptedOptionId|acceptedEntityId|选择刚才问到的人物/);
  assert.match(runtime, /currentDay > completedDay/);
});
