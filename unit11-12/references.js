(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const ref=node('details','','offline-task');ref.append(node('summary','语法小参考'),node('p','Who问是谁，Whose问是谁的。Whose shirt is this?与Whose is this shirt?都可询问这件衬衫的主人。物品已经明确时，还可说Whose is it?。'));
 const table=node('div','','pronoun-reference');for(const [from,to]of [['I','my'],['you','your'],['he','his'],['she','her'],['it','its'],['we','our'],['they','their']]){const row=node('div');row.append(node('span',from),node('span',to));table.append(row);}ref.append(table,node('p','物主词放在物品名称前：my shirt／her coat／our room。mine可替代my加物品名称：It’s my pen. → It’s mine. 本课的It’s是It is，its表示“它的”，不加撇号。'),node('p','单个物主：the girl’s bag；以s结尾的复数物主：the girls’ bag。看的是物主数量，不是物品数量。物品已明确时可省略：It’s Tim’s. 所有格不变。'),node('p','同一间房共同拥有：Jo and May’s room。两件外套各自拥有：Jo’s and May’s coats。题目先给清楚共同或各自的关系，再选择写法。'),node('p','Tim’s shirt’s white. 第一个’s表示Tim的，第二个’s在本句中表示is。不是每个’s都能展开成is。否认“不是我的”与“也许是他的”，都不能确认另一位物主。'));
 surfaces.get('grammar').append(ref);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第12课'),node('p','课本图22–31：按给定的物品与物主观察，不凭身边站着谁猜归属。'));
 const grid=node('div','','reference-grid');unit.learning.MODELS.slice(0,10).forEach((item,i)=>{const card=node('article','','reference-card'),im=node('img');im.src=item.image;im.alt=item.object;card.append(node('small',String(i+22)),im,node('p',item.object),node('p',"It’s "+item.owner+"’s."));grid.append(card);});book.append(grid,node('h4','书写示范 · 12组'),node('p',unit.learning.MODEL_EXAMPLE.en));
 const current=node('article','','reference-card model-current'),pic=node('img'),label=node('p'),words=node('p');current.append(pic,label,words);const pager=node('div','','reference-pager'),count=node('span');const previous=node('button','上一份档案','btn btn-yellow'),next=node('button','下一份档案','btn btn-green');previous.type=next.type='button';pager.append(previous,count,next);
 const saved=core.lesson49Practice.activity('unitModelPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(11,saved)):0;
 function show(){const item=unit.learning.MODELS[index];pic.src=item.image;pic.alt=item.object;label.textContent=item.object+' / '+item.owner;words.textContent=item.en;count.textContent=(index+1)+' / 12';previous.disabled=index===0;next.disabled=index===11;core.lesson49Practice.activity('unitModelPage',index);}previous.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(current,pager);
 for(const item of unit.learning.REFERENCE)book.append(node('p',item.en));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 11–12 · 纸笔小练习'),node('p','课堂跟老师读课文，交换说话人练习认领与归还。使用虚构家庭资料，不必披露自己的家庭信息。'));
 writing.append(node('h4','A · 用 my、your、his 或 her 填空'),node('p','Example: Hans is here. That is ___ car.\nHans is here. That is his car.','writing-example'));
 const a=node('ol','','writing-a');['Stella is here. That is ___ car.（车主Stella，she）','Excuse me, Steven. Is this ___ umbrella?（当面对Steven说话）','I am an air hostess. ___ name is Britt.（Britt自我介绍）','Paul is here, too. That is ___ coat.（物主Paul，he）'].forEach(text=>{const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 用 ’s、his 和 her 写问句及回答'),node('p',"Example: shirt / Tim\nWhose is this shirt? It’s Tim’s. It’s his shirt.",'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.object+' / '+item.owner+' · '+(item.possessive==='his'?'he':'she'));for(let i=0;i<3;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit1112References={mount};
})(globalThis.CanranCore);
