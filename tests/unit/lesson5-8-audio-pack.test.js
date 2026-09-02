'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const catalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');
const CASES = [
  ['NCE-U03', 'poc/lesson5-6-experience/audio', 50],
  ['NCE-U04', 'poc/lesson7-8-experience/audio', 47]
];
const sha256 = value => createHash('sha256').update(value).digest('hex');

for (const [unitId, relativeAudioDir, expectedCount] of CASES) {
  test(`${unitId} candidate audio is complete, stable, and technically gated`, async () => {
    const unit = catalog.getTeachingUnit(unitId);
    const audioDir = path.join(ROOT, relativeAudioDir);
    const manifest = JSON.parse(await fs.readFile(path.join(audioDir, 'manifest.json'), 'utf8'));
    const sources = Object.values(unit.lessonContent)
      .flatMap(lesson => Object.values(lesson.sources))
      .filter(source => source.audioSrc);
    const sourceById = new Map(sources.map(source => [source.sourceId, source]));

    assert.equal(manifest.unitId, unitId);
    assert.equal(manifest.packId, unit.audioReviewContract.packId);
    assert.equal(manifest.voiceBaselineId, 'nce-youth-v1');
    assert.equal(manifest.generationBasis, 'nce-u01-kokoro-candidate-v3');
    assert.equal(manifest.status, 'local-poc-candidate-unreviewed');
    assert.match(manifest.disclosure, /AI.*不是教材官方录音/);
    assert.equal(sources.length, expectedCount);
    assert.equal(manifest.files.length, expectedCount);
    assert.equal(manifest.canonicalAudioSetSha256, unit.audioReviewContract.canonicalAudioSetSha256);
    assert.equal(
      sha256(JSON.stringify(manifest.files.map(file => file.sha256))),
      unit.audioReviewContract.canonicalAudioSetSha256
    );

    const expectedNames = sources.map(source => `${source.sourceId.toLowerCase()}.mp3`).sort();
    const actualNames = (await fs.readdir(audioDir)).filter(name => name.endsWith('.mp3')).sort();
    assert.deepEqual(actualNames, expectedNames);

    for (const file of manifest.files) {
      const source = sourceById.get(file.sourceId);
      assert.ok(source, file.sourceId);
      assert.equal(file.catalogTextSha256, sha256(source.text), file.sourceId);
      assert.equal(file.path, source.audioSrc, file.sourceId);
      assert.equal(file.voiceId, source.voiceId, file.sourceId);
      assert.equal(file.renderMode, source.audioRenderMode, file.sourceId);
      assert.equal(file.reviewStatus, 'unreviewed-candidate', file.sourceId);
      assert.ok(file.decodedOnsetMs <= 150, file.sourceId);
      assert.ok(file.durationMs >= 400, file.sourceId);
      assert.ok(file.bytes > 5_000, file.sourceId);
      const bytes = await fs.readFile(path.join(ROOT, file.path.replace(/^\//, '')));
      assert.equal(bytes.length, file.bytes, file.sourceId);
      assert.equal(sha256(bytes), file.sha256, file.sourceId);
    }
  });
}
