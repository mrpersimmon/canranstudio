'use strict';
const {test,expect}=require('@playwright/test');
const {completeUnit12}=require('../support/unit1-2-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});
let earnedSession;
test.beforeAll(async({browser,baseURL})=>{
  test.setTimeout(90000);const context=await browser.newContext({baseURL,reducedMotion:'reduce'});
  const page=await context.newPage();await completeUnit12(page);earnedSession=await context.storageState();await context.close();
});
test.beforeEach(async({page})=>{
  // Reuse only a session earned by the real page flow above.
  await page.addInitScript(state=>{
    if(localStorage.getItem('canran:unit1-2:learning:v1'))return;
    for(const origin of state.origins)if(origin.origin===location.origin)for(const entry of origin.localStorage)localStorage.setItem(entry.name,entry.value);
  },earnedSession);
});
for(const width of [320,390,768,1280])test(`${width} 像素纪念卡居中适度展示，匿名预览不填名也不导出`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/unit1-2/#learn/certificate');
  const card=page.getByRole('article',{name:'我的单元纪念卡'});
  await expect(page.getByLabel('纪念卡上的名字')).toHaveCount(0);
  await expect(card.locator('#certificateName')).toHaveText('登录后显示姓名');
  await expect(card).toHaveAttribute('data-stars','5');
  await expect(card.getByRole('group',{name:'已获得 5 / 5 颗星'})).toBeVisible();
  await expect(card.locator('time')).toBeVisible();
  const firstDate=await card.locator('time').textContent();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  const bounds=await card.boundingBox();
  expect(bounds.width).toBeLessThanOrEqual(width<=540?340:720);
  expect(Math.abs(bounds.x+bounds.width/2-width/2)).toBeLessThan(2);
  await expect(page.getByRole('button',{name:'保存纪念卡',exact:true})).toBeDisabled();
  await expect.poll(()=>card.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`output/playwright/award-unit1-2-anonymous-${width}.png`});
  await page.clock.setFixedTime(new Date(Date.now()+3*86400000));
  await page.reload();await expect(card.locator('time')).toHaveText(firstDate);
  await expect(card.locator('#certificateName')).toHaveText('登录后显示姓名');
});
test('练习纸仍独立打印，不包含纪念卡姓名输入',async({page})=>{
  await page.goto('/unit1-2/#learn/certificate');
  await page.getByText('和家人再试试',{exact:true}).click();
  await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print'});
  await expect(page.locator('.writing-lines li')).toHaveCount(7);
  for(const line of await page.locator('.writing-lines li').all())await expect(line).toBeVisible();
  await expect(page.locator('#topbar')).toBeHidden();
  const sheet=await page.pdf({path:'output/playwright/unit1-2-writing.pdf',preferCSSPageSize:true,printBackground:true});
  expect(sheet.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});
test('新版纪念卡独立计星，切回原版仍保留已获五星和日期',async({page})=>{
  await page.goto('/unit1-2/#learn/certificate');const firstDate=await page.locator('#certificateDate').textContent();
  let newEdition=true;
  await page.route('**/unit1-2/content.js*',async route=>{
    const response=await route.fetch();const body=(await response.text()).replace("edition: 'story-card-v1'",newEdition?"edition: 'story-card-v2'":"edition: 'story-card-v1'");
    await route.fulfill({response,body});
  });
  await page.reload();await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#certificateDate')).toBeHidden();
  newEdition=false;await page.reload();await expect(page.locator('#starCount')).toHaveText('5');
  await expect(page.locator('#certificateDate')).toHaveText(firstDate);
});
