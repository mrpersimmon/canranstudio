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

test('Lesson 3 and Lesson 4 resolve to one authored but unpublished local candidate', () => {
  const unit = catalog.getTeachingUnit('NCE-U02');

  assert.equal(unit.unitId, 'NCE-U02');
  assert.deepEqual(unit.lessonIds, ['lesson3', 'lesson4']);
  assert.equal(catalog.getTeachingUnitForLesson('lesson3'), unit);
  assert.equal(catalog.getTeachingUnitForLesson('lesson4'), unit);
  assert.equal(unit.status, 'candidate');
  assert.equal(unit.publicationScope, 'local-poc');
  assert.equal(unit.runtimeProfile, 'story-stage-v1');
  assert.deepEqual(unit.beats, []);
  assert.ok(Object.keys(unit.authoredContent).length > 0);
  assert.ok(Object.keys(unit.entities).length > 0);
  assert.equal(unit.landmarkId, undefined);
  assert.equal(unit.title, '5号牌与两把雨伞');
  assert.equal(unit.experienceRevision, 'lesson3-4-v2');
  assert.equal(unit.experience.stages.length, 10);
  assert.equal(unit.voiceBaselineId, 'nce-youth-v1');
  assert.deepEqual(unit.audioReviewContract, {
    packId: 'nce-u02-kokoro-candidate-v1',
    manifestPath: '/poc/lesson3-4-experience/audio/manifest.json',
    canonicalAudioSetSha256: 'c5738057a5857bb8c44a6d7b4bbeffbaa411683942ba10ae6bf7f31984da580f',
    voiceBaselineId: 'nce-youth-v1',
    dialogueRenderMode: 'natural-utterance',
    standaloneWordRenderMode: 'context-cropped-lexeme-v1',
    decodedOnsetLimitMs: 150,
    publicationGate: 'human-language-review-per-file',
    nonAcceptedStatus: 'unreviewed-candidate',
    expectedAudioSourceCount: 42
  });
  assert.deepEqual(unit.curriculumContract.acceptedDecisionRefs, [
    'PA-01-A', 'PA-02-A', 'PA-03-A', 'PA-04-A'
  ]);
  assert.deepEqual(unit.curriculumContract.sourceRegister, {
    sourceRegisterId: 'BOOK1-2022-07',
    title: '外研社《新概念英语智慧版 1：英语初阶 First Things First》',
    edition: '2022 年 7 月第 1 版第 1 次印刷',
    isbn: '978-7-5213-3670-2',
    snapshotSha256: 'a54740bdce7423b98ea30334dca9043603ef5533f85e64f86f5af6d31d93be9f',
    totalPdfPages: 330,
    lessonPageMap: {
      lesson3: { pdfPages: [39, 40], textbookPages: [6, 7] },
      lesson4: { pdfPages: [41, 42], textbookPages: [8, 9] }
    }
  });
  assert.equal(
    unit.curriculumContract.audioAuditStatus,
    'candidate-generated-awaiting-human-review'
  );
  assert.deepEqual(unit.curriculumContract.audioSourceAudit, {
    checkedOn: '2026-08-31',
    result: 'no-auditable-official-audio',
    checkedSurfaces: [
      'controlled-pdf-embedded-files',
      'controlled-pdf-page-annotations-39-42',
      'repository-audio-assets',
      'local-download-audio-assets'
    ],
    officialAccessModel: 'book-specific-activation-in-fltrp-u-learning-app',
    officialReferenceId: 'FLTRP-2023-JCJYJXZY-P58'
  });
  assert.deepEqual(unit.curriculumContract.audioCandidatePack, {
    packId: 'nce-u02-kokoro-candidate-v1',
    generationBasis: 'nce-u01-kokoro-candidate-v3',
    status: 'local-poc-candidate-unreviewed',
    disclosure: 'ai-generated-not-official-textbook-audio'
  });
  assert.equal(unit.curriculumContract.speakerMappingStatus, 'frozen-course-role-mapping');
  assert.equal(
    unit.curriculumContract.speakerMappingBasis,
    'textbook-dialogue-semantics-and-figure-sequence'
  );
  assert.equal(unit.curriculumContract.storyDesignStatus, 'authored-local-candidate');
  assert.equal(unit.curriculumContract.pageImplementationStatus, 'authored-local-candidate');
  assert.equal(unit.curriculumContract.publicationAllowed, false);
});

test('Lesson 3–4 freezes the accepted source inventory and inherited candidate voice mapping', () => {
  const unit = catalog.getTeachingUnit('NCE-U02');
  const lesson3 = unit.lessonContent.lesson3;
  const lesson4 = unit.lessonContent.lesson4;
  const ids = (prefix, count) => Array.from(
    { length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, '0')}`
  );

  assert.deepEqual(Object.keys(lesson3.sources), [
    'L03-I01', 'L03-Q01',
    ...ids('L03-D', 12), ...ids('L03-W', 10), ...ids('L03-N', 4), ...ids('L03-Z', 12)
  ]);
  assert.deepEqual(Object.keys(lesson4.sources), [
    'L04-I01', ...ids('L04-P', 15), ...ids('L04-W', 5), 'L04-E01', 'L04-E02'
  ]);
  assert.deepEqual(
    ids('L03-D', 12).map(sourceId => lesson3.sources[sourceId].text),
    [
      'My coat and my umbrella please.', 'Here is my ticket.', 'Thank you, sir.',
      'Number five.', "Here's your umbrella and your coat.", 'This is not my umbrella.',
      'Sorry, sir.', 'Is this your umbrella?', "No, it isn't.", 'Is this it?',
      'Yes, it is.', 'Thank you very much.'
    ]
  );
  assert.deepEqual(
    ids('L03-D', 12).map(sourceId => lesson3.sources[sourceId].figureGroup),
    [1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 7]
  );
  assert.deepEqual(
    ids('L03-D', 12).map(sourceId => {
      const source = lesson3.sources[sourceId];
      return [source.speakerRole, source.speaker, source.voiceId];
    }),
    [
      ['visitor', 'man', 'am_michael'],
      ['visitor', 'man', 'am_michael'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['visitor', 'man', 'am_michael'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['visitor', 'man', 'am_michael'],
      ['cloakroom-attendant', 'woman', 'af_heart'],
      ['visitor', 'man', 'am_michael'],
      ['visitor', 'man', 'am_michael']
    ]
  );
  assert.deepEqual(
    ids('L04-P', 15).map(sourceId => lesson4.sources[sourceId].text),
    [
      'Is this your pen?', 'Is this your pencil?', 'Is this your book?',
      'Is this your watch?', 'Is this your coat?', 'Is this your dress?',
      'Is this your skirt?', 'Is this your shirt?', 'Is this your car?',
      'Is this your house?', 'Is this your suit?', 'Is this your school?',
      'Is this your teacher?', 'Is this your son?', 'Is this your daughter?'
    ]
  );
  assert.deepEqual(
    ids('L04-P', 10).map(sourceId => lesson4.sources[sourceId].vocabularySourceRef),
    ids('L02-W', 10)
  );
  assert.deepEqual(
    ids('L04-P', 15).slice(10).map(sourceId => lesson4.sources[sourceId].vocabularySourceRef),
    ids('L04-W', 5)
  );
  assert.deepEqual(lesson4.sources['L04-E01'].reusedSourceRefs, [
    'L03-D06', 'L03-D07', 'L03-D08', 'L03-D09'
  ]);
  assert.deepEqual(lesson4.sources['L04-E02'].reusedSourceRefs, ids('L04-P', 10));
  assert.equal(lesson4.sources['L04-E01'].requiredForUnitCompletion, false);
  assert.equal(lesson4.sources['L04-E02'].producesLearningEvidence, false);

  const audioSources = [
    ...ids('L03-D', 12), ...ids('L03-W', 10),
    ...ids('L04-P', 15), ...ids('L04-W', 5)
  ];
  assert.equal(audioSources.length, 42);
  for (const sourceId of audioSources) {
    const source = lesson3.sources[sourceId] || lesson4.sources[sourceId];
    assert.equal(
      source.audioSrc,
      `/poc/lesson3-4-experience/audio/${sourceId.toLowerCase()}.mp3`
    );
    assert.equal(source.audioReviewStatus, 'unreviewed-candidate');
    const isWord = source.sourceKind === 'vocabulary';
    if (isWord) assert.equal(source.voiceId, 'af_heart');
    if (source.sourceKind === 'substitution-prompt') {
      assert.equal(source.voiceId, 'am_michael');
    }
    assert.equal(
      source.audioRenderMode,
      isWord ? 'context-cropped-lexeme-v1' : 'natural-utterance'
    );
  }

  for (const lesson of [lesson3, lesson4]) {
    const required = new Set(lesson.requiredSourceIds);
    for (const sourceItem of Object.values(lesson.sources)) {
      assert.equal(sourceItem.audioSequences, undefined);
      if (!audioSources.includes(sourceItem.sourceId)) {
        assert.equal(sourceItem.audioSrc, undefined);
        assert.equal(sourceItem.speaker, undefined);
        assert.equal(sourceItem.voiceId, undefined);
      }
      assert.equal(
        required.has(sourceItem.sourceId),
        ['exposure', 'evidence'].includes(sourceItem.coveragePolicy),
        sourceItem.sourceId
      );
    }
  }
});

test('Lesson 3–4 freezes seven tiered targets and the accepted grouped coverage matrix', () => {
  const unit = catalog.getTeachingUnit('NCE-U02');
  const allSourceIds = Object.values(unit.lessonContent)
    .flatMap(lesson => Object.keys(lesson.sources));
  const coveredSourceIds = unit.sourceTargetCoverage.flatMap(row => row.sourceRefs);

  assert.deepEqual(
    unit.targets.map(target => ({
      targetId: target.targetId,
      tier: target.tier,
      evidenceMode: target.evidenceModes[0],
      structureRefs: target.structureRefs
    })),
    [
      { targetId: 'NCE-U02-T01', tier: 'core', evidenceMode: 'dialogue-sequence-comprehension', structureRefs: [] },
      { targetId: 'NCE-U02-T02', tier: 'core', evidenceMode: 'ownership-polarity-exchange', structureRefs: ['GS-OWNERSHIP-QUESTION-SG', 'GS-BE-SHORT-ANSWER-SG'] },
      { targetId: 'NCE-U02-T03', tier: 'core', evidenceMode: 'possessor-relation-contrast', structureRefs: ['GS-POSSESSIVE-DETERMINER', 'GS-BE-NEGATIVE-SG'] },
      { targetId: 'NCE-U02-T04', tier: 'support-communication', evidenceMode: 'request-and-handover-use', structureRefs: ['GS-REQUEST-HANDOVER', 'GS-HERE-PRESENTATION'] },
      { targetId: 'NCE-U02-T05', tier: 'core', evidenceMode: 'anaphora-resolution', structureRefs: ['GS-PRONOUN-IT-REFERENCE'] },
      { targetId: 'NCE-U02-T06', tier: 'support-communication', evidenceMode: 'social-repair-and-thanks', structureRefs: ['GS-POLITE-REPAIR'] },
      { targetId: 'NCE-U02-T07', tier: 'lexical-sample', evidenceMode: 'lexical-form-meaning-association', structureRefs: [] }
    ]
  );
  assert.ok(unit.targets.every(target => (
    JSON.stringify(target.contextIds) === JSON.stringify(['cloakroom-story', 'counter-transfer'])
  )));
  assert.ok(unit.targets.every(target => target.firstSessionBoundary.length > 0));
  assert.deepEqual(unit.targets.find(target => target.targetId === 'NCE-U02-T05').inheritedSourceRefs, [
    'L01-W09'
  ]);
  assert.equal(new Set(coveredSourceIds).size, coveredSourceIds.length);
  assert.deepEqual([...coveredSourceIds].sort(), [...allSourceIds].sort());

  const optionalRow = unit.sourceTargetCoverage.find(row => row.sourceRefs.includes('L04-E01'));
  assert.deepEqual(optionalRow.coverage, {
    'NCE-U02-T02': 'optional',
    'NCE-U02-T03': 'optional',
    'NCE-U02-T06': 'optional'
  });
  const translationRow = unit.sourceTargetCoverage.find(row => row.sourceRefs.includes('L03-Z01'));
  assert.deepEqual(translationRow.coverage, {});
  const ownershipRow = unit.sourceTargetCoverage.find(row => row.sourceRefs.includes('L04-P01'));
  assert.deepEqual(ownershipRow.coverage, {
    'NCE-U02-T02': 'eligible-evidence',
    'NCE-U02-T03': 'eligible-evidence',
    'NCE-U02-T07': 'eligible-evidence'
  });
});

test('Lesson 3–4 freezes a small representative first-session evidence plan', () => {
  const unit = catalog.getTeachingUnit('NCE-U02');
  const plan = unit.firstSessionEvidencePlan;
  const sourceById = new Map(Object.values(unit.lessonContent)
    .flatMap(lesson => Object.entries(lesson.sources)));

  assert.equal(plan.policyId, 'first-session-representative-retrieval-v1');
  assert.equal(plan.sourceContactPolicy, 'all-required-sources-before-unit-completion');
  assert.deepEqual(plan.promptEvidenceSourceRefs, ['L04-P04', 'L04-P11', 'L04-P15']);
  assert.deepEqual(plan.lexicalEvidenceSourceRefs, [
    'L03-W01', 'L03-W10', 'L04-W01', 'L04-W05'
  ]);
  assert.deepEqual(
    plan.evidenceSlots.map(slot => ({
      slotId: slot.slotId,
      targetIds: slot.targetBindings.map(binding => binding.targetId),
      retrievalOpportunityQuota: slot.retrievalOpportunityQuota
    })),
    [
      { slotId: 'NCE-U02-E01', targetIds: ['NCE-U02-T01'], retrievalOpportunityQuota: 1 },
      { slotId: 'NCE-U02-E02', targetIds: ['NCE-U02-T02', 'NCE-U02-T03'], retrievalOpportunityQuota: 2 },
      { slotId: 'NCE-U02-E03', targetIds: ['NCE-U02-T04', 'NCE-U02-T06'], retrievalOpportunityQuota: 1 },
      { slotId: 'NCE-U02-E04', targetIds: ['NCE-U02-T05'], retrievalOpportunityQuota: 1 },
      { slotId: 'NCE-U02-E05', targetIds: ['NCE-U02-T07'], retrievalOpportunityQuota: 4 }
    ]
  );
  assert.equal(
    plan.evidenceSlots.reduce((sum, slot) => sum + slot.retrievalOpportunityQuota, 0),
    9
  );
  assert.equal(plan.evidenceSlots.find(slot => slot.slotId === 'NCE-U02-E04')
    .requiresAuthoredTransfer, true);

  for (const sourceRef of [
    ...plan.promptEvidenceSourceRefs,
    ...plan.lexicalEvidenceSourceRefs
  ]) {
    assert.equal(sourceById.get(sourceRef).sourceRole, 'target', sourceRef);
    assert.equal(sourceById.get(sourceRef).coveragePolicy, 'evidence', sourceRef);
  }
  assert.equal(sourceById.get('L04-P01').coveragePolicy, 'exposure');
  assert.equal(sourceById.get('L04-P14').coveragePolicy, 'exposure');
  assert.equal(sourceById.get('L03-W02').coveragePolicy, 'exposure');
  assert.equal(sourceById.get('L03-W05').sourceRole, 'target');
  assert.equal(sourceById.get('L03-W05').coveragePolicy, 'exposure');
  assert.equal(sourceById.get('L04-W04').coveragePolicy, 'exposure');
});

test('Lesson 3–4 keeps accepted curriculum, candidate audio, authored POC, and publication gates separate', () => {
  function message(change) {
    const unit = structuredClone(catalog.getTeachingUnit('NCE-U02'));
    change(unit);
    return catalog.validate([unit]).join('\n');
  }

  assert.deepEqual(catalog.validate([structuredClone(catalog.getTeachingUnit('NCE-U02'))]), []);
  assert.match(message(unit => { unit.publicationScope = 'course-catalog'; }), /story-stage local candidate/i);
  assert.match(message(unit => { unit.runtimeProfile = 'microtask-v2'; }), /story-stage local candidate/i);
  assert.match(message(unit => { unit.beats.push({ beatId: 'discover' }); }), /cannot declare legacy beats/i);
  assert.match(message(unit => { unit.experience.stages.pop(); }), /ten-stage contract/i);
  assert.match(message(unit => { unit.lessonContent.lesson3.sources['L03-D01'].audioSrc = '/fake.mp3'; }), /preserve the inherited candidate audio mapping/i);
  assert.match(message(unit => { unit.lessonContent.lesson3.sources['L03-D01'].voiceId = 'different-voice'; }), /preserve the inherited candidate audio mapping/i);
  assert.match(message(unit => { unit.lessonContent.lesson3.sources['L03-D01'].speakerRole = 'invented-role'; }), /frozen course speaker role/i);
  assert.match(message(unit => { unit.audioReviewContract.canonicalAudioSetSha256 = 'drifted'; }), /preserve the inherited voice review contract/i);
  assert.match(message(unit => { unit.lessonContent.lesson3.sources['L03-D01'].audioSequence = []; }), /cannot declare audioSequence/i);
  assert.match(message(unit => { unit.targets[0].contextIds = ['invented-scene']; }), /at least two authored contexts/i);
  assert.match(message(unit => { unit.targets[0].primarySourceRefs[0] = 'L03-D99'; }), /unknown primary source L03-D99/i);
  assert.match(message(unit => { unit.sourceTargetCoverage[0].coverage['NCE-U02-T99'] = 'support'; }), /unknown target NCE-U02-T99/i);
  assert.match(message(unit => { unit.sourceTargetCoverage[0].sourceRefs.pop(); }), /coverage matrix omits source L03-Q01/i);
  assert.match(message(unit => { unit.lessonContent.lesson4.requiredSourceIds.push('L04-E01'); }), /optional or omitted source cannot be required/i);
  assert.match(message(unit => { unit.firstSessionEvidencePlan.promptEvidenceSourceRefs.push('L04-P01'); }), /prompt evidence policy must match/i);
  assert.match(message(unit => { unit.firstSessionEvidencePlan.evidenceSlots[0].targetBindings[0].evidenceMode = 'invented-mode'; }), /evidence mode is outside/i);
  assert.match(message(unit => { unit.firstSessionEvidencePlan.evidenceSlots[0].answerId = 'revealed-answer'; }), /cannot author runtime field answerId/i);
  assert.match(message(unit => { unit.firstSessionEvidencePlan.evidenceSlots[0].retrievalOpportunityQuota = 0; }), /positive retrieval opportunity quota/i);
  assert.match(message(unit => { unit.curriculumContract.audioSourceAudit.result = 'audited'; }), /official-audio source audit/i);
  assert.match(message(unit => { unit.curriculumContract.audioAuditStatus = 'not-audited'; }), /unpublished local gate/i);
  assert.match(message(unit => { unit.curriculumContract.publicationAllowed = true; }), /unpublished local gate/i);
});

test('Lesson 1–2 V2 exposes the exact seventeen child-visible resume stages', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);

  assert.deepEqual({
    experienceRevision: unit.experienceRevision,
    progressDenominator: unit.experience.progressDenominator,
    microtaskIds: microtasks.map(task => task.microtaskId)
  }, {
    experienceRevision: 'lesson1-2-v2.6',
    progressDenominator: 17,
    microtaskIds: [
      'L01-M07', 'L01-M08', 'L01-M09', 'L01-M10', 'L01-M11', 'L01-M12',
      'L02-M11', 'L02-M12', 'L02-M13', 'L02-M14', 'L02-M15',
      'L02-M16', 'L02-M17', 'L02-M18', 'L02-M19', 'L02-M20', 'L02-M21'
    ]
  });
});

test('Lesson 1 includes one skippable full-dialogue role stage and unlocks replay only after completion', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const taskById = new Map(tasks.map(task => [task.microtaskId, task]));
  const dialogueRefs = Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`);

  assert.equal(unit.experienceRevision, 'lesson1-2-v2.6');
  assert.equal(unit.experience.progressDenominator, 17);
  assert.equal(tasks.length, 17);
  assert.deepEqual(
    tasks.filter(task => task.lessonId === 'lesson1').map(task => task.microtaskId),
    ['L01-M07', 'L01-M08', 'L01-M09', 'L01-M10', 'L01-M11', 'L01-M12']
  );
  assert.equal(taskById.get('L01-M11').restStop, undefined);

  const roleTask = taskById.get('L01-M12');
  assert.ok(roleTask);
  assert.deepEqual(roleTask.targetResults, []);
  assert.equal(roleTask.growthBoundary, 'none');
  assert.deepEqual(roleTask.restStop, {
    restStopId: 'lesson1-chapter-stop', type: 'chapter', nextMicrotaskId: 'L02-M11'
  });
  assert.deepEqual(roleTask.exposureRefs, dialogueRefs);
  assert.deepEqual(roleTask.presentation.characterEntityIds, ['station-keeper', 'handbag-owner']);
  assert.deepEqual(roleTask.presentation.sceneEntityIds, ['handbag']);

  const step = roleTask.steps[0];
  assert.equal(step.kind, 'role-enactment');
  assert.equal(step.submissionMode, 'required-practice');
  assert.equal(step.affectsAdventureHearts, false);
  assert.equal(step.practice.practiceId, 'L01-M12:role-enactment');
  assert.equal(step.practice.kind, 'role-enactment');
  assert.deepEqual(step.practice.castOrder, ['station-keeper', 'handbag-owner']);
  assert.deepEqual(step.practice.propEntityIds, ['handbag']);
  assert.equal(step.practice.rounds.length, 2);
  for (const round of step.practice.rounds) {
    assert.deepEqual(round.dialogueTurnRefs, dialogueRefs);
    assert.equal(round.hiddenTurnRefs.length + round.partnerTurnRefs.length, 7);
    assert.deepEqual(
      [...round.hiddenTurnRefs, ...round.partnerTurnRefs].sort(),
      [...dialogueRefs].sort()
    );
  }

  const manual = unit.experience.outcomePractices.find(practice => (
    practice.practiceId === 'L01-RS01:manual-dialogue'
  ));
  assert.ok(manual);
  assert.equal(manual.kind, 'manual-dialogue');
  assert.equal(manual.unlockAfterStageId, 'L01-M12');
  assert.deepEqual(manual.dialogueTurnRefs, dialogueRefs);
  assert.deepEqual(manual.castOrder, ['station-keeper', 'handbag-owner']);
  assert.deepEqual(manual.propEntityIds, ['handbag']);
  assert.deepEqual(manual.turnHints.map(hint => hint.turnRef), dialogueRefs);
  assert.ok(manual.turnHints.every(hint => hint.intent && hint.openingChunk));
  assert.equal(manual.countsTowardProgress, false);
  assert.equal(manual.producesLearningEvidence, false);
  assert.equal(manual.affectsAdventureHearts, false);
});

