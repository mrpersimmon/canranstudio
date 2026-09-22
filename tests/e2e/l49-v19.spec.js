'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});

async function capture(page,stage,name){
  const viewport=page.viewportSize();
  await page.setViewportSize({width:viewport.width,height:1600});
  await stage.screenshot({path:`output/playwright/l49-v19-${name}-${viewport.width}.png`,style:'#topbar{visibility:hidden!important} :focus{outline:none!important}'});
  await page.setViewportSize(viewport);
}
const documentTop=locator=>locator.evaluate(node=>node.getBoundingClientRect().top+scrollY);

test('拼句使用紧凑词块，选中后原位留空，点击句中词块直接撤回',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/lesson49/#learn/trans');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-trans'),bank=stage.getByRole('group',{name:'待选词块',exact:true});
  const answer=stage.getByRole('group',{name:'已选词块',exact:true});
  const check=stage.getByRole('button',{name:'检查答案',exact:true});
  await capture(page,stage,process.env.L49_ASSEMBLY_PASS==='before'?'before':'tokens');
  const initialBoxes=await bank.getByRole('button').evaluateAll(nodes=>nodes.map(n=>({name:n.getAttribute('aria-label')||n.textContent,x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width})));
  const bankBox=await bank.boundingBox();
  expect(initialBoxes.every(box=>box.width<bankBox.width*.7)).toBe(true);
  expect(new Set(initialBoxes.map(box=>box.y)).size).toBeLessThan(initialBoxes.length);
  await expect(stage.getByRole('button',{name:'撤回最后一个',exact:true})).toHaveCount(0);
  const before={bank:await documentTop(bank),check:await documentTop(check)};
  const she=bank.getByRole('button',{name:'She',exact:true});
  await she.focus();const scroll=await page.evaluate(()=>scrollY);
  await she.press('Enter');
  await expect(she).toBeDisabled();await expect(she).toHaveCSS('color','rgba(0, 0, 0, 0)');
  const remove=answer.getByRole('button',{name:'撤回 She',exact:true});
  await expect(remove).toBeVisible();await expect(remove).toContainText('×');
  expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  expect(await documentTop(bank)).toBe(before.bank);expect(await documentTop(check)).toBe(before.check);
  await capture(page,stage,'selected');
  await remove.press('Space');
  await expect(answer.getByRole('button')).toHaveCount(0);await expect(she).toBeEnabled();
  await expect(check).toBeDisabled();
  expect(await documentTop(bank)).toBe(before.bank);expect(await documentTop(check)).toBe(before.check);
  const restored=await bank.getByRole('button').evaluateAll(nodes=>nodes.map(n=>({name:n.getAttribute('aria-label')||n.textContent,x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width})));
  expect(restored.map(({y,...box})=>box)).toEqual(initialBoxes.map(({y,...box})=>box));
});

test('词块未拼完整时不能检查，撤回后重新等待完整句子，末题仍需手动完成',async({page})=>{
  await page.goto('/lesson49/#learn/trans');
  const stage=page.locator('.stage-trans'),bank=stage.getByRole('group',{name:'待选词块',exact:true});
  const answer=stage.getByRole('group',{name:'已选词块',exact:true}),check=stage.getByRole('button',{name:'检查答案',exact:true});
  for(const text of ['likes','She']){
    await bank.getByRole('button',{name:text,exact:true}).click();await expect(check).toBeDisabled();
  }
  await bank.getByRole('button',{name:'peaches.',exact:true}).click();await expect(check).toBeEnabled();
  await check.click();await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  for(const token of await answer.getByRole('button').all())await expect(token).toBeDisabled();
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();await expect(answer.getByRole('button')).toHaveCount(0);
  await expect(check).toBeDisabled();
  for(const text of ['She','likes','peaches.'])await bank.getByRole('button',{name:text,exact:true}).click();
  await answer.getByRole('button',{name:'撤回 likes',exact:true}).click();await expect(check).toBeDisabled();
  await answer.getByRole('button',{name:'撤回 peaches.',exact:true}).click();
  for(const text of ['likes','peaches.'])await bank.getByRole('button',{name:text,exact:true}).click();
  await check.click();await expect(stage.getByRole('status')).toHaveText('答对了！');
  await stage.getByRole('button',{name:'下一题',exact:true}).click();await expect(check).toBeDisabled();
  for(const text of ['He','wants','a car.'])await bank.getByRole('button',{name:text,exact:true}).click();
  await check.click();await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(stage.getByRole('button',{name:'下一站：老板的挑战',exact:true})).toBeHidden();
  await stage.getByRole('button',{name:'完成这一站',exact:true}).click();await expect(stage.getByRole('button',{name:'再练一轮',exact:true})).toBeVisible();
  await stage.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(check).toBeDisabled();await expect(answer.getByRole('button')).toHaveCount(0);
});

