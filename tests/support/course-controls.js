'use strict';
const {expect}=require('@playwright/test');
const {courseReadyForAssertions}=require('./completion-layout');

// A cached classroom from before the learning shell still has its original
// accessibility tree. Select its controls only in that version of the page.
const buttons={
  startStory:['开始故事','开始看课文'],
  startVoicedStory:['开始故事','开始听课文'],
  finishStory:['去练习','完成课文'],
  finishVoicedStory:['去练习','完成课文学习'],
  previousWords:['上一组','上一组词卡'],
  nextWords:['下一组','下一组词卡'],
  finishPractice:['完成练习','完成这一站'],
  finishExam:[/^完成(?:挑战|练习)$/,'查看本次记录'],
  replayStory:[/^(重看故事|再看一遍)$/,'再看一遍']
};
function courseButton(scope,action,options={}){
  const find=name=>scope.getByRole('button',{exact:true,...options,name});
  if(!Object.hasOwn(buttons,action))return find(action);
  const [current,historical]=buttons[action];
  const document=typeof scope.page==='function'?scope.page():scope;
  return find(current).and(document.locator('body[data-learning-shell] button'))
    .or(find(historical).and(document.locator('body:not([data-learning-shell]) button')));
}
async function readyCourse(page){
  await courseReadyForAssertions(page);
  await expect(page.locator('body[data-learning-shell] .learning-surface, body:not([data-learning-shell]) #wordPageProgress'))
    .toBeVisible({timeout:30000});
}
// Reloading can briefly attach the exercise before the saved round is rendered.
async function restoredPracticeIndex(room){
  const current=room.locator('.progress-copy').filter({hasText:/第\s*\d+\s*\/\s*\d+\s*题/});
  return current.or(room.locator('.practice-finish')).first().evaluate(el=>{
    if(el.matches('.practice-finish'))return null;
    return Number(el.textContent.match(/第\s*(\d+)/)[1])-1;
  });
}
async function finishStoryAndReturn(room){
  const page=room.page(),current=await page.locator('body[data-learning-shell]').count();
  await courseButton(room,'finishStory').click();
  if(current){
    await expect(page).toHaveURL(/#learn\/roles$/);
    await page.getByRole('link',{name:'故事',exact:true}).click();
  }
  await expect(room.locator(':scope > .practice-finish')).toBeVisible();
}
async function expectResultIcons(room){
  const current=await room.page().locator('body[data-learning-shell]').count();
  const src=['/assets/unit1-2/completion/streak-v1.png','/assets/unit1-2/completion/correct-v1.png',
    current?'/assets/lesson49/icons/retry.svg':'/assets/unit1-2/completion/incorrect-v1.png'];
  const icons=room.locator('.completion-stat img');
  await expect(icons).toHaveCount(3);
  for(const [i,url] of src.entries()){
    const image=icons.nth(i);
    await expect(image).toHaveAttribute('src',url);
    await image.evaluate(el=>el.decode());
    await expect(image).toBeVisible();
  }
}
async function expectCompletionDestination(room,activity){
  const next=room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button').last();
  await expect(next).toBeVisible();
  await expect(next).toHaveText(activity==='exam'?'查看纪念卡':'下一站',{useInnerText:true});
  const fits=await next.evaluate(button=>{
    const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT),bounds=button.getBoundingClientRect(),rects=[];
    for(let node=walker.nextNode();node;node=walker.nextNode()){
      if(!node.textContent.trim())continue;
      const range=document.createRange();range.selectNodeContents(node);
      rects.push(...Array.from(range.getClientRects()).filter(r=>r.width&&r.height));
    }
    return rects.length>0&&rects.every(r=>Math.abs(r.top-rects[0].top)<=1&&r.left>=bounds.left-1&&r.right<=bounds.right+1&&r.bottom<=bounds.bottom+1);
  });
  expect(fits,'结算按钮文案应在按钮内完整显示为一行').toBe(true);
}
async function incorrectFeedback(scope){
  const page=typeof scope.page==='function'?scope.page():scope;
  return await page.locator('body[data-learning-shell]').count()?'答错了，再试试。':'再看看，试一次。';
}
function courseToolbar(page){
  return page.locator('body[data-learning-shell] .practice-screen-toolbar, body:not([data-learning-shell]) #topbar');
}
function courseTimeline(page){
  return page.locator('body[data-learning-shell] .learning-milestones, body:not([data-learning-shell]) #topbar');
}
async function openLearningRecord(page){
  if(await page.locator('body[data-learning-shell]').count()){
    await page.getByRole('button',{name:'更多学习操作',exact:true}).click();
    await page.getByRole('button',{name:'学习记录',exact:true}).click();
  }else await page.getByRole('button',{name:'学习手记',exact:true}).click();
}
async function openCourseReference(scope,title){
  const page=typeof scope.page==='function'?scope.page():scope;
  if(await page.locator('body[data-learning-shell]').count()){
    const previous=page.locator('#learning-reference-sheet[open]');
    if(await previous.isVisible()){
      await page.keyboard.press('Escape');
      await expect(previous).toBeHidden();
    }
    await page.getByRole('button',{name:'更多学习操作',exact:true}).click();
    await page.getByRole('button',{name:title,exact:true}).click();
    await expect(page.getByRole('dialog',{name:title,exact:true})).toBeVisible();
  }else await scope.getByText(title,{exact:true}).click();
}
function courseReference(scope){
  const page=typeof scope.page==='function'?scope.page():scope;
  return page.locator('body[data-learning-shell] #learning-reference-sheet[open], body:not([data-learning-shell]) .shop-stage:visible > details.offline-task[open]');
}
async function expectRecordExample(page,target,used,count=1){
  const book=page.locator('#learningRecord');
  if(!await page.locator('body[data-learning-shell]').count()){
    const row=book.locator('li').filter({hasText:target+' ·'});
    await expect(row).toHaveCount(count);
    for(const entry of await row.all()){
      if(used)await expect(entry).toContainText('看过示范后完成');else await expect(entry).not.toContainText('看过示范');
    }
    return;
  }
  const entries=await page.evaluate(target=>{
    const context=CanranCore.learningContext,saved=JSON.parse(localStorage.getItem(context.progress.learningKey));
    return Object.entries(context.questions).flatMap(([activity,questions])=>questions.flatMap((q,index)=>
      q.target===target&&saved.records[q.id] ? [{activity,index,example:Boolean(saved.records[q.id].revealed)}] : []));
  },target);
  expect(entries,'每道原题都要有可核对的记录').toHaveLength(count);
  for(const {activity,index,example} of entries){
    expect(example).toBe(used);
    const group=book.locator('details.learning-record-group[data-activity="'+activity+'"]');
    if(!await group.evaluate(el=>el.open))await group.locator(':scope > summary').click();
    const row=group.locator('li details > summary').filter({hasText:new RegExp('^第 '+(index+1)+' 题(?:\\D|$)')});
    await expect(row).toBeVisible();
    await expect(row.getByText('看过示范',{exact:true})).toHaveCount(used?1:0);
  }
}
async function expectCorrectedCompletion(room){
  const card=room.locator('.completion-award');
  if(await room.page().locator('body[data-learning-shell]').count())await expect(card).toHaveText('已完成！再练一轮全对，可点亮星星。');
  else await expect(card).toContainText('本轮有过错答');
}
let reviewedWords;
async function courseWord(room,word){
  const target=room.getByRole('button',{name:word,exact:true});
  const journey=room.locator('#wordPageProgress');
  await expect(journey).toHaveText(/\d+\s*\/\s*\d+/);
  const [at,total]=(await journey.textContent()).split('/').map(Number);
  const previous=courseButton(room,'previousWords');
  for(let index=at;index>1;index--)await previous.click();
  for(let index=1;index<=total;index++){
    await expect(journey).toHaveText(index+' / '+total);
    if(await target.isVisible())return target;
    if(index<total)await courseButton(room,'nextWords').click();
  }
  throw Error('未能在 '+room.page().url()+' 的词卡中找到 '+word);
}
async function expectVocabulary(page,displayed,original){
  if(!await page.locator('body[data-learning-shell]').count()){
    expect(displayed).toEqual(original);return;
  }
  const id=new URL(page.url()).pathname.match(/\/(unit\d+-\d+)\//)[1];
  reviewedWords??=require('../../scripts/prepare-word-decks').reviewedUnits(process.cwd());
  const classification=reviewedWords[id];
  const ordered=['illustration','context'].flatMap(kind=>original.filter(word=>classification[word]?.kind===kind));
  expect(ordered).toHaveLength(original.length);
  expect(displayed).toEqual(ordered);
}
async function expectLessonAfterPreviousRecord(page,legacyCount){
  const view=page.locator('#wordPageProgress');
  const [oldPage,chapterCount]=legacyCount.split('/').map(Number);
  const root=new URL(page.url()),name=root.pathname.match(/\/(unit\d+-\d+)\//)?.[1];
  if(!name||!await page.locator('body[data-learning-shell]').count()){
    await expect(view).toHaveText(legacyCount);return;
  }
  const course=require('../../server/progress').definition(process.cwd(),name,'/');
  const words=course.learning.WORDS.map(word=>word.en),end=words[(oldPage-1)*6];
  expect(oldPage).toBeGreaterThan(0);expect(chapterCount).toBe(Math.ceil(words.length/6));
  const evidence=(reviewedWords??=require('../../scripts/prepare-word-decks').reviewedUnits(process.cwd()))[name];
  const expected=['illustration','context'].flatMap(type=>words.filter(word=>evidence[word].kind===type));
  await expect(view).toHaveText((Math.floor(expected.indexOf(end)/6)+1)+' / '+chapterCount);
  await expect(page.locator('.unit-word').filter({has:page.getByText(end,{exact:true})})).toHaveCount(1);
}
// Older results show submissions. The new result shows question counts, while
// the saved round still has to account for every accepted and rejected attempt.
async function expectRoundCounts(numbers,expected){
  const stats=numbers.first().locator('xpath=ancestor::ul[contains(@class,"completion-stats")][1]');
  await expect(stats).toBeAttached();
  if(await stats.getAttribute('data-statistics-version')!=='questions-v1'){
    await expect(numbers).toHaveText(expected);return;
  }
  const raw=await stats.evaluate(el=>{
    const context=CanranCore.learningContext,room=el.closest('.shop-stage');
    const runner=el.closest('[id$="-practice"]');
    const stage=room.id.split('/').at(-1),notebook=JSON.parse(localStorage.getItem(context.progress.learningKey));
    const ids=context.questions[stage].map(q=>q.id).join('|');
    const groups=Object.entries(notebook.groups).filter(([key,round])=>
      (key===runner.id||key.startsWith(runner.id+'/'))&&round.signature===ids&&round.index===round.states.length);
    const round=groups.find(([key])=>key===runner.id+'/'+context.taskSessions?.[stage])?.[1]??(groups.length===1?groups[0][1]:null);
    if(!round)throw Error('No unambiguous completed round for '+stage);
    let best=0,streak=0,wrong=0,corrected=0;
    for(const state of round.states){
      if(!state.checked||!state.correct||!Number.isInteger(state.attempts)||state.attempts<1)throw Error('Incomplete submission evidence');
      if(state.attempts>1){wrong+=state.attempts-1;corrected++;streak=0;}
      best=Math.max(best,++streak);
    }
    return {best,solved:round.states.length,wrong,corrected};
  });
  expect([raw.best,raw.solved,raw.wrong].map(String)).toEqual(expected);
  await expect(stats.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);
  await expect(numbers).toHaveText([String(raw.best),String(raw.solved-raw.corrected),String(raw.corrected)]);
}
async function expectNoVerdict(feedback){
  const expected=await feedback.evaluate(el=>{
    const room=el.closest('.shop-stage'),first=room?.querySelector('.progress-copy')?.textContent.match(/第\s*(\d+)/)?.[1]==='1';
    if(!document.body.hasAttribute('data-learning-shell')||!first)return '';
    const context=globalThis.CanranCore.learningContext,runner=el.closest('[id$="-practice"]');
    const saved=JSON.parse(localStorage.getItem(context.progress.learningKey)||'{}');
    const session=context.taskSessions?.[room.id.split('/').pop()];
    const active=saved.groups?.[runner.id+'/'+(session||'v1')]||saved.groups?.[runner.id];
    return active?.states?.[0]?.attempts?'':'本组每题一次答对，可点亮一颗星。';
  });
  await expect(feedback).toHaveText(expected);
}
async function withReadingMaterial(room,selector,inspect){
  const original=room.locator(selector).first();
  await expect(original).toBeAttached();
  if(await original.isVisible())return inspect(room);
  const title=await original.evaluate(el=>el.closest('details')?.querySelector('summary')?.textContent);
  expect(title,'折叠的阅读材料需要可打开的入口').toBeTruthy();
  const trigger=room.getByRole('button',{name:title==='题目材料'?'查看题目材料':'查看情境：'+title,exact:true});
  await trigger.click();
  const sheet=room.page().getByRole('dialog',{name:title,exact:true});
  try{
    await expect(sheet.locator(selector).first()).toBeVisible();
    return await inspect(sheet);
  }finally{
    await sheet.getByRole('button',{name:'关闭学习参考',exact:true}).click();
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  }
}
async function withQuestionMaterial(room,inspect){
  const selector='img.practice-scene',original=room.locator(selector);
  await expect(original).toBeAttached();
  const trigger=room.getByRole('button',{name:'查看题目材料',exact:true});
  if(!await trigger.isVisible()){
    await expect(original).toBeVisible();
    return inspect(room,original);
  }
  await trigger.click();
  const sheet=room.page().getByRole('dialog',{name:'题目材料',exact:true});
  const image=sheet.locator('img.learning-material-image, img.practice-scene');
  try{
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src',await original.getAttribute('src'));
    await expect(image).toHaveAttribute('alt',await original.getAttribute('alt'));
    return await inspect(sheet,image);
  }finally{
    await sheet.getByRole('button',{name:'关闭学习参考',exact:true}).click();
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  }
}
async function expectMobileStageNavigation(page){
  const current=await page.locator('body[data-learning-shell]').count();
  const links=current?page.locator('.learning-milestones a'):page.locator('.chapter-select select');
  await expect(links).toHaveCount(current?5:1);
  for(const link of await links.all()){
    await expect(link).toBeVisible();
    expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
}
module.exports={courseButton,readyCourse,restoredPracticeIndex,finishStoryAndReturn,expectResultIcons,expectCompletionDestination,incorrectFeedback,courseToolbar,courseTimeline,courseWord,expectLessonAfterPreviousRecord,openLearningRecord,openCourseReference,courseReference,expectRecordExample,expectCorrectedCompletion,expectVocabulary,expectRoundCounts,expectNoVerdict,withQuestionMaterial,withReadingMaterial,expectMobileStageNavigation};
