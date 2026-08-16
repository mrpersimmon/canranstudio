#!/usr/bin/env python3

import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
import kokoro.pipeline as kokoro_pipeline
from kokoro import KPipeline


def audio_from_result(result):
    if hasattr(result, "audio"):
        return result.audio
    if isinstance(result, tuple) and len(result) >= 3:
        return result[2]
    raise TypeError("Unexpected Kokoro result shape")


def main():
    request = json.load(sys.stdin)
    items = request.get("items", [])
    if not items:
        raise ValueError("No catalog audio items supplied")

    # The bundled macOS espeak-ng wheel currently exits the process while
    # constructing its out-of-dictionary fallback. This unit contains only
    # curriculum words covered by Kokoro's American English lexicon, so fail
    # closed instead of invoking an unverified fallback phonemizer.
    def reject_fallback(*_args, **_kwargs):
        raise RuntimeError("espeak fallback disabled for the frozen candidate pack")

    kokoro_pipeline.espeak.EspeakFallback = reject_fallback
    pipeline = KPipeline(
        lang_code="a",
        repo_id="hexgrad/Kokoro-82M",
        device="cpu",
    )
    for index, item in enumerate(items, start=1):
        source_id = item["sourceId"]
        output_path = item["outputPath"]
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        chunks = [
            np.asarray(audio_from_result(result), dtype=np.float32)
            for result in pipeline(
                item["text"],
                voice=item["voice"],
                speed=float(item["speed"]),
                split_pattern=r"\n+",
            )
        ]
        if not chunks:
            raise RuntimeError(f"Kokoro produced no audio for {source_id}")
        waveform = np.concatenate(chunks)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temporary:
            wav_path = temporary.name
        try:
            sf.write(wav_path, waveform, 24000)
            subprocess.run(
                [
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-i", wav_path,
                    "-af", "loudnorm=I=-18:TP=-2:LRA=7,apad=pad_dur=0.22",
                    "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", "96k",
                    output_path,
                ],
                check=True,
            )
        finally:
            os.unlink(wav_path)
        print(f"[{index:02d}/{len(items):02d}] {source_id}", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