test('刷新与重试保留候选词块原位置，未完成草稿仍由孩子拼完整',async({page})=>{
  await page.addInitScript(()=>{
    const visits=Number(sessionStorage.getItem('l49-v19-visits')||0);
    sessionStorage.setItem('l49-v19-visits',String(visits+1));
    // Deliberately vary the random boundary across reloads to expose reshuffling.
    Math.random=()=>visits%2?.999:0;
  });
  await page.goto('/lesson49/#learn/trans');
  const stage=page.locator('.stage-trans'),bank=stage.getByRole('group',{name:'待选词块',exact:true});
  const answer=stage.getByRole('group',{name:'已选词块',exact:true}),check=stage.getByRole('button',{name:'检查答案',exact:true});
  const order=()=>bank.getByRole('button').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-label')));
  const initial=await order();
  await bank.getByRole('button',{name:'She',exact:true}).click();
  await page.reload();expect(await order()).toEqual(initial);
  await expect(answer.getByRole('button',{name:'撤回 She',exact:true})).toBeVisible();await expect(check).toBeDisabled();
  await bank.getByRole('button',{name:'peaches.',exact:true}).click();await bank.getByRole('button',{name:'likes',exact:true}).click();
  await check.click();await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();expect(await order()).toEqual(initial);
  await expect(answer.getByRole('button')).toHaveCount(0);
});

