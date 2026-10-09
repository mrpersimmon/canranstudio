'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {CASES: allCases,story,activity,select,answers,currentGroup}=require('../support/units1-30-tasks');
const CASES=Object.fromEntries(Object.entries(allCases).filter(([pair])=>!['1-2','25-26'].includes(pair))); // Current editions: unit-thirteen-types.spec.js.
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function mode(page,pair){
 if(pair==='1-2')await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
 else {await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());await page.addInitScript(()=>{window.englishSpeakCalls=0;speechSynthesis.speak=()=>{window.englishSpeakCalls++;};});}
}
for(const pair of Object.keys(CASES))test(`${pair} 全课独立完成、完整原文与证书门槛`,async({page})=>{
 test.setTimeout(120000);await mode(page,pair);const requests=[],errors=[];
 page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))requests.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.getByRole('button',{name:['3-4','5-6'].includes(pair)?'保存纪念卡':'领取单元证书',exact:true})).toBeDisabled();
 await story(page,pair);await expect(page.locator('.stage-text .btext')).toHaveCount(CASES[pair].dialogue.length);
 for(const group of Object.keys(CASES[pair].old))await activity(page,pair,group);
 await page.goto(`/unit${pair}/#learn/certificate`);
 if(['3-4','5-6'].includes(pair)){await expect(page.locator('#starCount')).toHaveText('5');await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');await expect(page.getByRole('button',{name:'保存纪念卡',exact:true})).toBeDisabled();await page.reload();await expect(page.locator('#starCount')).toHaveText('5');expect(errors).toEqual([]);expect(requests.filter(x=>!x.includes('/assets/feedback/'))).toEqual([]);return;}
 await expect(page.locator('#starCount')).toHaveText('15');
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('认真小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateName')).toHaveText('认真小伙伴');await page.keyboard.press('Escape');await page.reload();await expect(page.locator('#starCount')).toHaveText('15');
 if(pair!=='1-2'){expect(requests.filter(x=>!x.includes('/assets/feedback/'))).toEqual([]);expect(await page.evaluate(()=>window.englishSpeakCalls)).toBe(0);}
 expect(errors).toEqual([]);
});
for(const pair of Object.keys(CASES).filter(x=>CASES[x].changes.length))test(`${pair} 真实旧轮次升级后新题未答，未改成绩与纪念信息保留`,async({page})=>{
 test.setTimeout(120000);await mode(page,pair);let old=true;
 for(const name of ['content.js','unit.js']){const body=await fs.readFile(`tests/fixtures/units1-30-tasks-before/unit${pair}/${name}`);await page.route(`**/unit${pair}/${name}*`,r=>old?r.fulfill({body,contentType:'text/javascript'}):r.continue());}
 await story(page,pair);for(const group of Object.keys(CASES[pair].old))await activity(page,pair,group,{old:true});
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('升级小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 old=false;await page.reload();
 if(['3-4','5-6'].includes(pair)){
  await expect(page.locator('#starCount')).toHaveText('0');await expect(page.locator('#certificateDate')).toBeHidden();await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).activity.unitName,'canran:unit'+pair+':learning:v1')).toBe('升级小伙伴');
  const seen=new Set();
  for(const change of CASES[pair].changes){const id=currentGroup(pair,change.group);if(seen.has(id))continue;seen.add(id);await page.goto(`/unit${pair}/#learn/${id}`);const room=page.locator('.stage-'+id);const first=answers(pair,id).findIndex(x=>x.fresh);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(first));await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await activity(page,pair,id);}
  // Carrying old answers forward is not a new zero-error round.
  await expect(page.locator('#starCount')).toHaveText('0');
  const id=currentGroup(pair,CASES[pair].changes[0].group);await page.goto(`/unit${pair}/#learn/${id}`);await page.locator('.stage-'+id).getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,pair,id);await expect(page.locator('#starCount')).toHaveText('1');return;
 }
 await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('升级小伙伴');
 for(const change of CASES[pair].changes){
  await page.goto(`/unit${pair}/#learn/${change.group}`);const room=page.locator('.stage-'+change.group);const first=change.answers.findIndex(x=>x.fresh);
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(first));await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await activity(page,pair,change.group);
 }
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);
});

const representative={'1-2':'exam','3-4':'listen','5-6':'listen','7-8':'reply','9-10':'roles','11-12':'owner','13-14':'roles','15-16':'listen','17-18':'forms','19-20':'observe','21-22':'exam','23-24':'roles','25-26':'roles','27-28':'roles','29-30':'roles'};
for(const[pair,group]of Object.entries(representative).filter(([pair])=>CASES[pair]))for(const width of [320,390,768,1280])test(`${pair} ${width} 真实新题画面与按钮稳定`,async({page})=>{
 test.setTimeout(120000);await mode(page,pair);await page.setViewportSize({width,height:900});
 const groups=CASES[pair].changes.length?CASES[pair].changes.map(x=>x.group):[group];
 if(groups.includes('roles'))await story(page,pair);
 const dir='output/test-units1-30-tasks';let taken=false;
 async function capture(room,q,state){
  await page.evaluate(()=>document.fonts.ready);await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const b of await room.locator('.practice-options button').all()){
   const r=await b.boundingBox();expect(r.height).toBeGreaterThanOrEqual(43.5);expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width+.5);
   expect(await b.evaluate(el=>el.scrollWidth<=el.clientWidth+2&&el.scrollHeight<=el.clientHeight+2)).toBe(true);
  }
  const actions=room.getByRole('group',{name:'作答操作',exact:true});const y=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  if(state==='blank')room._actionY=y;else expect(Math.abs(y-room._actionY)).toBeLessThanOrEqual(2);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`${dir}/${pair}-${width}-${q.id}-${state}.png`,fullPage:true,clip:await room.boundingBox()});
 }
 // Mark the retained 21–22 task only for visual capture, not as a new question.
 const list=answers(pair,group);const flags=list.map(x=>x.fresh);if(pair==='21-22')list[0].fresh=true;
 for(const id of groups)await activity(page,pair,id,{capture:async(room,q,state)=>{await capture(room,q,state);taken=true;},wrongNew:pair!=='21-22'});
 list.forEach((x,i)=>x.fresh=flags[i]);expect(taken).toBe(true);
});

for(const[pair,group]of Object.entries(representative).filter(([pair])=>CASES[pair]).filter(([pair])=>pair!=='21-22'))for(const width of [390,1280])test(`${pair} ${width} 改前同环节画面对照`,async({page})=>{
 test.setTimeout(60000);await mode(page,pair);await page.setViewportSize({width,height:900});
 for(const name of ['content.js','unit.js']){const body=await fs.readFile(`tests/fixtures/units1-30-tasks-before/unit${pair}/${name}`);await page.route(`**/unit${pair}/${name}*`,r=>r.fulfill({body,contentType:'text/javascript'}));}
 if(group==='roles')await story(page,pair);await page.goto(`/unit${pair}/#learn/${group}`);const room=page.locator('.stage-'+group);
 const items=answers(pair,group,true),stop=Math.min(answers(pair,group).findIndex(q=>q.fresh),items.length-1);
 for(let i=0;i<stop;i++){
  if(items[i].audio)await room.getByRole('button',{name:'听一遍',exact:true}).click();
  await select(room,items[i].answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 }
 await page.evaluate(()=>document.fonts.ready);await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
 await room.screenshot({path:`output/test-units1-30-tasks/${pair}-${width}-${group}-before.png`});
});
