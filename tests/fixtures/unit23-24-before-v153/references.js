(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 [
  "on与表面",
  "The glasses are on the shelf. 杯底放在搁板上。\nThe picture is on the wall. 画挂在墙面上。\nThe drawing is on the blackboard. 画在黑板表面上。\non不只用于水平台面；这里强调与所说表面相接。画在桌子上方、但放在另一块搁板上的书，不叫on the desk。"
 ],
 [
  "哪一组、在哪里",
  "Which glasses? The ones on the shelf.\nones代替前面提到的glasses，on the shelf缩小寻找范围。Which ones?是问选哪些，不是问主人是谁。若架子上仍有两组，就继续确认；不能任意选一组。"
 ],
 [
  "some、one和ones",
  "a glass → Which one?\nsome glasses → Which ones?\nsome表示一些，没有指定精确数目。它也能与不可数名词搭配，如some water（一些水），不能教成some后永远只能用复数。one／ones在这里替代可数物品，不直接替代water。"
 ],
 [
  "these和those",
  "These glasses? / No, not those.\n近处、远处要从当前说话人的位置判断，同时核对是一件还是多件。简手边的杯子可叫these；另一边男士说those，不是固定把某组杯子命名为these。"
 ],
 [
  "整句变复数",
  "The box on the floor is big.\nThe boxes on the floor are big.\n名词box变boxes，is变are，位置短语和形容词big保持不变。不能只改名词或给所有词加-s。"
 ],
 [
  "给谁，不等于谁的",
  "Give him this book. / Give her this watch. / Give them these books.\n接收者明确后再选宾格。Tim和Tom在本练习中是男孩，Jane是女士。第24课A4–A6明确设定为物主请求把自己的物品递回；仅知道某物是谁的，并不能自动推断要把它递给谁。"
 ],
 [
  "否定不等于另一个答案",
  "No, not those on the table.只排除桌上的那组。\n还可能要架子上、地板上或其他位置的物品，需要后续说明。不是一说“不要桌上的”就一定要架子上的。"
 ],
 [
  "课本与画面",
  "故事文字指定架子上的玻璃杯；舞台把另一候选组放在桌面，每组画三只来让交接看得清。some不等于“三只”，具体杯数不设为考点。托盘是安全呈现交接的辅助道具，不是新增词汇考点。\n香烟只保留中性词义和课本图示；课堂用书、笔、纸盒或图片卡练习，不安排吸烟或拿取香烟的操作。"
 ]
];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第24课'),node('p','每页一幅图，保留课本原数字用于跟读；这些数字不是物品数量。'));
 function pager(items,kind,key,render,size=1){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span'),last=Math.ceil(items.length/size)-1;const back=node('button',kind==='gallery-current'?'上一组物品图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一组物品图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(last,saved)):0;function show(){card.replaceChildren();for(let i=index*size;i<Math.min(items.length,(index+1)*size);i++){const part=node('div');render(part,items[i],i);card.append(part);}count.textContent=(index+1)+' / '+(last+1);back.disabled=index===0;next.disabled=index===last;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 book.append(node('h4','请求与确认 · 六种说法'));for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));
 book.append(node('h4','物品图册 · 10幅图'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.cn;card.append(node('small',Number(['1117','1218','1319','1420','1521','1622','1723','1824','1925','2000'][i]).toLocaleString('en-US')),im,node('p',item.en),node('p',item.cn));},1);
 book.append(node('h4','完整问答 · 10组'),node('p','Example: glasses / on the shelf\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.subject+' on the '+item.place;card.append(im,node('p',item.subject+' / on the '+item.place),node('p',item.en));});
 const example='Example: Give Tim this shirt. Give ___ this one, too.\nGive Tim this shirt. Give him this one, too.';
 book.append(node('h4','him、her、them、me或us'),node('p',example,'writing-example'),node('p','Tim和Tom是男孩，Jane是女士。A4–A5由物主本人请求递回；A6由两位物主一起请求递回雨伞。','reference-note'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 23–24 · 纸笔小练习'),node('p','跟老师读课文，用书、笔、纸盒或图片卡练习确认哪一些及所在位置。香烟只认词和看图，不作实际拿取练习。'));
 writing.append(node('h4','A · 用him、her、them、me或us填空'),node('p',example,'writing-example'),node('p','Tim和Tom是男孩，Jane是女士。A4–A5由物主本人请求递回；A6由两位物主共同请求递回。','reference-note'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li'),parts=item.prompt.split('___'),blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(document.createTextNode(parts[0]),blank,document.createTextNode(parts[1]));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 按物品和位置写出三轮问答'),node('p','Example: glasses / on the shelf\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.subject+' / on the '+item.place);for(let i=0;i<5;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit2324References={mount};
})(globalThis.CanranCore);
