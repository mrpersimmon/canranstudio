'use strict';
const { expect } = require('@playwright/test');
// Independent expectations: textbook paper pages 10–13 and the unit manuscript.
const DIALOGUE = ['Good morning.','Good morning, Mr. Blake.','This is Miss Sophie Dupont.','Sophie is a new student.','She is French.','Sophie, this is Hans.','He is German.','Nice to meet you.','And this is Naoko.',"She's Japanese.",'Nice to meet you.','And this is Chang-woo.',"He's South Korean.",'Nice to meet you.','And this is Luming.',"He's Chinese.",'Nice to meet you.','And this is Xiaohui.',"She's Chinese, too.",'Nice to meet you.'];
const PEOPLE = ['Students','Students','Students','Students','Students','Hans','Hans','Hans','Naoko','Naoko','Naoko','Chang-woo','Chang-woo','Chang-woo','Luming','Luming','Luming','Xiaohui','Xiaohui','Xiaohui'];
const ANSWERS = {
  listen:['法国（人）的','German','日本（人）的','South Korean','中国（人）的','Swedish','英格兰的','American'],
  roles:['Sophie','不是，他是韩国人','Luming'],
  refer:['She','He','It'], articles:['a','an','不填'],
  choice:["It's a Volvo."],
  trans:[['Is','she','a Japanese student','or','a German student?'],['It',"isn't",'an American car.',"It's",'an English car.']],
  exam:['Hans 是德国人；汽车是日本品牌',['Good morning.','This is','Hans.',"He's",'a German','student.'],'这是一位新同学']
};
async function completeStory(page, base = '') {
  await page.goto(base + '/unit5-6/#learn/text'); const room=page.locator('.stage-text');
  for(let i=0;i<DIALOGUE.length;i++){
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.classroom-classmate span')).toHaveText(PEOPLE[i]);
    await expect(room.getByRole('button',{name:i===19?'完成课文':'下一句',exact:true})).toBeEnabled({timeout:10000});
  }
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  await expect(room).toContainText('新朋友都认识了！');
}
async function completeActivity(page,id,{recovery=false,base=''}={}){
  await page.goto(base + '/unit5-6/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
  for(let i=0;i<answers.length;i++){
    const answer=answers[i],check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
    if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}
    else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
    await expect(check).toBeEnabled({timeout:10000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    if(recovery&&id==='listen'&&i===7){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
    await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  }
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit56(page, base=''){await completeActivity(page,'listen',{recovery:true,base});await completeStory(page,base);for(const id of ['roles','refer','articles','choice','trans','exam'])await completeActivity(page,id,{base});await page.goto(base+'/unit5-6/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,PEOPLE,ANSWERS,completeStory,completeActivity,completeUnit56};
