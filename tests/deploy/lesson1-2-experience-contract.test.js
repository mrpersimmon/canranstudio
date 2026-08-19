'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');

const REJECTED_CLOTHING_AUDIO = Object.freeze({
  'L02-W05': ['coat', '30adb68433c9bc977115c1ac92de3999e5b82ccb0751d51dbd660558d7587605'],
  'L02-W06': ['dress', 'ba0e499a7f68db4fa709e59e66650ad8d8d18578b4e72cad0f4736c1891d6d44'],
  'L02-W07': ['skirt', '9e5244efc4942471318fd127f524231bd6a90f4b44d3cb8647ccd128912839e8'],
  'L02-W08': ['shirt', '1cb8833562d8af5a01952de030c2219b97cc507a71557d0a32421c2ea2c8308a']
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
  const sources = [
    '/core/curriculum-catalog.js',
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/core/learning-microtask-scene.js',
    '/poc/lesson1-2-experience/experience.js'
  ];
  const scriptOrder = sources.map(source => page.indexOf(`src="${source}"`));
  assert.ok(scriptOrder.every(index => index >= 0));
  assert.deepEqual(scriptOrder, [...scriptOrder].sort((left, right) => left - right));
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
  for (const filename of stageAssetNames.filter(name => name.endsWith('.png'))) {
    const image = sharp(path.join(ROOT, 'poc/lesson1-2-experience/assets', filename));
    const metadata = await image.metadata();
    const stats = await image.stats();
    assert.equal(metadata.hasAlpha, true, filename);
    assert.equal(stats.channels[3].min, 0, filename);
    assert.equal(stats.channels[3].max, 255, filename);
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
  assert.match(runtime, /poc:lesson1-2-experience:v1/);
  assert.match(runtime, /learningMicrotaskScene\.mount/);
  assert.doesNotMatch(
    `${page}\n${runtime}\n${scene}`,
    /Excuse me!|Is this your handbag\?|Thank you very much\.|\bhandbag\b|\bpencil\b/i
  );
  assert.match(scene, /type:\s*['"]response\/submit['"]/);
  assert.match(scene, /type:\s*['"]audio\/ended['"]/);
  assert.match(scene, /type:\s*['"]audio\/failed['"]/);
  assert.doesNotMatch(scene, /toggle-music|ambientAudioSrc/);
  assert.doesNotMatch(scene, /setTimeout\([^)]*audio\/ended|time\/elapsed[\s\S]{0,100}audio\/ended/);
  assert.doesNotMatch(runtime, /\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(|\/api\//);
});

test('the local candidate voice pack covers every catalog audio identity and stays replaceable', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const audioDir = path.join(ROOT, 'poc/lesson1-2-experience/audio');
  const correctCue = await fs.stat(path.join(audioDir, 'correct-chime.mp3'));
  const manifest = JSON.parse(await fs.readFile(path.join(audioDir, 'manifest.json'), 'utf8'));
  const expected = [
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.values(lesson.sources)),
    ...Object.values(unit.authoredContent)
  ].filter(item => item.audioSrc).map(item => ({
    sourceId: item.sourceId || item.contentId,
    path: item.audioSrc
  }));

  assert.equal(manifest.status, 'local-poc-candidate-unreviewed');
  assert.equal(unit.experience.correctCueAudioSrc, '/poc/lesson1-2-experience/audio/correct-chime.mp3');
  assert.ok(correctCue.size > 1_000);
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
    assert.ok(file.durationMs > 500);
    const absolutePath = path.join(ROOT, file.path.replace(/^\//, ''));
    const [stat, bytes] = await Promise.all([fs.stat(absolutePath), fs.readFile(absolutePath)]);
    assert.equal(stat.size, file.bytes);
    assert.ok(stat.size > 10_000);
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
      ['L01-D01', 'man', 'Reed'],
      ['L01-D02', 'woman', 'Samantha'],
      ['L01-D03', 'man', 'Reed'],
      ['L01-D04', 'woman', 'Samantha'],
      ['L01-D05', 'man', 'Reed'],
      ['L01-D06', 'woman', 'Samantha'],
      ['L01-D07', 'woman', 'Samantha']
    ]
  );
});

test('child-rejected clothing pronunciations cannot return to the local voice pack', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const manifest = JSON.parse(await fs.readFile(
    path.join(ROOT, 'poc/lesson1-2-experience/audio/manifest.json'),
    'utf8'
  ));

  for (const [sourceId, [expectedText, rejectedSha256]] of Object.entries(REJECTED_CLOTHING_AUDIO)) {
    const source = unit.lessonContent.lesson2.sources[sourceId];
    const entry = manifest.files.find(file => file.sourceId === sourceId);
    const bytes = await fs.readFile(path.join(ROOT, source.audioSrc.replace(/^\//, '')));
    const actualSha256 = createHash('sha256').update(bytes).digest('hex');

    assert.equal(source.text, expectedText);
    assert.notEqual(actualSha256, rejectedSha256, `${sourceId} restored child-rejected audio`);
    assert.equal(entry.sha256, actualSha256);
    assert.equal(entry.voiceId, 'Samantha');
    assert.equal(entry.engineId, 'macOS-say');
    assert.deepEqual(entry.pronunciationCorrection, {
      locale: 'en-US',
      reason: 'child-playtest-pronunciation-rejection',
      rejectedSha256
    });
  }
});

test('the complete local candidate uses one declared en-US voice system after repeated Kokoro rejection', async () => {
  const unit = catalog.getTeachingUnit('NCE-U01');
  const manifest = JSON.parse(await fs.readFile(
    path.join(ROOT, 'poc/lesson1-2-experience/audio/manifest.json'),
    'utf8'
  ));
  const authoredItems = [
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.values(lesson.sources)),
    ...Object.values(unit.authoredContent)
  ].filter(item => item.audioSrc);
  const itemById = new Map(authoredItems.map(item => [item.sourceId || item.contentId, item]));

  assert.equal(manifest.packId, 'nce-u01-macos-say-candidate-v3');
  assert.deepEqual(manifest.engine, {
    name: 'macOS say',
    locale: 'en-US',
    maleVoice: 'Reed',
    femaleAndWordVoice: 'Samantha',
    outputUseStatus: 'local-poc-only-requires-review'
  });
  assert.equal(manifest.replacesRejectedPackId, 'nce-u01-local-candidate-v2');

  for (const file of manifest.files) {
    const item = itemById.get(file.sourceId);
    const expectedVoice = item.speaker === 'man' || item.kind === 'derived-expression'
      ? 'Reed'
      : 'Samantha';
    assert.equal(file.engineId, 'macOS-say', file.sourceId);
    assert.equal(file.locale, 'en-US', file.sourceId);
    assert.equal(file.voiceId, expectedVoice, file.sourceId);
    assert.ok(Number.isInteger(file.rateWpm), file.sourceId);
    assert.equal(Object.hasOwn(file, 'speed'), false, file.sourceId);
  }
});
