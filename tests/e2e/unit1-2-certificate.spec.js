'use strict';
const {test,expect}=require('@playwright/test');
const {completeUnit12}=require('../support/unit1-2-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});
let earnedSession;
test.beforeAll(async({browser})=>{
  test.setTimeout(90000);const context=await browser.newContext({baseURL:'http://127.0.0.1:4173',reducedMotion:'reduce'});
  const page=await context.newPage();await completeUnit12(page);earnedSession=await context.storageState();await context.close();
});
test.beforeEach(async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(state=>{
    if(localStorage.getItem('canran:unit1-2:learning:v1'))return;
    for(const origin of state.origins)if(origin.origin===location.origin)for(const entry of origin.localStorage)localStorage.setItem(entry.name,entry.value);
  },earnedSession);
});
async function claim(page,name=''){
  await page.goto('/unit1-2/#learn/certificate');await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();return page.getByRole('dialog',{name:'礼貌小帮手纪念',exact:true});
}
for(const width of [320,390,768,1280])test(`${width} 像素领奖、长名字、人物、首次日期与真实图片下载`,async({page})=>{
  await page.setViewportSize({width,height:740});const dialog=await claim(page,'热爱探险和英语学习的小朋友李明小明');
  expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  await expect(dialog.locator('.certificate-paper')).toHaveCSS('animation-name','none');
  const date=await dialog.locator('#certificateDate').textContent();
  for(const name of ['男士','女士'])await expect(dialog.getByRole('img',{name,exact:true})).toBeVisible();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);
  await dialog.screenshot({path:`output/playwright/unit1-2-certificate-${width}.png`});
  const download=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await download;
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
  await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(date);
});
test('图片失败有重试、空名字有称呼，证书与七句练习纸分别为单页打印',async({page})=>{
  await page.route('**/unit1-2/man.svg',route=>route.abort());const dialog=await claim(page);
  await expect(dialog.locator('#certificateName')).toHaveText('礼貌小帮手');
  await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('请重试');
  await page.unroute('**/unit1-2/man.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const download=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await download;
  const pdf=await page.pdf({path:'output/playwright/unit1-2-certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.keyboard.press('Escape');await page.getByText('和家人再试试',{exact:true}).click();
  await expect(page.locator('.writing-lines li')).toHaveText(['Excuse me!','Yes?','Is this your handbag?','Pardon?','Is this your handbag?','Yes, it is.','Thank you very much.']);
  await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print',reducedMotion:'reduce'});
  await expect(page.locator('.writing-lines li')).toHaveCount(7);
  for(const line of await page.locator('.writing-lines li').all())await expect(line).toBeVisible();
  await expect(page.locator('#topbar')).toBeHidden();
  const sheet=await page.pdf({path:'output/playwright/unit1-2-writing.pdf',preferCSSPageSize:true,printBackground:true});
  expect(sheet.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('内容升版撤回旧完成凭据，旧证书不能冒充新题已经答完',async({page})=>{
  await page.route('**/unit1-2/content.js*',async route=>{
    const response=await route.fetch();const body=(await response.text()).replace("id: 'unit1-2', version: 1,","id: 'unit1-2', version: 2,");
    await route.fulfill({response,body});
  });
  await page.goto('/unit1-2/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await page.goto('/unit1-2/#learn/listen');const room=page.locator('.stage-listen');
  await expect(room).toContainText('第 1 / 11 题');await expect(room.getByRole('button',{pressed:true})).toHaveCount(0);
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
