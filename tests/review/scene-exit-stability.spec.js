'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
async function open(page,selection){
  await page.goto('/?'+new URLSearchParams({unit:'unit1-2',device:devices[0].id,...selection}));
  await expect(page.locator('#loading')).toBeHidden({timeout:30000});
  await expect(page.locator('#error')).toBeHidden();
  return page.frameLocator('#frame-shell iframe:not(.pending)');
}
async function sampleExitColors(frame){
  await frame.locator('.stage-exam .completion-card').evaluate(()=>{
    window.exitColorFrames=[];window.exitColorSamplingDone=false;let visibleAt;
    const started=performance.now();
    function sample(){
      const card=document.querySelector('.stage-certificate');
      if(card.classList.contains('learning-surface')){
        visibleAt??=performance.now();
        window.exitColorFrames.push([...card.querySelectorAll('.course-ending-navigation>a')].map(a=>{
          const s=getComputedStyle(a);return {background:s.backgroundColor,border:s.borderColor,color:s.color,animations:a.getAnimations().filter(x=>x.constructor.name==='CSSTransition').map(x=>x.transitionProperty)};
        }));
      }
      if(performance.now()-started<4000&&(visibleAt===undefined||performance.now()-visibleAt<450))requestAnimationFrame(sample);
      else window.exitColorSamplingDone=true;
    }
    requestAnimationFrame(sample);
  });
  await frame.getByRole('button',{name:'查看纪念卡',exact:true}).click();
  await expect.poll(()=>frame.locator('body').evaluate(()=>Boolean(window.exitColorSamplingDone))).toBe(true);
  return frame.locator('body').evaluate(()=>window.exitColorFrames);
}
async function expectBagAttached(bag){
  await expect(bag).toBeVisible();
  await bag.evaluate(el=>Promise.allSettled(el.getAnimations().map(animation=>animation.finished)));
  const sizes=await bag.evaluate(img=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    const target=img.closest('.quest-person-target,.quest-actor');
    return {bag:rect(img),slot:rect(img.parentElement),person:rect(target.querySelector('img')),target:rect(target),label:rect(target.querySelector(':scope>span'))};
  });
  expect(sizes.bag.width).toBeLessThanOrEqual(sizes.slot.width+1);
  expect(sizes.bag.height).toBeLessThanOrEqual(sizes.slot.height+1);
  expect(sizes.bag.right).toBeLessThanOrEqual(sizes.target.right);
  expect(sizes.bag.x).toBeGreaterThanOrEqual(sizes.target.x);
  expect(sizes.bag.bottom).toBeLessThanOrEqual(sizes.label.y);
  expect(sizes.bag.width/sizes.person.height).toBeLessThanOrEqual(.36);
  // The bag handle remains at the hands on the left of the accepted portrait.
  expect(sizes.bag.x+sizes.bag.width/2).toBeLessThan(sizes.person.x+sizes.person.width/2);
  return sizes;
}
for(const device of devices){
  test('returned handbag stays in the recipient portrait on '+device.name,async({page},info)=>{
    const frame=await open(page,{page:'q:u12-scene-v1-return',state:'review',device:device.id});
    const room=frame.locator('.stage-manners'),bag=room.locator('.quest-person-target[data-person="woman"] .quest-handbag');
    const sizes=await expectBagAttached(bag);
    await info.attach('returned-bag-geometry',{body:JSON.stringify(sizes,null,2),contentType:'application/json'});
    await page.screenshot({path:info.outputPath('return-'+device.id+'.png')});
    for(const state of ['correct','corrected','review']){
      await page.locator('#state-buttons [data-state="'+state+'"]').click();
      await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
      await expectBagAttached(bag);
    }
  });
  test('keepsake exit colors are stable from the first visible frame on '+device.name,async({page},info)=>{
    for(const unit of ['unit1-2','unit3-4','unit5-6']){
      const frame=await open(page,{unit,page:'result:exam',state:'perfect',device:device.id});
      for(let visit=0;visit<2;visit++){
        if(visit){await frame.locator('.learning-milestones').getByRole('link',{name:'挑战',exact:true}).click();await expect(frame.locator('.stage-exam .completion-card')).toBeVisible();}
        const samples=await sampleExitColors(frame);
        await info.attach(unit+'-exit-color-frames-'+visit,{body:JSON.stringify(samples,null,2),contentType:'application/json'});
        expect(samples.length).toBeGreaterThan(5);
        const settled=samples.at(-1);
        for(const sample of samples)for(let i=0;i<sample.length;i++){
          expect(sample[i].background).toBe(settled[i].background);
          expect(sample[i].border).toBe(settled[i].border);
          expect(sample[i].color).toBe(settled[i].color);
          expect(sample[i].animations).not.toContain('background-color');
        }
      }
    }
  });
}
test('returned handbag stays attached in both scene types through responsive changes',async({page},info)=>{
  for(const question of ['q:u12-types-v1-t13','q:u12-scene-v1-return']){
    const frame=await open(page,{page:question,state:'correct'});
    const bag=frame.locator('.stage-manners .quest-bag-slot .quest-handbag');
    for(const device of ['small-phone','desktop','tablet',devices[0].id]){
      await page.locator('#device').selectOption(device);
      await expectBagAttached(bag);
      await expect(frame.locator('.stage-manners').getByRole('button',{name:'下一题',exact:true})).toBeVisible();
      await page.screenshot({path:info.outputPath(question.replaceAll(':','-')+'-'+device+'.png')});
    }
  }
});
