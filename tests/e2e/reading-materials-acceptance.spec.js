'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises'),fixture=require('../support/reading-materials-acceptance.json');
const {withReadingMaterial}=require('../support/course-controls');
const {viewports}=require('../support/required-phone-devices');
test.use({browserName:process.env.MATERIAL_REVIEW_BROWSER||'chromium',reducedMotion:'reduce',actionTimeout:8000});
async function story(page){const room=page.locator('.stage-text');await expect(room).toBeVisible();for(let n=0;n<60;n++){const next=room.getByRole('button',{name:/^(开始看课文|开始故事|下一句|下一段|完成课文|读完了|去练习)$/,exact:true});if(!await next.count()||!await next.first().isVisible())return;const label=await next.first().innerText();await next.first().click();if(/完成课文|读完了|去练习/.test(label))return;}throw Error('Story did not complete');}
async function select(room,a){if(typeof a==='string')await room.getByRole('button',{name:a,exact:true}).click();else if(a.locate)await room.locator('.locate-sentence').getByRole('button',{name:a.locate,exact:true}).click();else if(Array.isArray(a)){for(const label of a)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:label,exact:true}).click();}else if(a.fills||a.cloze){for(const[j,label]of(a.fills||a.cloze).entries())await room.getByRole('group',{name:'第'+(j+1)+'处填空',exact:true}).getByRole('button',{name:label,exact:true}).click();}else if(a.pairs){for(const[en,cn]of a.pairs){await room.getByRole('group',{name:a.leftLabel||'英文',exact:true}).getByRole('button',{name:en,exact:true}).click();await room.getByRole('group',{name:a.rightLabel||'词义',exact:true}).getByRole('button',{name:cn,exact:true}).click();}}else if(a.scene)await room.getByRole('group',{name:'在场景中选择',exact:true}).getByRole('button',{name:a.scene,exact:true}).click();else throw Error('Unsupported independent manuscript answer');}
async function readOriginal(room,target,screenshot){
 return withReadingMaterial(room,'.practice-context',async surface=>{
  const passage=surface.getByRole('region',{name:'题目材料',exact:true});
  await expect(passage).toBeVisible();
  for(const line of target.lines)await expect(passage).toContainText(line.text);
  expect(await passage.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  if(screenshot)await surface.screenshot({path:screenshot});
  return passage.innerText();
 });
}
for(const course of fixture.courses)test(`Lesson ${course.id.slice(4)} 答前原文、未选状态与刷新续做`,async({page},info)=>{
 test.setTimeout(180000);const errors=[],seen=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:390,height:844});await page.goto('/'+course.id+'/#learn/text');await story(page);
 for(const[zone,data]of Object.entries(course.zones)){if(!data.answers.length)continue;await page.goto('/'+course.id+'/#learn/'+zone);const room=page.locator('.stage-'+zone);await expect(room).toBeVisible();
  for(let i=0;i<data.answers.length;i++){
   const target=data.targets.find(t=>t.index===i+1);if(target){
    const check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled();
    const text=await readOriginal(room,target);
    if(target===data.targets[0]){
     for(const [width,height] of [[320,568],[390,844],...viewports(),[768,844],[1280,844]]){
      await page.setViewportSize({width,height});
      await readOriginal(room,target,width===320||width===1280?info.outputPath(zone+'-material-'+width+'.png'):undefined);
     }
     await page.setViewportSize({width:320,height:568});await page.reload();
     expect(await readOriginal(room,target)).toBe(text);
     await expect(check).toBeDisabled();
    }
    seen.push({zone,index:i+1,questionId:target.questionId,text});
   }
   await select(room,data.answers[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room).toContainText('答对了');if(i<data.answers.length-1)await room.getByRole('button',{name:'下一题',exact:true}).click();
  }
 }
 await fs.writeFile(info.outputPath('visible-materials.json'),JSON.stringify({id:course.id,source:course.manuscriptSource,questions:seen},null,2));expect(errors).toEqual([]);
});
