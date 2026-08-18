'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const courseCatalog = require('../../core/course-catalog');

test('Lesson 1 and Lesson 2 resolve to one elementary teaching unit', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');

  assert.equal(unit.unitId, 'NCE-U01');
  assert.deepEqual(unit.lessonIds, ['lesson1', 'lesson2']);
  assert.equal(catalog.getTeachingUnitForLesson('lesson1'), unit);
  assert.equal(catalog.getTeachingUnitForLesson('lesson2'), unit);
  assert.equal(unit.publicationScope, 'local-poc');
  assert.deepEqual(
    unit.targets.map(target => target.targetId),
    ['NCE-U01-T01', 'NCE-U01-T02', 'NCE-U01-T03', 'NCE-U01-T04', 'NCE-U01-T05']
  );
});

test('Lesson 1 and Lesson 2 preserve the complete textbook source ledger', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const lesson1 = unit.lessonContent.lesson1;
  const lesson2 = unit.lessonContent.lesson2;

  assert.deepEqual(
    Array.from({ length: 7 }, (_, index) => lesson1.sources[`L01-D0${index + 1}`].text),
    [
      'Excuse me!',
      'Yes?',
      'Is this your handbag?',
      'Pardon?',
      'Is this your handbag?',
      'Yes, it is.',
      'Thank you very much.'
    ]
  );
  assert.notEqual(lesson1.sources['L01-D03'], lesson1.sources['L01-D05']);
  assert.deepEqual(
    Array.from({ length: 11 }, (_, index) => lesson1.sources[`L01-W${String(index + 1).padStart(2, '0')}`].text),
    ['excuse', 'me', 'yes', 'is', 'this', 'your', 'handbag', 'pardon', 'it', 'thank you', 'very much']
  );
  assert.deepEqual(
    Array.from({ length: 10 }, (_, index) => lesson2.sources[`L02-W${String(index + 1).padStart(2, '0')}`].text),
    ['pen', 'pencil', 'book', 'watch', 'coat', 'dress', 'skirt', 'shirt', 'car', 'house']
  );

  assert.equal(lesson1.sources['L01-Q01'].sourceRole, 'context');
  assert.equal(lesson1.sources['L01-N01'].sourceRole, 'support');
  assert.equal(lesson1.sources['L01-N02'].coveragePolicy, 'exposure');
  assert.ok(Array.from({ length: 7 }, (_, index) => (
    lesson1.sources[`L01-Z0${index + 1}`].coveragePolicy === 'optional'
  )).every(Boolean));
  assert.ok(Object.values(lesson2.sources).filter(item => item.sourceKind === 'substitution-item')
    .every(item => item.sourceRole === 'target' && item.coveragePolicy === 'evidence'));

  assert.deepEqual(lesson2.sources['L02-E01'], {
    sourceId: 'L02-E01',
    sourceKind: 'exercise-mechanism',
    text: 'Copy these sentences.',
    sourceRole: 'context',
    coveragePolicy: 'omitted',
    reusedSourceRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
    omissionReason: 'Independent mobile course omits handwriting as accepted by ADR-0082.'
  });
  assert.equal(Object.isFrozen(lesson1), true);
  assert.equal(Object.isFrozen(lesson2), true);
});

