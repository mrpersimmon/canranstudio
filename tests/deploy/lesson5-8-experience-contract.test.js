'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');
const CASES = [
  ['NCE-U03', 'lesson5-6-experience', 'lesson5-6-v1'],
  ['NCE-U04', 'lesson7-8-experience', 'lesson7-8-v1']
];

for (const [unitId, pageDir, revision] of CASES) {
  test(`${unitId} is a catalog-only authored page surface with ten stages`, async () => {
    const unit = catalog.getTeachingUnit(unitId);
    const page = await fs.readFile(path.join(ROOT, 'poc', pageDir, 'index.html'), 'utf8');
    assert.equal(unit.status, 'candidate');
    assert.equal(unit.publicationScope, 'local-poc');
    assert.equal(unit.runtimeProfile, 'story-stage-v1');
    assert.equal(unit.experienceRevision, revision);
    assert.equal(unit.experience.stages.length, 10);
    assert.equal(unit.curriculumContract.publicationAllowed, false);
    assert.deepEqual(catalog.validate(), []);
    assert.match(page, /name="robots"[^>]*noindex/i);
    assert.match(page, new RegExp(`data-unit-id="${unitId}"`));
    assert.match(page, new RegExp(`data-boot-revision="${revision}"`));
    assert.match(page, /story-stage-runtime\.js\?v=story-stage-v1/);
    assert.match(page, /story-stage-scene\.js\?v=story-stage-v1/);
    assert.match(page, /story-stage-boot\.js\?v=story-stage-v1/);
    assert.doesNotMatch(page, /acceptedOptionId|acceptedEntityId|answerRule/);
  });

  test(`${unitId} catalog entities own transparent responsive art`, async () => {
    const unit = catalog.getTeachingUnit(unitId);
    for (const entity of Object.values(unit.entities)) {
      const png = path.join(ROOT, entity.assets.png.replace(/^\//, ''));
      const [metadata, stats] = await Promise.all([sharp(png).metadata(), sharp(png).stats()]);
      assert.equal(metadata.width, 900, entity.entityId);
      assert.equal(metadata.height, 900, entity.entityId);
      assert.equal(metadata.hasAlpha, true, entity.entityId);
      assert.equal(stats.channels[3].min, 0, entity.entityId);
      assert.equal(stats.channels[3].max, 255, entity.entityId);
      for (const format of ['webp', 'avif']) {
        const derived = await sharp(path.join(ROOT, entity.assets[format].replace(/^\//, ''))).metadata();
        assert.equal(derived.width, 640, `${entity.entityId}.${format}`);
        assert.equal(derived.height, 640, `${entity.entityId}.${format}`);
        assert.equal(derived.hasAlpha, true, `${entity.entityId}.${format}`);
      }
    }
  });

  test(`${unitId} has distinct wide and portrait scene masters`, async () => {
    const scene = catalog.getTeachingUnit(unitId).experience.scene;
    const wide = await sharp(path.join(ROOT, scene.backgroundWide.replace(/^\//, ''))).metadata();
    const portrait = await sharp(path.join(ROOT, scene.backgroundPortrait.replace(/^\//, ''))).metadata();
    assert.deepEqual({ width: wide.width, height: wide.height }, { width: 1920, height: 1200 });
    assert.deepEqual({ width: portrait.width, height: portrait.height }, { width: 900, height: 1600 });
  });
}

test('shared scene preserves stable background and actor nodes across task renders', async () => {
  const [scene, css] = await Promise.all([
    fs.readFile(path.join(ROOT, 'core/story-stage-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/story-stage-experience.css'), 'utf8')
  ]);
  assert.match(scene, /root\.replaceChildren\(shell\)/);
  assert.match(scene, /nodes\.taskPanel\.replaceChildren/);
  assert.doesNotMatch(scene, /nodes\.background\.replaceChildren|nodes\.actorLayer\.replaceChildren/);
  assert.match(scene, /await preloadImages\(backgroundUrls\)/);
  assert.match(scene, /await preloadImages\(currentAssetGroups\)/);
  assert.match(scene, /image\.decode\(\)/);
  assert.match(scene, /onSourceChange\?\.\(source\)/);
  assert.match(scene, /nodes\.progressFill\.style\.width/);
  assert.match(scene, /nodes\.stageButtons/);
  assert.match(scene, /dataset\.stableProp/);
  assert.doesNotMatch(css, /animation\s*:[^;]*(flash|blink)/i);
  assert.doesNotMatch(css, /\.story-stage-experience[^}]*opacity\s*:\s*0/);
  assert.match(css, /\.compact-progress\s*\{[^}]*grid-template-columns:[^}]*min-height:\s*50px/s);
  assert.match(css, /\.compact-progress__track\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.stage-map__grid\s*\{[^}]*grid-template-columns:/s);
  assert.match(css, /\.icon-button\s*\{[^}]*width:\s*50px;[^}]*height:\s*50px/s);
});

test('diagnostic prompts never repeat a visible accepted answer label', () => {
  for (const [unitId] of CASES) {
    const unit = catalog.getTeachingUnit(unitId);
    for (const stage of unit.experience.stages) {
      for (const subject of stage.rounds || [stage]) {
        if (!subject.answerRule?.acceptedOptionId || !subject.options) continue;
        const accepted = subject.options.find(option => (
          option.optionId === subject.answerRule.acceptedOptionId
        ));
        const prompt = [stage.title, stage.instruction, subject.prompt || stage.prompt]
          .filter(Boolean).join(' ').toLowerCase();
        assert.equal(
          prompt.includes(accepted.label.toLowerCase()),
          false,
          `${stage.stageId} exposes ${accepted.label}`
        );
      }
    }
  }
});
