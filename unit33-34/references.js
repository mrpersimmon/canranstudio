(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['under：下方','There is a cat under the table.\n导学原例：猫在桌子下面。课文The ship is going under the bridge.表示轮船从桥下通过。先看物体与参照物，不只看画面上谁更低。'],
 ['across：从一边到另一边','Be careful when you go across the road.\n导学原例表示横穿道路。across在本课说明从一边到另一边，不把它解释成沿路一直走。road：道路。'],
 ['over与on：本课两种语境','There is a bridge over the river.\n桥在河的上方。静态位置中，花瓶on the table表示接触桌面；画挂在墙上、位于桌上方可说over the table，画与桌面之间有空隙。\n但是over还可表示越过：They are walking over the bridge.中的人脚在桥面上，不是在飞。导学练习也用walking across the bridge，两种过桥表达都可成立。不能把“不直接接触”扩成over所有用法的绝对规则。'],
 ['with：和……一起','Mr. Brown is playing football with his son.\n导学原例：布朗先生和儿子一起踢球。课文Mr. Jones is with his family.同样表示一起。with本身不告诉我们每个人正在做同一件事；具体动作还要看后文。'],
 ['with：带有某种特征','I know the girl with long black hair. She is Jenny.\n导学原例：我认识那个有长长黑发的女孩，她是珍妮。这里with后的部分说明女孩的特征，不是头发和她一起散步。long black hair：长长的黑发。也可以说a bag with books，装着书的包。'],
 ['with：使用工具或手段','Many people write with the right hand.\n导学原例用右手说明手段；不要求孩子必须使用哪只手。write with a pen表示用钢笔写，write with a pencil表示用铅笔写。这里with不是陪同，也不是在工具里面。'],
 ['复数正在做与提问','The children are doing their homework. / The boy is doing his homework.\n复数主语用are，单数用is；现在进行时还需要动作-ing。What are they doing?问他们正在做什么；They’re = They are。the man and the woman指两个人，也用are。'],
 ['词形、指代与天气','walk → walking；type → typing；make → making；come → coming；shine → shining；give → giving；shave → shaving。后六项去不发音e再加ing。fly → flying；cry → crying，保留y，不照搬名词复数的变化。\nThey和them指谁由前文决定，不等于永远指船。It is a fine day today.中的it用来谈天气；有云仍可有阳光。some也可用于some water，不限于可数名词。'],
 ['拓展与课堂分工','导学day的短语、walk的名词用法和Time really flies!由老师选读，不扩张成新的时态考试。through、along及over的其他含义以后再系统学习。\n本版保留英式音标，发音、听辨与口头问答由老师组织；图片颜色和衣服不是课文考点。刮脸和跳墙只观察教材图，不安排实际操作。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第34课'),node('p','12幅动作图，每页3幅。保留原数字，跟老师练习读数和What are … doing?问答。'));
 const gallery=node('div','','garden-gallery'),controls=node('div','','reference-pager'),count=node('span'),back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);
 const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(3,saved)):0;
 function show(){gallery.replaceChildren();for(const [offset,item] of unit.learning.GALLERY.slice(index*3,index*3+3).entries()){const card=node('article','','action-picture'),img=node('img');img.src=item.image;img.alt=item.cn;card.append(node('small','图 '+(index*3+offset+1)+' · '+item.numberLabel,'number-label'),img,node('p',item.en),node('p',item.cn));gallery.append(card);}count.textContent=(index+1)+' / 4';back.disabled=index===0;next.disabled=index===3;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(gallery,controls);
 const example=node('details','','offline-task');example.append(node('summary','先问一问，再描述'),node('p','What are the women doing?\nThey are washing dishes. / They’re washing dishes.','writing-example'));book.append(example);for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));
 book.append(node('p','数字从220,231到2,000,000逐项保留，不按固定等差补写。fine说天气晴好；boat与ship按本课小船和大轮船图景区分，日常含义有重叠。','reference-note'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 33–34 · 纸笔小练习'),node('p','跟老师读课文，用动作图问What are they doing?。纸笔答案和口头表达由老师核对。'),node('h4','A · 用现在进行时完成句子'),node('p','Example: take — taking\nTake … He is taking his book.','writing-example'),node('p','本组type、make、come、shine、give去掉不发音的e，再加ing。','reference-note'));
 const a=node('ol','','writing-a');for(const[word,sentence]of unit.learning.WRITING_A){const li=node('li',word+' … '+sentence);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 仿照原例，提问并回答'),node('p','Example: the children / looking at the boats on the river'),node('p','What are the children doing?\nThey’re looking at the boats on the river.','writing-example'));
 const b=node('ol');for(const[person,action]of unit.learning.WRITING_B){const li=node('li');li.append(node('span',person+' / '+action));for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit3334References={mount};
})(globalThis.CanranCore);
