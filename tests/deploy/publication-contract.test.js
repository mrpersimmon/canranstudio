'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');
const courseCatalog = require('../../core/course-catalog');
const homeFallback = require('../../scripts/home-course-fallback');

const ROOT = path.resolve(__dirname, '../..');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function markdownFilesUnder(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFilesUnder(entryPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  }));
  return nested.flat();
}

test('every published course appears in the shared home catalog and authored release surfaces', async () => {
  const [readme, runbook, nginx] = await Promise.all([
    fs.readFile(path.join(ROOT, 'README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/nginx/canranstudio-http.conf'), 'utf8')
  ]);

  for (const course of PUBLISHED_COURSES) {
    assert.equal(
      courseCatalog.HOME_COURSES.some(homeCourse => homeCourse.id === course.id),
      true,
      course.id
    );
    assert.match(readme, new RegExp(escapeRegExp(course.route)), course.id);
    assert.match(runbook, new RegExp(escapeRegExp(course.route)), course.id);
  }

  // The bare-IP :80 endpoint redirects every request to the canonical HTTPS
  // origin, which owns per-course routing. Only assert the redirect target here.
  assert.match(
    nginx,
    /return\s+301\s+https:\/\/www\.canranstudio\.cn\$request_uri/
  );
});

test('README describes the current atlas-only cumulative-state publication contract', async () => {
  const readme = await fs.readFile(path.join(ROOT, 'README.md'), 'utf8');

  assert.match(readme, /`\/` — 十二城区冒险图鉴世界总览/);
  assert.match(readme, /Lesson 49–54 六个编号课程地点与音标魔法乐园专项支线/);
  assert.match(readme, /同一高清母版逐步编辑的完整累计状态图/);
  assert.match(readme, /运行时只加载当前状态的一张图/);
  assert.match(readme, /完成阶段时切换成长前后\s*两张完整图/);
  assert.doesNotMatch(readme, /一张固定底图和独立的阶段成长图层/);
  assert.doesNotMatch(readme, /Lesson 49 and Lesson 51 are the current published learning locations/);
  assert.doesNotMatch(readme, /Lesson 49 uses\s+one cumulative landmark snapshot/);
});

test('home renders only published map locations and contains no course-directory fallback', async () => {
  const home = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');

  assert.match(home, /courseCatalog\.MAP_COURSES/);
  assert.match(home, /href="\$\{location\.route\}"/);
  assert.equal(homeFallback.synchronizeFallback(home), home);
  const authoredHome = homeFallback.withoutGeneratedFallback(home);
  assert.deepEqual(
    homeFallback.anchorHrefs(authoredHome).filter(href => /^\/(?:lesson\d+|soundmark)\/$/.test(href)),
    []
  );
  assert.doesNotMatch(home, /course-catalog-fallback:(?:start|end)/);
  assert.doesNotMatch(home, /找指定课号|番外站 · 专项技能|继续学习/);
});

test('a future shared-catalog course does not create a second homepage entrance', async () => {
  const home = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  const future = structuredClone(PUBLISHED_COURSES.find(course => course.id === 'lesson50'));
  future.id = 'lesson61';
  future.lesson = 61;
  future.route = '/lesson61/';
  future.title = '未来课程示例';

  const synchronized = homeFallback.synchronizeFallback(home, [...PUBLISHED_COURSES, future]);
  assert.equal(synchronized, home);
  assert.doesNotMatch(synchronized, /href="\/lesson61\/"/);
});

test('authored fallback guard recognizes browser-parsed course href variants', () => {
  const variants = [
    '<a href = "/lesson61/">future</a>',
    '<a\n href=/lesson61/>future</a>',
    '<a href="&#47;lesson61&#47;">future</a>',
    '<a href="&#47lesson61&#47">future</a>',
    '<a href="&sol;lesson61&sol;">future</a>',
    '<a title="x>y" href="/lesson61/">future</a>'
  ];
  for (const source of variants) {
    assert.deepEqual(homeFallback.anchorHrefs(source), ['/lesson61/']);
  }
});

test('public HTML contains no third-party runtime asset URL', async () => {
  const entries = ['index.html', 'home/index.html',
    ...PUBLISHED_COURSES.map(course => course.entry),
    ...courseCatalog.PRESENTATION_COURSES.map(course => course.presentation.entry)];
  const runtimeTag = /<(script|link|img|audio|video|source)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi;
  const external = [];

  for (const entry of entries) {
    const html = await fs.readFile(path.join(ROOT, entry), 'utf8');
    for (const match of html.matchAll(runtimeTag)) {
      if (/^(?:https?:)?\/\//i.test(match[2])) {
        external.push({ entry, tag: match[1], url: match[2] });
      }
    }
  }

  assert.deepEqual(external, []);
});

test('repository publication documentation contains no stale transport-risk ID', async () => {
  const staleId = ['H', '01'].join('-');
  const documentation = [
    path.join(ROOT, 'README.md'),
    path.join(ROOT, 'deploy/README.md'),
    ...await markdownFilesUnder(path.join(ROOT, 'docs'))
  ];
  const staleReferences = [];

  for (const file of documentation) {
    const content = await fs.readFile(file, 'utf8');
    if (content.includes(staleId)) {
      staleReferences.push(path.relative(ROOT, file));
    }
  }

  assert.deepEqual(staleReferences, []);
});
