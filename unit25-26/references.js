(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['the：双方能确定是哪一个','There is a refrigerator in the kitchen. The refrigerator is white.\n先介绍一台冰箱，再说同一台，所以第二句用the。\nPlease close the door. 如果双方都知道指哪扇门，第一次提到也能用the。核心是指向明确，不是机械数出现次数。'],
 ['用位置或上下文指清楚','Give me the cup on the table.\n在杯子中，位置限定了桌上的那只。如果桌上仍有多只，而要求只拿一只，还需要继续确认；加了the本身不会凭空补足事实。'],
 ['导学中的the搭配','the sun／the moon／the earth：本语境里明确的太阳、月亮、地球。\non the left／right；in the middle：本课完整方位搭配。\nthe best book／the first book：最好的书／第一本书。best和first的词形可先由老师提供，这里认识冠词搭配，不提前学习整套最高级或序数词变化。\nmy first book也正确，my已经限定，不能再写成the my first book。'],
 ['固定表达要看含义','go to bed：去睡觉；go to school：去上学。这里说活动，不是特指走到哪张床或哪所建筑。\nplay the piano：弹钢琴，是本课采用的常见搭配。\n不能把the当作所有名词前都必须添加的词，也不能把这里的活动说法套到所有建筑或物品描述。'],
 ['Where问位置','Where is it? / Where is the cup?\nIt is in the cupboard.\n在上下文清楚时，也可以回答In the cupboard.。Where问在哪里，不是问颜色或空满。\nWhose问归属，What colour问颜色；不要只因都是问句就混用。'],
 ['in与on：里面、表面','There is a spoon in the cup.\nThere is a fork on the tin.\nin说明在容器内部或某个区域内；on在本课说明与表面相接。\n刀在盘子上、叉子在罐子上；瓶子在冰箱里、勺子在杯子里。看真实位置，不只比较物品在图上画得高低。'],
 ['状态与位置分开','The plate is clean.说明盘子干净。The bottle is empty.说明瓶子空着。\n干净不等于空，空也不等于脏；没有说出的性质不能由另一个形容词推断。Where问位置，要回答在哪里，不能只回答颜色或空满。'],
 ['in不总是“在里面”','in the kitchen：在厨房里。\nin a blue coat：穿着蓝色外套。\nin English：用英语。\n先看与in一起出现的词，不能逐字统一翻成“在里面”。'],
 ['跟老师扩展in的其他用法','导学还列出in the water（在水中）、in 1993（在1993年）、in an hour（过约一小时）、in good health（身体健康）、in tears（流着泪）、in the rain（在雨中）、in pencil（用铅笔）、in the army（在军队服役）。\n这些补充用法保留在参考中，由老师按需要带读；本课不增加过去时、将来时、时间计算或职业扩展考试。in加一段时间有不同语境，不能一律教成“必须在这个期限以内”。'],
 ['介绍有，再接着说它','There is a bottle on the table. It is empty.\nThere is介绍存在，It继续指刚说的瓶子。There is可以缩写为There’s；It’s是It is，二者不能只因都带’s就互换。\nMrs. Smith’s kitchen里的’s说明所属，是史密斯太太的厨房，不是is的缩写。'],
 ['按真实有无回答','Is there a spoon in the cup?\n有：Yes, there is.\n没有：No, there isn’t.\n先给清楚事实再回答。There is a cup只说明有杯子，不说明只有杯子，也不说明它干净或空着。'],
 ['读音、人物和课堂材料','Mrs.在本课是对史密斯太太的称呼，不等于妈妈。electric cooker是电炉，不是电饭煲；cooker不是厨师。\n词卡音标为美式单独认读，a／an／the／of在连读中还会有弱读，不要求每次逐字强读。\n原文是厨房介绍，没有史密斯太太与访客的对话。练习中的找杯子和问勺子另属练习情境。课堂使用安全餐具图片、杯子或纸盒，不要求操作真实电炉或锋利刀具。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第26课'),node('p','每页一幅图，原数字用于课堂跟读，不是物品数量。'));
 function pager(items,kind,key,render){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span'),last=items.length-1;const back=node('button',kind==='gallery-current'?'上一组物品图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一组物品图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(last,saved)):0;function show(){card.replaceChildren();render(card,items[index],index);count.textContent=(index+1)+' / '+(last+1);back.disabled=index===0;next.disabled=index===last;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 book.append(node('h4','介绍、接续和位置问答'));for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn,'writing-example'));
 book.append(node('h4','厨房图册 · 8幅图'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(node('small',((i+3)*1000).toLocaleString('en-US')),im,node('p',item.en),node('p',item.cn));});
 const bExample="Example: refrigerator in the kitchen / white\n"+unit.learning.MODEL_EXAMPLE.en;
 book.append(node('h4','完整双句 · 7组'),node('p',bExample,'writing-example'),node('p','勺子只在8幅图示中出现，不是第8道Written B原题。','reference-note'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.subject+' '+item.prep+' the '+item.place;card.append(im,node('p',item.subject+' '+item.prep+' the '+item.place+' / '+item.adjective),node('p',item.en));});
 const example='Example: Give me ___ book. Which book? ___ book on the table.\nGive me a book. Which book? The book on the table.';
 book.append(node('h4','a还是the'),node('p',example,'writing-example'),node('p','第3题约定：桌子是双方都知道的那张。a table在其他语境也可成立，不把本题约定当作所有句子的唯一规则。','reference-note'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 25–26 · 纸笔小练习'),node('p','跟老师读原文。用杯子、盒子或图片卡介绍有什么、询问在哪里，再交换角色。'));
 writing.append(node('h4','A · 用a或the填空'),node('p',example,'writing-example'),node('p','第3题约定：桌子是双方都知道的那张。','reference-note'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li');item.prompt.split('___').forEach((part,i)=>{if(i){const blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(blank);}li.append(document.createTextNode(part));});a.append(li);});writing.append(a);
 writing.append(node('h4','B · 按物品、位置和状态写两句话'),node('p',bExample,'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.subject+' '+item.prep+' the '+item.place+' / '+item.adjective);for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit2526References={mount};
})(globalThis.CanranCore);
