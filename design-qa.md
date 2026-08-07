# Landmark Review Immersive Mode — Design QA

- source visual truth path: `docs/designs/adventure-map/golden-route-page-49-52/selection-v5-glowing-plaque-flag.png`
- implementation screenshot paths:
  - `docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-immersive-mobile.png`
  - `docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-immersive-desktop.png`
  - `docs/designs/adventure-map/golden-route-page-49-52/implementation-v5-child-map-mobile.png`
- viewport:
  - mobile: `390 x 844` CSS px
  - desktop: `1440 x 1000` CSS px
- pixel dimensions and normalization:
  - source: `1023 x 1537` px at 72 dpi
  - mobile implementation: `390 x 844` px at device scale factor `1`
  - desktop implementation: `1440 x 1000` px at device scale factor `1`
  - the source was proportionally normalized to `562 x 844` px and placed beside the unscaled `390 x 844` browser capture; no stretch or crop was used
- state: Lesson 51, stage 3, child preview, journey scenario; current landmark unfinished and intentionally unlit
- full-view comparison evidence: `docs/designs/adventure-map/golden-route-page-49-52/design-qa-comparison-v5-immersive-mobile.png`
- focused region comparison evidence: not needed; the full-height comparison keeps the glowing Lesson 51 plaque and the adjacent cat/flag marker readable at final mobile density

## Findings

- No actionable P0, P1, or P2 visual findings remain.
- The current lesson is identified by a contained warm-gold plaque glow, not a landmark-sized halo.
- The cat and purple-gold explorer flag read as one route marker without a separate ground ring.
- The unfinished Lesson 51 building remains unlit; selection emphasis is isolated to the plaque and route marker.
- The same plaque/flag treatment is present on the real child atlas, not only inside the review workbench.
- Mobile single-page and desktop spread previews retain their authored aspect ratios and stay inside the viewport.
- Immersive chrome auto-hides, leaving an unobstructed review surface, and returns on pointer, touch, focus, or keyboard activity.

## Comparison History

1. P1: the previous landmark halo dominated the page and the cat's ground marker was visibly offset. Fix: removed both halos, moved emphasis to the plaque, and replaced the ground marker with a dedicated purple-gold flag asset. Post-fix evidence: `design-qa-comparison-v5-immersive-mobile.png`.
2. P1: the in-app browser briefly entered and immediately cancelled native fullscreen, which also closed the CSS immersive fallback. Fix: added a cancellation grace path that preserves the window-filling review mode when native fullscreen is interrupted during entry. Post-fix evidence: `implementation-v5-immersive-desktop.png`; the preview fills the viewport and controls are hidden.
3. P2: the first browser capture rendered the new cat/flag marker too small to read at phone size. Fix: increased the authored marker footprint from 17% to 21% of the route-page width while preserving its anchor. Post-fix evidence: `implementation-v5-immersive-mobile.png`.

## Interaction and Runtime Checks

- Primary interactions tested: enter/exit immersive review, `F` toggle, `Esc` exit, left/right stage switching, stage-strip auto-hide/reveal, and art/placement/student review modes.
- Responsive checks: 390 x 844 phone, 466 x 980 Huawei simulation, 1440 x 1000 desktop spread, plus the real child atlas at 390 x 844.
- Console warnings and errors checked: none.
- Automated evidence: 24 landmark-review end-to-end tests passed, including fallback fullscreen, geometry, flag, plaque glow, storage isolation, preload, and responsive layout coverage.

## Residual Test Gap

- Native system-fullscreen behavior still depends on each physical browser shell; the CSS immersive fallback is verified and remains the authoritative no-failure path.

final result: passed
