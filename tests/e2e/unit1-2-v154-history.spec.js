'use strict';
const fs=require('fs/promises'),sharp=require('sharp');
const {test,expect}=require('@playwright/test');
const flow=require('../support/thirteen-types-flow'),old25=require('../fixtures/unit1-2-before-awards/flow');
const six=require('../support/unit12-six-zones-predecessor');
const {installPrevious,book}=require('../support/unit12-v154');
// Original-paper comparison uses the agreed Shanghai calendar day.
// UTC/Honolulu cross-day preservation is covered by units17-30-upgrade in login.
test.use({timezoneId:'Asia/Shanghai',browserName:process.env.UNIT12_REVIEW_BROWSER||'chromium',reducedMotion:'reduce',actionTimeout:8000});
for(const version of [25,37])test(`旧${version}题真实领取的证书原文、姓名、日期、PNG与打印保留`,async({page,browserName},info)=>{
 test.setTimeout(120000);await page.clock.setFixedTime(new Date('2026-10-07T02:31:47.000Z'));
 const restore=version===25?await installPrevious(page,'unit1-2-before-awards'):await six.install(page);
 if(version===25)await old25.complete(page,'1-2');else{
  await flow.story(page,'1-2');for(const[id,answers]of Object.entries(six.answers())){
   await page.goto('/unit1-2/#learn/'+id);const room=page.locator('.stage-'+id);
   for(let i=0;i<answers.length;i++){await flow.select(room,answers[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i<answers.length-1?'下一题':id==='exam'?'查看本次记录':'完成这一站',exact:true}).click();}
  }await page.goto('/unit1-2/#learn/certificate');
 }
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('旧证小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const old=await book(page),date=await page.locator('#certificateDate').innerText(),copy=await page.locator('.certificate-paper').innerText();
 const original=info.outputPath('before.png');let download=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await download).saveAs(original);
 await page.keyboard.press('Escape');await restore();await page.reload();
 await page.getByText('之前的学习记录与证书',{exact:true}).click();
 await expect(page.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',old.activity.unitCertificateIssuedAt);
 await page.getByRole('button',{name:'查看旧证书',exact:true}).click();
 await expect(page.locator('#legacyCertificateName')).toHaveText('旧证小禾');await expect(page.locator('#legacyCertificateDate')).toHaveText(date);
 expect(await page.locator('#legacyCertificateDialog .certificate-paper').innerText()).toBe(copy);
 const retained=info.outputPath('after.png');download=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await download).saveAs(retained);
 expect((await sharp(original).raw().toBuffer()).equals(await sharp(retained).raw().toBuffer())).toBe(true);
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印证书',exact:true}).click();await page.emulateMedia({media:'print'});
 await expect(page.locator('#topbar')).toBeHidden();await expect(page.locator('#legacyCertificateDialog .certificate-paper')).toBeVisible();
 if(browserName==='chromium'){await fs.mkdir('output/pdf',{recursive:true});const pdf=await page.pdf({path:`output/pdf/lesson1-2-legacy${version}-certificate.pdf`,format:'A4',printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);}
 await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.keyboard.press('Escape');
 await flow.activity(page,'1-2','trans');const saved=await book(page);
 expect(saved.activity.unitName).toBe(old.activity.unitName);expect(saved.activity.unitCertificateIssuedAt).toBe(old.activity.unitCertificateIssuedAt);
 expect(saved.activity.unit12HistorySnapshot.records).toEqual(old.records);
 await page.reload();await page.getByText('之前的学习记录与证书',{exact:true}).click();await page.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateDate')).toHaveText(date);
});
test('教材七句抄写独立成页，替换例句保持十组',async({page,browserName})=>{
 await page.goto('/unit1-2/#learn/manners');await page.getByText('换个物品问一问',{exact:true}).click();await expect(page.locator('.grammar-reference .reference-card')).toHaveCount(10);
 await page.goto('/unit1-2/#learn/certificate');await page.getByText('和家人再试试',{exact:true}).click();await expect(page.locator('#unitWriting')).toContainText('Copy these sentences.');
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});
 await expect(page.locator('#unitWriting .writing-lines li')).toHaveCount(7);for(const li of await page.locator('#unitWriting .writing-lines li').all())await expect(li).toBeVisible();
 for(const card of await page.locator('.story-award-paper').all())await expect(card).toBeHidden();await expect(page.locator('#topbar')).toBeHidden();
 if(browserName==='chromium'){await fs.mkdir('output/pdf',{recursive:true});const pdf=await page.pdf({path:'output/pdf/lesson1-2-writing.pdf',format:'A4',printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);}
});
