'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('Lesson 1–2 cross-day review is a hidden catalog-driven runtime page', async () => {
  const [page, script, styles, favicon] = await Promise.all([
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-review/index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-review/review.js'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-review/review.css'), 'utf8'),
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-review/favicon.svg'), 'utf8')
  ]);

  assert.match(page, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i);
  assert.doesNotMatch(page, /<title>[^<]+<\/title>/,
    'the static shell must not own authored page title copy');
  assert.match(page, /<link\s+rel="icon"\s+href="\/poc\/lesson-1-2\/review-files\/favicon\.svg"/i);
  assert.match(favicon, /^<svg[\s\S]*<path\b[\s\S]*<\/svg>\s*$/);
  const sources = [
    '/poc/lesson-1-2/core/curriculum-catalog.js',
    '/poc/lesson-1-2/core/learning-store.js',
    '/poc/lesson-1-2/core/learning-ledger.js',
    '/poc/lesson-1-2/core/learning-review-runtime.js',
    '/poc/lesson-1-2/review-files/review.js'
  ];
  const positions = sources.map(source => page.indexOf(`src="${source}`));
  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));

  assert.doesNotMatch(script, /[\u3400-\u9fff]/,
    'the page adapter must not own Chinese child-facing copy');
  assert.doesNotMatch(
    script,
    /Excuse me!|Is this your handbag\?|Thank you very much\.|Yes, it is\.|\bhandbag\b|\bpencil\b|\bwatch\b/i
  );
  assert.match(script, /getTeachingUnit\??\.\(UNIT_ID\)/);
  assert.match(script, /unit\.experienceRevision/);
  assert.match(script, /learningLedger\.open/);
  assert.match(script, /learningReviewRuntime\.create/);
  assert.match(script, /runtime\.enter\(/);
  assert.match(script, /runtime\.defer\(/);
  assert.match(script, /reviewAction\(['"]audio\/ended['"]/);
  assert.match(script, /requestId:\s*session\.requestId/);
  assert.match(script, /segmentId:\s*session\.segmentId/);
  assert.match(script, /effect\.visibleText/);
  assert.match(script, /AbortError/);
  assert.match(script, /['"]aborted['"]\s*:\s*['"]transient['"]/);
  assert.match(script, /reviewAction\(['"]audio\/retry['"]/);
  assert.doesNotMatch(script, /continue-without-sound|audio-continue/);
  assert.match(script, /reviewContextId/);
  assert.match(script, /candidateEntityIds/);
  assert.match(script, /candidateSourceRefs/);
  assert.match(script, /candidateContentRefs/);
  assert.match(script, /interaction\.selectExpression/);
  assert.match(script, /context\.backdropAssetSrc/);
  assert.match(script, /context\.backdropPosition/);
  assert.match(script, /--review-context-backdrop/);
  assert.match(script, /audio-paused/);
  assert.match(script, /\['supporting',\s*'rescue-model'\]/);
  assert.match(script, /data-review-empty/);
  assert.match(script, /data-review-rescue/);

  assert.match(styles, /@media\s*\(max-width:\s*520px\)/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /min-height:\s*100(?:dvh|svh)/);
  assert.doesNotMatch(styles, /overflow-x:\s*(?:auto|scroll)/);
  assert.doesNotMatch(styles, /data-change-type/,
    'review visuals must not route course assets from changeType selectors');
  assert.doesNotMatch(styles, /url\(["']?\/poc\/lesson1-2-experience\/assets\//,
    'review CSS must not own course-specific asset paths');
  assert.match(styles, /var\(--review-context-backdrop/);
});
