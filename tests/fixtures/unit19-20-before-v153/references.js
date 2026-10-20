(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['某处有谁、有什么',"There is a boy in the park. There are two children by the bench.\nThere is some water in the bottle.\nthere be表示某处存在人或物。可数单数和这里的不可数名词配is，复数配are。There’s是There is的缩写；不是They’re。\n导学还列出过去式was／were，本单元先练现在的is／are，不把过去式当成已经掌握的内容。"],
 ['说没有',"There isn’t an orange in the bag. = There is no orange in the bag.\nThere aren’t any oranges in the bag. = There are no oranges in the bag.\nThere isn’t any juice in the bottle. = There is no juice in the bottle.\n否定时在be后加not；本组表示完全没有时，也可以用no直接接名词。"],
 ['问有没有',"Is there a shop? Are there any chairs? Is there any water?\nYes, there is. / No, there isn’t.\nYes, there are. / No, there aren’t.\n一般疑问句把is／are放到there前。肯定简答末尾不缩写成Yes, there’s.。"],
 ['some、any与something',"There are some books. → There aren’t any books.\nThere is something new. → There isn’t anything new.\nIs there anything new?\n本课练习的是明确否定和不知道有没有的中性询问。some也可用于期待肯定回答、请求或提供的疑问句，不能写成所有疑问句都必须用any。"],
 ['问人、物、地点',"Who is in the room? What’s in the box?\n这类问法问某处的人或物，可以省去there，入门时常用is来提出未知对象；不能把所有who／what问句一律规定为单数。\nWhere is the cat? Where are the two children?\n已经知道对象而询问地点，用Where，is／are跟已知对象的单复数一致。"],
 ['问多少',"How many books are there in the bag?\nHow much water is there in the bottle?\n可数名词用How many＋复数名词＋are there；即使答案只有一本，问题仍这样问。不可数名词用How much＋名词＋is there。\n本课how much问数量，不是询问价格。"],
 ['说清状态',"Those children are tired. Their mother is tired, too.\nThey’re clean. They aren’t dirty. = They’re not dirty.\nchildren是复数，their mother仍是一个人。形容词不随复数加s。否定一种状态不能自动推出相反状态。"],
 ['看对象理解词义',"old hats：旧帽子；old people：年老的人。\nshort trousers：短的裤子；short men：矮个男士。\nlight cases：轻的箱子；小箱子也可能很重。\nLook at them!中的them要回到前文找所指的人或物。"],
 ['原故事与课堂练习',"What’s the matter?用来询问怎么了。Sit down here.邀请对方坐下。\n原故事中的孩子又累又渴；书写B第1题却要求否定tired、肯定thirsty，它是另一份指定情境。two ice creams指两份冰淇淋。\n保留教材情节，不把冰淇淋当作解渴建议。不用胖瘦、年龄或职业给同学作好坏评价。"]
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第20课'),node('p','数字用于课堂跟读，不是画中人数。根据题目给出的状态作答，不由一个否定词猜另一种状态。'));
 function pager(items,kind,key,render,size=1){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span');const back=node('button',kind==='gallery-current'?'上一幅对比图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一幅对比图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(Math.ceil(items.length/size)-1,saved)):0;function show(){card.replaceChildren();for(let i=index*size;i<Math.min(items.length,(index+1)*size);i++){const part=node('div');render(part,items[i],i);card.append(part);}count.textContent=(index+1)+' / '+Math.ceil(items.length/size);back.disabled=index===0;next.disabled=index===Math.ceil(items.length/size)-1;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 const numbers=[105,106,217,218,321,322,433,434,545,546,657,658,769,770,881,882,998,999,1000,1001];
 book.append(node('h4','对比图册 · 20幅图'),node('p','Look at them!'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(node('small',numbers[i].toLocaleString('en-US')),im,node('p',item.en),node('p',item.cn));},2);
 book.append(node('h4','完整问答 · 10组'),node('p','Example: his shoes / (dirty) / clean\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.right;card.append(im,node('p',item.subject+' / ('+item.wrong+') / '+item.right),node('p',item.en));});
 book.append(node('h4','am、is还是are'),node('p','Example: Those children ___ thirsty.\nThose children are thirsty.','writing-example'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 19–20 · 纸笔小练习'),node('p','跟老师读课文，分角色询问状态、请求和道谢。交换角色再练一遍。'));
 writing.append(node('h4','A · 用am、is或are填空'),node('p','Example: Those children ___ thirsty.\nThose children are thirsty.','writing-example'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li'),parts=item.prompt.split('___'),blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(document.createTextNode(parts[0]),blank,document.createTextNode(parts[1]));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 按给定的状态写问句和回答'),node('p',"Example: his shoes / (dirty) / clean\nAre his shoes dirty or clean?\nThey're not dirty. They're clean.",'writing-example'),node('p','括号内的状态用于否定，最后一项用于肯定；这是每题给定的信息，不是由否定自动推断。','reference-note'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.subject+' / ('+item.wrong+') / '+item.right);for(let i=0;i<4;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit1920References={mount};
})(globalThis.CanranCore);
