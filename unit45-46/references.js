(function(core){
'use strict';const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const notes=node('details','','offline-task');notes.append(node('summary','语法小参考'));const list=node('div','','grammar-reference');
 for(const[title,text]of [
 ['can的否定与原形','I can’t play the piano.\n导学原例：我不会弹钢琴。常用完整写法cannot是一个词，can’t是缩写；后面仍接动词原形。本课不把can not分写形式用作唯一错项，遇到时结合具体句子理解。'],
 ['问句与肯否短答','I can see an orange on the table.\nCan you see an orange on the table?\n导学原例换到对方提问时，I也换为you；不只是机械移动can。\nCan you write in English? — Yes, I can. / No, I can’t.\n答案由事实决定，不能只看问句猜肯定。Certainly.也可表达肯定回应。'],
 ['回答里的人称','Can Bob read it? — Yes, he can.\nCan Pamela read it? — Yes, she can.\nCan the cat drink its milk? — Yes, it can.\n这里假设都能做到。you由被问的人用I回应；问到你和另一个人，用we；另外两个人用they。猫在本课用it，不是说动物永远只能用it。'],
 ['谁能做什么','Who can sing in English in your class? — Lily can.\n导学原例用who作主语，直接接can和原形，不另加he或she。完整回答也可以说Lily can sing in English.。'],
 ['问事情、地点、时间和方法','What can you see in the picture?\n导学原例问看见什么；where问地点、when问时间、how问方法。它们放在can＋主语＋动词原形前。Who作主语的问句与这些结构分别核对，不把所有疑问词都套成相同顺序。'],
 ['问数量','How many boats can you see in the river?\n导学原例：how many＋可数复数，问多少只船。\nHow much water can you see?\nwater在这里是不可数的水，用how much问量。若问多少瓶水，数的是bottles，仍用how many；本课不扩成价格用法。'],
 ['本领与请求','Can you swim?问是否会游泳。\nCan you come here a minute please, Bob?在课文里是请Bob过来一下；a minute不是要求准确计时六十秒。Can you…please?可用于日常请求，不表示所有can问句都在请求，也不保证任何语气都礼貌。'],
 ['这封信的困难','Pamela说会打字，后来打不了this letter，是因为读不懂老板的字迹。不要扩大成她不会阅读或不愿帮助；terrible描述这次字迹，不是给人下结论。boss’s在这里表示老板的，不是boss is。'],
 ['正在做、能够做','He is taking his book. → He can take his book.\n课本A把正在拿书改说能够拿书，含义也改变了；不称同义改写。课本B按给定的肯定情境练完整问答，真实课堂回答仍按本人情况决定。']
 ]){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}notes.append(list);surfaces.get('grammar').append(notes);
 const models=node('details','','offline-task');models.append(node('summary','本领对比与数字'),node('p','八组课本能力对比与英文数字。每组两幅图分别对应can和can’t；数字是原图编号，不是物品数量。跟老师读一读，说一说。'));
 const grid=node('div','','reference-grid');for(const item of unit.learning.MODELS){const card=node('article','','reference-card'),picture=node('img');picture.src='/assets/unit45-46/reference-'+item.number.split(' ')[0].replaceAll(',','')+'-v153.svg';picture.alt=item.cn;const en=node('p',item.en);en.lang='en';card.append(node('small',item.number),picture,en,node('span',item.cn));grid.append(card);}models.append(grid);surfaces.get('grammar').append(models);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 45–46 · 纸笔小练习'),node('h4','A · 把正在做改成能做'),node('p','按课本改说能力，不是保持原意改写。每题写一个完整句子。'),node('p','Examples:\nHe is taking his book. → He can take his book.\nShe is putting on her coat. → She can put on her coat.','writing-example'));
 const a=node('ol','','writing-a');for(const text of unit.learning.WRITING_A){const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 按指定肯定情境写完整问答'),node('p','这轮假设题目里的人或动物都能做到。每组接着写肯定短答、What can…do?问题和完整回答，选用I、he、she、it、we或they。'),node('p','Examples:'));
 const examples=node('div','','writing-examples');examples.append(node('p','Can you put on your coat?\nYes, I can.\nWhat can you do?\nI can put on my coat.','writing-example'),node('p','Can you and Sam listen to the radio?\nYes, we can.\nWhat can you and Sam do?\nWe can listen to the radio.','writing-example'));section.append(examples);
 const b=node('ol');for(const text of unit.learning.WRITING_B){const li=node('li');li.append(node('span',text));for(let i=0;i<3;i++)li.append(node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit4546References={mount};
})(globalThis.CanranCore);
