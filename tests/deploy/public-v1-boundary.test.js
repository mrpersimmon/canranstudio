'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  assertIndexableHtml,
  assertPublicV1Boundary,
  assertSameOriginResources,
  assertStaticRuntimeSource
} = require('../../scripts/public-v1-boundary');

const ROOT = path.resolve(__dirname, '../..');

function publicHtml(body = '<main>公开课程</main>') {
  return `<!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>灿然英语公开课程</title>
      </head>
      <body>${body}</body>
    </html>`;
}

test('repository public runtime satisfies the static V1 boundary', async () => {
  await assert.doesNotReject(assertPublicV1Boundary({ root: ROOT }));
});

test('indexing contract rejects redirects, noindex, and credential gates', () => {
  assert.doesNotThrow(() => assertIndexableHtml(publicHtml(), 'valid'));
  assert.throws(
    () => assertIndexableHtml(publicHtml('<meta name="robots" content="noindex">'), 'robots'),
    /must not opt out/
  );
  assert.throws(
    () => assertIndexableHtml(publicHtml('<meta http-equiv="refresh" content="0; url=/hidden/">'), 'redirect'),
    /must not require a redirect/
  );
  assert.throws(
    () => assertIndexableHtml(publicHtml('<input type="password">'), 'password'),
    /must not require account credentials/
  );
  assert.throws(
    () => assertIndexableHtml(publicHtml('<p>请输入授权码后使用</p>'), 'code'),
    /must not expose a credential gate/
  );
});

test('runtime contract rejects application services, cookies, analytics, and hidden identity', () => {
  const forbidden = [
    ['fetch("/api/progress")', /application service request/],
    ['document.cookie = "auth=1"', /cookie runtime/],
    ['navigator.sendBeacon("/analytics", body)', /application service request/],
    ['localStorage.setItem("visitorId", crypto.randomUUID())', /hidden identity field/],
    ['navigator.serviceWorker.register("/worker.js")', /non-V1 client persistence/]
  ];
  for (const [source, message] of forbidden) {
    assert.throws(() => assertStaticRuntimeSource(source, 'fixture.js'), message);
  }
  assert.doesNotThrow(() => assertStaticRuntimeSource(
    'localStorage.setItem("canran:adventure-profile:v1", JSON.stringify({ currentDistrictId: null }))',
    'device-profile.js'
  ));
  assert.doesNotThrow(() => assertStaticRuntimeSource(
    'navigator.serviceWorker.register("/core/course-package-service-worker.js"); fetch("/course-package-manifest.json")',
    'course-package-entry.js',
    { allowCoursePackage: true }
  ));
  assert.throws(
    () => assertStaticRuntimeSource(
      'fetch("/api/progress")',
      'course-package-entry.js',
      { allowCoursePackage: true }
    ),
    /application endpoint/
  );
  assert.throws(
    () => assertStaticRuntimeSource(
      'indexedDB.open("course")',
      'course-package-entry.js',
      { allowCoursePackage: true }
    ),
    /non-V1 client persistence/
  );
});

test('public resources reject cross-origin runtime dependencies', () => {
  assert.doesNotThrow(() => assertSameOriginResources(
    '<link rel="stylesheet" href="/assets/fonts/fonts.css"><img src="data:image/png;base64,AA==">',
    'valid.html'
  ));
  assert.throws(
    () => assertSameOriginResources(
      '<script title="comparison is x>y" src="https://example.com/analytics.js"></script>',
      'external.html'
    ),
    /must remain same-origin/
  );
  assert.throws(
    () => assertSameOriginResources('<img src="//example.com/pixel.gif">', 'pixel.html'),
    /must remain same-origin/
  );
});
