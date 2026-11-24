'use strict';
const {test,expect}=require('@playwright/test');
const {courseWord}=require('../support/course-controls');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');

const cases=[
  {unit:'unit71-72',word:'the day before yesterday',meaning:'前天',ipa:'/ðə deɪ bɪˈfɔː ˈjestədeɪ/'},
  {unit:'unit21-22',word:'her',meaning:'她；她的（看句子）',ipa:'/hɝː/',example:'Give her a book. / her book'}
];
const sizes=[
  ...devices.map(device=>({name:device.name,settings:contextOptions(device)})),
  {name:'320×568',settings:{viewport:{width:320,height:568}}},
  {name:'390×500',settings:{viewport:{width:390,height:500}}}
];

async function expectReadable(card){
  const clipped=await card.evaluate(button=>{
    const bounds=button.getBoundingClientRect(),issues=[];
    if(button.scrollHeight>button.clientHeight+1||button.scrollWidth>button.clientWidth+1)issues.push('卡内滚动');
    let bottom=bounds.top;
    for(const child of button.querySelectorAll(':scope > strong,:scope > small,:scope > .word-context,:scope > .word-meaning')){
      if(!child.getClientRects().length)continue;
      const r=child.getBoundingClientRect();
      if(r.left<bounds.left-1||r.right>bounds.right+1||r.top<bottom-1||r.bottom>bounds.bottom+1)issues.push(child.textContent);
      bottom=r.bottom;
    }
    return issues;
  });
  expect(clipped).toEqual([]);
}

for(const size of sizes)test.describe(size.name,()=>{
  test.use(size.settings);
  test('长词组和例句保留完整空间，翻卡和换组时位置稳定',async({page})=>{
    for(const {unit,word,meaning,ipa,example} of cases){
      await page.goto('/'+unit+'/#learn/words');
      await courseReadyForAssertions(page);
      const room=page.locator('.stage-words.learning-surface');
      await expect(room.locator('.unit-word')).toHaveCount(6);
      await page.evaluate(()=>document.fonts.ready);
      const first=room.locator('.unit-word').first(),start=await first.boundingBox(),controls=room.locator('.word-controls');
      const footer=await controls.boundingBox(),card=await courseWord(room,word);
      expect((await card.boundingBox()).height).toBeCloseTo(start.height,0);
      await expect(card.locator('.word-phonetic')).toHaveText(ipa);
      await expectReadable(card);
      await card.scrollIntoViewIfNeeded();
      const rect=await card.boundingBox();await card.click();
      await expect(card).toHaveAttribute('aria-expanded','true');
      await expect(card.locator('.word-meaning')).toHaveText(meaning);
      if(example)await expect(card.locator('.word-example')).toHaveText(example);
      await expectReadable(card);
      expect(await card.boundingBox()).toEqual(rect);
      expect(await controls.boundingBox()).toEqual(footer);
      await expect(controls).toBeInViewport({ratio:1});
      await card.press('Enter');
      await expect(card).toHaveAttribute('aria-expanded','false');
      await expectReadable(card);
    }
  });
});
