# Lesson 51 certificate gate design QA

## Visual truth

- Selected source: `/Users/sunnywinter/.codex/generated_images/019fad15-e13e-74b0-be3f-883cdae4e180/exec-7f8679be-607d-461b-bc84-ef1f6f4e408f.png`
- Implementation capture: `/tmp/canranstudio-l51-certificate-implemented.png`
- Side-by-side comparison: `/tmp/canranstudio-l51-certificate-comparison.png`
- Source pixels: 1074 × 1465
- Implementation pixels: 757 × 1033
- Comparison pixels: 1538 × 1033
- Browser CSS viewport: 757 × 1033
- Density normalization: the source was proportionally reduced to 757 px wide before comparison; both sides were then judged at the same displayed width.
- State: five earned stars, three unfinished levels, certificate name `段然`, locked-print guidance expanded, primary recovery action focused.

## Comparison evidence

The full-view comparison includes the certificate, locked print button, remaining-count copy, ticket container, both recovery actions, page chrome, and footer. The gate is large enough to inspect directly in the full view, so a separate crop would duplicate the same evidence without revealing additional detail.

The implementation matches the selected direction in the material areas: existing cream paper surface, dark hand-drawn outline and offset shadow, blue primary action, outlined secondary action, centered remaining-count message, ticket-style side notches, and clear placement immediately beneath the print control.

## Findings and comparison history

- P0: none.
- P1: none.
- P2: none.
- P3: none requiring correction.
- Initial comparison found the gate edges too card-like. The final refinement added semicircular side notches while preserving the existing page's responsive sizing.
- The production certificate dimensions were intentionally preserved instead of copying scale drift from the generated reference outside the selected gate area.
- The yellow focus ring visible on the primary recovery action is intentional keyboard-accessibility feedback.

## Interaction checks

- Clicking the locked print control opens the guidance and focuses `前往第一个未完成关卡`.
- Clicking `稍后再说` closes the guidance and restores focus to the print control.
- Reopening the guidance and choosing the primary action moves to the actual first unfinished level and focuses its heading.
- Automated coverage also verifies the all-complete path continues to the existing name validation and print behavior.

## Console

- No warnings or errors were reported in the browser console during the expanded locked-certificate state and recovery-action checks.

## Final result

passed
