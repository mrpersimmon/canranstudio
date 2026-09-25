'use strict';
const UNITS = Array.from({ length: 15 }, (_, i) => `unit${i * 2 + 1}-${i * 2 + 2}`).concat('unit49-50');
const RETIRED = ['lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'];
module.exports = { UNITS: Object.freeze(UNITS), RETIRED: Object.freeze(RETIRED) };
