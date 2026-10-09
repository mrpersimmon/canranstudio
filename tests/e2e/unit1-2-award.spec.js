'use strict';
const { test, expect } = require('@playwright/test');
const { finishZone } = require('../support/unit1-2-award-flow');

test('新纪念卡显示五个答题区，未获星时没有满星日期', async ({ page }) => {
  await page.goto('/unit1-2/#learn/certificate');
  const card = page.getByRole('article', { name: '我的单元纪念卡' });
  await expect(card).toBeVisible();
  await expect(card.getByRole('img', { name: '男士把手提包交还给女士' })).toBeVisible();
  await expect(card.getByRole('group', { name: '已获得 0 / 5 颗星' })).toBeVisible();
  await expect(card.locator('time')).toBeHidden();
  await expect(page.getByRole('button', { name: '保存纪念卡', exact: true })).toBeDisabled();
  await expect(page.locator('.practice-runner')).toHaveCount(4); // 原文阅读后才开放故事理解。
  await page.getByText('查看五星任务', { exact: true }).click();
  await expect(page.getByRole('list', { name: '五星任务' }).getByRole('listitem')).toHaveCount(5);
  await expect(page.locator('#starCountWrap')).toContainText('/5');
});

test('错答订正、刷新不获星；重练整区零错才获星，已获星不会被新错答撤回', async ({ page }) => {
  await page.goto('/unit1-2/#learn/trans'); const room = page.locator('.stage-trans');
  await room.getByRole('button', { name:'This is your book.', exact:true }).click();
  await room.getByRole('button', { name:'检查答案', exact:true }).click();
  await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  await page.reload();
  await expect(room.getByRole('button', { name:'再试一次', exact:true })).toBeVisible();
  await room.getByRole('button', { name:'再试一次', exact:true }).click();
  await finishZone(page, 'trans');
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(room.locator('.award-round-result')).toContainText('本轮有过错答');
  await room.getByRole('button', { name:'再练一轮', exact:true }).click();
  await finishZone(page, 'trans');
  await expect(page.locator('#starCount')).toHaveText('1');
  await page.reload(); await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button', { name:'再练一轮', exact:true }).click();
  await room.getByRole('button', { name:'This is your book.', exact:true }).click();
  await room.getByRole('button', { name:'检查答案', exact:true }).click();
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.getByRole('group', { name:'已获得 1 / 5 颗星' })).toBeVisible();
  await expect(page.locator('#certificateDate')).toBeHidden();
});

// Hint use remains a separate learning record; it is not a wrong submission.
test('线索单独记录，整轮首次提交全对仍可获星', async ({page}) => {
  const {story,activity}=require('../support/thirteen-types-flow');
  await story(page,'1-2');
  await activity(page,'1-2','roles',{capture:async(room,i,state)=>{
    if(i===4&&state==='blank')await room.getByRole('button',{name:'给点线索',exact:true}).click();
  }});
  await expect(page.locator('#starCount')).toHaveText('1');
  await page.getByRole('button',{name:'学习手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('额外提示已用');
});
