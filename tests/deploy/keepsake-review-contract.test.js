'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('the keepsake review bench is a hidden noindex POC route', async () => {
  const [home, reviewPage, runtime] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/keepsake-review/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/keepsake-review/keepsake-review.js'), 'utf8')
  ]);

  assert.match(reviewPage, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  assert.doesNotMatch(home, /\/poc\/keepsake-review\//);
  assert.doesNotMatch(runtime, /localStorage|sessionStorage|document\.cookie/);
  assert.doesNotMatch(runtime, /\/api\//);
});
