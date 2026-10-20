(function(core){
'use strict';const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const notes=node('details','','offline-task');notes.append(node('summary','语法小参考'));const list=node('div','','grammar-reference');
 for(const[title,text]of [
 ['有一个、有一些','There is a book on the shelf.\nThere is some milk in the bottle.\nThere are three cups of water on the table.\n导学三个原例：单数物品和不可数物质用is；three cups数的是杯数，用are。不要把杯里的water也加s。'],
 ['量词短语','a bar of chocolate／three bars of soap／two drops of water／a loaf of bread\n导学原例用量词说明物质的量。数字大于一时通常变化量词；loaf的复数为loaves。物质名词在本课含义中不乱加s；不是说这些词在所有专业或点餐语境都永远不可数。'],
 ['原文中的重量','a pound of sugar／half a pound of coffee／a quarter of a pound of tea\n一磅糖、半磅咖啡、四分之一磅茶。half和quarter说的是一磅的份额；不把半磅咖啡改成一杯或四分之一磅。'],
 ['some和any','some表示不定量的一些，常见于肯定陈述；any常用于普通有无询问和否定。\nIs there any milk in that bottle?\n说话人尚不知道有没有。Is there some milk in that bottle?在期待有牛奶、再核实的语境中也可以使用。不能只按问号选词，也不能把some译成“其余一定没有”。'],
 ['单数、物质与复数问答','Is there a spoon? / Is there any milk?\n有：Yes, there is.；没有：No, there isn’t.\nAre there any pictures on the wall?\n有：Yes, there are.；没有：No, there aren’t.\n问句把is／are放在there前；肯否按给定事实决定，不能从问题本身猜有无。'],
 ['one与some承接物品','Is there a passport here?\nYes, there is. There’s one on the table.\nIs there any bread here?\nYes, there is. There’s some on the table.\n课本书写原例分别用one代替一个护照、some代替一些面包，不重复整个名词。'],
 ['并列清单的练习方式','There is a pen, two pencils and a book on the desk.\n导学原例采用先报第一项、再接其余物品的列举句式。本课相关填空按这一指定句式练习；实际英语中并列结构和口语there’s的使用还受语体影响，不能把本课方式当成全英语唯一规则。'],
 ['原文与新情境分开','Not very.承接heavy，表示不太重，并不表示空袋。Penny说not for me，明确排除她自己；不要仅凭否定替她补写肯定赠送对象。bar在本课是条、块；导学还举酒吧义，按需了解，不扩成新的通关目标。课堂由老师组织发音、语调与书写核对。']
 ]){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}notes.append(list);surfaces.get('grammar').append(notes);
 const models=node('details','','offline-task');models.append(node('summary','换个物品问一问'),node('p','保留第42课16幅物品与位置关系、原编号和英文数字。图片下的完整句子是课堂练习例句，跟老师问一问、答一答。'));
 const grid=node('div','','reference-grid');for(const item of unit.learning.MODELS){const card=node('article','','reference-card'),picture=node('img');picture.src='/assets/unit41-42/reference-'+item.number.split(' ')[0]+'-v153.svg';picture.alt=item.cn.replace('吗？','。');card.append(node('small',item.number),picture,node('p',item.en),node('span',item.cn));grid.append(card);}models.append(grid);surfaces.get('grammar').append(models);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 41–42 · 纸笔小练习'),node('p','跟老师完成课本A、B。每组B写一行问题，再写一行包含两句的回答。'),node('h4','A · 用 a、any 或 some 填空'),node('p','Examples:\nThere’s a photograph on the desk.\nIs there any milk in the bottle?\nThere isn’t any milk in the bottle.\nThere’s some milk in that cup.','writing-example'));
 const a=node('ol','','writing-a');for(const text of unit.learning.WRITING_A){const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 按物品和位置提问并回答'),node('p','Examples:'));
 const examples=node('div','','writing-examples');examples.append(node('p','passport / on the table\nIs there a passport here?\nYes, there is. There’s one on the table.','writing-example'),node('p','bread / on the table\nIs there any bread here?\nYes, there is. There’s some on the table.','writing-example'));section.append(examples);
 const b=node('ol');for(const text of unit.learning.WRITING_B){const li=node('li');li.append(node('span',text),node('div','','writing-rule'),node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit4142References={mount};
})(globalThis.CanranCore);
