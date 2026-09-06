# Lesson 1–2 audio used by the current cat learning path

- `manifest.json` is generated from the catalog and binds every voice file to its Source ID or authored Content ID and text hash.
- The voice files are a Kokoro American-English candidate, used by the published cat learning path. They are not a teacher recording; publication does not imply complete human pronunciation and naturalness acceptance. See the current V4 publication and QA records.
- Pack V3 keeps the selected `am_michael` and `af_heart` voice baseline. Dialogue stays on natural utterance rendering; standalone words use the human-selected context-cropped rendering so the target is synthesized in a natural carrier before its final complete occurrence is isolated. The four accepted clothing files are pinned by hash, and every browser-decoded standalone word must reach English within 150 ms.
- An approved teacher pack must replace the complete file list under the same stable identities; the runtime and page do not contain a second copy of the course text.
- This POC ships no ambient or background track. During a learning step, only the active English dialogue or word recording may play.
- Correct answers use visual feedback and start the target English recording directly. No interface cue, melody, or click may play before instructional language.