test('Lesson 1 role play owns truthful role-round dispositions and direct interface copy', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const roleTask = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === 'L01-M12');

  assert.equal(roleTask.navigationTitle, '角色扮演');
  assert.equal(roleTask.presentation.title, '角色扮演');
  const practice = roleTask.steps[0].practice;
  assert.equal(practice.title, '选择你想扮演的角色');
  assert.equal(practice.intro, '');
  assert.deepEqual(practice.rounds.map(round => round.title), [
    '你来当招领员', '你来当女顾客'
  ]);
  assert.deepEqual(practice.rounds.map(round => round.roleBadge), ['招领员', '女顾客']);
  assert.equal(practice.hintLabel, '提示');
  assert.equal(practice.nextHintLabel, '再提示');
  assert.deepEqual(practice.turnHints.map(hint => hint.turnRef),
    Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`));
  assert.doesNotMatch(JSON.stringify(practice), /选择你先扮演的角色|完整演完七句，再换另一个角色/);
  assert.deepEqual(roleTask.skipPolicy, {
    kind: 'role-round-child-confirmed',
    preservesPartialProgress: true,
    countsAsResolved: true,
    producesLearningEvidence: false,
    unlocksOutcomePractice: false
  });
  assert.deepEqual(unit.experience.uiCopy.roleSkip, {
    actionLabel: '跳过这个角色',
    dialogTitle: '跳过这个角色？',
    dialogCopy: '',
    cancelLabel: '继续扮演',
    confirmLabel: '跳过这个角色',
    saveFailed: '没有保存成功',
    retryLabel: '再试一次'
  });
  assert.equal(unit.experience.uiCopy.knowledge.collapseLabel, '收起');
});

test('stage eleven assembles Is this your watch question mark from five selectable tokens', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(item => item.microtaskId === 'L02-M15');
  const step = task.steps.find(item => item.stepId === 'L02-M15:S01');
  const challenge = step.challenges[0];
  const expected = [
    'NCE-U01-C-BLOCK-IS-CAPITAL', 'NCE-U01-C-BLOCK-THIS',
    'NCE-U01-C-BLOCK-YOUR', 'NCE-U01-C-BLOCK-WATCH',
    'NCE-U01-C-PUNCT-QUESTION'
  ];

  assert.deepEqual(step.blockContentRefs, expected);
  assert.deepEqual(step.answerRule.acceptedOrder, expected);
  assert.deepEqual(challenge.candidateContentRefs, expected);
  assert.deepEqual(challenge.answerRule.acceptedOrder, expected);
  assert.equal(step.shuffleConstraint, 'not-accepted-order');
  assert.equal(challenge.shuffleConstraint, 'not-accepted-order');
  assert.equal(step.allowReset, true);
  assert.deepEqual(challenge.boundaryContentRefs, [expected[0], expected[4]]);
  assert.deepEqual(challenge.supportLayers.map(layer => layer.copy), [
    '问句从 Is 开始，问号放最后。',
    '先找出 Is 和问号，中间的单词由你继续排列。',
    '小猫换成 book 示范：Is this your book?'
  ]);
  assert.equal(task.presentation.moments.find(moment => (
    moment.momentId === 'watch-question-build'
  )).visibleLanguageRefs.length, 5);
});

test('Lesson 1–2 V2 uses only the five frozen scene families and explicit viewport policy', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const presentations = microtasks.map(task => task.presentation);

  assert.deepEqual([...new Set(presentations.map(item => item.sceneMode))].sort(), [
    'dialogue-stage', 'grammar-lab', 'object-workbench', 'story-journey'
  ]);
  assert.deepEqual(
    Object.fromEntries(microtasks.map(task => [task.microtaskId, task.presentation.sceneMode])),
    {
      'L01-M07': 'dialogue-stage', 'L01-M08': 'dialogue-stage',
      'L01-M09': 'dialogue-stage', 'L01-M10': 'dialogue-stage',
      'L01-M11': 'dialogue-stage', 'L01-M12': 'dialogue-stage',
      'L02-M11': 'object-workbench',
      'L02-M12': 'object-workbench', 'L02-M13': 'object-workbench',
      'L02-M14': 'object-workbench', 'L02-M15': 'grammar-lab',
      'L02-M16': 'object-workbench', 'L02-M17': 'object-workbench',
      'L02-M18': 'object-workbench', 'L02-M19': 'object-workbench',
      'L02-M20': 'story-journey', 'L02-M21': 'story-journey'
    }
  );
  assert.ok(presentations.every(item => item.sceneVariant && item.visualMoment));
  assert.ok(presentations.every(item => Array.isArray(item.moments) && item.moments.length > 0));
  assert.ok(presentations.every(item => item.viewportPolicy === 'single-viewport-responsive'));
  assert.ok(presentations.every(item => (
    item.scrollPolicy.horizontal === 'forbidden'
    && item.scrollPolicy.nestedCard === 'forbidden'
    && item.scrollPolicy.vertical === 'viewport-fallback-only'
  )));
  assert.deepEqual(unit.experience.scrollPolicy, {
    horizontal: 'forbidden', nestedCard: 'forbidden', vertical: 'viewport-fallback-only'
  });
});

test('Lesson 1–2 V2 distinguishes shared listen-and-answer gates from independent listening scenes', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const steps = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps || [])
    .map(step => [step.stepId, step]));
  const sharedStepIds = [
    'L01-M08:S02',
    'L02-M11:S01', 'L02-M12:S01', 'L02-M15:S03',
    'L02-M16:S01', 'L02-M17:S01', 'L02-M20:S01'
  ];
  const independentStepIds = ['L01-M07:S01', 'L01-M11:S01', 'L02-M19:S02'];

  assert.deepEqual(
    sharedStepIds.map(stepId => [stepId, steps.get(stepId)?.audioResponsePresentation]),
    sharedStepIds.map(stepId => [stepId, 'shared-locked-until-ended'])
  );
  assert.deepEqual(
    independentStepIds.map(stepId => [stepId, steps.get(stepId)?.audioResponsePresentation]),
    independentStepIds.map(stepId => [stepId, 'independent-listen'])
  );
  assert.ok(sharedStepIds.every(stepId => {
    const candidate = steps.get(stepId);
    return candidate?.audioSequence
      || candidate?.challenges?.every(challenge => challenge.audioSequence);
  }));
  assert.equal(steps.has('L02-M15:S02'), false);
});

test('Lesson 1–2 V2 gives every story prop one catalog-owned physical surface', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const allowedSurfaces = new Set([
    'counter-surface', 'workbench-surface', 'coat-rack', 'story-counter'
  ]);
  const propTasks = tasks.filter(task => task.presentation.sceneEntityIds.length > 0);

  assert.ok(propTasks.length > 0);
  assert.ok(propTasks.every(task => allowedSurfaces.has(task.presentation.propSurface)));
  assert.equal(
    tasks.find(task => task.microtaskId === 'L02-M15').presentation.propSurface,
    'counter-surface'
  );

  const manual = unit.experience.outcomePractices.find(practice => (
    practice.practiceId === 'L01-RS01:manual-dialogue'
  ));
  assert.deepEqual({
    sceneMode: manual.sceneMode,
    sceneVariant: manual.sceneVariant,
    propSurface: manual.propSurface,
    returnMainlineLabel: manual.returnMainlineLabel
  }, {
    sceneMode: 'dialogue-stage',
    sceneVariant: 'full-role-enactment',
    propSurface: 'counter-surface',
    returnMainlineLabel: '继续主线'
  });
});

test('Lesson 1–2 V2 authors the exact ordered presentation moments from the accepted storyboard', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const expectedMomentIds = {
    'L01-M07': ['story-briefing', 'seven-line-listen', 'listen-complete'],
    'L01-M08': ['owner-recall', 'handbag-audio-find', 'pending-return'],
    'L01-M09': ['attention-intent', 'call-and-reply'],
    'L01-M10': ['counter-to-tracks', 'handbag-question-build', 'repair-choice', 'question-replay'],
    'L01-M11': ['owner-confirm', 'handbag-return-label', 'thanks-choice', 'single-handoff'],
    'L01-M12': ['full-role-enactment'],
    'L02-M11': ['tray-intro', 'pen-audio-find', 'pen-settle', 'pencil-audio-find', 'pencil-settle'],
    'L02-M12': ['book-audio-find', 'book-settle', 'watch-audio-find', 'watch-settle', 'tray-complete'],
    'L02-M13': ['pen-word-label', 'pen-pronunciation', 'pencil-word-label', 'pencil-pronunciation'],
    'L02-M14': ['book-word-label', 'book-pronunciation', 'watch-word-label', 'watch-pronunciation', 'checklist-complete'],
    'L02-M15': ['story-to-lab', 'handbag-pattern-demo', 'watch-question-build', 'question-playback', 'it-reference', 'knowledge-layer'],
    'L02-M16': ['rack-intro', 'coat-audio-find', 'coat-hang', 'dress-audio-find', 'dress-hang'],
    'L02-M17': ['skirt-audio-find', 'skirt-hang', 'shirt-audio-find', 'shirt-hang', 'rack-unlabelled'],
    'L02-M18': ['coat-word-label', 'coat-pronunciation', 'dress-word-label', 'dress-pronunciation'],
    'L02-M19': ['skirt-word-label', 'skirt-pronunciation', 'shirt-word-label', 'shirt-pronunciation', 'coat-return-dialogue', 'coat-handoff'],
    'L02-M20': ['car-street-find', 'car-scene-confirmed', 'house-street-find', 'house-scene-confirmed'],
    'L02-M21': ['car-word-label', 'car-pronunciation', 'owner-boards-car', 'house-word-label', 'house-pronunciation', 'car-arrives-home', 'save-readback']
  };
  const knownLanguageRefs = new Set([
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.keys(lesson.sources || {})),
    ...Object.keys(unit.authoredContent)
  ]);
  const knownEntityIds = new Set(Object.keys(unit.entities));

  assert.deepEqual(
    Object.fromEntries(microtasks.map(task => [
      task.microtaskId,
      task.presentation.moments.map(moment => moment.momentId)
    ])),
    expectedMomentIds
  );

  for (const task of microtasks) {
    for (const moment of task.presentation.moments) {
      assert.equal(typeof moment.momentId, 'string');
      assert.ok(moment.momentId.length > 0);
      assert.equal(typeof moment.enterWhen?.kind, 'string');
      assert.ok(Array.isArray(moment.participantEntityIds));
      assert.ok(Array.isArray(moment.focusEntityIds));
      assert.ok(Array.isArray(moment.visibleLanguageRefs));
      assert.equal(typeof moment.endState?.stateId, 'string');
      assert.equal(typeof moment.primaryMotion?.kind, 'string');
      assert.equal(moment.reducedMotionEndState?.stateId, moment.endState.stateId);
      assert.ok(moment.participantEntityIds.every(entityId => knownEntityIds.has(entityId)));
      assert.ok(moment.focusEntityIds.every(entityId => knownEntityIds.has(entityId)));
      assert.ok(moment.visibleLanguageRefs.every(ref => knownLanguageRefs.has(ref)));
    }
  }
});

test('Lesson 1 spaces handbag sound and word retrieval across different story actions', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const challengesFor = microtaskId => microtasks.get(microtaskId).steps
    .flatMap(step => step.challenges || []);

  const attentionChallenges = challengesFor('L01-M09');
  assert.equal(attentionChallenges.length, 1);
  assert.deepEqual(attentionChallenges.map(challenge => challenge.interactionPattern), [
    'utterance-select'
  ]);
  assert.ok(attentionChallenges.every(challenge => (
    !challenge.interactionSemantics.sourceRefs.includes('L01-W07')
  )));
  assert.deepEqual(
    microtasks.get('L01-M09').presentation.moments.map(moment => moment.momentId),
    ['attention-intent', 'call-and-reply']
  );

  const returnChallenges = challengesFor('L01-M11');
  assert.equal(returnChallenges.length, 2);
  assert.equal(returnChallenges[0].interactionPattern, 'label-connect');
  assert.deepEqual(returnChallenges[0].interactionSemantics.sourceRefs, ['L01-W07']);
  assert.equal(returnChallenges[0].interactionSemantics.targetId, 'handbag:english-label');
  assert.equal(returnChallenges[1].interactionPattern, 'utterance-select');
  assert.deepEqual(
    microtasks.get('L01-M11').presentation.moments.map(moment => moment.momentId),
    [
      'owner-confirm', 'handbag-return-label', 'thanks-choice', 'single-handoff'
    ]
  );

  const allChallenges = [...microtasks.values()].flatMap(task => challengesFor(task.microtaskId));
  const allResults = [...microtasks.values()].flatMap(task => task.targetResults || []);
  assert.equal(allChallenges.length, 29);
  assert.equal(allResults.length, 29);
});

test('Lesson 1 counter conversation keeps one continuous scene through stages 2 to 6', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));

  assert.deepEqual(
    ['L01-M08', 'L01-M09', 'L01-M10', 'L01-M11', 'L01-M12']
      .map(microtaskId => microtasks.get(microtaskId).presentation.sceneMode),
    Array(5).fill('dialogue-stage')
  );
});

test('Lesson 1–2 V2 keeps actors in stable slots and shows only characters with a story duty', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const expectedCastByTask = new Map([
    ...['L01-M07', 'L01-M08', 'L01-M09', 'L01-M10', 'L01-M11', 'L01-M12']
      .map(microtaskId => [microtaskId, ['station-keeper', 'handbag-owner']]),
    ...['L02-M11', 'L02-M12', 'L02-M13', 'L02-M14', 'L02-M16', 'L02-M17', 'L02-M18', 'L02-M20']
      .map(microtaskId => [microtaskId, []]),
    ['L02-M15', ['station-keeper', 'handbag-owner']],
    ['L02-M19', ['station-keeper', 'handbag-owner']],
    ['L02-M21', ['handbag-owner']]
  ]);

  for (const task of microtasks) {
    for (const moment of task.presentation.moments) {
      assert.ok(moment.participantEntityIds.every(entityId => (
        task.presentation.characterEntityIds.includes(entityId)
      )), `${task.microtaskId}:${moment.momentId} uses an actor outside the stable stage cast`);
    }
  }
  for (const task of microtasks) {
    assert.deepEqual(
      task.presentation.characterEntityIds,
      expectedCastByTask.get(task.microtaskId),
      `${task.microtaskId} must render only actors with a story duty`
    );
  }
  assert.deepEqual(unit.experience.sceneFrames.actorSlots, {
    'station-keeper': 'left', 'handbag-owner': 'right'
  });
});

test('the first seven-line listen keeps the complete text until the child explicitly continues', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(item => item.microtaskId === 'L01-M07');
  const moment = task.presentation.moments
    .find(item => item.momentId === 'listen-complete');

  assert.equal(moment.advancePolicy, 'explicit-child-continue');
  assert.deepEqual(moment.visibleLanguageRefs, [
    'L01-D01', 'L01-D02', 'L01-D03', 'L01-D04',
    'L01-D05', 'L01-D06', 'L01-D07'
  ]);
  assert.equal(typeof unit.experience.uiCopy.dialogue.completedHint, 'string');
  assert.equal(typeof unit.experience.uiCopy.dialogue.continueLabel, 'string');
  assert.equal(typeof unit.experience.uiCopy.presentation.continueLabel, 'string');
});

test('L02-M15 authors one isolated handbag pattern demonstration without a thirtieth result', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const task = tasks.find(item => item.microtaskId === 'L02-M15');
  const moment = task.presentation.moments.find(item => (
    item.momentId === 'handbag-pattern-demo'
  ));
  const allResults = tasks.flatMap(item => item.targetResults || []);
  const allChallenges = tasks.flatMap(item => item.steps || [])
    .flatMap(step => step.challenges || []);

  assert.deepEqual(moment.demonstration, {
    demonstrationId: 'handbag-pattern-demo',
    kind: 'changed-example-model',
    interactionPattern: 'relation-reconstruct',
    sourceRefs: ['L01-D03', 'L01-W07'],
    modelEntityId: 'handbag',
    relationSlotIds: [
      'ownership-question:opening', 'ownership-question:handbag',
      'ownership-question:punctuation'
    ],
    submissionMode: 'instructional-only',
    producesResult: false,
    affectsAdventureHearts: false,
    producesLearningEvidence: false,
    countsTowardProgress: false
  });
  assert.deepEqual(moment.enterWhen, { kind: 'microtask-start' });
  assert.equal(allResults.length, 29);
  assert.equal(allChallenges.length, 29);
  assert.equal(task.targetResults.length, 2);
  assert.equal(task.steps.flatMap(step => step.challenges || []).length, 2);
  assert.equal(Object.hasOwn(moment.demonstration, 'challengeRef'), false);
  assert.equal(Object.hasOwn(moment.demonstration, 'resultId'), false);
  assert.equal(Object.hasOwn(moment.demonstration, 'reviewCellId'), false);
  assert.equal(Object.hasOwn(moment.demonstration, 'evidenceMode'), false);
});

test('Lesson 1–2 V2 rejects any mainline side effect forged onto handbag-pattern-demo', () => {
  const errorsAfter = mutate => {
    const invalid = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    const task = invalid.beats.flatMap(beat => beat.microtasks || [])
      .find(item => item.microtaskId === 'L02-M15');
    const demonstration = task.presentation.moments
      .find(moment => moment.momentId === 'handbag-pattern-demo').demonstration;
    mutate(demonstration);
    return catalog.validate([invalid]).join('\n');
  };

  assert.match(errorsAfter(demonstration => {
    demonstration.producesResult = true;
  }), /handbag-pattern-demo must not produce a result/i);
  assert.match(errorsAfter(demonstration => {
    demonstration.affectsAdventureHearts = true;
  }), /handbag-pattern-demo must not affect adventure hearts/i);
  assert.match(errorsAfter(demonstration => {
    demonstration.producesLearningEvidence = true;
  }), /handbag-pattern-demo must not produce learning evidence/i);
  assert.match(errorsAfter(demonstration => {
    demonstration.countsTowardProgress = true;
  }), /handbag-pattern-demo must not count toward progress/i);
  assert.match(errorsAfter(demonstration => {
    demonstration.resultId = 'NCE-U01-T04:L02-M15:handbag-demo';
  }), /handbag-pattern-demo cannot declare mainline result or challenge identities/i);
});

test('Lesson 1–2 V2 rejects incomplete, duplicate, dangling, or illegal presentation moments', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const errorsAfter = mutate => {
    const invalid = structuredClone(unit);
    const task = invalid.beats.flatMap(beat => beat.microtasks || [])
      .find(item => item.microtaskId === 'L01-M08');
    mutate(task.presentation.moments, task);
    return catalog.validate([invalid]).join('\n');
  };

  assert.match(errorsAfter(moments => moments.splice(0)), /L01-M08 must author at least one presentation moment/i);
  assert.match(errorsAfter(moments => moments.push(structuredClone(moments[0]))), /L01-M08 presentation moment owner-recall is duplicated/i);
  assert.match(errorsAfter(moments => moments[0].participantEntityIds.push('unknown-participant')), /owner-recall references unknown participant entity unknown-participant/i);
  assert.match(errorsAfter(moments => moments[0].focusEntityIds.push('unknown-focus')), /owner-recall references unknown focus entity unknown-focus/i);
  assert.match(errorsAfter(moments => moments[0].visibleLanguageRefs.push('unknown-language')), /owner-recall references unknown visible language unknown-language/i);
  assert.match(errorsAfter(moments => moments[0].endState.entityStates.push({ entityId: 'unknown-end-state', state: 'ready' })), /owner-recall end state references unknown entity unknown-end-state/i);
  assert.match(errorsAfter(moments => moments[0].primaryMotion.entityIds.push('unknown-motion')), /owner-recall primary motion references unknown entity unknown-motion/i);
  assert.match(errorsAfter(moments => moments[0].reducedMotionEndState.stateId = 'different-end-state'), /owner-recall reduced motion must preserve end state/i);

  assert.match(errorsAfter(moments => moments[0].enterWhen = { kind: 'unknown-condition' }), /owner-recall uses invalid presentation enter condition unknown-condition/i);
  assert.match(errorsAfter(moments => moments[0].enterWhen = { kind: 'step-active', stepId: 'unknown-step' }), /owner-recall references unknown step unknown-step/i);
  assert.match(errorsAfter(moments => moments[0].enterWhen = { kind: 'challenge-active', challengeRef: 'unknown-challenge' }), /owner-recall references unknown challenge unknown-challenge/i);
  assert.match(errorsAfter(moments => moments[0].enterWhen = { kind: 'phase', phase: 'unknown-phase' }), /owner-recall references invalid lifecycle phase unknown-phase/i);
  assert.match(errorsAfter(moments => moments[0].enterWhen = { kind: 'microtask-start', stepId: 'L01-M08:S01' }), /owner-recall microtask-start condition cannot declare selectors/i);
  assert.match(errorsAfter(moments => moments[0].advancePolicy = 'timer-auto'), /owner-recall uses invalid presentation advance policy timer-auto/i);
});

test('the course owns one youth voice baseline for future teaching units', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');

  assert.deepEqual(catalog.getCourseVoiceBaseline('nce-youth-v1'), {
    baselineId: 'nce-youth-v1',
    locale: 'en-US',
    accentTarget: 'General American English',
    youthMaleVoiceId: 'am_michael',
    youthFemaleVoiceId: 'af_heart',
    standaloneWordVoiceId: 'af_heart',
    deviationPolicy: 'explicit-course-exception'
  });
  assert.equal(unit.voiceBaselineId, 'nce-youth-v1');

  const invalid = structuredClone(unit);
  invalid.voiceBaselineId = 'unknown-youth-baseline';
  assert.match(catalog.validate([invalid]).join('\n'), /unknown voice baseline unknown-youth-baseline/i);
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
  const substitutionItems = Object.values(lesson2.sources)
    .filter(item => item.sourceKind === 'substitution-item');
  assert.ok(substitutionItems.every(item => item.sourceRole === 'target'));
  assert.deepEqual(
    substitutionItems.map(item => [item.text, item.coveragePolicy]),
    [
      ['pen', 'evidence'], ['pencil', 'evidence'], ['book', 'evidence'], ['watch', 'evidence'],
      ['coat', 'evidence'], ['dress', 'evidence'], ['skirt', 'evidence'], ['shirt', 'evidence'],
      ['car', 'evidence'], ['house', 'evidence']
    ]
  );
  assert.deepEqual(
    [lesson1.sources['L01-D05'].sourceRole, lesson1.sources['L01-D05'].coveragePolicy],
    ['target', 'exposure']
  );
  assert.deepEqual(
    [lesson1.sources['L01-D07'].speaker, lesson1.sources['L01-D07'].voiceId],
    ['woman', 'af_heart']
  );
  assert.equal(unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.targetResults || [])
    .some(result => result.sourceRef === 'L01-D05'), false);

  assert.deepEqual(lesson2.sources['L02-E01'], {
    sourceId: 'L02-E01',
    sourceKind: 'exercise-mechanism',
    text: 'Copy these sentences.',
    sourceRole: 'context',
    coveragePolicy: 'optional',
    reusedSourceRefs: Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`),
    extensionModes: ['paper-handwriting', 'tablet-handwriting'],
    requiredForUnitCompletion: false,
    producesLearningEvidence: false,
    decisionRef: 'ADR-0098'
  });
  assert.equal(Object.isFrozen(lesson1), true);
  assert.equal(Object.isFrozen(lesson2), true);
});