test('Lesson 1 and Lesson 2 author twelve atomic microtasks and all twenty-two T1 channel cells', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);

  assert.equal(unit.status, 'candidate');
  assert.equal(unit.runtimeProfile, 'microtask-v2');
  assert.deepEqual(
    microtasks.map(task => task.microtaskId),
    [
      ...Array.from({ length: 5 }, (_, index) => `L01-M0${index + 1}`),
      ...Array.from({ length: 7 }, (_, index) => `L02-M0${index + 1}`)
    ]
  );
  assert.ok(microtasks.every(task => (
    task.required === true
    && task.persistence?.atomic === true
    && task.persistence?.resumePolicy === 'restart-microtask'
    && task.checkpointAfterSuccess?.checkpointId === `${task.microtaskId}:complete`
  )));
  assert.equal(microtasks.find(task => task.microtaskId === 'L01-M05').growthBoundary, 'chapter-interior');
  assert.equal(microtasks.find(task => task.microtaskId === 'L02-M07').growthBoundary, 'unit-built');
  assert.ok(microtasks.filter(task => !['L01-M05', 'L02-M07'].includes(task.microtaskId))
    .every(task => task.growthBoundary === 'none'));

  const t1Cells = microtasks.flatMap(task => (
    (task.targetResults || [])
      .filter(result => result.targetId === 'NCE-U01-T01')
      .map(result => [result.sourceRef, result.channel, task.microtaskId])
  ));
  assert.deepEqual(t1Cells, [
    ['L01-W07', 'audio', 'L01-M01'],
    ['L02-W03', 'audio', 'L02-M01'],
    ['L02-W01', 'audio', 'L02-M01'],
    ['L02-W04', 'audio', 'L02-M01'],
    ['L02-W02', 'audio', 'L02-M01'],
    ['L01-W07', 'word-form', 'L02-M02'],
    ['L02-W04', 'word-form', 'L02-M02'],
    ['L02-W02', 'word-form', 'L02-M02'],
    ['L02-W03', 'word-form', 'L02-M02'],
    ['L02-W01', 'word-form', 'L02-M02'],
    ['L02-W08', 'audio', 'L02-M03'],
    ['L02-W05', 'audio', 'L02-M03'],
    ['L02-W06', 'audio', 'L02-M03'],
    ['L02-W07', 'audio', 'L02-M03'],
    ['L02-W07', 'word-form', 'L02-M04'],
    ['L02-W05', 'word-form', 'L02-M04'],
    ['L02-W06', 'word-form', 'L02-M04'],
    ['L02-W08', 'word-form', 'L02-M04'],
    ['L02-W10', 'audio', 'L02-M05'],
    ['L02-W09', 'audio', 'L02-M05'],
    ['L02-W09', 'word-form', 'L02-M06'],
    ['L02-W10', 'word-form', 'L02-M06']
  ]);
  assert.deepEqual(catalog.validate([structuredClone(unit)]), []);
});

test('Lesson 1 and Lesson 2 prompts use child questions and concrete story actions', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const steps = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps)
    .map(step => [step.stepId, step.prompt]));
  const expected = {
    'L01-M02:S03': '想问手提包是不是她的，应该怎么说？',
    'L01-M02:S04': '听听他怎么问',
    'L01-M03:S01': '她没听清，应该怎么说？',
    'L01-M03:S02': '听听他们怎么继续说',
    'L01-M03:S03': '把手提包交给她',
    'L01-M04:S01': '听听她拿回手提包后怎么说',
    'L01-M04:S03': '收到徽章，应该怎么说？',
    'L02-M01:S01': '布袋里是什么？打开看看',
    'L02-M02:S01': '看单词，找到对应的物品',
    'L02-M02:S02': '想礼貌叫住他，应该怎么说？',
    'L02-M02:S04': '想问手表是不是他的，把 watch 放进问句',
    'L02-M02:S05': '听听他怎么回答',
    'L02-M02:S06': '把手表交给他',
    'L02-M02:S07': '听听他拿回手表后怎么说',
    'L02-M03:S01': '衣罩里是什么？拉开看看',
    'L02-M04:S01': '看单词，找到对应的衣物',
    'L02-M04:S03': '这是你的外套，应该怎么回答？',
    'L02-M04:S04': '把外套接过来',
    'L02-M04:S05': '收到外套，应该怎么说？',
    'L02-M05:S01': '这两把钥匙会打开什么？',
    'L02-M06:S01': '看单词，找到对应的钥匙',
    'L02-M06:S02': '你想先帮哪把钥匙找主人？',
    'L02-M06:S03': '想礼貌叫住他，应该怎么说？',
    'L02-M06:S05': '把两块词语排成一句问话',
    'L02-M06:S06': '听听他怎么回答',
    'L02-M06:S07': '把钥匙交给他',
    'L02-M06:S08': '听听他拿回钥匙后怎么说',
    'L02-M07:S01': '把三份认领记录都点亮',
    'L02-M07:S02': '拉下开张拉杆'
  };

  for (const [stepId, prompt] of Object.entries(expected)) assert.equal(steps.get(stepId), prompt);
});

