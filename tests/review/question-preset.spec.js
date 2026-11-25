'use strict';
const {test, expect} = require('@playwright/test');
const {devices} = require('../support/required-phone-devices');
const questionEight = 'q:u34-grammar-v1-unknown-owner';

async function ready(page) {
  await expect(page.locator('#loading')).toBeHidden({timeout: 30000});
  await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#error')).toBeHidden();
}

async function openQuestion(page, device) {
  await page.goto('/?' + new URLSearchParams({unit: 'unit3-4', page: questionEight, state: 'before', device: device.id}));
  await ready(page);
  return page.frameLocator('#frame-shell iframe:not(.pending)');
}

for (const device of devices) {
  test('question preset keeps wrong feedback on the next question after checking a correction · ' + device.name, async ({page}) => {
    await page.setViewportSize(device.viewport);
    const frame = await openQuestion(page, device);
    const wrong = page.getByRole('group', {name: '展示状态'}).getByRole('button', {name: '答错', exact: true});
    await wrong.click();
    await ready(page);
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
    const originalDocument = await frame.locator('body').evaluate(() => performance.timeOrigin);

    await frame.getByRole('button', {name: '再试一次', exact: true}).click();
    await frame.getByRole('button', {name: "No, it isn't.", exact: true}).click();
    await frame.getByRole('button', {name: '检查答案', exact: true}).click();
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
    await frame.getByRole('button', {name: '下一题', exact: true}).click();

    await expect(frame.locator('.progress-copy:visible')).toContainText('第 9 / 10');
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
    await expect(wrong).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#current-title')).toContainText('第 9 题');
    expect(await frame.locator('body').evaluate(() => performance.timeOrigin)).toBe(originalDocument);

    await frame.getByRole('button', {name: '上一题', exact: true}).click();
    await expect(frame.locator('.progress-copy:visible')).toContainText('回看 8 / 10');
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('订正');
    await frame.getByRole('button', {name: '下一题', exact: true}).click();
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
    await expect(frame.getByRole('button', {name: '再试一次', exact: true})).toBeInViewport();
  });
}

test('question preset survives checking, reload and outer navigation until cancelled', async ({page}) => {
  const frame = await openQuestion(page, devices[0]);
  await page.locator('#state-buttons [data-state=selected]').click();
  await ready(page);
  await frame.getByRole('button', {name:'检查答案', exact:true}).click();
  await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
  await expect.poll(() => new URL(page.url()).searchParams.get('state')).toBe('correct');
  expect(new URL(page.url()).searchParams.get('preset')).toBe('selected');
  await page.reload();
  await ready(page);
  await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
  await frame.getByRole('button', {name:'下一题', exact:true}).click();
  await expect(frame.locator('.progress-copy:visible')).toContainText('第 9 / 10');
  await expect(frame.getByRole('button', {name:'检查答案', exact:true})).toBeEnabled();
  await expect(page.locator('#current-title')).toContainText('第 9 题');
  await page.getByRole('button', {name:'下一页', exact:true}).click();
  await ready(page);
  await expect(frame.locator('.progress-copy:visible')).toContainText('第 10 / 10');
  await expect(frame.getByRole('button', {name:'检查答案', exact:true})).toBeEnabled();
  await page.getByRole('button', {name:'取消沿用', exact:true}).click();
  expect(new URL(page.url()).searchParams.has('preset')).toBe(false);
  await expect(frame.getByRole('button', {name:'检查答案', exact:true})).toBeEnabled();
  await page.getByRole('button', {name:'上一页', exact:true}).click();
  await ready(page);
  await expect(frame.getByRole('button', {name:'检查答案', exact:true})).toBeDisabled();
  await expect(page.locator('#state-buttons [data-state=before]')).toHaveAttribute('aria-pressed','true');
});

test('question preset skips incompatible entries, resumes through the directory, and uses the next explanation', async ({page}) => {
  const frame=await openQuestion(page,devices[0]);
  await page.locator('#state-buttons [data-state=explanation]').click();
  await ready(page);
  const dialog=frame.locator('.learning-explanation-sheet[open]');
  const firstRule=await dialog.locator('p').innerText();
  await dialog.getByRole('button',{name:'知道了'}).click();
  await frame.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(page.locator('#current-title')).toContainText('第 9 题');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('p')).not.toHaveText(firstRule);
  // Story, cards and other activities have their own states. A question that
  // does not offer an explanation must also keep its own supported controls.
  const catalog=await (await page.request.get('/review/catalog.json')).json();
  const course=catalog.courses.find(c=>c.id==='unit3-4');
  const other=course.entries.find(e=>e.kind==='question'&&!e.states.includes('explanation'));
  for(const id of ['words-0',other.id,questionEight]){
    await page.locator('#entries button[data-page="'+id+'"]').click();
    await ready(page);
    expect(new URL(page.url()).searchParams.get('preset')).toBe('explanation');
    if(id===other.id){
      await expect(page.locator('#notice')).toContainText('本题没有');
      await expect(frame.locator('dialog[open]')).toHaveCount(0);
    }
  }
  await expect(dialog).toBeVisible();
  await expect(page.locator('#notice')).not.toContainText('本题没有');
  await expect(dialog.locator('p')).toHaveText(firstRule);
});