test('Lesson 1–2 V2 exposes textbook instructions and the comprehension question at their real moments', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));

  assert.deepEqual({
    firstListenInstruction: unit.lessonContent.lesson1.sources['L01-I01'].text,
    ownerQuestion: unit.lessonContent.lesson1.sources['L01-Q01'].text,
    lesson2Instruction: unit.lessonContent.lesson2.sources['L02-I01'].text,
    firstListenContact: tasks.get('L01-M07').sourceContacts.find(contact => contact.sourceRef === 'L01-I01'),
    ownerQuestionContact: tasks.get('L01-M08').sourceContacts.find(contact => contact.sourceRef === 'L01-Q01'),
    lesson2InstructionContact: tasks.get('L02-M11').sourceContacts.find(contact => contact.sourceRef === 'L02-I01')
  }, {
    firstListenInstruction: 'Listen then answer this question.',
    ownerQuestion: 'Whose handbag is it?',
    lesson2Instruction: 'Look, listen and repeat.',
    firstListenContact: { sourceRef: 'L01-I01', contactMode: 'explicit-display' },
    ownerQuestionContact: { sourceRef: 'L01-Q01', contactMode: 'explicit-display' },
    lesson2InstructionContact: { sourceRef: 'L02-I01', contactMode: 'explicit-display' }
  });
});

