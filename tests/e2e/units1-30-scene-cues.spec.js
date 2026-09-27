'use strict';
const{test,expect}=require('@playwright/test');
const{story,activity}=require('../support/units1-30-tasks');
test.use({reducedMotion:'reduce',actionTimeout:4000});
for(const[pair,group,id,art,result]of [
 ['11-12','owner','owner-apostrophe','white-shirt.svg','Tim’s shirt is white.'],
 ['11-12','exam','exam-my-your','blue-shirt.svg','Dave 说 my；老师对他说 your。'],
 ['13-14','roles','story-hat','hat-box.svg','绿色帽子和连衣裙相配。'],
 ['13-14','exam','exam-too','hat-box.svg','too 承接 new：也是新的。'],
 ['15-16','roles','story-finish','officer.svg','检查结束，大家可以继续出发。'],
 ['15-16','reply','reply-we','girls.svg','姑娘们一起回答：Yes, we are.']
])test(`${pair} ${id} 新题沿用对应道具和语义反馈`,async({page})=>{
 if(group==='roles')await story(page,pair);let checked=false;
 await activity(page,pair,group,{wrongNew:true,capture:async(room,q,state)=>{
  if(!q.id.endsWith('tasks-v4-'+id))return;checked=true;
  const artView=room.locator('.claim-evidence,.dress-evidence,.customs-evidence'),resultView=room.locator('.claim-task-result,.dress-task-result,.customs-task-result');
  if(state==='blank')await expect(artView.locator('img').first()).toHaveAttribute('src',new RegExp(art+'$'));
  if(state==='wrong')await expect(resultView).toBeEmpty();
  if(state==='correct')await expect(resultView).toHaveText(result);
 }});
 expect(checked).toBe(true);
});
test('9–10 定位回问时突出 Helen，没有空白对白框',async({page})=>{
 await story(page,'9-10');
 await activity(page,'9-10','roles',{capture:async(room,q,state)=>{
  if(!q.id.endsWith('story-return-question')||state!=='blank')return;
  await expect(room.locator('.greeting-task-stage')).toHaveAttribute('data-speaker','helen');
  await expect(room.locator('.greeting-speech')).toBeHidden();
  const box=await room.locator('.greeting-task-stage').boundingBox();expect(box.height).toBeLessThan(210);
 }});
});
