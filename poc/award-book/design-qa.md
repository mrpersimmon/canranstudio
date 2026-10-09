# Design QA — award book

final result: passed

Amended by v0.19 (2026-10-09 11:10): animation was enabled manually in the earlier QA tab, but its session-only preference was lost in a new tab. Explicit on/off choices now persist across visits and synchronize open tabs. Real browser checks covered migration, reopening with on/off/on, refresh, cross-tab updates and visible rotation (25 distinct transform samples). See [v0.19 evidence](../../docs/award-version/2026-10-09-1110-v0.19-翻页动画偏好持久保存.md).

Amended by v0.18 (2026-10-09 10:45): the v0.17 resting-page color check missed the animation's mismatched paper, mobile opacity fade and disabled-button flash. These are fixed; see [the correction and red/green evidence](../../docs/award-version/2026-10-09-1045-v0.18-纪念册翻页颜色连续性修复.md). The original implementation/performance evidence below remains a historical v0.17 record.

Scope: approved v0.16 design → independent local interactive prototype. This result covers the inspected local views and interactions, not real account integration, production capacity, physical mobile devices, or pixel-identical replication of AI lettering.

## Reference and same-size comparison

Reference: `../../docs/award-version/visuals/2026-10-09-0101-v0.16/open-book.png` (1487×1058).

Rendered: [2026-10-09-1020-v0.17-award-book/desktop.jpg](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/desktop.jpg) (1487×1058). Both images were opened in one visual comparison input. The native material/image components were extracted or generated with imagegen and then rendered as real UI, rather than using the entire reference as a screenshot background.

## Five surfaces

| Surface | Final result | Findings and correction |
| --- | --- | --- |
| Font | passed | Existing licensed Award Round and Baloo font family, proper Chinese glyph loading. Font readiness gates card reveal. AI mock lettering replaced by actual project typography; this is a small visual difference. |
| Layout and spacing | passed | Independent two-page desktop book; one page on 390/320px. Cards do not cross spine. 1280×720 compact book keeps navigation bottom ~668px and body height 717px. |
| Colors | passed after v0.18 repair | Warm paper/ivory, sage cover, brown controls and card themes preserved. Actual turning faces now sample the same book artwork; no whole-sheet fade or busy-button color flash. Eight bidirectional checks across four screen sizes passed; middle-frame screenshots reviewed. |
| Imagery | passed | Real book, corner, scene and star assets; no hand-drawn replacement. Umbrella faces enlarged from the first extraction. Heads, umbrella, bag, 5 marker and star row remain complete. |
| Copy | passed | Short title, directory, page controls, enlarge and save. Demo identity/state explicitly labeled. No invented student awards, locked fake card, or date for three-star example. |

## Issues fixed before handoff

- P1: development font resolution initially failed and readiness correctly held the book back; generated font and built resource URLs resolved it. Retry reloads resources, not a stale failed FontFace.
- P2: umbrella extraction was too wide, making faces much smaller than Lesson 1–2. Regenerated a compact close-up, checked on paper at desktop and phone sizes.
- P2: missing photo corners compared with selected visual. Added extracted cream paper mounts without covering text or stars.
- P2: enlarged card pushed the save button toward the bottom edge on 720px-high screens. Constrained dialog width by available height; actual save button bottom ~635px.
- P2: normal laptop height required scrolling to reach page controls. Added a compact height-aware layout and verified the actual screen geometry.
- P2: operating system reduced-motion mode meant no visual flip would appear. Kept the accessible default and added an explicit in-album animation switch. Both modes checked without changing system preferences.

Open blocking issues: none within local prototype scope.

Small remaining visual differences (P3): generated blank paper has subtler texture than the concept; real font glyphs and individual scene composition are not literal replicas of generated lettering/artwork. True page curl deformation is represented by a lightweight hinged paper turn, not a physics simulation.

## Browser behavior evidence

- Ten animated turns total (five forward and five backward) completed without missing images; also checked rapid double-click and first/last disabled states.
- Directory selection, keyboard arrows, mouse page-footer drag, enlarged card close/Esc and focus return passed.
- Selected card remained correct across desktop/mobile resizing and five fully loaded reloads.
- Downloaded all three cards as independent 1640×880 PNGs. Third card has exactly three filled stars, two empty stars, ordinary border and no full-star date.
- Missing required book image: zero visible certificate elements, retry action available. Restoring the resource and retrying produced both desktop cards.
- 320px page width equals body scroll width; all currently displayed certificate images complete. Relevant mobile controls at least 44px high.
- Final local page console returned no warnings/errors.

Screens: [laptop](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/laptop.jpg), [390px](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/mobile-390.jpg), [320px](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/mobile-320.jpg), [modal](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/modal.jpg), [directory](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/directory.jpg), [turning frame](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/turning.jpg), [odd final spread](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/last-spread.jpg), [missing asset](../../docs/award-version/evidence/2026-10-09-1020-v0.17-award-book/missing-image.jpg).

## Performance boundary

10 animated flips plus card open/close/download produced zero additional server requests. Five complete reloads produced only 5 small HTML responses (1930 body bytes total), no asset requests. Static HTTP budget: 710597 body bytes with demo font subset; 1969129 if the current full Chinese-name font replaces that subset. Header/TLS overhead excluded.

Raw browser profiling was denied and was not retried through another protocol. Resource-size and preview-server request evidence were used instead. No production load test or measured GPU/frame-rate/memory claims. Physical Android/WeChat touch, save and animation acceptance is still required for release.