async function prepare(page){
  await page.addInitScript(()=>{
    if(!localStorage.getItem('canran:l49:learning:v1')){
      localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{fullDialogue:true}}));
      localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    }
    window.Audio=class extends EventTarget{
      constructor(src){super();this.src=src;this.paused=true;this.currentTime=0;}
      play(){this.paused=false;queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}
      pause(){this.paused=true;}
    };
  });
}
async function advance(stage,text){
  const audio=stage.getByRole('button',{name:'听一遍',exact:true});if(await audio.isVisible())await audio.click();
  await stage.locator('.practice-options').getByRole('button',{name:text,exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(stage.locator('.practice-actions').getByRole('status')).toHaveText('答对了！');
  await stage.getByRole('button',{name:/^(下一题|完成这一站)$/}).click();
}
for(const width of [320,600,768,1280])test(`${width} 宽度全部五道拼句：乱序也不裁切词块，选词及正误反馈不推移操作区`,async({page})=>{
  test.setTimeout(90000);await prepare(page);await page.setViewportSize({width,height:900});
  const activities=[
    ['trans',[[],[]],[['She','likes','peaches.'],['He','wants','a car.']]],
    ['give',[['Mrs. Bird','that piece','Give that piece to me, please.'],['Tom']],[['Give','that piece','to','me,','please.'],['Show','your ticket','to','Lily,','please.']]],
    ['exam',[['mince','Mrs. Bird: lamb · husband: steak','Are you a student?','Do you want chicken?']],[['Give','the beef','to','Lily,','please.']]]
  ];
  for(const [id,leads,answers] of activities){
    await page.goto(`/lesson49/#learn/${id}`);await page.evaluate(()=>document.fonts.ready);
    const stage=page.locator(`.stage-${id}`);if(id==='exam')await page.locator('#quizStartBtn').click();
    for(let i=0;i<answers.length;i++){
      for(const text of leads[i])await advance(stage,text);
      const bank=stage.getByRole('group',{name:'待选词块',exact:true}),answer=stage.getByRole('group',{name:'已选词块',exact:true});
      const check=stage.getByRole('button',{name:'检查答案',exact:true});
      const before={bank:await documentTop(bank),answer:await documentTop(answer),check:await documentTop(check)};
      const phrase=answers[i],wrong=phrase.length===3?[phrase[1],phrase[0],phrase[2]]:[phrase[4],phrase[0],phrase[1],phrase[3],phrase[2]];
      for(const text of wrong)await bank.getByRole('button',{name:text,exact:true}).click();
      expect(await documentTop(bank)).toBe(before.bank);expect(await documentTop(check)).toBe(before.check);
      expect(await answer.evaluate(node=>node.scrollHeight<=node.clientHeight)).toBe(true);
      for(const tile of await answer.getByRole('button').all()){
        expect(await tile.evaluate(node=>node.scrollWidth<=node.clientWidth)).toBe(true);
        const box=await tile.boundingBox(),area=await answer.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(area.x);expect(box.x+box.width).toBeLessThanOrEqual(area.x+area.width);
      }
      if(i===0)await capture(page,stage,`${id}-assembled`);
      await check.scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);
      await check.press('Enter');await expect(stage.locator('.practice-actions').getByRole('status')).toHaveText('再看看，试一次。');
      expect(await page.evaluate(()=>scrollY)).toBe(scroll);
      const retry=stage.getByRole('button',{name:'再试一次',exact:true});expect(await documentTop(retry)).toBe(before.check);
      await retry.press('Enter');expect(await documentTop(bank)).toBe(before.bank);
      for(const text of phrase)await bank.getByRole('button',{name:text,exact:true}).click();
      await check.click();await expect(stage.locator('.practice-actions').getByRole('status')).toHaveText('答对了！');
      const next=stage.getByRole('button',{name:/^(下一题|完成这一站)$/});expect(await documentTop(next)).toBe(before.check);
      await next.click();
    }
  }
});

test('v1.8 旧草稿保留已选词与提示记录，隐藏旧解析，历史成绩不代答',async({page})=>{
  await page.addInitScript(()=>{
    if(localStorage.getItem('canran:l49:learning:v1'))return;
    const runId='existing-v18-word-round';
    localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,activity:{},groups:{transList:{
      index:0,signature:'trans-peaches|trans-car',draftVersion:2,runId,
      states:[{selection:'She',tokens:[0],attempts:0,hintUsed:true,checked:false,runId,questionId:'trans-peaches'}]
    }},records:{'trans-car':{selection:'He wants a car.',tokens:[0,1,2],attempts:1,firstCorrect:true,checked:true,correct:true,hintUsed:false,target:'词块组织',prompt:'用词块表达：他想要一辆小汽车。'}}}));
    localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:0,l5:0}));
  });
  await page.goto('/lesson49/#learn/trans');
  const stage=page.locator('.stage-trans'),bank=stage.getByRole('group',{name:'待选词块',exact:true});
  const answer=stage.getByRole('group',{name:'已选词块',exact:true}),check=stage.getByRole('button',{name:'检查答案',exact:true});
  await expect(answer.getByRole('button',{name:'撤回 She',exact:true})).toBeVisible();
  await expect(stage.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  await expect(check).toBeDisabled();await expect(page.locator('#starCount')).toHaveText('9');
  await page.reload();await expect(answer.getByRole('button')).toHaveCount(1);await expect(check).toBeDisabled();
  for(const text of ['likes','peaches.'])await bank.getByRole('button',{name:text,exact:true}).click();
  await check.click();await stage.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(answer.getByRole('button')).toHaveCount(0);await expect(check).toBeDisabled();
  await expect(stage.getByRole('status')).toBeEmpty();await expect(page.locator('#starCount')).toHaveText('9');
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('提示后完成');
  await expect(page.locator('#learningRecord')).toContainText('他想要一辆小汽车');
});
