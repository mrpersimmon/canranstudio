'use strict';
const {subjectAnswers,submitSubject,finishSubjects}=require('../support/l49-subject-flow');
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
test.setTimeout(180000);

// Page-only acceptance: answer through visible controls; no runner/state shortcuts.
const rounds = [
  ['listen', ['butcher','meat','beef','lamb','steak','mince','chicken','husband','tell','truth','either','mutton','pork','fish']],
  ['roles', ['steak','Beef, please.',"To tell you the truth, Mrs. Bird, I don't like chicken either.",'Lamb, please.','I like steak, too.']],
  ['doare', ['Do you like meat?','Are you a teacher?','Are you busy?','Are you at home?','Do you want beef?','Do you sleep well?','Do you make the bed?','Do you put on your coat?']],
  ['give', ['Mrs. Bird','that piece','Give that piece to me, please.',['Give','that piece','to','me,','please.'],'Tom',['Show','your ticket','to','Lily,','please.']]],
  ['pouch', ['To tell you the truth']],
  ['either', ['两个人都喜欢牛排','I like steak, too.','两个人都不喜欢鸡肉',"I don't like chicken either.",'I am a teacher, too.',"I am not at home either."]],
  ['fill', ['likes','like','watches','goes','loves','walk','drink']],
  ['choice', ["He doesn't like chicken.","Lucy doesn't want beef.",'gets','works']],
  ['trans', [['She','likes','peaches.'],['He','wants','a car.']]],
  ['exam', ['mince','Mrs. Bird: lamb · husband: steak','Are you a student?','Do you want chicken?',['Give','the beef','to','Lily,','please.'],'Sam','I like lamb, too.','want',"Tom doesn't like beef.","I don't like lamb either."]]
];

