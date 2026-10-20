(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['must：必须做什么','You must sweep the floor.\nWe must leave early.\nYou must finish it today.\n导学用这些例子说明必须或有必要做某事。must后接动作原形，不加to，也不变成musts。这里说任务要求，不等于想做什么；must的其他含义不作为本课新增考试。'],
 ['mustn’t与needn’t含义不同','You mustn’t open the door.：不准开门。\nYou needn’t open the door.：不必开门，但并不表示禁止。\nmustn’t是must not的缩写；needn’t是need not的缩写，后面也接动词原形。mustn’t不能机械当成“没有必要”。'],
 ['一般问句与人称','Must I come over tonight? — No, you needn’t.\nMust you go soon? — Yes, I must.\n这是导学两组原例。come over：过来；soon：很快。must放到主语前构成一般问句，不加do。回答人称按谁说话决定：别人问我用you，我回答自己用I；我问自己的事，别人对我回应用you。'],
 ['肯定、否定回应先看事实','Must I clean the room today?\n明确必须做：Yes, you must.\n明确不必做：No, you needn’t.\n若规则明确不准做，可以说明You mustn’t…。不能只看到Must I…?就预定回答No，也不能从一个问句自行猜出要求。'],
 ['特殊问句','What must we do?：我们必须做什么？\nWhat must I do?：我应该做什么？\n疑问词What在前，接must、主语和动作原形do。What询问要做的任务；we指我们，I指提问者自己。这里不是问物品的位置。'],
 ['动作指令与顺序','Come in, Amy. / Shut the door, please.\n本课指令通常省略you，从动作原形开头，可以表达邀请、请求等，并不都是生气的命令。please使请求更礼貌。\nThen put these clothes in the wardrobe. / Then make the bed.\nthen提示后续动作，排序题以课文为准，不意味着现实整理房间只有一种顺序。听见指令也不证明动作已经完成。'],
 ['动作、状态和代词','The cup isn’t empty. → Empty it!\n前句empty说杯子的状态，后句Empty是倒空的动作；it回指单个杯子。复数物品可以用them承接。\nThe book’s new. / Amy’s book\n前一句的’s是is，说明书的状态；后一句的’s表示艾米的，说明所属。\nThis bedroom’s very untidy.中的’s是is；Mrs. Jones’s bedroom中的’s表示所属。untidy是不整齐，不能直接推出这个人懒惰，也不等同于dirty。'],
 ['搭配要看对象','Open／Shut the book：打开／合上书。Turn on／off the lamp：开／关灯。\nPut on／Take off your shirt：穿上／脱下衬衫。Put the clothes in the wardrobe：把衣服放进衣柜。\nair the room：让房间通风；dust the dressing table：掸去灰尘；make the bed：整理床铺，不是制造床。clothes是复数形式，不写a clothes。'],
 ['带读与拓展边界','导学补充must与have to的使用倾向，不把“个人意愿／外部要求”当作二者互斥的绝对判错规则；本课只要求给定must结构的表达。have to的时态和疑问变化由后续课程系统学习。\n导学的un-词缀、open／air其他词性、on the air等短语可由老师选读，不扩张成无关词汇或时态考试。读read this book时read是原形/riːd/。图鉴音标和整句发音由老师带读，本版无英语配音。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第30课'),node('p','35幅图按原9组动作排列；同组的成对动词表示不同操作，不要求同时做。'));
 book.append(node('h4','课文表达'));for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn,'writing-example'));
 const card=node('article','','reference-card gallery-current'),controls=node('div','','reference-pager'),count=node('span');const back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(8,saved)):0;
 function show(){const group=unit.learning.GALLERY[index];card.replaceChildren(node('h4',group.title));const grid=node('div','','action-gallery');for(const item of group.items){const part=node('article','','action-picture'),img=node('img');img.src=item.image;img.alt=item.cn;part.append(node('small','图 '+item.number),img,node('p',item.en),node('p',item.cn));grid.append(part);}card.append(grid);count.textContent=(index+1)+' / 9';back.disabled=index===0;next.disabled=index===8;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls,node('p','Open your desk.在这里指打开带活动桌盖的课桌。Sweep the kitchen／living room／bedroom指扫该房间的地面。炉灶和刀具用图片卡练习，实际操作由成人处理。','reference-note'));
 const aExample='Example: The cup isn’t empty. Empty it!';
 book.append(node('h4','A · 把问题变成行动'),node('p',aExample,'writing-example'));const aAnswers=node('ol');for(const item of unit.learning.REFERENCE)aAnswers.append(node('li',item.prompt+' → '+item.en));book.append(aAnswers);
 book.append(node('h4','B · 自由搭配任务卡'),node('p','从两个词库中选合理搭配，不按同一行配对。原例Shut the door!之外，再写十一句，合理答案可以不同。','reference-note'));
 function bank(){const div=node('div','','writing-bank');div.append(node('p','动作库：'+unit.learning.WRITING_VERBS.join(' · ')),node('p','物品库：'+unit.learning.WRITING_NOUNS.join(' · ')));return div;}
 book.append(bank());const examples=node('details','','offline-task');examples.append(node('summary','看看一种搭配'),node('p','Example: Shut the door!','writing-example'));const modelList=node('ol');for(const text of unit.learning.MODELS)modelList.append(node('li',text));examples.append(modelList);book.append(examples);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 29–30 · 纸笔小练习'),node('p','跟老师读课文，两人轮流问What must I do?，用图片卡给任务并做安全的模拟动作。'));
 writing.append(node('h4','A · 根据给定情况写动作指令'),node('p',aExample,'writing-example'));
 const a=node('ol','','writing-a');for(const item of unit.learning.REFERENCE){const li=node('li',item.prompt);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 writing.append(node('h4','B · 从两个词库中自由搭配，写十一句指令'),node('p','不是按同一行配对，合理搭配可以不同。','reference-note'),bank(),node('p','Example: Shut the door!','writing-example'));
 const b=node('ol','','writing-b');for(let i=0;i<11;i++){const li=node('li');li.append(node('div','','writing-rule'));b.append(li);}writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit2930References={mount};
})(globalThis.CanranCore);
