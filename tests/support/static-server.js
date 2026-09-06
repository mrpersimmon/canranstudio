'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { PLAYWRIGHT_PORT, TEST_ORIGIN } = require('./test-origin');

const ROOT = process.cwd();
const CANONICAL_COURSE_ROUTE = '/poc/lesson-1-2/';
const LEGACY_COURSE_ROUTE = '/poc/lesson1-2-experience';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function sourcePathname(pathname) {
  if (pathname === CANONICAL_COURSE_ROUTE) {
    return '/poc/lesson1-2-experience/index.html';
  }
  if (pathname === `${CANONICAL_COURSE_ROUTE}path.html`) {
    return '/poc/lesson1-2-experience/path.html';
  }
  if (pathname === `${CANONICAL_COURSE_ROUTE}review/`) {
    return '/poc/lesson1-2-review/index.html';
  }
  for (const [publicPrefix, sourcePrefix] of [
    [`${CANONICAL_COURSE_ROUTE}course/`, '/poc/lesson1-2-experience/'],
    [`${CANONICAL_COURSE_ROUTE}review-files/`, '/poc/lesson1-2-review/'],
    [`${CANONICAL_COURSE_ROUTE}core/`, '/core/'],
    [`${CANONICAL_COURSE_ROUTE}assets/`, '/assets/']
  ]) {
    if (pathname.startsWith(publicPrefix)) {
      return `${sourcePrefix}${pathname.slice(publicPrefix.length)}`;
    }
  }
  return pathname;
}

function redirectLocation(requestUrl) {
  const parsed = new URL(requestUrl, 'http://127.0.0.1');
  const canonicalSlashless = CANONICAL_COURSE_ROUTE.slice(0, -1);
  const redirects = new Map([
    [canonicalSlashless, CANONICAL_COURSE_ROUTE],
    [`${CANONICAL_COURSE_ROUTE}index.html`, CANONICAL_COURSE_ROUTE],
    [LEGACY_COURSE_ROUTE, CANONICAL_COURSE_ROUTE],
    [`${LEGACY_COURSE_ROUTE}/`, CANONICAL_COURSE_ROUTE],
    [`${LEGACY_COURSE_ROUTE}/index.html`, CANONICAL_COURSE_ROUTE],
    [`${CANONICAL_COURSE_ROUTE}review`, `${CANONICAL_COURSE_ROUTE}review/`],
    [`${CANONICAL_COURSE_ROUTE}review/index.html`, `${CANONICAL_COURSE_ROUTE}review/`]
  ]);
  const target = redirects.get(parsed.pathname);
  return target ? `${target}${parsed.search}` : null;
}

function resolveRequestPath(requestUrl) {
  const pathname = sourcePathname(
    decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname)
  );
  const withIndex = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const absolute = path.resolve(ROOT, `.${withIndex}`);
  if (absolute !== ROOT && !absolute.startsWith(`${ROOT}${path.sep}`)) {
    return null;
  }
  return absolute;
}

const server = http.createServer(async (request, response) => {
  const redirect = redirectLocation(request.url);
  if (redirect) {
    response.writeHead(308, { Location: redirect, 'Cache-Control': 'no-store' }).end();
    return;
  }

  let file;
  try {
    file = resolveRequestPath(request.url);
  } catch {
    response.writeHead(400).end('Bad Request');
    return;
  }

  if (!file) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(file);
    const requestPathname = decodeURIComponent(
      new URL(request.url, 'http://127.0.0.1').pathname
    );
    const headers = {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    };
    if (file === path.join(ROOT, 'core/course-package-service-worker.js')) {
      headers['Service-Worker-Allowed'] = requestPathname.startsWith(CANONICAL_COURSE_ROUTE)
        ? CANONICAL_COURSE_ROUTE
        : '/';
    }
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404).end('Not Found');
      return;
    }
    response.writeHead(500).end('Internal Server Error');
  }
});

server.listen(PLAYWRIGHT_PORT, '127.0.0.1', () => {
  process.stdout.write(`static test server listening on ${TEST_ORIGIN}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
