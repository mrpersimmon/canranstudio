'use strict';
const { test, expect } = require('@playwright/test');

test('下架卡片消失，旧单课记录不冒充组合单元完成', async ({ page }) => {
  await page.addInitScript(()=>{
    localStorage.setItem('canran:l49:progress:v2',JSON.stringify({version:2,ratings:{l1:3,l2:3,l3:3,l4:3,l5:3}}));
    localStorage.setItem('canran:l50:progress:v2',JSON.stringify({version:2,ratings:{l1:1,l2:1,l3:1,l4:1,l5:1}}));
    localStorage.setItem('canran:soundmark:progress:v2',JSON.stringify({version:2,ratings:{vs:3,g1:3,g2:3,g3:3}}));
  });
  await page.goto('/');
  await expect(page.locator('[data-course="lesson49"], [data-course="lesson50"], [data-course="soundmark"]')).toHaveCount(0);
  await page.locator('#unit4950Entry, #unitEntry').click();
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('单课历史星星在刷新后保留，导航不会清除练习手记', async ({ page }) => {
  const notebook=JSON.stringify({version:1,groups:{},records:{},activity:{workspaceRoute:'learn/give'}});
  await page.addInitScript(value=>{
    if(localStorage.getItem('seeded'))return;
    localStorage.setItem('seeded','yes');localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:2,l3:0,l4:0,l5:0}));
    localStorage.setItem('canran:l49:learning:v1',value);
  },notebook);
  await page.goto('/?district=first-book-49-60&focus=lesson49');await page.reload();
  await expect(page.locator('[data-course="lesson49"]')).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.getItem('canran:l49:learning:v1'))).toBe(notebook);
});
