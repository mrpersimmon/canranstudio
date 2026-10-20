(function(root){
  'use strict';
  const core=root.CanranCore, image=name=>'/assets/unit45-46/'+name+'.svg';
  const textSource='《新概念英语智慧版1》Lesson45–46，纸页90–93／PDF123–126';
  const grammarSource='《同步导学》Grammar纸页82／PDF96；《语法练习册》纸页126–130／PDF140–144';
  const WORDS=[
    ['can','能；会','/kæn/','can'],['boss','老板；上司','/bɒs/','boss'],['minute','分钟；本课a minute指一会儿','/ˈmɪnɪt/','minute'],
    ['ask','问；请求','/ɑːsk/','ask'],['handwriting','书写；字迹','/ˈhændraɪtɪŋ/','letter'],['terrible','糟糕的','/ˈterəbl/','terrible'],
    ['lift','拿起；举起','/lɪft/','lift'],['cake','蛋糕','/keɪk/','cake'],['biscuit','饼干','/ˈbɪskɪt/','biscuit'],
    ['type','打字','/taɪp/','typewriter'],['letter','信','/ˈletə/','letter'],['next door','在隔壁','/nekst ˈdɔː/','next-door'],
    ['office','办公室','/ˈɒfɪs/','office'],['read','读；阅读','/riːd/','read'],['put on','穿上；戴上','/pʊt ɒn/','put-on'],
    ['who','谁','/huː/','who'],['what','什么','/wɒt/','what'],['where','在哪里','/weə/','where'],
    ['when','什么时候','/wen/','when'],['how','怎样','/haʊ/','how'],['how many','多少；问可数的数量','/haʊ ˈmeni/','letters'],
    ['how much','多少；这里问不可数的量','/haʊ mʌtʃ/','milk'],['thousand','千','/ˈθaʊzənd/','thousand'],['million','百万','/ˈmɪljən/','million']
  ].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
  const unit={id:'unit45-46',version:1,contentRevision:'office-can-questions-v1',mode:'classroom',title:'一封难读的信',path:'/unit45-46/',start:'learn/words',
    progress:{learningKey:'canran:unit45-46:learning:v1'},objects:WORDS,
    learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
    stages:[
      {id:'l1',title:'走进办公室',activities:[['words','办公室小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
      {id:'l2',title:'老板的信',activities:[['text','办公室小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
      {id:'l3',title:'问出想知道的',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
      {id:'l4',title:'帮忙传个话',activities:[['apply','办公室小帮手','give']],required:['apply']},
      {id:'l5',title:'沟通大挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
    ],questions:{},
    reward:{edition:'office-can-questions-v1',title:'沟通小能手',lesson:'Lesson 45–46',scene:'/assets/unit45-46/keepsake-story-v1.webp',alt:'Pamela举着字迹潦草的信，Bob靠近一起辨认，旁边放着紫色打字机',color:'#79658b',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','办公室小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
  };
  unit.learning.DIALOGUE=[
    ['boss','Can you come here a minute please, Bob?','请你来一下好吗，鲍勃？'],
    ['bob','Yes, sir?','什么事，先生？'],
    ['boss','Where’s Pamela?','帕梅拉在哪儿？'],
    ['bob','She’s next door. She’s in her office, sir.','她在隔壁，在她的办公室里，先生。'],
    ['boss','Can she type this letter for me? Ask her please.','她能为我打一下这封信吗？请问问她。'],
    ['bob','Yes, sir.','好的，先生。'],
    ['bob','Can you type this letter for the boss please, Pamela?','请你把这封信给老板打一下可以吗，帕梅拉？'],
    ['pamela','Yes, of course I can.','可以，当然可以。'],
    ['bob','Here you are.','给你。'],
    ['pamela','Thank you, Bob.','谢谢你，鲍勃。'],
    ['pamela','Bob!','鲍勃！'],
    ['bob','Yes? What’s the matter?','怎么了？怎么回事？'],
    ['pamela','I can’t type this letter.','我打不了这封信。'],
    ['pamela','I can’t read it! The boss’s handwriting is terrible!','我看不懂这封信！老板的字迹太糟糕了！']
  ].map(([who,text,cn],i)=>({id:'u4546-d'+(i+1),who,text,cn,source:textSource}));
  const q=(id,target,prompt,input,explanation,hint='')=>({id:'u4546-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
  const choice=(options,answer,extra={})=>({options,answer,...extra});
  const blank=(before,after,options)=>({before,after,options});
  const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
  const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
  const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
  const model=(...lines)=>({lines});
  const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
  unit.questions.listen=[
    q('v-boss','识别角色称呼','boss 是谁？',choice(['老板','同学','客人'],'老板',{image:image('boss'),imageAlt:'故事里的老板'}),'boss 是老板或上司。'),
    q('v-minute','时间词词义','“分钟”用哪个词？',choice(['minute','letter','office'],'minute'),'minute 是分钟；课文 a minute 表示一会儿。'),
    q('v-handwriting','识别字迹而不是纸张物品','handwriting 指信上的什么？',choice(['写出来的字迹','纸的颜色','信封的大小'],'写出来的字迹',{image:image('letter'),imageAlt:'一封带潦草手写线条的信'}),'handwriting 是字迹、书写。'),
    q('v-actions','区别问、打字与举起','把动作与意思连起来。',match([['ask','问；请求'],['type','打字'],['lift','举起']]),'三个动作分别是问、打字和举起。'),
    q('v-food','区分cake与biscuit','选出 biscuit。',choice(['饼干','蛋糕','面包'],'饼干',{optionImages:{'饼干':image('biscuit'),'蛋糕':image('cake'),'面包':'/assets/unit41-42/bread.svg'}}),'biscuit 是饼干，cake 是蛋糕。'),
    q('v-place','next door语境词义','She’s next door.\n她在哪里？',choice(['在隔壁','在门上','在楼下'],'在隔壁'),'next door 表示在隔壁。'),
    q('v-meaning','联系字迹理解terrible','The handwriting is terrible.\n字迹怎么样？',choice(['很糟糕','很整齐','很小'],'很糟糕'),'terrible 表示糟糕的；不是评价这个人不好。')
  ];
  unit.questions.roles=[
    q('r-place','根据原文找人物地点','Bob 说 Pamela 在哪里？',choice(['隔壁的办公室','老板的办公室','家里'],'隔壁的办公室'),'She’s next door. She’s in her office.','回想 Bob 紧接 Where’s Pamela? 的回答。'),
    q('r-reference','用说话人确定代词指向','老板说：Can she type this letter for me?\n点出指老板自己的词。',{type:'locate',fragments:['Can ',{value:'she'},' type ',{value:'this letter'},' for ',{value:'me'},'?'],options:['she','this letter','me'],answer:'me'},'说话人是老板，me 指老板自己。','先确认这句话是谁说的。'),
    q('r-handoff','理解递信行为','Bob 说 Here you are. 时，把信给谁？',choice(['Pamela','老板','Bob 自己'],'Pamela',{optionImages:{'Pamela':image('pamela'),'老板':image('boss'),'Bob 自己':image('bob')}}),'Pamela接过信后说 Thank you, Bob.。','看接下来是谁在道谢。'),
    q('r-cause','根据原文因果而非猜测','Pamela 为什么打不了这封信？',choice(['她看不懂老板的字迹','她找不到打字机','她不想帮助老板'],'她看不懂老板的字迹'),'原文原因是 I can’t read it!。','她在最后一段自己说明了原因。'),
    q('r-ability','区分一般能力与当前障碍','Pamela 先说 I can，后来又说 I can’t type this letter。\n哪种理解对？',choice(['她会打字，但这封信的字迹难读','她完全不会打字','她看不懂所有的书'],'她会打字，但这封信的字迹难读'),'this letter 限定的是这封信，不能扩大成不会打字。','注意后来那句话里 this letter 的范围。')
  ];
  unit.questions.grammar=[
    g('negative','cannot和can’t表达否定','选择与 I cannot type. 意思相同的一句。',choice(['I can’t type.','I can type.','I am typing.'],'I can’t type.'),'cannot 可以缩写成 can’t，表示不能或不会。','寻找否定形式。',model(['I cannot read it. → I can’t read it.','cannot → can’t；否定意思不变。'])),
    g('form','否定can后仍接原形','说“她不能举起这个箱子”。',fill([blank('She ','',['can’t','isn’t']),blank('',' this box.',['lift','lifts','lifting'])],['can’t','lift']),'can’t 后面也用动词原形 lift。','不能在 can’t 后加动词-ing 或-s。'),
    g('question','can前置的一般疑问句','用词块问：Bob 能读这封信吗？',bank(['Can','Bob','read','this letter','Does','reads'],'Can Bob read this letter',4,'?'),'Can 放在主语 Bob 前面，read 用原形。','先放 can，再放人和动作。',model(['She can see it. → Can she see it?','can 到主语前，动作不变。'])),
    g('reply','根据明确事实选择can肯否短答','你会打字，但不能举起这个箱子。',fill([blank('Can you type? Yes, I ','.',['can','can’t','am']),blank('Can you lift this box? No, I ','.',['can','can’t','am not'])],['can','can’t']),'Can you…? 按事实用 Yes, I can. 或 No, I can’t.。','分清这两个本领，分别回答。'),
    g('pronoun','we与they随回答视角变化','你和Bob都能读这封信；Pamela和Jane也都能读。\n由你回答：',fill([blank('Can you and Bob read it? Yes, ',' can.',['we','they','I']),blank('Can Pamela and Jane read it? Yes, ',' can.',['we','they','she'])],['we','they']),'包含我用 we；另外两个人用 they。','第一句问到你自己，第二句问另外两个人。',model(['Can Bob lift it? Yes, he can.','Bob 对应 he。'],['Can Pamela lift it? Yes, she can.','Pamela 对应 she。'])),
    g('who','who作主语不再加另一主语','想问“谁会打字？”，选哪句？',choice(['Who can type?','Who can she type?','Who does can type?'],'Who can type?'),'Who 就是要找的那个人；后面直接接 can 和动作。','这一句还不知道谁来做，不需要再塞入 she。',model(['Who can open the door? — Bob can.','who 问谁，回答一个人。'])),
    g('what','what询问能做的事情','用词块问：她能做什么？',bank(['What','can','she','do','does'],'What can she do',4,'?'),'What can she do? 问她能做的事情。','what 在前，然后是 can、主语和动词。',model(['What can you see? — A bird.','what 问看见什么。'])),
    g('where','where询问地点','想知道在哪里能找到Pamela，选哪句？',choice(['Where can I find Pamela?','When can I find Pamela?','Who can find Pamela?'],'Where can I find Pamela?'),'where 问地点。','你要的信息是一个地方。',model(['Where can I put the book? — On the desk.','where 问在哪里。'])),
    g('when','when询问时间','想知道Bob什么时候能来，补全问句。',fill([blank('',' can Bob come?',['When','Where','Who'])],['When']),'when 问什么时候。','你在等一个时间，而不是地点。',model(['When can I read it? — Now.','when 问什么时候；now 是现在。'])),
    g('how','how询问方法','你不知道怎样打开箱子，补全问句。',fill([blank('',' can I open this box?',['How','Who','When'])],['How']),'how 问怎样做。','想知道方法，就找问“怎样”的词。',model(['How can I open the door? — With this key.','how 问方法；with this key 意为用这把钥匙。'])),
    g('many','how many与可数复数构成问句','用词块问：你能看见几封信？',bank(['How many','letters','can','you','see','letter'],'How many letters can you see',5,'?'),'How many 后面接可数名词复数，再接 can you see。','信可以一封封数；先把问数量的部分放好。',model(['How many books can you see? — Three.','how many＋可数名词复数。'])),
    g('much','how much询问不可数的量','问“你能看见多少牛奶？”',fill([blank('',' milk can you see?',['How much','How many','Who'])],['How much']),'问牛奶的量用 how much，不把 milk 变成可数复数。','比较牛奶和一封封的信。',model(['How much water can you see?','how much＋不可数名词，问有多少。'])),
    g('change','正在做与能够做的表达区别','They are typing these letters. 是“正在打”。\n改成“他们能打这些信”。',fill([blank('They ','',['can','are']),blank('',' these letters.',['type','typing','types'])],['can','type']),'can type 表示能打字；are typing 表示正在打，意思不同。','改为本领时，要把正在进行的表达一起换掉。',model(['He is taking his book. → He can take his book.','正在拿书 → 能拿书；这不是同义改写。'])),
    g('independent','撤去示范后表达能力对比','用词块说：我会做蛋糕，但不会做饼干。',bank(['I can','make cakes','but','I can’t','make biscuits','I am'],'I can make cakes but I can’t make biscuits',5),'but 连接两种不同的能力情况；不能把后半句改成正在做。','两边分别说能做和不能做。')
  ];
  unit.questions.apply=[
    q('a-request','在办公室礼貌请求帮忙','请Bob来一下，哪句合适？',choice(['Can you come here, please?','Where can you come?','I can’t come here.'],'Can you come here, please?',{display:{title:'请 Bob 来帮忙',material:'你想请 Bob 过来。'}}),'Can you…please? 可以用来礼貌请求。','这次是请他做一件事，不是在问地点。'),
    q('a-person','根据明确能力材料选择帮手','给这封信找一位打字帮手。',choice(['Pamela','Bob','老板'],'Pamela',{display:{title:'谁能帮忙打字？',material:'Pamela: I can type.\nBob: I can’t type.\nThe boss: I can’t type.'},optionImages:{'Pamela':image('pamela'),'Bob':image('bob'),'老板':image('boss')}}),'这段新情境明确说 Pamela 会打字。','根据这一次提供的三个人的话选择。'),
    q('a-handoff','按英文指令交接唯一物品','Bob 应该把信给谁？',choice(['Pamela','老板','Bob 自己'],'Pamela',{display:{title:'把同一封信递过去',material:'The boss: Give the letter to Pamela, please.'},optionImages:{'Pamela':image('pamela'),'老板':image('boss'),'Bob 自己':image('bob')}}),'信从Bob手里交到Pamela手里。','看 to 后面的人。'),
    q('a-problem','回应实际困难而非泛化能力','Pamela拿到信后说了什么？',choice(['I can type, but I can’t read this letter.','I can’t type any letters.','I can read this letter.'],'I can type, but I can’t read this letter.',{display:{title:'她会打字，但看不懂这封信',material:'Pamela: I can type. The handwriting is terrible.'}}),'她的困难是这封信的字迹；不是完全不会打字。','保留两条事实：会打字，这封信却读不清。'),
    q('a-help','用who问题寻找读信帮助','用词块问：谁能读这封信？',bank(['Who','can','read','this letter','he','does'],'Who can read this letter',4,'?'),'Who can read this letter? 用一个问题寻找能帮忙的人。','问谁时，who 本身就在主语的位置。')
  ];
  unit.questions.exam=[
    q('e-words','独立识别核心新词','给词和意思配对。',match([['boss','老板'],['minute','分钟'],['ask','问；请求'],['handwriting','字迹']]),'按本课词义配对。'),
    q('e-food','独立辨认两类点心','图中是什么？',choice(['cake','biscuit','bread'],'cake',{image:image('cake'),imageAlt:'一块有奶油和樱桃的蛋糕'}),'cake 是蛋糕。'),
    q('e-story','整合能力与本次因果','Pamela: Yes, of course I can.\nLater: I can’t read it! The boss’s handwriting is terrible!\n她遇到了什么问题？',choice(['会打字，但读不懂这封信','完全不会打字','老板不允许她打字'],'会打字，但读不懂这封信'),'障碍是老板的字迹，不是不会打字。'),
    q('e-owner','所属关系与代词语境','Bob: Can you type this letter for the boss please, Pamela?\n这封信是为谁打的？',choice(['老板','Bob','Pamela'],'老板'),'for the boss 表示为老板。'),
    q('e-negative','独立使用否定和动词原形','说“他不能举起这张桌子”。',fill([blank('He ','',['can’t','isn’t','doesn’t']),blank('',' this table.',['lift','lifts','lifting'])],['can’t','lift']),'He can’t lift this table.。'),
    q('e-question','独立提出can一般疑问句','用词块问：Pamela 能读这本书吗？',bank(['Can','Pamela','read','this book','Does','reads'],'Can Pamela read this book',4,'?'),'Can 前置，read 保持原形。'),
    q('e-reply','肯否短答由事实决定','你看得见飞机，但看不见鸟。\nCan you see a bird?',choice(['No, I can’t.','Yes, I can.','No, I am not.'],'No, I can’t.'),'题目说看不见鸟，回答 No, I can’t.。'),
    q('e-pronoun','问答视角独立判断','你和Sam会刷书架，Penny和Jane会洗盘子。由你回答：',fill([blank('Can you and Sam paint the bookcase? Yes, ',' can.',['we','they','he']),blank('Can Penny and Jane wash the dishes? Yes, ',' can.',['we','they','she'])],['we','they']),'包含自己用 we；另外两人用 they。'),
    q('e-who','who作主语独立组句','用词块问：谁会做饼干？',bank(['Who','can','make biscuits','she','does'],'Who can make biscuits',3,'?'),'Who can make biscuits? 不再加she。'),
    q('e-what','what特殊疑问独立组句','用词块问：他们能做什么？',bank(['What','can','they','do','are'],'What can they do',4,'?'),'What can they do?。'),
    q('e-details','从回答区分地点与时间','分别补上问地点、问时间的词。',fill([blank('',' can I find Bob? — In his office.',['Where','When','Who']),blank('',' can he come? — Now.',['Where','When','How'])],['Where','When']),'in his office 是地点，now 是时间。'),
    q('e-how','依据方法回答构成how问句','答句是 With this key.（用这把钥匙。）\n补全问句。',fill([blank('',' can I open the door?',['How','When','Who'])],['How']),'用钥匙是方法，所以问 How。'),
    q('e-many','看图独立组织数量问句','你想问能看见几封信，补全问句。',{...fill([blank('',' letters can you see?',['How many','How much','Who'])],['How many']),image:image('letters'),imageAlt:'三封可以分别数出的信'},'letters 是可数复数，用 How many。'),
    q('e-much','独立询问不可数物质的量','用词块问：你能看见多少水？',bank(['How much','water','can','you','see','How many'],'How much water can you see',5,'?'),'water 是不可数名词，问它的量用 How much。'),
    q('e-change','区分正在做与能做并正确改写','She is making the bed.（正在铺床）\n改成“她能铺床”。',fill([blank('She ','',['can','is']),blank('',' the bed.',['make','making','makes'])],['can','make']),'She can make the bed. 改说能力，含义也变了。'),
    q('e-but','独立表达本领对比并理解but','你能举起椅子，但举不起桌子。',fill([blank('I can lift the chair, ','',['but','and']),blank('I ',' lift the table.',['can’t','can'])],['but','can’t']),'but 表示转折，can’t 说明不能举起桌子。'),
    q('e-request','礼貌请求与递物回应','老板说：Can you give me that letter, please?\n你递给他时怎样说？',choice(['Here you are.','What’s the matter?','No, I can’t.'],'Here you are.'),'递东西给对方时，可以说 Here you are.。'),
    q('e-number','独立辨认教材千位数词','a thousand 是哪个数？',choice(['1,000','100,000','1,000,000'],'1,000'),'a thousand 是一千；a million 是一百万。')
  ];
  // Number reference is available before the independent challenge check.
  unit.learning.MODELS=[
    ['1,000 · a thousand','hat','I can put my hat on, but I can’t put my coat on.','我能戴上帽子，但不能穿上外套。','put-on'],
    ['5,000 · five thousand','aeroplane','I can see that aeroplane, but I can’t see a bird.','我能看见那架飞机，但看不见鸟。','aeroplane'],
    ['10,000 · ten thousand','bookcase','I can paint this bookcase, but I can’t paint this room.','我能油漆这个书架，但不能粉刷这个房间。','bookcase'],
    ['100,000 · a hundred thousand','chair','I can lift that chair, but I can’t lift this table.','我能举起那把椅子，但举不起这张桌子。','lift'],
    ['210,000 · two hundred and ten thousand','book','I can read this book, but I can’t read that magazine.','我能读这本书，但读不了那本杂志。','read'],
    ['350,000 · three hundred and fifty thousand','box','I can jump off this box, but I can’t jump off that wall.','我能从这个箱子上跳下来，但不能从那堵墙上跳下来。','box'],
    ['500,000 · five hundred thousand','cakes','I can make cakes, but I can’t make biscuits.','我会做蛋糕，但不会做饼干。','cake'],
    ['1,000,000 · a million','vase','I can put the vase on this table, but I can’t put it on that shelf.','我能把花瓶放在这张桌上，但不能放在那个架子上。','vase']
  ].map(([number,word,en,cn,art])=>({number,word,en,cn,image:image(art)}));
  unit.learning.WRITING_A=['They are typing these letters.','She is making the bed.','You are swimming across the river.','We are coming now.','We are running across the park.','He is sitting on the grass.','I am giving him some chocolate.'];
  unit.learning.WRITING_B=['Can you type this letter?','Can Penny wait for the bus?','Can Penny and Jane wash the dishes?','Can George take these flowers to her?','Can the cat drink its milk?','Can you and Sam paint this bookcase?','Can you see that aeroplane?','Can Jane read this book?'];
  core.unit4546=unit;
  if(root.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// v1.53: retain the approved five-star identity, artwork and original date.
(function(core){
'use strict';const unit=core.unit4546,old=JSON.parse(JSON.stringify(unit));core.unit4546BeforeV153=old;
unit.contentRevision='office-teaching-v153';
unit.sources={text:'课本纸90–93／PDF123–126',guide:'同步导学纸81–83／PDF95–97；Grammar纸82／PDF96',workbook:'语法练习册纸126–130／PDF140–144'};
unit.objects=old.objects.map(w=>({...w,image:w.en==='put on'?'/assets/unit45-46/put-on-v153.svg':['thousand','million'].includes(w.en)?'/assets/unit45-46/'+w.en+'-v153.svg':w.image}));unit.learning.WORDS=unit.objects;
const material=(title,material)=>({title,material});
function revise(group,id,changes){const i=unit.questions[group].findIndex(q=>q.id===id);if(i<0)throw Error(id);unit.questions[group][i]={...unit.questions[group][i],...changes,id:id+'-v153'};}
revise('roles','u4546-v1-r-place',{display:material('Bob说Pamela在哪里？','The boss: Where’s Pamela?\nBob: She’s next door. She’s in her office, sir.')});
revise('roles','u4546-v1-r-handoff',{display:material('Bob把信给谁？','Bob: Here you are.\nPamela: Thank you, Bob.')});
revise('roles','u4546-v1-r-cause',{display:material('Pamela为什么打不了这封信？','Pamela: I can’t type this letter.\nI can’t read it! The boss’s handwriting is terrible!')});
revise('roles','u4546-v1-r-ability',{display:material('哪种理解符合这两段话？','Pamela: Yes, of course I can.\n后来：I can’t read it! The boss’s handwriting is terrible!')});
revise('grammar','u4546-v1-g-reply',{workshop:{rule:'Can you…?的肯否短答由给出的事实决定，can本身不随人称变化。',model:{lines:[['Can you write in English?','导学原例：会写，Yes, I can.；不会写，No, I can’t.。']]}}});
revise('grammar','u4546-v1-g-pronoun',{workshop:{rule:'回答包含自己的两个人用we，另外两个人用they。',model:{lines:[['Can you and Jane see the bird? — Yes, we can.','假设你和Jane都看得见，回答包含自己。'],['Can Bob and Sam see the bird? — Yes, they can.','假设Bob和Sam都看得见，回答另外两个人。']]}}});
revise('apply','u4546-v1-a-request',{display:material('请Bob来帮忙，怎样说？','The boss is here. Bob is over there.\n老板想请Bob过来帮忙。')});
revise('apply','u4546-v1-a-person',{display:material('谁能帮忙打字？','新任务：Bob已经拿到老板的这封信。\nPamela: I can type.\nBob: I can’t type.\nThe boss: I can’t type.')});
revise('apply','u4546-v1-a-problem',{display:material('哪句话把她的本领和这次困难说清楚？','Pamela: I can type.\nI can’t read this letter.')});
revise('exam','u4546-v1-e-many',{prompt:'问能看见几封信，补全问句。',blanks:[{before:'',after:' ',options:['How many','How much','Who']},{before:'',after:' can you see?',options:['letters','letter']}],answer:JSON.stringify(['How many','letters']),explanation:'一封封的信可数，用How many加复数letters，再接can you see。'});
const q=(id,target,prompt,input,explanation)=>({id:'u4546-v153-'+id,target,prompt,source:unit.sources.text,...input,explanation,hint:'',distractorRationale:'按明确给出的能力、人物与说话意图判断，不从职业、问号或原文记忆猜答案。'});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),blank=(before,after,options)=>({before,after,options});
unit.questions.grammar.splice(13,0,
 {...q('g-third-person','用she与it回答明确对象的can问句','Pamela会读这本书；这只猫能喝碟子里的奶。分别作肯定回答。',fill([blank('Can Pamela read this book? Yes, ',' can.',['she','he','it']),blank('Can the cat drink its milk? Yes, ',' can.',['it','she','they'])],['she','it']),'这里Pamela用she；这只猫沿用课本it的称呼。'),workshop:{rule:'回答时，代词要指回题目中的对象。',model:{lines:[['Can Bob see it? — Yes, he can.','假设Bob看得见，Bob用he。'],['Can Jane see the book? — Yes, she can.','假设Jane看得见。'],['Can the bird see it? — Yes, it can.','假设这只鸟看得见；这里用it指它。']]}}},
 {...q('g-request','区分能力询问与请对方做事','Bob对Pamela说下面的话，想得到什么帮助？',{options:['把书递给他','说出书在哪里','判断书是什么颜色'],answer:'把书递给他',display:material('Bob想得到什么帮助？','书在Pamela手边。\nBob: Can you give me the book, please?')},'在这个情境中，Can you…please?是请求对方做事。'),workshop:{rule:'同样是can问句，要结合语境判断是在问能力，还是请对方做事。',model:{lines:[['Can you swim?','问有没有游泳的本领。'],['Can you open the door, please?','门关着，请对方帮忙开门。']]}}}
);
unit.questions.exam.push(
 q('e-third-person','独立按he与it完成第三人称短答','George先生能举起椅子；这只猫能喝奶。分别回答。',fill([blank('Can George lift the chair? Yes, ',' can.',['he','she','they']),blank('Can the cat drink its milk? Yes, ',' can.',['it','we','they'])],['he','it']),'George用he，这只猫按课本称呼用it。'),
 q('e-she','独立用she保留否定事实','这次Pamela读不懂这封信。Bob问：Can Pamela read this letter? 应怎样回答？',{options:['No, she can’t.','Yes, she can.','No, he can’t.'],answer:'No, she can’t.'},'按题目事实否定，Pamela用she；不把不能读这封信变成不会打字。'),
 q('e-request-minute','独立理解原文请求及a minute的语境意义','老板想请Bob过来商量一件事。这句话想请他做什么？',{options:['过来一会儿','必须坐满六十秒','告诉老板Pamela在哪儿'],answer:'过来一会儿',display:material('这句话想请Bob做什么？','老板想请Bob过来商量一件事。\nCan you come here a minute please, Bob?')},'这里是请Bob过来一下；a minute表示一会儿，并非要求计时六十秒。')
);
unit.taskSessions={};unit.taskPredecessors={};for(const id of ['roles','grammar','apply','exam']){unit.taskSessions[id]='v153';unit.taskPredecessors[id]=[{key:'unit4546-'+id+'-practice/v1',questions:old.questions[id]}];}
core.unit4546=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);