test('Lesson 1 and Lesson 2 correction copy matches the action the child is taking', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const steps = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps)
    .map(step => [step.stepId, step]));

  assert.deepEqual(steps.get('L01-M01:S02').support, [
    '看看物品和人物，想想应该交给谁。',
    '跟着刚才的对话，再找一次正确的人。',
    '小猫陪你再看一遍，然后由你自己完成。'
  ]);
  assert.deepEqual(steps.get('L01-M02:S01').support, [
    '看看现在发生了什么，再想想该说哪句。',
    '想一想：现在是叫住别人、请人再说，还是表示感谢？',
    '小猫陪你换个情境想一想，然后由你自己选。'
  ]);
  assert.deepEqual(steps.get('L02-M02:S01').support, [
    '再看一遍这个英文单词的样子。',
    '慢慢看开头、中间和结尾，再选一次。',
    '小猫陪你再看一次，然后由你自己选。'
  ]);
  assert.deepEqual(steps.get('L02-M06:S05').support, [
    '先想想这句话要问什么。',
    '先放问句开头，再放钥匙的单词。',
    '小猫陪你再排一次，然后由你自己完成。'
  ]);
});

test('Lesson 1 and Lesson 2 introduce the lost-handbag premise before the dialogue', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');

  assert.deepEqual(unit.experience.briefing, {
    kicker: '开门前 · 先看看发生了什么',
    title: '小站收到一只没人认领的手提包',
    copy: '一位先生和一位女士来到窗口。先听他们怎么说，再帮手提包找到主人。',
    imageSrc: '/poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.avif',
    imageFallbackSrc: '/poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.jpg',
    imageAlt: '探险小猫指着柜台上的手提包，一位先生和一位女士正准备交谈。',
    actionLabel: '去听他们说话'
  });
});

test('microtask v2 catalog validation rejects imperative answers and forged result identities', () => {
  function message(change) {
    const candidate = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    change(candidate);
    return catalog.validate([candidate]).join('\n');
  }

  assert.match(message(unit => {
    unit.beats[0].microtasks[0].steps[1].answerRule.type = 'button-index';
  }), /L01-M01:S02.*declarative answer rule/i);
  assert.match(message(unit => {
    unit.beats[1].microtasks[0].steps[1].challengeSourceRefs[0] = 'L02-W99';
  }), /L02-M01:S02.*unknown source L02-W99/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[0].steps[1].targetEntityIds[1] = 'unknown-recipient';
  }), /L01-M01:S02.*unknown entity unknown-recipient/i);
  assert.match(message(unit => {
    unit.beats[3].microtasks[1].steps[4].selectedEntityFactId = 'page-supplied-branch';
  }), /L02-M06:S05.*stored child choice/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[0].targetResults[0].targetId = 'NCE-U01-T99';
  }), /L01-M01.*target result.*NCE-U01-T99/i);
  assert.match(message(unit => {
    const duplicate = structuredClone(unit.beats[0].microtasks[0].targetResults[1]);
    unit.beats[1].microtasks[1].targetResults.push(duplicate);
  }), /L01-W07:audio.*duplicated/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[4].growthBoundary = 'unit-built';
    unit.beats[0].microtasks[4].checkpointAfterSuccess.buildStage = 5;
  }), /L01-M05.*unit growth.*final microtask/i);
});

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

test('Lesson 49 freezes every required textbook source with stable semantic identity', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');
  const lesson49 = unit.lessonContent.lesson49;
  const expectedIds = [
    'L49-Q01',
    ...Array.from({ length: 11 }, (_, index) => `L49-D${String(index + 1).padStart(2, '0')}`),
    ...Array.from({ length: 11 }, (_, index) => `L49-W${String(index + 1).padStart(2, '0')}`),
    ...Array.from({ length: 4 }, (_, index) => `L49-P${String(index + 1).padStart(2, '0')}`),
    ...Array.from({ length: 4 }, (_, index) => `L49-N${String(index + 1).padStart(2, '0')}`)
  ];

  assert.deepEqual(lesson49.requiredSourceIds, expectedIds);
  assert.deepEqual(Object.keys(lesson49.sources), [...expectedIds, 'L49-X01']);
  assert.equal(lesson49.sources['L49-W05'].text, 'husband');
  assert.equal(lesson49.sources['L49-W05'].semanticType, 'human-relationship');
  assert.equal(lesson49.sources['L49-X01'].required, false);
  assert.equal(lesson49.sources['L49-X01'].sourceKind, 'derived-expression');
  assert.equal(Object.isFrozen(lesson49), true);
});

