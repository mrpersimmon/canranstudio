'use strict';
const { test, expect } = require('@playwright/test');
const { devices, contextOptions } = require('../support/required-phone-devices');
const { activity, story, ANSWERS } = require('../support/unit5354');
const { select } = require('../support/units1-30-tasks');

// Publish the real, saved view only when the test releases it. The question
// label can have text in the DOM before that text is painted on screen.
async function holdRestoredView(page) {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const saved = document.querySelector('.stage-roles .progress-copy, .stage-roles .practice-finish');
      if (!saved) return;
      const waiting = document.createElement('span');
      waiting.className = 'progress-copy';
      waiting.dataset.waitingForRound = '';
      saved.replaceWith(waiting);
      if (saved.matches('.progress-copy')) saved.style.visibility = 'hidden';
      waiting.addEventListener('restore-round', () => waiting.replaceWith(saved), { once: true });
    });
  });
}

async function reopenActivity(page, inspect) {
  await page.goto('about:blank');
  const [room] = await Promise.all([
    activity(page, 'roles', { inspect }),
    page.locator('[data-waiting-for-round]').dispatchEvent('restore-round')
  ]);
  return room;
}

for (const device of devices) {
  test.describe(device.name, () => {
    test.use(contextOptions(device));
    test('恢复时按原题号继续，重进完成页保留结算', async ({ page }) => {
      await story(page);
      await page.goto('/unit53-54/#learn/roles');
      const room = page.locator('.stage-roles');
      await select(room, ANSWERS.roles[0]);
      await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await room.getByRole('button', { name: '下一题', exact: true }).click();
      await expect(room.locator('.progress-copy')).toHaveText('第 2 / 7 题');
      await holdRestoredView(page);

      const answered = [];
      await reopenActivity(page, async (stage, index, phase) => {
        if (phase !== 'before') return;
        if (!answered.length) {
          const label = stage.locator('.progress-copy');
          await expect(label).toBeHidden();
          await label.evaluate(el => el.style.removeProperty('visibility'));
        }
        answered.push(index + 1);
      });
      expect(answered).toEqual([2, 3, 4, 5, 6, 7]);
      await expect(page.locator('#starCount')).toHaveText('1');

      const restored = await reopenActivity(page, () => { throw Error('已完成的活动重新作答'); });
      await expect(restored.locator('.completion-number')).toHaveText(['7', '7', '0']);
      await expect(restored.locator('.completion-stats')).toBeVisible();
      await expect(page.locator('#starCount')).toHaveText('1');
    });
  });
}
