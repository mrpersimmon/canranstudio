(function(core){
'use strict';const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const grammar=node('details','','offline-task');grammar.append(node('summary','语法小参考'));
 const rules=[
 ['祈使句与否定','祈使句可以表达命令、建议、请求等。Don’t / Do not + 动词原形表示不要做。\nDon’t speak to your mother like that!\n导学原例：不要那样对你妈妈说话！Do not是完整形式，主要见于正式文体，但不是只能书面使用。'],
 ['形容词前的Be','Be careful! / Be patient.\n课文与导学原例：小心！／耐心点。careful、patient是形容词，前面用Be。否定可用Don’t be，如Don’t be late.（不要迟到。）'],
 ['语气还要看情境','同一句祈使句可以有不同语气。理解提醒、请求或命令，要结合重音、语调、手势、表情和上下文；不能只凭Don’t或叹号断定生气、粗鲁。\nBe careful! Don’t drop it!是在提醒防止掉落，不能据此说已经摔碎。'],
 ['窗前、车外与车内','in front of the window是窗户前面。\nHe’s sitting in front of the car with the driver.\n导学原例：他和司机坐在汽车外面的前方。\nHe’s sitting in the front of the car with the driver.\n导学对照：他和司机坐在汽车内部前部。具体位置要看整个表达，不能省掉the仍当成车内。'],
 ['处理物品的打算','What are you going to do with it?\ndo with在这里表示处理。问打算怎样处理某物，使用What ... do with ...?，不是问已经把它放在哪儿。导学还用old newspapers（旧报纸）作例。'],
 ['人、物品与to','Give me that vase. → Give that vase to me.\n课本Written A原例，两句意思相同。send、take、show也可练习“动作＋物品＋to＋人”。me、her等是人称代词宾格；人物关系由说话者给出，不从外貌猜。show是给人看，send是寄送，take在本课为带给，不都替换成give。'],
 ['it／them在中间','Put on your coat. / Put your coat on. → Put it on.\nTake off your shoes. / Take your shoes off. → Take them off.\nTurn off the lights. / Turn the lights off. → Turn them off.\n本课这些可分短语动词中，名词可放两处，代词it／them必须放中间。不把这个规则推广到do with等所有动词加介词。'],
 ['两种改写要分清','Written A保持原意，把“人＋物品”换为“物品＋to＋人”。Written B把要求对方做事，改为自己表达打算：Put on your hat! → I’m going to put it on. 后句不表示已经做完，两句也不是同一说话意图。'],
 ['按需读与课堂练习','导学还列出Be careful with fire.等搭配，以及No smoking!、Never ...、Stop talking!、Do be quiet!等练习表达。它们供老师按需拓展，不额外变成本课通关要求。口头语调、发音、听辨和纸笔答案由老师核对。']
 ];const list=node('div','','grammar-reference');for(const[title,text]of rules){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}grammar.append(list);surfaces.get('grammar').append(grammar);
 const book=node('details','','offline-task');book.append(node('summary','课本小参考 · 第40课'),node('p','12幅图分六页保留原图号、英文数字与提示词。图下标为“例”的句子用于练习，不是课本唯一答案。先问打算怎样处理物品，再按图和老师的要求说完整回答。'),node('p','What are you going to do with that / those …?\nI’m going to give / show / send / take …','reference-note'));
 const gallery=node('div','','vase-gallery'),controls=node('div','','reference-pager'),count=node('span'),back=node('button','上一组动作','btn btn-yellow'),next=node('button','下一组动作','btn btn-green');back.type=next.type='button';controls.append(back,count,next);
 const saved=core.lesson49Practice.activity('unitActionPage');let index=Number.isInteger(saved)?Math.max(0,Math.min(5,saved)):0;
 function show(){gallery.replaceChildren();for(const item of unit.learning.GALLERY.slice(index*2,index*2+2)){const card=node('article','','action-picture'),im=node('img');im.src=item.image;im.alt='课本图 '+item.number+'：'+item.prompt;card.append(node('small','图 '+item.number+' · '+item.numberWord,'number-label'),im,node('h4',item.prompt),node('p','例：'+item.en),node('p',item.cn));gallery.append(card);}count.textContent=(index+1)+' / 6';back.disabled=index===0;next.disabled=index===5;core.lesson49Practice.activity('unitActionPage',index);}
 back.onclick=()=>{index--;show();};next.onclick=()=>{index++;show();};show();book.append(gallery,controls);for(const item of unit.learning.PHRASES)book.append(node('p',item.en+'\n'+item.cn));book.append(node('p','my sister指说话人的一位姐妹，课本未限定姐姐或妹妹。those photographs是复数；回答时按物品单复数选择it／them。','reference-note'));surfaces.get('apply').append(book);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 39–40 · 纸笔小练习'),node('p','跟老师读课文，练习提醒与处理物品的打算。口头表达与纸笔答案由老师核对。'),node('h4','A · 保持原意，换一种说法'),node('p','Example:\nGive me that vase.\nGive that vase to me.','writing-example'));
 const a=node('ol','','writing-a');for(const sentence of unit.learning.WRITING_A){const li=node('li',sentence);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 把要求改为自己的打算'),node('p','Example:\nPut on your coat! → I’m going to put it on.\nPut on your shoes! → I’m going to put them on.','writing-example'));
 const b=node('ol');for(const phrase of unit.learning.WRITING_B){const li=node('li');li.append(node('span',phrase),node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}core.unit3940References={mount};
})(globalThis.CanranCore);
