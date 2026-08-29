# Lesson 1–2 Design QA History

## Latest implementation sync — R3 答案中立、场景图可读性与零闪烁必检（2026-08-30）

- scope: 本地错误修复与发布阻断门禁；不授权提交、推送、合并或发布
- current preview revision: `lesson1-2-v2-20260830-r6`
- R3-01: 阶段 5 动作提示改为答案中立；Catalog 校验同时扫描步骤提示、动作说明、微任务提示、导航标题、呈现标题与呈现提示，正确英文不得提前出现在任一可见文案
- R3-02: `L02-M20/M21` 的汽车／房屋场景图在电脑和手机使用独立可读尺寸，并以 `object-fit: contain` 完整显示，不再用小方框或裁切主体
- QA-MUST-01: “界面不能闪烁”成为每个新候选的发布阻断必检项；必须运行名称含 `QA-MUST-01` 的自动门禁，并保留同候选真实浏览器整课视觉巡检
- automated evidence: unit `302/302`; related deploy/style contracts `12/12`; Lesson 1–2 E2E `46/46`; named zero-flicker gate `5/5`
- evidence boundary: 自动门禁覆盖四个必检画幅的同阶段 DOM 身份，以及阶段回看进入／返回主线期间逐帧无空白、无启动后备页、背景图已解码；GPU 合成层瞬闪仍须真人整课观察
- current result: 本地自动门禁通过；真人整课视觉／听音与目标年龄儿童验收待完成，因此不是可发布候选

### Permanent zero-flicker checklist

- [x] `1280×720`、`1440×900`、`390×844`、`844×390` 切换不重挂载同阶段舞台、任务板、人物、物品及图片节点
- [x] 每个必检画幅开合阶段地图不重建同阶段舞台
- [x] 重听、真实 `ended`、答错、答对、支架和设置开合不重播入场动画
- [x] 进入阶段回看并返回主线的每个可绘制帧都有完整舞台与已解码背景，不出现启动后备页
- [ ] 每个候选完成一次真实浏览器整课视觉巡检；任何闪烁立即阻断

## Latest implementation sync — 删除独立徽章并直呈 car/house（2026-08-23）

- scope: as-built 文档同步，不是新的视觉方案选择或儿童验收
- current implementation: `http://127.0.0.1:4173/poc/lesson1-2-experience/`
- active route: Lesson 1 五项 + Lesson 2 十项；`L01-M04` 已退役并恢复到 `L01-M05`
- current objects: handbag + 八张透明物品资产 + car/house 两张完整小镇场景资产
- current story change: 独立徽章感谢页整体删除；T5 留在外套真实归还；car/house 不再使用钥匙、钥匙交接或额外感谢动作
- current growth boundary: 只有 `L02-M10` 原子完成后才写入当日地标
- automated evidence: unit `212 / 212`; Lesson 1–2 E2E `27 / 27`; complete E2E first run `324 / 325`, with the sole geometry-boundary case passing an isolated `1 / 1` rerun; deploy `84 / 84` and static build passed only on disposable candidate `138ccde0f775b27ef52823a6fb82c5ebf70767a3`
- evidence boundary: the real branch remains a dirty, uncommitted worktree; there is no same-branch-SHA release proof, no new source-versus-render comparison for the car/house scenes, and no target-age child acceptance
- result: implementation snapshot synchronized; visual/audio/child acceptance remains open

## Previous run — 单卡星光反馈（2026-08-23）

- source visual truth: `/Users/permission/.codex/generated_images/019ff04d-0b92-7441-bdf8-08e572cb4e45/exec-2e5f403a-ff6d-42b7-875e-0514037363c5.png`
- source pixels: `1598 × 984`
- current implementation: `http://127.0.0.1:4173/poc/lesson1-2-experience/`
- intended comparison state: `NCE-U01 / L01-M02:S01 / audio-playing / correct Excuse me!`
- intended desktop viewport: current Codex in-app Browser viewport, device density `1`
- intended mobile viewport: `390 × 844` CSS px, device density `1`
- implementation screenshot: unavailable because the in-app Browser's admin-enforced local-page safety check could not be verified
- final result: blocked

### Findings

