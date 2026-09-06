#!/usr/bin/env node
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const unit = require('../core/curriculum-catalog').getPathExperience();
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const originalPath = src => join(root, 'poc/lesson1-2-experience', src.replace('/poc/lesson-1-2/course/', ''));
const duration = path => Math.round(Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path], { encoding: 'utf8' }).trim()) * 1000);
const items = Object.entries(unit.sources).filter(([, source]) => source.slowAudio).map(([ref, source]) => ({
  sourceId: ref, text: source.text, voice: source.slowAudio.voiceId,
  renderMode: source.slowAudio.renderMode, speed: source.slowAudio.synthesisSpeed,
  outputPath: originalPath(source.slowAudio.src),
  originalPath: originalPath(source.audioSrc), originalSha256: sha256(readFileSync(originalPath(source.audioSrc)))
}));
if (!items.length) throw new Error('No catalog-bound slow recordings.');
const missing = items.filter(item => !existsSync(item.outputPath));
for (const item of missing) mkdirSync(dirname(item.outputPath), { recursive: true });
if (missing.length && !process.argv.includes('--refresh-manifest')) {
  const python = process.env.KOKORO_PYTHON;
  if (!python || !existsSync(python)) throw new Error('Set KOKORO_PYTHON to the established Kokoro environment.');
  const worker = spawnSync(python, [join(root, 'scripts/generate-kokoro-audio.py')], {
    cwd: root, input: JSON.stringify({ items: missing }), encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit']
  });
  if (worker.status !== 0) throw new Error(`Slow audio generation failed: ${worker.status}`);
}
const files = items.map(item => {
  if (sha256(readFileSync(item.originalPath)) !== item.originalSha256) throw new Error(`Original changed: ${item.sourceId}`);
  const bytes = readFileSync(item.outputPath);
  return { sourceId: item.sourceId, textSha256: sha256(item.text), src: unit.sources[item.sourceId].slowAudio.src,
    voiceId: item.voice, renderMode: item.renderMode, synthesisSpeed: item.speed,
    durationMs: duration(item.outputPath), originalDurationMs: duration(item.originalPath),
    originalSha256: item.originalSha256, sha256: sha256(bytes), bytes: bytes.length, reviewStatus: 'unreviewed-candidate' };
});
for (const directory of new Set(items.map(item => dirname(item.outputPath)))) {
  const manifestPath = join(directory, 'manifest.json');
  const group = files.filter(file => dirname(originalPath(file.src)) === directory);
  if (existsSync(manifestPath) && !process.argv.includes('--refresh-manifest') && !missing.some(item => dirname(item.outputPath) === directory)) continue;
  writeFileSync(manifestPath, JSON.stringify({ schema: 1, revision: directory.endsWith('slow-v34') ? 'lesson1-2-v3.4' : unit.experienceRevision,
    method: 'native-duration-synthesis', playbackRate: 1, timeStretching: false,
    engine: { name: 'Kokoro', version: '0.9.4', model: 'hexgrad/Kokoro-82M', revision: 'f3ff3571791e39611d31c381e3a41a3af07b4987' },
    status: 'local-poc-candidate-unreviewed', files: group }, null, 2) + '\n');
}
console.log(JSON.stringify(files.map(({ sourceId, durationMs, originalDurationMs }) => ({ sourceId, durationMs, originalDurationMs })), null, 2));
