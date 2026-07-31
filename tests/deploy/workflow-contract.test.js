'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const CHECKOUT = 'actions/checkout@11d5960a326750d5838078e36cf38b85af677262';
const SETUP_NODE = 'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020';
const NGINX = 'nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284';

test('workflow uses read-only permissions and immutable dependencies', async () => {
  const workflow = await fs.readFile(path.join(ROOT, '.github/workflows/verify.yml'), 'utf8');
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.match(workflow, new RegExp(`uses: ${CHECKOUT}`));
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.match(workflow, new RegExp(`uses: ${SETUP_NODE}`));
  assert.match(workflow, new RegExp(NGINX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d/);
});

test('npm configuration and lockfile use the official registry', async () => {
  const [config, lock] = await Promise.all([
    fs.readFile(path.join(ROOT, '.npmrc'), 'utf8'),
    fs.readFile(path.join(ROOT, 'package-lock.json'), 'utf8')
  ]);
  assert.match(config, /^registry=https:\/\/registry\.npmjs\.org\/$/m);
  assert.match(config, /^replace-registry-host=always$/m);
  assert.doesNotMatch(lock, /registry\.npmmirror\.com/);
  for (const resolved of [...lock.matchAll(/"resolved":\s*"([^"]+)"/g)].map(match => match[1])) {
    assert.match(resolved, /^https:\/\/registry\.npmjs\.org\//);
  }
});
