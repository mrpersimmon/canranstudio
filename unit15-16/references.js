(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const ref=node('details','','offline-task');ref.append(node('summary','语法小参考'),node('p','本课练习可数名词的规则复数。只看最后一个字母还不够，要核对具体词形；后面的例子不是所有名词的完整清单。'));
 const forms=[['一般加s','map → maps；handbag → handbags；case → cases；house → houses'],['本组s／sh／ch／x结尾加es','bus → buses；dress → dresses；brush → brushes；watch → watches；box → boxes；air hostess → air hostesses'],['辅音字母加y','baby → babies；city → cities'],['元音字母加y及专有名字','monkey → monkeys；holiday → holidays；key → keys；the Henrys（Henry一家）'],['o结尾按具体词形','photo → photos；piano → pianos；radio → radios；zoo → zoos；potato → potatoes；tomato → tomatoes；zero → zeros / zeroes'],['f／fe结尾按具体词形','roof → roofs；half → halves；knife → knives；leaf → leaves；wolf → wolves；wife → wives；life → lives；thief → thieves'],['可接受的不同写法','handkerchief → handkerchiefs；英式也可写handkerchieves。不能把合法变体互作错项。']];
 const formList=node('div','','plural-reference');for(const [title,text]of forms){const item=node('article');item.append(node('h4',title),node('p',text));formList.append(item);}ref.append(formList);
 const pronunciation=node('p','','pronunciation-note');
 for(const part of '拼写与读音分别看。跟老师读books /bʊks/、friends /frendz/、cases /ˈkeɪsɪz/、dresses /ˈdresɪz/。词尾/s/、/z/、/ɪz/由前面的音决定，网页无配音，不作为听力达标。'.split(/(\/[^/]+\/)/))pronunciation.append(part.startsWith('/')?node('span',part,'reference-phonetic word-phonetic'):document.createTextNode(part));
 ref.append(pronunciation);
 ref.append(node('h4','一般现在时的be与常见缩写'));
 const beRows=[['I am',"I'm","I'm not"],['You are（你）',"You're","You're not / You aren't"],['He is',"He's","He's not / He isn't"],['She is',"She's","She's not / She isn't"],['It is',"It's","It's not / It isn't"],['We are',"We're","We're not / We aren't"],['You are（你们）',"You're","You're not / You aren't"],['They are',"They're","They're not / They aren't"]];
 const beList=node('div','','be-reference');for(const [full,short,negative]of beRows){const item=node('article');item.append(node('h4',full),node('p','肯定：'+short),node('p','否定：'+negative));beList.append(item);}ref.append(beList);
 ref.append(node('p','本课be问句把am／is／are放到主语前。问两位本人Are you…?，他们一起答we；问朋友或物品则按所指对象答they。否定要有事实依据，不从衣着或长相猜国籍，也不把某国籍当作排除其他国籍的通用规则。'),node('p','We说“我们”；our后接物品，表示“我们的”。your可表示“你的”或“你们的”，要看听话人；物品变多不代表物主也变多。单数变复数的改写必须明确人物和物品怎样变化。'),node('p','Here they are.在递交护照时可表示“给您”；找到并指出箱子时可表示“在这儿”。they跟随上文的复数对象，不固定指护照，也不在任何场景都等同Here you are.。'),node('p','a／an用于本课单数可数名词，看紧随词的首音：an English car，a French car。改成多件时不能保留a／an。国籍形容词不因人多加s，如They are Danish.'));
 surfaces.get('grammar').append(ref);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第16课'),node('p','原页数字用于课堂跟读，不代表人物或物品的数量。国籍由虚构资料卡明确给出，不根据人物长相或服饰判断。'));
 const countries=node('div','','reference-grid');unit.learning.NATIONALITIES.forEach((item,i)=>{const card=node('article','','reference-card'),im=node('img');im.src=item.image;im.alt='';card.append(node('small',String([20,30,40,50][i])),im,node('p',item.cn),node('p',item.en));countries.append(card);});book.append(countries);
 function pager(items,kind,key,render){const card=node('article','','reference-card '+kind),controls=node('div','','reference-pager'),count=node('span');const back=node('button',kind==='gallery-current'?'上一幅出行图':'上一份问答','btn btn-yellow'),next=node('button',kind==='gallery-current'?'下一幅出行图':'下一份问答','btn btn-green');back.type=next.type='button';controls.append(back,count,next);const saved=core.lesson49Practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(items.length-1,saved)):0;function show(){card.replaceChildren();render(card,items[index],index);count.textContent=(index+1)+' / '+items.length;back.disabled=index===0;next.disabled=index===items.length-1;core.lesson49Practice.activity(key,index);}back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(card,controls);}
 const numbers=[60,70,80,90,100,101,102,103,104,105,106,107,108,109,110];
 book.append(node('h4','复数物品 · 15幅图'),node('p','Are these your …? What colour are your …?'));
 pager(unit.learning.GALLERY,'gallery-current','unitGalleryPage',(card,item,i)=>{const im=node('img');im.src=item.image;im.alt=item.en;card.append(node('small',String(numbers[i])),im,node('p',item.en));});
 book.append(node('h4','完整问答 · 12组'),node('p',unit.learning.MODEL_EXAMPLE.en));
 pager(unit.learning.MODELS,'model-current','unitModelPage',(card,item)=>{const im=node('img');im.src=item.image;im.alt=item.object;card.append(im,node('p',item.object+' / '+item.colour),node('p',item.en));});
 book.append(node('h4','a还是an'),node('p','Examples: It is ___ Swedish car. → It is a Swedish car.\nShe is ___ air hostess. → She is an air hostess.','writing-example'));
 const aAnswers=node('ol');unit.learning.REFERENCE.forEach(item=>aAnswers.append(node('li',item.en)));book.append(aAnswers);surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 15–16 · 纸笔小练习'),node('p','课堂跟老师读课文和复数词尾，用虚构国籍与物品卡结伴问答，不使用真实护照。'));
 writing.append(node('h4','A · 用a或an填空'),node('p','Examples: It is ___ Swedish car. → It is a Swedish car.\nShe is ___ air hostess. → She is an air hostess.','writing-example'));
 const a=node('ol','','writing-a');unit.learning.REFERENCE.forEach(item=>{const li=node('li'),parts=item.prompt.split('___'),blank=node('span','　','writing-blank');blank.setAttribute('aria-label','填空处');li.append(document.createTextNode(parts[0]),blank,document.createTextNode(parts[1]));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 问颜色，并用our回答'),node('p','Example: books / red\nWhat colour are your books? Our books are red.','writing-example'));
 const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.object+' / '+item.colour);for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit1516References={mount};
})(globalThis.CanranCore);
