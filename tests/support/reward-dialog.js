'use strict';
const handlers = new WeakMap();

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
    await page.addLocatorHandler(dialog, async () => { await page.keyboard.press('Escape'); });
    handlers.set(page, dialog);
  }
}

module.exports = { handleRewardDialog };