async function prepare(page) {
  await page.addInitScript(() => {
    // Existing progress prevents unrelated growth overlays during layout review.
    if (!localStorage.getItem('canran:l49:learning:v1')) {
      localStorage.setItem('canran:l49:learning:v1', JSON.stringify({version:1,groups:{},records:{},activity:{fullDialogue:true}}));
      localStorage.setItem('l49-stars-v1', JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    }
    window.Audio = class extends EventTarget {
      constructor(src){super();this.src=src;this.currentTime=0;this.paused=true;}
      play(){this.paused=false;queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}
      pause(){this.paused=true;}
    };
  });
}
async function shot(page, stage, name, width) {
  const viewport=page.viewportSize();
  await page.setViewportSize({width,height:1800});
  await stage.screenshot({path:`output/playwright/l49-v17-actions-${process.env.L49_ACTION_PASS || 'final'}-${name}-${width}.png`,style:'#topbar{visibility:hidden!important} :focus{outline:none!important}'});
  await page.setViewportSize(viewport);
}
async function answer(stage, value) {
  const audio=stage.getByRole('button',{name:'听一遍',exact:true});
  if(await audio.isVisible())await audio.click();
  if(Array.isArray(value)){
    const bank=stage.getByRole('group',{name:'待选词块',exact:true});
    for(const token of value)await bank.getByRole('button',{name:token,exact:true}).click();
  }else await stage.locator('.practice-options').getByRole('button',{name:value,exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(stage.locator('.practice-actions').getByRole('status')).toHaveText('答对了！');
  await stage.getByRole('button',{name:/^(下一题|完成这一站|查看本次记录)$/}).click();
}
async function inspectFinish(page, stage, width, id, issues) {
  await shot(page,stage,id,width);
  const actions=stage.getByRole('group',{name:'完成后的操作',exact:true});
  if(await actions.count()!==1){issues.push(id+': 完成操作未收拢为一组');return;}
  const buttons=actions.getByRole('button');
  if(await buttons.count()!==2){issues.push(id+': 完成操作不是两个');return;}
  const primary=actions.getByRole('button',{name:/^下一站：/});
  const secondary=actions.getByRole('button',{name:/^(再练一轮|重看课文|下一组主语)$/});
  const p=await primary.boundingBox(),s=await secondary.boundingBox(),a=await actions.boundingBox(),room=await stage.boundingBox();
  if(!p||!s){issues.push(id+': 完成操作不可见');return;}
  if(Math.abs(a.x+a.width/2-room.x-room.width/2)>2)issues.push(id+': 操作组偏离舞台中线');
  if(width>580){
    if(Math.abs(p.y-s.y)>2||p.x-s.x-s.width<10||p.x-s.x-s.width>16)issues.push(id+': 桌面主次按钮未在同一行，次左主右');
  }else if(!(s.y>=p.y+p.height+10&&s.y<=p.y+p.height+20))issues.push(id+': 手机主按钮未在次按钮正上方');
  for(const box of [p,s])if(box.height<48||box.x<room.x||box.x+box.width>room.x+room.width)issues.push(id+': 按钮过小或溢出');
  if(p.width<s.width)issues.push(id+': 主要按钮比次要按钮窄');
  if(await secondary.evaluate(node=>getComputedStyle(node).backgroundColor)===await primary.evaluate(node=>getComputedStyle(node).backgroundColor))issues.push(id+': 主次没有区分');
}

for(const width of [1280,390])test(`${width} 宽度逐站完成、重练与导航，所有结束操作集中对齐`,async({page})=>{
  await page.setViewportSize({width,height:900});await prepare(page);
  const issues=[];
  for(const [id,values]of rounds){
    await page.goto('/lesson49/#learn/'+id);await page.evaluate(()=>document.fonts.ready);
    const stage=page.locator('.stage-'+id);
    if(id==='listen')await page.locator('#lgStartBtn').click();
    if(id==='exam')await page.locator('#quizStartBtn').click();
    for(let i=0;i<values.length;i++){
      await answer(stage,values[i]);
      if(id==='exam'&&i===4){
        await shot(page,stage,'exam-break',width);
        await stage.getByRole('button',{name:'继续第二段（5 题）',exact:true}).click();
      }
    }
    await expect(stage.locator('.practice-finish')).toBeVisible();
    await inspectFinish(page,stage,width,id,issues);
    await page.reload();
    await expect(stage.locator('.practice-finish')).toBeVisible();
    const onward=stage.getByRole('button',{name:/^下一站：/});
    const nextTitle=(await onward.innerText()).replace('下一站：','');
    await onward.click();await expect(page.getByRole('heading',{name:nextTitle,exact:true})).toBeFocused();
    await stage.getByRole('button',{name:'再练一轮',exact:true}).click();
    await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    await expect(onward).toBeHidden();
    if(id==='roles')await expect(stage.getByRole('region',{name:'当前情境',exact:true})).toBeVisible();
  }
  await page.goto('/lesson49/#learn/text');
  for(let i=0;i<12;i++){await page.locator('#nextBtn').click();await expect(page.locator('#nextBtn')).toBeEnabled();}
  const textStage=page.locator('.stage-text');
  await inspectFinish(page,textStage,width,'text',issues);
  if(await page.locator('#replayBtn').isVisible())issues.push('text: 结束后重复显示重新上演');
  await expect(page.locator('#bubbleArea .btext')).toHaveCount(11);
  await page.locator('#nextBtn').click();
  await expect(page.getByRole('region',{name:'听前问题',exact:true})).toBeVisible();
  await page.goto('/lesson49/#learn/subjects');
  await finishSubjects(page);
  const subjects=page.locator('.stage-subjects');
  await inspectFinish(page,subjects,width,'subjects',issues);
  await subjects.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(subjects.getByRole('button',{name:'第一人称',exact:true})).toBeEnabled();
  await expect(subjects.getByRole('button',{name:/^下一站：/})).toBeHidden();
  await page.goto('/lesson49/#learn/words');
  for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await shot(page,page.locator('.stage-words'),'words-last',width);
  const prev=await page.getByRole('button',{name:'上一组词卡',exact:true}).boundingBox();
  const next=await page.getByRole('button',{name:'下一站：听音寻宝',exact:true}).boundingBox();
  if(Math.abs(prev.y-next.y)>2)issues.push('words: 上一组与下一站未并排');
  await page.goto('/lesson49/#learn/certificate');
  await shot(page,page.locator('.stage-certificate'),'certificate',width);
  await page.locator('#certBtn').click();await expect(page.locator('#certModal')).toBeVisible();
  await shot(page,page.locator('#certCard'),'certificate-dialog',width);
  await page.locator('#certClose').click();
  expect(issues).toEqual([]);
});

test('320 窄屏全页按钮不横溢出，词卡成对，证书操作按主次分组',async({page})=>{
  await page.setViewportSize({width:320,height:664});await prepare(page);
  await page.goto('/lesson49/#learn/words');await page.evaluate(()=>document.fonts.ready);
  for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  for(const stage of await page.locator('.shop-stage').all()){
    const edge=await stage.boundingBox();
    for(const button of await stage.getByRole('button').all()){
      if(!await button.isVisible())continue;
      const box=await button.boundingBox();
      expect(box.x,await button.getAttribute('aria-label')||await button.innerText()).toBeGreaterThanOrEqual(edge.x);
      expect(box.x+box.width).toBeLessThanOrEqual(edge.x+edge.width);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
  const prev=await page.getByRole('button',{name:'上一组词卡',exact:true}).boundingBox();
  const next=await page.getByRole('button',{name:'下一站：听音寻宝',exact:true}).boundingBox();
  expect(prev.y).toBe(next.y);expect(prev.height).toBe(next.height);
  const activityNameLines=await page.getByRole('button',{name:'下一站：听音寻宝',exact:true}).evaluate(button=>{
    const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);
    let text;while((text=walker.nextNode())){
      const start=text.textContent.indexOf('听音寻宝');
      if(start<0)continue;
      const range=document.createRange();range.setStart(text,start);range.setEnd(text,start+4);
      return new Set([...range.getClientRects()].map(rect=>Math.round(rect.top))).size;
    }
    return 0;
  });
  expect(activityNameLines).toBe(1);
  await shot(page,page.locator('.stage-words'),'words-last',320);
  await page.locator('.stage-words').getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'肉店小图鉴 · 怎么玩',exact:true})).toBeVisible();
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'学徒手记',exact:true})).toBeVisible();
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  await page.locator('#certBtn').click();
  await page.locator('#certCard').evaluate(node=>Promise.all(node.getAnimations().map(animation=>animation.finished)));
  const save=await page.locator('#certSave').boundingBox(),print=await page.locator('#certPrint').boundingBox(),close=await page.locator('#certClose').boundingBox();
  expect(print.y).toBe(close.y);expect(print.y-save.y-save.height).toBeGreaterThanOrEqual(10);
  expect(save.width).toBeGreaterThan(print.width);expect(print.width).toBe(close.width);
  await page.locator('#certClose').click();
});
