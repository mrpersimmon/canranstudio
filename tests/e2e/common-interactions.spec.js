'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:4000});
const pairs=Array.from({length:20},(_,i)=>`${i*2+1}-${i*2+2}`);
for(const width of [320,1280])test(`${width} 所有无配音单元共用简洁操作，阅读三态布局一致`,async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const pair of pairs){
  await page.goto(`/unit${pair}/#learn/text`);await page.evaluate(()=>document.fonts.ready);
  await expect(page.getByRole('button',{name:'怎么玩',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'暂停，稍后继续',exact:true})).toHaveCount(0);
  await expect(page.locator('#unitHelp')).toHaveCount(0);
  await expect(page.locator('.practice-options input,.practice-options textarea,.task-instruction')).toHaveCount(0);
  expect(await page.locator('.word-answer').evaluateAll(xs=>xs.every(x=>!getComputedStyle(x,'::before').content.includes('点词块')))).toBe(true);
  const room=page.locator('.stage-text'),controls=room.locator('.stage-ctrl');
  await expect(controls.locator('button:visible')).toHaveCount(1);
  const initial=await controls.getByRole('button').boundingBox(),container=await controls.boundingBox();
  expect(Math.abs(initial.x+initial.width/2-container.x-container.width/2)).toBeLessThan(2);
  await controls.getByRole('button',{name:'开始看课文',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText(/^1 \/ \d+$/);
  const next=controls.locator(':scope > button'),reset=controls.locator('.stage-tools button');
  const n=await next.boundingBox(),r=await reset.boundingBox();expect(Math.abs(n.y-r.y)).toBeLessThan(2);expect(r.x+r.width).toBeLessThan(n.x);
  await page.reload();await expect(room.getByRole('status')).toHaveText(/^1 \/ \d+$/);
  while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);
  const a=await finish.getByRole('button').first().boundingBox(),b=await finish.getByRole('button').last().boundingBox();expect(Math.abs(a.y-b.y)).toBeLessThan(2);expect(a.x+a.width).toBeLessThan(b.x);
  await expect(page.locator('.practice-options input,.practice-options textarea')).toHaveCount(0);
  expect(await page.locator('.practice-content > h3,.quest-prompt').evaluateAll(xs=>xs.every(x=>!x.textContent.endsWith('。')))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 expect(errors).toEqual([]);
});
async function predecessor(page,pair){
 const fs=require('node:fs/promises');let old=true;
 const files={
  [`/unit${pair}/content.js`]:await fs.readFile(`tests/fixtures/common-interaction-before/unit${pair}-content.js`),
  '/core/lesson49-practice.js':await fs.readFile('tests/fixtures/common-interaction-before/lesson49-practice.js')
 };
 if(pair==='1-2'){
  files['/unit1-2/unit.js']=await fs.readFile('tests/fixtures/unit1-2-before-awards/unit.js');
  const html=await fs.readFile('tests/fixtures/unit1-2-before-awards/index.html');
  await page.route(url=>url.pathname==='/unit1-2/',r=>old?r.fulfill({body:html,contentType:'text/html'}):r.continue());
 }
 for(const [path,body] of Object.entries(files))await page.route('**'+path+'*',r=>old?r.fulfill({body,contentType:'text/javascript'}):r.continue());
 return ()=>{old=false;};
}
test('旧版暂停中的未提交选择，升级直接续做且不自动判对',async({page})=>{
 const upgrade=await predecessor(page,'1-2');await page.goto('/unit1-2/#learn/exam');const room=page.locator('.stage-exam');
 await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'Yes?',exact:true}).click();
 await room.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();await page.reload();await expect(room).toContainText('已暂停');
 upgrade();await page.reload();await expect(room.getByRole('button',{name:'暂停，稍后继续',exact:true})).toHaveCount(0);
 await expect(room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'Yes?',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'Yes, it is.',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('旧版分段暂停升级后进入第六题，前五题保留且不替答',async({page})=>{
 const upgrade=await predecessor(page,'1-2');
 await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
 await page.goto('/lesson49/#learn/exam');const room=page.locator('.stage-exam');await room.getByRole('button',{name:'开始挑战',exact:true}).click();
 const {select}=require('../support/thirteen-types-flow');
 for(const answer of ['mince','Mrs. Bird: lamb · husband: steak','Are you a student?','Do you want chicken?',['Give','the beef','to','Lily,','please.']]){
  if(answer==='mince')await room.getByRole('button',{name:'听一遍',exact:true}).click();
  await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();
 }
 await expect(room).toContainText('已完成 5 / 10 题');upgrade();await page.reload();
 await expect(room.locator('.progress-copy')).toHaveText('第 6 / 10 题');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','5');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('button',{name:/继续第二段/})).toHaveCount(0);
});
for(const pair of ['1-2','25-26'])test(`${pair} 原输入版满星升级保留相同题和证书纪念，新补词题须重新完成`,async({page})=>{
 test.setTimeout(90000);const {ANSWERS,story,select,complete}=require('../support/thirteen-types-flow');
 const upgrade=await predecessor(page,pair);await story(page,pair);
 const oldAnswers=pair==='1-2'?require('../fixtures/unit1-2-before-awards/flow').ANSWERS[pair]:ANSWERS[pair];
 for(const[id,items]of Object.entries(oldAnswers)){
  await page.goto(`/unit${pair}/#learn/${id}`);const room=page.locator('.stage-'+id);
  for(let i=0;i<items.length;i++){
   if((pair==='1-2'&&id==='trans'&&i===0)||(pair==='25-26'&&id==='be'&&i===1))await room.getByRole('textbox',{name:'缺少的英文单词',exact:true}).fill(pair==='1-2'?'book':'clean');
   else await select(room,items[i]);
   await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
   await room.getByRole('button',{name:i===items.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  }
 }
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('旧版小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 upgrade();await page.reload();
 if(pair==='1-2'){
  await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');await expect(page.locator('#certificateDate')).toBeHidden();
  await page.goto('/unit1-2/#learn/trans');const workshop=page.locator('.stage-workshop');
  await expect(workshop.getByRole('textbox')).toHaveCount(0);await expect(workshop.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(workshop.locator('.progress-copy')).toHaveText('第 3 / 4 题');
  const {activity}=require('../support/thirteen-types-flow');for(const id of Object.keys(ANSWERS[pair]))await activity(page,pair,id);
  await page.goto('/unit1-2/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');await expect(page.locator('#certificateDate')).toBeHidden();return;
 }
 await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('旧版小伙伴');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
 await page.goto(`/unit${pair}/#learn/${pair==='1-2'?'trans':'be'}`);const room=page.locator(pair==='1-2'?'.stage-trans':'.stage-be');
 await expect(room.getByRole('textbox')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(pair==='1-2'?'第 1 / 2 题':'第 2 / 3 题');
 await complete(page,pair);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);
});
