'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
const categories=['第一人称','第二人称','第三人称单数','第三人称复数'];
// Independently transcribed from the approved manuscript, never read from the catalog.
const expectedQuestions=require('../fixtures/l49-subject-v110-expected.json');
for(let category=0;category<4;category++)test(`逐题复核 ${categories[category]}：答错不泄题，原题改对后才能推进`,async({page})=>{
  await page.goto('/lesson49/#learn/subjects');const stage=page.locator('.stage-subjects');
  for(let i=0;i<12;i++){
    const expected=expectedQuestions[i];await expect(stage.locator('#tpItemText')).toHaveText(expected.subject);
    await answerSubject(stage,categories[category]);const correct=expected.answer===categories[category];
    await expect(stage.getByRole('status')).toHaveText(correct?'答对了！':'再看看，试一次。');
    if(!correct){await stage.getByRole('button',{name:'再试一次',exact:true}).click();await answerSubject(stage,expected.answer);}
    await stage.getByRole('button',{name:i===11?'完成':'继续',exact:true}).click();
  }
  const first=expectedQuestions.filter(q=>q.answer===categories[category]).length;
  await expect(stage).toContainText('基础题首次答对 '+first+' / 12');
});

test('全题首答错误后逐题重试，刷新保留首次结果与提交次数',async({page})=>{
  await page.goto('/lesson49/#learn/subjects');const stage=page.locator('.stage-subjects');
  for(let i=0;i<12;i++){
    await expect(stage.locator('#tpItemText')).toHaveText(subjects[i]);
    await answerSubject(stage,answers[i]==='第一人称'?'第二人称':'第一人称');
    if(i===3)await page.reload();
    await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
    await stage.getByRole('button',{name:'再试一次',exact:true}).click();await answerSubject(stage,answers[i]);
    await stage.getByRole('button',{name:i===11?'完成':'继续',exact:true}).click();
  }
  await expect(stage).toContainText('基础题首次答对 0 / 12');await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord').getByRole('listitem')).toHaveCount(12);
  for(const item of await page.locator('#learningRecord').getByRole('listitem').all()){
    await expect(item).toContainText('修正后完成');await expect(item).toContainText('首次未答对');await expect(item).toContainText('提交 2 次');
  }
});

test('连续错答不解锁下一题，双击重试或检查不跳题',async({page})=>{
  await page.goto('/lesson49/#learn/subjects');const stage=page.locator('.stage-subjects');
  for(const wrong of ['第一人称','第二人称']){
    await stage.getByRole('button',{name:wrong,exact:true}).click();await stage.getByRole('button',{name:'检查答案',exact:true}).dblclick();
    await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
    await stage.getByRole('button',{name:'再试一次',exact:true}).dblclick();await expect(stage.locator('#tpItemText')).toHaveText('Mrs. Bird');
    await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  }
  await answerSubject(stage,'第三人称单数');await stage.getByRole('button',{name:'继续',exact:true}).dblclick();
  await expect(stage.locator('#tpItemText')).toHaveText('Mrs. Bird and her husband');
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();await expect(page.locator('#learningRecord')).toContainText('提交 3 次');
});

test('分拣四类别：必须手动选择和检查，重试及下一题均清空选择',async({page})=>{
  await page.goto('/lesson49/#learn/subjects');const stage=page.locator('.stage-subjects');
  const options=stage.getByRole('group',{name:'选择主语类别',exact:true}),check=stage.getByRole('button',{name:'检查答案',exact:true});
  await expect(options.getByRole('button')).toHaveText(categories);await expect(check).toBeDisabled();
  await options.getByRole('button',{name:'第一人称',exact:true}).click();await expect(stage.getByRole('status')).toBeEmpty();await check.click();
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');await stage.getByRole('button',{name:'再试一次',exact:true}).click();
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);await expect(check).toBeDisabled();
  await answerSubject(stage,'第三人称单数');await stage.getByRole('button',{name:'继续',exact:true}).click();
  await expect(stage.locator('#tpProg')).toHaveText('第 2 / 12 题');await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(check).toBeDisabled();await expect(stage.getByRole('status')).toBeEmpty();
});

