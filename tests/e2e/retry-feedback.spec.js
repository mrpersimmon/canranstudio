'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
test.use({reducedMotion:'reduce',actionTimeout:5000});

test('只改线索保留已完成活动，内容版本变化不能沿用完成记录',async({page})=>{
  const source=fs.readFileSync(path.join(__dirname,'../../unit1-2/content.js'),'utf8');
  await page.route('**/unit1-2/content.js*',route=>route.fulfill({contentType:'application/javascript',body:source.replace('这句话是在提问，还是在说明一件事？','从 Is 开始，再说 this 和 your。')}));
  await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans');
  const responses=[['Is','this','your','pen?'],['Yes,','it','is.'],['Thank','you','very','much.']];
  for(let i=0;i<responses.length;i++){
    for(const token of responses[i])await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
    await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:i===2?'完成这一站':'下一题',exact:true}).click();
  }
  await page.goto('/unit1-2/#cover');await expect(page.locator('#starCount')).toHaveText('1');
  await page.unroute('**/unit1-2/content.js*');await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
  // A changed question, unlike a hint edit, invalidates the old completion.
  await page.route('**/unit1-2/content.js*',route=>route.fulfill({contentType:'application/javascript',body:source.replace('用词块问：这是你的钢笔吗？','用词块问：这是你的书吗？')}));
  await page.reload();await expect(page.locator('#starCount')).toHaveText('0');
});

