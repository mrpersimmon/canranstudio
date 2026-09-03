'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const NGINX_DIR = path.join(ROOT, 'deploy/nginx');
const CONFIG_NAME = /^canranstudio-lesson-(\d+)-(\d+)-location\.conf$/;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('every isolated POC course exposes only the canonical lesson-pair entry route', async () => {
  const entries = await fs.readdir(NGINX_DIR, { withFileTypes: true });
  const configs = entries
    .filter(entry => entry.isFile() && CONFIG_NAME.test(entry.name))
    .map(entry => entry.name)
    .sort();

  assert.ok(configs.length > 0, 'at least one isolated POC course route must be registered');

  for (const filename of configs) {
    const [, firstText, lastText] = filename.match(CONFIG_NAME);
    const first = Number(firstText);
    const last = Number(lastText);
    const canonical = `/poc/lesson-${first}-${last}/`;
    const slashless = canonical.slice(0, -1);
    const legacy = `/poc/lesson${first}-${last}-experience`;
    const isolatedRoot = `/var/www/canranstudio-lesson-${first}-${last}/current/`;
    const source = await fs.readFile(path.join(NGINX_DIR, filename), 'utf8');

    assert.equal(first % 2, 1, `${filename}: first lesson must be odd`);
    assert.equal(last, first + 1, `${filename}: lessons must be a consecutive pair`);
    assert.match(
      source,
      new RegExp(`location\\s*=\\s*${escapeRegExp(slashless)}\\s*\\{[\\s\\S]*?return\\s+308\\s+${escapeRegExp(canonical)};`),
      `${filename}: slashless public route must normalize to the canonical route`
    );

    for (const oldEntry of [legacy, `${legacy}/`, `${legacy}/index.html`]) {
      assert.match(
        source,
        new RegExp(`location\\s*=\\s*${escapeRegExp(oldEntry)}\\s*\\{[\\s\\S]*?return\\s+308\\s+${escapeRegExp(canonical)};`),
        `${filename}: legacy entry ${oldEntry} must redirect to the canonical route`
      );
    }

    assert.match(
      source,
      new RegExp(`alias\\s+${escapeRegExp(isolatedRoot)}`),
      `${filename}: canonical route must use the isolated release root`
    );
  }
});
