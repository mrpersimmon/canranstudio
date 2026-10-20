(function(core){
'use strict';const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['打算与正在做','I am going to put it on the floor.\n导学原例：我打算把它放到地板上。am／is／are + going to + 动词原形谈计划或打算；am／is／are + 动词-ing在本课说正在进行。\nWhat are you going to do now?即使有now，也可以问接下来打算做什么。看整个结构和语境，不只找关键词。'],
 ['安排与预测','The meeting is going to begin at nine.\n导学原例说明按计划九点开始；主语不一定是有意愿的人。\nIt’s going to rain! / She’s going to faint!\n导学原例还用于预测，不能把天气或晕倒解释成主动打算。faint：晕倒。预测时说明眼前迹象，不等于事情已经发生或绝对保证。例句中的未来也不局限于最近几天。'],
 ['提问与否定','Is George going to paint it pink?\n导学原例将is提到主语前。George is not going to paint it pink.展示否定形式，要在另设的“不打算涂粉色”情况下使用；不是课文事实。\nI am not going to swim. / Are you going to swim?\n本结构在be后加not、把be放句首提问。回答按题目给定的事实，用Yes, I am.或No, I’m not.；不从“现在没做”推成“以后不打算做”。'],
 ['for：为谁','My mother is cooking supper for me.\n导学原例：妈妈正在为我做晚饭。课文This bookcase isn’t for me. It’s for my daughter, Susan.完整两句说明书架给苏珊，不是仅凭not for me就推出给Dan。'],
 ['for：用作哪一餐','I like some bread and milk for breakfast.\n导学原例：我喜欢早餐吃面包、喝牛奶。for breakfast、for lunch、for supper分别说明早餐、午餐、晚餐。lunch：午餐；supper：晚餐。'],
 ['for：感谢的原因','Thank you for helping me with my English. / Thank you for your last letter.\n导学原例分别感谢英语方面的帮助和上一封来信。for后给原因；helping是这个表达的一部分，不据此声称所有for后只能跟-ing。'],
 ['for：目的','Let’s go for a walk. / I came here for my schoolbag.\n导学原例分别说明散步、来取书包的目的。schoolbag：书包。I paid twenty yuan for the dictionary.中for也用于说明付款买的东西；paid：付了钱；dictionary：词典。这些原例按需读，不把过去式和价格拓展成新关卡。'],
 ['for：支持','No one was for my plan during the meeting.\n导学原例：会上没有人支持我的计划。for在这里表示赞成。I am for your plan.表示我支持你的计划，不是我正替你做计划。'],
 ['固定表达','Who are you waiting for?\n导学原例：你在等谁？wait for a bus表示等公共汽车。\nFor example, you can draw a picture of a monkey.\n导学原例：例如，你可以画一只猴子。For example是“例如”，不逐词译成“给例子”。'],
 ['词义、词形与课堂分工','working hard中的hard是努力地；work在这里为工作，不直接等于homework。make／paint分别是制作／涂色；paint也可在别处作名词油漆。favourite说个人最喜欢，不扩大为所有人的偏好。\nmake → making，shave → shaving去掉不发音e；paint → painting、wash → washing直接加ing。Pink’s = Pink is；her回指Susan，it回指bookcase，one承接hammer。\n口头问答、发音、听辨和书写由老师组织。刮脸、使用工具只观察教材，不安排儿童实际操作。']
 ];const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第38课'),node('p','六组对照，每页保留一组“打算／现在正在”，共12幅图和原英文数字。跟老师分别提问，再说完整回答。'));
 const gallery=node('div','','workshop-gallery'),controls=node('div','','reference-pager'),count=node('span'),back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);
 const numbers=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(5,saved)):0;
 function show(){gallery.replaceChildren();const item=unit.learning.GALLERY[index],pair=node('article','','action-pair-cards');for(const[k,when]of ['plan','now'].entries()){const card=node('article','','action-picture'),im=node('img');im.src=item[when+'Image'];im.alt=item[when+'Cn'];card.append(node('small','图 '+(index*2+k+1)+' · '+numbers[index*2+k],'number-label'),node('h4',when==='plan'?'打算做':'现在正在做'),im,node('p',item[when]),node('p',item[when+'Cn']));pair.append(card);}gallery.append(pair);count.textContent=(index+1)+' / 6';back.disabled=index===0;next.disabled=index===5;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(gallery,controls);for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));book.append(node('p','图5–6是our homework，书写B3是my homework，分别按原题使用。正在上漆的图与第37课打算上漆是不同训练情境。','reference-note'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 37–38 · 纸笔小练习'),node('p','跟老师读课文，分别问打算做什么和现在正在做什么。口头表达与纸笔答案由老师核对。'),node('h4','A · 用 am、is 或 are 完成句子'),node('p','Example:\nWhat ___ you doing?\nWhat are you doing?\nWe ___ reading.\nWe are reading.','writing-example'));
 const a=node('ol','','writing-a');for(const sentence of unit.learning.WRITING_A){const li=node('li',sentence);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 每个词组写两问两答'),node('p','Example: paint this bookcase\nWhat are you going to do?\nI’m going to paint this bookcase.\nWhat are you doing now?\nI’m painting this bookcase.','writing-example'));
 const b=node('ol');for(const phrase of unit.learning.WRITING_B){const li=node('li');li.append(node('span',phrase));for(let i=0;i<4;i++)li.append(node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}core.unit3738References={mount};
})(globalThis.CanranCore);
