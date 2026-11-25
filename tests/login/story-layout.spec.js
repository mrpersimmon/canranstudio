'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const scenarios=[{id:'desktop-tall',name:'桌面1435×1244',options:{viewport:{width:1435,height:1244}}},...devices.map(device=>({id:device.id,name:device.name,options:contextOptions(device)}))];
test.use({actionTimeout:8000});
async function geometry(page){return page.locator('#unit12-dialogue').evaluate(scene=>{
 const box=scene.getBoundingClientRect(),log=scene.querySelector('.dialogue-log'),count=scene.closest('.stage-text').querySelector('.dialogue-status').getBoundingClientRect();
 return {width:innerWidth,height:innerHeight,scene:box.toJSON(),count:count.toJSON(),log:log.getBoundingClientRect().toJSON(),logOverflow:log.scrollWidth-log.clientWidth,stageOverflow:scene.closest('.stage-text').scrollWidth-scene.closest('.stage-text').clientWidth,actors:[...scene.querySelectorAll('.dialogue-actor>img:not(.dialogue-handbag)')].map(image=>image.getBoundingClientRect().toJSON())};
});}
async function proportion(page){
 const log=page.getByRole('log',{name:'课文对话',exact:true});
 await expect(log).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(log).toHaveCSS('background-image','none');
 for(const bubble of await log.locator('.bubble').all())await expect(bubble).not.toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 const g=await geometry(page),wide=g.width>=700;expect(g.scene.height).toBeLessThanOrEqual(wide?560:640);
 expect(g.count.top-g.scene.bottom).toBeGreaterThanOrEqual(0);expect(g.count.top-g.scene.bottom).toBeLessThanOrEqual(10);
 expect(g.logOverflow).toBeLessThanOrEqual(1);expect(g.stageOverflow).toBeLessThanOrEqual(1);
 for(const actor of g.actors){expect(actor.top).toBeGreaterThanOrEqual(g.scene.top);expect(actor.bottom).toBeLessThanOrEqual(g.scene.bottom);expect(actor.left).toBeGreaterThanOrEqual(g.scene.left);expect(actor.right).toBeLessThanOrEqual(g.scene.right);if(wide)expect(actor.height/g.scene.height).toBeGreaterThanOrEqual(.33);}
 return g;
}
for(const scenario of scenarios)test(`${scenario.name}：课文舞台比例、末句与返回保持完整`,async({page,browser},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'课文比例-'+scenario.id,'小禾',[/Lesson 1–2 /]),student=await studentLogin(browser,account,base,scenario.options),p=student.page;
 try{
  await p.goto(base+'unit1-2/#l1');await courseReadyForAssertions(p);const story=p.locator('.stage-text');await expect(story).toHaveClass(/learning-surface/);
  await p.screenshot({path:info.outputPath('initial.png'),scale:'css'});await proportion(p);
  await story.getByRole('button',{name:'开始故事',exact:true}).click();
  for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  const last=story.locator('.bubble-row').last();await expect(last).toBeInViewport({ratio:1});await last.getByRole('button',{name:'看中文',exact:true}).click();await expect(last.locator('.bcn')).toBeInViewport({ratio:1});
  await story.getByRole('button',{name:'去练习',exact:true}).click();await expect(p).toHaveURL(/#learn\/roles$/);await p.goBack();await expect(story.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeInViewport({ratio:1});await proportion(p);
  await p.screenshot({path:info.outputPath('completed.png'),scale:'css'});
  const read=()=>p.evaluate(()=>{const value=JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1'));return {dialogue:value.activity.unitDialogue,groups:value.groups,records:value.records};});
  const saved=await read();await story.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();await p.goBack();await expect(last).toBeInViewport({ratio:1});expect(await read()).toEqual(saved);
  await p.reload();await courseReadyForAssertions(p);await expect(story.locator('.bubble-row')).toHaveCount(7);await proportion(p);expect(await read()).toEqual(saved);
  if(scenario.id==='chrome-iphone-se'){
   const log=story.getByRole('log',{name:'课文对话',exact:true});await log.evaluate(el=>{el.scrollTop=0;});await expect(story.locator('.bubble-row').first()).toBeInViewport({ratio:1});
   await story.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();await p.goBack();await expect(story.locator('.bubble-row').first()).toBeInViewport({ratio:1});expect(await read()).toEqual(saved);
  }
  if(scenario.id==='desktop-tall'){
   for(const [width,height]of [[1366,768],[768,1024],[700,900],[699,900]]){await p.setViewportSize({width,height});await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',width+'x'+height);await proportion(p);await expect(last).toBeInViewport({ratio:1});}
   await p.setViewportSize(scenario.options.viewport);
  }
 }finally{await student.context.close();}
});
