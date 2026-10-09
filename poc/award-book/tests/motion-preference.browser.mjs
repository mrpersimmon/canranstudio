import { checkTurnColors } from './turn-colors.browser.mjs';

// Real UI regression: an explicit animation preference survives opening a new tab.
// Call with a settled source tab and a function that creates an independent tab.
export async function checkReopenedMotion(sourceTab, createTab, enabled) {
  await sourceTab.playwright.getByRole('button', { name: '目录', exact: true }).click();
  const control = sourceTab.playwright.getByRole('switch', { name: '翻页动画', exact: true });
  if ((await control.getAttribute('aria-checked')) !== String(enabled)) await control.click();
  await sourceTab.playwright.getByRole('button', { name: '关闭目录', exact: true }).click();
  const reopened = await createTab();
  try {
    await reopened.playwright.locator('.book').waitFor({ state: 'visible' });
    const motion = await reopened.playwright.locator('.book').getAttribute('data-motion');
    const turn = enabled && motion === 'full' ? await checkTurnColors(reopened, 1) : null;
    return { passed: motion === (enabled ? 'full' : 'reduced') && (!turn || turn.passed), expected: enabled, reopenedMotion: motion, turn };
  } finally {
    await reopened.close();
  }
}