for(const advance of [false,true])test('旧分拣真实错答记录升级，已继续='+advance,async({page})=>{
  await page.route('**/core/lesson49-subjects.js*',route=>route.fulfill({path:path.join(__dirname,'../fixtures/l49-subjects-before-retry.js'),contentType:'application/javascript'}));
  await page.goto('/lesson49/#learn/subjects');const room=page.locator('.stage-subjects');
  await room.getByRole('button',{name:'第一人称',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  if(advance)await room.getByRole('button',{name:'继续',exact:true}).click();
  await page.unroute('**/core/lesson49-subjects.js*');await page.reload();
  await expect(room.locator('#tpItemText')).toHaveText(advance?'Mrs. Bird and her husband':'Mrs. Bird');
  if(advance){await room.getByRole('button',{name:'第一人称',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();}
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await page.reload();
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await expect(room.locator('#tpItemText')).toHaveText(advance?'Mrs. Bird and her husband':'Mrs. Bird');
  await room.getByRole('button',{name:advance?'第三人称复数':'第三人称单数',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();await expect(page.locator('#learningRecord')).toContainText('修正后完成');await expect(page.locator('#learningRecord')).toContainText('提交 2 次');
});

for(const [course,stage,right] of [['unit1-2','manners','Excuse me!'],['unit3-4','manners','This is not my umbrella.'],['unit5-6','refer','She'],['unit7-8','be','is / am'],['unit9-10','describe',"He's"],['unit11-12','owner','her'],['unit13-14','colours',"What colour's your hat?"],['unit49-50','needs',"She likes tomatoes, but she doesn't want any."],['lesson49','doare','Do you like meat?']]){
  test(course+' 选择题错答只提示重试，改选后正常推进',async({page})=>{
    await page.goto('/'+course+'/#learn/'+stage);const room=page.locator('.stage-'+stage);
    await room.locator('.practice-options button').filter({hasNotText:right}).first().click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    await expect(room.locator('.practice-options .good,.practice-options .correct')).toHaveCount(0);
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
    await room.getByRole('button',{name:right,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
  });
}

test('音标课答错只提示重试，原题改选可继续',async({page})=>{
  await page.goto('/soundmark/');await page.getByRole('button',{name:'拼读小达人',exact:true}).click();
  const expected={'/fɪʃ/':'fish','/bʊk/':'book','/kæt/':'cat','/bed/':'bed','/mu:n/':'moon','/mi:t/':'meat','/eg/':'egg','/hæt/':'hat','/gʊd/':'good','/si:/':'sea','/lʊk/':'look','/sæt/':'sat','/dɪd/':'did','/fli:/':'flee','/pɪn/':'pin','/let/':'let'};
  const prompt=await page.locator('#g3Ipa').innerText(),right=expected[prompt];expect(right).toBeTruthy();
  await page.locator('#g3Opts button').filter({hasNotText:right}).first().click();await expect(page.locator('#g3Fb')).toHaveText('再看看，试一次。');
  await expect(page.locator('#g3Ipa')).toHaveText(prompt);await expect(page.locator('#g3Opts .right')).toHaveCount(0);
  await page.locator('#g3Opts').getByRole('button',{name:right,exact:true}).click();await expect(page.locator('#g3Fb')).toContainText('拼读成功');
});

for(const [course,wrong,right] of [['lesson52','come','comes'],['lesson53','South','North'],['lesson54','sets','set']]){
  test(course+' 填空初始及错答均不把答案放在空格中，可连续重试',async({page})=>{
    await page.goto('/'+course+'/#w4');const card=page.locator('#magics .magic').first();const gap=card.locator('.gap').first();
    await expect(gap).toHaveText('___');
    const choices=course==='lesson54'?card.locator('.m-step').first():card;
    await choices.getByRole('button',{name:wrong,exact:true}).click();
    await expect(page.locator('#toast')).toHaveText('再看看，试一次。');await expect(gap).toHaveText('___');
    await expect(choices.getByRole('button',{name:wrong,exact:true})).not.toHaveClass(/off/);
    await choices.getByRole('button',{name:right,exact:true}).click();await expect(gap).toHaveText(right);
  });
}

test('Lesson50 考核答错不标亮答案，不自动翻题，原题可以改选',async({page})=>{
  test.setTimeout(60000);
  await page.goto('/lesson50/');await page.locator('#quizStartBtn').click();
  await page.locator('#quizOpts').getByRole('button',{name:'lettuce',exact:true}).click();
  await expect(page.locator('#quizFb')).toHaveText('再看看，试一次。');
  await expect(page.locator('#quizOpts .good')).toHaveCount(0);
  // This delay is the old automatic-advance window, not an arbitrary load wait.
  await page.waitForTimeout(1900);await expect(page.locator('#quizQ')).toContainText('卷心菜');
  await page.locator('#quizOpts').getByRole('button',{name:'cabbage',exact:true}).click();
  await expect(page.locator('#quizFb')).toContainText('答对');
  for(const right of ['peach','likes','watches',"don't",'Does','He likes peaches.','❌ 不对：照妖镜后 like 要现原形']){
    await page.locator('#quizOpts').getByRole('button',{name:right,exact:true}).click();
  }
  await expect(page.locator('#quizResult')).toContainText('首次答对 7 / 8');
});

test('Lesson50 快问快答不朗读正确答案或自动跳过错题',async({page})=>{
  const media=[];page.on('request',r=>{if(r.resourceType()==='media')media.push(r.url());});
  await page.goto('/lesson50/');
  const questionAudio=page.waitForRequest(r=>r.url().endsWith('/does_he_like_tomatoes.mp3'));
  await page.locator('#qaStartBtn').click();await questionAudio;const before=media.length;
  await page.locator('#qaBtns').getByRole('button',{name:/No, he doesn't/}).click();
  await expect(page.locator('#qaFb')).toHaveText('再看看，试一次。');
  await page.waitForTimeout(2400);await expect(page.locator('#qaQ')).toContainText('Does he like tomatoes?');
  expect(media.slice(before).every(url=>url.endsWith('/does_he_like_tomatoes.mp3'))).toBe(true);
  await page.locator('#qaBtns').getByRole('button',{name:/Yes, he does/}).click();
  await expect(page.locator('#qaFb')).toContainText('答对');
  await page.locator('#qaBtns').getByRole('button',{name:/No, she doesn't/}).click();
  await page.locator('#qaBtns').getByRole('button',{name:/Yes, I do/}).click();
  await expect(page.locator('#qaResult')).toContainText('首次答对 2 / 3');
});

test('Lesson51 频率分拣答错不告知应该选哪个台阶',async({page})=>{
  await page.goto('/lesson51/#w4');
  await page.locator('#freqCards').getByRole('button').filter({hasText:/every day|always/}).click();
  await page.locator('.rung').filter({hasText:'sometimes'}).click();
  await expect(page.locator('#fqFb')).toHaveText('再看看，试一次。');
  await page.locator('.rung').filter({hasText:'always'}).click();
  await expect(page.locator('#freqCards .done')).toHaveCount(1);
});

test('没有独立线索的题目不把解析放进灯泡',async({page})=>{
  await page.goto('/lesson49/#learn/doare');
  await expect(page.locator('.stage-doare').getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
});

test('拼句线索只给思考方向，不提供完整词序',async({page})=>{
  await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans');
  await room.getByRole('button',{name:'给点线索',exact:true}).click();
  await expect(room.locator('.practice-hint')).toHaveText('这句话是在提问，还是在说明一件事？');
});

for(const path of ['lesson49','unit49-50'])test(path+' 分拣答错原题重试，刷新保留首次错误记录',async({page})=>{
  await page.goto('/'+path+'/#learn/subjects');const room=page.locator('.stage-subjects');
  await room.getByRole('button',{name:'第一人称',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await expect(room.locator('#tpItemText')).toHaveText('Mrs. Bird');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await room.getByRole('button',{name:'第三人称单数',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button',{name:'继续',exact:true}).click();
  await expect(room.locator('#tpItemText')).toHaveText('Mrs. Bird and her husband');
});

test('Lesson13–14首次和连续答错只提示重试，刷新不泄题，改对后记录修正完成',async({page})=>{
  await page.goto('/unit13-14/#learn/listen');const room=page.locator('.stage-listen');
  for(const wrong of ['职业','姓名']){
    await room.getByRole('button',{name:wrong,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
    await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
    await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  }
  await room.getByRole('button',{name:'颜色',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(page.getByRole('dialog',{name:'学习手记',exact:true})).toContainText('修正后完成');
  await expect(page.getByRole('dialog',{name:'学习手记',exact:true})).toContainText('提交 3 次');
});