test('Lesson 1–2 V2 freezes shuffle, review, and full-dual-channel production contracts', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const results = unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.targetResults || []);

  assert.deepEqual(unit.shuffleProtocol, {
    hash: 'fnv1a32-v1',
    prng: 'mulberry32-v1',
    permutation: 'fisher-yates-v1',
    seedDomain: [
      'experienceRevision', 'unitAttemptId', 'microtaskId',
      'attemptRevision', 'channel', 'challengeRef'
    ]
  });
  assert.deepEqual(unit.firstSessionRetrievalPolicy, {
    policyId: 'first-session-full-dual-channel',
    channels: ['audio-form-supported', 'word-form'],
    interleaveRequirement: 'story-state-change-and-independent-reshuffle'
  });
  assert.deepEqual(Object.keys(unit.reviewContexts), [
    'review-schoolbag-check', 'review-morning-coatroom',
    'review-neighbourhood-route', 'review-help-desk-exchange'
  ]);
  assert.ok(results.every(result => unit.reviewContexts[result.reviewContextId]));
  assert.ok(Object.values(unit.reviewContexts).every(context => (
    context.backdropAssetSrc?.startsWith('/poc/lesson1-2-experience/assets/')
    && typeof context.backdropPosition === 'string'
  )));
  assert.equal(unit.experience.uiCopy.interaction.selectExpression, '选合适的英语');
  assert.ok(unit.targets.every(target => Object.keys(unit.reviewContexts)
    .every(contextId => target.contextIds.includes(contextId))));
  assert.deepEqual(Object.keys(unit.experience.reviewRun.copy), [
    'entryKicker', 'entryTitle', 'entryBody', 'startLabel',
    'emptyKicker', 'emptyTitle', 'emptyBody', 'returnLabel',
    'activeKicker', 'progressSeparator', 'itemCountSuffix', 'durationPrefix',
    'completedKicker', 'completedTitle', 'completedBody',
    'deferredKicker', 'deferredTitle', 'deferredBody',
    'rescueTitle', 'rescueBody', 'retryAudioLabel'
  ]);
  assert.equal(unit.experience.reviewRun.copy.entryTitle, '找回昨日线索');
  assert.equal(unit.experience.reviewRun.copy.rescueTitle, '小猫换个场景示范');
  assert.equal(unit.experience.reviewRun.href, '/poc/lesson1-2-review/');
});

test('Lesson 1–2 V2 keeps accepted clothing hashes separate from unreviewed audio candidates', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const lesson2 = unit.lessonContent.lesson2;
  const accepted = Object.fromEntries(['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08']
    .map(sourceRef => [sourceRef, lesson2.sources[sourceRef].acceptedAudioSha256]));

  assert.deepEqual(accepted, {
    'L02-W05': '78aaeced5faf1da980fa52bffecaa54a6f903c8da5d5ceb37a1a199ebfe5d36a',
    'L02-W06': '0b97030065844fb780e7d1a25e0a190da9aefe554fd020f18efd6f4a007793bf',
    'L02-W07': '152519e2a59eaa4d3f4918c994be85d005c92c974bc1e638daf44f916e902534',
    'L02-W08': '189312ec8ff5c13cdfeff053e72559d2e1a4137950eaad5549a3ecab6a2137e2'
  });
  assert.ok(['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08']
    .every(sourceRef => lesson2.sources[sourceRef].audioReviewStatus === 'human-listening-accepted'));
  assert.ok(['L02-W01', 'L02-W02', 'L02-W03', 'L02-W04', 'L02-W09', 'L02-W10']
    .every(sourceRef => lesson2.sources[sourceRef].audioReviewStatus === 'unreviewed-candidate'));
  assert.equal(unit.audioReviewContract.publicationGate, 'human-language-review-per-file');
});

test('every authored Lesson 1–2 audio segment keeps visible English and fail-closed retry metadata', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const steps = unit.beats.flatMap(beat => beat.microtasks || []).flatMap(task => task.steps);
  const challenges = steps.flatMap(step => step.challenges || []);
  const sequences = steps.flatMap(step => [step.audioSequence, step.feedbackAudioSequence])
    .concat(challenges.flatMap(challenge => [challenge.audioSequence, challenge.feedbackAudioSequence]))
    .filter(Boolean);

  assert.ok(sequences.length > 0);
  for (const sequence of sequences) {
    assert.equal(sequence.gate, 'active-request-ended', sequence.sequenceId);
    assert.equal(sequence.failurePolicy, 'fail-closed', sequence.sequenceId);
    assert.deepEqual(sequence.automaticRetryDelaysMs, [250, 750], sequence.sequenceId);
    assert.equal(sequence.maxPlaybackAttempts, 3, sequence.sequenceId);
    assert.ok(sequence.segments.every(segment => (
      typeof segment.text === 'string'
      && segment.text.length > 0
      && segment.audioSrc?.endsWith('.mp3')
    )), sequence.sequenceId);
  }
  assert.ok(challenges.filter(challenge => challenge.channel === 'audio-form-supported')
    .every(challenge => challenge.audioSequence && challenge.targetText));
  assert.ok(challenges.filter(challenge => challenge.channel === 'word-form')
    .every(challenge => challenge.feedbackAudioSequence && challenge.targetText));
});

test('Lesson 1–2 V2 binds twenty-two word cells and seven nonword cells one-to-one', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const microtasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const results = microtasks.flatMap(task => task.targetResults || []);
  const challenges = microtasks.flatMap(task => task.steps || [])
    .flatMap(step => step.challenges || []);
  const wordSources = [
    'L01-W07',
    ...Array.from({ length: 10 }, (_, index) => `L02-W${String(index + 1).padStart(2, '0')}`)
  ];
  const wordCells = results.filter(result => result.targetId === 'NCE-U01-T01');
  const nonwordIds = results.filter(result => result.targetId !== 'NCE-U01-T01')
    .map(result => result.resultId);
  const expectedChallengeRefs = [
    ['L01-M08', 2], ['L01-M09', 1], ['L01-M10', 2], ['L01-M11', 2],
    ['L02-M11', 2], ['L02-M12', 2], ['L02-M13', 2], ['L02-M14', 2], ['L02-M15', 2],
    ['L02-M16', 2], ['L02-M17', 2], ['L02-M18', 2], ['L02-M19', 2],
    ['L02-M20', 2], ['L02-M21', 2]
  ].flatMap(([microtaskId, count]) => Array.from({ length: count }, (_, index) => (
    `${microtaskId}:C${String(index + 1).padStart(2, '0')}`
  )));

  assert.deepEqual({
    wordCells: wordCells.map(result => [result.sourceRef, result.channel]).sort(),
    nonwordIds,
    resultCount: results.length,
    reviewCellCount: new Set(results.map(result => result.reviewCellId)).size,
    challengeCount: new Set(challenges.map(challenge => challenge.challengeRef)).size,
    reviewsShareResultIdentity: results.every(result => result.reviewCellId === result.resultId),
    resultChallengeRefs: results.map(result => result.challengeRef),
    authoredChallengeRefs: challenges.map(challenge => challenge.challengeRef),
    matchingBindings: results.every(result => challenges.some(challenge => (
      challenge.challengeRef === result.challengeRef
      && challenge.resultId === result.resultId
      && challenge.reviewCellId === result.reviewCellId
    ))),
    atomicBoundaries: microtasks.map(task => [
      task.persistence.atomic,
      task.persistence.resumePolicy,
      task.checkpointAfterSuccess.checkpointId
    ])
  }, {
    wordCells: wordSources.flatMap(sourceRef => [
      [sourceRef, 'audio-form-supported'], [sourceRef, 'word-form']
    ]).sort(),
    nonwordIds: [
      'NCE-U01-T04:L01-M08:owner',
      'NCE-U01-T02:L01-M09:attention',
      'NCE-U01-T04:L01-M10:handbag-question',
      'NCE-U01-T03:L01-M10:repair',
      'NCE-U01-T05:L01-M11:thanks',
      'NCE-U01-T04:L02-M15:watch-question',
      'NCE-U01-T04:L02-M15:it-reference'
    ],
    resultCount: 29,
    reviewCellCount: 29,
    challengeCount: 29,
    reviewsShareResultIdentity: true,
    resultChallengeRefs: expectedChallengeRefs,
    authoredChallengeRefs: expectedChallengeRefs,
    matchingBindings: true,
    atomicBoundaries: microtasks.map(task => [
      true, 'restart-microtask', `${task.microtaskId}:complete`
    ])
  });
});

