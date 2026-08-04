'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const growthReveal = require('../../core/growth-reveal');

test('reveal model switches between two complete snapshots without movable layers', () => {
  const model = growthReveal.buildRevealModel({
    courses: catalog.COURSES,
    courseId: 'lesson51',
    stageId: 'l3'
  });

  assert.equal(model.courseId, 'lesson51');
  assert.equal(model.stageId, 'l3');
  assert.equal(model.beforeStateAsset.stageCount, 2);
  assert.equal(model.beforeStateAsset.png, 'assets/adventure-map/lesson51/states/state-2.png');
  assert.equal(model.afterStateAsset.stageCount, 3);
  assert.equal(model.afterStateAsset.png, 'assets/adventure-map/lesson51/states/state-3.png');
  assert.equal('baseAsset' in model, false);
  assert.equal('newLayer' in model, false);
  assert.match(model.copy, /四季|季节/);
  assert.equal(model.isFinalStage, false);
  assert.equal(model.souvenir, null);
});

test('final-stage reveal includes the permanent souvenir and completion state', () => {
  const model = growthReveal.buildRevealModel({
    courses: catalog.COURSES,
    courseId: 'lesson49',
    stageId: 'l5'
  });

  assert.equal(model.isFinalStage, true);
  assert.equal(model.beforeStateAsset.stageCount, 4);
  assert.equal(model.afterStateAsset.stageCount, 5);
  assert.equal(model.souvenir.id, 'food-basket');
  assert.match(model.title, /完成|庆典|开张/);
});

test('controller can be imported and created without touching a global document', () => {
  const controller = growthReveal.create({ document: null });
  assert.equal(controller.isOpen(), false);
  assert.equal(controller.open(null), false);
  assert.equal(controller.openWhenReady(null) instanceof Promise, true);
  assert.equal(controller.prepare(null) instanceof Promise, true);
  assert.equal(controller.preloadNext('lesson51') instanceof Promise, true);
  assert.equal(controller.close(), false);
  assert.equal(controller.destroy(), false);
});

test('next-state preloading decodes the nearest responsive AVIF with its content version', async () => {
  const requested = [];
  class FakeImage {
    set src(value) { requested.push(value); }
    decode() { return Promise.resolve(); }
  }
  const state = catalog.requirePublishedCourse('lesson51').map.stateAssets[1];

  assert.equal(await growthReveal.preloadStateAsset(state, {
    ImageCtor: FakeImage,
    targetWidth: 700
  }), true);
  assert.deepEqual(requested, [
    `/assets/adventure-map/lesson51/states/state-1-768.avif?v=${catalog.MAP_STATE_VERSION}`
  ]);
});

test('next-state preloading falls back from AVIF to WebP without requesting every size', async () => {
  const requested = [];
  class FakeImage {
    set src(value) { this.value = value; requested.push(value); }
    decode() {
      return this.value.endsWith(`.avif?v=${catalog.MAP_STATE_VERSION}`)
        ? Promise.reject(new Error('unsupported AVIF'))
        : Promise.resolve();
    }
  }
  const state = catalog.requirePublishedCourse('lesson49').map.stateAssets[2];

  assert.equal(await growthReveal.preloadStateAsset(state, {
    ImageCtor: FakeImage,
    targetWidth: 500
  }), true);
  assert.deepEqual(requested, [
    `/assets/adventure-map/lesson49/states/state-2-512.avif?v=${catalog.MAP_STATE_VERSION}`,
    `/assets/adventure-map/lesson49/states/state-2-512.webp?v=${catalog.MAP_STATE_VERSION}`
  ]);
});
