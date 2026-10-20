'use strict';
const {test,expect}=require('@playwright/test'),fs=require('fs/promises'),sharp=require('sharp');
const flow=require('../support/unit34-v154'),voiced=require('../fixtures/unit3-4-voiced-before/flow');
test.use({browserName:process.env.UNIT34_REVIEW_BROWSER||'chromium',reducedMotion:'reduce',actionTimeout:10000});
for(const version of ['classroom25','voiced27'])test(`${version}真实旧页证书原文、姓名、精确日期、PNG与打印保留`,async({page,browserName},info)=>{
 test.setTimeout(180000);await page.clock.setFixedTime(new Date('2026-10-05T01:18:37.000Z'));const restore=await flow.installPrevious(page,version==='classroom25'?'unit3-4-before-awards':'unit3-4-voiced-before');
 if(version==='classroom25')await flow.complete(page,'',true);else await voiced.completeUnit34(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小伞');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const before=await flow.book(page),copy=await page.locator('.certificate-paper').innerText(),date=await page.locator('#certificateDate').innerText();
 const original=info.outputPath('before.png');let dl=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await dl).saveAs(original);await page.keyboard.press('Escape');
 await restore();await page.reload();await flow.ready(page);await page.getByText('之前的学习记录与证书',{exact:true}).click();await expect(page.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',before.activity.unitCertificateIssuedAt);
 await page.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateName')).toHaveText('小伞');await expect(page.locator('#legacyCertificateDate')).toHaveText(date);expect(await page.locator('#legacyCertificateDialog .certificate-paper').innerText()).toBe(copy);
 const current=info.outputPath('after.png');dl=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await dl).saveAs(current);expect((await sharp(original).raw().toBuffer()).equals(await sharp(current).raw().toBuffer())).toBe(true);
 await page.evaluate(()=>window.print=()=>{});await page.getByRole('button',{name:'打印证书',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#legacyCertificateDialog .certificate-paper')).toBeVisible();await expect(page.locator('#topbar')).toBeHidden();
 if(browserName==='chromium'){await fs.mkdir('output/pdf',{recursive:true});const pdf=await page.pdf({path:`output/pdf/lesson3-4-${version}-certificate.pdf`,format:'A4',printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);}
 await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.keyboard.press('Escape');
 await flow.activity(page,'reply');await page.reload();const after=await flow.book(page);expect(after.activity.unit34HistorySnapshot.records).toEqual(before.records);expect(after.activity.unitCertificateIssuedAt).toBe(before.activity.unitCertificateIssuedAt);expect(after.activity.unitName).toBe('小伞');
});
test('Lesson4 A/B及完整原例、15问句与11回应参考、实际打印空间',async({page,browserName},info)=>{
 await page.goto('/unit3-4/#learn/reply');await page.getByText('认领表达参考',{exact:true}).click();await page.getByText('换个人或物问一问',{exact:true}).click();await expect(page.locator('.sentence-models').filter({hasText:'换个人或物问一问'}).locator('.reference-card')).toHaveCount(15);
 await page.getByText('不是我的，是你的',{exact:true}).click();await expect(page.locator('.reply-models .reference-card')).toHaveCount(10);await expect(page.locator('.grammar-reference>.phrase-grid>.reference-card').last()).toContainText("No. It isn't my umbrella. It's your umbrella.");
 await page.goto('/unit3-4/#learn/certificate');await page.getByText('和家人再试试',{exact:true}).click();await expect(page.locator('#unitWriting')).toContainText('A · Copy these sentences.');await expect(page.locator('#unitWriting')).toContainText('B · Answer these questions.');await expect(page.locator('#unitWriting')).toContainText('Example: Is this your umbrella?');
 await page.evaluate(()=>window.print=()=>{});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});
 await expect(page.locator('.writing-lines li')).toHaveCount(4);await expect(page.locator('.reply-writing li')).toHaveCount(10);for(const line of await page.locator('.writing-rule').all()){await expect(line).toBeVisible();expect((await line.boundingBox()).height).toBeGreaterThanOrEqual(30);}await expect(page.locator('#topbar')).toBeHidden();
 await page.locator('#unitWriting').screenshot({path:info.outputPath('writing.png')});
 if(browserName==='chromium'){await fs.mkdir('output/pdf',{recursive:true});const pdf=await page.pdf({path:'output/pdf/lesson3-4-writing.pdf',format:'A4',printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(2);}
});
