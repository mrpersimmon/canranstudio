'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../core/curriculum-catalog');

const cases = [
  {
    unitId: 'NCE-U02',
    path: '/poc/lesson3-4-experience/?package-test-bypass=1',
    stageIndex: 2,
    selector: 'button.actor[data-entity-id="attendant"]'
  },
  {
    unitId: 'NCE-U03',
    path: '/poc/lesson5-6-experience/?package-test-bypass=1',
    stageIndex: 7,
    selector: 'button.entity-card[data-entity-id="volvo"]'
  }
];

async function openAtStage(page, config) {
  const unit = catalog.getTeachingUnit(config.unitId);
  const stage = unit.experience.stages[config.stageIndex];
  const progress = {
    revision: unit.experienceRevision,
    currentStageId: stage.stageId,
    completedStageIds: unit.experience.stages
      .slice(0, config.stageIndex)
      .map(candidate => candidate.stageId),
    completedRoleIds: [],
    contactedSourceRefs: [],
    evidenceRecords: []
  };
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: unit.experience.storageKey, value: progress });
  await page.goto(config.path);
  await expect(page.locator('.story-stage-experience')).toBeVisible();
  await expect(page.locator(config.selector)).toBeEnabled();
}

async function visualStyle(locator) {
  return locator.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      filter: style.filter,
      transform: style.transform,
      touchAction: style.touchAction
    };
  });
}

for (const config of cases) {
  test(`I01 shares candidate pointing feedback with ${config.unitId}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openAtStage(page, config);
    const candidate = page.locator(config.selector);
    const resting = await visualStyle(candidate);

    await candidate.hover();
    const hovered = await visualStyle(candidate);
    expect(hovered.filter).not.toBe(resting.filter);
    expect(hovered.transform).not.toBe(resting.transform);
    expect(hovered.touchAction).toBe('manipulation');

    await page.mouse.move(720, 40);
    await candidate.focus();
    const focused = await visualStyle(candidate);
    expect(focused.filter).not.toBe(resting.filter);
    expect(focused.transform).not.toBe(resting.transform);
  });
}
