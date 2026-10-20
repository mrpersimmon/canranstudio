(function(core){
'use strict';const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const notes=node('details','','offline-task');notes.append(node('summary','语法小参考'));const list=node('div','','grammar-reference');
 for(const[title,text]of [
 ['can表示能力','I can swim.\nI can sing this song.\nHe can speak English and French.\n导学三个原例：会游泳、会唱这首歌、会说英语和法语。can没有人称和数的变化，后面用动词原形。这里学能力，不把所有can都解释成能力。'],
 ['肯定、否定和问答','Sam can make the tea.\nSam cannot see the tea. → Sam can’t see the tea.\nCan you see it? — Yes, I can. / No, I can’t.\ncannot写成一个词；can’t是缩写。提问把can放在主语前。回答能不能，要有事实依据；短答省略了前面说过的动作，不需要再补do。'],
 ['谁能做、能做与不能做','Who can speak French? — Sam can speak French.\nNo, I can’t, but I can speak German.\n练习册原例：Who问人；but连接这里“不会法语、会德语”的对比。换人和语言也不改变can和后面的动词原形。'],
 ['存在与看见','There are some cups in the cupboard.\nI can’t see them.\n第一句说柜里有杯子；第二句说我没看见。没看见不等于没有，也不表示不喜欢。some和them都承接前文的cups。'],
 ['some、any和名词复数','I can see some cups, but I can’t see any glasses.\n本课普通肯定陈述常用some，否定常用any；并不是只看问号就能判断some永远不对。\nIs there any water? / Are there any cups?\nwater在这里是不可数的水，cups是可数复数。有或没有分别按事实回答。'],
 ['后面与前面要说参照物','The tea is behind the teapot.\nIt’s in front of you!\n同一茶叶可以在茶壶后面，也在Sam面前；参照物不同，不是茶叶突然移动。The kettle’s boiling!在课文中指壶里的水开了。'],
 ['本课的边界','名词复数保留下面的完整词形表；knife／shelf／wife／loaf的变化不推广到所有f结尾的词。导学第80页还出现许可、可能和必要性的练习，由老师按需拓展，不混进本课唯一答案题。课本开场问题要求从故事找线索，不能将人物推断当作对所有人的判断。']
 ]){const card=node('article');card.append(node('h4',title),node('p',text));list.append(card);}notes.append(list);surfaces.get('grammar').append(notes);
 const models=node('details','','offline-task');models.append(node('summary','换个物品问一问'),node('p','跟老师看完整的位置图问一问。数字是课本图号，不表示图里物品的数量。'));
 const grid=node('div','','reference-grid');for(const item of unit.learning.MODELS){const card=node('article','','reference-card'),picture=node('img');picture.src='/assets/unit43-44/reference-'+item.number.split(' ')[0]+'-v153.svg';picture.alt=item.cn.replace('吗？','。');card.append(node('small',item.number),picture,node('p',item.en),node('span',item.cn));grid.append(card);}models.append(grid);surfaces.get('grammar').append(models);
 const plurals=node('details','','offline-task');plurals.append(node('summary','名词变复数'));const pairs=node('dl','','plural-reference');for(const[a,b]of unit.learning.PLURALS)pairs.append(node('dt',a),node('dd',b));plurals.append(pairs);surfaces.get('grammar').append(plurals);
 const dialogue=node('details','','offline-task');dialogue.append(node('summary','跟老师编对话'),node('p','练习册第44课：保留完整六句原例和其余五组线索。老师先确认这次假设的能力，再轮流问答；不从问句本身猜事实。'));
 dialogue.append(node('p','you / speak / English / French / German / Sam\nCan you speak English?\nYes, I can.\nCan you speak French?\nNo, I can’t, but I can speak German.\nWho can speak French?\nSam can speak French.','writing-example'));
 const cues=node('ol');cues.start=2;for(const t of ['Ann / make / tea / bread / coffee / John','Mike / ride a bike / drive a car / ride a horse / my father','they / speak / Dutch / Japanese / Korean / Mary','you / see / any clouds in the sky / a bird / an aeroplane / he','John / write / his name / his address / his phone number / his brother'])cues.append(node('li',t));dialogue.append(cues);surfaces.get('grammar').append(dialogue);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 43–44 · 纸笔小练习'),node('p','A改写完整句子；B每组写一行问题，再写一行包含两句的回答。'),node('h4','A · 用名词复数改写句子'),node('p','glass — glasses; book — books; housewife — housewives\nExample:\nI can see some cups. But I can’t see any ___ (glass).\nI can see some cups, but I can’t see any glasses.','writing-example'));
 const a=node('ol','','writing-a');for(const text of unit.learning.WRITING_A){const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);}writing.append(a);
 const section=node('section','','writing-b');section.append(node('h4','B · 按物品和位置提问并回答'),node('p','Examples:'));const examples=node('div','','writing-examples');examples.append(node('p','bread / on the table\nIs there any bread here?\nYes, there is. There’s some on the table.','writing-example'),node('p','hammers / behind that box\nAre there any hammers here?\nYes, there are. There are some behind that box.','writing-example'));section.append(examples);
 const b=node('ol');for(const text of unit.learning.WRITING_B){const li=node('li');li.append(node('span',text),node('div','','writing-rule'),node('div','','writing-rule'));b.append(li);}section.append(b);writing.append(section);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit4344References={mount};
})(globalThis.CanranCore);
