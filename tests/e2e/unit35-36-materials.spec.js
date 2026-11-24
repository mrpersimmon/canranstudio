'use strict';
const {inspectQuestionDiagrams}=require('../support/question-diagrams');
const{test,expect}=require('@playwright/test');const{ANSWERS,select}=require('../support/unit3536-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT3536_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const width of [320,1280])test('位置、横穿箭头和桥上下在未答图中清晰保留 '+width,async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:800});
 for(const id of ['grammar','exam']){await page.goto('/unit35-36/#learn/'+id);const room=page.locator('.stage-'+id);for(let i=0;i<ANSWERS[id].length;i++){
  await inspectQuestionDiagrams(room,180,info.outputPath(id+'-'+(i+1)+'-'+width+'-material.png'));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await select(room,ANSWERS[id][i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');if(i<ANSWERS[id].length-1)await room.getByRole('button',{name:'下一题',exact:true}).click();
 }}
});
