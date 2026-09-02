'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');
const AUDIO_DIR = path.join(ROOT, 'poc/lesson3-4-experience/audio');
function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

test('Lesson 3–4 candidate audio inherits the accepted voices and passes technical gates', async () => {
  const unit = catalog.getTeachingUnit('NCE-U02');
  const manifest = JSON.parse(await fs.readFile(path.join(AUDIO_DIR, 'manifest.json'), 'utf8'));
  const sources = Object.values(unit.lessonContent)
    .flatMap(lesson => Object.values(lesson.sources))
    .filter(source => source.audioSrc);
  const sourceById = new Map(sources.map(source => [source.sourceId, source]));
  const acceptedAudioSetSha256 = unit.audioReviewContract.canonicalAudioSetSha256;

  assert.equal(manifest.packId, 'nce-u02-kokoro-candidate-v1');
  assert.equal(manifest.unitId, 'NCE-U02');
  assert.equal(manifest.voiceBaselineId, 'nce-youth-v1');
  assert.equal(manifest.generationBasis, 'nce-u01-kokoro-candidate-v3');
  assert.equal(manifest.status, 'local-poc-candidate-unreviewed');
  assert.equal(manifest.engine.modelRevision, 'f3ff3571791e39611d31c381e3a41a3af07b4987');
  assert.equal(manifest.engine.deterministicSeed, 0);
  assert.equal(manifest.canonicalAudioSetSha256, acceptedAudioSetSha256);
  assert.match(manifest.disclosure, /AI.*不是教材官方录音/);
  assert.deepEqual(manifest.voiceAssignment, {
    visitor: 'am_michael',
    cloakroomAttendant: 'af_heart',
    substitutionPrompt: 'am_michael',
    standaloneWord: 'af_heart'
  });
  assert.deepEqual(manifest.processing, {
    profileId: 'instructional-onset-v1',
    silenceThresholdDb: -45,
    decodedOnsetLimitMs: 150,
    leadingSilenceKeptMs: 100,
    trailingSilenceKeptMs: 240,
    standaloneWordRenderMode: 'context-cropped-lexeme-v1'
  });
  assert.equal(sources.length, 42);
  assert.equal(manifest.files.length, sources.length);
  assert.equal(new Set(manifest.files.map(file => file.sourceId)).size, sources.length);
  assert.equal(
    sha256(JSON.stringify(manifest.files.map(file => file.sha256))),
    acceptedAudioSetSha256
  );

  const expectedMp3Names = sources.map(source => `${source.sourceId.toLowerCase()}.mp3`).sort();
  const actualMp3Names = (await fs.readdir(AUDIO_DIR))
    .filter(name => name.endsWith('.mp3'))
    .sort();
  assert.deepEqual(actualMp3Names, expectedMp3Names);

  for (const file of manifest.files) {
    const source = sourceById.get(file.sourceId);
    assert.ok(source, file.sourceId);
    assert.equal(Object.hasOwn(file, 'text'), false, file.sourceId);
    assert.equal(file.catalogTextSha256, sha256(source.text), file.sourceId);
    assert.equal(file.path, source.audioSrc, file.sourceId);
    assert.equal(file.voiceId, source.voiceId, file.sourceId);
    assert.equal(file.renderMode, source.audioRenderMode, file.sourceId);
    assert.equal(file.reviewStatus, 'unreviewed-candidate', file.sourceId);
    assert.ok(file.decodedOnsetMs <= 150, file.sourceId);
    assert.ok(file.durationMs >= 500, file.sourceId);
    assert.ok(file.bytes > 6_000, file.sourceId);
    assert.match(file.sha256, /^[a-f0-9]{64}$/, file.sourceId);

    const absolutePath = path.join(ROOT, file.path.replace(/^\//, ''));
    const bytes = await fs.readFile(absolutePath);
    assert.equal(bytes.length, file.bytes, file.sourceId);
    assert.equal(sha256(bytes), file.sha256, file.sourceId);
  }
});

test('Lesson 3 dialogue roles and Lesson 4 prompts cannot drift to a different timbre', async () => {
  const unit = catalog.getTeachingUnit('NCE-U02');
  const manifest = JSON.parse(await fs.readFile(path.join(AUDIO_DIR, 'manifest.json'), 'utf8'));
  const fileBySource = new Map(manifest.files.map(file => [file.sourceId, file]));
  const lesson3 = unit.lessonContent.lesson3.sources;
  const lesson4 = unit.lessonContent.lesson4.sources;
  const ids = (prefix, count) => Array.from(
    { length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, '0')}`
  );

  for (const sourceId of ids('L03-D', 12)) {
    const source = lesson3[sourceId];
    const file = fileBySource.get(sourceId);
    assert.equal(file.speaker, source.speaker, sourceId);
    assert.equal(file.speakerRole, source.speakerRole, sourceId);
    assert.equal(file.voiceId, source.speakerRole === 'visitor' ? 'am_michael' : 'af_heart');
    assert.equal(file.renderMode, 'natural-utterance', sourceId);
    assert.equal(file.speed, 0.9, sourceId);
  }
  for (const sourceId of ids('L04-P', 15)) {
    const file = fileBySource.get(sourceId);
    assert.equal(file.voiceId, 'am_michael', sourceId);
    assert.equal(file.renderMode, 'natural-utterance', sourceId);
    assert.equal(file.speed, 0.9, sourceId);
  }
  for (const sourceId of [...ids('L03-W', 10), ...ids('L04-W', 5)]) {
    const file = fileBySource.get(sourceId);
    assert.equal(file.voiceId, 'af_heart', sourceId);
    assert.equal(file.renderMode, 'context-cropped-lexeme-v1', sourceId);
    assert.equal(file.speed, 1, sourceId);
  }
});
