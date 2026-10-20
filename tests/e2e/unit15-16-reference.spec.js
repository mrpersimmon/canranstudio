'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT1516_BROWSER==='webkit'?{browserName:'webkit'}:{});
test('320px语法参考保留完整词形与be表，音标独立字体，展开不横向溢出',async({page},info)=>{
 await page.setViewportSize({width:320,height:700});await page.goto('/unit15-16/#learn/grammar');const ref=page.locator('.stage-grammar .offline-task');await ref.locator('summary').click();
 await expect(ref.locator('.plural-reference article')).toHaveCount(7);await expect(ref.locator('.be-reference article')).toHaveCount(8);
 for(const text of ['handkerchiefs','handkerchieves','zeros / zeroes','the Henrys','roof → roofs','They aren’t'])await expect(ref).toContainText(text==='They aren’t'?"They aren't":text);
 const fonts=await ref.evaluate(root=>{const terms=['/bʊks/','/frendz/','/ˈkeɪsɪz/','/ˈdresɪz/','/s/','/z/','/ɪz/','拼写与读音分别看'],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);return terms.map(term=>({term,font:getComputedStyle(nodes.find(n=>n.textContent.includes(term)).parentElement).fontFamily}));});
 for(const item of fonts)expect(item.font).toContain(item.term.startsWith('/')?'Arial':'Lesson Gothic');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await ref.getByText(/拼写与读音分别看/).scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('reference-fonts-320.png')});
});
