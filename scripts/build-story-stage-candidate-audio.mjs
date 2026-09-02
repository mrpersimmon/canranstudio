#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync, mkdirSync, readFileSync, writeFileSync
} from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(import.meta.dirname, '..');
const unitArgument = process.argv.find(argument => argument.startsWith('--unit='));
const UNIT_ID = unitArgument?.split('=')[1] || 'NCE-U02';
const PYTHON = process.env.KOKORO_PYTHON;
const REFRESH_EXISTING = process.argv.includes('--refresh-manifest');
const SAMPLE_RATE = 24_000;
const SILENCE_THRESHOLD_DB = -45;
const DECODED_ONSET_LIMIT_MS = 150;
const PRONUNCIATION_PHONEMES_BY_TOKEN = Object.freeze({
  Dupont: 'dupˈɑnt',
  Naoko: 'nɑˈokoʊ',
  Chang: 'ʧˈæŋ',
  Luming: 'lˈumɪŋ',
  Xiaohui: 'ʃˌaʊhwˈeɪ',
  Volvo: 'vˈɑlvoʊ',
  Peugeot: 'pɜɹʒˈoʊ',
  Toyota: 'tɔɪˈoʊtə'
});

if (!REFRESH_EXISTING && (!PYTHON || !existsSync(PYTHON))) {
  throw new Error('Set KOKORO_PYTHON to a Kokoro-capable Python executable.');
}

