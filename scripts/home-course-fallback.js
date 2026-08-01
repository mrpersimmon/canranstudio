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
  return value.replace(/&#(\d+);?|&#x([a-f0-9]+);?|&(amp|quot|apos|lt|gt|sol);/gi,
    (entity, decimal, hexadecimal) => {
      if (decimal) return String.fromCodePoint(Number(decimal));
      if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      return {
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&lt;': '<',
        '&gt;': '>',
        '&sol;': '/'
      }[entity.toLowerCase()] || entity;
    });
}

function tagEnd(source, start) {
  let quote = null;
  for (let cursor = start; cursor < source.length; cursor += 1) {
    const character = source[cursor];
    if (quote) {
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return cursor;
    }
  }
  return -1;
}

function hrefsFromAnchorTag(tag, nameEnd) {
  const hrefs = [];
  let cursor = nameEnd;
  const end = tag.length - 1;

  while (cursor < end) {
    while (cursor < end && /[\s/]/.test(tag[cursor])) cursor += 1;
    const attributeStart = cursor;
    while (cursor < end && !/[\s=/>]/.test(tag[cursor])) cursor += 1;
    if (cursor === attributeStart) {
      cursor += 1;
      continue;
    }

    const name = tag.slice(attributeStart, cursor).toLowerCase();
    while (cursor < end && /\s/.test(tag[cursor])) cursor += 1;
    if (tag[cursor] !== '=') continue;
    cursor += 1;
    while (cursor < end && /\s/.test(tag[cursor])) cursor += 1;

    let value;
    if (tag[cursor] === '"' || tag[cursor] === "'") {
      const quote = tag[cursor];
      const valueStart = ++cursor;
      while (cursor < end && tag[cursor] !== quote) cursor += 1;
      value = tag.slice(valueStart, cursor);
      if (tag[cursor] === quote) cursor += 1;
    } else {
      const valueStart = cursor;
      while (cursor < end && !/[\s>]/.test(tag[cursor])) cursor += 1;
      value = tag.slice(valueStart, cursor);
    }

    if (name === 'href') hrefs.push(decodeHtmlAttribute(value));
  }

  return hrefs;
}

function anchorHrefs(source) {
  const hrefs = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start < 0) break;
    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      cursor = commentEnd < 0 ? source.length : commentEnd + 3;
      continue;
    }

    const nameMatch = /^<([a-z][^\s/>]*)/i.exec(source.slice(start));
    if (!nameMatch) {
      cursor = start + 1;
      continue;
    }
    const end = tagEnd(source, start + nameMatch[0].length);
    if (end < 0) break;
    if (nameMatch[1].toLowerCase() === 'a') {
      const tag = source.slice(start, end + 1);
      hrefs.push(...hrefsFromAnchorTag(tag, nameMatch[0].length));
    }
    cursor = end + 1;
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