test('Lesson 49 authors nine ordered required microtasks across its first two beats', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');
  const [discover, understand] = unit.beats;
  const microtasks = [...discover.microtasks, ...understand.microtasks];

  assert.equal(discover.completionRule, 'all-required');
  assert.equal(understand.completionRule, 'all-required');
  assert.deepEqual(
    microtasks.map(task => task.microtaskId),
    Array.from({ length: 9 }, (_, index) => `L49-M${String(index + 1).padStart(2, '0')}`)
  );
  assert.deepEqual(discover.microtasks.map(task => task.microtaskId), ['L49-M01']);
  assert.deepEqual(
    understand.microtasks.map(task => task.microtaskId),
    ['L49-M02', 'L49-M03', 'L49-M04', 'L49-M05', 'L49-M06', 'L49-M07', 'L49-M08', 'L49-M09']
  );

  for (const task of microtasks) {
    assert.equal(task.lessonId, 'lesson49');
    assert.equal(task.required, true);
    assert.ok(task.kind);
    assert.ok(task.exposureRefs.length > 0);
    assert.ok(task.evidenceRefs.length > 0);
    assert.ok(task.contextVariants['breakfast-stall']);
    assert.ok(task.contextVariants['picnic-supply']);
    for (const responseKey of Object.values(task.responseKeyByContext)) {
      assert.match(responseKey.type, /^(single|set|ordered|mapping|composition)$/);
    }
  }

  assert.equal(discover.microtasks[0].checkpointAfterSuccess.buildStage, 1);
  assert.equal(understand.microtasks.at(-1).checkpointAfterSuccess.buildStage, 2);
  assert.ok(understand.microtasks.slice(0, -1).every(task => (
    task.checkpointAfterSuccess.buildStage === undefined
  )));
  assert.deepEqual(understand.microtasks[4].formativeBinding, {
    targetId: 'FLC-U01-T01',
    evidenceMode: 'audio-image-quantity-match'
  });
  assert.equal(understand.microtasks[2].formativeBinding, undefined);
});

test('catalog validation distinguishes required source exposure from verified action coverage', () => {
  const u01 = structuredClone(catalog.getTeachingUnit('FLC-U01'));
  assert.deepEqual(catalog.validate([u01]), []);

  const missingExposure = structuredClone(u01);
  for (const beat of missingExposure.beats) {
    for (const task of beat.microtasks || []) {
      task.exposureRefs = task.exposureRefs.filter(sourceId => sourceId !== 'L49-W01');
    }
  }
  assert.match(
    catalog.validate([missingExposure]).join('\n'),
    /L49-W01.*exposure/i
  );

  const missingEvidence = structuredClone(u01);
  for (const beat of missingEvidence.beats) {
    for (const task of beat.microtasks || []) {
      task.evidenceRefs = task.evidenceRefs.filter(sourceId => sourceId !== 'L49-N04');
    }
  }
  assert.match(
    catalog.validate([missingEvidence]).join('\n'),
    /L49-N04.*evidence/i
  );
});

test('husband remains dialogue vocabulary and is rejected from child classification tasks', () => {
  const u01 = structuredClone(catalog.getTeachingUnit('FLC-U01'));
  const lesson49Tasks = u01.beats.flatMap(beat => beat.microtasks || []);

  assert.ok(lesson49Tasks.some(task => task.exposureRefs.includes('L49-W05')));
  assert.ok(lesson49Tasks.every(task => task.kind !== 'classification'));

  const unsafe = structuredClone(u01);
  unsafe.beats[1].microtasks[0].kind = 'classification';
  unsafe.beats[1].microtasks[0].classificationValues = ['husband', 'meat'];
  assert.match(
    catalog.validate([unsafe]).join('\n'),
    /husband.*classification/i
  );
});