test('Lesson 1–2 V2 freezes all twenty-nine story-semantic interaction contracts in order', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const challenges = unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps || [])
    .flatMap(step => step.challenges || []);
  const contracts = challenges.map(challenge => ({
    challengeRef: challenge.challengeRef,
    interactionPattern: challenge.interactionPattern,
    interactionSemantics: challenge.interactionSemantics
  }));

  assert.deepEqual(contracts, [
    { challengeRef: 'L01-M08:C01', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L01-D06'], targetId: 'handbag-owner' } },
    { challengeRef: 'L01-M08:C02', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L01-W07'], targetId: 'handbag' } },
    { challengeRef: 'L01-M09:C01', interactionPattern: 'utterance-select', interactionSemantics: { sourceRefs: ['L01-D01'], targetId: 'station-keeper:attention-turn' } },
    { challengeRef: 'L01-M10:C01', interactionPattern: 'relation-reconstruct', interactionSemantics: { sourceRefs: ['L01-D03', 'L01-W07'], relationSlotIds: ['ownership-question:opening', 'ownership-question:handbag', 'ownership-question:punctuation'] } },
    { challengeRef: 'L01-M10:C02', interactionPattern: 'utterance-select', interactionSemantics: { sourceRefs: ['L01-D04'], targetId: 'handbag-owner:repair-turn' } },
    { challengeRef: 'L01-M11:C01', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L01-W07'], targetId: 'handbag:english-label' } },
    { challengeRef: 'L01-M11:C02', interactionPattern: 'utterance-select', interactionSemantics: { sourceRefs: ['L01-D07'], targetId: 'handbag-owner:thanks-turn' } },
    { challengeRef: 'L02-M11:C01', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W01'], targetId: 'personal-items-tray:pen' } },
    { challengeRef: 'L02-M11:C02', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W02'], targetId: 'personal-items-tray:pencil' } },
    { challengeRef: 'L02-M12:C01', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W03'], targetId: 'book' } },
    { challengeRef: 'L02-M12:C02', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W04'], targetId: 'watch' } },
    { challengeRef: 'L02-M13:C01', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W01'], targetId: 'pen:english-label' } },
    { challengeRef: 'L02-M13:C02', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W02'], targetId: 'pencil:english-label' } },
    { challengeRef: 'L02-M14:C01', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W03'], targetId: 'personal-items-label-book:book' } },
    { challengeRef: 'L02-M14:C02', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W04'], targetId: 'personal-items-label-book:watch' } },
    { challengeRef: 'L02-M15:C01', interactionPattern: 'relation-reconstruct', interactionSemantics: { sourceRefs: ['L01-D03', 'L02-W04'], relationSlotIds: ['ownership-question:is', 'ownership-question:this', 'ownership-question:your', 'ownership-question:watch', 'ownership-question:punctuation'] } },
    { challengeRef: 'L02-M15:C02', interactionPattern: 'relation-reconstruct', interactionSemantics: { sourceRefs: ['L01-D06', 'L01-W09', 'L02-W04'], relationSlotIds: ['owner-answer:it-pronoun', 'owner-answer:watch-referent'] } },
    { challengeRef: 'L02-M16:C01', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W05'], targetId: 'coatroom-rack:coat' } },
    { challengeRef: 'L02-M16:C02', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W06'], targetId: 'coatroom-rack:dress' } },
    { challengeRef: 'L02-M17:C01', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W07'], targetId: 'skirt' } },
    { challengeRef: 'L02-M17:C02', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W08'], targetId: 'shirt' } },
    { challengeRef: 'L02-M18:C01', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W05'], targetId: 'coat:english-label' } },
    { challengeRef: 'L02-M18:C02', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W06'], targetId: 'dress:english-label' } },
    { challengeRef: 'L02-M19:C01', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W07'], targetId: 'coatroom-word-slots:skirt' } },
    { challengeRef: 'L02-M19:C02', interactionPattern: 'object-place', interactionSemantics: { sourceRefs: ['L02-W08'], targetId: 'coatroom-word-slots:shirt' } },
    { challengeRef: 'L02-M20:C01', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W09'], targetId: 'car' } },
    { challengeRef: 'L02-M20:C02', interactionPattern: 'scene-identify', interactionSemantics: { sourceRefs: ['L02-W10'], targetId: 'house' } },
    { challengeRef: 'L02-M21:C01', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W09'], targetId: 'car:english-label' } },
    { challengeRef: 'L02-M21:C02', interactionPattern: 'label-connect', interactionSemantics: { sourceRefs: ['L02-W10'], targetId: 'house:english-label' } }
  ]);

  const allowedPatterns = new Set([
    'scene-identify', 'object-place', 'label-connect',
    'utterance-select', 'relation-reconstruct'
  ]);
  assert.ok(contracts.every(contract => allowedPatterns.has(contract.interactionPattern)));
  let previousPattern = null;
  let consecutive = 0;
  for (const contract of contracts) {
    consecutive = contract.interactionPattern === previousPattern ? consecutive + 1 : 1;
    previousPattern = contract.interactionPattern;
    assert.ok(consecutive <= 2, `${contract.challengeRef} repeats ${contract.interactionPattern}`);
  }
});

test('Lesson 1–2 V2 rejects missing, forged, or over-repeated interaction contracts', () => {
  const errorsAfter = mutate => {
    const invalid = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    const challenges = invalid.beats.flatMap(beat => beat.microtasks || [])
      .flatMap(task => task.steps || [])
      .flatMap(step => step.challenges || []);
    mutate(new Map(challenges.map(challenge => [challenge.challengeRef, challenge])));
    return catalog.validate([invalid]).join('\n');
  };

  assert.match(errorsAfter(challenges => {
    delete challenges.get('L01-M08:C01').interactionPattern;
  }), /L01-M08:C01 must declare one interactionPattern/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L01-M08:C01').interactionPattern = 'card-tap';
  }), /L01-M08:C01 uses invalid interactionPattern card-tap/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L01-M09:C01').interactionPattern = 'scene-identify';
  }), /scene-identify cannot repeat more than twice across microtasks/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L02-M11:C01').interactionSemantics.sourceRefs = [];
  }), /L02-M11:C01 interaction semantics must declare sourceRefs/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L02-M11:C01').interactionSemantics.targetId = '';
  }), /L02-M11:C01 object-place must declare targetId/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L02-M15:C01').interactionSemantics.relationSlotIds = [];
  }), /L02-M15:C01 relation-reconstruct must declare relationSlotIds/i);
  assert.match(errorsAfter(challenges => {
    challenges.get('L02-M20:C01').interactionSemantics.sourceRefs = ['L02-W99'];
  }), /L02-M20:C01 references unknown interaction source L02-W99/i);
});

test('handbag and coat each have one authored consequential handoff', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const actions = tasks.filter(task => task.storyAction).map(task => ({
    microtaskId: task.microtaskId,
    ...task.storyAction,
    actionSteps: task.steps.filter(step => step.kind === 'perform-action').length
  }));

  assert.deepEqual(actions, [
    {
      microtaskId: 'L01-M11', actionId: 'handbag-return', action: 'give',
      entityId: 'handbag', targetEntityId: 'handbag-owner', maxOccurrences: 1, actionSteps: 1
    },
    {
      microtaskId: 'L02-M19', actionId: 'coat-return', action: 'give',
      entityId: 'coat', targetEntityId: 'handbag-owner', maxOccurrences: 1, actionSteps: 1
    }
  ]);
  assert.equal(tasks.some(task => task.checkpointAfterSuccess.buildStage !== undefined), false);
  assert.equal(tasks.at(-1).growthBoundary, 'unit-verifying');
  assert.deepEqual(unit.finalizationProtocol.steps, [
    'commit-final-microtask-and-lesson2',
    'readback-seventeen-microtasks-twenty-nine-cells-sources-and-facts',
    'commit-idempotent-unit-built',
    'readback-build-stage-five-before-landmark-animation'
  ]);
});

test('Lesson 1–2 V2 keeps navigation, child prompts, knowledge cards, and failure copy in catalog', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const steps = new Map(tasks.flatMap(task => task.steps).map(step => [step.stepId, step]));

  assert.deepEqual(tasks.map(task => task.navigationTitle), [
    '听听是谁丢了手提包', '柜台边的新线索', '礼貌地叫住她', '把问题问清楚',
    '核对物品挂牌', '角色扮演',
    '清点包里的文具', '继续清点随身物品',
    '给文具贴上英文名', '给随身物品贴英文名', '换件物品问一问',
    '帮她寻找衣物', '找齐衣帽间的衣物', '给衣物贴上英文名',
    '把外套还给她', '回家路上的两个线索', '送她平安到家'
  ]);
  assert.deepEqual(tasks.map(task => task.presentation.title), tasks.map(task => task.navigationTitle));
  assert.equal(steps.get('L01-M08:S01').prompt, 'Whose handbag is it?');
  assert.equal(steps.get('L01-M11:S03').actionInstruction,
    '点击手提包主人，把手提包交给她');
  assert.equal(steps.get('L01-M09:S01').prompt, '礼貌叫住她，应该怎么说？');
  assert.equal(steps.get('L01-M11:S02').prompt, '看一看场景中的物品，选择对应的英文名称。');
  assert.equal(steps.get('L02-M11:S01').prompt, '听声音，点击对应的物品');
  assert.equal(steps.get('L02-M12:S01').prompt, '听声音，点击对应的物品');
  assert.equal(steps.get('L02-M13:S01').prompt, '看英文，点击对应的物品');
  assert.equal(steps.get('L02-M14:S01').prompt, '看英文，点击对应的物品');
  assert.equal(steps.get('L02-M15:S03').prompt, 'Yes, it is. 里的 it 指的是哪一件东西？');
  assert.equal(steps.get('L02-M16:S01').prompt, '听声音，点击对应的衣物');
  assert.equal(steps.get('L02-M17:S01').prompt, '听声音，点击对应的衣物');
  assert.equal(steps.get('L02-M18:S01').prompt, '看英文，点击对应的衣物');
  assert.equal(steps.get('L02-M19:S01').prompt, '看英文，点击对应的衣物');
  assert.equal(steps.get('L02-M21:S01').prompt, '看英文，选择对应的场景');
  assert.equal(steps.get('L02-M21:S02').prompt, '看英文，选择对应的场景');
  assert.equal(unit.experience.uiCopy.dialogue.replayLabel, '重新播放');
  assert.equal(unit.experience.uiCopy.dialogue.continueLabel, '继续');
  assert.deepEqual(tasks.find(task => task.microtaskId === 'L02-M15').knowledgeCardRefs, [
    'NCE-U01-C-KNOWLEDGE-QUESTION', 'NCE-U01-C-KNOWLEDGE-IT'
  ]);
  assert.equal(unit.experience.audioFailure.retryLabel, '再听一次');
  assert.equal(unit.experience.saveFailure.retryLabel, '重新保存');
  assert.equal(unit.experience.uiCopy.navigation.chooseStageTitle, '选择学习阶段');
  assert.equal(unit.experience.uiCopy.navigation.chooseStageCopy, '回看已到达的阶段');
  assert.deepEqual(unit.experience.stageNavigation, {
    titleSource: 'microtask.navigationTitle',
    reachedPolicy: 'completed-plus-current',
    completedStageMode: 'sandbox-practice',
    skippedStageMode: 'formal-completion',
    futureStageMode: 'visible-disabled',
    openLabel: '选择已到达的阶段',
    practiceLabel: '回看',
    skippedLabel: '已跳过',
    completeSkippedLabel: '完成角色扮演',
    currentLabel: '继续学习',
    lockedLabel: '未到达'
  });
  assert.doesNotMatch(JSON.stringify(tasks), /盖章|拉杆|点亮|钥匙|徽章/);
});

test('Lesson 1–2 child-action copy contract keeps one task, one status, and concise outcomes', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const ui = unit.experience.uiCopy;
  const chapter = unit.experience.restStops['lesson1-chapter-stop'];
  const midpoint = unit.experience.restStops['lesson2-midpoint-rest-stop'];
  const manual = unit.experience.outcomePractices.find(practice => (
    practice.practiceId === 'L01-RS01:manual-dialogue'
  ));
  const recap = unit.experience.outcomePractices.find(practice => (
    practice.practiceId === 'NCE-U01-OUTCOME:case-recap'
  ));

  assert.equal(ui.dialogue.listenHint, '');
  assert.equal(ui.feedbackAudio.autoContinue, '');
  assert.equal(ui.languageAudio.listenHint, '');
  assert.equal(ui.languageAudio.playingHint, '正在播放');
  assert.equal(ui.interaction.soundQuestion, '');
  assert.equal(ui.interaction.selectMatchingItem, '');
  assert.equal(ui.navigation.restartCopy, '');
  assert.equal(ui.navigation.dialogKicker, '');
  assert.equal(ui.preview.savedTitle, '进度已保存');
  assert.equal(ui.preview.dayBuildLabel, '');
  assert.equal(ui.preview.reviewGrowthCopy, '');

  assert.equal(chapter.kicker, '进度已保存');
  assert.equal(chapter.copy, '');
  assert.equal(midpoint.kicker, '进度已保存');
  assert.equal(midpoint.copy, '');
  assert.equal(unit.experience.completion.kicker, '');
  assert.equal(unit.experience.completion.copy, '');

  assert.deepEqual(
    [manual.entryKicker, manual.entryLabel, manual.entryHint, manual.entryActionLabel],
    ['可选 · 不计进度', '无字逐句回演', '', '开始回演']
  );
  assert.deepEqual(
    [recap.entryKicker, recap.entryLabel, recap.entryHint, recap.entryActionLabel],
    ['可选 · 3题', '案件复盘', '', '开始复盘']
  );
  assert.equal(recap.kicker, '');
  assert.equal(recap.intro, '');
  assert.equal(recap.exitLabel, '返回成果页');
  assert.equal(recap.finishedTitle, '复盘完成');
  assert.equal(recap.finishedCopy, '');

  const copySurfaces = {
    uiCopy: ui,
    restStops: unit.experience.restStops,
    outcomePractices: unit.experience.outcomePractices,
    completion: unit.experience.completion,
    reviewRun: unit.experience.reviewRun,
    audioFailure: unit.experience.audioFailure,
    saveFailure: unit.experience.saveFailure
  };
  const visibleCopy = [];
  const collectStringValues = value => {
    if (typeof value === 'string') {
      visibleCopy.push(value);
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const nested of Object.values(value)) collectStringValues(nested);
  };
  collectStringValues(copySurfaces);
  const visibleCopyText = visibleCopy.join('\n');
  assert.doesNotMatch(visibleCopyText, /读完会自动继续|真实学习进度|稳定位置|当日建设|长期掌握/);
  assert.doesNotMatch(
    visibleCopyText,
    /runtime|requestId|sourceRef|challengeRef|SHA-256|Service Worker|CacheStorage|HTTP\s*\d{3}/i
  );
});

test('I02 freezes answer-neutral stage titles, prompts, and stage-two candidate labels', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const steps = new Map([...tasks.values()].flatMap(task => task.steps || [])
    .map(step => [step.stepId, step]));

  assert.equal(tasks.get('L01-M08').navigationTitle, '柜台边的新线索');
  assert.equal(tasks.get('L01-M08').presentation.title, '柜台边的新线索');
  assert.deepEqual(tasks.get('L01-M08').presentation.candidateLabels, {
    'station-keeper': '招领员',
    'handbag-owner': '女顾客'
  });
  assert.equal(
    steps.get('L01-M08:S01').actionInstruction,
    '听完问题，点一下应该回应的人物。'
  );
  assert.equal(
    steps.get('L01-M08:S02').prompt,
    '听一听，点中声音说的物品。'
  );

  assert.equal(tasks.get('L01-M11').navigationTitle, '核对物品挂牌');
  assert.equal(tasks.get('L01-M11').presentation.title, '核对物品挂牌');
  assert.equal(
    steps.get('L01-M11:S02').prompt,
    '看一看场景中的物品，选择对应的英文名称。'
  );

  assert.equal(
    steps.get('L01-M10:S01').prompt,
    '礼貌确认，这是不是对方正在找的物品。'
  );
  assert.equal(
    steps.get('L02-M15:S01').prompt,
    '礼貌确认，这是不是对方正在找的物品。'
  );

  assert.equal(tasks.get('L02-M20').navigationTitle, '回家路上的两个线索');
  assert.equal(tasks.get('L02-M20').presentation.title, '回家路上的两个线索');
  assert.equal(
    steps.get('L02-M20:S01').prompt,
    '听一听，点中声音说的是哪一个。'
  );
  assert.equal(
    tasks.get('L02-M20').presentation.prompt,
    '听一听，点中声音说的是哪一个。'
  );
  assert.doesNotMatch(tasks.get('L02-M20').presentation.prompt, /car.*house|house.*car/i);
});

test('I02 declares and validates the evidence channel and intentional pre-submit support', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const challenges = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps || [])
    .flatMap(step => step.challenges || [])
    .map(challenge => [challenge.challengeRef, challenge]));

  assert.deepEqual(challenges.get('L01-M08:C01').answerFairness, {
    targetEvidenceChannel: 'meaning',
    targetEvidenceSourceRefs: ['L01-D06'],
    intentionalPreSubmitSupport: [
      { sourceRef: 'L01-Q01', surface: 'english-question' }
    ]
  });
  assert.deepEqual(challenges.get('L01-M08:C02').answerFairness, {
    targetEvidenceChannel: 'audio-form-supported',
    targetEvidenceSourceRefs: ['L01-W07'],
    intentionalPreSubmitSupport: [
      { sourceRef: 'L01-W07', surface: 'audio-word-plaque' }
    ]
  });
  assert.deepEqual(challenges.get('L01-M11:C01').answerFairness, {
    targetEvidenceChannel: 'word-form',
    targetEvidenceSourceRefs: ['L01-W07'],
    intentionalPreSubmitSupport: [
      { sourceRef: 'L01-W07', surface: 'english-word-plaque' }
    ]
  });

  const errorsAfter = mutate => {
    const invalid = structuredClone(unit);
    const challenge = invalid.beats.flatMap(beat => beat.microtasks || [])
      .flatMap(task => task.steps || [])
      .flatMap(step => step.challenges || [])
      .find(candidate => candidate.challengeRef === 'L01-M08:C02');
    mutate(challenge.answerFairness);
    return catalog.validate([invalid]).join('\n');
  };
  assert.match(errorsAfter(fairness => {
    fairness.targetEvidenceChannel = '';
  }), /L01-M08:C02 answer fairness must declare its target evidence channel/i);
  assert.match(errorsAfter(fairness => {
    fairness.targetEvidenceSourceRefs = ['L01-W99'];
  }), /L01-M08:C02 answer fairness references unknown source L01-W99/i);
  assert.match(errorsAfter(fairness => {
    fairness.intentionalPreSubmitSupport[0].surface = 'stage-title';
  }), /L01-M08:C02 uses invalid intentional support surface stage-title/i);
});

test('textual choice prompts never disclose the accepted English option', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const sourceTextByRef = new Map(Object.values(unit.lessonContent || {}).flatMap(lesson => (
    Object.entries(lesson.sources || {}).map(([sourceRef, sourceItem]) => [sourceRef, sourceItem.text])
  )));
  const leaks = tasks.flatMap(task => (task.steps || []).flatMap(step => {
    if (!Array.isArray(step.optionSourceRefs)) return [];
    const acceptedText = sourceTextByRef.get(step.answerRule?.acceptedSourceRef);
    if (!acceptedText) return [];
    const escaped = acceptedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
    return [
      ['step prompt', step.prompt],
      ['step action instruction', step.actionInstruction],
      ['microtask prompt', task.prompt],
      ['navigation title', task.navigationTitle],
      ['presentation title', task.presentation?.title],
      ['presentation prompt', task.presentation?.prompt]
    ].flatMap(([surface, copy]) => pattern.test(copy || '')
      ? [{ stepId: step.stepId, surface, copy, acceptedText }]
      : []);
  }));

  assert.deepEqual(leaks, []);
});

