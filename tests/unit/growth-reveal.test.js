'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const growthReveal = require('../../core/growth-reveal');

test('reveal model separates previous layers from the newly earned layer', () => {
  const model = growthReveal.buildRevealModel({
    courses: catalog.COURSES,
    courseId: 'lesson51',
    stageId: 'l3'
  });

  assert.equal(model.courseId, 'lesson51');
  assert.equal(model.stageId, 'l3');
  assert.equal(model.baseAsset, 'assets/adventure-map/lesson51/landmark-base.png');
  assert.deepEqual(model.beforeLayers, [
    'assets/adventure-map/lesson51/growth-01-weather.png',
    'assets/adventure-map/lesson51/growth-02-theatre.png'
  ]);
  assert.equal(model.newLayer, 'assets/adventure-map/lesson51/growth-03-seasons.png');
  assert.deepEqual(model.afterLayers, [
    'assets/adventure-map/lesson51/growth-01-weather.png',
    'assets/adventure-map/lesson51/growth-02-theatre.png',
    'assets/adventure-map/lesson51/growth-03-seasons.png'
  ]);
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
  assert.equal(model.afterLayers.length, 5);
  assert.equal(model.souvenir.id, 'food-basket');
  assert.match(model.title, /完成|庆典|开张/);
});

test('controller can be imported and created without touching a global document', () => {
  const controller = growthReveal.create({ document: null });
  assert.equal(controller.isOpen(), false);
  assert.equal(controller.open(null), false);
  assert.equal(controller.close(), false);
  assert.equal(controller.destroy(), false);
});
