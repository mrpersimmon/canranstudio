'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE } = require('../support/unit5-6-flow');
test.use({ reducedMotion:'reduce',actionTimeout:5000 });
async function observe(page){await page.addInitScript(()=>{window.nativePlays=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(...args){const entry={src:this.src,ended:false};window.nativePlays.push(entry);this.addEventListener('ended',()=>{entry.ended=true;},{once:true});return Reflect.apply(play,this,args);};});}
async function heard(page,control,path){const before=await page.evaluate(()=>window.nativePlays.length);await control.click();await expect.poll(()=>page.evaluate(({before,path})=>window.nativePlays.slice(before).some(x=>new URL(x.src).pathname===path&&x.ended),{before,path}),{timeout:15000}).toBe(true);}

test('80 段录音由真实页面逐一播完，完整原文、词卡、四组指代、十二组问答绑定正确',async({page})=>{
  test.setTimeout(360000);await observe(page);const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
  await page.goto('/unit5-6/#learn/words');const words=page.locator('.stage-words');
  const entries=[['French','l05-w07'],['German','l05-w08'],['Japanese','l05-w11'],['South Korean','l05-w12'],['Chinese','l05-w13'],['Swedish','l06-w02'],['English','l06-w03'],['American','l06-w04'],['student','l05-w06'],['Mr.','l05-w01-v2'],['Miss','l05-w04'],['morning','l05-w03'],['good','l05-w02'],['new','l05-w05'],['nice','l05-w09'],['meet','l05-w10'],['too','l05-w14'],['make','l06-w01'],['Volvo','l06-w05'],['Peugeot','l06-w06'],['Mercedes','l06-w07'],['Toyota','l06-w08'],['Ford','l06-w09'],['Mini','l06-w10']];
  for(let i=0;i<entries.length;i++){if(i&&i%6===0)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();await heard(page,words.getByRole('button',{name:entries[i][0],exact:true}),'/unit5-6/audio/'+entries[i][1]+'.mp3');}
  await page.getByRole('link',{name:'新朋友来了',exact:true}).click();const story=page.locator('.stage-text');
  for(let i=0;i<20;i++){await heard(page,story.getByRole('button',{name:i?'下一句':'开始听课文',exact:true}),'/unit5-6/audio/l05-d'+String(i+1).padStart(2,'0')+(i===11?'-v2':'')+'.mp3');await expect(story.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}
  await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await page.getByRole('link',{name:'介绍有办法',exact:true}).click();const phrases=page.locator('.stage-phrases');
  await phrases.getByText('他、她、它怎么接着说',{exact:true}).click();
  for(const [text,file] of [["Alice is a student. She isn't German. She is French.",'reference-alice'],['This is her car. It is a French car.','reference-her-car'],["Hans is a student. He isn't French. He is German.",'reference-hans'],['This is his car. It is a German car.','reference-his-car']])await heard(page,phrases.getByRole('button',{name:text,exact:true}),'/unit5-6/audio/'+file+'.mp3');
  await page.getByRole('link',{name:'汽车小展台',exact:true}).click();const models=page.locator('.stage-models');
  await heard(page,models.getByRole('button',{name:'What make is it?',exact:true}),'/unit5-6/audio/what-make.mp3');
  const cars=["It's a Volvo. (Swedish)","It's a Peugeot. (French)","It's a Mercedes. (German)","It's a Toyota. (Japanese)","It's a Mini. (English)","It's a Ford. (American)"];
  for(let i=0;i<cars.length;i++)await heard(page,models.getByRole('button',{name:cars[i],exact:true}),'/unit5-6/audio/l06-p'+String(i+1).padStart(2,'0')+'.mp3');
  await models.getByText('换个朋友或汽车问一问',{exact:true}).click();
  const rows=[
    ['Is she a French student or a Swedish student?',"She isn't a Swedish student. She's a French student."],
    ['Is it a Swedish car or a French car?',"It isn't a French car. It's a Swedish car."],
    ['Is she a Japanese student or a German student?',"She isn't a German student. She's a Japanese student."],
    ['Is it a French car or a German car?',"It isn't a German car. It's a French car."],
    ['Is he a German student or a French student?',"He isn't a French student. He's a German student."],
    ['Is she a Chinese student or a Japanese student?',"She isn't a Japanese student. She's a Chinese student."],
    ['Is it an English car or an American car?',"It isn't an American car. It's an English car."],
    ['Is he a South Korean student or a Japanese student?',"He isn't a Japanese student. He's a South Korean student."],
    ['Is he a Chinese student or an English student?',"He isn't an English student. He's a Chinese student."],
    ['Is it a German car or a French car?',"It isn't a French car. It's a German car."],
    ['Is it a Japanese car or a Chinese car?',"It isn't a Chinese car. It's a Japanese car."],
    ['Is it an American car or an English car?',"It isn't an English car. It's an American car."]
  ];
  for(let i=0;i<rows.length;i++)for(let j=0;j<2;j++)await heard(page,models.getByRole('button',{name:rows[i][j],exact:true}),'/unit5-6/audio/model-'+String(i+1).padStart(2,'0')+(j?'-a':'-q')+'.mp3');
  await page.getByRole('link',{name:'见面小达人',exact:true}).click();await heard(page,page.locator('.stage-exam').getByRole('button',{name:'听一遍',exact:true}),'/unit5-6/audio/challenge-car.mp3');
  const paths=await page.evaluate(()=>[...new Set(window.nativePlays.filter(x=>x.ended&&x.src.includes('/unit5-6/audio/')).map(x=>new URL(x.src).pathname))]);expect(paths).toHaveLength(80);expect(failed).toEqual([]);
});

test('子目录音频失败后能重听，未听完不能提交，答对答错沿用反馈音效',async({page})=>{
  test.setTimeout(60000);await observe(page);let fail=true;
  await page.route('**/unit5-6/audio/l05-w07.mp3',route=>fail?route.abort():route.continue());
  await page.goto('/lesson/unit5-6/#learn/listen');const room=page.locator('.stage-listen');
  await room.getByRole('button',{name:'French',exact:true}).click();await room.getByRole('button',{name:'听一遍',exact:true}).click();
  await expect(room).toContainText('播放未完成，请重听。');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();fail=false;
  await heard(page,room.getByRole('button',{name:'再听一遍',exact:true}),'/lesson/unit5-6/audio/l05-w07.mp3');
  await room.getByRole('button',{name:'German',exact:true}).click();await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-incorrect.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await room.getByRole('button',{name:'French',exact:true}).click();await heard(page,room.getByRole('button',{name:'听一遍',exact:true}),'/lesson/unit5-6/audio/l05-w07.mp3');
  await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-correct.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  expect(await page.evaluate(()=>window.nativePlays.every(x=>new URL(x.src).pathname.startsWith('/lesson/')))).toBe(true);
});

test('重听旧句和切换章节不会替未听完的新句记完成',async({page})=>{
  test.setTimeout(60000);await observe(page);await page.goto('/unit5-6/#learn/text');const room=page.locator('.stage-text');
  await heard(page,room.getByRole('button',{name:'开始听课文',exact:true}),'/unit5-6/audio/l05-d01.mp3');
  await room.getByRole('button',{name:'下一句',exact:true}).click();await heard(page,room.getByRole('button',{name:DIALOGUE[0],exact:true}),'/unit5-6/audio/l05-d01.mp3');
  await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
  await heard(page,room.getByRole('button',{name:DIALOGUE[1],exact:true}),'/unit5-6/audio/l05-d02.mp3');
  await room.getByRole('button',{name:'下一句',exact:true}).click();await page.getByRole('link',{name:'介绍有办法',exact:true}).click();await page.getByRole('link',{name:'新朋友来了',exact:true}).click();
  await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();await heard(page,room.getByRole('button',{name:DIALOGUE[2],exact:true}),'/unit5-6/audio/l05-d03.mp3');
  await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeEnabled();
});