test('Lesson 1–2 owner recall stays neutral and reveals distractor props only for the audio search', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(candidate => candidate.microtaskId === 'L01-M08');
  const ownerStep = task.steps.find(step => step.stepId === 'L01-M08:S01');
  const ownerMoment = task.presentation.moments
    .find(moment => moment.momentId === 'owner-recall');
  const audioMoment = task.presentation.moments
    .find(moment => moment.momentId === 'handbag-audio-find');

  assert.equal(ownerStep.prompt, 'Whose handbag is it?');
  assert.equal(ownerStep.promptSourceRef, 'L01-Q01');
  assert.equal(ownerStep.actionInstruction, '听完问题，点一下应该回应的人物。');
  assert.equal(ownerStep.candidatePresentation, 'neutral-before-submit');
  assert.equal(ownerStep.challenges[0].candidateSetPolicy,
    'authentic-story-participants');
  assert.deepEqual(ownerStep.optionEntityIds, ['station-keeper', 'handbag-owner']);
  assert.deepEqual(ownerStep.challenges[0].candidateEntityIds, [
    'station-keeper', 'handbag-owner'
  ]);
  assert.deepEqual(task.presentation.sceneEntityIds, ['handbag']);
  assert.deepEqual(ownerMoment.focusEntityIds, ['handbag']);
  assert.deepEqual(ownerMoment.visibleLanguageRefs, ['L01-Q01']);
  assert.deepEqual(audioMoment.focusEntityIds, ['handbag', 'book', 'watch']);
  assert.equal(unit.experience.uiCopy.dialogue.completedHint, '');
});

test('every formal entity choice keeps candidates visually neutral before submission', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const entityChoiceSteps = tasks.flatMap(task => task.steps
    .filter(step => (
      step.submissionMode === 'formal'
      && Array.isArray(step.optionEntityIds)
      && step.optionEntityIds.length > 1
      && step.challenges?.some(challenge => challenge.candidateEntityIds?.length > 1)
    ))
    .map(step => ({ task, step })));

  assert.ok(entityChoiceSteps.length > 0);

  for (const { task, step } of entityChoiceSteps) {
    assert.equal(
      step.candidatePresentation,
      'neutral-before-submit',
      `${step.stepId} must declare the neutral candidate contract`
    );
    for (const challenge of step.challenges) {
      const moment = task.presentation.moments.find(candidate => (
        candidate.enterWhen?.kind === 'challenge-active'
        && candidate.enterWhen.challengeRef === challenge.challengeRef
      ));
      assert.ok(moment, `${challenge.challengeRef} must own one active presentation moment`);
      const focusedCandidates = challenge.candidateEntityIds.filter(entityId => (
        moment.focusEntityIds.includes(entityId)
      ));
      assert.ok(
        focusedCandidates.length === 0
          || focusedCandidates.length === challenge.candidateEntityIds.length,
        `${challenge.challengeRef} must focus either none or all answer candidates`
      );
    }
  }
});

test('catalog validation rejects answer-revealing formal entity presentations', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const errorsAfter = mutate => {
    const invalid = structuredClone(unit);
    const task = invalid.beats.flatMap(beat => beat.microtasks || [])
      .find(candidate => candidate.microtaskId === 'L02-M13');
    const step = task.steps.find(candidate => candidate.stepId === 'L02-M13:S01');
    const moment = task.presentation.moments.find(candidate => (
      candidate.enterWhen?.challengeRef === 'L02-M13:C01'
    ));
    mutate({ step, moment });
    return catalog.validate([invalid]).join('\n');
  };

  assert.match(errorsAfter(({ step }) => {
    delete step.candidatePresentation;
  }), /L02-M13:S01 must declare neutral-before-submit/i);
  assert.match(errorsAfter(({ moment }) => {
    moment.focusEntityIds = ['pen'];
  }), /L02-M13:C01 must not focus only part of its answer candidates/i);
});

test('the textbook thanks is a female turn scored once and reused only as transfer exposure', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const thanksResults = tasks.flatMap(task => task.targetResults || [])
    .filter(result => result.sourceRef === 'L01-D07');
  const coatTask = tasks.find(task => task.microtaskId === 'L02-M19');

  assert.deepEqual(thanksResults.map(result => result.resultId), ['NCE-U01-T05:L01-M11:thanks']);
  assert.deepEqual([
    unit.lessonContent.lesson1.sources['L01-D07'].speaker,
    unit.lessonContent.lesson1.sources['L01-D07'].voiceId,
    coatTask.sourceContacts.find(contact => contact.sourceRef === 'L01-D07').contactMode
  ], ['woman', 'af_heart', 'near-transfer-thanks']);
});

test('Lesson 1 and Lesson 2 midpoint own distinct catalog rest stops without landmark growth', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));

  assert.equal(tasks.get('L01-M11').restStop, undefined);
  assert.deepEqual(tasks.get('L01-M12').restStop, {
    restStopId: 'lesson1-chapter-stop', type: 'chapter', nextMicrotaskId: 'L02-M11'
  });
  assert.deepEqual(tasks.get('L02-M15').restStop, {
    restStopId: 'lesson2-midpoint-rest-stop', type: 'section', nextMicrotaskId: 'L02-M16'
  });
  assert.deepEqual(Object.keys(unit.experience.restStops), [
    'lesson1-chapter-stop', 'lesson2-midpoint-rest-stop'
  ]);
  assert.deepEqual(Object.values(unit.experience.restStops).map(restStop => restStop.restingCopy), [
    '下次从随身物品核对继续。',
    '下次从衣帽间的 coat 和 dress 继续。'
  ]);
  assert.ok(['L01-M12', 'L02-M15'].every(id => tasks.get(id).growthBoundary === 'none'));
});

