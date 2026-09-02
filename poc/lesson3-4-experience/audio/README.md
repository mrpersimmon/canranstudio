# Lesson 3–4 local candidate audio

- This pack inherits the accepted `nce-youth-v1` baseline from Lesson 1–2: visitor and substitution prompts use `am_michael`; the cloakroom attendant and standalone words use `af_heart`. Generation pins Kokoro snapshot `f3ff3571791e39611d31c381e3a41a3af07b4987` and seed `0` so a future same-name model update cannot silently change the timbre.
- Dialogue and full substitution prompts use natural utterance rendering at speed `0.9`. Standalone words use the accepted `context-cropped-lexeme-v1` process at speed `1.0`.
- Every MP3 is normalized to `-18 LUFS`, keeps only short boundary silence, and must reach decoded English activity within `150 ms`.
- The manifest binds every file to one catalog Source ID, text hash, speaker role when applicable, voice, render mode, measured onset, file hash, size, and duration. The catalog-accepted candidate set fingerprint is `c5738057a5857bb8c44a6d7b4bbeffbaa411683942ba10ae6bf7f31984da580f`; any change requires a new reviewed candidate rather than a silent overwrite.
- The files are AI-generated internal candidates. They are not official textbook audio and remain blocked from publication until every file passes human language and child-listening review.
- No cue, chime, ambient loop, or background track belongs to this pack. Only one active English recording may play at a time, and progression must wait for its real `ended` event.
