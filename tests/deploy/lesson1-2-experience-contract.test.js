'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');

test('the Lesson 1–2 review route is isolated from the production release root', async () => {
  const [config, reviewRuntime] = await Promise.all([
    fs.readFile(path.join(
      ROOT,
      'deploy/nginx/canranstudio-lesson-1-2-location.conf'
    ), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-review/review.js'), 'utf8')
  ]);

  assert.match(config, /location\s*=\s*\/poc\/lesson-1-2\s*\{[\s\S]*return\s+308\s+\/poc\/lesson-1-2\/;/);
  assert.match(
    config,
    /location\s*=\s*\/poc\/lesson-1-2\/\s*\{[^}]*rewrite\s+\^\s+\/poc\/lesson-1-2\/poc\/lesson1-2-experience\/index\.html\s+last;/
  );
  assert.match(
    config,
    /location\s*=\s*\/poc\/lesson-1-2\/review\s*\{[^}]*return\s+308\s+\/poc\/lesson-1-2\/review\/;/
  );
  assert.match(
    config,
    /location\s*=\s*\/poc\/lesson-1-2\/review\/\s*\{[^}]*rewrite\s+\^\s+\/poc\/lesson-1-2\/poc\/lesson1-2-review\/index\.html\s+last;/
  );
  assert.doesNotMatch(
    config,
    /alias\s+\/var\/www\/canranstudio-lesson-1-2\/current\/poc\/lesson1-2-experience\/index\.html;/
  );
  for (const prefix of [
    'assets',
    'core',
    'poc/lesson1-2-experience',
    'poc/lesson1-2-review'
  ]) {
    assert.match(config, new RegExp(
      `location\\s+\\^~\\s+\\/poc\\/lesson-1-2\\/${prefix.replaceAll('/', '\\/')}\\/`
    ));
  }
  assert.match(config, /X-Robots-Tag\s+"noindex, nofollow, noarchive"\s+always;/);
  assert.match(config, /sub_filter\s+'"\/core\/'\s+'"\/poc\/lesson-1-2\/core\/'/);
  assert.match(config, /sub_filter\s+'"\/assets\/'\s+'"\/poc\/lesson-1-2\/assets\/'/);
  assert.match(config, /sub_filter\s+'"\/poc\/lesson1-2-experience\/'\s+'"\/poc\/lesson-1-2\/poc\/lesson1-2-experience\/'/);
  assert.match(config, /sub_filter\s+'`\/poc\/lesson1-2-experience\/'\s+'`\/poc\/lesson-1-2\/poc\/lesson1-2-experience\/'/);
  assert.match(config, /sub_filter\s+'"\/poc\/lesson1-2-review\/'\s+'"\/poc\/lesson-1-2\/review\/'/);
  assert.match(config, /sub_filter\s+"'\/poc\/lesson1-2-review\/"\s+"'\/poc\/lesson-1-2\/review\/"/);
  assert.match(config, /sub_filter\s+'`\/poc\/lesson1-2-review\/'\s+'`\/poc\/lesson-1-2\/review\/'/);
  assert.match(reviewRuntime, /href="\/poc\/lesson1-2-experience\/"/);
  const reviewAlias = config.match(
    /location\s+\^~\s+\/poc\/lesson-1-2\/poc\/lesson1-2-review\/\s*\{[\s\S]*?\n\}/
  )?.[0] || '';
  assert.match(
    reviewAlias,
    /sub_filter\s+'"\/poc\/lesson1-2-experience\/'\s+'"\/poc\/lesson-1-2\/'/
  );
  assert.doesNotMatch(reviewAlias, /lesson-1-2\/poc\/lesson1-2-experience/);
  const reviewResponse = [...reviewAlias.matchAll(/sub_filter\s+'([^']*)'\s+'([^']*)';/g)]
    .reduce((body, [, source, target]) => body.replaceAll(source, target), reviewRuntime);
  assert.match(reviewResponse, /href="\/poc\/lesson-1-2\/"/);
  assert.doesNotMatch(reviewResponse, /href="\/poc\/lesson-1-2\/poc\//);
  assert.doesNotMatch(config, /\/var\/www\/canranstudio\/current/);
});

test('the Lesson 1–2 child experience is hidden, catalog-driven, and locally runnable', async () => {
  const [home, page, scene, runtime, background, premiseAvif, premiseJpeg, selectedDesign] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-microtask-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/experience.js'), 'utf8'),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/starlight-station-bg.png')),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.avif')),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.jpg')),
    fs.stat(path.join(ROOT, 'docs/designs/lesson1-2-dialogue-stage-option-1.png'))
  ]);

  assert.match(page, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  const initialSources = [
    '/core/course-package-installer.js',
    '/core/course-package-entry.js'
  ];
  const deferredSources = [
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/core/learning-outcome-practice.js',
    '/core/learning-microtask-scene.js',
    '/poc/lesson1-2-experience/experience.js'
  ];
  const initialScriptOrder = initialSources.map(source => page.indexOf(`src="${source}?v=`));
  const deferredScriptOrder = deferredSources.map(source => page.indexOf(`"${source}?v=`));
  assert.ok(initialScriptOrder.every(index => index >= 0));
  assert.deepEqual(initialScriptOrder, [...initialScriptOrder].sort((left, right) => left - right));
  assert.ok(deferredScriptOrder.every(index => index >= 0));
  assert.deepEqual(deferredScriptOrder, [...deferredScriptOrder].sort((left, right) => left - right));
  assert.doesNotMatch(page, /curriculum-catalog\.js/);
  assert.match(page, /data-course-package-shell[^>]*data-package-state="checking"/);
  assert.match(page, /data-manifest-sha256="[a-f0-9]{64}"/);
  assert.ok(background.size > 100_000);
  assert.ok(premiseAvif.size > 100_000);
  assert.ok(premiseJpeg.size > 100_000);
  assert.ok(selectedDesign.size > 1_000_000);
  const stageAssetNames = [
    ...['character-adult-man-cutout-v1', 'character-adult-woman-cutout-v1']
      .flatMap(base => [`${base}.png`, `${base}.webp`, `${base}.avif`]),
    ...['png', 'webp', 'avif'].map(extension => `handbag-prop-v1.${extension}`)
  ];
  const stageBackgroundNames = ['png', 'webp', 'avif']
    .map(extension => `starlight-station-stage-bg-v1.${extension}`);
  const stageAssetStats = await Promise.all(stageAssetNames.map(filename => fs.stat(path.join(
    ROOT,
    'poc/lesson1-2-experience/assets',
    filename
  ))));
  assert.ok(stageAssetStats.every(stat => stat.size > 50_000));
  const stageBackgroundStats = await Promise.all(stageBackgroundNames.map(filename => fs.stat(path.join(
    ROOT,
    'poc/lesson1-2-experience/assets',
    filename
  ))));
  assert.ok(stageBackgroundStats.every(stat => stat.size > 100_000));
  for (const filename of stageBackgroundNames) {
    const metadata = await sharp(path.join(ROOT, 'poc/lesson1-2-experience/assets', filename)).metadata();
    assert.equal(metadata.width, 1440, filename);
    assert.equal(metadata.height, 1024, filename);
  }
  const responsiveSceneMasters = [
    ['starlight-station-bg-v2-portrait', 1080, 2340],
    ['starlight-station-bg-v2-wide', 1600, 1000]
  ];
  for (const [base, width, height] of responsiveSceneMasters) {
    for (const extension of ['avif', 'webp']) {
      const filename = `${base}.${extension}`;
      const target = path.join(ROOT, 'poc/lesson1-2-experience/assets', filename);
      const [metadata, stat] = await Promise.all([sharp(target).metadata(), fs.stat(target)]);
      assert.deepEqual(
        { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
        { width, height, hasAlpha: false },
        filename
      );
      assert.ok(stat.size > 100_000, filename);
    }
  }
  for (const filename of stageAssetNames.filter(name => name.endsWith('.png'))) {
    const image = sharp(path.join(ROOT, 'poc/lesson1-2-experience/assets', filename));
    const metadata = await image.metadata();
    const stats = await image.stats();
    assert.equal(metadata.hasAlpha, true, filename);
    assert.equal(stats.channels[3].min, 0, filename);
    assert.equal(stats.channels[3].max, 255, filename);
  }
  const transparentItemAssetBases = [
    'item-pen-v1', 'item-pencil-v1', 'item-book-v1', 'item-watch-v1',
    'item-coat-v1', 'item-dress-v1', 'item-skirt-v1', 'item-shirt-v1'
  ];
  for (const base of transparentItemAssetBases) {
    const masterPath = path.join(ROOT, 'poc/lesson1-2-experience/assets', `${base}.png`);
    const master = sharp(masterPath);
    const [masterMetadata, masterStats] = await Promise.all([master.metadata(), master.stats()]);
    assert.deepEqual(
      { width: masterMetadata.width, height: masterMetadata.height, hasAlpha: masterMetadata.hasAlpha },
      { width: 1254, height: 1254, hasAlpha: true },
      base
    );
    assert.equal(masterStats.channels[3].min, 0, base);
    assert.equal(masterStats.channels[3].max, 255, base);
    for (const extension of ['avif', 'webp']) {
      const target = path.join(ROOT, 'poc/lesson1-2-experience/assets', `${base}.${extension}`);
      const [metadata, stat] = await Promise.all([sharp(target).metadata(), fs.stat(target)]);
      assert.deepEqual(
        { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
        { width: 640, height: 640, hasAlpha: true },
        `${base}.${extension}`
      );
      assert.ok(stat.size > 20_000, `${base}.${extension}`);
    }
  }
  for (const base of ['scene-car-v2', 'scene-house-v2']) {
    for (const [extension, size] of [['png', 1254], ['avif', 640], ['webp', 640]]) {
      const target = path.join(ROOT, 'poc/lesson1-2-experience/assets', `${base}.${extension}`);
      const [metadata, stat] = await Promise.all([sharp(target).metadata(), fs.stat(target)]);
      assert.deepEqual(
        { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
        { width: size, height: size, hasAlpha: false },
        `${base}.${extension}`
      );
      assert.ok(stat.size > 20_000, `${base}.${extension}`);
    }
    const { data } = await sharp(path.join(
      ROOT,
      'poc/lesson1-2-experience/assets',
      `${base}.png`
    )).resize(43, 41, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
    const values = [...data];
    const meanLuminance = values.reduce((sum, value) => sum + value, 0) / values.length;
    const darkPixelRatio = values.filter(value => value < 64).length / values.length;
    assert.ok(meanLuminance >= 70, `${base} 43x41 mean luminance ${meanLuminance}`);
    assert.ok(darkPixelRatio <= 0.55, `${base} 43x41 dark-pixel ratio ${darkPixelRatio}`);
  }
  for (const retiredBase of ['item-car-key-v1', 'item-house-key-v1']) {
    for (const extension of ['png', 'avif', 'webp']) {
      await assert.rejects(
        fs.stat(path.join(
          ROOT,
          'poc/lesson1-2-experience/assets',
          `${retiredBase}.${extension}`
        )),
        error => error?.code === 'ENOENT'
      );
    }
  }
  const iconDir = path.join(ROOT, 'poc/lesson1-2-experience/assets/icons');
  for (const filename of [
    'gear-fill.svg', 'play-fill.svg', 'arrow-counterclockwise.svg',
    'arrow-right.svg', 'heart-fill.svg', 'star-fill.svg'
  ]) {
    const svg = await fs.readFile(path.join(iconDir, filename), 'utf8');
    assert.match(svg, /<svg[\s>]/, filename);
    assert.doesNotMatch(svg, /<script|javascript:/i, filename);
  }
  assert.match(
    await fs.readFile(path.join(iconDir, 'BOOTSTRAP-ICONS-LICENSE.txt'), 'utf8'),
    /MIT License/
  );
  for (const removedHumanChildAsset of [
    'character-child-explorer-v1.avif',
    'character-child-explorer-v1.jpg'
  ]) {
    await assert.rejects(
      fs.stat(path.join(
        ROOT,
        'poc/lesson1-2-experience/assets',
        removedHumanChildAsset
      )),
      error => error?.code === 'ENOENT'
    );
  }

  assert.doesNotMatch(home, /lesson1-2-experience/);
  assert.match(runtime, /NCE-U01/);
  assert.doesNotMatch(runtime, /poc:lesson1-2-experience:v1/);
  assert.match(runtime, /unit\.experienceRevision/);
  assert.match(runtime, /storageKey:\s*revisionScopedStorageKey/);
  assert.match(runtime, /learningMicrotaskScene\.mount/);
  assert.doesNotMatch(
    `${page}\n${runtime}\n${scene}`,
    /Excuse me!|Is this your handbag\?|Thank you very much\.|Yes, it is\.|\bhandbag\b|\bpencil\b|\bwatch\b/i
  );
  assert.doesNotMatch(scene, /[\u3400-\u9fff]/,
    'the generic page renderer must not own child-facing course copy');
  assert.match(scene, /type:\s*['"]response\/submit['"]/);
  assert.match(scene, /challengeRef:\s*snapshot\.challengeRef/);
  assert.match(scene, /experienceRevision:\s*snapshot\.experienceRevision/);
  assert.match(scene, /stateVersion:\s*snapshot\.stateVersion/);
  assert.match(scene, /type:\s*['"]audio\/ended['"]/);
  assert.match(scene, /type:\s*['"]audio\/failed['"]/);
  assert.match(scene, /failureKind:\s*['"]transient['"]/);
  assert.match(scene, /type:\s*['"]audio\/retry['"]/);
  assert.match(scene, /segmentId:\s*session\.segmentId/);
  assert.doesNotMatch(scene, /continue-without-sound|audio-continue/);
  assert.match(scene, /snapshot\.audio\?\.manualRetryRequired\s*===\s*true/);
  assert.match(scene, /\['audio-fallback', 'audio-retry', 'audio-failed'\]/);
  assert.match(scene, /source\(step\.answerSourceRef\s*\|\|\s*step\.sourceRef\)/);
  assert.match(scene, /\['persistence-retry', 'answered-awaiting-save', 'unit-verifying'\]/);
  assert.match(scene, /data-action="persistence-retry"/);
  assert.match(scene, /task\.knowledgeCardRefs/);
  assert.match(scene, /knowledgeLayerMarkup/);
  assert.match(scene, /data-action="presentation-end"/);
  assert.match(scene, /moment\?\.advancePolicy\s*!==\s*['"]explicit-child-continue['"]/);
  assert.match(scene, /if\s*\(moment\.advancePolicy\s*===\s*['"]explicit-child-continue['"]\)\s*return;/);
  assert.match(scene, /function\s+explicitPresentationMarkup\(/);
  assert.match(scene, /data-presentation-manual="true"/);
  assert.match(scene, /dialogueAudioPanel\(snapshot,\s*step,\s*adultEntityIds,\s*\{[\s\S]{0,120}completed:\s*true,[\s\S]{0,120}sourceRefs:\s*moment\.visibleLanguageRefs[\s\S]{0,40}\}\)/);
  assert.doesNotMatch(scene, /data-action="knowledge-toggle"/);
  assert.match(scene, /chapter\.restingCopy/);
  assert.doesNotMatch(scene, /下次会从整理室继续/);
  assert.match(scene, /snapshot\.optionIds/);
  assert.match(scene, /snapshot\.challengeRef\s*\|\|\s*snapshot\.challengeIndex/);
  assert.match(scene, /preserveCorrectForFollowingAudio/);
  assert.match(scene, /ui\.feedback\.challengeRef\s*!==\s*snapshot\.challengeRef/);
  assert.match(scene, /type:\s*['"]rescue\/model-ended['"]/);
  assert.match(scene, /snapshot\.phase\s*===\s*['"]rescue-model['"]/);
  assert.match(scene, /snapshot\.rescueUsed\s*\|\|\s*snapshot\.partnerRescueActive/);
  assert.match(scene, /reachedMicrotaskIds/);
  assert.match(scene, /data-action="toggle-stages"/);
  assert.match(scene, /class="stage-map-backdrop"/);
  assert.match(scene, /stageMapOpen/);
  assert.match(scene, /durableLedger\.planReview/);
  assert.match(scene, /class="review-entry"/);
  assert.match(scene, /reviewRun\.href/);
  assert.doesNotMatch(scene, /orderedForRevision/);
  assert.doesNotMatch(scene, /['"]cat-guide['"]/);
  assert.match(scene, /function\s+shouldShowAdventureHearts\(snapshot,\s*step\)/);
  assert.match(
    scene,
    /formal[\s\S]{0,360}'audio-ready'[\s\S]{0,180}'awaiting-response'[\s\S]{0,120}\.includes\(snapshot\.phase\)/
  );
  assert.match(scene, /shouldShowAdventureHearts\(snapshot,\s*step\)\s*\?\s*adventureHeartGauge\(snapshot\)/);
  assert.match(scene, /interactiveSceneStep\s*=\s*snapshot\.phase\s*===\s*['"]awaiting-response['"]/);
  assert.match(scene, /snapshot\.presentationAwaitingEnd\s*!==\s*true/);
  assert.doesNotMatch(scene, /toggle-music|ambientAudioSrc/);
  assert.doesNotMatch(scene, /setTimeout\([^)]*audio\/ended|time\/elapsed[\s\S]{0,100}audio\/ended/);
  assert.doesNotMatch(runtime, /\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(|\/api\//);
  assert.equal(
    (scene.match(/adultEntityIds\.map\(id\s*=>\s*sceneCharacter/g) || []).length,
    1,
    'each adult actor must be rendered exactly once'
  );
  assert.doesNotMatch(scene, /data-drag-source=|data-drop-target=|directDragging|directDropResult/);
  assert.doesNotMatch(scene, /pointerdown|pointermove|pointerup|pointercancel|blank-drop/);
});

test('optional outcome practice is catalog-owned and keeps a complete isolated audio lifecycle', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const [page, bootstrap, scene, practiceModule] = await Promise.all([
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/experience.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-microtask-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-outcome-practice.js'), 'utf8')
  ]);
  const practiceScript = '/core/learning-outcome-practice.js';
  const sceneScript = '/core/learning-microtask-scene.js';
  assert.ok(page.indexOf(`"${practiceScript}?v=`) >= 0);
  assert.ok(page.indexOf(`"${practiceScript}?v=`) < page.indexOf(`"${sceneScript}?v=`));
  assert.match(bootstrap, /outcomePracticeFactory:\s*core\.learningOutcomePractice/);

  const practices = unit.experience.outcomePractices;
  assert.deepEqual(practices.map(practice => [practice.practiceId, practice.kind]), [
    ['L01-RS01:manual-dialogue', 'manual-dialogue'],
    ['NCE-U01-OUTCOME:case-recap', 'case-recap']
  ]);
  const [manualDialogue, caseRecap] = practices;
  const formalRole = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === 'L01-M12').steps[0].practice;
  assert.deepEqual(
    [...new Set(formalRole.rounds.flatMap(round => round.dialogueTurnRefs))],
    Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`)
  );
  assert.deepEqual(
    manualDialogue.dialogueTurnRefs,
    Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`)
  );
  assert.deepEqual(caseRecap.items.map(item => item.promptRef), [
    'NCE-U01-C-RECAP-OWNER', 'NCE-U01-C-RECAP-REPAIR', 'NCE-U01-C-RECAP-ROUTE'
  ]);
  assert.deepEqual([...new Set(caseRecap.items.flatMap(item => [
    item.correctAudioRef,
    ...item.options.map(option => option.sourceRef).filter(Boolean)
  ]))].sort(), [
    'L01-D01', 'L01-D04', 'L01-D06', 'L01-D07', 'L02-W04', 'L02-W09', 'L02-W10'
  ]);
  assert.ok(caseRecap.items.every(item => (
    unit.authoredContent[item.promptRef]?.kind === 'practice-prompt'
  )));

  const catalogOwnedCopy = [
    formalRole.kicker, formalRole.title, formalRole.intro, formalRole.roleSelectionLabel,
    formalRole.completedRoleLabel, formalRole.currentRoleLabel,
    formalRole.currentSpeakerLabel, formalRole.revealLabel,
    formalRole.allCompleteTitle, formalRole.allCompleteCopy,
    formalRole.manualEntryLabel, formalRole.continueCourseLabel,
    ...formalRole.rounds.flatMap(round => [round.title, round.roleBadge, round.instruction]),
    manualDialogue.entryKicker, manualDialogue.entryLabel, manualDialogue.entryHint,
    manualDialogue.kicker, manualDialogue.intro, manualDialogue.revealLabel,
    manualDialogue.hintLabel, manualDialogue.finishedTitle,
    manualDialogue.finishedCopy, manualDialogue.returnStageLabel,
    ...manualDialogue.turnHints.flatMap(hint => [hint.intent, hint.openingChunk]),
    caseRecap.entryKicker, caseRecap.entryLabel, caseRecap.entryHint,
    caseRecap.kicker, caseRecap.intro, caseRecap.nextLabel,
    caseRecap.finishLabel, caseRecap.exitLabel, caseRecap.wrongCopy,
    caseRecap.correctCopy, caseRecap.finishedTitle, caseRecap.finishedCopy,
    caseRecap.returnLabel,
    ...caseRecap.items.map(item => unit.authoredContent[item.promptRef].text)
  ].filter(Boolean);
  const catalogOwnedRefs = [
    ...new Set([
      ...formalRole.rounds.flatMap(round => round.dialogueTurnRefs),
      ...manualDialogue.dialogueTurnRefs,
      ...caseRecap.items.flatMap(item => [
        item.promptRef,
        item.correctAudioRef,
        ...item.options.flatMap(option => [option.sourceRef, option.contentRef]).filter(Boolean)
      ])
    ])
  ];
  const genericSources = `${bootstrap}\n${scene}\n${practiceModule}`;
  assert.doesNotMatch(scene, /[\u3400-\u9fff]/,
    'the generic scene must not own optional-practice child copy');
  assert.doesNotMatch(practiceModule, /[\u3400-\u9fff]/,
    'the isolated practice state machine must not own optional-practice child copy');
  for (const copy of catalogOwnedCopy) {
    assert.equal(genericSources.includes(copy), false, copy);
  }
  for (const ref of catalogOwnedRefs) {
    assert.equal(genericSources.includes(ref), false, ref);
  }

  function functionSection(source, name, nextName) {
    const start = source.indexOf(`function ${name}`);
    const end = source.indexOf(`function ${nextName}`, start + 1);
    assert.ok(start >= 0, `${name} must exist`);
    assert.ok(end > start, `${name} must end before ${nextName}`);
    return source.slice(start, end);
  }
  const identityFields = ['practiceSessionId', 'stateVersion', 'requestId', 'segmentId'];
  const identityValidator = functionSection(practiceModule, 'validateAudioAction', 'audioEnded');
  for (const field of identityFields) assert.match(identityValidator, new RegExp(`action\\.${field}`));
  const endedHandler = functionSection(practiceModule, 'audioEnded', 'audioFailed');
  const failedHandler = functionSection(practiceModule, 'audioFailed', 'retryAudio');
  assert.match(endedHandler, /validateAudioAction\(action\)/);
  assert.match(failedHandler, /validateAudioAction\(action\)/);
  const retryHandler = functionSection(practiceModule, 'retryAudio', 'next');
  assert.ok(
    /validateAudioAction\(action\)/.test(retryHandler)
      || identityFields.every(field => retryHandler.includes(`action.${field}`)),
    'audio retry must validate the full practice audio identity'
  );
  const cancelHandler = functionSection(practiceModule, 'cancelEffect', 'exit');
  assert.match(cancelHandler, /type:\s*['"]practice\/audio-cancel['"]/);
  for (const field of identityFields) assert.match(cancelHandler, new RegExp(`${field}:`));
  assert.match(practiceModule, /action\.type\s*===\s*['"]audio\/ended['"]/);
  assert.match(practiceModule, /action\.type\s*===\s*['"]audio\/failed['"]/);
  assert.match(practiceModule, /action\.type\s*===\s*['"]audio\/retry['"]/);

  assert.match(scene, /function\s+processPracticeEffects\s*\(/);
  assert.match(scene, /type\s*===\s*['"]practice\/audio-play['"]/);
  assert.match(scene, /type\s*===\s*['"]practice\/audio-cancel['"]/);
  function assertSceneIdentityWiring(marker, extraToken) {
    const windows = [];
    let offset = 0;
    while (offset < scene.length) {
      const index = scene.indexOf(marker, offset);
      if (index < 0) break;
      windows.push(scene.slice(Math.max(0, index - 1200), index + 1600));
      offset = index + marker.length;
    }
    assert.ok(windows.some(window => (
      window.includes(extraToken)
      && identityFields.every(field => window.includes(field))
    )), `${marker} must wire practice session/state/request/segment identity`);
  }
  assertSceneIdentityWiring("'audio/ended'", 'outcomePracticeRuntime');
  assertSceneIdentityWiring("'audio/failed'", 'outcomePracticeRuntime');
  assertSceneIdentityWiring("'audio/retry'", 'outcomePracticeRuntime');
  assertSceneIdentityWiring("'practice/audio-cancel'", 'pauseVoice');

  const replayStart = scene.indexOf("if (action === 'replay')");
  const replayEnd = scene.indexOf("if (action === 'persistence-retry')", replayStart);
  assert.ok(replayStart >= 0 && replayEnd > replayStart);
  const replayHandler = scene.slice(replayStart, replayEnd);
  assert.match(replayHandler, /stageMapOpen\s*=\s*true/);
  assert.doesNotMatch(replayHandler, /localStorage\.removeItem|location\.reload\s*\(/);
  assert.match(scene, /href="\$\{escapeHtml\(complete\.leaveHref\s*\|\|\s*['"]\/['"]\)\}"/);
  assert.equal(unit.experience.completion.leaveHref, '/');
});

test('the V2 page consumes authored presentation moments and durable save recovery', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  const [scene, css] = await Promise.all([
    fs.readFile(path.join(ROOT, 'core/learning-microtask-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/experience.css'), 'utf8')
  ]);

  assert.deepEqual(
    Object.fromEntries(tasks.map(task => [task.microtaskId, task.presentation.sceneMode])),
    {
      'L01-M07': 'dialogue-stage',
      'L01-M08': 'dialogue-stage',
      'L01-M09': 'dialogue-stage',
      'L01-M10': 'dialogue-stage',
      'L01-M11': 'dialogue-stage',
      'L01-M12': 'dialogue-stage',
      'L02-M11': 'object-workbench',
      'L02-M12': 'object-workbench',
      'L02-M13': 'object-workbench',
      'L02-M14': 'object-workbench',
      'L02-M15': 'grammar-lab',
      'L02-M16': 'object-workbench',
      'L02-M17': 'object-workbench',
      'L02-M18': 'object-workbench',
      'L02-M19': 'object-workbench',
      'L02-M20': 'story-journey',
      'L02-M21': 'story-journey'
    }
  );

  assert.match(scene, /snapshot\.currentPresentationMomentId/);
  assert.match(scene, /task\.presentation\?\.moments/);
  assert.match(scene, /moment\.participantEntityIds/);
  assert.match(scene, /moment\?\.focusEntityIds/);
  assert.match(scene, /moment\.visibleLanguageRefs/);
  assert.match(scene, /data-presentation-moment=/);
  assert.match(scene, /data-scene-variant=/);
  assert.match(scene, /data-primary-motion=/);
  assert.match(scene, /data-end-state=/);
  assert.match(scene, /type:\s*['"]presentation\/ended['"]/);
  assert.match(scene, /(?:animationend|transitionend)/);
  assert.match(scene, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(scene, /microtaskId[\s\S]{0,120}(?:dialogue-stage|object-workbench|grammar-lab|route-investigation)/);

  assert.match(scene, /outbox:\s*activeOutbox/);
  assert.match(scene, /createRuntime\(ledger,\s*durableStore\)/);
  assert.match(scene, /type:\s*['"]navigation\/open-stage['"]/);
  assert.match(scene, /type:\s*['"]navigation\/exit-sandbox['"]/);
  assert.match(scene, /shouldShowAdventureHearts\(snapshot,\s*step\)/);
  assert.match(scene, /audio\/suspend/);
  assert.match(scene, /audio\/resume/);
  assert.match(scene, /presentationArmGeneration/);
  assert.match(scene, /dialogueFollowEnabled/);
  assert.match(scene, /step\.currentSegmentHighlight\s*===\s*true/);
  assert.doesNotMatch(scene, /textVisibility\s*===\s*['"]visible-during-listen['"]/);
  assert.doesNotMatch(scene, /route-map-visual/);
  assert.match(scene, /function\s+sceneFramePicture\(/);
  assert.doesNotMatch(scene, /data-drag-source=|data-drop-target=/);
  assert.doesNotMatch(scene, /pointerdown|pointermove|pointerup|pointercancel|blank-drop/);
  assert.match(scene, /data-action="\$\{requiredAudioBlocked \? 'audio-play' : 'free-audio'\}"/);
  assert.match(scene, /aria-label="\$\{escapeHtml\(requiredAudioBlocked[\s\S]{0,180}languageAudioCopy\.replayLabel/);
  assert.match(scene, /starlight-audio-replay-v1\.png/);
  assert.doesNotMatch(scene, />重新播放英文</);
  assert.doesNotMatch(scene, /看着英文听一遍/);
  assert.match(scene, /function\s+startFreeVoiceSequence\(/);
  assert.match(scene, /data-action="dialogue-replay"/);
  assert.match(scene, /class="dialogue-complete-actions"/);
  assert.doesNotMatch(scene, /completionStatus|dialogue-complete-hint/);
  assert.match(scene, /class="feedback-mission-bar__copy"/);

  assert.match(
    css,
    /\.station-header\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;/s,
    'the reached-stage entry must remain in the child viewport after dialogue following scrolls the page'
  );
  assert.match(
    css,
    /\.dialogue-listen--complete\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/s,
    'the completed transcript must stop reserving a narrow desktop side rail'
  );
  assert.match(
    css,
    /\.dialogue-player--complete\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*grid-row:\s*2;/s,
    'the completed hint and actions must form a full-width footer below the transcript'
  );
  assert.match(css, /\.support-guidance\s*\{/);

  for (const mode of [
    'dialogue-stage', 'object-workbench', 'grammar-lab', 'story-journey'
  ]) {
    assert.match(css, new RegExp(`data-scene-mode=["']${mode}["']`), mode);
  }
  assert.match(css, /is-moment-focus/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('the local candidate voice pack covers every catalog audio identity and stays replaceable', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const audioDir = path.join(ROOT, 'poc/lesson1-2-experience/audio');
  const manifest = JSON.parse(await fs.readFile(path.join(audioDir, 'manifest.json'), 'utf8'));
  const expected = [
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.values(lesson.sources)),
    ...Object.values(unit.authoredContent)
  ].filter(item => item.audioSrc).map(item => ({
    sourceId: item.sourceId || item.contentId,
    path: item.audioSrc
  }));

  assert.equal(manifest.status, 'local-poc-candidate-unreviewed');
  assert.equal(manifest.voiceBaselineId, unit.voiceBaselineId);
  assert.equal(unit.experience.correctCueAudioSrc, undefined);
  await assert.rejects(
    fs.stat(path.join(audioDir, 'correct-chime.mp3')),
    error => error?.code === 'ENOENT'
  );
  assert.equal(manifest.replacementContract.scope, 'whole-unit-pack');
  assert.equal(manifest.files.length, expected.length);
  assert.equal(new Set(manifest.files.map(file => file.sourceId)).size, expected.length);
  assert.ok(manifest.files.every(file => !Object.hasOwn(file, 'text')));
  assert.deepEqual(
    manifest.files.map(file => [file.sourceId, file.path]).sort(),
    expected.map(file => [file.sourceId, file.path]).sort()
  );

  for (const file of manifest.files) {
    assert.match(file.catalogTextSha256, /^[a-f0-9]{64}$/);
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
    assert.equal(file.reviewStatus, 'unreviewed-candidate');
    assert.ok(file.durationMs >= 500);
    const absolutePath = path.join(ROOT, file.path.replace(/^\//, ''));
    const [stat, bytes] = await Promise.all([fs.stat(absolutePath), fs.readFile(absolutePath)]);
    assert.equal(stat.size, file.bytes);
    assert.ok(stat.size > 6_000);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
  }

  assert.equal(unit.experience.ambientAudioSrc, undefined);
  await assert.rejects(
    fs.stat(path.join(audioDir, 'starlight-station-ambience.mp3')),
    error => error?.code === 'ENOENT'
  );
});

test('the Lesson 1 dialogue voice pack follows the textbook speakers through the final thanks', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const baseline = catalog.getCourseVoiceBaseline(unit.voiceBaselineId);
  const sources = unit.lessonContent.lesson1.sources;
  const manifest = JSON.parse(await fs.readFile(
    path.join(ROOT, 'poc/lesson1-2-experience/audio/manifest.json'),
    'utf8'
  ));
  const voiceBySource = new Map(manifest.files.map(file => [file.sourceId, file.voiceId]));

  assert.deepEqual(
    ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07']
      .map(sourceId => [sourceId, sources[sourceId].speaker, voiceBySource.get(sourceId)]),
    [
      ['L01-D01', 'man', 'am_michael'],
      ['L01-D02', 'woman', 'af_heart'],
      ['L01-D03', 'man', 'am_michael'],
      ['L01-D04', 'woman', 'af_heart'],
      ['L01-D05', 'man', 'am_michael'],
      ['L01-D06', 'woman', 'af_heart'],
      ['L01-D07', 'woman', 'af_heart']
    ]
  );

  const audioItems = [
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.values(lesson.sources)),
    ...Object.values(unit.authoredContent)
  ].filter(item => item.audioSrc);
  for (const item of audioItems) {
    const sourceId = item.sourceId || item.contentId;
    const expectedVoiceId = item.speaker === 'man'
      ? baseline.youthMaleVoiceId
      : item.speaker === 'woman'
        ? baseline.youthFemaleVoiceId
        : item.kind === 'derived-expression'
          ? baseline.youthMaleVoiceId
          : baseline.standaloneWordVoiceId;
    assert.equal(voiceBySource.get(sourceId), expectedVoiceId, sourceId);
  }
});

test('the local voice pack keeps the selected youth voices with the accepted onset cleanup', async () => {
  const manifest = JSON.parse(await fs.readFile(
    path.join(ROOT, 'poc/lesson1-2-experience/audio/manifest.json'),
    'utf8'
  ));
  const voiceFileFingerprint = manifest.files.map(({
    sourceId, path: audioPath, voiceId, renderMode, speed, sha256, bytes, durationMs
  }) => ({ sourceId, path: audioPath, voiceId, renderMode, speed, sha256, bytes, durationMs }));
  const canonicalVoiceFileSha256 = createHash('sha256')
    .update(JSON.stringify(voiceFileFingerprint))
    .digest('hex');

  assert.equal(manifest.packId, 'nce-u01-kokoro-candidate-v3');
  assert.equal(manifest.voiceBaselineId, 'nce-youth-v1');
  assert.equal(manifest.engine.name, 'Kokoro');
  assert.deepEqual(manifest.processing, {
    profileId: 'instructional-onset-v1',
    silenceThresholdDb: -45,
    decodedOnsetLimitMs: 150,
    leadingSilenceKeptMs: 100,
    trailingSilenceKeptMs: 240,
    standaloneWordRenderMode: 'context-cropped-lexeme-v1'
  });
  assert.equal(
    canonicalVoiceFileSha256,
    '8a4f7d9840c72714d11f879d2070b75a5a9ca45ec3d985bb49709739de8d9411'
  );
});

test('standalone words use the human-selected context-cropped C rendering', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const manifest = JSON.parse(await fs.readFile(
    path.join(ROOT, 'poc/lesson1-2-experience/audio/manifest.json'),
    'utf8'
  ));
  const fileBySource = new Map(manifest.files.map(file => [file.sourceId, file]));
  const standaloneSources = Object.values(unit.lessonContent)
    .flatMap(lesson => Object.values(lesson.sources))
    .filter(source => ['vocabulary', 'substitution-item'].includes(source.sourceKind));

  assert.equal(standaloneSources.length, 21);
  for (const source of standaloneSources) {
    const file = fileBySource.get(source.sourceId);
    assert.equal(file.voiceId, 'af_heart', source.sourceId);
    assert.equal(file.renderMode, 'context-cropped-lexeme-v1', source.sourceId);
    assert.equal(file.speed, 1, source.sourceId);
  }
  assert.deepEqual(
    ['L02-W05', 'L02-W06', 'L02-W07', 'L02-W08']
      .map(sourceId => [sourceId, fileBySource.get(sourceId).sha256]),
    [
      ['L02-W05', '78aaeced5faf1da980fa52bffecaa54a6f903c8da5d5ceb37a1a199ebfe5d36a'],
      ['L02-W06', '0b97030065844fb780e7d1a25e0a190da9aefe554fd020f18efd6f4a007793bf'],
      ['L02-W07', '152519e2a59eaa4d3f4918c994be85d005c92c974bc1e638daf44f916e902534'],
      ['L02-W08', '189312ec8ff5c13cdfeff053e72559d2e1a4137950eaad5549a3ecab6a2137e2']
    ]
  );
});
