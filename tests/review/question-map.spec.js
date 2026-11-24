'use strict';
const {test,expect}=require('@playwright/test'),{UNITS}=require('../../server/catalog'),{definition}=require('../../server/progress');
const {devices}=require('../support/required-phone-devices');
const cases=UNITS.flatMap(unit=>Object.values(definition(process.cwd(),unit,'/').questions).flat().filter(q=>q.type==='scene-find').map(q=>({unit,q})));
test.describe.configure({mode:'parallel'});
for(const {unit,q}of cases)test(q.id+' whole map and touch targets fit together',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+q.id,state:'before',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of devices){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  for(const state of ['before','correct','review']){
   await page.locator('#state-buttons [data-state="'+state+'"]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
   const r=await frame.locator('.learning-surface .scene-find-canvas').evaluate(e=>{const b=e.getBoundingClientRect(),p=e.closest('.practice-content');return{scroll:p.scrollHeight-p.clientHeight,overflow:[...e.querySelectorAll('button')].some(x=>{const r=x.getBoundingClientRect();return r.width<44||r.height<44||r.left<b.left-1||r.top<b.top-1||r.right>b.right+1||r.bottom>b.bottom+1;})};});expect(r.scroll).toBeLessThanOrEqual(2);expect(r.overflow).toBe(false);
  }
  await page.locator('#state-buttons [data-state=before]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await frame.locator('.scene-find-canvas').getByRole('button',{name:q.spots.find(s=>s.id===q.answer).name,exact:true}).click();await frame.locator('.learning-surface').getByRole('button',{name:'检查答案',exact:true}).click();await expect(frame.locator('.learning-surface .fb')).toHaveText('答对了！');
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
 }
});
