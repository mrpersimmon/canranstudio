(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['正在做与现阶段活动','现在进行时用be（am/is/are）加动作-ing。She is sitting under the tree.说眼前正在做的动作；I am reading a book this week.也可说这周仍在进行的阅读，不要求此刻手里正拿着书。不是只见now就机械套结构。'],
 ['主语与be','I am watching TV now. / They are playing football.\n导学原例：I配am；he/she/it和单个人名配is；you/we/they和复数配are。说地点She is in the garden.不必添加being，也不凭地点补猜动作。'],
 ['动作-ing的三组例子','通常直接加ing：go → going，ask → asking，look → looking，open → opening。\n不发音e结尾，去e再加ing：have → having，take → taking，make → making，write → writing。\n本课重读短元音后单辅音结尾的词：sit → sitting，run → running，put → putting，shut → shutting。导学还列get → getting，swim → swimming，begin → beginning，shop → shopping，由老师带读。不把所有辅音结尾或所有e结尾统一处理。'],
 ['否定、一般问句与简答','Sarah is singing in the next room.（萨拉正在隔壁房间唱歌。）\n否定在be后加not：The children aren’t cleaning the room.\n一般问句be提前：Are you playing the computer game?\n如果确实在玩：Yes, I am.；如果没有在玩：No, I am not.。这是导学的形式示范，回答要先看事实；问句本身不规定肯定或否定。'],
 ['问动作、地点与人物','What is she doing?问动作；Where is she sitting?问坐的地点；Who is climbing the tree?问谁在爬树。Tim is.承接前面climbing the tree，避免重复。\n导学还示范Who is she waiting for?（她在等谁？），这里who问等待的对象，不能套成谁正在做动作。拓展例由老师带读，不增加未教词汇考试。'],
 ['课文表达与缩写','Where’s / What’s / Who’s里的’s都是is。He’s、She’s、It’s、The dog’s在本课也缩写is。\nI beg your pardon?在这段话里请求对方再说一遍，不是责怪或感谢。What about the dog?接着询问狗的情况，不表示狗希望做什么。'],
 ['动作与关系','under说明在下面；across说明横过；run after说明追赶。The dog is running after a cat.的狗在追猫，交换双方后意思会变。\nThe cat is drinking its milk.中的its是“它的”，不同于it’s（it is）。look at a picture：看一幅画。'],
 ['课堂使用范围','课本把指令改写为进行时，是指定的语言练习；现实中听到指令不等于已经在执行。\n本课聚焦当前及现阶段活动。一般现在时习惯表达可作对照，不把未来安排、非进行动词清单或更多时态变成新考试。导学after的时间义及after all等短语由老师选读。']
 ];
 const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第32课'),node('p','18幅动作图，每页3幅。数字、英文与动作对应保留，跟老师读数和问答。'));
 const gallery=node('div','','garden-gallery'),controls=node('div','','reference-pager'),count=node('span'),back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);
 const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(5,saved)):0;
 function show(){gallery.replaceChildren();for(const item of unit.learning.GALLERY.slice(index*3,index*3+3)){const card=node('article','','action-picture'),img=node('img');img.src=item.image;img.alt=item.cn;card.append(node('small','图 '+item.number+' · '+item.numberLabel,'number-label'),img,node('p',item.en),node('p',item.cn));gallery.append(card);}count.textContent=(index+1)+' / 6';back.disabled=index===0;next.disabled=index===5;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(gallery,controls);
 const example=node('details','','offline-task');example.append(node('summary','先问一问，再描述'),node('p','What is Nicola doing?\nIs she emptying the basket?\nNo, she isn’t emptying the basket.\nShe’s typing a letter.','writing-example'));book.append(example);
 for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));
 book.append(node('p','图18写Mrs. Jones，书面B10写Miss Jones，分别保留，不把称谓差异做成评分陷阱。sister可指姐姐或妹妹；图中服装和发型是视觉改编。英式音标由老师带读，本版无英语配音。','reference-note'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 31–32 · 纸笔小练习'),node('p','跟老师读课文，用图片问What is he / she / it doing?。课堂用图片或安全的模拟动作；纸笔练习由老师核对。'),node('h4','A · 仿照例句，把指令改写成现在进行时'),node('p','Example: Sweep the floor! She is sweeping it.','writing-example'),node('p','按题目给定人称改写；这是语言练习，不是判断指令在现实中已经执行。','reference-note'));
 const a=node('ol','','writing-a');for(const[command,subject]of unit.learning.WRITING_A){const li=node('li',command+' '+subject);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 仿照原例，提问并回答'),node('p','Example: Nicola / emptying the basket / typing a letter'),node('p','What is Nicola doing?\nIs she emptying the basket?\nNo, she isn’t emptying the basket.\nShe’s typing a letter.','writing-example'));
 const b=node('ol');for(const[person,wrong,action]of unit.learning.WRITING_B){const li=node('li');li.append(node('span',person+' / '+wrong+' / '+action));for(let i=0;i<4;i++)li.append(node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit3132References={mount};
})(globalThis.CanranCore);
