'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const { MAP_STATE_VERSION } = require('../../core/course-catalog');

const ROOT = path.resolve(__dirname, '../..');
const STATE_DIR = path.join(ROOT, 'assets/adventure-map/lesson51/states');
const TEMPLE_ANCHOR = { left: 440, top: 130, width: 310, height: 310 };
const WEATHER_STATION_ANCHOR = { left: 150, top: 35, width: 210, height: 330 };
const COURSE_ANCHORS = {
  lesson49: { left: 280, top: 60, width: 420, height: 250 },
  lesson50: { left: 420, top: 280, width: 160, height: 180 },
  lesson51: TEMPLE_ANCHOR,
  lesson52: { left: 520, top: 220, width: 170, height: 130 },
  lesson53: { left: 270, top: 300, width: 170, height: 180 },
  lesson54: { left: 650, top: 150, width: 160, height: 220 },
  soundmark: { left: 420, top: 240, width: 180, height: 250 }
};
const EXPECTED_STATE_COUNTS = {
  lesson49: 6,
  lesson50: 6,
  lesson51: 6,
  lesson52: 6,
  lesson53: 6,
  lesson54: 6,
  soundmark: 5
};
const ATLAS_BACKGROUND_WIDTHS = [512, 914];

async function normalizedAnchor(stageCount, anchor = TEMPLE_ANCHOR, courseId = 'lesson51') {
  const { data } = await sharp(path.join(
    ROOT,
    `assets/adventure-map/${courseId}/states/state-${stageCount}.png`
  ))
    .extract(anchor)
    .flatten({ background: '#ead5a1' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const values = [...data];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const deviation = Math.sqrt(
    values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length
  ) || 1;
  return values.map(value => (value - mean) / deviation);
}

async function normalizedCoarseAnchor(stageCount, anchor, courseId) {
  const { data } = await sharp(path.join(
    ROOT,
    `assets/adventure-map/${courseId}/states/state-${stageCount}.png`
  ))
    .extract(anchor)
    .flatten({ background: '#ead5a1' })
    .blur(8)
    .resize(48, 48, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const values = [...data];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const deviation = Math.sqrt(
    values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length
  ) || 1;
  return values.map(value => (value - mean) / deviation);
}

function correlation(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0) / left.length;
}

test('Lesson 51 publishes six complete responsive snapshots from one fixed composition', async () => {
  const manifest = JSON.parse(await fs.readFile(path.join(STATE_DIR, 'manifest.json'), 'utf8'));
  assert.equal(manifest.sourceMode, 'full-state-snapshots');
  assert.match(manifest.invariant, /no runtime layer composition/);
  assert.deepEqual(manifest.states.map(state => state.stageCount), [0, 1, 2, 3, 4, 5]);

  for (const state of manifest.states) {
    const metadata = await sharp(path.join(ROOT, state.png)).metadata();
    assert.deepEqual(
      { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
      { width: 1024, height: 1024, hasAlpha: true }
    );
    assert.deepEqual(state.variants.map(variant => variant.width), [512, 768, 1024]);
    for (const variant of state.variants) {
      await Promise.all([
        fs.access(path.join(ROOT, variant.avif)),
        fs.access(path.join(ROOT, variant.webp))
      ]);
    }
  }
});

test('the authored atlas background has responsive high-quality AVIF and WebP derivatives', async () => {
  const source = path.join(ROOT, 'assets/adventure-map/atlas/warm-lantern-parchment.jpg');
  const sourceStat = await fs.stat(source);
  for (const width of ATLAS_BACKGROUND_WIDTHS) {
    const height = Math.round(width * 1721 / 914);
    for (const format of ['avif', 'webp']) {
      const target = path.join(
        ROOT,
        `assets/adventure-map/atlas/warm-lantern-parchment-${MAP_STATE_VERSION}-${width}.${format}`
      );
      const [metadata, stat] = await Promise.all([sharp(target).metadata(), fs.stat(target)]);
      assert.deepEqual(
        { format: metadata.format, width: metadata.width, height: metadata.height },
        { format: format === 'avif' ? 'heif' : format, width, height }
      );
      assert.ok(stat.size < sourceStat.size, `${path.basename(target)} did not reduce transfer size`);
    }
  }
});

test('adjacent Lesson 51 snapshots keep the temple anchor aligned instead of moving loose layers', async () => {
  const anchors = await Promise.all(Array.from({ length: 6 }, (_, index) => (
    normalizedAnchor(index)
  )));
  for (let index = 0; index < anchors.length - 1; index += 1) {
    assert.ok(
      correlation(anchors[index], anchors[index + 1]) >= 0.9,
      `state-${index} and state-${index + 1} moved the fixed temple anchor`
    );
  }
});

test('the Lesson 51 weather instrument stays physically attached at one fixed anchor', async () => {
  const anchors = await Promise.all([1, 2, 3, 4, 5].map(index => (
    normalizedAnchor(index, WEATHER_STATION_ANCHOR)
  )));
  for (let index = 0; index < anchors.length - 1; index += 1) {
    assert.ok(
      correlation(anchors[index], anchors[index + 1]) >= 0.98,
      `state-${index + 1} and state-${index + 2} moved the attached weather instrument`
    );
  }
});

test('the retired Lesson 51 layer-composition review path cannot show a stale six-state sheet', async () => {
  const canonical = await sharp(path.join(
    ROOT,
    'docs/designs/adventure-map/lesson51-state-snapshots-contact-sheet.png'
  )).raw().toBuffer({ resolveWithObject: true });
  const compatibility = await sharp(path.join(
    ROOT,
    'docs/designs/adventure-map/lesson51-growth-contact-sheet.png'
  )).raw().toBuffer({ resolveWithObject: true });

  assert.deepEqual(compatibility.info, canonical.info);
  assert.deepEqual(compatibility.data, canonical.data);
});

test('every published landmark is a progressive locked-mother state chain with responsive derivatives', async () => {
  for (const [courseId, expectedCount] of Object.entries(EXPECTED_STATE_COUNTS)) {
    const directory = path.join(ROOT, `assets/adventure-map/${courseId}/states`);
    const manifest = JSON.parse(await fs.readFile(path.join(directory, 'manifest.json'), 'utf8'));
    assert.equal(manifest.sourceMode, 'full-state-snapshots', courseId);
    assert.equal(manifest.contentVersion, MAP_STATE_VERSION, courseId);
    assert.match(manifest.invariant, /locked[\s\S]*progressively/i, courseId);
    assert.match(manifest.invariant, /no independently generated states/i, courseId);
    assert.deepEqual(
      manifest.states.map(state => state.stageCount),
      Array.from({ length: expectedCount }, (_, index) => index),
      courseId
    );

    for (const state of manifest.states) {
      const metadata = await sharp(path.join(ROOT, state.png)).metadata();
      assert.deepEqual(
        { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
        { width: 1024, height: 1024, hasAlpha: true },
        `${courseId} state-${state.stageCount}`
      );
      assert.deepEqual(state.variants.map(variant => variant.width), [512, 768, 1024]);
      for (const variant of state.variants) {
        await Promise.all([
          fs.access(path.join(ROOT, variant.avif)),
          fs.access(path.join(ROOT, variant.webp))
        ]);
      }
    }
  }
});

test('every published landmark keeps its primary building anchor stable between adjacent states', async () => {
  const failures = [];
  for (const [courseId, anchor] of Object.entries(COURSE_ANCHORS)) {
    const count = EXPECTED_STATE_COUNTS[courseId];
    const anchors = await Promise.all(Array.from({ length: count }, (_, index) => (
      normalizedCoarseAnchor(index, anchor, courseId)
    )));
    for (let index = 0; index < anchors.length - 1; index += 1) {
      const similarity = correlation(anchors[index], anchors[index + 1]);
      // Low-frequency comparison ignores new props and watercolor grain while
      // still detecting a moved, rescaled, or re-framed base building.
      if (similarity < 0.82) {
        failures.push(
          `${courseId} state-${index} and state-${index + 1}: ${similarity.toFixed(3)}`
        );
      }
    }
  }
  assert.deepEqual(failures, [], `moved primary building anchors:\n${failures.join('\n')}`);
});
