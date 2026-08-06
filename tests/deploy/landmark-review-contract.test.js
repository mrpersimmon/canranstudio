'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('the landmark review bench is a hidden noindex POC route', async () => {
  const [home, reviewPage, runtime] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/landmark-review/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/landmark-review/landmark-review.js'), 'utf8')
  ]);

  assert.match(reviewPage, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  assert.match(reviewPage, /\/core\/course-catalog\.js/);
  assert.match(reviewPage, /\/core\/adventure-atlas\.js/);
  assert.doesNotMatch(home, /\/poc\/landmark-review\//);
  assert.doesNotMatch(runtime, /localStorage|sessionStorage|document\.cookie/);
  assert.doesNotMatch(runtime, /\/api\//);
});
