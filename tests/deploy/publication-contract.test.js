'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

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

test('every published course appears in authored release surfaces', async () => {
  const [home, readme, runbook, nginx] = await Promise.all([
    fs.readFile(path.join(ROOT, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT, 'README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/README.md'), 'utf8'),
    fs.readFile(path.join(ROOT, 'deploy/nginx/canranstudio-http.conf'), 'utf8')
  ]);

  for (const course of PUBLISHED_COURSES) {
    assert.match(home, new RegExp(`href=["']${escapeRegExp(course.route)}["']`), course.id);
    assert.match(readme, new RegExp(escapeRegExp(course.route)), course.id);
    assert.match(runbook, new RegExp(escapeRegExp(course.route)), course.id);
    const slashless = course.route.slice(0, -1);
    assert.match(
      nginx,
      new RegExp(`location\\s*=\\s*${escapeRegExp(slashless)}\\s*\\{[\\s\\S]*?return\\s+308\\s+${escapeRegExp(course.route)};`),
      course.id
    );
  }
});

test('public HTML contains no third-party runtime asset URL', async () => {
  const entries = ['index.html', 'home/index.html',
    ...PUBLISHED_COURSES.map(course => course.entry)];
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
