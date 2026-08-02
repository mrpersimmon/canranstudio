'use strict';

function course({ id, route, entry, assetDirectories, title }) {
  return Object.freeze({
    id,
    route,
    entry,
    assetDirectories: Object.freeze([...assetDirectories]),
    title
  });
}

const PUBLISHED_COURSES = Object.freeze([
  course({
    id: 'lesson49',
    route: '/lesson49/',
    entry: 'lesson49/index.html',
    assetDirectories: ['lesson49/audio'],
    title: '肉店大冒险'
  }),
  course({
    id: 'lesson50',
    route: '/lesson50/',
    entry: 'lesson50/index.html',
    assetDirectories: ['lesson50/audio'],
    title: '挑食小王子大冒险'
  }),
  course({
    id: 'soundmark',
    route: '/soundmark/',
    entry: 'soundmark/index.html',
    assetDirectories: ['soundmark/audio'],
    title: '音标魔法乐园'
  }),
  course({
    id: 'lesson51',
    route: '/lesson51/',
    entry: 'lesson51/index.html',
    assetDirectories: ['lesson51/audio'],
    title: '希腊四季之旅'
  }),
  course({
    id: 'lesson52',
    route: '/lesson52/',
    entry: 'lesson52/index.html',
    assetDirectories: ['lesson52/audio'],
    title: '环球护照之旅 Ⅰ'
  }),
  course({
    id: 'lesson53',
    route: '/lesson53/',
    entry: 'lesson53/index.html',
    assetDirectories: ['lesson53/audio'],
    title: '英伦气候小主播'
  }),
  course({
    id: 'lesson54',
    route: '/lesson54/',
    entry: 'lesson54/index.html',
    assetDirectories: ['lesson54/audio'],
    title: '环球护照之旅 Ⅱ'
  })
]);

module.exports = { PUBLISHED_COURSES };
