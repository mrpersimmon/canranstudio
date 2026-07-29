'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const config = fs.readFileSync(
  path.resolve(__dirname, '../../deploy/nginx/canranstudio-http.conf'),
  'utf8'
);

test('Nginx contract serves the public IP over HTTP from the atomic release link', () => {
  assert.match(config, /\blisten\s+80;/);
  assert.match(config, /\bserver_name\s+59\.110\.217\.36;/);
  assert.match(config, /\broot\s+\/var\/www\/canranstudio\/current;/);
  assert.match(config, /location = \/home\/\s*\{\s*return 308 \/;\s*\}/);
  assert.match(config, /try_files \$uri \$uri\/ =404;/);
});

test('Nginx contract keeps the approved HTTP security headers', () => {
  for (const header of [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy'
  ]) {
    assert.match(config, new RegExp(`add_header ${header} `));
  }
});

test('Nginx contract has no accidental TLS or upgrade policy', () => {
  assert.doesNotMatch(config, /\blisten\s+443\b/);
  assert.doesNotMatch(config, /\bssl_(certificate|protocols|ciphers)\b/);
  assert.doesNotMatch(config, /Strict-Transport-Security/i);
  assert.doesNotMatch(config, /\breturn\s+30[178]\s+https:\/\//i);
  assert.doesNotMatch(config, /upgrade-insecure-requests/i);
});