test('Lesson 1–2 outcome practices are catalog-owned, optional, and outside the 17/29 mainline', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const practices = unit.experience.outcomePractices;
  const [manualDialogue, recap] = practices;
  const mainlineResults = unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.targetResults || []);

  assert.deepEqual(practices.map(practice => [
    practice.practiceId, practice.kind, practice.availableAt
  ]), [
    ['L01-RS01:manual-dialogue', 'manual-dialogue', { outcomeNodeId: 'L01-RS01', status: 'rest-stop', buildStage: 0 }],
    ['NCE-U01-OUTCOME:case-recap', 'case-recap', { outcomeNodeId: 'NCE-U01-OUTCOME', status: 'unit-built', buildStage: 5 }]
  ]);
  assert.deepEqual(manualDialogue.dialogueTurnRefs, [
    'L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'
  ]);
  assert.equal(manualDialogue.unlockAfterStageId, 'L01-M12');
  assert.equal(manualDialogue.countsTowardProgress, false);
  assert.deepEqual(recap.items.map(item => [item.itemId, item.practiceTarget]), [
    ['recap-story-owner', 'discourse-understanding'],
    ['recap-polite-repair', 'communication-structure'],
    ['recap-new-route', 'vocabulary-transfer']
  ]);
  assert.equal(recap.diagnosticKind, 'same-day-practice');
  assert.equal(unit.experience.progressDenominator, 17);
  assert.equal(mainlineResults.length, 29);
  assert.doesNotMatch(
    JSON.stringify(practices),
    /"(?:resultId|challengeRef|reviewCellId|adventureHearts|landmarkId|nextDueDay)"\s*:/
  );
});

test('Lesson 1–2 rejects dangling or mainline-shaped outcome practice contracts', () => {
  function message(change) {
    const invalid = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    change(invalid.experience.outcomePractices);
    return catalog.validate([invalid]).join('\n');
  }

  assert.match(message(practices => {
    practices[0].dialogueTurnRefs[0] = 'PAGE-ONLY-DIALOGUE';
  }), /manual-dialogue.*complete ordered seven-line dialogue/i);
  assert.match(message(practices => {
    practices[1].items[0].promptRef = 'PAGE-ONLY-PROMPT';
  }), /recap-story-owner.*unknown prompt PAGE-ONLY-PROMPT/i);
  assert.match(message(practices => {
    practices[1].items[1].options[0].sourceRef = 'PAGE-ONLY-SOURCE';
  }), /recap-polite-repair.*unknown option source PAGE-ONLY-SOURCE/i);
  assert.match(message(practices => {
    practices[1].items[2].answerRule.acceptedSourceRef = 'PAGE-ONLY-SOURCE';
  }), /recap-new-route.*accepted source PAGE-ONLY-SOURCE is not a candidate/i);
  assert.match(message(practices => {
    practices[0].turnHints[0].openingChunk = '';
  }), /manual-dialogue.*incomplete two-level hint/i);
  assert.match(message(practices => {
    practices[1].items[2].practiceTarget = 'communication-structure';
  }), /case-recap.*exactly one.*vocabulary-transfer/i);
  assert.match(message(practices => {
    practices[1].items[2].contextRef = 'PAGE-ONLY-CONTEXT';
  }), /recap-new-route.*unknown context PAGE-ONLY-CONTEXT/i);
  assert.match(message(practices => {
    practices[0].challengeRef = 'L01-RS01:C01';
  }), /L01-RS01:manual-dialogue.*forbidden mainline field challengeRef/i);
});

test('I05 every answer-bearing surface declares fairness and rejects direct answer leakage', () => {
  const lessonOneTwo = catalog.getTeachingUnit('NCE-U01');
  const recap = lessonOneTwo.experience.outcomePractices
    .find(practice => practice.kind === 'case-recap');
  const owner = recap.items.find(item => item.itemId === 'recap-story-owner');
  const route = recap.items.find(item => item.itemId === 'recap-new-route');

  assert.equal(lessonOneTwo.entities['handbag-owner'].title, '女顾客');
  assert.equal(route.answerFairness.targetEvidenceChannel, 'vocabulary-transfer');
  assert.equal(route.answerFairness.candidateLanguageBoundary, 'source-text-only');
  assert.ok(recap.items.filter(item => item.options.some(option => option.sourceRef))
    .every(item => item.answerFairness.candidateLanguageBoundary === 'source-text-only'));
  assert.ok(recap.items.every(item => (
    typeof item.answerFairness?.targetEvidenceChannel === 'string'
      && Array.isArray(item.answerFairness.targetEvidenceSourceRefs)
      && Array.isArray(item.answerFairness.intentionalPreSubmitSupport)
  )));

  const recapLeak = structuredClone(lessonOneTwo);
  recapLeak.authoredContent['NCE-U01-C-RECAP-ROUTE'].text = '正确答案就是 house（房子）。';
  assert.match(
    catalog.validate([recapLeak]).join('\n'),
    /recap-new-route.*answer leakage/i
  );

  const ownerLeak = structuredClone(lessonOneTwo);
  ownerLeak.entities['handbag-owner'].title = '手提包主人';
  assert.match(
    catalog.validate([ownerLeak]).join('\n'),
    /recap-story-owner.*answer leakage/i
  );

  const candidateLanguageLeak = structuredClone(lessonOneTwo);
  delete candidateLanguageLeak.experience.outcomePractices
    .find(practice => practice.kind === 'case-recap')
    .items.find(item => item.itemId === 'recap-new-route')
    .answerFairness.candidateLanguageBoundary;
  assert.match(
    catalog.validate([candidateLanguageLeak]).join('\n'),
    /recap-new-route.*source-text-only language boundary/i
  );

  for (const unitId of ['NCE-U02', 'NCE-U03', 'NCE-U04']) {
    const unit = structuredClone(catalog.getTeachingUnit(unitId));
    const subjects = unit.experience.stages.flatMap(stage => (
      stage.rounds?.length ? stage.rounds : [stage]
    )).filter(subject => subject.answerRule);
    assert.ok(subjects.length > 0);
    assert.ok(subjects.every(subject => subject.answerFairness));

    const evidenceSubject = subjects.find(subject => (
      subject.answerFairness.targetEvidenceChannel !== 'guided-story-action'
        && subject.answerRule.acceptedOptionId
    ));
    const accepted = evidenceSubject.options.find(option => (
      option.optionId === evidenceSubject.answerRule.acceptedOptionId
    ));
    evidenceSubject.prompt = `正确答案就是 ${accepted.label}`;
    assert.match(
      catalog.validate([unit]).join('\n'),
      /answer leakage/i,
      `${unitId} must reject an injected direct answer`
    );
  }

  assert.equal(owner.answerFairness.targetEvidenceChannel, 'discourse-understanding');
});

test('Lesson 1–2 rejects missing listen-answer and physical-surface contracts', () => {
  function message(change) {
    const invalid = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    change(invalid);
    return catalog.validate([invalid]).join('\n');
  }
  const tasks = unit => unit.beats.flatMap(beat => beat.microtasks || []);
  const step = (unit, stepId) => tasks(unit)
    .flatMap(task => task.steps || [])
    .find(candidate => candidate.stepId === stepId);

  assert.match(message(unit => {
    delete step(unit, 'L02-M11:S01').audioResponsePresentation;
  }), /L02-M11:S01 must declare shared-locked-until-ended/i);
  assert.match(message(unit => {
    step(unit, 'L01-M07:S01').audioResponsePresentation = 'shared-locked-until-ended';
  }), /L01-M07:S01 must remain an independent listening scene/i);
  assert.match(message(unit => {
    delete tasks(unit).find(task => task.microtaskId === 'L02-M15').presentation.propSurface;
  }), /L02-M15 must declare one physical prop surface/i);
  assert.match(message(unit => {
    unit.experience.outcomePractices[0].returnMainlineLabel = '';
  }), /manual-dialogue must return directly to the saved mainline/i);
});

test('Lesson 2 word checks keep listening, replay, real candidates, and answer audio on one authored step', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const expectations = new Map([
    ['L02-M11', 'shared-locked-until-ended'],
    ['L02-M12', 'shared-locked-until-ended'],
    ['L02-M13', 'shared-optional-replay'],
    ['L02-M14', 'shared-optional-replay'],
    ['L02-M16', 'shared-locked-until-ended'],
    ['L02-M17', 'shared-locked-until-ended'],
    ['L02-M18', 'shared-optional-replay'],
    ['L02-M19', 'shared-optional-replay']
  ]);

  for (const [microtaskId, audioResponsePresentation] of expectations) {
    const task = tasks.get(microtaskId);
    const formalWordSteps = task.steps.filter(step => (
      step.submissionMode === 'formal' && step.kind === 'match-entity-batch'
    ));
    assert.equal(formalWordSteps.length, 1, `${microtaskId} must use one word-check surface`);
    const [step] = formalWordSteps;
    assert.equal(step.audioResponsePresentation, audioResponsePresentation);
    assert.equal(step.textVisibility, 'always-visible');
    assert.equal(step.candidatePresentation, 'neutral-before-submit');
    assert.ok(step.optionEntityIds.length >= 4, `${microtaskId} must show real scene candidates`);
    assert.ok(step.challenges.length >= 2, `${microtaskId} must keep both tested words in the same step`);
    for (const challenge of step.challenges) {
      assert.equal(challenge.correctFeedback.copy, challenge.targetText);
      assert.ok(
        challenge.feedbackAudioSequence || challenge.audioSequence,
        `${challenge.challengeRef} must own its pronunciation without an extra page`
      );
    }
  }
});

test('Lesson 1 maps every support word to the textbook turn that actually exposes it', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const sources = unit.lessonContent.lesson1.sources;
  const firstListen = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === 'L01-M07');
  const contacts = firstListen.sourceContacts
    .filter(contact => contact.contactMode === 'utterance-embedded')
    .map(contact => [contact.utteranceSourceRef, contact.sourceRef]);

  assert.deepEqual(contacts, [
    ['L01-D01', 'L01-W01'], ['L01-D01', 'L01-W02'],
    ['L01-D02', 'L01-W03'],
    ['L01-D03', 'L01-W04'], ['L01-D03', 'L01-W05'],
    ['L01-D03', 'L01-W06'], ['L01-D03', 'L01-W07'],
    ['L01-D04', 'L01-W08'],
    ['L01-D05', 'L01-W04'], ['L01-D05', 'L01-W05'],
    ['L01-D05', 'L01-W06'], ['L01-D05', 'L01-W07'],
    ['L01-D06', 'L01-W03'], ['L01-D06', 'L01-W09'], ['L01-D06', 'L01-W04'],
    ['L01-D07', 'L01-W10'], ['L01-D07', 'L01-W11']
  ]);
  for (const [utteranceRef, wordRef] of contacts) {
    assert.ok(sources[utteranceRef].embeddedSourceRefs.includes(wordRef));
  }
});

test('every formal Lesson 1–2 challenge owns diagnostic candidates and three matching supports', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const formalSteps = unit.beats.flatMap(beat => beat.microtasks || [])
    .flatMap(task => task.steps)
    .filter(step => step.submissionMode === 'formal');
  const challenges = formalSteps.flatMap(step => step.challenges || []);

  assert.equal(challenges.length, 29);
  assert.ok(formalSteps.every(step => step.affectsAdventureHearts === true));
  for (const challenge of challenges) {
    const candidates = challenge.candidateEntityIds
      || challenge.candidateSourceRefs
      || challenge.candidateContentRefs;
    if (challenge.candidateSetPolicy === 'authentic-story-participants') {
      assert.equal(challenge.challengeRef, 'L01-M08:C01');
      assert.equal(challenge.interactionPattern, 'scene-identify');
      assert.deepEqual(candidates, ['station-keeper', 'handbag-owner']);
    } else if (challenge.candidateSetPolicy === 'authentic-scene-pair') {
      assert.ok(['L02-M20:C01', 'L02-M20:C02', 'L02-M21:C01', 'L02-M21:C02']
        .includes(challenge.challengeRef));
      assert.deepEqual(candidates, ['car', 'house']);
    } else {
      assert.ok(candidates.length >= 3, challenge.challengeRef);
    }
    assert.deepEqual(challenge.supportLayers.map(layer => layer.level), [
      'reobserve', 'partial-cue', 'model'
    ], challenge.challengeRef);
    assert.match(challenge.supportLayers[2].copy, /小猫/, challenge.challengeRef);
    assert.equal(typeof challenge.correctFeedback.copy, 'string', challenge.challengeRef);
    assert.equal(typeof challenge.incorrectFeedback.copy, 'string', challenge.challengeRef);
    assert.ok(challenge.answerRule?.type, challenge.challengeRef);
  }
});

