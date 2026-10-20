(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
  ['问身份和问职业','Who is this man? He is Jim.\nWho are those women? They are my friends.\nWhat are their jobs? They are teachers.\nWho在本课用来问人物身份、姓名或关系；What…job(s)?明确问职业。what也能问别的信息，不能一律解释成职业。'],
  ['不规则复数','man → men；woman → women；child → children\nfoot → feet；tooth → teeth；mouse → mice\npoliceman → policemen；policewoman → policewomen；milkman → milkmen；postman → postmen\nEnglishman → Englishmen；German → Germans。German不是man构成的复合词。housewife → housewives；不能把所有f／fe结尾的词都这样变。'],
  ['词形相同，数量仍不同','one sheep / two sheep；one deer / two deer；one fish / two fish\none Chinese / two Chinese；one Japanese / two Japanese；one yuan / two yuan\none dollar / two dollars；one pound / two pounds\nThis fish is small. These fish are small.\nfish常用同形复数，词典也收录fishes；fishes可见于谈多种鱼的语境，不把其他用法一律判错。'],
  ['群体与单个成员','People are here. The police are here. The cattle are in the field.\n这里people表示人们，police表示警察群体，cattle表示牛群，按复数使用。一个人可说a person，一名警察可说a police officer，用cattle计一头牛可说a head of cattle。\npeople表示民族或文化群体时另有a people／peoples的用法。不能把本组规则推广到team等所有集合名词。'],
  ['国民总称和专名','the English、the British、the French、the Chinese、the Japanese、the Swiss表示国民群体时，按复数使用。例如The Chinese are here.\nThe United States is a country. The United Nations is an organization.\nUnited States和United Nations在这里分别指一个国家、一个组织，按单数处理。国籍不能作为判断勤奋、懒惰或其他性格的依据。'],
  ['有s也可能用单数','Maths is interesting. Physics is interesting. The news is good.\nmaths、physics、politics表示学科时按单数处理；news表示消息也用单数。\nThe Arabian Nights is a very interesting story-book.\n一本书、一部作品的名称即使有复数词，作为一个整体时仍可用单数。'],
  ['眼镜、裤子和衣服','These glasses are new. These trousers are long.\nThis pair of glasses is new. These two pairs of glasses are new.\nglasses在这里指眼镜，trousers指裤子；用pair／pairs计数时，be跟pair的数量一致。glass作玻璃杯是另一种含义。\nThese clothes are clean. clothes表示衣服，按复数使用，不说a clothes；衣服不一定是两部分组成。'],
  ['有特定含义的词形','good作形容词表示好的；goods表示货物，用复数。\nwater可指水；coastal waters指沿海水域。fishes可见于谈多种鱼的语境。\n结合当前含义选词，不把任何词尾s都当作多件同样物品。'],
  ['主语、物主与整句改写','They are employees. Their office is here.\nWe are teachers. Our office is here.\nThat woman is a nurse. → Those women are nurses.\n先看说话人和所指对象，再核对代词、this／that、be、冠词及名词；物品数量不决定物主人数。'],
  ['正式问候与人物评价','初次正式见面时，How do you do?通常也用How do you do?回应。\nThey aren’t very busy!只说他们不很忙，不能推出他们懒惰。原文They’re very lazy.是Jackson对Michael和Jeremy的评价，不是对某种职业或性别的普遍结论。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第18课'),node('p','原图中的数字用于课堂跟读，不是画中人数。职业和人物信息根据题目资料判断，不按衣着或性别猜。'));
 function pager(items,kind,key,render){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span');const back=node('button',kind==='gallery-current'?'上一幅职业图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一幅职业图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(items.length-1,saved)):0;function show(){card.replaceChildren();render(card,items[index],index);count.textContent=(index+1)+' / '+items.length;back.disabled=index===0;next.disabled=index===items.length-1;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 const numbers=[100,200,300,400,500,600,700,800,900,1000,1001,1002,1003,1004,1005];
 book.append(node('h4','职业图册 · 15幅图'),node('p','What are their jobs?'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.en;card.append(node('small',numbers[i].toLocaleString('en-US')),im,node('p',item.single+' → '+item.plural));});
 book.append(node('h4','完整问答 · 10组'),node('p','Example: (mechanics) / sales reps\n'+unit.learning.MODEL_EXAMPLE.en,'writing-example'));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.right;card.append(im,node('p','('+item.wrong+') / '+item.right),node('p',item.en));});
 book.append(node('h4','He、She、We还是They'),node('p','Example: Those men are lazy. ___ are sales reps.\nThose men are lazy. They are sales reps.','writing-example'),node('p','第4题office assistant指课文中的Jim，第5题Nicola指课文中的Nicola Grey；根据已介绍的人物作答，不从职业猜性别。'));
 const answers=node('ol');unit.learning.REFERENCE.forEach(item=>answers.append(node('li',item.en)));book.append(answers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 17–18 · 纸笔小练习'),node('p','课堂跟老师读完整课文和职业词，交换介绍者与访客角色。先问人物身份，再询问职业。'));
 writing.append(node('h4','A · 用He、She、We或They填空'),node('p','Example: Those men are lazy. ___ are sales reps.\nThose men are lazy. They are sales reps.','writing-example'),node('p','第4题指课文中的Jim，第5题指课文中的Nicola Grey。','reference-note'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li'),parts=item.prompt.split('___'),blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(document.createTextNode(parts[0]),blank,document.createTextNode(parts[1]));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 写出职业问句、选择问句和回答'),node('p',"Example: (mechanics) / sales reps\nWhat are their jobs?\nAre they mechanics or sales reps?\nThey aren't mechanics. They're sales reps.",'writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li','('+item.wrong+') / '+item.right);for(let i=0;i<4;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit1718References={mount};
})(globalThis.CanranCore);
