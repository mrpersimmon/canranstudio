const {incorrectFeedback}=require('../support/course-controls');
'use strict';const{test,expect}=require('@playwright/test');const{ANSWERS,select,story}=require('../support/unit3940-fivezones');
test.use({actionTimeout:7000,reducedMotion:'reduce',...(process.env.UNIT3940_BROWSER==='webkit'?{browserName:'webkit'}:{})});
async function reach(page,id,index){await page.goto('/unit39-40/#learn/'+id);const room=page.locator('.stage-'+id);for(let i=0;i<index;i++){await select(room,ANSWERS[id][i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}return room;}
test('花瓶与Sam须同时正确，草稿错答刷新不交接，订正后仅原物品到手',async({page},info)=>{
 await story(page);const room=await reach(page,'roles',1),check=room.getByRole('button',{name:'检查答案',exact:true});await room.getByRole('button',{name:'花瓶',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(room.locator('.handoff-arrived')).toHaveCount(0);await expect(room.getByRole('button',{name:'花瓶',exact:true})).toHaveAttribute('aria-pressed','true');await room.getByRole('button',{name:'Penny',exact:true}).click();await room.screenshot({path:info.outputPath('handoff-before.png')});await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(room.locator('.handoff-arrived')).toHaveCount(0);await room.screenshot({path:info.outputPath('handoff-wrong.png')});await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'Sam',exact:true}).press('Enter');await check.press('Enter');await expect(room.locator('.fb')).toHaveText('答对了！');await expect(room.locator('.handoff-arrived')).toHaveCount(1);await expect(room.getByRole('button',{name:'Sam',exact:true}).locator('.handoff-arrived')).toBeVisible();await expect(room.locator('.handoff-parcel')).toHaveCount(2);expect(await room.locator('.handoff-cast img').evaluateAll(es=>es.every(e=>e.src.includes('cast-')&&e.naturalWidth>0))).toBe(true);await room.screenshot({path:info.outputPath('handoff-correct.png')});
});
test('定位完整窗前短语与选择最终落点，各自依据可见材料，键盘可订正',async({page},info)=>{
 await story(page);let room=await reach(page,'roles',2),text=room.getByRole('group',{name:'原文选词',exact:true});await text.getByRole('button',{name:'here',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();await text.getByRole('button',{name:'in front of the window',exact:true}).press('Enter');await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.locator('.fb')).toHaveText('答对了！');
 room=await reach(page,'exam',1);await expect(room).toContainText('Put it here, on this shelf.');await select(room,'桌子上');await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();await select(room,'架子上');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.screenshot({path:info.outputPath('placement-correct.png')});
});
test('词块草稿可撤回和恢复；短示范计帮助，独立综合不展示示范',async({page})=>{
 const room=await reach(page,'apply',4);await select(room,['Give','to']);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await room.getByRole('button',{name:'撤回 to',exact:true}).click();await select(room,['it','to','me.']);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');const g=await reach(page,'grammar',0);await expect(g.locator('.grammar-model')).toBeVisible();await select(g,ANSWERS.grammar[0]);await g.getByRole('button',{name:'检查答案',exact:true}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit39-40:learning:v1')).groups['unit3940-grammar-practice/five-zones-v1'].states[0].revealed)).toBe(true);await page.goto('/unit39-40/#learn/exam');await expect(page.locator('.stage-exam .grammar-model')).toHaveCount(0);
});
const {devices}=require('../support/required-phone-devices');
const handoffScreens=[{label:'320',viewport:{width:320,height:800}},...devices.map(device=>({label:device.id,viewport:device.viewport}))];
for(const {label,viewport} of handoffScreens)test(label+'手机交接花瓶保持直立，完整人物和落点可见',async({page},info)=>{
 await page.setViewportSize(viewport);await story(page);const room=await reach(page,'roles',1);
 await room.screenshot({path:info.outputPath('handoff-before.png')});await select(room,ANSWERS.roles[1]);await room.getByRole('button',{name:'检查答案',exact:true}).click();
 const recipient=room.getByRole('button',{name:'Sam',exact:true});await expect(recipient.locator('.handoff-arrived')).toBeVisible();
 const geometry=await recipient.evaluate(button=>{
  const person=button.querySelector('.handoff-cast img'),parcel=button.querySelector('.handoff-arrived');
  const actor=person.getBoundingClientRect(),frame=person.parentElement.getBoundingClientRect(),vase=parcel.getBoundingClientRect();
  return {fit:getComputedStyle(person).objectFit,rotate:getComputedStyle(parcel).rotate,actorHeight:actor.height,
   fullPortrait:actor.top>=frame.top-1&&actor.bottom<=frame.bottom+1&&actor.left>=frame.left-1&&actor.right<=frame.right+1,
   feetAndHead:Math.abs(actor.width/actor.height-person.naturalWidth/person.naturalHeight)<.02,
   handX:(vase.x+vase.width/2-actor.x)/actor.width,handY:(vase.bottom-actor.y)/actor.height};
 });
 expect(geometry.fullPortrait,'全身图应完整落在可见人物栏内').toBe(true);expect(geometry.feetAndHead).toBe(true);
 expect(geometry.actorHeight).toBeGreaterThanOrEqual(68);expect(geometry.fit).toBe('contain');expect(geometry.rotate).toBe('none');
 // The vase rests between Sam's two open palms in the original portrait.
 expect(geometry.handX).toBeGreaterThan(.56);expect(geometry.handX).toBeLessThan(.78);
 expect(geometry.handY).toBeGreaterThan(.48);expect(geometry.handY).toBeLessThan(.60);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await room.screenshot({path:info.outputPath('handoff-correct.png')});
});
