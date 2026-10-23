'use strict';
const {test,expect}=require('@playwright/test');
const {legacy}=require('../support/unit3738-legacy');
const {complete}=require('../support/unit37-38-flow');
// Original-paper comparison uses the agreed Shanghai calendar day.
// UTC/Honolulu cross-day preservation is covered by units17-30-upgrade in login.
test.use({timezoneId:'Asia/Shanghai'});
test('练习纸保留A四题、B五组四句问答、完整原例和24条书写线，实际PDF无隐藏题目',async({page},info)=>{
 await page.goto('/unit37-38/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await expect(page.locator('body')).toHaveClass(/print-writing/);await page.emulateMedia({media:'print'});
 await expect(page.locator('.writing-a li')).toHaveCount(4);await expect(page.locator('.writing-b li')).toHaveCount(5);await expect(page.locator('.writing-rule')).toHaveCount(24);

 expect(await page.locator('.writing-rule').evaluateAll(es=>es.every(e=>getComputedStyle(e).visibility==='visible'&&e.getBoundingClientRect().height>=32))).toBe(true);
 await page.pdf({path:info.outputPath('worksheet.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'14mm',right:'14mm'}});
});
test('已领旧证书升级后仍能打印原姓名和日期，打印不变成新版空卡',async({page},info)=>{
 test.setTimeout(120000);const upgrade=await legacy(page);await complete(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const original=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');await upgrade();await page.reload();await page.locator('.legacy-learning>summary').click();await page.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateDate')).toHaveText(original);
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印证书',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#legacyCertificateName')).toBeVisible();await expect(page.locator('#legacyCertificateName')).toHaveText('小禾');expect(await page.locator('#legacyCertificateName').evaluate(e=>getComputedStyle(e).fontSize)).toBe('42px');await expect(page.locator('.story-award-panel')).toBeHidden();
 await page.pdf({path:info.outputPath('legacy-certificate.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'14mm',right:'14mm'}});
});
