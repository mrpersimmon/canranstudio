# Lesson 49–52 黄金册页 V4 · Design QA

## Comparison target

- Source visual truth: `docs/designs/adventure-map/golden-route-page-49-52/map-composition-review-v4-balanced-top.png`
- Browser-rendered phone screenshot: `docs/designs/adventure-map/golden-route-page-49-52/implementation-v4-phone.png`
- Map-only implementation crop: `docs/designs/adventure-map/golden-route-page-49-52/implementation-v4-map-466.png`
- Full-view side-by-side evidence: `docs/designs/adventure-map/golden-route-page-49-52/design-qa-comparison-v4-phone.png`
- Browser-rendered tablet screenshot: `docs/designs/adventure-map/golden-route-page-49-52/implementation-v4-tablet.png`
- Browser-rendered loading state: `docs/designs/adventure-map/golden-route-page-49-52/implementation-v4-loader.png`
- Production loader-frame evidence: `docs/designs/adventure-map/golden-route-page-49-52/loader-production-frames-v1.png`

## Normalization

- Source pixels: 941×1672.
- Implementation phone viewport: 466×980 CSS pixels, `devicePixelRatio: 1`.
- Implementation map element: 466×828.88 CSS pixels, matching the authored 940:1672 ratio.
- Source normalization: resized to 466×829 only for the combined comparison.
- Implementation normalization: cropped from the browser screenshot at `x=0, y=68, width=466, height=829`.
- Tablet verification viewport: 768×1024 CSS pixels, `devicePixelRatio: 1`.
- State: fifth district, first route page, `focus=lesson51`. The V4 composition mock deliberately uses completed illustrative landmarks, while the browser capture uses each course's legitimate 0/5 growth snapshot. The comparison therefore judges locked placement, relative visual weight, route continuity, nameplate placement, mascot position and responsive behavior; differences that are solely the designed growth state are not treated as fidelity defects.

## Full-view findings

No actionable P0, P1 or P2 mismatch remains.

- Fonts and typography: the page uses the repository's local Baloo 2/ZCOOL/PingFang stack. The district title, route subtitle, lesson numbers, Chinese adventure titles and progress markers remain readable at 466 px without clipping or forced wrapping. Nameplates retain the source hierarchy instead of becoming separate cards.
- Spacing and layout rhythm: four landmarks alternate left/right in the V4 order. Lesson 49 receives the larger top footprint, Lesson 50 is visibly lowered, the middle section has breathing room, and Lesson 52 clears the lower frame. The route connects every landmark without overlaps or a long empty tail.
- Colors and tokens: warm parchment, dark leather frame, purple route, red/purple/blue/green nameplate accents and cream outlines remain consistent with V4 and the Lesson 51 art master.
- Image quality and asset fidelity: the background is an authored 940×1672 raster and is rendered with `object-fit: contain`; it is never stretched. Course landmarks remain their reviewed full-state transparent snapshots. The route cat, foot marker and loader use real generated raster assets with responsive AVIF/WebP outputs; there are no placeholder boxes, emoji illustrations, inline SVG substitutes or CSS-drawn landmark art.
- Copy and content: “四季生活城”, “风味四季路 · Lesson 49–52”, four real lesson titles and five real progress stamps match the approved curriculum structure. Unpublished or later-page placeholders are absent.
- Responsiveness: the Huawei 466×980 and tablet 768×1024 captures preserve the same map order, ratio and composition. All four landmark click areas remain inside the authored frame.
- Accessibility and behavior: the back and settings controls remain at least 44 px, each landmark is one direct link with an accessible progress label, the current link uses `aria-current="step"`, the mascot does not intercept taps, and reduced motion disables pose cycling and movement.

## Focused evidence

The full-view combined input is already a 1:1 466-pixel-wide map comparison, and all nameplates remain legible; an extra typography crop would not reveal additional fidelity information. Loader fidelity was checked separately with the four-frame production contact sheet and the browser-rendered loading-state screenshot. The browser state shows one coherent, whole-pose cat on an opaque parchment-colored preparation surface, and the loader disappears as soon as the key images decode.

## Comparison history

### Pass 1 — blocked

- [P2] Loading overlay exposed floating landmarks before the parchment background arrived.
  - Evidence: the first delayed-network browser capture showed all four transparent landmark snapshots through a translucent overlay.
  - Impact: children could briefly see an obviously unfinished scene and mistake it for a broken map.
  - Fix: changed the loading surface to an opaque parchment color so only the A+ character is visible until key assets decode.

### Pass 2 — blocked

- [P2] The A+ mascot was too small relative to the empty loading surface.
  - Evidence: the second delayed-network capture showed the character at 38% stage width with excessive empty space.
  - Impact: the high-quality expression and map action were hard to read on a phone.
  - Fix: increased the frame stage from `clamp(164px, 38%, 300px)` to `clamp(210px, 52%, 380px)` while retaining the fixed foot anchor and responsive image selection.

### Pass 3 — passed

- Post-fix phone loading capture shows a clear, centered explorer-cat action with no floating landmarks.
- Steady phone and tablet captures retain V4's balanced four-stop route with no overlap, clipping or stretching.
- Console check: no warnings or errors.

## Primary interactions tested

- World overview → enter “四季生活城”.
- Route page → return to world overview.
- Four direct landmark links and accessible progress labels.
- Focused Lesson 51 → current cat position and `aria-current` state.
- Delayed key artwork → four whole-pose loader frames appear, then disappear after image decode.
- Reduced motion → static loader pose and no map/mascot motion.

## Residual test gap

- The V4 mock is a completed illustrative composition rather than a literal runtime progress state. Completed snapshot loading, alignment and single-image rendering are covered by automated tests; the browser comparison intentionally uses the normal 0/5 state so it does not invent child progress.

## Final result

final result: passed
