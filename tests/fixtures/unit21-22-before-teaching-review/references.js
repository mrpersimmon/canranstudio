(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['谁做事、给谁','I → me；you → you；he → him；she → her\nit → it；we → us；they → them\nI am Jane. Give me a book, please.\nHe is Ben. Give him a cup, please.\n主语说明谁做事；宾语可指动作涉及的人或物。本课主要练Give后面的接收者；宾格也可出现在Look at them.等表达中，不只表示收东西的人。'],
 ['先找出说的是谁','Give us a book.中的us包括说话的人。\nGive them a book.中的them需要回看前面提到的人或物。\nyou可以指一人或多人，不从物品数量判断。him／her在本课有明确人物依据，不从职业、服装或物品猜。'],
 ['给谁和谁的','Give him his book. 第一个him说给他，his book说他的书。\nGive her her book. 第一个her说给她，第二个her说明她的。\nGive them their books. them是接收者，their说明书属于谁。\nOur pens are blue.只表示我们的笔是蓝的；Our的依据是说话的人，不是pens的复数。'],
 ['怎样提出请求','Give me a book, please.\nGive her a clean cup, please.\n本课先练Give＋接收者＋物品。Give the book to her.也是正确表达；指定顺序题只练其中一种，不把其他合法语序说成普遍错误。祈使句通常省略主语you，不是永远不能有主语。'],
 ['在已知范围里问哪一个','Which book? Which book do you want?\nWhich cups do you want?\nwhich在这里用于从已知物品中确认选择，可跟单数或复数名词。它也可以询问人，如Which teacher?，不是只能问物品。\nWhich box?问哪只；Whose box is it?问谁的；How many boxes?问多少只，信息目标不同。'],
 ['one和ones','Which book? The red one.\nWhich books? The red ones.\none替代一个可数物品，ones替代多个；本课one不是数字“一”。名词已经明确时可用Which one?／Which ones?避免重复。不可把这个用法直接套在不可数的water上。'],
 ['先排除，再说要哪件','No, not this empty one. That full one.\n这是指定不要近处空杯、要远处满杯的练习情境。this／that要随说话者与物品位置判断，不能照抄课文的not that one。\n如果两件都符合large，仍需确认其他条件；不能任意选一件交出去。'],
 ['属性与冠词','an empty glass；a full glass；an old tin；a new tin\n冠词看紧挨着的词的起始音，不是只看后面的glass或tin。空满、大小、新旧和锋利程度是不同属性，不互相推断。'],
 ['完整故事与练习假设','课文明确男士要红书，第一次否定、第二次肯定；没有用文字说明第一次举起的书是什么颜色。舞台用浅色书表示未选中的候选，不把具体颜色当教材考点。\n第22课Written B的blue／red是它自己的例题。课堂可用书、杯子和物品卡交接；刀具词义用图片说明，不要求孩子拿真实刀具做交接。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第22课'),node('p','每页两幅图，原数字用于课堂跟读，不是物品数量。'));
 function pager(items,kind,key,render,size=1){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span'),last=Math.ceil(items.length/size)-1;const back=node('button',kind==='gallery-current'?'上一组物品图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一组物品图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(last,saved)):0;function show(){card.replaceChildren();for(let i=index*size;i<Math.min(items.length,(index+1)*size);i++){const part=node('div');render(part,items[i],i);card.append(part);}count.textContent=(index+1)+' / '+(last+1);back.disabled=index===0;next.disabled=index===last;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 book.append(node('h4','接收者 · 五种说法'));for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));
 book.append(node('h4','物品图册 · 16幅图'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(node('small',(1001+i).toLocaleString('en-US')),im,node('p',item.en),node('p',item.cn));},2);
 book.append(node('h4','完整问答 · 8组'),node('p','Example: book / (this blue) / that red\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.right;card.append(im,node('p',item.subject+' / (this '+item.wrong+') / that '+item.right),node('p',item.en));});
 const example="Example: Is this Tim's shirt? No, it's not. ___ shirt is white.\nIs this Tim's shirt? No, it's not. His shirt is white.";
 book.append(node('h4','His、Her、Our还是Their'),node('p',example,'writing-example'),node('p','Nicola和Helen是女士；第2题由两位同学一起回答，说的是他们自己的笔。','reference-note'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 21–22 · 纸笔小练习'),node('p','跟老师读课文，用书、杯子或物品卡练习请求、确认和交接。说得不够清楚时，再问一句。'));
 writing.append(node('h4','A · 用His、Her、Our或Their填空'),node('p',example,'writing-example'),node('p','Nicola和Helen是女士；第2题两位同学一起回答。','reference-note'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li'),parts=item.prompt.split('___'),blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(document.createTextNode(parts[0]),blank,document.createTextNode(parts[1]));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 写出请求、确认、改选与交接对话'),node('p','Example: book / (this blue) / that red\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.subject+' / (this '+item.wrong+') / that '+item.right);for(let i=0;i<6;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit2122References={mount};
})(globalThis.CanranCore);
