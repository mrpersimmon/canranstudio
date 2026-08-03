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

---

# Warm Lantern Market Canvas Design QA

## Evidence

- Selected visual target: `/var/folders/hs/ctnv_yyx61z9s4dhclr38q5h0000gn/T/codex-clipboard-86ef5437-b957-439a-8f2a-5d5e5d34e78c.png`
- Target dimensions: `1070 × 2016`
- Generated empty map layer: `assets/adventure-map/atlas/warm-lantern-parchment.jpg`
- Phone implementation: `/Users/sunnywinter/.codex/visualizations/2026/08/01/019fbc71-4582-7bd0-b601-ad7557fe6608/warm-lantern-market-mobile-handoff.png`
- Phone viewport and capture: `390 × 844`
- Same-size fidelity implementation: `/Users/sunnywinter/.codex/visualizations/2026/08/01/019fbc71-4582-7bd0-b601-ad7557fe6608/warm-lantern-market-1070x2016-v2.png`
- Same-size comparison: the selected target and implementation were inspected together at `1070 × 2016` in one comparison pass.
- Visible product state: Lesson 49 complete with its permanent food basket; Lesson 51 is the next recommended published location; Lesson 50 and Lesson 52–60 remain drawing-only map locations.

## Comparison history

1. The previous current-district UI was a generic multi-column card grid. This was a P1 mismatch because the selected target is one continuous bound-map canvas with a single winding route and one dominant current destination.
2. A clean raster parchment layer was generated from the selected composition. All source labels, buildings, characters, badges, tabs, and future-lesson art were removed before the real Lesson 49 and Lesson 51 assets were placed by the runtime.
3. The first responsive pass allowed the next homepage section to peek into the phone viewport and left long drawing labels competing with the route. The map now fills the `390 × 844` first viewport, and drawing-only locations use restrained number markers plus one explanatory legend.
4. The brand plaque was changed to the selected hierarchy: `灿然英语小镇` is primary, `暖灯集市` identifies the district, and the Lesson 49–60 range stays in the opposing ticket.
5. Lesson 49's six visual regression baselines were regenerated from the new integrated terrain treatment. Each state retains the same `147 × 147` capture geometry and one coherent snapshot.

## Fidelity and product-truth findings

- Layout: the bound page, dark outer cover, top-left brand plaque, top-right district ticket, upper completed destination, central recommendation, right-side pencil locations, lower published destination, and vertical route follow the selected composition.
- Typography: existing local `ZCOOL KuaiLe` and `Baloo 2` faces preserve the illustrated children’s-book hierarchy without third-party font requests.
- Color and surfaces: dark leather, aged parchment, faded moss, dusty violet route light, red Lesson 49 labels, and blue Lesson 51 labels follow the reference palette.
- Imagery: the page texture is one real raster asset; Lesson 49 and Lesson 51 retain their approved transparent PNG growth contracts. No CSS illustration, inline SVG substitute, emoji landmark, or placeholder lesson artwork is used.
- Product truth intentionally differs from the concept image: the runtime recommends Lesson 51 rather than inventing a publish-ready Lesson 50 landmark; Lesson 52 has no new artwork; the cat guide, Lesson 54 building, side-quest tower, course-directory tab, and monster tab remain absent until real assets and behaviors are approved.
- Content: all human-visible map labels describe published state accurately. Drawing locations are inert and cannot be mistaken for usable course entrances.

## Responsive, interaction, and accessibility checks

- `390 × 844`: the map is exactly one viewport wide and at least one viewport tall; document `scrollWidth` equals `clientWidth` (`390`).
- `768 × 1024`: the map is `676 × 1390.45` inside a `732` px atlas frame; document `scrollWidth` equals `clientWidth` (`768`).
- Phone and tablet preserve the Lesson 49–60 DOM order and expose two published locations plus ten inert drawing locations.
- The central recommendation link opens `/lesson51/`; the returned title is `希腊四季之旅 · 新概念一 Lesson 51`.
- The world-return control, recommendation, Lesson 49, and Lesson 51 remain keyboard reachable with visible focus treatment and practical touch targets.
- Reduced-motion, safe-area, map growth, phone/tablet rotation, and route tests pass with the new canvas.
- In-app Browser inspection reported no console errors or warnings on the map or Lesson 51 route.

## Verification snapshot

- Unit suite: `63 passed`.
- Focused atlas, Lesson 49, Lesson 51, and mobile release suite: `16 passed`.
- Full browser regression suite: `221 passed`.
- Deployment contract suite from a temporary committed candidate: `69 passed`.
- Static release build: passed and bound to temporary candidate commit `71ee8dbb698cc53ecb74b1112711e4f48f119066`; the release manifest includes the generated parchment asset.
- Same-size visual comparison: passed with no remaining P0, P1, or P2 mismatch inside the implemented V1 scope.

final result: passed