test('Lesson 49 audio sequences resolve only catalog sources and keep the full dialogue order', () => {
  const lesson49 = catalog.getTeachingUnit('FLC-U01').lessonContent.lesson49;
  const full = lesson49.audioSequences['L49-A-FULL-DIALOGUE'];

  assert.deepEqual(
    full.lines.map(line => line.sourceRef),
    Array.from({ length: 11 }, (_, index) => `L49-D${String(index + 1).padStart(2, '0')}`)
  );
  assert.deepEqual(
    full.lines.map(line => line.src),
    full.lines.map(line => lesson49.sources[line.sourceRef].audioSrc)
  );
  assert.ok(Object.values(lesson49.audioSequences).every(sequence => (
    sequence.lines.length > 0
    && sequence.lines.every(line => line.src.startsWith('/lesson49/audio/'))
  )));
  assert.doesNotMatch(JSON.stringify(lesson49.audioSequences), /出版社原声|教材原声/);
});

test('every Lesson 49 microtask owns its complete child presentation in the catalog', () => {
  const unit = catalog.getTeachingUnit('FLC-U01');
  const microtasks = unit.beats.slice(0, 2).flatMap(beat => beat.microtasks);

  assert.deepEqual(microtasks.map(task => task.presentation.title), [
    '标出订单缺口',
    '唤醒肉铺货架',
    '带着问题听完整对话',
    '第一张订单：要什么肉',
    '喜欢不等于这次购买',
    '数量备货台',
    '接受还是拒绝',
    '还原订单证据链',
    '教材问题延迟回收'
  ]);

  for (const task of microtasks) {
    assert.equal(typeof task.presentation.stepLabel, 'string');
    assert.equal(typeof task.presentation.completedFeedback, 'string');
    for (const [contextId, responseKey] of Object.entries(task.responseKeyByContext)) {
      const context = task.contextVariants[contextId];
      assert.equal(typeof context.eyebrow, 'string');
      assert.equal(typeof context.title, 'string');
      assert.equal(typeof context.copy, 'string');
      assert.equal(typeof context.submitLabel, 'string');
      assert.equal(context.support.length, 3);
      assert.equal(typeof context.assistedPrompt, 'string');
      const expectedFields = responseKey.type === 'composition'
        ? Object.keys(responseKey.fields)
        : (responseKey.type === 'mapping' ? Object.keys(responseKey.entries) : ['response']);
      assert.deepEqual(context.responseFields.map(field => field.fieldId), expectedFields);
      assert.ok(context.responseFields.every(field => (
        field.options?.length >= 2
        || field.rows?.every(row => row.options.length >= 2)
      )));
    }
  }

  assert.ok(microtasks[0].presentation.growth);
  assert.ok(microtasks[8].presentation.growth);
  assert.ok(microtasks.slice(1, 8).every(task => task.presentation.growth === undefined));
});

test('catalog validation rejects broken microtask sequencing, responses, audio, and growth boundaries', () => {
  function message(change) {
    const candidate = structuredClone(catalog.getTeachingUnit('FLC-U01'));
    change(candidate);
    return catalog.validate([candidate]).join('\n');
  }

  assert.match(message(unit => {
    unit.beats[1].microtasks[1].microtaskId = 'L49-M02';
  }), /L49-M02.*duplicated/i);
  assert.match(message(unit => {
    delete unit.beats[1].microtasks[0].responseKeyByContext['picnic-supply'];
  }), /L49-M02.*response.*picnic-supply/i);
  assert.match(message(unit => {
    unit.beats[1].microtasks[0].audioSequenceId = 'L49-A-MISSING';
  }), /L49-M02.*audio sequence/i);
  assert.match(message(unit => {
    unit.beats[1].microtasks[3].checkpointAfterSuccess.buildStage = 2;
  }), /L49-M05.*buildStage.*whole beat/i);
  assert.match(message(unit => {
    unit.beats[1].microtasks[4].formativeBinding.targetId = 'FLC-U01-T99';
  }), /L49-M06.*formative binding/i);
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
      if (unit.publicationScope === 'local-poc') {
        assert.equal(course, undefined);
        continue;
      }
      assert.equal(course.teachingUnitId, unit.unitId);
    }
  }
});