const subjects=['Mrs. Bird','Mrs. Bird and her husband','her husband','the butcher','I','you','this book','these books','we','his dogs','his dog','they'];
const answers=['第三人称单数','第三人称复数','第三人称单数','第三人称单数','第一人称','第二人称','第三人称单数','第三人称复数','第一人称','第三人称复数','第三人称单数','第三人称复数'];
test('12 张关系图均可见；390 窄屏中提示、反馈、长题目和完成按钮保持稳定',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/lesson49/#learn/subjects');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-subjects');
  const choices=stage.getByRole('group',{name:'选择主语类别',exact:true});
  const position=()=>choices.evaluate(node=>({top:node.getBoundingClientRect().top+scrollY,width:node.getBoundingClientRect().width}));
  const before=await position();
  for(let i=0;i<12;i++){
    const img=stage.locator('.subject-scene img');
    await expect(img).toBeVisible();
    await expect.poll(()=>img.evaluate(node=>node.complete&&node.naturalWidth>0)).toBe(true);
    await expect(img).toHaveAttribute('alt',/\S/);
    if(i===4)await expect(stage.locator('.subject-context')).toHaveText('老板说 I');
    if(i===5)await expect(stage.locator('.subject-context')).toHaveText('老板对伯德夫人说 you');
    if(i===8)await expect(stage.locator('.subject-context')).toHaveText('伯德夫人说 we');
    if(i===11)await expect(stage.locator('.subject-context')).toHaveText('they → Mrs. Bird and her husband');
    await stage.getByRole('button',{name:'给点线索',exact:true}).click();
    await answerSubject(stage,answers[i]);
    const after=await position();
    expect(Math.abs(after.top-before.top)).toBeLessThanOrEqual(2);
    expect(after.width).toBe(before.width);
    await stage.screenshot({path:`output/playwright/l49-v110-subject-${i+1}-390.png`,style:'#topbar{visibility:hidden!important}'});
    await stage.getByRole('button',{name:i===11?'完成':'继续',exact:true}).click();
  }
  await expect(stage).toContainText('基础题首次答对 12 / 12');
  const primary=await stage.getByRole('button',{name:'下一站：动词换装间',exact:true}).boundingBox();
  const secondary=await stage.getByRole('button',{name:'再练一轮',exact:true}).boundingBox();
  expect(primary.width).toBe(secondary.width);
  expect(primary.y+primary.height).toBeLessThan(secondary.y);
});
async function answerSubject(stage,answer) {
  await stage.getByRole('group',{name:'选择主语类别',exact:true}).getByRole('button',{name:answer,exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
}

async function choosePractice(stage,answer,next=true){
  if(Array.isArray(answer))for(const token of answer)await stage.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
  else await stage.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
  if(next)await stage.getByRole('button',{name:/^(下一题|完成这一站|查看本次记录)$/}).click();
}
test('同批文案：按原文、句子结构和真实交接状态解释，不作超出证据的判断',async({page})=>{
  test.setTimeout(90000);
  await page.addInitScript(()=>{
    if(!localStorage.getItem('l49-stars-v1'))localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    window.Audio=class extends EventTarget{
      constructor(src){super();this.src=src;this.currentTime=0;this.paused=true;}
      play(){this.paused=false;queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}
      pause(){this.paused=true;}
    };
  });
  await page.goto('/lesson49/#learn/doare');
  let stage=page.locator('.stage-doare');
  await stage.getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('Do you live here?');
  await expect(page.getByRole('dialog')).not.toContainText('地点用 Are');
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  const pairs=[
    ['Do you like meat?','本句用动词 like 表达喜好'],['Are you a teacher?','本句用 be 连接 you 和 a teacher'],
    ['Are you busy?','本句用 be 连接 you 和 busy'],['Are you at home?','本句用 be 表达“在家”'],
    ['Do you want beef?','本句用动词 want 表达需求'],['Do you sleep well?','本句用动词 sleep 表达平时睡觉的情况'],
    ['Do you make the bed?','make the bed 表示整理床铺'],['Do you put on your coat?','put on your coat 表示穿上外套']
  ];
  const wrongQuestions=['Are you like meat?','Do you a teacher?','Do you busy?','Do you at home?','Are you want beef?','Are you sleep well?','Are you make the bed?','Are you put on your coat?'];
  for(const [index,[answer,reason]]of pairs.entries()){
    await choosePractice(stage,wrongQuestions[index],false);
    await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
    await stage.getByRole('button',{name:'再试一次',exact:true}).click();
    await choosePractice(stage,answer);
  }
  await page.goto('/lesson49/#learn/fill');stage=page.locator('.stage-fill');
  await stage.getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('一般现在时');
  await expect(page.getByRole('dialog')).toContainText('I am');
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  for(const answer of ['likes','like','watches','goes','loves','walk'])await choosePractice(stage,answer);
  await choosePractice(stage,'drinks',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await page.goto('/lesson49/#learn/pouch');stage=page.locator('.stage-pouch');
  await expect(stage).toContainText('课文中，老板用哪个开头说出自己不喜欢鸡肉？');
  await choosePractice(stage,'Yeah',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await page.goto('/lesson49/#learn/words');
  await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.locator('.fcard').filter({has:page.getByText('chicken',{exact:true})}).click();
  await expect(page.locator('.fcard').filter({has:page.getByText('chicken',{exact:true})})).toContainText('课文中的 a chicken：一只整鸡。');
  await page.goto('/lesson49/#learn/give');stage=page.locator('.stage-give');
  for(const answer of ['Mrs. Bird','that piece','Give that piece to me, please.',['Give','that piece','to','me,','please.']])await choosePractice(stage,answer);
  await stage.getByRole('button',{name:'给点线索',exact:true}).click();
  await expect(stage.locator('.practice-hint')).toHaveText('找 to 后面的人名。');
  await expect(stage).not.toContainText('牛排交给 Tom 了。');
  await choosePractice(stage,'Lily',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(stage).not.toContainText('牛排交给 Tom 了。');
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();await choosePractice(stage,'Tom',false);
  await expect(stage.getByRole('img',{name:'已送给 Tom 的肉品'})).toBeVisible();
  await expect(stage.locator('.delivery-success')).toHaveText('牛排交给 Tom 了。');
  await page.goto('/lesson49/#learn/exam');await page.locator('#quizStartBtn').click();stage=page.locator('.stage-exam');
  await expect(stage).toContainText('听订单，选出录音里出现的单词。');
  await stage.getByRole('button',{name:'听一遍',exact:true}).click();await choosePractice(stage,'mince',false);
  await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(stage.getByText('看看原因',{exact:true})).toHaveCount(0);
  await stage.getByRole('button',{name:'下一题',exact:true}).click();
  await choosePractice(stage,'Mrs. Bird: steak · husband: lamb',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(stage).not.toContainText('两人都不喜欢 chicken');
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();await choosePractice(stage,'Mrs. Bird: lamb · husband: steak');
  await choosePractice(stage,'Do you a student?',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();await choosePractice(stage,'Are you a student?');
  await choosePractice(stage,'Do you want chicken?');await choosePractice(stage,['Give','the beef','to','Lily,','please.']);
  await stage.getByRole('button',{name:'继续第二段（5 题）',exact:true}).click();
  await stage.getByRole('button',{name:'给点线索',exact:true}).click();await expect(stage.locator('.practice-hint')).toHaveText('找 to 后面的人名。');
  await choosePractice(stage,'Tom',false);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(stage).not.toContainText('这块肉交给 Sam 了。');
  await stage.getByRole('button',{name:'再试一次',exact:true}).click();await choosePractice(stage,'Sam',false);
  await expect(stage.locator('.delivery-success')).toHaveText('这块肉交给 Sam 了。');
});
test('刷新保留本题选择、反馈和分开的辅助记录；旧题草稿及星星不能代答',async({page})=>{
  await page.addInitScript(()=>{
    if(sessionStorage.getItem('subject-legacy'))return;
    localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{old:{target:'旧记录',prompt:'Lucy',attempts:1,firstCorrect:true,correct:true}},activity:{subjectRound:{round:0,i:6,done:true,waiting:false,answers:[true,true,true,true,true,true]},wordPage:2,wordPageSize:6}}));
    sessionStorage.setItem('subject-legacy','yes');
  });
  await page.goto('/lesson49/#learn/subjects');
  let stage=page.locator('.stage-subjects');
  await expect(stage.locator('#tpProg')).toHaveText('第 1 / 12 题');
  await stage.getByRole('button',{name:'第一人称',exact:true}).click();
  await page.reload();
  await expect(stage.getByRole('button',{name:'第一人称',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(stage.getByRole('status')).toBeEmpty();
  await stage.getByRole('button',{name:'给点线索',exact:true}).click();
  await expect(stage.locator('.practice-hint')).toHaveText('伯德夫人。');
  await stage.getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('分别为单数／复数');
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  await stage.getByRole('button',{name:'第三人称单数',exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
  await page.reload();
  await expect(stage.getByRole('status')).toContainText('答对了');
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('旧记录');
  await expect(page.locator('#learningRecord')).toContainText('首次答对，额外提示已用，查看规则已用，提交 1 次');
  await page.getByRole('dialog',{name:'学徒手记'}).getByRole('button',{name:'关闭',exact:true}).click();
  await stage.getByRole('button',{name:'继续',exact:true}).click();
  await expect(stage.locator('#tpProg')).toHaveText('第 2 / 12 题');
  await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await page.reload();
  await expect(stage.locator('#tpProg')).toHaveText('第 2 / 12 题');
  await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');
  await expect(page.locator('#starCount')).toHaveText('15');
});
test('末题答错须原题重试，改对后手动完成且保留首次分数',async({page})=>{
  await page.goto('/lesson49/#learn/subjects');const stage=page.locator('.stage-subjects');
  for(let i=0;i<11;i++){await answerSubject(stage,answers[i]);await stage.getByRole('button',{name:'继续',exact:true}).click();}
  await answerSubject(stage,'第一人称');await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(stage.getByRole('button',{name:'完成',exact:true})).toBeHidden();
  await page.reload();await stage.getByRole('button',{name:'再试一次',exact:true}).click();await expect(stage.locator('#tpItemText')).toHaveText('they');
  await answerSubject(stage,'第三人称复数');await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(stage.getByRole('button',{name:/^下一站：/})).toBeHidden();await stage.getByRole('button',{name:'完成',exact:true}).click();
  await expect(stage).toContainText('基础题首次答对 11 / 12');
  await expect(stage.getByRole('button',{name:'下一站：动词换装间',exact:true})).toBeVisible();
  await stage.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(stage.locator('#tpProg')).toHaveText('第 1 / 12 题');
  await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
