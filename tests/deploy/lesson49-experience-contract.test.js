'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('the Lesson 49 child experience is a hidden local-runtime route with no review controls', async () => {
  const [home, page, scene, runtime] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson49-experience/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-scene.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson49-experience/experience.js'), 'utf8')
  ]);

  assert.match(page, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  const sources = [
    '/core/curriculum-catalog.js',
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/core/audio-player.js',
    '/core/learning-scene.js',
    '/poc/lesson49-experience/experience.js'
  ];
  const scriptOrder = sources.map(source => page.indexOf(`src="${source}"`));
  assert.ok(scriptOrder.every(index => index >= 0), 'all child-experience scripts must be present');
  assert.deepEqual(scriptOrder, [...scriptOrder].sort((left, right) => left - right));

  assert.doesNotMatch(home, /\/poc\/lesson49-experience\//);
  assert.doesNotMatch(page, /data-review-controls|data-state-controls|data-viewport-controls/);
  assert.match(runtime, /poc:lesson49-experience:v1/);
  assert.match(runtime, /learningScene\.mount/);
  assert.doesNotMatch(runtime, /What does Mr\. Bird like|Beef, please|husband|a pound of mince/i);
  assert.match(scene, /type:\s*['"]response\/submit['"]/);
  assert.doesNotMatch(runtime, /type:\s*['"]answer\/submit['"][\s\S]{0,220}\bcorrect\s*:/);
  assert.doesNotMatch(runtime, /type:\s*['"]answer\/submit['"][\s\S]{0,220}\btargetId\s*:/);
  assert.doesNotMatch(runtime, /\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(|\/api\//);
});
