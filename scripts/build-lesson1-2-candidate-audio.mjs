#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(import.meta.dirname, '..');
const UNIT_ID = 'NCE-U01';
const OUTPUT_DIR = join(ROOT, 'poc/lesson1-2-experience/audio');
const PYTHON = process.env.KOKORO_PYTHON;

if (!PYTHON || !existsSync(PYTHON)) {
  throw new Error('Set KOKORO_PYTHON to a Kokoro-capable Python executable.');
}

const catalog = require(join(ROOT, 'core/curriculum-catalog.js'));
const unit = catalog.getTeachingUnit(UNIT_ID);
if (!unit) throw new Error(`${UNIT_ID} is missing from the curriculum catalog.`);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function voiceFor(item) {
  if (item.speaker === 'man') return 'am_michael';
  if (item.speaker === 'woman') return 'af_heart';
  return item.kind === 'derived-expression' ? 'am_michael' : 'af_heart';
}

const catalogItems = [
  ...Object.values(unit.lessonContent || {}).flatMap(lesson => Object.values(lesson.sources || {})),
  ...Object.values(unit.authoredContent || {})
].filter(item => typeof item.audioSrc === 'string');

const items = catalogItems.map(item => {
  const sourceId = item.sourceId || item.contentId;
  const outputPath = join(ROOT, item.audioSrc.replace(/^\//, ''));
  if (!outputPath.startsWith(`${OUTPUT_DIR}/`)) {
    throw new Error(`${sourceId} resolves outside the candidate audio directory.`);
  }
  return {
    sourceId,
    text: item.text,
    textSha256: sha256(item.text),
    voice: voiceFor(item),
    speed: 0.9,
    outputPath
  };
});

mkdirSync(OUTPUT_DIR, { recursive: true });
const worker = spawnSync(PYTHON, [join(ROOT, 'scripts/generate-kokoro-audio.py')], {
  cwd: ROOT,
  encoding: 'utf8',
  input: JSON.stringify({ items }),
  maxBuffer: 8 * 1024 * 1024,
  stdio: ['pipe', 'inherit', 'inherit']
});
if (worker.status !== 0) throw new Error(`Kokoro worker failed with exit code ${worker.status}.`);

const files = items.map(item => {
  const bytes = readFileSync(item.outputPath);
  const durationSeconds = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', item.outputPath
  ], { encoding: 'utf8' }).trim());
  return {
    sourceId: item.sourceId,
    catalogTextSha256: item.textSha256,
    path: `/${relative(ROOT, item.outputPath)}`,
    voiceId: item.voice,
    speed: item.speed,
    sha256: sha256(bytes),
    bytes: bytes.length,
    durationMs: Math.round(durationSeconds * 1000),
    reviewStatus: 'unreviewed-candidate'
  };
});

const manifest = {
  schemaVersion: 1,
  packId: 'nce-u01-kokoro-candidate-v1',
  unitId: UNIT_ID,
  status: 'local-poc-candidate-unreviewed',
  disclosure: '英文语音由 AI 生成，当前仅供本地验收，不是真人老师正式语音包。',
  accentTarget: 'General American English',
  engine: {
    name: 'Kokoro',
    packageVersion: '0.9.4',
    model: 'hexgrad/Kokoro-82M',
    modelLicense: 'Apache-2.0',
    outputUseStatus: 'requires-review-before-publication'
  },
  encoding: { format: 'mp3', sampleRateHz: 24000, bitrateKbps: 96, loudnessTargetLufs: -18 },
  replacementContract: {
    scope: 'whole-unit-pack',
    identity: 'catalog Source ID or authored Content ID',
    rule: 'An approved teacher pack replaces every listed file without changing runtime or course content.'
  },
  files
};

writeFileSync(join(OUTPUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${files.length} catalog-bound candidate files.`);
