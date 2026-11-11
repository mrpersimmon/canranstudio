'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/unit34-v154');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const book=p=>p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)));
// Optical support points from the generated coat/counter receipts, projected
// through object-fit. CSS boxes alone cannot detect a coat hovering over a desk.
async function coatOnCounter(scene,selector){
 return scene.evaluate((el,coatSelector)=>{function point(im,x,y){const r=im.getBoundingClientRect(),scale=Math.min(r.width/im.naturalWidth,r.height/im.naturalHeight),w=im.naturalWidth*scale,h=im.naturalHeight*scale;return {x:r.x+(r.width-w)/2+x*w,y:r.y+(r.height-h)/2+y*h};}const coat=el.querySelector(coatSelector),desk=el.querySelector('.cloakroom-desk');return {coat:point(coat,.66,.15),desk:point(desk,.509,.26),left:point(desk,.1,.26).x,right:point(desk,.9,.26).x};},selector);
}
test.use({actionTimeout:8000});

for(const device of devices)test(`${device.name}：认领亭人物、三把伞与柜台同坐标，作答记录和原卡保留`,async({page,browser},info)=>{
 test.setTimeout(150000);await adminLogin(page,base);const account=await createStudent(page,'认领亭视觉-'+device.id,'小禾',[/Lesson 3–4 /]),s=await studentLogin(browser,account,base,contextOptions(device)),p=s.page;
 try{
  await p.goto(base+'unit3-4/#learn/text');await courseReadyForAssertions(p);await expect(p.locator('body')).toHaveAttribute('data-unit34-journey','v1');
  const stage=p.locator('.stage-text'),art=stage.locator('.cloakroom-props');
  await stage.getByRole('button',{name:'开始故事',exact:true}).click();
  for(let i=0;i<12;i++){
   if(i)await stage.getByRole('button',{name:'下一句',exact:true}).click();
   const expected=i>=10?'umbrella-held':i>=9?'umbrella':i>=7?'umbrella-yellow':'umbrella-red';await expect(art.locator('.umbrella-prop>img')).toHaveAttribute('data-umbrella-artwork',expected);
   if([0,7,9,10,11].includes(i)){
    const g=await art.evaluate(el=>{const b=el.getBoundingClientRect();return {ratio:b.width/b.height,overflow:el.scrollWidth-el.clientWidth,parts:[...el.querySelectorAll('.cloakroom-actor>img,.cloakroom-desk')].map(im=>{const r=im.getBoundingClientRect();return {ready:im.complete&&im.naturalWidth>0,inside:r.left>=b.left-1&&r.right<=b.right+1&&r.top>=b.top-1&&r.bottom<=b.bottom+1};})};});
    expect(g.ratio).toBeCloseTo(1.5,1);expect(g.overflow).toBeLessThanOrEqual(1);expect(g.parts.every(x=>x.ready&&x.inside)).toBe(true);
    if(i<10){const contact=await coatOnCounter(art,'.coat-prop>img');expect(Math.abs(contact.coat.y-contact.desk.y)).toBeLessThanOrEqual(8);expect(contact.coat.x).toBeGreaterThan(contact.left);expect(contact.coat.x).toBeLessThan(contact.right);}
    await expect(stage.getByRole('button',{name:i===11?'去练习':'下一句',exact:true})).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath('story-'+i+'.png'),scale:'css'});
   }
  }
  await stage.getByRole('button',{name:'去练习',exact:true}).click();await expect(p).toHaveURL(/#learn\/roles$/);
  await p.goto(base+'unit3-4/#learn/reply');const grammar=p.locator('.stage-reply');await expect(grammar.getByRole('button',{name:'检查答案',exact:true})).toBeInViewport({ratio:1});
  await grammar.getByRole('button',{name:'This is not my coat.',exact:true}).click();const saved=await book(p);await p.screenshot({path:info.outputPath('question.png'),scale:'css'});await p.reload();await courseReadyForAssertions(p);expect((await book(p)).groups).toEqual(saved.groups);
  await expect(grammar.getByRole('button',{name:'This is not my coat.',exact:true})).toHaveAttribute('aria-pressed','true');
  const result=await flow.activity(p,'listen',{base:base.slice(0,-1)});await expect(result.locator('.completion-art')).toHaveClass(/journey-completion/);await expect(result.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);await p.screenshot({path:info.outputPath('result.png'),scale:'css'});await expect(p.locator('#starCount')).toHaveText('1');
  await flow.activity(p,'manners',{base:base.slice(0,-1),capture:async(room,i,phase)=>{
   if(i!==0||phase!=='blank')return;
   const contact=await coatOnCounter(room.locator('.counter-stage'),'.counter-item-coat>img:first-child');
   expect(Math.abs(contact.coat.y-contact.desk.y)).toBeLessThanOrEqual(8);
   expect(contact.coat.x).toBeGreaterThan(contact.left);expect(contact.coat.x).toBeLessThan(contact.right);
   // The coat can rest on the counter without moving the companion umbrella
   // over the clerk's face. Project the portrait's visible face edge (x=.37).
   expect(await room.locator('.counter-stage').evaluate(el=>{
    const face=el.querySelector('.counter-attendant>img'),r=face.getBoundingClientRect(),scale=Math.min(r.width/face.naturalWidth,r.height/face.naturalHeight),w=face.naturalWidth*scale;
    return el.querySelector('.counter-item-coat>img:last-child').getBoundingClientRect().right<=r.x+(r.width-w)/2+.37*w;
   })).toBe(true);
   await p.screenshot({path:info.outputPath('counter-contact.png'),scale:'css'});
  }});
  await p.goto(base+'unit3-4/#learn/certificate');await courseReadyForAssertions(p);await expect(p.locator('.stage-certificate .story-award-paper')).toContainText('小禾');expect(await p.evaluate(()=>CanranCore.unit34.reward.scene)).toContain('unit3-4-umbrella.webp');
  expect((await p.request.get(base+'assets/unit3-4-journey/visitor-v1.png')).status()).toBe(403);
 }finally{await s.context.close();}
});
