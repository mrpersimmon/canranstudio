'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const courseCatalog = require('../../core/course-catalog');

test('Lesson 49 and Lesson 50 resolve to the same first teaching unit', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');

  assert.equal(unit.unitId, 'FLC-U01');
  assert.deepEqual(unit.lessonIds, ['lesson49', 'lesson50']);
  assert.equal(catalog.getTeachingUnitForLesson('lesson49'), unit);
  assert.equal(catalog.getTeachingUnitForLesson('lesson50'), unit);
  assert.deepEqual(catalog.validate(), []);
});

test('U01 freezes one landmark, five targets, and the five-beat learning loop', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');

  assert.equal(unit.landmarkId, 'warm-lantern-market');
  assert.deepEqual(
    unit.beats.map(beat => beat.beatId),
    ['discover', 'understand', 'teach', 'transfer', 'build']
  );
  assert.deepEqual(
    unit.targets.map(target => target.targetId),
    ['FLC-U01-T01', 'FLC-U01-T02', 'FLC-U01-T03', 'FLC-U01-T04', 'FLC-U01-T05']
  );
  for (const target of unit.targets) {
    assert.ok(target.evidenceModes.length > 0);
    assert.ok(target.contextIds.length >= 2);
    assert.deepEqual(target.supportLadder, ['reobserve', 'partial-cue', 'model', 'near-transfer']);
  }
  for (const beat of unit.beats) {
    assert.equal(beat.task.taskId, `FLC-U01:${beat.beatId}:task`);
    assert.ok(unit.targets[0].contextIds.includes(beat.task.contextId));
    assert.equal(typeof beat.task.answerKeyByContext[beat.task.contextId], 'string');
    assert.equal(typeof beat.task.answerKeyByContext['picnic-supply'], 'string');
  }
  assert.deepEqual(unit.beats[1].task.formativeBinding, {
    targetId: 'FLC-U01-T01',
    evidenceMode: 'audio-image-quantity-match'
  });
  assert.equal(unit.beats[2].task.formativeBinding, undefined);
  assert.equal(Object.isFrozen(unit), true);
});

test('Lesson 49 authored presentation keeps both child scenes inside the curriculum catalog', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');
  const lesson49Beats = unit.beats.slice(0, 2);

  for (const beat of lesson49Beats) {
    const presentation = beat.task.presentation;
    assert.ok(presentation, `${beat.beatId} must own child-facing presentation data`);
    for (const contextId of ['breakfast-stall', 'picnic-supply']) {
      const scene = presentation.contexts[contextId];
      assert.equal(typeof scene.title, 'string');
      assert.ok(scene.options.some(option => (
        option.id === beat.task.answerKeyByContext[contextId]
      )));
      assert.equal(scene.support.length, 3);
    }
  }

  assert.deepEqual(
    unit.beats[1].task.presentation.audio.lines.map(line => line.src),
    [
      '/lesson49/audio/do_you_want_beef_or_lamb.mp3',
      '/lesson49/audio/beef_please.mp3'
    ]
  );
  assert.equal(Object.isFrozen(unit.beats[0].task.presentation), true);
});

test('the district catalog reserves six unique two-lesson units and thirty targets', () => {
  const units = catalog.listTeachingUnitsForDistrict('first-book-49-60');

  assert.deepEqual(
    units.map(unit => [unit.unitId, unit.status]),
    [
      ['FLC-U01', 'candidate'],
      ['FLC-U02', 'planned'],
      ['FLC-U03', 'planned'],
      ['FLC-U04', 'planned'],
      ['FLC-U05', 'planned'],
      ['FLC-U06', 'planned']
    ]
  );
  assert.equal(new Set(units.flatMap(unit => unit.lessonIds)).size, 12);
  assert.equal(new Set(units.flatMap(unit => unit.targets.map(target => target.targetId))).size, 30);
  assert.deepEqual(catalog.validate(units), []);
});

test('catalog validation rejects duplicate lesson ownership and unsafe human classification', () => {
  const u01 = catalog.getTeachingUnit('FLC-U01');
  const duplicate = { ...u01, unitId: 'FLC-U99', lessonIds: ['lesson49', 'lesson99'] };
  const unsafe = {
    ...u01,
    unitId: 'FLC-U98',
    lessonIds: ['lesson97', 'lesson98'],
    vocabulary: [{ term: 'husband', semanticType: 'meat' }]
  };

  assert.match(catalog.validate([...catalog.TEACHING_UNITS, duplicate]).join('\n'), /lesson49.*multiple units/i);
  assert.match(catalog.validate([unsafe]).join('\n'), /husband.*human/i);
});

test('candidate units require authored tasks whose bindings stay inside their target contract', () => {
  function message(change) {
    const candidate = structuredClone(catalog.getTeachingUnit('FLC-U01'));
    change(candidate);
    return catalog.validate([candidate]).join('\n');
  }

  assert.match(message(unit => { delete unit.beats[0].task; }), /discover.*authored task/i);
  assert.match(message(unit => { unit.beats[0].task.taskId = ''; }), /discover.*taskId/i);
  assert.match(message(unit => { unit.beats[0].task.contextId = 'moon-market'; }), /discover.*context/i);
  assert.match(message(unit => {
    delete unit.beats[0].task.answerKeyByContext['picnic-supply'];
  }), /discover.*answer key.*picnic-supply/i);
  assert.match(message(unit => {
    unit.beats[1].task.formativeBinding.targetId = 'FLC-U01-T99';
  }), /understand.*formative binding.*target/i);
  assert.match(message(unit => {
    unit.beats[1].task.formativeBinding.evidenceMode = 'page-asserted';
  }), /understand.*formative binding.*evidence mode/i);

  const planned = structuredClone(catalog.getTeachingUnit('FLC-U02'));
  assert.ok(planned.beats.every(beat => beat.task === undefined));
  assert.deepEqual(catalog.validate([planned]), []);
});

test('the legacy lesson catalog exposes teaching-unit membership as a compatibility view', () => {
  for (const unit of catalog.TEACHING_UNITS) {
    for (const lessonId of unit.lessonIds) {
      const course = courseCatalog.COURSES.find(candidate => candidate.id === lessonId);
      assert.equal(course.teachingUnitId, unit.unitId);
    }
  }
});