- [P1] Same-state rendered visual evidence is unavailable
  - Location: Lesson 1–2 correct-answer feedback inside `.mission-console`.
  - Evidence: the selected ImageGen source opens correctly and the implementation is locally served, but repeated in-app Browser capture attempts were denied because its admin-enforced safety check was unavailable. The restriction was not bypassed and no alternate browser surface was substituted.
  - Impact: typography, spacing, star placement, crop, and responsive polish cannot be honestly compared against the selected source image in the required same-input review.
  - Fix: when the safety check is available again, open stage 2, choose `Excuse me!`, capture the `audio-playing` state at desktop and `390 × 844`, then compare those captures together with the selected source.

### Full-view and focused-region comparison evidence

Blocked. The source visual was opened and inspected, but no current browser-rendered implementation screenshot could be captured. The prior screenshot of the rejected two-layer state is not accepted as evidence for this implementation. The intended focus region is the cream hanging console containing the heart meter and `.feedback-audio-state[data-tone="correct"]`.

### Required fidelity surfaces

- Fonts and typography: implementation keeps local `Fredoka` for the English display and `ZCOOL KuaiLe` for Chinese guidance; current rendered fidelity is not visually verified.
- Spacing and layout rhythm: code consolidates success into one `500px`-bounded card and removes the detached feedback surface; current rendered fidelity is not visually verified.
- Colors and visual tokens: implementation reuses the established cream, walnut, brass, teal, coral-heart, and night tokens; current rendered fidelity is not visually verified.
- Image quality and asset fidelity: the reward accent uses the committed local Bootstrap `star-fill.svg`; no placeholder, emoji, or new third-party asset is used. Rendered filtering and edge quality are not visually verified.
- Copy and content: `Excuse me!` remains catalog-derived. The card shows `答对啦，听听这句话` and `读完会自动继续`; automated tests verify there is no duplicate correct-feedback status.

### Primary interactions checked automatically

- correct selection starts the target recording directly
- English remains visible during playback
- no extra play or confirmation action appears
- exactly one live status exists in the mission console
- the former `.feedback-bubble[data-tone="correct"]` is absent
- the local star asset is present in the integrated card
- real `ended` callbacks remain the progression gate
- Lesson 1–2 focused E2E: `25 / 25` passed
- full release verification at commit `ba7c249dba765728fa1de01e3a44f61806d4a41f`: unit `205 / 205`, E2E `323 / 323`, deploy `83 / 83`, static build passed

### Comparison history

- The source image was inspected and the previous duplicated state was reproduced before coding.
- TDD changed the renderer from two live feedback surfaces to one integrated card and preserved the audio lifecycle.
- Focused and full automated validation passed.
- Post-change browser capture remained blocked, so the latest visual gate is still blocked.

### Implementation checklist

- [x] Remove the detached duplicate correct-feedback strip.
- [x] Keep the English sentence visible while its catalog recording plays.
- [x] Integrate one local brass star accent into the main feedback card.
- [x] Preserve automatic continuation only after the matching audio `ended` event.
- [x] Run focused and complete automated verification.
- [ ] Capture desktop and mobile implementation evidence in the in-app Browser.
- [ ] Compare source and implementation together and fix any P0/P1/P2 mismatch.
- [ ] Change the latest `final result` to `passed` only after the visual gate succeeds.

### Follow-up polish

No P3 polish is accepted or deferred until the blocking same-state comparison is complete.

## Previous passed review — 双侧人物舞台 through correction option 1

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

### Pass 6 — systemic role and whole-pack audio correction

- P1 coat-owner causality: the coat-return scene had treated the explorer cat as the lost owner, leaving no explicit human owner in the exchange. Catalog now owns a distinct `coat-owner` role using the established woman image. The second returner and coat owner remain together through question, confirmation, handoff, and thanks; the cat returns to its guide identity.
- P1 repeated pronunciation rejection: after the key-file chapter exposed the same class of problem, the four-file correction was superseded by a complete 32-file local pack rebuild. Every male turn and product ownership question uses Reed; every female turn and standalone word uses Samantha; all entries declare `en-US`, `macOS-say`, stable catalog identity, and the existing 24 kHz mono MP3 contract.
- The deployment contract rejects the retired composite pack shape and keeps the original four child-rejected hashes banned. The new pack remains `local-poc-candidate-unreviewed`; visual and technical acceptance cannot substitute for final American-English review or recording rights.
- Historical browser verification completed the external coat-owner exchange and the then-active car-key path (`car`, `house`, `Excuse me!`, `Yes?`, `Is this your car?`, `Yes, it is.`) through real `ended` events with no console warnings or errors. That key path and `key-voice-pack-stage-20260819.png` are retained only as historical evidence; ADR-0102 later retired both key entities.

