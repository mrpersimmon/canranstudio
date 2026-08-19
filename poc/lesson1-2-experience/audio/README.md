# Lesson 1–2 local candidate audio

- `manifest.json` is generated from the catalog and binds every voice file to its Source ID or authored Content ID and text hash.
- The current voice files are an unreviewed local American-English candidate for the hidden POC. Kokoro remains the primary generator; `L02-W05` through `L02-W08` use a macOS `en-US` Samantha correction after the original clothing-word files failed child playtest pronunciation review. They are not teacher recordings and are not approved for publication.
- The rejected clothing-word hashes are pinned by the deployment contract. Re-running the pack builder must regenerate the four correction files and cannot silently restore the rejected bytes.
- An approved teacher pack must replace the complete file list under the same stable identities; the runtime and page do not contain a second copy of the course text.
- This POC ships no ambient or background track. Only the active English dialogue, word audio, and required feedback audio may play.
- `correct-chime.mp3` is a short, non-looping interface cue. It plays once before correct-answer English feedback, owns no Source ID, creates no learning evidence, and never replaces the English audio `ended` gate.
