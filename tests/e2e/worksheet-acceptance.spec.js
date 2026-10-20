'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const units=[...Array.from({length:22},(_,i)=>47+i*2),91,93,97,101,103,105,107];
const multiLine={51:{1:6},53:{0:2,1:4},67:{1:2},69:{1:2},71:{1:2},79:{1:3},83:{1:2},85:{1:2},87:{0:2,1:4},89:{0:2,1:2},93:{1:2},97:{1:2},103:{1:2},105:{1:2,2:2},107:{1:2,2:2}};
test.use({browserName:process.env.PAPER_REVIEW_BROWSER||'chromium'});
for(const start of units)test(`Lesson ${start}-${start+1} 练习纸原题可打印且按实际产出留空间`,async({page,browserName},info)=>{
 test.setTimeout(60000);const unit='unit'+start+'-'+(start+1),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/'+unit+'/#learn/certificate');const writing=page.locator('#unitWriting');await expect(writing).toBeVisible();
 await writing.locator('summary').click();const before=await writing.innerText(),items=await writing.locator('li').allTextContents();
 await page.evaluate(()=>{window.print=()=>{window.paperPrintInvoked=true;};});await writing.getByRole('button',{name:'打印练习纸',exact:true}).click();
 expect(await page.evaluate(()=>window.paperPrintInvoked)).toBe(true);await expect(page.locator('body')).toHaveClass(/print-writing/);
 await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
 // Chromium's real PDF export emits afterprint and legitimately restores the
 // screen class. Capture print geometry before export, not after that cleanup.
 const layout=await writing.evaluate(e=>({visible:getComputedStyle(e).visibility,items:[...e.querySelectorAll('li')].map(li=>({text:li.textContent,visible:getComputedStyle(li).visibility,display:getComputedStyle(li).display,marker:getComputedStyle(li).listStyleType,rect:{width:li.getBoundingClientRect().width,height:li.getBoundingClientRect().height}})),sections:[...e.querySelectorAll('ol')].map(list=>[...list.querySelectorAll('li')].map(li=>[...li.querySelectorAll('.writing-line')].map(line=>line.getBoundingClientRect().height)))}));
 if(browserName==='chromium')await page.pdf({path:info.outputPath('worksheet.pdf'),format:'A4',printBackground:true});
 await fs.writeFile(info.outputPath('paper-content.json'),JSON.stringify({unit,before,items,layout},null,2));
 expect(layout.visible,'Printed content must be visible, not merely occupy blank pages').toBe('visible');expect(layout.items.length).toBe(items.length);expect(layout.items.length).toBeGreaterThan(0);expect(layout.items.every(i=>i.visible==='visible')).toBe(true);
 if(start===91)expect(layout.items.every(i=>i.marker==='decimal'&&i.display==='list-item'),'Keep original A/B item numbers in print').toBe(true);
 for(const[section,count]of Object.entries(multiLine[start]||{}))for(const lines of layout.sections[section]){expect(lines.length,'Space follows the original number of complete sentences').toBeGreaterThanOrEqual(count);expect(lines.every(height=>height>=31)).toBe(true);}
 await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await expect(page.locator('body')).not.toHaveClass(/print-writing/);await expect(writing.getByRole('button',{name:'打印练习纸',exact:true})).toBeVisible();expect(errors).toEqual([]);
});