### Pass 7 — original voice pack restored by direct user choice

- The user rejected the unified macOS candidate after listening and explicitly selected the very first audio version. Audio assets, manifest, builder, and ADR were restored exactly from `c0219b3`; all later role, story, layout, and interaction improvements remain intact.
- The active local pack is again `nce-u01-kokoro-candidate-v1` with the original `am_michael` male and `af_heart` female/word mapping. This is a user-selected local acceptance baseline, not evidence that the candidate is teacher-reviewed or publishable.
- A deployment regression pins the selected 32-file identity-and-byte fingerprint `0b1fabede0790a7b98a53335515f7cd295bfc305008788370564df1e2e082980`, while the existing per-file hash checks bind all manifest entries to their actual bytes. Manifest metadata can now name the course baseline without changing any selected recording. Any future partial or whole-pack replacement must be an explicit new user decision.

### Pass 8 — course voice baseline and language-first feedback

- Direct diagnosis separated the selected voice files from the audible “pre-tone”: the runtime was deliberately playing `correct-chime.mp3` before feedback language, then waiting through the original word recording's short leading silence. The tonal cue, not the female voice, created the perceived vocal prelude.
- The original `am_michael` and `af_heart` recording bytes remain unchanged. Catalog now owns `nce-youth-v1` as the course-wide youth male/female baseline, standalone words default to `af_heart`, each teaching unit names the baseline, and the builder plus deployment contract enforce the mapping.
- Correct answers now show visual confirmation and start the target English directly. The prefatory cue asset and runtime branch were removed; the target recording's genuine `ended` remains the sole progression gate, and browser tests assert that no cue request occurs across phrase, word-form, and owner-identification feedback.

### Pass 9 — incomplete cue diagnosis corrected by decoded-audio evidence

- Direct user retest proved Pass 8's causal conclusion incomplete: removing `correct-chime.mp3` did not remove the perceived prelude. Live browser inspection then showed only the four target clothing MP3 resources and no secondary cue or overlapping sound request.
- A red browser-decoding regression measured all twenty-one standalone word recordings at 380–430 ms before first English energy. Pack `nce-u01-kokoro-candidate-v2` removes this non-language padding across the complete 32-file unit; the current assets copy the selected MP3 speech frames without re-encoding or changing `am_michael` / `af_heart`.
- The same browser-decoding regression now requires every standalone word to begin English within 150 ms, while per-file hashes, Source IDs, voice mapping, full-unit replacement, visible English, and real `ended` remain enforced. If human retest still rejects the sound, the next diagnosis is the voice's synthesized onset/prosody itself, not another UI cue.

### Pass 10 — human-selected context-cropped standalone words

- Human retest still rejected the onset after cue removal and padding cleanup, confirming the problem was isolated-word synthesis rather than runtime playback. A same-volume anonymous A/B/C page compared the existing file, direct `af_heart` at normal speed, and `af_heart` generated in a carrier then cropped to its final complete target.
- The user selected C as the only version without a special onset. Pack `nce-u01-kokoro-candidate-v3` now assigns `context-cropped-lexeme-v1` at speed 1.0 to all twenty-one standalone words while retaining `natural-utterance` for dialogue and complete questions.
- Kokoro regeneration was observed to vary bytes even under the same recipe. The exact four C files the user heard for `coat`, `dress`, `skirt`, and `shirt` therefore remain the human-acceptance anchors and are pinned individually by SHA-256; the other seventeen context-rendered files remain unreviewed candidates.

### Pass 11 — sampled first-session retrieval and illustrated object system

