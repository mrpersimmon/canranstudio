'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');

test('the Lesson 1–2 child experience is hidden, catalog-driven, and locally runnable', async () => {
  const [home, page, scene, runtime, background, premiseAvif, premiseJpeg] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-microtask-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/experience.js'), 'utf8'),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/starlight-station-bg.png')),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.avif')),
    fs.stat(path.join(ROOT, 'poc/lesson1-2-experience/assets/premise-handbag-arrival-v1.jpg'))
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
  const manifest = JSON.parse(await fs.readFile(path.join(audioDir, 'manifest.json'), 'utf8'));
  const expected = [
    ...Object.values(unit.lessonContent).flatMap(lesson => Object.values(lesson.sources)),
    ...Object.values(unit.authoredContent)
  ].filter(item => item.audioSrc).map(item => ({
    sourceId: item.sourceId || item.contentId,
    path: item.audioSrc
  }));

  assert.equal(manifest.status, 'local-poc-candidate-unreviewed');
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
    const stat = await fs.stat(path.join(ROOT, file.path.replace(/^\//, '')));
    assert.equal(stat.size, file.bytes);
    assert.ok(stat.size > 10_000);
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
      ['L01-D01', 'man', 'am_michael'],
      ['L01-D02', 'woman', 'af_heart'],
      ['L01-D03', 'man', 'am_michael'],
      ['L01-D04', 'woman', 'af_heart'],
      ['L01-D05', 'man', 'am_michael'],
      ['L01-D06', 'woman', 'af_heart'],
      ['L01-D07', 'woman', 'af_heart']
    ]
  );
});
