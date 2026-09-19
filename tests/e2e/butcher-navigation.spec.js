'use strict';
const { test, expect } = require('@playwright/test');

test('首页直接进入组合单元，单课入口不需要经过城区地图', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '今天，去哪儿冒险？' })).toBeVisible();
  await page.getByRole('link', { name: '开始学习', exact: true }).click();
  await expect(page).toHaveURL(/\/unit49-50\/#learn\/words$/);
  await expect(page.getByRole('heading', { name: '采购小图鉴', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByText('单课练习', { exact: true }).click();
  await expect(page.getByRole('link', { name: /Lesson 49 肉店大冒险/ })).toBeVisible();
  await page.getByRole('link', { name: /Lesson 50 挑食小王子大冒险/ }).click();
  await expect(page).toHaveURL(/\/lesson50\/$/);
});

test('继续学习回到实际活动，组合单元不冒用单课星星且打开首页不改答题草稿', async ({ page }) => {
  const saved = JSON.stringify({version:1, groups:{}, records:{}, activity:{unitLocation:'learn/roles',unitWordPage:3}});
  await page.addInitScript(value => {
    if (!localStorage.getItem('seeded')) {
      localStorage.setItem('seeded','yes');
      localStorage.setItem('canran:unit49-50:learning:v1', value);
      localStorage.setItem('canran:l51:progress:v2', JSON.stringify({version:2,ratings:{l1:3,l2:2,l3:0,l4:0,l5:0}}));
    }
  }, saved);
  await page.goto('/');
  await expect(page.getByText('上次学到 · 故事小侦探')).toBeVisible();
  await expect(page.getByRole('link',{name:/Lesson 51 希腊四季之旅/})).toContainText('5 / 15 颗星');
  expect(await page.evaluate(()=>localStorage.getItem('canran:unit49-50:learning:v1'))).toBe(saved);
  await page.getByRole('link',{name:'继续学习',exact:true}).click();
  await expect(page).toHaveURL(/\/unit49-50\/#learn\/roles$/);
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('旧返回地址展开对应单课，错误参数和损坏草稿仍可正常开始', async ({ page }) => {
  await page.goto('/?district=first-book-49-60&focus=lesson49');
  await expect(page.getByRole('link',{name:/Lesson 49 肉店大冒险/})).toBeFocused();
  for (const raw of ['{broken',JSON.stringify({version:1,groups:{},records:{},activity:{unitLocation:'//outside.example'}})]) {
    await page.evaluate(value=>localStorage.setItem('canran:unit49-50:learning:v1',value),raw);
    await page.goto('/?district=unknown&focus=unknown');
    await expect(page.getByRole('link',{name:'开始学习',exact:true})).toHaveAttribute('href','/unit49-50/#learn/words');
    expect(await page.evaluate(()=>localStorage.getItem('canran:unit49-50:learning:v1'))).toBe(raw);
  }
});

test('回到首页与浏览器返回都能继续刚才学习的关卡', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link',{name:'开始学习',exact:true}).click();
  await page.getByRole('link',{name:'表达训练场',exact:true}).click();
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(page.getByRole('link',{name:'继续学习',exact:true})).toHaveAttribute('href','/unit49-50/#l4');
  await expect(page.getByText('上次学到 · 表达训练场')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/unit49-50\/#l4$/);
  await page.goForward();
  await expect(page.getByText('上次学到 · 表达训练场')).toBeVisible();
});

test('手机平板和桌面均可点击课程，图标完整且无横向溢出', async ({ page }) => {
  const failed=[], oldArt=[];
  page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
  page.on('request',request=>{if(request.url().includes('/adventure-map/'))oldArt.push(request.url());});
  for (const width of [320,390,768,1280]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await page.getByText('单课练习',{exact:true}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    for (const link of await page.locator('main a,main summary').all()) {
      const box=await link.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);
    }
    await expect.poll(()=>page.locator('main img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    await page.screenshot({path:`output/playwright/navigation-${width}.png`,fullPage:true});
  }
  expect(oldArt).toEqual([]);expect(failed).toEqual([]);
});

test('关闭脚本仍能选择全部课程，键盘可以展开单课', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('http://127.0.0.1:4173/');
  await page.locator('summary').focus();await page.keyboard.press('Enter');
  for (const route of ['/unit49-50/#learn/words','/lesson49/','/lesson50/','/lesson51/','/lesson52/','/lesson53/','/lesson54/','/soundmark/']) {
    await expect(page.locator(`main a[href="${route}"]`)).toBeVisible();
  }
  await context.close();
});

test('重开必须两次确认，取消保留单元记录，确认后不会恢复旧进度', async ({ page }) => {
  await page.goto('/unit49-50/#learn/fill');
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  const record=()=>page.evaluate(()=>localStorage.getItem('canran:unit49-50:learning:v1'));
  const before=await record();
  const settings=page.getByRole('button',{name:'设备冒险设置',exact:true});
  await settings.click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();
  await page.getByRole('button',{name:'继续确认',exact:true}).click();expect(await record()).toBe(before);
  await page.getByRole('button',{name:'取消重开',exact:true}).click();expect(await record()).toBe(before);
  await page.keyboard.press('Escape');await expect(settings).toBeFocused();
  await settings.click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();
  await page.getByRole('button',{name:'继续确认',exact:true}).click();await page.getByRole('button',{name:'确认重开',exact:true}).click();
  await expect(page.getByRole('link',{name:'开始学习',exact:true})).toBeVisible();
  expect(await record()).toBeNull();
  await page.getByRole('link',{name:'开始学习',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('0');
});
