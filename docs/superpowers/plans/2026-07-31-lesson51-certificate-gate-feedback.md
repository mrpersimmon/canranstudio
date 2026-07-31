# Lesson 51 Certificate Gate Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the locked Lesson 51 certificate print control explain the remaining work and offer a manual jump to the first unfinished level.

**Architecture:** Keep the existing rating source of truth and certificate authorization check. Replace native button disabling with an ARIA-locked state, render one inline ticket panel under the print button, and map the first missing rating ID to its existing lesson section anchor.

**Tech Stack:** Static HTML/CSS/JavaScript, repository progress helpers, Playwright.

## Global Constraints

- Preserve HTTP-only operation.
- Preserve the selected high-fidelity option 1 and the existing Lesson 51 visual system.
- A certificate remains printable only when every rating in `l1` through `l5` is at least `1` and the name is non-empty.
- Use exact copy: `还需完成 X 个关卡。`, `前往第一个未完成关卡`, and `稍后再说`.
- Do not add dependencies, routes, assets, persistence keys, or backend behavior.

---

### Task 1: Interactive Certificate Gate

**Files:**
- Modify: `lesson51/index.html`
- Test: `tests/e2e/l51-progress.spec.js`
- Create: `design-qa.md`

**Interfaces:**
- Consumes: `ratings`, `L51_IDS`, `canIssueL51Certificate()`, and the existing section IDs `w1` through `w5`.
- Produces: `firstMissingL51Level()`, `renderL51CertificateGate()`, `openL51CertificateGate()`, and `closeL51CertificateGate({ restoreFocus })`.

- [ ] **Step 1: Write the failing interaction tests**

Add Playwright coverage equivalent to:

```js
test('Lesson 51 locked print reveals manual recovery choices', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, JSON.stringify({
    version: 2,
    ratings: { l1: 1, l2: 0, l3: 1, l4: 0, l5: 0 }
  })), KEY);
  await page.goto('/lesson51/#cert');
  const print = page.locator('#btnPrint');
  await expect(print).toBeEnabled();
  await expect(print).toHaveAttribute('aria-disabled', 'true');
  await print.click();
  await expect(page.locator('#certGateActions')).toBeVisible();
  await expect(page.locator('#certGateCount')).toHaveText('还需完成 3 个关卡。');
  await expect(page.locator('#certGoFirstMissing')).toBeFocused();
});

test('Lesson 51 gate choices jump to the first missing level or dismiss', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, JSON.stringify({
    version: 2,
    ratings: { l1: 1, l2: 0, l3: 1, l4: 0, l5: 0 }
  })), KEY);
  await page.goto('/lesson51/#cert');
  await page.locator('#btnPrint').click();
  await page.locator('#certGateDismiss').click();
  await expect(page.locator('#certGateActions')).toBeHidden();
  await expect(page.locator('#btnPrint')).toBeFocused();
  await page.locator('#btnPrint').click();
  await page.locator('#certGoFirstMissing').click();
  await expect(page).toHaveURL(/#w2$/);
});
```

Update existing certificate assertions so an incomplete print control is enabled but has `aria-disabled="true"`, and a completed control has `aria-disabled="false"`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js
```

Expected: FAIL because `#certGateActions`, `#certGateCount`, `#certGoFirstMissing`, the ARIA state, and interactive locked behavior do not exist yet.

- [ ] **Step 3: Add the selected ticket panel and gate state**

In `lesson51/index.html`:

- Add the hidden `#certGateActions` region below `#certGateMsg` with `#certGateCount`, `#certGoFirstMissing`, and `#certGateDismiss`.
- Style it as the selected cream ticket with the repository's existing ink border, offset shadow, Aegean blue primary action, outlined secondary action, responsive stacking, focus-visible treatment, and print hiding.
- Keep `#btnPrint` enabled; set `aria-disabled` and an `is-locked` class from current eligibility.
- Implement the fixed mapping `{l1:'w1',l2:'w2',l3:'w3',l4:'w4',l5:'w5'}`.
- On locked print, open the panel and focus its primary action without printing.
- On primary action, close the panel and set `location.hash` to the first missing section.
- On secondary action, close the panel and restore focus to the print button.
- On eligibility, close the panel and preserve the existing name validation and real print path.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js
```

Expected: all Lesson 51 progress tests PASS with no page errors.

- [ ] **Step 5: Run regression verification**

Run:

```bash
npm run test:unit
npm run test:deploy
npm run test:e2e
```

Expected: unit, deployment, and all browser suites PASS.

- [ ] **Step 6: Complete browser interaction and visual QA**

Open `/lesson51/#cert` with incomplete ratings, click the locked print control, verify both choices, capture the expanded state at the same viewport as the visual target, compare both images together, and save `design-qa.md` with `final result: passed` only when no P0/P1/P2 mismatch remains.

- [ ] **Step 7: Commit the implementation**

```bash
git add lesson51/index.html tests/e2e/l51-progress.spec.js design-qa.md
git commit -m "fix: explain locked lesson 51 certificates"
```

