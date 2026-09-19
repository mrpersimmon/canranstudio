'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const RETIRED_START_MARKER = '<!-- course-catalog-fallback:start -->';
const RETIRED_END_MARKER = '<!-- course-catalog-fallback:end -->';

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

function isStudentCourseRoute(href) {
  return /^\/(?:lesson\d+|soundmark)\/$/.test(href);
}

function assertCourseHome(source) {
  if (typeof source !== 'string') throw new TypeError('index.html source must be a string');
  if (source.includes(RETIRED_START_MARKER) || source.includes(RETIRED_END_MARKER)) {
    throw new Error('retired course fallback markers must not appear in the course home');
  }
  const authoredCourseRoutes = anchorHrefs(source).filter(isStudentCourseRoute);
  const published = new Set(require('../core/course-catalog').PUBLISHED_COURSES.map(course => course.route));
  const unavailable = authoredCourseRoutes.filter(route => !published.has(route));
  if (unavailable.length) {
    throw new Error(`course home links to unavailable courses: ${unavailable.join(', ')}`);
  }
  return source;
}

function generatedLinks() {
  return '';
}

function synchronizeFallback(source) {
  return assertCourseHome(source);
}

function withoutGeneratedFallback(source) {
  return assertCourseHome(source);
}

async function syncHomeFallback({ root = path.resolve(__dirname, '..') } = {}) {
  const file = path.join(root, 'index.html');
  const source = await fs.readFile(file, 'utf8');
  assertCourseHome(source);
  return false;
}

if (require.main === module) {
  syncHomeFallback()
    .then(() => process.stdout.write('course home contains only available course links\n'))
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
  assertCourseHome,
  syncHomeFallback
};
