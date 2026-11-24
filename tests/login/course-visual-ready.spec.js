'use strict';
const {test,expect}=require('@playwright/test'),{adminLogin,studentLogin,createStudent}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices'),{courseReadyForAssertions}=require('../support/completion-layout');
const {inspectWholeBookScene}=require('../support/whole-book-scene-audit'),{definition}=require('../../server/progress');
const {choose}=require('../support/answer-question');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const worlds=['street-world-v1','cloakroom-interior-v1','classroom-world-v1','interview-world-v1','greeting-world-v1','claim-world-v1','dressing-world-v1','customs-world-v1','office-world-v1','park-world-v1','reading-world-v1','shelf-world-v1'];
const book=require('../../server/catalog').UNITS,allEntries=process.env.COURSE_VISUAL_SCOPE==='all';
// Keep the normal release check focused. A requested book-wide audit uses
// separate test students per group, so a whole book never shares one cache.
const groups=allEntries?Array.from({length:Math.ceil(book.length/12)},(_,i)=>book.slice(i*12,i*12+12)):[[...book.slice(0,12),'unit49-50','unit57-58']];
async function enterThroughWords(p,unit,id){
 const surface=p.locator('.learning-surface.stage-words'),card=surface.locator('.unit-word').first();
 await expect(card,id).toBeVisible();await card.tap();await expect(card.locator('.word-meaning'),id).toBeVisible();await card.tap();
 const counter=(await surface.locator('#wordPageProgress').innerText()).match(/^1\s*\/\s*(\d+)$/);
 expect(counter,id+' starts at the first word group').not.toBeNull();
 for(let i=0;i<Number(counter[1]);i++)await surface.locator('.word-controls button').last().tap();
 const room=p.locator('.learning-surface.stage-listen');await expect(room,id).toBeVisible();
 await choose(room,unit.questions.listen[0]);const check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(check,id).toBeInViewport({ratio:1});await check.tap();await expect(room.locator('.fb'),id).toHaveText('答对了！');
 await p.getByRole('link',{name:'故事',exact:true}).tap();
}
test.describe.configure({mode:'parallel'});
for(const device of devices)for(const units of groups)test(device.name+' renders each relocated theatre and the borrowed lesson artwork'+(allEntries?' '+units[0]+' through '+units.at(-1):''),async({page,browser},info)=>{
 test.setTimeout(300000);
 await adminLogin(page,base);
 const account=await createStudent(page,'课包实景 '+device.id+' '+units[0],'画面同学',units.map(id=>new RegExp('^Lesson '+id.slice(4).replace('-','–')+' ')));
 const {page:p,context}=await studentLogin(browser,account,base,contextOptions(device));
 try{
  for(const id of units)await test.step(id,async()=>{
   const i=book.indexOf(id),unit=definition(process.cwd(),id,base);
   await p.goto(base+id+'/#learn/'+(allEntries?'words':'text'));await courseReadyForAssertions(p);
   if(allEntries)await enterThroughWords(p,unit,id);
   const surface=p.locator('.learning-surface.stage-text');await expect(surface).toBeVisible();
   const button=surface.locator('.stage-ctrl>.btn-green');await button.click();
   const row=surface.locator('.dialogue-log .bubble-row').first(),line=unit.learning.DIALOGUE[0];
   await expect(row.locator('.btext')).toHaveText(line.text);await row.getByRole('button',{name:'看中文',exact:true}).click();await expect(row.locator('.bcn')).toBeVisible();
   await row.getByRole('button',{name:'收起中文',exact:true}).click();
   const layout=await surface.evaluate(el=>({world:getComputedStyle(document.body).getPropertyValue('--sample-world'),width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth-innerWidth,
    missing:[...el.querySelectorAll('img')].filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).length}));
   expect([layout.width,layout.height],id).toEqual([device.viewport.width,device.viewport.height]);expect(layout.overflow,id).toBeLessThanOrEqual(1);expect(layout.missing,id).toBe(0);
   if(i<worlds.length)expect(layout.world,id).toContain(worlds[i]+'.webp');
   expect(await surface.evaluate(inspectWholeBookScene),id).toEqual([]);await expect(button).toBeInViewport({ratio:1});
   if(id==='unit1-2'){
    await p.getByRole('button',{name:'更多学习操作',exact:true}).click();const menu=p.getByRole('dialog',{name:'学习操作',exact:true});await expect(menu).toBeInViewport();
    await menu.getByRole('button',{name:'关闭',exact:true}).click();await expect(menu).toBeHidden();
   }
   if(id==='unit49-50'){
    const fruit=await p.evaluate(async()=>{const urls=[...new Set(CanranCore.learningContext.learning.MODELS.map(m=>m.image).filter(u=>u.includes('/unit47-48/')))];
     return Promise.all(urls.map(async src=>{const image=new Image();image.src=src;await image.decode();return [src.split('/').pop(),image.naturalWidth];}));});
    expect(fruit.map(x=>x[0]).sort()).toEqual(['apple.svg','banana.svg','orange.svg']);expect(fruit.every(x=>x[1]>0)).toBe(true);
   }
   if(allEntries)info.annotations.push({type:'entry-verified',description:id+' '+device.viewport.width+'x'+device.viewport.height});
  });
 }finally{await context.close();}
});
