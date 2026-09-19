'use strict';
const {test,expect}=require('@playwright/test');
const {subjectAnswers,submitSubject}=require('../support/l49-subject-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});

for(const corruption of ['非布尔的已检查标记','别轮答案','跳过前题的答案','提前完成'])test(`草稿防护：${corruption}不能自动代答`,async({page})=>{
  await page.addInitScript(corruption=>{
    const answer={runId:'sample-run',questionId:'S01',appearanceId:'sample-appearance',phase:'base',
      selection:'第三人称单数',checked:true,hintUsed:false,ruleUsed:false,correct:true};
    const draft={version:'l49-subjects-v1.10-four-categories',runId:'sample-run',usage:[],done:false,
      current:{...answer},submissions:[{...answer}]};
    if(corruption==='非布尔的已检查标记'){draft.current.checked='true';draft.submissions[0].checked='true';}
    if(corruption==='别轮答案'){draft.current.runId='other-run';draft.submissions[0].runId='other-run';}
    if(corruption==='跳过前题的答案'){draft.current.questionId='S03';draft.submissions[0].questionId='S03';}
    if(corruption==='提前完成')draft.done=true;
    localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{subjectRound:draft}}));
  },corruption);
  await page.goto('/lesson49/#learn/subjects');
  const stage=page.locator('.stage-subjects');
  await expect(stage.locator('#tpProg')).toHaveText('第 1 / 12 题');
  await expect(stage.getByRole('status')).toBeEmpty();
  await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(stage.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(stage.getByRole('button',{name:/^下一站：/})).toBeHidden();
});

test('键盘检查不跳动，Enter 换题后新主语与进度可见',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/lesson49/#learn/subjects');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-subjects');
  await stage.getByRole('button',{name:'第三人称单数',exact:true}).press('Space');
  const check=stage.getByRole('button',{name:'检查答案',exact:true});
  await check.scrollIntoViewIfNeeded();
  const scroll=await page.evaluate(()=>scrollY);
  await check.press('Enter');
  await expect(stage.getByRole('button',{name:'继续',exact:true})).toBeFocused();
  expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  await page.keyboard.press('Enter');
  await expect(stage.locator('#tpProg')).toHaveText('第 2 / 12 题');
  await expect.poll(async()=>{
    const subject=await stage.locator('#tpItemText').boundingBox(),bar=await page.locator('#topbar').boundingBox();
    const progress=await stage.locator('#tpProg').boundingBox();
    return progress.y>=bar.y+bar.height && subject.y+subject.height<=page.viewportSize().height;
  }).toBe(true);
});

for(const width of [320,768,1280])test(`${width} 宽度分拣四格与结束操作不溢出，手机主次按钮同宽`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/lesson49/#learn/subjects');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-subjects');
  const choices=stage.getByRole('group',{name:'选择主语类别',exact:true});
  for(let i=0;i<12;i++){
    const boxes=await choices.getByRole('button').evaluateAll(buttons=>buttons.map(button=>{
      const r=button.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,overflow:button.scrollWidth>button.clientWidth};
    }));
    expect(boxes[0].y).toBe(boxes[1].y);expect(boxes[2].y).toBe(boxes[3].y);
    expect(boxes[0].x).toBe(boxes[2].x);expect(boxes[1].x).toBe(boxes[3].x);
    expect(boxes.every(box=>box.width===boxes[0].width&&box.height===boxes[0].height&&!box.overflow)).toBe(true);
    for(const box of boxes){expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);}
    if(i===1)await stage.screenshot({path:`output/playwright/l49-v110-long-${width}.png`,style:'#topbar{visibility:hidden!important}'});
    await submitSubject(stage,subjectAnswers[i]);
  }
  const main=await stage.getByRole('button',{name:'下一站：动词换装间',exact:true}).boundingBox();
  const secondary=await stage.getByRole('button',{name:'再练一轮',exact:true}).boundingBox();
  if(width===320){expect(main.width).toBe(secondary.width);expect(main.y+main.height).toBeLessThan(secondary.y);}
  else{expect(main.y).toBe(secondary.y);expect(secondary.x+secondary.width).toBeLessThan(main.x);}
  await stage.screenshot({path:`output/playwright/l49-v110-finish-${width}.png`,style:'#topbar{visibility:hidden!important}'});
});

test('订单听辨真实播放到结束才允许检查，实际请求的是 a pound of mince 录音',async({page})=>{
  await page.goto('/lesson49/#learn/exam');await page.locator('#quizStartBtn').click();
  const stage=page.locator('.stage-exam');
  await stage.locator('.practice-options').getByRole('button',{name:'mince',exact:true}).click();
  const check=stage.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeDisabled();
  const response=page.waitForResponse(response=>response.url().endsWith('/lesson49/audio/a_pound_of_mince.mp3'));
  await stage.getByRole('button',{name:'听一遍',exact:true}).click();
  expect((await response).ok()).toBe(true);
  const replay=stage.getByRole('button',{name:'再听一遍',exact:true});
  await expect(replay).toHaveAttribute('aria-busy','true');
  await expect(check).toBeDisabled();
  await expect(replay).toHaveAttribute('aria-busy','false',{timeout:10000});
  await expect(check).toBeEnabled();
  await check.click();await expect(stage.getByRole('status')).toHaveText('答对了！');
});

test('320 窄屏长误选反馈不裁掉开头或结尾',async({page})=>{
  await page.setViewportSize({width:320,height:844});
  await page.goto('/lesson49/#learn/subjects');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-subjects');
  for(let i=0;i<12;i++){
    await submitSubject(stage,i===2?'第三人称复数':'第一人称',false);
    const note=await stage.locator('.practice-answer-note').boundingBox();
    const feedback=await stage.getByRole('status').boundingBox();
    expect(feedback.y).toBeGreaterThanOrEqual(note.y);
    expect(feedback.y+feedback.height).toBeLessThanOrEqual(note.y+note.height);
    await stage.getByRole('button',{name:'继续',exact:true}).click();
  }
});
