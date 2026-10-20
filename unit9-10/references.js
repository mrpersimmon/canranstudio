(function(core){
'use strict';
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function mount({unit,surfaces}){
 const ref=node('details','','offline-task');ref.append(node('summary','语法小参考'),node('p','How are you? 关心对方的近况；How is Emma? 询问Emma怎么样。\nHow’s是How is；He’s／She’s／It’s分别是He is／She is／It is。'),node('p','How do you do?在正式初次介绍中可作固定问候，不当作已经回答身体好不好。\nHow’s life?／How are things?／How’s work?也可询问一般情况。'),node('p','How does he look?问看起来怎么样。询问性格通常用What is he like?；本课不把How is he?一律解释为问性格。'),node('p','形容词可放名词前：a clean umbrella；也可在be后：The umbrella is clean.\n常用顺序示例：a nice old car。评价通常先于新旧，名词在最后，不要求背长串术语。'),node('p','fine和well在本课健康问候中均可用；Nice to see you表达见到朋友很高兴。Look at后接看的对象。'));
 surfaces.get('grammar').append(ref);
 const models=node('details','','offline-task');models.append(node('summary','课本小参考 · 第10课'),node('p','保留课本第11–22幅的指定人物和描述词；这些词描述图中给定的情况，不代表整个职业。'));
 const tabs=node('div','','observation-tabs'),grid=node('div','','reference-grid');
 unit.learning.MODELS.forEach((item,i)=>{const card=node('article','','reference-card'),im=node('img');im.src=item.image;im.alt=item.subject;card.dataset.pair=String(Math.floor(i/2));card.append(node('small',String(i+11)),im,node('p',item.en));grid.append(card);});
 const choose=index=>{[...grid.children].forEach(card=>{card.hidden=Number(card.dataset.pair)!==index;});[...tabs.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));core.lesson49Practice.activity('unitObservationPair',index);};
 ['胖瘦','高矮','整洁','冷暖','年龄','忙闲'].forEach((label,index)=>{const button=node('button',label,'btn btn-mini btn-yellow');button.type='button';button.onclick=()=>choose(index);tabs.append(button);});
 const remembered=core.lesson49Practice.activity('unitObservationPair');choose(Number.isInteger(remembered)&&remembered>=0&&remembered<6?remembered:0);models.append(tabs,grid);
 models.append(node('p','描述也要有依据：休息不等于lazy；不冷不一定就是热。胖瘦、高矮和年龄不决定一个人的好坏，练习不用于给身边同学贴标签。'));
 for(const item of unit.learning.REFERENCE)models.append(node('p',item.en));surfaces.get('apply').append(models);
 const writing=node('details','','offline-task');writing.id='unitWriting';writing.append(node('summary','课后练习纸'),node('h3','Lesson 9–10 · 纸笔小练习'),node('p','课堂跟老师读词语和课文，用虚构人物问候和回问，再根据给定画面描述。'));
 writing.append(node('h4','A · 用 He’s、She’s 或 It’s 填空'),node('p',"Example: Robert isn’t a teacher. ___ an engineer.\nRobert isn’t a teacher. He’s an engineer."));const a=node('ol','','writing-a');unit.learning.WRITING_A.forEach(text=>{const li=node('li',text);li.append(node('div','','writing-rule'));a.append(li);});writing.append(a);
 writing.append(node('h4','B · 用 He 或 She 写两句话'),node('p','按所给人物和描述词完成观察指令与描述。he／she依教材图中人物给出，不凭职业猜性别。'),node('p',"Example: Helen / well\nLook at Helen. She’s very well."));const b=node('ol','','writing-b');unit.learning.MODELS.forEach(item=>{const li=node('li',item.subject.replace(/^that /,'')+' / '+item.adjective+' · '+item.pronoun);for(let i=0;i<2;i++)li.append(node('div','','writing-rule'));b.append(li);});writing.append(b);
 const actions=node('div','','activity-actions'),print=node('button','打印练习纸','btn btn-yellow');print.type='button';print.onclick=()=>{document.body.classList.add('print-writing');window.print();};actions.append(print);writing.append(actions);surfaces.get('certificate').append(writing);window.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
}
core.unit910References={mount};
})(globalThis.CanranCore);
