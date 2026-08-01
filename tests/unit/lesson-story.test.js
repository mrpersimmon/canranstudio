'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const { lesson50Opening } = require('../../core/lesson-story');

test('Lesson 50 has a complete standalone opening without any souvenir', () => {
  const opening = lesson50Opening({ version: 1, souvenirs: [] });

  assert.equal(opening.variant, 'standalone');
  assert.equal(opening.souvenir, null);
  assert.match(opening.title, /挑食小王子/);
  assert.match(opening.body, /不用准备任何道具/);
  assert.equal(opening.skipLabel, null);
  assert.equal(Object.isFrozen(opening), true);
});

test('the food basket adds a brief optional Lesson 49 bridge without changing the lesson', () => {
  const foodBasket = catalog.requirePublishedCourse('lesson49').map.souvenir;
  const opening = lesson50Opening({
    version: 1,
    souvenirs: [foodBasket.id]
  });

  assert.deepEqual(opening, {
    variant: 'basket',
    eyebrow: '从暖灯集市来到城堡',
    title: '篮子里的香味，飘进了城堡',
    body: '你带着在肉店冒险中获得的食物篮子来到城堡。挑食小王子探出头来：这次，我们一起看看他喜欢什么吧！',
    startLabel: '🧺 带着篮子开始',
    skipLabel: '跳过小故事，直接开始',
    souvenir: {
      id: foodBasket.id,
      title: foodBasket.title,
      asset: `/${foodBasket.asset}`
    }
  });
  assert.equal(Object.isFrozen(opening), true);
  assert.equal(Object.isFrozen(opening.souvenir), true);
});

test('unknown or malformed souvenir data never invents the connected opening', () => {
  const foodBasketId = catalog.requirePublishedCourse('lesson49').map.souvenir.id;
  assert.equal(lesson50Opening({ souvenirs: ['unknown-token'] }).variant, 'standalone');
  assert.equal(lesson50Opening({ souvenirs: foodBasketId }).variant, 'standalone');
  assert.equal(lesson50Opening(null).variant, 'standalone');
});
