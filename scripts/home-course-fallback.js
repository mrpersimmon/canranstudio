'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('../core/course-catalog');

const START_MARKER = '<!-- course-catalog-fallback:start -->';
const END_MARKER = '<!-- course-catalog-fallback:end -->';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function courseLabel(course) {
  return course.kind === 'lesson'
    ? `Lesson ${course.lesson} · ${course.title}`
    : `番外站 · ${course.title}`;
}

function generatedLinks(courses = PUBLISHED_COURSES) {
  return courses
    .filter(course => course.directoryVisible && course.route)
    .map(course => `    <a href="${escapeHtml(course.route)}">${escapeHtml(courseLabel(course))}</a>`)
    .join('\n');
}

function markerBounds(source) {
  const start = source.indexOf(START_MARKER);
  const end = source.indexOf(END_MARKER);
  if (start < 0 || end < 0 || end <= start ||
    source.indexOf(START_MARKER, start + START_MARKER.length) >= 0 ||
    source.indexOf(END_MARKER, end + END_MARKER.length) >= 0) {
    throw new Error('index.html must contain exactly one ordered course fallback marker pair');
  }
  return { start: start + START_MARKER.length, end };
}

function synchronizeFallback(source, courses = PUBLISHED_COURSES) {
  const bounds = markerBounds(source);
  return `${source.slice(0, bounds.start)}\n${generatedLinks(courses)}\n    ${source.slice(bounds.end)}`;
}

function withoutGeneratedFallback(source) {
  const bounds = markerBounds(source);
  return `${source.slice(0, bounds.start)}\n    ${source.slice(bounds.end)}`;
}

function decodeHtmlAttribute(value) {
  return value.replace(/&(?:#(\d+)|#x([a-f0-9]+)|amp|quot|apos|lt|gt);/gi, entity => {
    const decimal = /^&#(\d+);$/i.exec(entity);
    if (decimal) return String.fromCodePoint(Number(decimal[1]));
    const hexadecimal = /^&#x([a-f0-9]+);$/i.exec(entity);
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal[1], 16));
    return { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }[entity.toLowerCase()] || entity;
  });
}

function anchorHrefs(source) {
  const hrefs = [];
  const anchors = source.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi);
  for (const anchor of anchors) {
    hrefs.push(decodeHtmlAttribute(anchor[1] ?? anchor[2] ?? anchor[3] ?? ''));
  }
  return hrefs;
}

async function syncHomeFallback({ root = path.resolve(__dirname, '..') } = {}) {
  const file = path.join(root, 'index.html');
  const source = await fs.readFile(file, 'utf8');
  const synchronized = synchronizeFallback(source);
  if (synchronized !== source) await fs.writeFile(file, synchronized);
  return synchronized !== source;
}

if (require.main === module) {
  syncHomeFallback()
    .then(changed => process.stdout.write(changed ? 'updated generated home fallback\n' : 'home fallback already current\n'))
    .catch(error => {
      process.stderr.write(`${error.stack || error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = {
  generatedLinks,
  synchronizeFallback,
  withoutGeneratedFallback,
  anchorHrefs,
  syncHomeFallback
};
