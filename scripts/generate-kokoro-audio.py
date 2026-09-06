#!/usr/bin/env python3

import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
import kokoro.pipeline as kokoro_pipeline
import kokoro.model as kokoro_model
from kokoro import KPipeline
from huggingface_hub import hf_hub_download
import torch


SAMPLE_RATE = 24000
MODEL_REPO_ID = "hexgrad/Kokoro-82M"
MODEL_REVISION = "f3ff3571791e39611d31c381e3a41a3af07b4987"


def pinned_hf_download(*args, **kwargs):
    repo_id = kwargs.get("repo_id") or (args[0] if args else None)
    if repo_id != MODEL_REPO_ID:
        raise RuntimeError(f"Unexpected Kokoro model repository: {repo_id}")
    kwargs["revision"] = MODEL_REVISION
    return hf_hub_download(*args, **kwargs)


def audio_from_result(result):
    if hasattr(result, "audio"):
        return result.audio
    if isinstance(result, tuple) and len(result) >= 3:
        return result[2]
    raise TypeError("Unexpected Kokoro result shape")


def last_activity_segment(waveform):
    window = round(SAMPLE_RATE * 0.01)
    threshold = 10 ** (-45 / 20)
    frame_count = (len(waveform) + window - 1) // window
    active_frames = []
    for frame in range(frame_count):
        samples = waveform[frame * window:min((frame + 1) * window, len(waveform))]
        if len(samples) and float(np.sqrt(np.mean(samples ** 2))) >= threshold:
            active_frames.append(frame)
    if not active_frames:
        raise RuntimeError("Context rendering produced no audible target segment")

    split_gap_frames = 12
    groups = [[active_frames[0]]]
    for frame in active_frames[1:]:
        if frame - groups[-1][-1] >= split_gap_frames:
            groups.append([frame])
        else:
            groups[-1].append(frame)
    final = groups[-1]
    start = max(0, final[0] * window - round(SAMPLE_RATE * 0.08))
    end = min(len(waveform), (final[-1] + 1) * window + round(SAMPLE_RATE * 0.18))
    return waveform[start:end]


def final_token_segment(result, target):
    # Slow words can contain a stop-consonant silence longer than the old
    # activity split gap. Use model token boundaries to keep the complete word.
    words = [token for token in result.tokens or [] if any(ch.isalpha() for ch in token.text)]
    if not words or words[-1].text.lower() != target.lower():
        raise RuntimeError(f"Final contextual token does not match {target}")
    final = words[-1]
    if final.start_ts is None or final.end_ts is None or final.end_ts <= final.start_ts:
        raise RuntimeError(f"Missing token timing for {target}")
    waveform = np.asarray(audio_from_result(result), dtype=np.float32)
    start = max(0, round((final.start_ts - 0.08) * SAMPLE_RATE))
    end = min(len(waveform), round((final.end_ts + 0.18) * SAMPLE_RATE))
    return waveform[start:end]


def main():
    request = json.load(sys.stdin)
    items = request.get("items", [])
    if not items:
        raise ValueError("No catalog audio items supplied")

    # The bundled macOS espeak-ng wheel can exit the process while constructing
    # its out-of-dictionary fallback. Keep that unverified fallback disabled and
    # explicitly reject any alphabetic token that Kokoro's American English
    # lexicon cannot phonemize; silently dropping a curriculum word is worse
    # than stopping the candidate build.
    def reject_fallback(*_args, **_kwargs):
        raise RuntimeError("espeak fallback disabled for the frozen candidate pack")

    np.random.seed(0)
    torch.manual_seed(0)
    kokoro_pipeline.hf_hub_download = pinned_hf_download
    kokoro_model.hf_hub_download = pinned_hf_download
    kokoro_pipeline.espeak.EspeakFallback = reject_fallback
    pipeline = KPipeline(
        lang_code="a",
        repo_id=MODEL_REPO_ID,
        device="cpu",
    )
    for index, item in enumerate(items, start=1):
        source_id = item["sourceId"]
        output_path = item["outputPath"]
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        render_mode = item.get("renderMode", "natural-utterance")
        text = item["text"]
        synthesis_text = item.get("synthesisText", text)
        if render_mode in ["context-cropped-lexeme-v1", "context-cropped-lexeme-v2"]:
            label = "phrase" if " " in text.strip() else "word"
            synthesis_text = f"Here is the {label} {text}. {text}."
        _, phoneme_tokens = pipeline.g2p(synthesis_text)
        phoneme_overrides = {
            key.lower(): value
            for key, value in item.get("phonemeOverrides", {}).items()
        }
        for token in phoneme_tokens:
            override = phoneme_overrides.get(token.text.lower())
            if override:
                token.phonemes = override
        unresolved = [
            token.text
            for token in phoneme_tokens
            if any(character.isalpha() for character in token.text)
            and not token.phonemes
        ]
        if unresolved:
            raise RuntimeError(
                f"Kokoro lexicon cannot phonemize {source_id}: {unresolved}"
            )
        results = list(pipeline.generate_from_tokens(
                phoneme_tokens,
                voice=item["voice"],
                speed=float(item["speed"]),
            ))
        if not results:
            raise RuntimeError(f"Kokoro produced no audio for {source_id}")
        waveform = np.concatenate([np.asarray(audio_from_result(result), dtype=np.float32) for result in results])
        if render_mode == "context-cropped-lexeme-v1":
            waveform = last_activity_segment(waveform)
        elif render_mode == "context-cropped-lexeme-v2":
            waveform = final_token_segment(results[-1], text)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temporary:
            wav_path = temporary.name
        try:
            sf.write(wav_path, waveform, SAMPLE_RATE)
            subprocess.run(
                [
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-i", wav_path,
                    "-af",
                    (
                        "loudnorm=I=-18:TP=-2:LRA=7,"
                        "silenceremove=start_periods=1:start_duration=0.02:"
                        "start_threshold=-45dB:start_silence=0.10,"
                        "areverse,"
                        "silenceremove=start_periods=1:start_duration=0.05:"
                        "start_threshold=-45dB:start_silence=0.24,"
                        "areverse"
                    ),
                    "-ar", str(SAMPLE_RATE), "-codec:a", "libmp3lame", "-b:a", "96k",
                    output_path,
                ],
                check=True,
            )
        finally:
            os.unlink(wav_path)
        print(f"[{index:02d}/{len(items):02d}] {source_id}", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
