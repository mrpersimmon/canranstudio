'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('the learning-runtime review is hidden, noindex, and isolated from production state', async () => {
  const [home, reviewPage, reviewRuntime] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/learning-runtime-review/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/learning-runtime-review/review.js'), 'utf8')
  ]);

  assert.match(reviewPage, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  for (const source of [
    '/core/curriculum-catalog.js',
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js'
  ]) {
    assert.match(reviewPage, new RegExp(`<script[^>]+src=["']${source.replaceAll('/', '\\/')}["']`, 'i'));
  }
  const scriptOrder = [
    '/core/curriculum-catalog.js',
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/poc/learning-runtime-review/review.js'
  ].map(source => reviewPage.indexOf(`src="${source}"`));
  assert.ok(scriptOrder.every(index => index >= 0), 'all review scripts must be present');
  assert.deepEqual(scriptOrder, [...scriptOrder].sort((left, right) => left - right));
  assert.doesNotMatch(home, /\/poc\/learning-runtime-review\//);
  assert.doesNotMatch(reviewRuntime, /localStorage|sessionStorage|document\.cookie|indexedDB/);
  assert.doesNotMatch(reviewRuntime, /\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(|\/api\//);
  assert.match(reviewRuntime, /createMemoryAdapter/);
  assert.doesNotMatch(reviewRuntime, /type:\s*['"]answer\/submit['"][\s\S]{0,220}\bcorrect\s*:/);
  assert.doesNotMatch(reviewRuntime, /type:\s*['"]answer\/submit['"][\s\S]{0,220}\btargetId\s*:/);
  assert.doesNotMatch(reviewRuntime, /type:\s*['"]answer\/submit['"][\s\S]{0,220}\bevidenceMode\s*:/);
});
