(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const ref=node('details','','offline-task');ref.append(node('summary','语法小参考'),node('p','What colour is your hat?询问帽子的颜色；What colour’s是What colour is。一件物品也可能有两种颜色：It’s grey and black. 两个箱子可说two cases，询问它们的颜色：What colours are these cases?'),node('p','本课练习祈使句的常见形式：用动词原形开始，通常不写出主语，如Come upstairs.／Look!。否定用Don’t加动词原形，如Don’t open the door.（不要开门。）'),node('p','Come upstairs and see it.按课文用and连接两个动作。Come to也能在适合的语境中表达来做某事的目的，不能把to一概判错；指定使用and的练习按题目要求完成。'),node('p','Please可以使表达更客气，祈使句也可用于邀请。是否生气、是否礼貌，要联系说话情境，不只看动词开头。'),node('p','the same colour表示相同颜色；仍需要前面的色名或图才能知道具体颜色。too承接同一种性质，“也是新的”不能推出“也是绿色的”。'),node('p','smart在本课夸衣服时表示漂亮、时髦；不是在说衣服聪明。两句合并时保留物主：This is Helen. This is her dog. → This is Helen’s dog.'));
 surfaces.get('grammar').append(ref);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第14课'));
 const numbers=[20,30,40,50,60,70,80,90,100,101];
 function pager(items,kind,key,render){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span');const back=node('button',kind==='gallery-current'?'上一幅配色图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一幅配色图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(items.length-1,saved)):0;function show(){card.replaceChildren();render(card,items[index],index);count.textContent=(index+1)+' / '+items.length;back.disabled=index===0;next.disabled=index===items.length-1;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 book.append(node('p','课本原页数字20、30、40、50、60、70、80、90、100、101保留，课堂可跟老师读数；它们不表示图中物品的数量。每件物品按所给颜色观察。'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const image=node('img');image.src=item.image;image.alt=item.en;card.append(node('small',String(numbers[i])),image,node('p',item.en));});
 book.append(node('h4','完整问答 · 12组'),node('p',unit.learning.MODEL_EXAMPLE.en),node('p','物主的he／she按本练习给定资料使用，不凭名字或物品猜测。'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const image=node('img');image.src=item.image;image.alt=item.object;card.append(image,node('p',item.owner+' / '+item.object+' / '+item.colour),node('p',item.cn),node('p',item.en));});
 book.append(node('h4','两句合一句'),node('p',"This is Stella. This is her handbag.\nThis is Stella’s handbag.",'writing-example'));
 for(const item of unit.learning.REFERENCE)book.append(node('p',item.cn+'\n'+item.en,'writing-example'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 13–14 · 纸笔小练习'),node('p','课堂跟老师读课文，用虚构人物与物品资料问颜色、发出邀请和提醒，不必介绍自己的衣物。'));
 writing.append(node('h4','A · 把两句合成一句'),node('p',"Example: This is Stella. This is her handbag.\nThis is Stella’s handbag.",'writing-example'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li',item.cn);li.append(node('div','','writing-rule'));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 用 ’s、his 或 her 问颜色并回答'),node('p',"Example: Steven / umbrella / black\nWhat colour’s Steven’s umbrella? His umbrella’s black.",'writing-example'),node('p','按给定he／she物主卡完成问答，保留每件物品的全部颜色。'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.owner+' / '+item.object+' / '+item.colour+' · '+(item.possessive==='his'?'he':'she'));for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit1314References={mount};
})(globalThis.CanranCore);
