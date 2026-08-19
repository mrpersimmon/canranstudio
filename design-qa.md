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

The final desktop comparison places the normalized selected ImageGen design and browser implementation in one image. Both use the same wide walnut-and-brass lost-and-found stage, large adult characters framing a centered cream transcript, a visible counter handbag, midnight-blue ambience, teal accents, and a restrained course header. A later child playtest intentionally overrides the mock's always-present explorer cat: ordinary dialogue and word tasks now keep the adult story focus, while the same cat returns at a much larger scale only for partner rescue, child-role actions, and milestone celebrations. The implementation also keeps the textbook's real seven-turn order instead of reproducing the generated mock's reordered sample lines.

## Focused-region evidence

A separate crop was not required: at `1440 × 1024`, the full-view comparison keeps adult faces, transparent asset edges, speaker labels, English line typography, the play control, handbag, and counter readable at inspection scale. Active-speaker highlighting was checked in the browser and the first line plus left adult changed state together. The playtest follow-up evidence separately verifies the no-cat dialogue state, the enlarged functional cat on mobile, and desktop/mobile milestone placement without clipping or document scrolling.

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

### Pass 4 — passed after child playtest fixes

- P1 story causality: `L01-M01` reused the same item-to-person handoff later needed by `L01-M03`, so children experienced one handbag being returned twice. The first-listen comprehension action now asks only for the owner; the handbag stays passive until the single real return in `L01-M03`.
- P1 companion hierarchy: the explorer cat had been injected into every mission and became a tiny sticker beside adult feet. Ordinary dialogue and word scenes now omit it. Catalog-authored child-role scenes, partner rescue, and chapter/unit rewards show the same approved cat at a featured scale.
- P2 responsive polish: the owner-choice paper was mostly empty, attempt hearts crossed an adult face, and mobile adult-scene headings extended beyond the viewport. The choice paper is compact, hearts live inside the task console, and mobile headings are centered with bounded geometry.
- Accepted evidence: `docs/designs/lesson1-2-design-qa/no-decorative-cat-desktop-20260819.png`, `featured-cat-mobile-20260819.png`, `chapter-reward-desktop-20260819.png`, and `chapter-reward-mobile-20260819.png`. Browser console errors and warnings were empty.

### Pass 5 — passed after role and pronunciation playtest fixes

- P1 speaker completeness: Lesson 2 ownership exchanges displayed only the claimant even when the station keeper was asking, listening, or handing over the object. `L02-M02:S02–S07` and `L02-M06:S02–S08` now declare both the station keeper and claimant in catalog; the shared renderer shows the established man on the left and claimant on the right without page-specific content.
- P1 pronunciation candidate: child playtest rejected the former `coat`, `dress`, `skirt`, and `shirt` bytes even though Source ID mapping and decoding were correct. The four local-only candidates now use macOS `en-US` Samantha at 145 words per minute, normalized to the existing 24 kHz mono MP3 contract. Their rejected SHA-256 values are permanently pinned by a deployment regression.
- Browser verification played all four replacement files in the authored clothing order and each real `ended` advanced to the next item. This verifies delivery, mapping, text visibility, and audio lifecycle; the composite pack remains explicitly unreviewed and cannot be treated as teacher/publication-approved without the existing human language gate.
- Accepted evidence: `docs/designs/lesson1-2-design-qa/station-keeper-watch-dialogue-20260819.png` and `clothing-audio-replacement-20260819.png`.

## Required fidelity surfaces

- Fonts and typography: existing local `ZCOOL KuaiLe`, `Fredoka`, and `Baloo 2` roles are retained; display Chinese, English transcript, speaker labels, and utility text have distinct readable weights and no clipping in the captured viewports.
- Spacing and layout rhythm: adults frame rather than sit beneath the transcript; the panel, prompt, handbag, and counter have separate readable zones. When the cat has a real role it receives its own featured zone; desktop and mobile screenshots show no viewport overflow.
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
