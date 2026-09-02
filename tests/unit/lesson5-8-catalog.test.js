'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');

const CASES = [
  ['NCE-U03', ['lesson5', 'lesson6'], [43, 44, 45, 46], 50],
  ['NCE-U04', ['lesson7', 'lesson8'], [47, 48, 49, 50], 47]
];

test('Lesson 5–8 units remain source-governed and catalog-valid', () => {
  assert.deepEqual(catalog.validate(), []);
  for (const [unitId, lessonIds, pdfPages, audioCount] of CASES) {
    const unit = catalog.getTeachingUnit(unitId);
    assert.deepEqual(unit.lessonIds, lessonIds);
    assert.equal(unit.targets.length, 6);
    assert.equal(unit.sourceTargetCoverage.length > 0, true);
    assert.equal(unit.firstSessionEvidencePlan.policyId, 'first-session-representative-retrieval-v1');
    assert.equal(unit.audioReviewContract.expectedAudioSourceCount, audioCount);
    assert.equal(unit.curriculumContract.sourceRegister.snapshotSha256, 'a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f');
    assert.deepEqual(
      Object.values(unit.curriculumContract.sourceRegister.lessonPageMap)
        .flatMap(page => page.pdfPages),
      pdfPages
    );
  }
});

test('Lesson 5–8 textbook questions and dialogues are exact catalog sources', () => {
  const u03 = catalog.getTeachingUnit('NCE-U03');
  assert.equal(u03.lessonContent.lesson5.sources['L05-Q01'].text, 'Is Chang-woo Chinese?');
  assert.equal(u03.lessonContent.lesson5.sources['L05-D20'].text, 'Nice to meet you.');
  assert.equal(u03.lessonContent.lesson6.sources['L06-P01'].text, "It's a Volvo. (Swedish)");

  const u04 = catalog.getTeachingUnit('NCE-U04');
  assert.equal(u04.lessonContent.lesson7.sources['L07-Q01'].text, "What is Robert's job?");
  assert.equal(u04.lessonContent.lesson7.sources['L07-D16'].text, "I'm an engineer.");
  assert.equal(u04.lessonContent.lesson8.sources['L08-P04'].text, "I'm an air hostess.");
});

test('every required source is exposed and every evidence source is evidenced', () => {
  for (const [unitId] of CASES) {
    const unit = catalog.getTeachingUnit(unitId);
    const exposed = new Set(unit.experience.stages.flatMap(stage => stage.exposureRefs || []));
    const evidenced = new Set(unit.experience.stages.flatMap(stage => stage.evidenceRefs || []));
    for (const lesson of Object.values(unit.lessonContent)) {
      for (const sourceId of lesson.requiredSourceIds) {
        assert.ok(exposed.has(sourceId), `${unitId} exposes ${sourceId}`);
        if (lesson.sources[sourceId].coveragePolicy === 'evidence') {
          assert.ok(evidenced.has(sourceId), `${unitId} evidences ${sourceId}`);
        }
      }
    }
  }
});

test('Lesson 5–8 production documents and grammar identities stay synchronized', async () => {
  const grammar = await fs.readFile(
    path.join(ROOT, 'docs/designs/new-concept-english-book1-grammar-spine-v1.md'),
    'utf8'
  );
  for (const [unitId, lessonIds] of CASES) {
    const unit = catalog.getTeachingUnit(unitId);
    const pair = lessonIds.map(id => id.replace('lesson', '')).join('-');
    for (const suffix of [
      'teaching-unit-launch-pack-v1.md',
      'experience-spec-v1.md',
      'visual-system-v1.md',
      'runtime-and-qa-contract-v1.md',
      'browser-qa-report-v1.md'
    ]) {
      const document = await fs.readFile(
        path.join(ROOT, 'docs/designs', `lesson${pair}-${suffix}`),
        'utf8'
      );
      assert.match(document, new RegExp(unitId));
      assert.match(document, new RegExp(unit.experienceRevision));
    }
    for (const structureRef of new Set(unit.targets.flatMap(target => target.structureRefs))) {
      assert.ok(grammar.includes(`| \`${structureRef}\` |`), structureRef);
    }
  }
});
