#!/usr/bin/env python3
"""Read-only audio screening. ASR differences are review candidates, not verdicts.

Input: course-audio-inventory.cjs JSON. Results are checkpointed by file hash,
model and settings so an interrupted audit can resume without accepting stale
audio. No prompt or expected transcript is sent to the recognition model.
"""
import argparse
import concurrent.futures
import difflib
import hashlib
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

SETTINGS = {'beamSize': 5, 'language': 'en', 'temperature': 0, 'vadFilter': False, 'prompt': None}

def normalize(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())


def signal_metrics(file):
    try:
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', file, '-ac', '1', '-ar', '16000', '-f', 'f32le', 'pipe:1'], stderr=subprocess.PIPE)
        wave = np.frombuffer(raw, dtype=np.float32)
        if not len(wave) or not np.all(np.isfinite(wave)):
            return {'decodeError': 'Empty or invalid samples'}
        frames = np.array([np.sqrt(np.mean(wave[i:i+160] ** 2)) for i in range(0, len(wave), 160)])
        active = np.flatnonzero(frames >= 10 ** (-45/20))
        return {'decodedMs': round(len(wave)/16), 'onsetMs': int(active[0]*10) if len(active) else None,
                'activeSpanMs': int((active[-1]-active[0]+1)*10) if len(active) else 0,
                'activeFramesMs': int(len(active)*10), 'peak': round(float(np.abs(wave).max()), 4),
                'clippedSamples': int(np.count_nonzero(np.abs(wave) >= .999)),
                'tailMs': round(len(wave)/16-(active[-1]+1)*10) if len(active) else None}
    except subprocess.CalledProcessError as error:
        return {'decodeError': error.stderr.decode(errors='replace')[-400:]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('inventory', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--model', default='base.en')
    parser.add_argument('--model-cache', required=True)
    parser.add_argument('--only-paths', type=Path, help='Optional JSON list of paths to recheck')
    args = parser.parse_args()
    inventory = json.loads(args.inventory.read_text())
    files = inventory['files']
    if args.only_paths:
        wanted = set(json.loads(args.only_paths.read_text()))
        files = [x for x in files if x['path'] in wanted]
        missing = wanted.difference(x['path'] for x in files)
        if missing:
            raise ValueError('Paths absent from inventory: ' + ', '.join(sorted(missing)))
    # A matching cache key is only useful if the current file still matches the
    # inventory. Check cached entries too, not just files about to be transcribed.
    for item in files:
        if hashlib.sha256(Path(item['path']).read_bytes()).hexdigest() != item['sha256']:
            raise ValueError('Stale audio inventory: ' + item['path'])
    args.output.mkdir(parents=True, exist_ok=True)
    cache_file = args.output / (args.model + '.jsonl')
    completed = {}
    if cache_file.exists():
        for line in cache_file.read_text().splitlines():
            try:
                result = json.loads(line)
                if result.get('model') == args.model and result.get('settings') == SETTINGS:
                    completed[result['sha256']] = result
            except json.JSONDecodeError:
                continue
    model = WhisperModel(args.model, device='cpu', compute_type='int8', cpu_threads=4,
                         download_root=args.model_cache, local_files_only=True)
    unique = {x['sha256']: x for x in files}
    # Decode independently of ASR: an empty transcript does not imply silence.
    pending = {digest: item for digest, item in unique.items() if digest not in completed}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        metrics = dict(zip(pending, pool.map(lambda x: signal_metrics(x['path']), pending.values())))
    print(json.dumps({'event': 'decoded', 'physicalFiles': len(files), 'uniqueAudio': len(unique)}), flush=True)
    with cache_file.open('a') as checkpoint:
        for index, (digest, item) in enumerate(unique.items(), 1):
            if digest in completed:
                continue
            if hashlib.sha256(Path(item['path']).read_bytes()).hexdigest() != digest:
                raise ValueError('Audio changed during audit: ' + item['path'])
            result = {'sha256': digest, 'representative': item['path'], 'model': args.model,
                      'settings': SETTINGS,
                      'signal': metrics[digest]}
            if 'decodeError' not in result['signal']:
                segments, _ = model.transcribe(item['path'], language='en', beam_size=5, temperature=0,
                                               vad_filter=False, condition_on_previous_text=False)
                segments = list(segments)
                result['recognized'] = ' '.join(x.text.strip() for x in segments)
                result['segments'] = [{'start': x.start, 'end': x.end, 'text': x.text, 'logprob': x.avg_logprob, 'noSpeech': x.no_speech_prob} for x in segments]
            else:
                result['recognized'] = ''
            completed[digest] = result
            checkpoint.write(json.dumps(result, ensure_ascii=False) + '\n'); checkpoint.flush()
            if index % 25 == 0 or index == len(unique):
                print(json.dumps({'event': 'recognized', 'done': index, 'total': len(unique)}), flush=True)
    rows = []
    for item in files:
        result = completed[item['sha256']]
        expected, recognized = normalize(item['expected']), normalize(result['recognized'])
        similarity = difflib.SequenceMatcher(None, expected, recognized).ratio()
        signal = result['signal']
        flags = []
        if signal.get('decodeError'): flags.append('decode-error')
        if signal.get('activeSpanMs') == 0: flags.append('silent')
        if signal.get('onsetMs', 0) is not None and signal.get('onsetMs', 0) > 150: flags.append('late-onset')
        if signal.get('activeFramesMs', 1000) < 150: flags.append('very-short-speech')
        if signal.get('clippedSamples', 0) > 16: flags.append('clipping-review')
        if expected != recognized: flags.append('transcript-difference')
        if item['expectedBasis'] == 'filename-inferred': flags.append('text-source-inferred')
        rows.append({'path': item['path'], 'sha256': item['sha256'], 'expected': item['expected'],
                     'expectedBasis': item['expectedBasis'], 'recognized': result['recognized'],
                     'similarity': round(similarity, 3), 'flags': flags, 'signal': signal,
                     'humanListening': 'not-performed'})
    (args.output / (args.model + '-results.json')).write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'event': 'complete', 'rows': len(rows), 'transcriptDifferences': sum('transcript-difference' in x['flags'] for x in rows)}, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