- Direct playtest found that eleven words × two first-session channels produced twenty-two standalone checks and two thirds of all formative results. Catalog now keeps all eleven words exposed but freezes only eight first-session T1 results: audio-form `handbag / watch / shirt / skirt / house` and word-form `pencil / coat / car`; the other fourteen long-term cells move into adaptive review.
- Ten emoji objects were replaced with separate built-in ImageGen transparent cutouts using the accepted stage background, handbag material quality, and first pen asset as style references. The existing handbag remains the eleventh item. Catalog owns all AVIF/WebP addresses; the runtime has no item-specific image mapping and no child-facing emoji fallback.
- Desktop and 390×844 browser checks increased the old icon slot to preserve object detail while retaining one-viewport task geometry. Evidence: `docs/designs/lesson1-2-design-qa/item-art-stage8-desktop-20260820.png` and `item-art-stage8-mobile-20260820.png`. Automated checks cover all ten masters and twenty derivatives, eight sampled T1 cells, all eleven exposure refs, full twelve-task completion, and zero object emoji nodes.

> Current override: the pass above describes its own historical twelve-task asset state. ADR-0102 later removed the two key masters and derivatives. The active set is now eight transparent object masters with sixteen transparent derivatives, plus two opaque car/house scene masters with four scene derivatives; the active flow has fifteen microtasks.

### Pass 12 — correction feedback belongs to the task console

- Screenshot-backed user review rejected the bottom-right white correction Toast and oversized black star as visually detached from the station. The black star was also a real rendering mismatch: an external SVG loaded through `<img>` cannot inherit the surrounding `currentColor`.
- Support, correct, partner, and persistence feedback now share one in-console luggage-tag treatment with cream paper, walnut shadow, brass punch hole, a masked star seal, and a small semantic heading. Partner rescue retains the approved cat image; teal and rose remain restrained state accents rather than separate component styles.
- A browser regression creates the exact first owner-identification error, requires the support tag inside `.mission-console`, verifies the `星灯提示` heading and brass seal, rejects the old `img.ui-icon`, and checks that the tag remains geometrically inside the console. The complete 25-test Lesson 1–2 flow remains green.

### Pass 13 — selected option 1 becomes the correction state

- The user rejected the cream luggage-tag correction treatment and selected the high-fidelity option 1 image as the visual source of truth. The first owner-identification error now removes the paper response console and replaces it with one compact walnut-and-brass mission bar. The remaining attempt hearts are integrated at the left, followed by the exact scaffold `回想一下，最后是谁说“对，是我的”。`; the two adult characters and handbag remain the dominant scene actors.
- P2 desktop proportion: the first implementation used `68vw`, making the bar materially wider than the selected source. The final implementation uses a bounded `56vw` rhythm, enlarges the integrated hearts, and keeps the bar centered directly beneath the question. The course header, progress meter, mission title, character labels, and real catalog text intentionally remain because they are established product and learning constraints rather than decorative differences.
- P2 mobile context: the existing small-screen rule hid the stage question during correction, leaving only the scaffold. The selected correction state now swaps the chapter heading for the original question on small screens, keeping both the question and scaffold visible without covering the characters or handbag.
- Same-input QA evidence: `docs/designs/lesson1-2-design-qa/feedback-option1-source-normalized-20260820.png` and `feedback-option1-implementation-20260820.png` are placed together in `feedback-option1-comparison-20260820.png` at `1068 × 526`; `feedback-option1-mobile-20260820.png` verifies the `390 × 844` layout. The exact wrong-answer state was exercised in the in-app browser; console errors were empty. No P0, P1, or P2 mismatch remains.

## Required fidelity surfaces

- Fonts and typography: existing local `ZCOOL KuaiLe`, `Fredoka`, and `Baloo 2` roles are retained; display Chinese, English transcript, speaker labels, and utility text have distinct readable weights and no clipping in the captured viewports.
- Spacing and layout rhythm: adults frame rather than sit beneath the transcript; the panel, prompt, handbag, and counter have separate readable zones. When the cat has a real role it receives its own featured zone; desktop and mobile screenshots show no viewport overflow.
- Colors and tokens: midnight navy, warm walnut, brass, cream paper, teal interaction, and rose/teal speaker accents map to the selected visual and existing product tokens.
- Image quality and asset fidelity: adult identities match the supplied cast; handbag, eight generated transparent textbook objects, two generated car/house scene images, and the wide background are real raster assets. Transparent object masters retain alpha; car/house intentionally use full opaque scenes; AVIF/WebP derivatives remain catalog-owned.
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

final result for the previous same-state visual gate: blocked