test('Lesson 1 and Lesson 2 introduce the lost-handbag premise before the dialogue', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');

  assert.equal(unit.experience.correctCueAudioSrc, undefined);
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

test('Lesson 1 and Lesson 2 use one illustrated adult cast and one explorer-cat identity', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const entities = unit.entities;

  const manAsset = {
    entityKind: 'character',
    voiceRole: 'man',
    dialogueSide: 'left',
    assetSrc: '/poc/lesson1-2-experience/assets/character-adult-man-cutout-v1.avif',
    assetFallbackSrc: '/poc/lesson1-2-experience/assets/character-adult-man-cutout-v1.webp'
  };
  const womanAsset = {
    entityKind: 'character',
    voiceRole: 'woman',
    dialogueSide: 'right',
    assetSrc: '/poc/lesson1-2-experience/assets/character-adult-woman-cutout-v1.avif',
    assetFallbackSrc: '/poc/lesson1-2-experience/assets/character-adult-woman-cutout-v1.webp'
  };
  const explorerCatAsset = {
    entityKind: 'character',
    characterIdentityId: 'explorer-cat',
    assetSrc: '/assets/adventure-map/mascot/loader/frame-1-route-page-20260806-01-256.webp',
    assetFallbackSrc: undefined
  };

  for (const entityId of ['station-keeper', 'second-returner']) {
    assert.deepEqual({
      entityKind: entities[entityId].entityKind,
      voiceRole: entities[entityId].voiceRole,
      dialogueSide: entities[entityId].dialogueSide,
      assetSrc: entities[entityId].assetSrc,
      assetFallbackSrc: entities[entityId].assetFallbackSrc
    }, manAsset, entityId);
  }
  for (const entityId of ['handbag-owner', 'first-claimant', 'coat-owner', 'third-claimant']) {
    assert.deepEqual({
      entityKind: entities[entityId].entityKind,
      voiceRole: entities[entityId].voiceRole,
      dialogueSide: entities[entityId].dialogueSide,
      assetSrc: entities[entityId].assetSrc,
      assetFallbackSrc: entities[entityId].assetFallbackSrc
    }, womanAsset, entityId);
  }
  assert.deepEqual({
    entityKind: entities['explorer-cat'].entityKind,
    characterIdentityId: entities['explorer-cat'].characterIdentityId,
    assetSrc: entities['explorer-cat'].assetSrc,
    assetFallbackSrc: entities['explorer-cat'].assetFallbackSrc
  }, explorerCatAsset);
  assert.deepEqual({
    assetSrc: entities.handbag.assetSrc,
    assetFallbackSrc: entities.handbag.assetFallbackSrc
  }, {
    assetSrc: '/poc/lesson1-2-experience/assets/handbag-prop-v1.avif',
    assetFallbackSrc: '/poc/lesson1-2-experience/assets/handbag-prop-v1.webp'
  });
  assert.deepEqual({
    entityKind: entities['cat-guide'].entityKind,
    characterIdentityId: entities['cat-guide'].characterIdentityId,
    assetSrc: entities['cat-guide'].assetSrc,
    assetFallbackSrc: entities['cat-guide'].assetFallbackSrc
  }, explorerCatAsset);
  assert.equal(entities.child.migrationAliasFor, 'explorer-cat');
  assert.equal(entities['cat-guide'].migrationAliasFor, 'explorer-cat');
  for (const microtaskId of ['L02-M11', 'L02-M12', 'L02-M13', 'L02-M14', 'L02-M16', 'L02-M17', 'L02-M18', 'L02-M20']) {
    assert.deepEqual(tasks.get(microtaskId).presentation.characterEntityIds, []);
  }
  assert.deepEqual(tasks.get('L02-M15').presentation.characterEntityIds,
    ['station-keeper', 'handbag-owner']);
  assert.deepEqual(tasks.get('L02-M19').presentation.characterEntityIds,
    ['station-keeper', 'handbag-owner']);
  assert.deepEqual(tasks.get('L02-M21').presentation.characterEntityIds,
    ['handbag-owner']);
  assert.doesNotMatch(JSON.stringify([...tasks.values()]),
    /first-claimant|second-returner|coat-owner|third-claimant|"child"|cat-guide|case-stamp|station-power|opening-lever/);
  assert.ok([
    'first-claimant', 'second-returner', 'coat-owner', 'third-claimant',
    'case-stamp', 'station-power', 'opening-lever'
  ].every(entityId => entities[entityId].activeInExperienceRevision === false));
  assert.equal(entities['route-map'], undefined);
});

test('all eleven textbook objects use illustrated project assets instead of emoji', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const expectedAssets = {
    handbag: 'handbag-prop-v1',
    pen: 'item-pen-v1',
    pencil: 'item-pencil-v1',
    book: 'item-book-v1',
    watch: 'item-watch-v1',
    coat: 'item-coat-v1',
    dress: 'item-dress-v1',
    skirt: 'item-skirt-v1',
    shirt: 'item-shirt-v1',
    car: 'scene-car-v2',
    house: 'scene-house-v2'
  };

  for (const [entityId, basename] of Object.entries(expectedAssets)) {
    const entity = unit.entities[entityId];
    assert.equal(entity.symbol, undefined, entityId);
    assert.equal(entity.assetSrc, `/poc/lesson1-2-experience/assets/${basename}.avif`, entityId);
    assert.equal(entity.assetFallbackSrc, `/poc/lesson1-2-experience/assets/${basename}.webp`, entityId);
  }

  const lessonThreeFour = catalog.getTeachingUnit('NCE-U02');
  assert.match(lessonThreeFour.entities.car.assets.avif, /scene-car-v1\.avif$/);
  assert.match(lessonThreeFour.entities.house.assets.avif, /scene-house-v1\.avif$/);
});

test('car and house use direct homeward scenes without a key or route-map metaphor', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const audioTask = tasks.get('L02-M20');
  const formTask = tasks.get('L02-M21');

  assert.equal(unit.entities['car-key'], undefined);
  assert.equal(unit.entities['house-key'], undefined);
  assert.equal(audioTask.presentation.sceneMode, 'story-journey');
  assert.equal(audioTask.presentation.sceneVariant, 'homeward-scene-identify');
  assert.equal(formTask.presentation.sceneMode, 'story-journey');
  assert.equal(formTask.presentation.sceneVariant, 'homeward-label-journey');
  assert.deepEqual(audioTask.steps[0].optionEntityIds, ['car', 'house']);
  assert.deepEqual(audioTask.steps[0].answerRule.pairs, {
    'L02-W09': 'car',
    'L02-W10': 'house'
  });
  assert.deepEqual(formTask.steps.map(step => step.stepId), ['L02-M21:S01', 'L02-M21:S02']);
  assert.equal(/key|钥匙|route-map|路线图/i.test(JSON.stringify([audioTask, formTask])), false);
});

test('Lesson 1–2 V2.6 uses direct intent, two scene masters, and a real homeward finale', () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = new Map(unit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => [task.microtaskId, task]));
  const audioTask = tasks.get('L02-M20');
  const homewardTask = tasks.get('L02-M21');
  const allChallenges = [...tasks.values()]
    .flatMap(task => task.steps || [])
    .flatMap(step => step.challenges || []);
  const consequentialActions = [...tasks.values()]
    .flatMap(task => task.steps || [])
    .filter(step => step.kind === 'perform-action');

  assert.equal(unit.experience.uiCopy.feedback.labels.correct, undefined);
  assert.doesNotMatch(JSON.stringify(unit.experience.uiCopy), /线索找到了/);
  for (const challenge of allChallenges) {
    assert.equal(challenge.correctFeedback.copy, challenge.targetText, challenge.challengeRef);
  }

  assert.equal(unit.experienceRevision, 'lesson1-2-v2.6');
  assert.deepEqual(Object.keys(unit.experience.sceneFrames.masters), ['portrait', 'wide']);
  assert.deepEqual(unit.experience.sceneFrames.actorSlots, {
    'station-keeper': 'left',
    'handbag-owner': 'right'
  });
  assert.equal(unit.experience.sceneFrames.selectionPolicy, 'responsive-picture');
  assert.equal(unit.experience.sceneFrames.masters.portrait.aspectRatio, '9:19.5');
  assert.equal(unit.experience.sceneFrames.masters.wide.aspectRatio, '16:10');
  assert.deepEqual(unit.experience.sceneFrames.masters.portrait.actorLayout, {
    targetHeightPercent: 38,
    allowedHeightPercentRange: [34, 42],
    groundYPercent: 76
  });
  assert.deepEqual(unit.experience.sceneFrames.masters.wide.actorLayout, {
    targetHeightPercent: 70,
    allowedHeightPercentRange: [65, 75],
    groundYPercent: 100
  });
  assert.deepEqual(unit.experience.sceneFrames.masters.portrait.surfaceAnchors, {
    'counter-surface': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
    'workbench-surface': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
    'coat-rack': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] },
    'story-counter': { xPercent: 50, yPercent: 65, align: 'center-bottom', allowedXPercentRange: [46, 54], allowedYPercentRange: [63, 67], contactBaselinePercent: 65, entityScalePercentRange: [18, 24] }
  });
  assert.deepEqual(unit.experience.sceneFrames.masters.wide.surfaceAnchors, {
    'counter-surface': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
    'workbench-surface': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
    'coat-rack': { xPercent: 50, yPercent: 75, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [73, 77], contactBaselinePercent: 75, entityScalePercentRange: [4, 7] },
    'story-counter': { xPercent: 50, yPercent: 89, align: 'center-bottom', allowedXPercentRange: [47, 53], allowedYPercentRange: [87, 91], contactBaselinePercent: 89, entityScalePercentRange: [4, 7] }
  });
  assert.ok(Object.values(unit.experience.sceneFrames.masters).every(frame => (
    frame.assetSrc.endsWith('.avif')
    && frame.assetFallbackSrc.endsWith('.webp')
    && frame.embeddedEntityIds.length === 0
  )));

  const directChallenges = allChallenges.filter(candidate => (
    ['object-place', 'label-connect'].includes(candidate.interactionPattern)
    || candidate.answerRule?.type === 'match-entity'
  ));
  assert.ok(directChallenges.some(challenge => (
    challenge.interactionPattern === 'scene-identify'
    && challenge.answerRule?.type === 'match-entity'
  )), 'audio-led scene identification must use the same direct-intent contract');
  for (const challenge of directChallenges) {
    assert.equal(challenge.directManipulation, undefined, challenge.challengeRef);
  }
  for (const step of consequentialActions) {
    assert.equal(step.directManipulation, undefined, step.stepId);
    if (step.answerRule?.action === 'give') assert.match(step.actionInstruction, /^点击/);
  }

  assert.equal(unit.entities['route-map'], undefined);
  assert.equal(audioTask.presentation.sceneMode, 'story-journey');
  assert.equal(audioTask.presentation.sceneVariant, 'homeward-scene-identify');
  assert.deepEqual(audioTask.presentation.characterEntityIds, []);
  assert.deepEqual(audioTask.presentation.sceneEntityIds, ['car', 'house']);
  assert.deepEqual(audioTask.steps[0].challenges.map(challenge => ({
    interactionPattern: challenge.interactionPattern,
    targetId: challenge.interactionSemantics.targetId
  })), [
    { interactionPattern: 'scene-identify', targetId: 'car' },
    { interactionPattern: 'scene-identify', targetId: 'house' }
  ]);

  assert.equal(homewardTask.presentation.sceneMode, 'story-journey');
  assert.equal(homewardTask.presentation.sceneVariant, 'homeward-label-journey');
  assert.deepEqual(homewardTask.presentation.characterEntityIds, ['handbag-owner']);
  assert.deepEqual(homewardTask.presentation.sceneEntityIds, ['car', 'house']);
  assert.deepEqual(homewardTask.steps.map(step => step.stepId), ['L02-M21:S01', 'L02-M21:S02']);
  assert.deepEqual(homewardTask.presentation.moments.map(moment => moment.momentId), [
    'car-word-label', 'car-pronunciation', 'owner-boards-car',
    'house-word-label', 'house-pronunciation', 'car-arrives-home', 'save-readback'
  ]);
  assert.deepEqual(
    homewardTask.presentation.moments.find(moment => moment.momentId === 'owner-boards-car').enterWhen,
    { kind: 'step-completed', stepId: 'L02-M21:S01' }
  );
  assert.deepEqual(
    homewardTask.presentation.moments.find(moment => moment.momentId === 'car-arrives-home').enterWhen,
    { kind: 'step-completed', stepId: 'L02-M21:S02' }
  );
  assert.deepEqual(homewardTask.persistence.checkpointFacts, [
    'homeward-labels-complete', 'owner-home-arrival',
    'lesson2-complete', 'unit-results-ready'
  ]);
  assert.deepEqual(homewardTask.persistence.requiredFactIds, [
    'NCE-U01-T01:L02-W09:word-form:recorded',
    'NCE-U01-T01:L02-W10:word-form:recorded'
  ]);
  assert.equal(homewardTask.storyAction, undefined);
  assert.equal(JSON.stringify([audioTask, homewardTask]).includes('route-map'), false);
});

test('microtask v2 catalog validation rejects imperative answers and forged result identities', () => {
  function message(change) {
    const candidate = structuredClone(catalog.getTeachingUnit('NCE-U01'));
    change(candidate);
    return catalog.validate([candidate]).join('\n');
  }

  assert.match(message(unit => {
    unit.beats[0].microtasks[1].steps[0].challenges[0].answerRule.type = 'button-index';
  }), /L01-M08:C01.*declarative answer rule/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[4].steps[1].prompt = '点击 handbag，选出手提包的英文牌';
  }), /L01-M11:S02.*must not disclose accepted English option handbag/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[4].navigationTitle = 'handbag 单词挑战';
  }), /L01-M11:S02.*visible navigation title.*handbag/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].steps[0].challenges[0].candidateSourceRefs = ['L02-W99', 'L01-D01', 'L01-D02'];
  }), /L01-M08:C01.*unknown source L02-W99/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].steps[0].challenges[0].candidateEntityIds[1] = 'unknown-recipient';
  }), /L01-M08:C01.*unknown entity unknown-recipient/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].steps[0].challenges[0].supportLayers.pop();
  }), /L01-M08:C01.*three support layers/i);
  assert.match(message(unit => {
    delete unit.beats[0].microtasks[1].steps[0].challenges[0].correctFeedback;
  }), /L01-M08:C01.*correct and incorrect feedback/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].targetResults[0].reviewCellId = 'page-forged-cell';
  }), /reviewCellId must equal resultId/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].targetResults[0].reviewContextId = 'page-made-context';
  }), /unknown review context page-made-context/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].targetResults[0].contextId = 'page-made-context';
  }), /context page-made-context.*outside/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].steps[1].challenges[0].challengeRef = 'L01-M08:C01';
  }), /L01-M08:C01.*duplicated/i);
  assert.match(message(unit => {
    unit.beats[0].microtasks[1].targetResults[0].challengeRef = 'L01-M08:C99';
  }), /must bind one matching challenge L01-M08:C99/i);
  assert.match(message(unit => {
    unit.beats[1].microtasks[4].knowledgeCardRefs[0] = 'PAGE-ONLY-KNOWLEDGE-CARD';
  }), /L02-M15.*unknown knowledge card PAGE-ONLY-KNOWLEDGE-CARD/i);
  assert.match(message(unit => {
    delete unit.experience.restStops['lesson1-chapter-stop'].restingCopy;
  }), /lesson1-chapter-stop.*restingCopy/i);
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
      if (unit.publicationScope !== 'course-catalog') {
        assert.equal(course, undefined);
        continue;
      }
      assert.equal(course.teachingUnitId, unit.unitId);
    }
  }
});
