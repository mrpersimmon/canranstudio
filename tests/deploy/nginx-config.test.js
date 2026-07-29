'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

function stripNginxComments(text) {
  let quote = null;
  let escaped = false;
  let active = '';

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (escaped) {
      active += character;
      escaped = false;
      continue;
    }
    if (quote && character === '\\') {
      active += character;
      escaped = true;
      continue;
    }
    if (character === quote) {
      active += character;
      quote = null;
      continue;
    }
    if (!quote && (character === '"' || character === "'")) {
      active += character;
      quote = character;
      continue;
    }
    if (!quote && character === '#') {
      while (index < text.length && text[index] !== '\n') index += 1;
      if (index < text.length) active += '\n';
      continue;
    }
    active += character;
  }

  return active;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function directiveValues(text, name) {
  return [...text.matchAll(new RegExp(`^\\s*${escapeRegExp(name)}\\s+(.+);\\s*$`, 'gm'))]
    .map(match => match[1]);
}

function assertRedirect(text, source, destination) {
  assert.match(
    text,
    new RegExp(
      `location\\s+=\\s+${escapeRegExp(source)}\\s*\\{\\s*return\\s+308\\s+${escapeRegExp(destination)};\\s*\\}`
    )
  );
}

function assertHttpContract(text) {
  const active = stripNginxComments(text);
  const listens = [...active.matchAll(/^\s*listen\s+([^;]+);\s*$/gm)].map(match => match[1]);
  assert.deepEqual(listens, ['80', '[::]:80']);
  assert.deepEqual(directiveValues(active, 'server_name'), ['59.110.217.36']);
  assert.deepEqual(directiveValues(active, 'root'), ['/var/www/canranstudio/current']);
  assert.deepEqual(directiveValues(active, 'index'), ['index.html']);
  assert.deepEqual(directiveValues(active, 'charset'), ['utf-8']);
  assert.deepEqual(directiveValues(active, 'server_tokens'), ['off']);

  assert.deepEqual(directiveValues(active, 'add_header'), [
    "Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'\" always",
    'X-Content-Type-Options "nosniff" always',
    'X-Frame-Options "DENY" always',
    'Referrer-Policy "strict-origin-when-cross-origin" always',
    'Permissions-Policy "camera=(), microphone=(), geolocation=()" always',
    'Cache-Control "no-cache" always'
  ]);

  assertRedirect(active, '/home', '/');
  assertRedirect(active, '/home/', '/');
  assertRedirect(active, '/home/index.html', '/');
  assertRedirect(active, '/lesson49', '/lesson49/');
  assertRedirect(active, '/lesson50', '/lesson50/');
  assertRedirect(active, '/soundmark', '/soundmark/');

  const methodGuard = /if\s*\(\s*\$request_method\s*!~\s*\^\(GET\|HEAD\)\$\s*\)\s*\{\s*return\s+405;\s*\}/;
  assert.match(active, methodGuard);
  const firstLocation = active.search(/\blocation\b/);
  assert.ok(firstLocation >= 0, 'the server must contain locations');
  assert.ok(active.search(methodGuard) < firstLocation, 'method guard must precede location selection');
  assert.match(active, /location\s+\/\s*\{\s*try_files\s+\$uri\s+\$uri\/\s+=404;\s*limit_except\s+GET\s+HEAD\s*\{\s*deny\s+all;\s*\}\s*\}/);
  assert.match(active, /location\s+~\s+\/\\\.\s*\{\s*deny\s+all;\s*\}/);

  for (const forbidden of [
    /\blisten\s+443\b/,
    /\bssl_(certificate|protocols|ciphers)\b/,
    /\bssl\b/,
    /Strict-Transport-Security/i,
    /\b(?:return\s+30[0-9]|rewrite\s+\S+)\s+https:\/\//i,
    /upgrade-insecure-requests/i
  ]) {
    assert.doesNotMatch(active, forbidden);
  }
}

test('Nginx contract defines the complete active HTTP policy', () => {
  assertHttpContract(config);
});

test('Nginx contract does not accept directives forged only in comments', () => {
  assert.throws(
    () => assertHttpContract(`
      # listen 80;
      # listen [::]:80;
      # server_name 59.110.217.36;
      # if ($request_method !~ ^(GET|HEAD)$) { return 405; }
    `),
    /Expected values to be strictly deep-equal/
  );
});
