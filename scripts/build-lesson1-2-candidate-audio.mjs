#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(import.meta.dirname, '..');
const UNIT_ID = 'NCE-U01';
const OUTPUT_DIR = join(ROOT, 'poc/lesson1-2-experience/audio');
const REJECTED_CLOTHING_AUDIO = Object.freeze({
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

const catalog = require(join(ROOT, 'core/curriculum-catalog.js'));
const unit = catalog.getTeachingUnit(UNIT_ID);
if (!unit) throw new Error(`${UNIT_ID} is missing from the curriculum catalog.`);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function voiceFor(item) {
  return item.speaker === 'man' || item.kind === 'derived-expression'
    ? 'Reed'
    : 'Samantha';
}

function utteranceFor(text) {
  const utterance = text.trim();
  return /[.!?]$/.test(utterance) ? utterance : `${utterance}.`;
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
    rateWpm: 145,
    outputPath
  };
});

mkdirSync(OUTPUT_DIR, { recursive: true });
const buildDir = mkdtempSync(join(tmpdir(), 'canran-nce-u01-audio-'));
try {
  for (const item of items) {
    const rawPath = join(buildDir, `${item.sourceId.toLowerCase()}.aiff`);
    execFileSync('say', [
      '-v', item.voice, '-r', String(item.rateWpm), '-o', rawPath, utteranceFor(item.text)
    ]);
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', rawPath,
      '-af', 'adelay=220,apad=pad_dur=0.35,loudnorm=I=-18:TP=-1.5:LRA=7',
      '-ar', '24000', '-ac', '1', '-b:a', '96k', item.outputPath
    ]);
  }
} finally {
  rmSync(buildDir, { recursive: true, force: true });
}

const files = items.map(item => {
  const bytes = readFileSync(item.outputPath);
  const rejectedClothingAudio = REJECTED_CLOTHING_AUDIO[item.sourceId];
  const audioSha256 = sha256(bytes);
  const durationSeconds = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', item.outputPath
  ], { encoding: 'utf8' }).trim());
  return {
    sourceId: item.sourceId,
    catalogTextSha256: item.textSha256,
    path: `/${relative(ROOT, item.outputPath)}`,
    voiceId: item.voice,
    engineId: 'macOS-say',
    locale: 'en-US',
    rateWpm: item.rateWpm,
    ...(rejectedClothingAudio
      ? {
          pronunciationCorrection: {
            locale: 'en-US',
            reason: 'child-playtest-pronunciation-rejection',
            rejectedSha256: rejectedClothingAudio.rejectedSha256
          }
        }
      : {}),
    sha256: audioSha256,
    bytes: bytes.length,
    durationMs: Math.round(durationSeconds * 1000),
    reviewStatus: 'unreviewed-candidate'
  };
});

const manifest = {
  schemaVersion: 1,
  packId: 'nce-u01-macos-say-candidate-v3',
  unitId: UNIT_ID,
  status: 'local-poc-candidate-unreviewed',
  disclosure: '英文语音由本地系统语音合成，当前仅供本地验收，不是真人老师正式语音包。',
  accentTarget: 'General American English',
  engine: {
    name: 'macOS say',
    locale: 'en-US',
    maleVoice: 'Reed',
    femaleAndWordVoice: 'Samantha',
    outputUseStatus: 'local-poc-only-requires-review'
  },
  replacesRejectedPackId: 'nce-u01-local-candidate-v2',
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
