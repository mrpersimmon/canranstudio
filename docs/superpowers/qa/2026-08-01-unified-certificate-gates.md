# Unified certificate gates QA

## Scope and source

- Audit date: 2026-08-01 (Asia/Shanghai).
- Surface: the locked-certificate guidance ticket on Lesson 49, Lesson 50, Lesson 51, Lesson 54, and soundmark.
- Approved high-fidelity source: `/Users/sunnywinter/.codex/visualizations/2026/07/29/019fad15-e13e-74b0-be3f-883cdae4e180/.superpowers/brainstorm/66403-1785522637/content/certificate-ticket-family-l51-style-v2.html`.
- Source rendering: `/tmp/canran-certificate-approved-source.png` at `1280 × 900`.
- Final same-run comparison: `/tmp/canran-certificate-family-comparison.png`.
- Comparison checks: ticket face, notches, border, offset shadow, spacing, button proportions, course name, icon, accent, count, target copy, and dismiss copy.

The approved source computes to a `#fffdf5` ticket face, `3px solid #2f271f` border, `14px` radius, `7px 7px 0 #2f271f` shadow, `18px 19px` desktop padding, `28px` notches at `-15px`, a `1.55fr / 1fr` button ratio, and a `14px` button gap. All five desktop implementations reproduce those values; their content-driven ticket height is consistently `150.34px`.

## States and screenshots

All five pages used the same partial-star fixture family and their real certificate anchors. The gate was opened by its real course button before each capture.

| Page | Route | Stored ratings | Desktop `1280 × 900` | Mobile `390 × 844` |
| --- | --- | --- | --- | --- |
| Lesson 49 | `/lesson49/#l5` | `l1:3, l2:2, l3:3, l4:0, l5:3` | `/tmp/canran-certificate-l49.png` | `/tmp/canran-certificate-l49-mobile.png` |
| Lesson 50 | `/lesson50/#l5` | `l1:3, l2:2, l3:3, l4:0, l5:3` | `/tmp/canran-certificate-l50.png` | `/tmp/canran-certificate-l50-mobile.png` |
| Lesson 51 | `/lesson51/#cert` | `l1:3, l2:2, l3:3, l4:0, l5:3` | `/tmp/canran-certificate-l51.png` | `/tmp/canran-certificate-l51-mobile.png` |
| Lesson 54 | `/lesson54/#cert` | `l1:3, l2:2, l3:3, l4:0, l5:3` | `/tmp/canran-certificate-l54.png` | `/tmp/canran-certificate-l54-mobile.png` |
| soundmark | `/soundmark/#cert` | `vs:3, g1:3, g2:2, g3:3` | `/tmp/canran-certificate-soundmark.png` | `/tmp/canran-certificate-soundmark-mobile.png` |

Additional accepted component crops are `/tmp/canran-certificate-l49-detail.png`, `/tmp/canran-certificate-l50-detail.png`, `/tmp/canran-certificate-l51-detail.png`, `/tmp/canran-certificate-l54-detail.png`, and `/tmp/canran-certificate-soundmark-detail.png`.

## Visual inspection

1. Lesson 49: the red ticket now has the same mobile width and wrapping rhythm as the other numbered courses. The `🥩` identity, `#c43f36` accent, count, `课文剧场` target, notches, shadow, and two controls are complete and uncropped.
2. Lesson 50: the purple ticket matches the source geometry. The `👑` identity, `#7250b5` accent, `餐桌` target, copy, and controls are complete and uncropped.
3. Lesson 51: the blue baseline ticket keeps the approved geometry and hierarchy. The `🏛️` identity, `#1d6fb8` accent, `课文剧场` target, copy, and controls are complete and uncropped.
4. Lesson 54: the teal ticket matches the shared baseline. The `🛂` identity, `#167d92` accent, `机场广播剧` target, copy, and controls are complete and uncropped.
5. soundmark: the orange ticket keeps the same structure while using the challenge quantifier. The `🪄` identity, `#ef7047` accent, `左耳右耳` target, count, and controls are complete and uncropped.

The final side-by-side comparison contains no remaining P0, P1, or P2 visual difference from the approved ticket system. Course-page surroundings intentionally remain course-specific and were not redesigned.

## Comparison history and repair

1. Initial desktop captures showed the five pages sharing the approved geometry and color contract. Initial mobile evidence showed one P2 cross-page inconsistency: Lesson 49 was `266px` wide while the other gates were approximately `318–322px`, which forced an avoidable extra line in the count. Evidence: `/tmp/canran-certificate-l49-mobile-initial.png` and `/tmp/canran-certificate-family-comparison-initial.png`.
2. Root cause: Lesson 49 alone mounted `#l49CertificateGate` inside the padded assessment `.panel`. The shared mobile width therefore resolved against an already inset containing block.
3. Repair: move only the Lesson 49 mount immediately outside that panel, matching the other course wiring. Shared JavaScript, shared CSS, certificate output, storage, scoring, and audio were unchanged.
4. Final recapture: Lesson 49 is `322px` wide at `390px`, its copy no longer has the extra wrap, and its desktop ticket remains `620px`. Evidence: `/tmp/canran-certificate-l49-mobile.png`, `/tmp/canran-certificate-l49.png`, and `/tmp/canran-certificate-family-comparison.png`.

## Responsive and navigation checks

- Every `390 × 844` page reported `documentElement.clientWidth === 390` and `documentElement.scrollWidth === 390`.
- Mobile gates are `318–322px` wide after the repair. Notches and the `7px` offset shadow stay inside the viewport.
- Mobile button grids resolve to one column with a `10px` gap; the primary action is above `稍后再说` on every page.
- After smooth scrolling became stable, numbered-course target sections landed at approximately `96px` from the viewport top and their focused headings landed at `142–232px`, below the sticky navigation.
- soundmark activated game `g2`, changed the hash to `#g2`, and focused the visible game panel at approximately `86px` from the viewport top.

## Interaction, keyboard, announcement, and print

- Each locked opener remained enabled and expressed `data-certificate-state="locked"`, `aria-expanded`, `aria-controls`, and `aria-describedby` through the shared gate.
- Opening moved focus to the shared primary action. The dialog focus loop, rapid Escape behavior, opener removal fallback, preview close focus return, and Blob URL cleanup remained covered by the accessibility/export suites.
- Status elements retained `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`. Count, course, icon, action target, and dismiss copy matched the fixture on all pages.
- The missing-target case retained the open gate, announced `暂时找不到目标关卡，请使用课程导航。`, preserved the URL, and made zero print calls.
- Print media hid the certificate trigger and shared ticket on all five pages while preserving the existing certificate output path.
- All ten implementation captures recorded zero page errors and zero console errors.

Screenshot inspection cannot by itself prove full screen-reader or WCAG conformance. This QA combines current screenshots with DOM/ARIA, keyboard-focus, responsive, print, and error-path automation; no physical assistive-technology session was performed.

final result: passed
