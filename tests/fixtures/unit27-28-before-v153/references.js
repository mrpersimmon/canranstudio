(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['some：不确定的数量','There are some magazines on the television.\nThere is some water in the glass.\nsome既可搭配复数物品，也可搭配不可数物质。water和milk在这里不可数，用There is；不能见到some就机械选are。some不说明确切数量，本课不从some推断“其余一定没有”。'],
 ['any：普通询问与完全否定','Are there any plates in the cupboard?\nThere aren’t any plates on the table.\n普通询问有没有，常用any；完全否定也常用any。否定范围跟着地点和物品：桌上没有盘子，不等于房间里没有盘子，也不等于桌上什么都没有。'],
 ['问句也可以用some','Is there some milk in the fridge?\n导学原例：说话者期待冰箱里有牛奶，带着肯定预期询问。fridge就是refrigerator。some不是肯定句的专属词；any也可用于中性的有无提问。练习按给定语境判断，不把另一种语气的合法表达说成普遍语法错误。'],
 ['near、on与in','The stereo is near the door.\nThere are some books on the stereo.\nThey’re in that handbag.\nnear说明靠近，不要求接触；on在本课说明表面位置，in说明内部。票在包里，包在架子上时，可以说票在架子上，也可进一步说明在包里。'],
 ['near还可以说明接近状态','He was near tears.\n这是导学的原例，意为他几乎要哭了。was是过去形式，tears是眼泪；此处保留原例供带读，不增加过去时考试。线上用is练习同一含义。不能把near tears逐字理解为站在眼泪旁边。\n导学near the railway station／near the school是位置用法；far and near、near at hand保留为老师可选带读词组。'],
 ['There are与They are','There are some armchairs in the room. The armchairs are near the table.\nThere are先介绍有什么；They are接着说前面的复数物品。They’re是They are的缩写，不能和there互换。'],
 ['单数变复数','a book → some books；a man → some men；a housewife → some housewives\na knife → some knives；a policeman → some policemen\nThere is a book on the desk. → There are some books on the desk.\n数量、限定词、名词和动词一起改变；原来的地点仍保留。trousers本身用复数形式，不给它再加s。'],
 ['先问有没有，再问在哪里','Are there any books in the room?\nNo, there aren’t any books in the room. There are some magazines.\nWhere are they? They’re on the television.\n若确实有书，就回答Yes, there are.。不能只因例句用了No就一律否定。Where问位置，Whose问归属，Which ones问哪一些。'],
 ['课堂带读','原文是13句客厅介绍，没有额外的太太与访客对白。第28课问答是另设练习场景，不拿它覆盖第27课事实。图示数字用于跟老师认读，不是图中物品个数。保留教材香烟例图供辨识，不安排真实物品操作或吸烟行为；课堂可用图片、安全文具练习。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第28课'),node('p','每页一幅图，原数字用于课堂跟读，不是物品数量。'));
 function pager(items,kind,key,render){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span'),last=items.length-1;const back=node('button',kind==='gallery-current'?'上一组物品图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一组物品图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(last,saved)):0;function show(){card.replaceChildren();render(card,items[index],index);count.textContent=(index+1)+' / '+(last+1);back.disabled=index===0;next.disabled=index===last;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 book.append(node('h4','介绍、接续和位置问答'));for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn,'writing-example'));
 const numbers=['1,120','2,230','3,340','4,450','5,560','6,670','7,780','8,890','9,999','10,001'];
 book.append(node('h4','物品位置图册 · 10幅图'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(node('small',numbers[i]),im,node('p',item.en),node('p',item.cn));});
 const bExample='Example: '+unit.learning.MODEL_EXAMPLE.prompt+'\n'+unit.learning.MODEL_EXAMPLE.en;
 book.append(node('h4','完整五轮问答 · 10组'),node('p','这些是另设的练习场景，题目约定所问物品没有，实际物品及位置由后两项给出。','reference-note'),node('p',bExample,'writing-example'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(im,node('p',item.prompt),node('p',item.en));});
 const examples='a book — some books; a man — some men; a housewife — some housewives\nExample: There is a book on the desk.\nThere are some books on the desk.';
 book.append(node('h4','把一句变成复数'),node('p',examples,'writing-example'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 27–28 · 纸笔小练习'),node('p','跟老师读原文。用图片布置房间，一人问有没有，另一人按事实回答，再问在哪里。'));
 writing.append(node('h4','A · 用There are把单数句改成复数句'),node('p',examples,'writing-example'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li',item.prompt);li.append(node('div','','writing-rule'));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 根据词组写出五轮问答'),node('p','另设练习场景：先否定括号里所问的物品，再介绍实际有的物品，并问答位置。','reference-note'),node('p',bExample,'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.prompt);for(let i=0;i<5;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit2728References={mount};
})(globalThis.CanranCore);
