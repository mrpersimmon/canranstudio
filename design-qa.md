# Home Learning Route Design QA

## Evidence

- Source visual: `/Users/sunnywinter/.codex/generated_images/019fad15-e13e-74b0-be3f-883cdae4e180/exec-2d387a95-8b89-4de2-b411-c93244b632c8.png`
- Source dimensions: `1001 × 1570`
- Desktop implementation: `/var/folders/hs/ctnv_yyx61z9s4dhclr38q5h0000gn/T/canranstudio-home-route-desktop-final.png`
- Desktop capture viewport: `1280 × 720`, full page
- Desktop capture dimensions: `1280 × 2068`
- Mobile implementation: `/var/folders/hs/ctnv_yyx61z9s4dhclr38q5h0000gn/T/canranstudio-home-route-mobile-final.png`
- Mobile capture viewport: `390 × 844`, full page
- Mobile capture dimensions: `390 × 4157`
- Combined comparison: `/var/folders/hs/ctnv_yyx61z9s4dhclr38q5h0000gn/T/canranstudio-home-route-comparison.png`
- Comparison dimensions: `2026 × 1617`
- Density normalization: the 1280 px implementation was scaled to 1001 px width with Lanczos resampling, then placed beside the 1001 px source with a 24 px neutral gutter and top alignment.
- Visible progress state: Lesson 49 `12/15`, Lesson 50 `0/15`, Lesson 51 `5/15`, soundmark `3/12`.

## Comparison history

1. Initial implementation used three desktop columns and produced a 2465 px full page. This was a P2 hierarchy mismatch because the selected source uses five stations in the first row and three in the second.
2. The route was changed to five columns above 940 px, three columns at medium width, and one column on mobile. Card heights and vertical spacing were tightened. Desktop full-page height dropped to 2068 px.
3. The second row was offset to follow the source route rhythm. The mobile special-station heading was reduced and kept on one line. The final combined comparison has no remaining P0, P1, or P2 mismatch.

## Visual findings

- Hierarchy: compact hero, continue panel, range controls, learning route, special station, and device tip follow the selected source order.
- Layout: wide desktop shows five stations then three; mobile uses one column with no horizontal page overflow.
- Typography: local Baloo 2 and ZCOOL KuaiLe remain legible with no external font request.
- Color and shape: cream dotted paper, deep-brown outlines, offset shadows, red/purple/blue lesson tones, and orange special station match the selected direction.
- Assets: all five course illustrations are local transparent PNG files with appropriate crops; no placeholder illustration is used for published courses.
- Accessibility: headings and landmark regions are named, range state uses `aria-pressed`, search feedback uses `aria-live`, focus is moved to located stations, and controls have visible focus rings.

## Interaction checks

- Selecting `1–24` shows the empty-range message while the special station remains visible.
- Search `51` selects `49–72` and focuses Lesson 51.
- Search `100` selects `97–120` and reports `Lesson 100 还未加入目录。`.
- Search `0` reports `请输入 1–144 的 Lesson 编号。`.
- The previous button is disabled at `1–24`; the next button is disabled at `121–144`.
- The recommendation chooses the highest-progress unfinished numbered lesson and ignores the special course.
- All published course routes remain reachable once from the numbered or special catalogue.
- Dedicated browser coverage reported no console errors or page errors.

## Verification snapshot

- Focused homepage, route, and local-font suite: `20 passed`.
- Desktop comparison: passed.
- Mobile overflow and one-column check: passed.

final result: passed
