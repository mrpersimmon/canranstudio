'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { PUBLISHED_COURSES } = require('./course-registry');

const FORBIDDEN_RUNTIME = Object.freeze([
  {
    label: 'application service request',
    pattern: /\b(?:EventSource|WebSocket|XMLHttpRequest|fetch|sendBeacon)\b/
  },
  {
    label: 'cookie runtime',
    pattern: /\b(?:cookieStore|document\s*\.\s*cookie)\b/
  },
  {
    label: 'non-V1 client persistence',
    pattern: /\b(?:indexedDB|sessionStorage|serviceWorker)\b/
  },
  {
    label: 'authentication secret',
    pattern: /\b(?:(?:access|auth|refresh|session)[_-]?token|Authorization|Bearer)\b/i
  },
  {
    label: 'application endpoint',
    pattern: /['"`]\s*\/(?:analytics|api|auth|collect|events?|login|oauth|session|track)(?:[/?#'"`]|$)/i
  },
  {
    label: 'cross-origin URL',
    pattern: /['"`]\s*(?:https?:)?\/\//i
  },
  {
    label: 'analytics runtime',
    pattern: /\b(?:analytics|dataLayer|gtag|mixpanel|posthog|segment|sentry|telemetry)\b/i
  },
  {
    label: 'hidden identity field',
    pattern: /\b(?:anonymous|child|client|device|student|user|visitor)[_-]?(?:id|uuid)\b/i
  },
  {
    label: 'credential gate copy',
    pattern: /授权码|学习码|邀请码|请(?:先)?登录|登录后(?:继续|使用)|注册(?:账号|账户)/
  }
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function attributeValue(tag, name) {
  const match = tag.match(new RegExp(
    `\\b${escapeRegExp(name)}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i'
  ));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

function startTags(source, name) {
  const matches = [];
  const opening = new RegExp(`<${escapeRegExp(name)}\\b`, 'gi');
  for (let match = opening.exec(source); match; match = opening.exec(source)) {
    let quote = null;
    let end = match.index + match[0].length;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = null;
        continue;
      }
      if (character === '"' || character === "'") {
        quote = character;
        continue;
      }
      if (character === '>') break;
    }
    if (end >= source.length) break;
    matches.push({ start: match.index, end: end + 1, text: source.slice(match.index, end + 1) });
    opening.lastIndex = end + 1;
  }
  return matches;
}

function tags(source, name) {
  return startTags(source, name).map(match => match.text);
}

function visibleMarkup(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
}

function assertIndexableHtml(source, label) {
  if (typeof source !== 'string' || !source.trim()) {
    throw new Error(`${label}: empty public HTML`);
  }
  const uncommented = source.replace(/<!--[\s\S]*?-->/g, ' ');
  if (!/^\s*<!doctype\s+html\s*>/i.test(uncommented)) {
    throw new Error(`${label}: public page must declare HTML5 doctype`);
  }

  const html = tags(uncommented, 'html')[0] || '';
  if ((attributeValue(html, 'lang') || '').toLowerCase() !== 'zh-cn') {
    throw new Error(`${label}: public page must declare lang="zh-CN"`);
  }

  const meta = tags(uncommented, 'meta');
  const charset = meta.find(tag => attributeValue(tag, 'charset') !== null);
  if ((attributeValue(charset || '', 'charset') || '').toLowerCase() !== 'utf-8') {
    throw new Error(`${label}: public page must declare UTF-8 charset`);
  }

  const viewport = meta.find(tag => (attributeValue(tag, 'name') || '').toLowerCase() === 'viewport');
  const viewportContent = attributeValue(viewport || '', 'content') || '';
  if (!/(?:^|,)\s*width=device-width(?:\s*,|$)/i.test(viewportContent) ||
      !/(?:^|,)\s*initial-scale=1(?:\.0)?(?:\s*,|$)/i.test(viewportContent)) {
    throw new Error(`${label}: public page must declare a device-width initial viewport`);
  }

  const titles = [...uncommented.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const title = titles[0]?.[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  if (titles.length !== 1 || title.length < 6) {
    throw new Error(`${label}: public page must expose one descriptive title`);
  }

  for (const tag of meta) {
    const name = (attributeValue(tag, 'name') || '').toLowerCase();
    const httpEquiv = (attributeValue(tag, 'http-equiv') || '').toLowerCase();
    const content = attributeValue(tag, 'content') || '';
    if ((name === 'robots' || httpEquiv === 'x-robots-tag') && /noindex|nofollow/i.test(content)) {
      throw new Error(`${label}: public page must not opt out of indexing or link discovery`);
    }
    if (httpEquiv === 'refresh') {
      throw new Error(`${label}: direct public page must not require a redirect entry`);
    }
  }

  const markup = visibleMarkup(uncommented);
  for (const input of tags(markup, 'input')) {
    const type = (attributeValue(input, 'type') || 'text').toLowerCase();
    const autocomplete = (attributeValue(input, 'autocomplete') || '').toLowerCase();
    if (['email', 'password', 'tel'].includes(type) ||
        ['current-password', 'new-password', 'one-time-code', 'username'].includes(autocomplete)) {
      throw new Error(`${label}: public page must not require account credentials`);
    }
  }
  for (const form of tags(markup, 'form')) {
    const action = attributeValue(form, 'action') || '';
    if (/\/(?:api|auth|login|oauth|session)(?:\/|$)/i.test(action)) {
      throw new Error(`${label}: public page must not submit to an account or application service`);
    }
  }
  const text = markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  if (/授权码|学习码|邀请码|请(?:先)?登录|登录后(?:继续|使用)|注册(?:账号|账户)/.test(text)) {
    throw new Error(`${label}: public page must not expose a credential gate`);
  }
}

function inlineRuntime(source) {
  const bodies = [];
  for (const opening of startTags(source, 'script')) {
    const remainder = source.slice(opening.end);
    const closing = remainder.search(/<\/script\s*>/i);
    if (closing < 0) continue;
    bodies.push(remainder.slice(0, closing));
  }
  return bodies.join('\n');
}

function assertSameOriginResources(source, label) {
  const markup = source.replace(/<!--[\s\S]*?-->/g, ' ');
  for (const name of ['audio', 'form', 'iframe', 'img', 'link', 'script', 'source', 'video']) {
    for (const tag of tags(markup, name)) {
      for (const attribute of ['action', 'href', 'src']) {
        const value = attributeValue(tag, attribute);
        if (value && /^(?:https?:)?\/\//i.test(value)) {
          throw new Error(`${label}: public resource must remain same-origin`);
        }
      }
    }
  }
}

function assertStaticRuntimeSource(source, label) {
  for (const forbidden of FORBIDDEN_RUNTIME) {
    if (forbidden.pattern.test(source)) {
      throw new Error(`${label}: forbidden ${forbidden.label} in public V1 runtime`);
    }
  }
}

function resolvePublicPath(root, relative) {
  const target = path.resolve(root, relative);
  const within = path.relative(root, target);
  if (within === '..' || within.startsWith(`..${path.sep}`) || path.isAbsolute(within)) {
    throw new Error(`public V1 path escapes repository: ${relative}`);
  }
  return target;
}

async function requireTextFile(root, relative) {
  const file = resolvePublicPath(root, relative);
  let stat;
  try {
    stat = await fs.lstat(file);
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`public V1 boundary: missing file ${relative}`);
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`public V1 boundary: expected regular file ${relative}`);
  }
  return fs.readFile(file, 'utf8');
}

async function runtimeFilesIn(root, relative) {
  const directory = resolvePublicPath(root, relative);
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await runtimeFilesIn(root, child));
    if (entry.isFile() && /\.(?:html|js)$/i.test(entry.name)) files.push(child);
  }
  return files;
}

async function assertPublicV1Boundary({
  root = path.resolve(__dirname, '..'),
  courses = PUBLISHED_COURSES
} = {}) {
  const resolvedRoot = path.resolve(root);
  const indexablePages = [
    { label: 'home', entry: 'index.html' },
    { label: 'unit49-50', entry: 'unit49-50/index.html' },
    { label: 'unit1-2', entry: 'unit1-2/index.html' },
    ...courses.map(course => ({ label: course.id, entry: course.entry }))
  ];
  const pageEntries = new Set([
    'index.html',
    'home/index.html',
    'unit49-50/index.html',
    'unit1-2/index.html',
    ...courses.map(course => course.entry)
  ]);

  for (const page of indexablePages) {
    assertIndexableHtml(await requireTextFile(resolvedRoot, page.entry), page.label);
  }

  const runtimeFiles = new Set([
    ...pageEntries,
    ...await runtimeFilesIn(resolvedRoot, 'core'),
    ...await runtimeFilesIn(resolvedRoot, 'unit49-50'),
    ...await runtimeFilesIn(resolvedRoot, 'unit1-2'),
    ...await runtimeFilesIn(resolvedRoot, 'assets'),
    ...(
      await Promise.all(
        courses.flatMap(course => course.assetDirectories || [])
          .map(directory => runtimeFilesIn(resolvedRoot, directory))
      )
    ).flat()
  ]);
  for (const relative of runtimeFiles) {
    const source = await requireTextFile(resolvedRoot, relative);
    if (relative.endsWith('.html')) {
      assertSameOriginResources(source, relative);
      assertStaticRuntimeSource(inlineRuntime(source), relative);
    } else {
      assertStaticRuntimeSource(source, relative);
    }
  }
}

module.exports = {
  assertIndexableHtml,
  assertPublicV1Boundary,
  assertSameOriginResources,
  assertStaticRuntimeSource
};
