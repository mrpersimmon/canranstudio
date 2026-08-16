#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'poc/lesson1-2-experience/audio/starlight-station-ambience.mp3');
const duration = 40;
const inputs = [130.81, 164.81, 196, 261.63].flatMap(frequency => [
  '-f', 'lavfi', '-i', `sine=frequency=${frequency}:sample_rate=48000:duration=${duration}`
]);

const result = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  ...inputs,
  '-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.004:sample_rate=48000:duration=${duration}:seed=1201`,
  '-filter_complex', [
    '[0:a]volume=.019,tremolo=f=.10:d=.28[p0];',
    '[1:a]volume=.014,tremolo=f=.11:d=.22[p1];',
    '[2:a]volume=.012,tremolo=f=.13:d=.20[p2];',
    '[3:a]volume=.006,tremolo=f=.14:d=.18[p3];',
    '[4:a]lowpass=f=620,highpass=f=90,volume=.22[n];',
    '[p0][p1][p2][p3][n]amix=inputs=5:normalize=0,',
    'afade=t=in:st=0:d=3,afade=t=out:st=37:d=3,',
    'loudnorm=I=-29:TP=-7:LRA=3[out]'
  ].join(''),
  '-map', '[out]', '-ar', '48000', '-codec:a', 'libmp3lame', '-b:a', '96k', output
], { cwd: root, encoding: 'utf8' });

if (result.status !== 0) throw new Error(result.stderr || `ffmpeg exited ${result.status}`);
console.log(`Generated original procedural ambience at ${output}`);
