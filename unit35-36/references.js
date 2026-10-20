(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['between：在参照物之间','Louise sat between Jack and Lily.\n导学原例：路易丝坐在杰克和莉莉之间。课文村庄在两座山之间。这里的两者是本题的具体参照，不扩成between所有用法的绝对限制。'],
 ['along：沿着','They are walking along the river.\n导学原例：他们正沿着河走。along顺着长度方向，across则表示从一边到另一边。课文夫妻沿河岸走，男孩横渡河流；参照物和方向都要看。'],
 ['beside：在旁边','The dog is sitting beside an old man.\n导学原例：狗正坐在一位老人旁边。课文学校与公园相邻。照片里的左右以画面为参照，不用河流流向猜地理左岸。'],
 ['into与in：进入和里面','He jumped into the river. / There are some clothes in the case.\n导学原例分别强调进入河流和衣服在箱内。case：箱子。into通常强调由外到内；in可说明内部位置，但也能与部分动词表达进入，比如jump in。不能把“in没有移动含义”当成普遍禁令。看完整表达的意思，不只找一个词。'],
 ['动词与方向词一起读','Come in. 表示进来，也可用Enter表达进入。Go out. 表示出去。先明确谁在里面、谁在外面。\nThe cats are running along the street. / The children are jumping off the sofa.\n导学原例用along与off补充动作方向。off表示离开原来接触的位置；out of由内到外。这里重在理解整体意思，不把这些结构全部教成能随意拆开的同一种短语动词。'],
 ['Where问位置或去向','Where is the boy swimming? He’s swimming across the river.\nWhere are the children going? They’re going into the park.\nWhere问在哪里或往哪里，What … doing?问动作。单数用is，复数用are；回答还要有地点或路线词组。He’s = He is；They’re = They are。'],
 ['本课-ing词形','put → putting；swim → swimming；sit → sitting；run → running。以上本课短词双写末尾辅音再加ing。walk → walking直接加ing；come → coming去掉不发音e。不能推广为所有动词都双写。'],
 ['照片、指代与词义','a photograph of our village：我们村庄的一张照片。of连接照片和拍摄对象；不扩大成只用于无生命事物。on a river在本课介绍村庄靠河，不能译成房屋漂在水上。bank当前是河岸，也有银行义；another photograph是另一张照片，不是全部照片。\nMy wife and I后面的We仍指叙述者和妻子。Some of them中的them承接前面的孩子；原文没有明说全部都进公园，也不能反过来推定其余人永远不去。'],
 ['拓展与课堂分工','导学的词义拓展及练习册some／any、wait for、run after由老师按需复习，不加成新的必经关卡。练习册第36课另一张照片写公园在左、学校在右，与第35课不同；应分别依据各题材料。门后／门旁等缺少情境的开放填空不设唯一线上答案。\n发音、听辨与口头问答由老师组织。游泳、跳下等只观察教材，不安排实际模仿。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第36课'),node('p','12幅动作图，每页3幅。保留原编号和英文数字，跟老师练习Where …?问答。'));
 const gallery=node('div','','garden-gallery'),controls=node('div','','reference-pager'),count=node('span'),back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);
 const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(3,saved)):0;
 function show(){gallery.replaceChildren();for(const item of unit.learning.GALLERY.slice(index*3,index*3+3)){const card=node('article','','action-picture'),img=node('img');img.src=item.image;img.alt=item.cn;card.append(node('small','图 '+item.numberLabel,'number-label'),img,node('p',item.en),node('p',item.cn));gallery.append(card);}count.textContent=(index+1)+' / 4';back.disabled=index===0;next.disabled=index===3;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(gallery,controls);
 const example=node('details','','offline-task');example.append(node('summary','先问位置，再说路线'),node('p','Where is the boy swimming?\nHe’s swimming across the river.\nWhere are the children going?\nThey’re going into the park.','writing-example'));book.append(example);
 book.append(node('p','图7的原句是walking，书写B7给的是standing；分别按本页原题练习，不互相改写。','reference-note'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 35–36 · 纸笔小练习'),node('p','跟老师读课文，用动作图问Where …?。纸笔答案和口头表达由老师核对。'),node('h4','A · 写出-ing形式，完成句子'),node('p','Example: put — putting\nPut … He is putting on his coat.','writing-example'));
 const a=node('ol','','writing-a');for(const[word,sentence]of unit.learning.WRITING_A){const li=node('li',word+' … '+sentence);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 仿照原例，提问并回答'),node('p','Examples: the boy swimming / across the river\nWhere is the boy swimming?\nHe’s swimming across the river.\n\nthe children going / into the park\nWhere are the children going?\nThey’re going into the park.','writing-example'));
 const b=node('ol');for(const[person,action]of unit.learning.WRITING_B){const li=node('li');li.append(node('span',person+' / '+action));for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit3536References={mount};
})(globalThis.CanranCore);
