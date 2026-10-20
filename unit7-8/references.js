(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const reference=node('details','','offline-task');reference.append(node('summary','语法小参考'));
 const grid=node('div','','pronoun-reference');
 for(const [subject,object] of unit.learning.PRONOUNS){const row=node('div');row.append(node('span',subject),node('span','→'),node('span',object));grid.append(row);}
 reference.append(node('p','左边是主格，右边是宾格。I、he等可作主语；meet或excuse后使用me、him等形式。'),grid,
 node('p','She is a nurse. · Nice to meet her.\nWe are students. · Excuse us.\n日常回答“是谁？”可以说 It’s me.；不把宾格的用法限定为只能作动词宾语。'),
 node('p','What’s your name? 问名字；What nationality are you? 问国籍；What’s your job? 问职业。\nI am；My name is；Are you…?中的you可以指一人或多人。\nher job中的her表示“她的”；meet her中的her表示“她”。'));
 surfaces.get('grammar').append(reference);
 const models=node('details','','offline-task');models.append(node('summary','课本小参考 · 第8课'));
 const list=node('div','','reference-grid');
 unit.learning.JOBS.forEach((item,i)=>{const card=node('article','','reference-card'),image=node('img');image.src=item.image||'/assets/unit7-8/'+item.job.replaceAll(' ','-')+'.svg';image.alt='';card.append(node('small',String(i+11)),image,node('p',"I'm "+(/^(air hostess)/.test(item.job)?'an ':'a ')+item.job+'.'));list.append(card);});
 models.append(list,node('p','下列完整问答按课本图中人物使用he／she；职业本身通常不能用来判断性别。'));
 for(const item of unit.learning.INTERVIEWS){const row=node('p',item.text||item.en||[item.question,item.confirm,item.answer].filter(Boolean).join(' '));row.lang='en';models.append(row);}
 models.append(node('p','air hostess是课本保留的较旧称谓，现代常用flight attendant；本课不增加新词考题。'));
 surfaces.get('apply').append(models);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 7–8 · 纸笔小练习'),node('p','课堂上跟老师读词语和课文，再用给定的虚构角色卡互相采访。无需填写真实家庭信息。'));
 writing.append(node('h4','A · 用 am 或 is 填空'),node('p','Example: My name ___ Xiaohui. I ___ Chinese.\nMy name is Xiaohui. I am Chinese.'));
 const a=node('ol','','writing-a');unit.learning.WRITING_A.forEach(text=>{const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 写出问句和答句'),node('p','按所给人物，用his、her、he、she、a或an写三句话：问职业、确认职业、肯定回答。he／she按教材图中人物给出，不靠职业猜性别。'),node('p',"keyboard operator\nWhat's her job? Is she a keyboard operator? Yes, she is."),node('p',"engineer\nWhat's his job? Is he an engineer? Yes, he is."));
 const b=node('ol','','writing-b');unit.learning.JOBS.forEach(item=>{const li=node('li',item.job+' · '+item.pronoun);for(let i=0;i<3;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);
 window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit78References={mount};
})(globalThis.CanranCore);
