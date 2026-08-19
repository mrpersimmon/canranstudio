# Lesson 1–2 local candidate audio

- `manifest.json` is generated from the catalog and binds every voice file to its Source ID or authored Content ID and text hash.
- The current voice files are one complete, unreviewed macOS `en-US` candidate for the hidden POC. Reed voices every male textbook turn and product question; Samantha voices every female textbook turn and every standalone word. They are not teacher recordings and are not approved for publication.
- Repeated child playtest rejection of the former Kokoro/composite candidates triggered a whole-unit rebuild rather than another chapter-only patch. The deployment contract now requires the complete manifest to use this one declared local voice system; the four originally rejected clothing-word hashes remain pinned and cannot silently return.
- An approved teacher pack must replace the complete file list under the same stable identities; the runtime and page do not contain a second copy of the course text.
- This POC ships no ambient or background track. Only the active English dialogue, word audio, and required feedback audio may play.
- `correct-chime.mp3` is a short, non-looping interface cue. It plays once before correct-answer English feedback, owns no Source ID, creates no learning evidence, and never replaces the English audio `ended` gate.
