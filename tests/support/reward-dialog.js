'use strict';
const { expect } = require('@playwright/test');
const handlers = new WeakMap();

async function waitForRewardDismissal(page) {
  // One browser-side predicate keeps the original assertion deadline without
  // two RPC/trace snapshots per poll. A pending or flying card still blocks;
  // a closed card or a historical renderer without this field does not.
  await expect(page.locator('dialog.award-reveal[open][data-dismissible="false"]')).toHaveCount(0);
}

async function dismissRewardDialog(page, key = 'Escape') {
  await waitForRewardDismissal(page);
  const dialog = page.locator('dialog.award-reveal[open]');
  if (await dialog.count()) await dialog.press(key);
}

// Data/upgrade walkthroughs acknowledge rewards as a learner would. A single
// isVisible() probe after completion can miss a later server confirmation.
// Animation tests explicitly keep the dialog and remove this handler.
async function handleRewardDialog(page, keepAward = false) {
  const existing = handlers.get(page);
  if (keepAward) {
    if (existing) await page.removeLocatorHandler(existing);
    handlers.delete(page);
  } else if (!existing) {
    const dialog = page.locator('dialog.award-reveal[open]');
    await page.addLocatorHandler(dialog, async () => {
      // The card owns focus until its confirmed star has landed. A learning
      // walkthrough must wait for the same dismissal gate as the student;
      // repeated early Esc presses would now correctly leave the card open.
      await dismissRewardDialog(page);
    });
    handlers.set(page, dialog);
  }
}

module.exports = { handleRewardDialog, waitForRewardDismissal, dismissRewardDialog };
