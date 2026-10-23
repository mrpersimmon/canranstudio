'use strict';
const {test,expect}=require('@playwright/test');
const {legacy}=require('../support/unit2324-legacy');
const {completeUnit2324}=require('../support/unit23-24-flow');
const {activity,select,ANSWERS}=require('../support/unit2324-fivezones');
// Original-paper comparison uses the agreed Shanghai calendar day.
// UTC/Honolulu cross-day preservation is covered by units17-30-upgrade in login.
test.use({timezoneId:'Asia/Shanghai',actionTimeout:7000,...(process.env.UNIT2324_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const selected of [false,true])test(`旧${selected?'仅选择':'空白'}升级：不伪造作答，完整新轮可获星`,async({page})=>{
 test.setTimeout(90000);const upgrade=await legacy(page);await page.goto('/unit23-24/#learn/listen');const room=page.locator('.stage-listen');
 if(selected)await room.getByRole('button',{name:'在……上面',exact:true}).click();
 await page.reload();await upgrade();await page.reload();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 13 题');await expect(page.locator('#starCount')).toHaveText('0');
 if(selected){await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 else await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await activity(page,'listen');await expect(page.locator('#starCount')).toHaveText('1');
});
test('旧版中途错答、词卡和阅读位置保留；新语法不由旧题代答',async({page})=>{
 const upgrade=await legacy(page);await page.goto('/unit23-24/#learn/listen');const room=page.locator('.stage-listen');
 await room.getByRole('button',{name:'在……里面',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await page.goto('/unit23-24/#learn/words');await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await page.goto('/unit23-24/#learn/models');await page.getByText('看看十幅位置图',{exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一页图册',exact:true}).click();await page.getByText('看看完整问答',{exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一页问答',exact:true}).click();
 await page.goto('/unit23-24/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<4;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit23-24:learning:v1')));
 await upgrade();await page.reload();await expect(page.locator('.btext span')).toHaveCount(5);await page.goto('/unit23-24/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('2 / 5');
 await page.goto('/unit23-24/#learn/listen');await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
 const archived=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit23-24:learning:v1')).activity.unit2324LegacySnapshot);
 expect(archived.records).toEqual(before.records);expect(archived.groups).toEqual(before.groups);expect(archived.activity.unitDialogue).toEqual(before.activity.unitDialogue);
  await page.goto('/unit23-24/#learn/models');await page.getByText('课本小参考 · 第24课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('3 / 10');await expect(page.locator('.gallery-current small')).toHaveText(['1,319']);await expect(page.locator('.model-current + .reference-pager span')).toHaveText('4 / 10');await expect(page.locator('.model-current')).toContainText('The ones on the cupboard.');
 await page.goto('/unit23-24/#learn/grammar');await expect(page.locator('.stage-grammar .progress-copy')).toHaveText('第 1 / 9 题');await expect(page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
test('旧15星证书保留姓名、原始日期及实际PNG；新版错答与首星不改旧证',async({page},info)=>{
 test.setTimeout(180000);const upgrade=await legacy(page);await completeUnit2324(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();const beforeDownload=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();const originalFile=info.outputPath('original-certificate.png');await(await beforeDownload).saveAs(originalFile);const originalMeta=await require('sharp')(originalFile).metadata();const originalCorner=await require('sharp')(originalFile).extract({left:0,top:0,width:1,height:1}).removeAlpha().raw().toBuffer();await page.keyboard.press('Escape');
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit23-24:learning:v1')));
 await upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('0');const history=page.locator('.legacy-learning');await history.locator('summary').first().click();await expect(history).toContainText('15 / 15');await expect(history.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',before.activity.unitClassroomCertificateIssuedAt);
 await history.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateName')).toHaveText('小禾');await expect(page.locator('#legacyCertificateDate')).toHaveText(date);await page.locator('#legacyCertificateDialog').screenshot({path:info.outputPath('retained-old-certificate.png')});
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();const file=info.outputPath('retained-old-certificate.png');await(await download).saveAs(file);const meta=await require('sharp')(file).metadata();expect(meta.width).toBe(originalMeta.width);expect(meta.height).toBe(originalMeta.height);expect(meta.width).toBe(1440);expect(meta.height).toBe(1100);const savedCorner=await require('sharp')(file).extract({left:0,top:0,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...savedCorner]).toEqual([...originalCorner]);await page.keyboard.press('Escape');
 await page.goto('/unit23-24/#learn/grammar');const room=page.locator('.stage-grammar');await expect(room.locator('.progress-copy')).toHaveText('第 1 / 9 题');await select(room,'in');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(page.locator('#starCount')).toHaveText('0');
 await page.goto('/unit23-24/#learn/listen');await expect(page.locator('.stage-listen .completion-number')).toHaveText(['—','—','—']);await page.locator('.stage-listen').getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'listen');await expect(page.locator('#starCount')).toHaveText('1');
 await page.goto('/unit23-24/#learn/certificate');await history.locator('summary').first().click();await history.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateDate')).toHaveText(date);await expect(page.locator('#legacyCertificateName')).toHaveText('小禾');
});
