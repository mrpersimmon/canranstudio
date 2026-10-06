'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function nativeAudio(page) {
  await page.addInitScript(()=>{
    window.nativePlays=[];
    const play=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(...args){
      const result={src:this.src,ended:false};window.nativePlays.push(result);
      this.addEventListener('ended',()=>{result.ended=true;},{once:true});
      return Reflect.apply(play,this,args);
    };
  });
}
async function heard(page,control,path) {
  const before=await page.evaluate(()=>window.nativePlays.length);
  await control.click();
  await expect.poll(()=>page.evaluate(({before,path})=>window.nativePlays.slice(before).some(item=>new URL(item.src).pathname===path&&item.ended),{before,path}),{timeout:10000}).toBe(true);
}

test('偶数课十物问句都有可点读的完整示范，来自教材替换结构',async({page})=>{
  await page.goto('/unit1-2/#learn/phrases');
  const room=page.locator('.stage-phrases');
  await room.getByText('换个物品问一问',{exact:true}).click();
  for(const word of ['pen','pencil','book','watch','coat','dress','skirt','shirt','car','house'])await expect(room.getByRole('button',{name:`Is this your ${word}?`,exact:true})).toBeVisible();
});

test('38 个录音均通过真实控件播放，词卡、两位角色与问句各自文字对应',async({page})=>{
  test.setTimeout(180000);await nativeAudio(page);
  const failed=[];page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
  await page.goto('/unit1-2/#learn/words');
  const words=page.locator('.stage-words');
  const groups=[
    [['handbag','l01-w07'],['pen','l02-w01'],['pencil','l02-w02'],['book','l02-w03'],['watch','l02-w04'],['coat','l02-w05']],
    [['dress','l02-w06'],['skirt','l02-w07'],['shirt','l02-w08'],['car','l02-w09'],['house','l02-w10'],['excuse','l01-w01-v2']],
    [['me','l01-w02'],['yes','l01-w03'],['is','l01-w04'],['this','l01-w05'],['your','l01-w06'],['pardon','l01-w08']],
    [['it','l01-w09'],['thank you','l01-w10'],['very much','l01-w11']]
  ];
  for(let i=0;i<4;i++){
    for(const [word,file] of groups[i])await heard(page,words.getByRole('button',{name:word,exact:true}),'/unit1-2/audio/'+file+'.mp3');
    if(i<3)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.getByRole('link',{name:'手提包的故事',exact:true}).click();
  const story=page.locator('.stage-text');
  for(let i=1;i<=7;i++)await heard(page,story.getByRole('button',{name:i===1?'开始听课文':'下一句',exact:true}),'/unit1-2/audio/l01-d0'+i+'.mp3');
  await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await page.getByRole('link',{name:'开口有礼貌',exact:true}).click();
  const phrases=page.locator('.stage-phrases');await phrases.getByText('换个物品问一问',{exact:true}).click();
  const models=[['pen','q-pen'],['pencil','q-pencil'],['book','q-book'],['watch','nce-u01-c-q-watch'],['coat','nce-u01-c-q-coat'],['dress','q-dress'],['skirt','q-skirt'],['shirt','q-shirt'],['car','nce-u01-c-q-car'],['house','nce-u01-c-q-house']];
  for(const [word,file] of models)await heard(page,phrases.getByRole('button',{name:`Is this your ${word}?`,exact:true}),'/unit1-2/audio/'+file+'.mp3');
  const paths=await page.evaluate(()=>[...new Set(window.nativePlays.filter(item=>item.ended&&item.src.includes('/unit1-2/audio/')).map(item=>new URL(item.src).pathname))]);
  expect(paths).toHaveLength(38);expect(failed).toEqual([]);
});

test.describe(() => {
// A cached recording should survive a network failure; test the uncached
// browser fallback here, and worker/offline playback in course-cache tests.
test.use({ serviceWorkers: 'block' });
test('子目录真实听题与正误音效可播放，音频失败不会启用检查，恢复后可以重试',async({page})=>{
  test.setTimeout(60000);await nativeAudio(page);
  let fail=true;await page.route('**/unit1-2/audio/l01-w07.mp3',route=>fail?route.abort():route.continue());
  await page.goto('/lesson/unit1-2/#learn/listen');
  const room=page.locator('.stage-listen');
  await room.getByRole('button',{name:'handbag',exact:true}).click();
  await room.getByRole('button',{name:'听一遍',exact:true}).click();
  await expect(room).toContainText('播放未完成，请重听。');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  fail=false;
  await heard(page,room.getByRole('button',{name:'再听一遍',exact:true}),'/lesson/unit1-2/audio/l01-w07.mp3');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
  await room.locator('.practice-options button').filter({hasNotText:'handbag'}).first().click();
  await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-incorrect.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await room.getByRole('button',{name:'handbag',exact:true}).click();
  await heard(page,room.getByRole('button',{name:'听一遍',exact:true}),'/lesson/unit1-2/audio/l01-w07.mp3');
  await heard(page,room.getByRole('button',{name:'检查答案',exact:true}),'/lesson/assets/feedback/duolingo-correct.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  expect(await page.evaluate(()=>window.nativePlays.every(item=>new URL(item.src).pathname.startsWith('/lesson/')))).toBe(true);
});

});
