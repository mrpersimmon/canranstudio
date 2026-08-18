# Lesson 1–2 双侧人物舞台 Design QA

- source visual truth: `docs/designs/lesson1-2-dialogue-stage-option-1.png`
- implementation desktop screenshot: `docs/designs/lesson1-2-design-qa/implementation-desktop-final.png`
- implementation mobile screenshot: `docs/designs/lesson1-2-design-qa/implementation-mobile-final.png`
- normalized comparison: `docs/designs/lesson1-2-design-qa/comparison-desktop-final.webp`
- desktop viewport: `1440 × 1024` CSS px, device density `1`
- mobile viewport: `390 × 844` CSS px, device density `1`
- source pixels: `1487 × 1058`, normalized to `1440 × 1024` for comparison
- implementation pixels: desktop `1440 × 1024`, mobile `390 × 844`
- state: `NCE-U01 / L01-M01:S01 / audio-ready`; active-speaker state and direct handover were also exercised

## Full-view comparison evidence

The final desktop comparison places the normalized selected ImageGen design and browser implementation in one image. Both use the same wide walnut-and-brass lost-and-found stage, large adult characters framing a centered cream transcript, a visible counter handbag, one explorer cat, midnight-blue ambience, teal accents, and a restrained course header. The implementation intentionally keeps the textbook's real seven-turn order instead of reproducing the generated mock's reordered sample lines.

## Focused-region evidence

A separate crop was not required: at `1440 × 1024`, the full-view comparison keeps adult faces, transparent asset edges, speaker labels, English line typography, the play control, handbag, counter, and cat readable at inspection scale. Active-speaker highlighting was checked in the browser and the first line plus left adult changed state together. The mobile screenshot separately verifies the responsive cast, transcript, tap targets, and no document scrolling.

## Comparison history

### Pass 1 — blocked

- P1 layout/image quality: adults were still visually subordinate to the central panel and the scene lacked the selected design's counter and handbag. Fixed by producing transparent identity-preserving adult cutouts, a real handbag prop, and a dedicated wide empty station background; the cast was scaled and anchored left/right.
- P1 interaction hierarchy: the action view still behaved like a large central form. Fixed by making the counter prop and stage characters the actual selectable targets and compressing action guidance to a small scene prompt.

### Pass 2 — blocked

- P2 layout rhythm: the central panel remained wider and shorter than the selected design, and the child prompt was clipped when moved above an overflowing panel. Fixed by narrowing the cast console, increasing transcript row rhythm, and rendering one dedicated stage prompt outside the scrolling panel.
- P2 responsiveness: the first mobile action state left an oversized empty paper area and the cat collided visually with the left character label. Fixed with a compact action-console state and a centered companion position between the character and handbag.

### Pass 3 — passed after fixes

- P2 icon fidelity: settings, play, replay, arrow, and heart controls still used character glyphs. Fixed with local Bootstrap Icons SVG assets and a committed license; no external runtime dependency was introduced.
- Post-fix browser evidence shows no remaining P0, P1, or P2 difference. The implementation preserves the selected composition while respecting catalog truth, responsive constraints, and real course interactions.

## Required fidelity surfaces

- Fonts and typography: existing local `ZCOOL KuaiLe`, `Fredoka`, and `Baloo 2` roles are retained; display Chinese, English transcript, speaker labels, and utility text have distinct readable weights and no clipping in the captured viewports.
- Spacing and layout rhythm: adults frame rather than sit beneath the transcript; the panel, prompt, handbag, counter, and cat have separate readable zones; desktop and mobile screenshots show no viewport overflow.
- Colors and tokens: midnight navy, warm walnut, brass, cream paper, teal interaction, and rose/teal speaker accents map to the selected visual and existing product tokens.
- Image quality and asset fidelity: adult identities match the supplied cast, handbag and wide background are real raster assets, transparent PNG masters retain alpha, and AVIF/WebP derivatives show no visible green halo at rendered scale.
- Copy and content: all English remains catalog-derived; visible speaker names clarify who speaks; the real textbook order is preserved rather than copying incorrect generated sample ordering.
- Icons: visible control icons use one local Bootstrap Icons family; the runtime makes no third-party request.
- Accessibility: characters have visible names, current dialogue uses `aria-current`, controls keep semantic names and focus outlines, minimum tap targets are maintained, mobile has no document scroll, and reduced-motion behavior remains covered by the existing style contract.

## Primary interactions checked

- story entry and stage navigation
- seven-line playback with current line and speaker state
- direct item-to-character handover
- direct word-form and expression submission
- automatic English feedback with real `audio/ended` gating
- direct slot, branch, and ordered-block completion
- one-action chapter stamp and unit opening lever
- audio failure fallback, restart cancellation/confirmation, recovery, and final growth boundary
- browser console warnings/errors: none

## Follow-up polish

- P3: the visible character name pills are more explicit than the selected mock; they are retained because they improve child comprehension and keyboard target naming.
- P3: the selected mock includes decorative portrait thumbnails and an extra speech bubble; the implementation uses text speaker labels and one active-line state to avoid duplicating characters and language.

final result: passed
