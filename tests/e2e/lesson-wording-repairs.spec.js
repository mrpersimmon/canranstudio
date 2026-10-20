'use strict';
const {test,expect}=require('@playwright/test');
test.use({browserName:process.env.WORDING_REVIEW_BROWSER||'chromium'});
const cases=[{pair:'31-32',module:'unit3132',group:'grammar',at:7,forbidden:'She is in the garden.',expected:'Tom is in the classroom.'},{pair:'79-80',module:'unit7980',group:'grammar',at:5,forbidden:'No, you needn’t.',expected:'No, he needn’t.'}];
// Use the independently reviewed activity helpers to reach each grammar task.
for(const c of cases)test(`Lesson ${c.pair} 短示范错开当前完整答案`,async({page},info)=>{
 test.setTimeout(120000);const helper=require('../support/unit'+c.pair.replace('-','')+(c.pair==='31-32'?'-fivezones':''));await helper.story(page);
 let checked=false;await helper.activity(page,c.group,{inspect:async(room,i,phase)=>{if(i!==c.at||phase!=='before')return;const demo=room.getByRole('region',{name:'短示范',exact:true});await expect(demo).not.toContainText(c.forbidden);await expect(demo).toContainText(c.expected);await room.screenshot({path:info.outputPath('model-before-answer.png')});checked=true;}});expect(checked).toBe(true);
});
test('Lesson 61-62 明确评价者与评价对象，沿用原答案和旧记录',async({page},info)=>{
 test.setTimeout(120000);const helper=require('../support/unit6162');await helper.story(page);let checked=false;await helper.activity(page,'roles',{inspect:async(room,i,phase)=>{if(i!==6||phase!=='before')return;await expect(room).toContainText('她认为这对谁是好消息');await expect(room).not.toContainText('谁觉得这是好消息');await room.screenshot({path:info.outputPath('beneficiary-before-answer.png')});checked=true;}});expect(checked).toBe(true);
});
