#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(import.meta.dirname, '..');
const UNIT_ID = 'NCE-U01';
const OUTPUT_DIR = join(ROOT, 'poc/lesson1-2-experience/audio');
const PYTHON = process.env.KOKORO_PYTHON;
const PRONUNCIATION_CORRECTIONS = Object.freeze({
  'L02-W05': {
    rejectedSha256: '30adb68433c9bc977115c1ac92de3999e5b82ccb0751d51dbd660558d7587605'
  },
  'L02-W06': {
    rejectedSha256: 'ba0e499a7f68db4fa709e59e66650ad8d8d18578b4e72cad0f4736c1891d6d44'
  },
  'L02-W07': {
    rejectedSha256: '9e5244efc4942471318fd127f524231bd6a90f4b44d3cb8647ccd128912839e8'
  },
  'L02-W08': {
    rejectedSha256: '1cb8833562d8af5a01952de030c2219b97cc507a71557d0a32421c2ea2c8308a'
  }
});

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

const correctionDir = mkdtempSync(join(tmpdir(), 'canran-clothing-audio-'));
try {
  for (const item of items) {
    if (!PRONUNCIATION_CORRECTIONS[item.sourceId]) continue;
    const rawPath = join(correctionDir, `${item.sourceId.toLowerCase()}.aiff`);
    execFileSync('say', ['-v', 'Samantha', '-r', '145', '-o', rawPath, `${item.text}.`]);
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', rawPath,
      '-af', 'adelay=220,apad=pad_dur=0.35,loudnorm=I=-18:TP=-1.5:LRA=7',
      '-ar', '24000', '-ac', '1', '-b:a', '96k', item.outputPath
    ]);
  }
} finally {
  rmSync(correctionDir, { recursive: true, force: true });
}

const files = items.map(item => {
  const bytes = readFileSync(item.outputPath);
  const correction = PRONUNCIATION_CORRECTIONS[item.sourceId];
  const audioSha256 = sha256(bytes);
  const durationSeconds = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', item.outputPath
  ], { encoding: 'utf8' }).trim());
  return {
    sourceId: item.sourceId,
    catalogTextSha256: item.textSha256,
    path: `/${relative(ROOT, item.outputPath)}`,
    voiceId: correction ? 'Samantha' : item.voice,
    ...(correction
      ? {
          engineId: 'macOS-say',
          rateWpm: 145,
          pronunciationCorrection: {
            locale: 'en-US',
            reason: 'child-playtest-pronunciation-rejection',
            rejectedSha256: correction.rejectedSha256
          }
        }
      : { speed: item.speed }),
    sha256: audioSha256,
    bytes: bytes.length,
    durationMs: Math.round(durationSeconds * 1000),
    reviewStatus: 'unreviewed-candidate'
  };
});

const manifest = {
  schemaVersion: 1,
  packId: 'nce-u01-local-candidate-v2',
  unitId: UNIT_ID,
  status: 'local-poc-candidate-unreviewed',
  disclosure: '英文语音由 AI 生成，当前仅供本地验收，不是真人老师正式语音包。',
  accentTarget: 'General American English',
  engine: {
    name: 'Composite local candidate',
    primary: {
      name: 'Kokoro',
      packageVersion: '0.9.4',
      model: 'hexgrad/Kokoro-82M',
      modelLicense: 'Apache-2.0'
    },
    pronunciationCorrection: {
      name: 'macOS say',
      voice: 'Samantha',
      locale: 'en-US',
      scope: Object.keys(PRONUNCIATION_CORRECTIONS)
    },
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
