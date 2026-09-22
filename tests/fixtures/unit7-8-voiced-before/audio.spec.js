'use strict';
const {test,expect}=require('@playwright/test');
const {createHash}=require('node:crypto');
const {DIALOGUE}=require('../support/unit7-8-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function observe(page){await page.addInitScript(()=>{window.nativePlays=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(...args){const entry={src:this.src,rate:this.playbackRate,ended:false};window.nativePlays.push(entry);this.addEventListener('ended',()=>{entry.ended=true;},{once:true});return Reflect.apply(play,this,args);};});}
async function heard(page,control,path){const before=await page.evaluate(()=>window.nativePlays.length);await control.click();await expect.poll(()=>page.evaluate(({before,path})=>window.nativePlays.slice(before).some(x=>new URL(x.src).pathname===path&&x.ended),{before,path}),{timeout:15000}).toBe(true);}

for(const base of ['', '/lesson'])test(`I 词卡使用修订录音，重听与刷新不回到缺陷版本：${base || '/'}`,async({page})=>{
 await observe(page);await page.goto(base+'/unit7-8/#learn/words');
 const words=page.locator('.stage-words');
 await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
 const card=words.getByRole('button',{name:'I',exact:true});await expect(card).toContainText('/aɪ/');
 const responsePromise=page.waitForResponse(r=>/\/unit7-8\/audio\/l07-w01[^/]*\.mp3$/.test(new URL(r.url()).pathname));
 await card.click();const response=await responsePromise;
 // Locks the independently diagnosed replacement, not a claim of human listening approval.
 // Assert on the bytes actually delivered by the page, not the manifest's own checksum.
 expect(createHash('sha256').update(await response.body()).digest('hex')).toBe('7161ed477f308aa7e07dc6c41b133d7a4a097bc3bfa82fd2b232d85d83dac1e0');
 const recording=base+'/unit7-8/audio/l07-w01-v2.mp3';
 expect(new URL(response.url()).pathname).toBe(recording);
 await expect(card).toHaveAttribute('aria-busy','false');
 for(let i=0;i<2;i++)await heard(page,card,recording);
 expect(await page.evaluate(()=>window.nativePlays.map(x=>({rate:x.rate,ended:x.ended})))).toEqual(Array(3).fill({rate:1,ended:true}));
 await page.reload();await expect(words.locator('#wordPageProgress')).toHaveText('3 / 4');
 await heard(page,words.getByRole('button',{name:'I',exact:true}),recording);
 await heard(page,words.getByRole('button',{name:'am',exact:true}),base+'/unit7-8/audio/l07-w02.mp3');
 await heard(page,words.getByRole('button',{name:'are',exact:true}),base+'/unit7-8/audio/l07-w03.mp3');
 await expect(page.locator('#starCount')).toHaveText('0');
});

test('65 段音频均由页面真实播放结束，双人对话与完整职业问答绑定正确',async({page})=>{
 test.setTimeout(360000);await observe(page);const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto('/unit7-8/#learn/words');const words=page.locator('.stage-words');
 const entries=[['Italian','l07-w07'],['keyboard operator','keyboard-operator'],['engineer','l07-w11'],['policeman','l08-w01'],['policewoman','l08-w02'],['taxi driver','l08-w03'],['air hostess','l08-w04'],['postman','l08-w05'],['nurse','l08-w06'],['mechanic','l08-w07'],['hairdresser','l08-w08'],['housewife','l08-w09'],['milkman','l08-w10'],['I','l07-w01-v2'],['am','l07-w02'],['are','l07-w03'],['name','l07-w04'],['what','l07-w05'],['nationality','l07-w06'],['job','l07-w08'],['keyboard','l07-w09'],['operator','l07-w10']];
 for(let i=0;i<entries.length;i++){if(i&&i%6===0)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();await heard(page,words.getByRole('button',{name:entries[i][0],exact:true}),'/unit7-8/audio/'+entries[i][1]+'.mp3');}
 await page.getByRole('link',{name:'和朋友聊一聊',exact:true}).click();const story=page.locator('.stage-text');
 for(let i=0;i<16;i++){await heard(page,story.getByRole('button',{name:i?'下一句':'开始听课文',exact:true}),'/unit7-8/audio/l07-d'+String(i+1).padStart(2,'0')+'.mp3');await expect(story.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(story.locator('.dialogue-actor.speaking')).toHaveCount(0);}
 await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
 await page.getByRole('link',{name:'问答有办法',exact:true}).click();const phrases=page.locator('.stage-phrases');await phrases.getByText('am、is、are 怎么选',{exact:true}).click();
 const references=['My name is Xiaohui. I am Chinese.','My name is Robert. I am a student. I am Italian.','Sophie is not Italian. She is French.','Mr. Blake is my teacher. He is not French.'];
 for(let i=0;i<4;i++)await heard(page,phrases.getByRole('button',{name:references[i],exact:true}),'/unit7-8/audio/written-a-'+String(i+1).padStart(2,'0')+'.mp3');
 await page.getByRole('link',{name:'职业采访台',exact:true}).click();const models=page.locator('.stage-models');
 const jobs=['policeman','policewoman','taxi driver','air hostess','postman','nurse','mechanic','hairdresser','housewife','milkman'];
 for(let i=0;i<10;i++)await heard(page,models.getByRole('button',{name:`I'm ${i===3?'an':'a'} ${jobs[i]}.`,exact:true}),'/unit7-8/audio/l08-p'+String(i+1).padStart(2,'0')+'.mp3');
 await models.getByText('替图中人物问一问',{exact:true}).click();
 const interviews=["What's her job? Is she a keyboard operator? Yes, she is.","What's his job? Is he an engineer? Yes, he is.","What's his job? Is he a policeman? Yes, he is.","What's her job? Is she a policewoman? Yes, she is.","What's his job? Is he a taxi driver? Yes, he is.","What's her job? Is she an air hostess? Yes, she is.","What's his job? Is he a postman? Yes, he is.","What's her job? Is she a nurse? Yes, she is.","What's his job? Is he a mechanic? Yes, he is.","What's his job? Is he a hairdresser? Yes, he is.","What's her job? Is she a housewife? Yes, she is.","What's his job? Is he a milkman? Yes, he is."];
 for(let i=0;i<12;i++)await heard(page,models.getByRole('button',{name:interviews[i],exact:true}),'/unit7-8/audio/interview-'+String(i+1).padStart(2,'0')+'.mp3');
 await page.getByRole('link',{name:'采访小达人',exact:true}).click();await heard(page,page.locator('.stage-exam').getByRole('button',{name:'听一遍',exact:true}),'/unit7-8/audio/challenge-record.mp3');
 const paths=await page.evaluate(()=>[...new Set(window.nativePlays.filter(x=>x.ended&&x.src.includes('/unit7-8/audio/')).map(x=>new URL(x.src).pathname))]);expect(paths).toHaveLength(65);expect(failed).toEqual([]);
});

test('子目录播放失败可重试，未听完不能检查，答对答错各有反馈音',async({page})=>{
 test.setTimeout(60000);await observe(page);let fail=true;await page.route('**/unit7-8/audio/l07-w07.mp3',r=>fail?r.abort():r.continue());
 await page.goto('/lesson/unit7-8/#learn/listen');const room=page.locator('.stage-listen');await room.getByRole('button',{name:'Italian',exact:true}).click();await room.getByRole('button',{name:'听一遍',exact:true}).click();
 await expect(room).toContainText('播放未完成，请重听。');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();fail=false;
 await heard(page,room.getByRole('button',{name:'再听一遍',exact:true}),'/lesson/unit7-8/audio/l07-w07.mp3');await room.getByRole('button',{name:'keyboard operator',exact:true}).click();await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-incorrect.mp3');
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'Italian',exact:true}).click();await heard(page,room.getByRole('button',{name:'听一遍',exact:true}),'/lesson/unit7-8/audio/l07-w07.mp3');await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-correct.mp3');
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');expect(await page.evaluate(()=>window.nativePlays.every(x=>new URL(x.src).pathname.startsWith('/lesson/')))).toBe(true);
});

test('重听旧句、查看中文与离开活动不会代替未听完的当前句',async({page})=>{
 test.setTimeout(60000);await observe(page);await page.goto('/unit7-8/#learn/text');const room=page.locator('.stage-text');await heard(page,room.getByRole('button',{name:'开始听课文',exact:true}),'/unit7-8/audio/l07-d01.mp3');
 await room.getByRole('button',{name:'下一句',exact:true}).click();await heard(page,room.getByRole('button',{name:DIALOGUE[0],exact:true}),'/unit7-8/audio/l07-d01.mp3');await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
 await room.locator('.bubble-row').first().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bubble-row').first()).toContainText('我是一名新学生。');await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
 await heard(page,room.getByRole('button',{name:DIALOGUE[1],exact:true}),'/unit7-8/audio/l07-d02.mp3');await room.getByRole('button',{name:'下一句',exact:true}).click();await page.getByRole('link',{name:'问答有办法',exact:true}).click();await page.getByRole('link',{name:'和朋友聊一聊',exact:true}).click();await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();await heard(page,room.getByRole('button',{name:DIALOGUE[2],exact:true}),'/unit7-8/audio/l07-d03.mp3');await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeEnabled();
});