const catalog = require(join(ROOT, 'core/curriculum-catalog.js'));
const unit = catalog.getTeachingUnit(UNIT_ID);
if (!unit) throw new Error(`${UNIT_ID} is missing from the curriculum catalog.`);
const OUTPUT_DIR = join(ROOT, unit.audioReviewContract.manifestPath.replace(/^\//, '').replace(/\/manifest\.json$/, ''));
const catalogErrors = catalog.validate([unit]);
if (catalogErrors.length > 0) {
  throw new Error(`Refusing invalid ${UNIT_ID} audio contract:\n${catalogErrors.join('\n')}`);
}
const baseline = catalog.getCourseVoiceBaseline(unit.voiceBaselineId);
if (!baseline) throw new Error(`${UNIT_ID} has no valid course voice baseline.`);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function decodedOnsetMs(audioPath) {
  const pcm = execFileSync('ffmpeg', [
    '-v', 'error', '-i', audioPath,
    '-f', 'f32le', '-ac', '1', '-ar', String(SAMPLE_RATE), 'pipe:1'
  ], { maxBuffer: 128 * 1024 * 1024 });
  const windowSamples = Math.round(SAMPLE_RATE * 0.01);
  const threshold = 10 ** (SILENCE_THRESHOLD_DB / 20);
  const sampleCount = Math.floor(pcm.length / 4);
  for (let start = 0; start < sampleCount; start += windowSamples) {
    const end = Math.min(sampleCount, start + windowSamples);
    let energy = 0;
    for (let index = start; index < end; index += 1) {
      const sample = pcm.readFloatLE(index * 4);
      energy += sample * sample;
    }
    const rms = Math.sqrt(energy / Math.max(1, end - start));
    if (rms >= threshold) return Math.round((start / SAMPLE_RATE) * 1000);
  }
  throw new Error(`${relative(ROOT, audioPath)} has no decoded English activity.`);
}

const sourceItems = Object.values(unit.lessonContent || {})
  .flatMap(lesson => Object.values(lesson.sources || {}))
  .filter(item => typeof item.audioSrc === 'string');
const items = sourceItems.map(item => {
  const outputPath = join(ROOT, item.audioSrc.replace(/^\//, ''));
  if (!outputPath.startsWith(`${OUTPUT_DIR}/`)) {
    throw new Error(`${item.sourceId} resolves outside the ${UNIT_ID} candidate directory.`);
  }
  const speed = item.audioRenderMode === 'context-cropped-lexeme-v1' ? 1 : 0.9;
  const phonemeOverrides = Object.fromEntries(
    Object.entries(PRONUNCIATION_PHONEMES_BY_TOKEN)
      .filter(([token]) => item.text.toLowerCase().includes(token.toLowerCase()))
  );
  return {
    sourceId: item.sourceId,
    sourceKind: item.sourceKind,
    text: item.text,
    ...(Object.keys(phonemeOverrides).length > 0 ? { phonemeOverrides } : {}),
    textSha256: sha256(item.text),
    voice: item.voiceId,
    renderMode: item.audioRenderMode,
    speed,
    outputPath,
    ...(item.speaker ? { speaker: item.speaker } : {}),
    ...(item.speakerRole ? { speakerRole: item.speakerRole } : {})
  };
});

if (items.length !== unit.audioReviewContract.expectedAudioSourceCount) {
  throw new Error(
    `${UNIT_ID} expected ${unit.audioReviewContract.expectedAudioSourceCount} audio sources; `
    + `catalog supplied ${items.length}.`
  );
}
if (new Set(items.map(item => item.sourceId)).size !== items.length) {
  throw new Error(`${UNIT_ID} contains duplicate audio source identities.`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
if (!REFRESH_EXISTING) {
  const worker = spawnSync(PYTHON, [join(ROOT, 'scripts/generate-kokoro-audio.py')], {
    cwd: ROOT,
    encoding: 'utf8',
    input: JSON.stringify({ items }),
    maxBuffer: 8 * 1024 * 1024,
    stdio: ['pipe', 'inherit', 'inherit']
  });
  if (worker.status !== 0) throw new Error(`Kokoro worker failed with exit code ${worker.status}.`);
}

const files = items.map(item => {
  const bytes = readFileSync(item.outputPath);
  const durationSeconds = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=nw=1:nk=1', item.outputPath
  ], { encoding: 'utf8' }).trim());
  const onsetMs = decodedOnsetMs(item.outputPath);
  if (onsetMs > DECODED_ONSET_LIMIT_MS) {
    throw new Error(
      `${item.sourceId} decoded onset ${onsetMs} ms exceeds ${DECODED_ONSET_LIMIT_MS} ms.`
    );
  }
  return {
    sourceId: item.sourceId,
    sourceKind: item.sourceKind,
    catalogTextSha256: item.textSha256,
    path: `/${relative(ROOT, item.outputPath)}`,
    voiceId: item.voice,
    renderMode: item.renderMode,
    speed: item.speed,
    ...(item.speaker ? { speaker: item.speaker } : {}),
    ...(item.speakerRole ? { speakerRole: item.speakerRole } : {}),
    ...(item.phonemeOverrides
      ? {
        pronunciationOverride: true,
        pronunciationOverrideSha256: sha256(JSON.stringify(item.phonemeOverrides))
      }
      : {}),
    sha256: sha256(bytes),
    bytes: bytes.length,
    durationMs: Math.round(durationSeconds * 1000),
    decodedOnsetMs: onsetMs,
    reviewStatus: 'unreviewed-candidate'
  };
});

const manifest = {
  schemaVersion: 1,
  packId: unit.audioReviewContract.packId,
  unitId: UNIT_ID,
  voiceBaselineId: unit.voiceBaselineId,
  canonicalAudioSetSha256: sha256(JSON.stringify(files.map(file => file.sha256))),
  status: 'local-poc-candidate-unreviewed',
  disclosure: '英文语音由 AI 生成，仅供内部逐条试听；不是教材官方录音，也尚未获准发布。',
  accentTarget: baseline.accentTarget,
  generationBasis: 'nce-u01-kokoro-candidate-v3',
  engine: {
    name: 'Kokoro',
    packageVersion: '0.9.4',
    model: 'hexgrad/Kokoro-82M',
    modelRevision: 'f3ff3571791e39611d31c381e3a41a3af07b4987',
    deterministicSeed: 0,
    modelLicense: 'Apache-2.0',
    outputUseStatus: 'requires-review-before-publication'
  },
  encoding: {
    format: 'mp3', sampleRateHz: SAMPLE_RATE, bitrateKbps: 96, loudnessTargetLufs: -18
  },
  processing: {
    profileId: 'instructional-onset-v1',
    silenceThresholdDb: SILENCE_THRESHOLD_DB,
    decodedOnsetLimitMs: DECODED_ONSET_LIMIT_MS,
    leadingSilenceKeptMs: 100,
    trailingSilenceKeptMs: 240,
    standaloneWordRenderMode: 'context-cropped-lexeme-v1'
  },
  voiceAssignment: {
    ...Object.fromEntries(Object.keys(unit.experience.roles || {}).map(roleId => {
      const source = sourceItems.find(item => item.speakerRole === roleId);
      return [roleId, source?.voiceId || baseline.youthMaleVoiceId];
    })),
    substitutionPrompt: 'catalog-source-owned',
    standaloneWord: baseline.standaloneWordVoiceId
  },
  replacementContract: {
    scope: 'whole-unit-pack',
    identity: 'catalog Source ID',
    rule: 'Replace all listed files together without changing catalog text, speaker roles, or runtime.'
  },
  files
};

writeFileSync(join(OUTPUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated and onset-verified ${files.length} ${UNIT_ID} candidate files.`);
