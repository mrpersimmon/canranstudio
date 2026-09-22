#!/usr/bin/env python3
"""Render a word or complete-utterance repair to a new candidate file.

Uses the established Kokoro voice and mastering settings. A checked-in recipe
locks the actual phonemes; token timestamps bound the target word. Listening
approval remains separate from generation and automated checks.
"""
import argparse
import copy
import hashlib
import json
import tempfile
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
import kokoro.pipeline as pipeline_module
import kokoro.model as model_module
from huggingface_hub import hf_hub_download
from kokoro import KPipeline

SAMPLE_RATE = 24000
MODEL = "hexgrad/Kokoro-82M"
REVISION = "f3ff3571791e39611d31c381e3a41a3af07b4987"


def render(recipe, output):
    mode = recipe.get("renderMode", "aligned-lexeme")
    if mode not in ("aligned-lexeme", "natural-utterance"):
        raise ValueError("Unknown rendering mode")
    def pinned_download(*args, **kwargs):
        if (kwargs.get("repo_id") or args[0]) != MODEL:
            raise ValueError("Unexpected speech model")
        return hf_hub_download(*args, **{**kwargs, "revision": REVISION})

    def reject_fallback(*_args, **_kwargs):
        raise ValueError("Unverified pronunciation fallback is disabled")

    pipeline_module.hf_hub_download = model_module.hf_hub_download = pinned_download
    pipeline_module.espeak.EspeakFallback = reject_fallback
    np.random.seed(recipe["seed"])
    torch.manual_seed(recipe["seed"])
    pipeline = KPipeline(lang_code="a", repo_id=MODEL, device="cpu")
    _, source_tokens = pipeline.g2p(recipe["synthesisText"])
    tokens = []
    repaired_keys = set()
    for token in source_tokens:
        # G2P reads "I." as an initial, swallowing the sentence terminator.
        # Split only explicitly named tokens, keeping the pause as its own token.
        parts = recipe.get("tokenRepairs", {}).get(token.text)
        if parts:
            repaired_keys.add(token.text)
            for index, part in enumerate(parts):
                repaired = copy.copy(token)
                repaired.text, repaired.phonemes = part["text"], part["phonemes"]
                repaired.whitespace = token.whitespace if index == len(parts) - 1 else ""
                tokens.append(repaired)
        else:
            tokens.append(token)
    if repaired_keys != set(recipe.get("tokenRepairs", {})):
        raise ValueError("A token repair did not match the synthesis text")
    # Match complete tokens, including possessives and hyphenated names. A
    # nonempty suffix alone (Paul's -> s) used to pass the old generator.
    for text, override in recipe.get("phonemeOverrides", {}).items():
        matches = [token for token in tokens if token.text == text]
        if len(matches) != override["occurrences"]:
            raise ValueError(f"Pronunciation override did not match {text!r} exactly")
        for token in matches:
            token.phonemes = override["phonemes"]
    if any(any(c.isalpha() for c in t.text) and not t.phonemes for t in tokens):
        raise ValueError("A word has no pronunciation")
    phonemes = pipeline.tokens_to_ps(tokens)
    if phonemes != recipe["expectedPhonemes"]:
        raise ValueError(f"Pronunciation/tokenizer changed: {phonemes!r}")
    results = list(pipeline.generate_from_tokens(tokens, voice=recipe["voice"], speed=recipe["speed"]))
    if len(results) != 1:
        raise ValueError("Target alignment requires exactly one generated utterance")
    result = results[0]
    waveform = np.asarray(result.audio, dtype=np.float32)
    boundaries = {}
    if mode == "aligned-lexeme":
        matches = [t for t in result.tokens if t.text == recipe["text"]]
        if len(matches) != recipe["targetOccurrences"]:
            raise ValueError("Unexpected number of target words")
        target = matches[-1]
        if target.start_ts is None or target.end_ts is None or target.end_ts <= target.start_ts:
            raise ValueError("Missing or invalid target alignment")
        previous = [t for t in result.tokens if any(c.isalpha() for c in t.text) and t.end_ts is not None and t.end_ts <= target.start_ts]
        start = max(0, target.start_ts - 0.08)
        end = min(len(waveform) / SAMPLE_RATE, target.end_ts + 0.18)
        if previous and start < previous[-1].end_ts:
            raise ValueError("Target margin would include the preceding word")
        crop = waveform[round(start * SAMPLE_RATE):round(end * SAMPLE_RATE)]
        boundaries = {"targetStartMs": round(target.start_ts * 1000),
                      "targetEndMs": round(target.end_ts * 1000),
                      "cropStartMs": round(start * 1000), "cropEndMs": round(end * 1000)}
    else:
        crop = waveform
    if len(crop) == 0 or np.max(np.abs(crop)) < 0.01:
        raise ValueError("Empty or inaudible target")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="canran-lexeme-") as temporary:
        wav = Path(temporary) / "target.wav"
        sf.write(wav, crop, SAMPLE_RATE)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
            "-af", "loudnorm=I=-18:TP=-2:LRA=7,"
            "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-45dB:start_silence=0.10,"
            "areverse,silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB:start_silence=0.24,areverse",
            "-ar", str(SAMPLE_RATE), "-codec:a", "libmp3lame", "-b:a", "96k", str(output)
        ], check=True)
    return {"phonemes": phonemes, **boundaries,
            "tokens": [{"text": t.text, "phonemes": t.phonemes,
                        "startMs": None if t.start_ts is None else round(t.start_ts * 1000),
                        "endMs": None if t.end_ts is None else round(t.end_ts * 1000)} for t in result.tokens],
            "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
            "voice": recipe["voice"], "speed": recipe["speed"], "renderMode": mode,
            "modelRevision": REVISION,
            "reviewStatus": "unreviewed-candidate"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("recipe", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Output exists; use a new candidate path rather than overwrite an accepted recording")
    recipe = json.loads(args.recipe.read_text())
    evidence = render(recipe, args.output)
    evidence.update(recipeSha256=hashlib.sha256(args.recipe.read_bytes()).hexdigest(),
                    generatorSha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
    args.output.with_suffix(".generation.json").write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(evidence, ensure_ascii=False))
