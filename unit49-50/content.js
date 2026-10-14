(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit49-50/'+name+'.svg',old=name=>'/assets/lesson49/icons/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson49–50，纸页98–101／PDF131–134';
const grammarSource='《同步导学》Grammar纸页91／PDF105：选择疑问句';
const WORDS=[
 ['butcher','卖肉者','/ˈbʊtʃə/','butcher'],['meat','肉','/miːt/','meat'],['beef','牛肉','/biːf/','beef'],['lamb','羔羊肉','/læm/','lamb'],['husband','丈夫','/ˈhʌzbənd/','husband'],['steak','牛排','/steɪk/','steak'],
 ['mince','肉馅','/mɪns/','mince'],['chicken','鸡；鸡肉','/ˈtʃɪkɪn/','chicken'],['tell','告诉','/tel/','tell'],['truth','实情','/truːθ/','truth'],['either','也（用于否定句）','/ˈaɪðə/','either'],
 ['tomato','西红柿','/təˈmɑːtəʊ/','tomato'],['potato','土豆','/pəˈteɪtəʊ/','potato'],['cabbage','卷心菜','/ˈkæbɪdʒ/','cabbage'],['lettuce','莴苣','/ˈletɪs/','lettuce'],['pea','豌豆','/piː/','pea'],['bean','豆角','/biːn/','bean'],['pear','梨','/peə/','pear'],['grape','葡萄','/ɡreɪp/','grape'],['peach','桃','/piːtʃ/','peach'],
 ['piece','块；片','/piːs/','piece'],['pound','磅（重量单位）','/paʊnd/','pound'],['What about…?','……怎么样？','/wɒt əˈbaʊt/','question'],['to tell you the truth','说实话','/tə tel juː ðə truːθ/','truth'],
 ['or','或者；还是','/ɔː/','choice'],['both','两者都','/bəʊθ/','both'],['neither','两者都不','/ˈnaɪðə/','neither'],['all','全部（三者或以上）','/ɔːl/','all'],['none','一个也没有','/nʌn/','none'],['too','也（常用于肯定句）','/tuː/','heart']
].map(([en,cn,ph,art])=>({en,cn,ph,image:['butcher','husband','tell','truth','either','tomato','potato','cabbage','lettuce','pea','bean','pear','grape','peach','choice','both','neither','all','none'].includes(art)?image(art):old(art)}));
const unit={id:'unit49-50',version:2,contentRevision:'butcher-choices-v2',mode:'classroom',title:'晚餐采购大冒险',path:'/unit49-50/',start:'learn/words',
 progress:{learningKey:'canran:unit49-50:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
  {id:'l1',title:'采购准备',activities:[['words','采购小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
  {id:'l2',title:'走进肉店',activities:[['text','肉店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
  {id:'l3',title:'选哪一种呢',activities:[['grammar','语法小工坊','question']],required:['grammar']},
  {id:'l4',title:'帮忙买晚餐',activities:[['apply','晚餐小采购员','give']],required:['apply']},
  {id:'l5',title:'采购大挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},legacyEdition:'unit49-50-completion-v1',
 reward:{edition:'butcher-choices-v2',title:'晚餐采购小达人',lesson:'Lesson 49–50',scene:'/assets/unit49-50/keepsake-story-v2.webp',alt:'白帽条纹围裙的老板把纸包交给绿外套的Mrs. Bird，她提着采购篮微笑接过',color:'#a45e45',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','晚餐小采购员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['butcher','Do you want any meat today, Mrs. Bird?','您今天要来点肉吗，伯德夫人？'],['bird','Yes, please.','好的，请来一些。'],
 ['butcher','Do you want beef or lamb?','您要牛肉还是羔羊肉？'],['bird','Beef, please.','请给我牛肉。'],
 ['butcher',"This lamb’s very good.",'这羔羊肉很不错。'],['bird',"I like lamb, but my husband doesn’t.",'我喜欢羔羊肉，可是我丈夫不喜欢。'],
 ['butcher','What about some steak? This is a nice piece.','来点牛排怎么样？这块很好。'],
 ['bird','Give me that piece, please. And a pound of mince, too.','请给我那块。再来一磅肉馅。'],
 ['butcher',"Do you want a chicken, Mrs. Bird? They’re very nice.",'您要只鸡吗，伯德夫人？这些鸡很好。'],
 ['bird',"No, thank you. My husband likes steak, but he doesn’t like chicken.",'不了，谢谢。我丈夫喜欢牛排，但他不喜欢鸡肉。'],
 ['butcher',"To tell you the truth, Mrs. Bird, I don’t like chicken either!",'说实话，伯德夫人，我也不喜欢鸡肉！']
].map(([who,text,cn],i)=>({id:'u4950-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u4950-v2-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
const a=(id,target,prompt,input,rule,hint,demo)=>({...q('a-'+id,target,prompt,input,rule,hint),...(demo?{workshop:{model:demo}}:{})});
unit.questions.listen=[
 q('v-meat','辨认肉类词义','把肉类与意思连起来。',match([['beef','牛肉'],['lamb','羔羊肉'],['steak','牛排'],['chicken','鸡；鸡肉']]),'lamb在这课表示羔羊肉。'),
 q('v-mince','辨认肉馅','图中是什么？',choice(['mince','steak','chicken'],'mince',{image:old('mince'),imageAlt:'一盘细碎的肉馅'}),'mince是肉馅。'),
 q('v-vegetables','辨认四种蔬菜','给蔬菜配上意思。',match([['tomato','西红柿'],['potato','土豆'],['cabbage','卷心菜'],['lettuce','莴苣']]),'四种蔬菜各有自己的名字。'),
 q('v-peas','区分pea与bean','选出 pea。',choice(['豌豆','豆角','梨'],'豌豆',{optionImages:{'豌豆':image('pea'),'豆角':image('bean'),'梨':image('pear')}}),'pea是豌豆；bean在这课指豆角。'),
 q('v-fruit','辨认水果','给水果配上意思。',match([['pear','梨'],['grape','葡萄'],['peach','桃']]),'pear、grape、peach分别是梨、葡萄、桃。'),
 q('v-husband','理解家庭关系词','Mrs. Bird说my husband，指她的谁？',choice(['丈夫','父亲','儿子'],'丈夫'),'husband是丈夫，不是凭人物长相判断。'),
 q('v-meaning','区分动作与抽象名词','给词语配上意思。',match([['tell','告诉'],['truth','实情'],['meat','肉']]),'tell是动作，truth是实情。'),
 q('v-either','理解否定句末的either','I don’t like chicken either.\neither在这里表示什么？',choice(['也不','两个都','想要'],'也不'),'句末的either表示相同的否定情况。')
];
unit.questions.roles=[
 q('r-husband','丈夫的喜好','课文中，Mrs. Bird的丈夫喜欢什么肉？',choice(['steak','lamb','chicken'],'steak',{optionImages:{steak:old('steak'),lamb:old('lamb'),chicken:old('chicken')}}),'My husband likes steak.','回想Mrs. Bird最后说丈夫喜欢什么。'),
 q('r-bird','不把两个人的喜好混在一起','Mrs. Bird自己喜欢哪一种？',choice(['lamb','她不喜欢任何肉','课文说她只喜欢鸡肉'],'lamb'),'I like lamb中的I指Mrs. Bird。','找她用I介绍喜好的那句。'),
 q('r-order','同时理解两种购买物品','Give me that piece, please. And a pound of mince, too.\n她在这里要买哪两样？',choice(['一块牛排和一磅肉馅','羔羊肉和一只鸡','只有一磅肉馅'],'一块牛排和一磅肉馅'),'that piece指老板刚介绍的牛排，too再加上肉馅。','that piece接着老板介绍的那块肉。'),
 q('r-recipient','理解交接的接收者','Mrs. Bird说Give me that piece, please.\n接收者是谁？',choice(['Mrs. Bird','the butcher','她的丈夫'],'Mrs. Bird'),'me指说话人Mrs. Bird。','先看这句话是谁说的。'),
 q('r-shared','理解老板的共同喜好','老板最后说I don’t like chicken either!\n哪两个人都不喜欢鸡肉？',choice(['老板和Mrs. Bird的丈夫','老板和Mrs. Bird','Mrs. Bird和她的丈夫'],'老板和Mrs. Bird的丈夫'),'老板说自己和她的丈夫一样不喜欢鸡肉。','either接着谁不喜欢鸡肉的那句话？'),
 q('r-limit','原文事实与推断边界','Mrs. Bird不买鸡。能确定她自己不喜欢鸡肉吗？',choice(['不能，原文没说明她自己的这个喜好','能，她说丈夫不喜欢','能，老板不喜欢'],'不能，原文没说明她自己的这个喜好'),'不买不等于不喜欢，别人的喜好也不等于她的。','只依据她明确说过的内容。')
];
unit.questions.grammar=[
 g('purpose','选择疑问句让对方选哪一种','Do you want peas or beans? 在问什么？',choice(['要豌豆还是豆角','是不是喜欢所有蔬菜','要多少豌豆'],'要豌豆还是豆角'),'选择疑问句把选项说出来，让对方作选择。','注意两个物品之间的词。',model(['Do you want tea or coffee?','要茶，还是咖啡？把两种选择说出来。'])),
 g('or','用or连接选择项','点出表示“还是”的词。',{type:'locate',fragments:['Do you want ',{value:'beef'},' ',{value:'or'},' ',{value:'lamb'},'?'],options:['beef','or','lamb'],answer:'or'},'or连接可选的内容。','找连接两个选项的词。',model(['Is this red or blue?','是红色，还是蓝色？'])),
 g('answer','明确选择可以用简短回答','老板问Do you want beef or lamb?\n你这次要羔羊肉，怎样说清楚？',choice(['Lamb, please.','Yes, I do.','No, I don’t.'],'Lamb, please.'),'直接说选哪一种；只说Yes或No没有说明选择。','回答里要让老板知道是哪种肉。',model(['Do you want tea or coffee? — Tea, please.','也可以完整说I want tea.'])),
 g('build','用Do构成选择问句','用词块问：你要牛肉还是鸡肉？',bank(['Do','you','want','beef','or','chicken','and','Are'],'Do you want beef or chicken',6,'?'),'Do you want…or…? 给出两个选择。','问“想要”用Do you want。',model(['Do you like apples or pears?','选择内容放在or两侧。'])),
 g('be','be句也能提出选择','用词块问：这是卷心菜还是莴苣？',bank(['Is','this','cabbage','or','lettuce','Do'],'Is this cabbage or lettuce',5,'?'),'“是”用Is this…or…?，不把Do加到be前。','先分清是在问“是”还是“想要”。',model(['Is he a teacher or a doctor?','be句的选择问句用Is开头。'])),
 g('which','which开头并列出选项','补全：你要哪一种，苹果还是梨？',fill([blank('',' do you want, apples',['Which','Who']),blank('',' pears?',['or','and'])],['Which','or']),'Which先问“哪一种”，后面列出可选项。','问物品选哪一种，不是问谁。',model(['Which do you like, tomatoes or potatoes?','你喜欢哪一种，西红柿还是土豆？'])),
 g('three','选择疑问句可以有三个选项','Which do you want, pears, grapes or peaches?\n你想要桃子，怎样回答？',choice(['I want peaches.','Yes, I do.','I want pears.'],'I want peaches.'),'三个选项也要按实际需要明确回答。','先找到题目规定的需要。',model(['Is it red, green or blue? — It is green.','最后一个选择前用or；完整句也能回答。'])),
 g('contrast','区分是否问句与选择问句','两次都想要羔羊肉，分别怎样回答？',fill([blank('Do you want lamb? ', '',['Yes, please.','I am lamb.']),blank('Do you want beef or lamb? ','',['Lamb, please.','Yes, please.'])],['Yes, please.','Lamb, please.']),'是否问句可答Yes；选择问句要说明选项。','第二句多了两个可选的内容。',model(['Do you like tea? — Yes, I do.','是否喜欢？'],['Do you like tea or coffee? — Tea.','在两种中作选择。'])),
 g('both','两个都要可回答Both','老板问Beef or lamb?\n两种都想要，怎样回答？',choice(['Both, please.','Neither, thank you.','Either.'],'Both, please.'),'Both表示两者都；不是只能选其中一个。','这里明确要两种。',model(['Tea or coffee? — Both, please.','两种都要。'])),
 g('either','选择回答中的Either指两者任一','Pears or peaches?\n你两种都可以，拿任意一种就好。',choice(['Either.','Both, please.','Neither.'],'Either.'),'Either在这里是两者任一，与否定句末的“也不”不同。','任意一种，不是两种全要。',model(['Tea or coffee? — Either. I don’t mind.','两种都可以，任意一种就好。'])),
 g('neither','两个都不要可回答Neither','Beef or chicken?\n两种都不要，你想要羔羊肉。',choice(['Neither. I want lamb.','Both, please.','Either.'],'Neither. I want lamb.'),'Neither表示两者都不，可以补充自己的另一选择。','先排除题目里给出的两种。',model(['Tea or coffee? — Neither. I want milk.','两种都不要，我想要牛奶。'])),
 g('many','三种或以上的全部与全不','给出apples、pears、grapes三种。补全两位客人的话。',fill([blank('三种都要：',' , please.',['All','Both']),blank('三种都不要：',' , thank you.',['None','Either'])],['All','None']),'这里三种全部用All；三种都不要用None。','先数有几个可选项。',model(['Red, green or blue? — All.','三种全部。'],['Red, green or blue? — None.','三种都不选。'])),
 g('independent','撤去示范后构成选择问句','用词块问：你要西红柿还是土豆？',bank(['Do','you','want','tomatoes','or','potatoes','and','Are'],'Do you want tomatoes or potatoes',6,'?'),'Do you want tomatoes or potatoes?','连出一个选择问句。'),
 g('transfer','独立理解多项选择的拒绝','Which do you want, pears, grapes or peaches?\n客人说None. I want apples.是什么意思？',choice(['这三种都不要，想要苹果','三种都要，还要苹果','任意一种水果都可以'],'这三种都不要，想要苹果'),'None指前面列出的三种都不要。','按客人的完整回答判断。')
];
unit.questions.apply=[
 a('preference','转述喜欢但本次不要','Penny喜欢西红柿，但这次不想要。',fill([blank('She ',' tomatoes, but she doesn’t',['like','likes']),blank('',' any.',['want','wants'])],['likes','want']),'肯定句She likes；doesn’t后回到原形want。','先看主语，再看doesn’t后面的词。',model(['He likes grapes, but he doesn’t want any.','喜欢不代表这次想要。'])),
 a('want','根据本次需要作判断','Sam: I like cabbage, but I don’t want any today.\nSam今天要买卷心菜吗？',choice(['No, he doesn’t.','Yes, he does.','Yes, he is.'],'No, he doesn’t.'),'today说这一次；不能只读到I like就买。','读完but后面的内容。',model(['Does she like pears? Yes, she does.','问喜好。'],['Does she want any pears today? No, she doesn’t.','问这次是否想要。'])),
 a('also','按相同肯否选择too或either','两位新客人喜好相同，补全第二个人的话。',fill([blank('A: I like steak. B: I like steak, ','.',['too','either']),blank('A: I don’t like lamb. B: I don’t like lamb ','.',['too','either'])],['too','either']),'肯定句末用too，否定句末用either表达“也”。','先判断相同的是喜欢，还是不喜欢。',model(['I like apples. → I like apples, too.','也喜欢。'],['I don’t like pears. → I don’t like pears either.','也不喜欢。'])),
 a('give','用to改写交接句','保持意思不变：Give me that piece, please.\n用Give that piece开头。',bank(['Give','that piece','to','me,','please.','I'],'Give that piece to me, please.',5,''),'Give＋物品＋to＋接收者；me不能改成I。','物品先说时，用to连到接收者。',model(['Give her the book. → Give the book to her.','同一件物品，同一个接收者。'])),
 a('ellipsis','一般动词否定省略保持人称','两人的喜好不同，把句子补完整。',fill([blank('He likes coffee, but I ','.',['don’t','doesn’t','am not']),blank('She likes tea, but he ','.',['doesn’t','don’t','isn’t'])],['don’t','doesn’t']),'省掉重复的like…，保留与主语对应的don’t／doesn’t。','补回like就容易看清。',model(['I like apples, but she doesn’t.','后半句省略like apples。'])),
 a('be-ellipsis','进行时省略保留be的否定','两人的当前动作不同，补全对比。',fill([blank('He is eating some bread, but she ','.',['isn’t','doesn’t','aren’t']),blank('They are working hard, but we ','.',['aren’t','isn’t','don’t'])],['isn’t','aren’t']),'is／are的句子用isn’t／aren’t，不改成doesn’t。','省略之前，先认清原句的结构。',model(['He is reading, but they aren’t.','they后保留are的否定。'])),
 a('can-ellipsis','can与I am的否定省略','补全能力和当前动作的对比。',fill([blank('She can type very well, but he ','.',['can’t','doesn’t','isn’t']),blank('He is reading a magazine, but I ','.',['am not','isn’t','don’t'])],['can’t','am not']),'能力否定用can’t；I对应am not。','不是所有否定都用don’t。',model(['I can swim, but she can’t.','can的否定。'],['She is working, but I am not.','I后保留am not。'])),
 a('order','整合新采购单的实际需求','Penny: I like tomatoes, but I don’t want any.\nSam: I want some cabbage and pears.\n这次该装哪一篮？',choice(['卷心菜和梨','西红柿和梨','只有卷心菜'],'卷心菜和梨',{optionImages:{'卷心菜和梨':image('order-cabbage-pear'),'西红柿和梨':image('order-tomato-pear'),'只有卷心菜':image('cabbage')}}),'不买Penny这次不要的；Sam提到的两样都要有。','分别核对每个人这次想要什么。')
];
unit.questions.exam=[
 q('e-words','独立区分肉类词汇','把肉类与意思配对。',match([['meat','肉'],['beef','牛肉'],['mince','肉馅'],['steak','牛排']]),'meat是总称，其他三个是具体肉类或形态。'),
 q('e-vegetables','独立辨认蔬菜','给蔬菜配上意思。',match([['pea','豌豆'],['bean','豆角'],['lettuce','莴苣']]),'三种蔬菜各有对应名字。'),
 q('e-story','区分原文人物的不同喜好','根据课文补全各自的喜好。',fill([blank('Mrs. Bird likes ','.',['lamb','chicken']),blank('Her husband likes ','.',['steak','lamb'])],['lamb','steak']),'不要把夫妻两人的喜好混为一谈。'),
 q('e-choice-reading','理解选择与没有说明的事实','Mrs. Bird拒绝买鸡，理由提到丈夫不喜欢鸡肉。\n哪句话只说了课文能确定的事实？',choice(['丈夫不喜欢鸡肉','夫人一定不喜欢鸡肉','夫妻俩都讨厌所有肉'],'丈夫不喜欢鸡肉'),'不能把购买选择扩大成没有说过的个人喜好。'),
 q('e-or','独立连接选择内容','补全：你要豌豆还是豆角？',fill([blank('Do you want peas ',' beans?',['or','and'])],['or']),'or表示还是。'),
 q('e-answer','独立明确回应选择问句','Do you want a peach or a pear?\n你只想要一个梨。',choice(['A pear, please.','Yes, please.','Both, please.'],'A pear, please.'),'明确说出选哪个。'),
 q('e-build','独立构成do选择问句','用词块问：你要牛排还是鸡肉？',bank(['Do','you','want','steak','or','chicken','and'],'Do you want steak or chicken',6,'?'),'Do you want…or…?。'),
 q('e-be','独立构成be选择问句','用词块问：这是梨还是桃？',bank(['Is','this','a pear','or','a peach','Do'],'Is this a pear or a peach',5,'?'),'Is this…or…?。'),
 q('e-which','独立构成which选择问句','用词块问：你要哪一种，苹果还是梨？',bank(['Which','do','you','want,','apples','or','pears','Who'],'Which do you want, apples or pears',7,'?'),'Which先提出选择，后面给选项。'),
 q('e-either','独立理解二选一任意选择','Grapes or peaches?\n你任意一种都可以，怎样回答？',choice(['Either.','Both.','Neither.'],'Either.'),'Either表示两种中任意一种。'),
 q('e-both','独立理解两个都要','Tomatoes or potatoes?\n你这次两种都要。',choice(['Both, please.','Either.','Neither.'],'Both, please.'),'Both表示两者都。'),
 q('e-neither','独立理解两个都不选','Cabbage or lettuce?\n你两种都不要，想要豆角。',choice(['Neither. I want beans.','Either.','Both, please.'],'Neither. I want beans.'),'Neither否定前面两个选项。'),
 q('e-many','独立区分多项全部与全不','三种水果apples、pears、peaches，分别完成两人的选择。',fill([blank('全要：',' , please.',['All','Both']),blank('全不要：',' , thank you.',['None','Either'])],['All','None']),'三种全要用All，全不要用None。'),
 q('e-third','独立使用第三人称及动词还原','Sam喜欢豆角，但这次不想要羔羊肉。',fill([blank('Sam ',' beans.',['like','likes']),blank('He doesn’t ',' any lamb.',['want','wants'])],['likes','want']),'肯定用likes，doesn’t后用原形want。'),
 q('e-does','独立提出第三人称问句','问：Penny喜欢桃子吗？',fill([blank('',' Penny',['Does','Do','Is']),blank('',' peaches?',['like','likes'])],['Does','like']),'Does Penny like peaches?。'),
 q('e-replies','独立按人称与事实短答','你喜欢梨；Sam不喜欢鸡肉。由你回答。',fill([blank('Do you like pears? Yes, I ','.',['do','does','am']),blank('Does Sam like chicken? No, he ','.',['doesn’t','don’t','isn’t'])],['do','doesn’t']),'Do问I用do；Does问he否定用doesn’t。'),
 q('e-ellipsis','独立使用一般动词否定省略','补全不同喜好的对比。',fill([blank('She likes peaches, but I ','.',['don’t','doesn’t','am not']),blank('I like beans, but he ','.',['doesn’t','don’t','isn’t'])],['don’t','doesn’t']),'省略相同like部分，助动词随新主语变化。'),
 q('e-be-ellipsis','独立使用is与are的否定省略','补全不同当前动作的对比。',fill([blank('He is cooking, but she ','.',['isn’t','doesn’t']),blank('They are eating, but we ','.',['aren’t','don’t'])],['isn’t','aren’t']),'is／are的否定保持be结构。'),
 q('e-can-ellipsis','独立使用can与am的否定省略','补全能力与当前动作的对比。',fill([blank('She can swim, but he ','.',['can’t','doesn’t']),blank('He is working, but I ','.',['am not','don’t'])],['can’t','am not']),'can与I am各有对应的否定。'),
 q('e-also','独立使用too与否定句末either','两人想法相同，补全第二人的话。',fill([blank('A: I like pears. B: I like pears, ','.',['too','either']),blank('A: I don’t want grapes. B: I don’t want grapes ','.',['too','either'])],['too','either']),'肯定相同用too，否定相同用either。'),
 q('e-recipient','独立理解交接的接收者','老板对Mrs. Bird说Give me the bag, please.\n这一次接收者是谁？',choice(['the butcher','Mrs. Bird','她的丈夫'],'the butcher'),'me随说话人改变，这次是老板。'),
 q('e-give','独立改写交接句','保持意思不变：Give her the beans, please.\n用Give the beans开头。',bank(['Give','the beans','to','her,','please.','she'],'Give the beans to her, please.',5,''),'物品先说，用to连接接收者her。'),
 q('e-shopping','独立整合喜好和本次订单','Ann: I like peaches, but I don’t want any today.\nTom: I want some beans and potatoes.\n今天买什么？',choice(['豆角和土豆','桃和土豆','只买豆角'],'豆角和土豆'),'读本次需求，且不能漏掉其中一种。'),
 q('e-order','独立辨认本课序数词','把序号与英文配对。',match([['20th','twentieth'],['21st','twenty-first'],['22nd','twenty-second'],['24th','twenty-fourth']]),'20th变化为twentieth；21、22沿用first、second。')
];
unit.learning.MODELS=[
 ['13th','thirteenth','choice tomatoes','精选西红柿','tomato'],['14th','fourteenth','new potatoes','新土豆','potato'],['15th','fifteenth','fresh cabbages','新鲜卷心菜','cabbage'],['16th','sixteenth','fresh lettuces','新鲜莴苣','lettuce'],['17th','seventeenth','garden peas','鲜豌豆','pea'],['18th','eighteenth','garden beans','鲜豆角','bean'],['19th','nineteenth','ripe bananas','成熟的香蕉','banana'],['20th','twentieth','sweet oranges','甜橙','orange'],['21st','twenty-first','choice apples','精选苹果','apple'],['22nd','twenty-second','choice pears','精选梨','pear'],['23rd','twenty-third','choice grapes','精选葡萄','grape'],['24th','twenty-fourth','choice peaches','精选桃子','peach']
].map(([number,ordinal,en,cn,art])=>({number:number+' · '+ordinal,en,cn,image:['banana','orange','apple'].includes(art)?'/assets/unit47-48/'+art+'.svg':image(art)}));
unit.learning.WRITING_A=['He likes coffee, but I ______.','She likes tea, but he ______.','He is eating some bread, but she ______.','She can type very well, but he ______.','They are working hard, but we ______.','He is reading a magazine, but I ______.'];
unit.learning.WRITING_B=['Does Sam like cabbage?','Do you like lettuce?','Do you like peas?','Does Mrs. White like beans?','Do you like bananas?','Does Mr. Jones like oranges?','Does George like apples?','Does Elizabeth like pears?','Do you like grapes?','Does Carol like peaches?'];
unit.routeAliases=Object.fromEntries(['doare','subjects','fill','choice','trans','give','needs','pouch','either','phrases','models'].map(id=>['learn/'+id,'learn/'+(['doare','phrases','models'].includes(id)?'grammar':'apply')]));
core.unit4950=unit;
if(typeof document!=='undefined'&&document.documentElement.dataset.unit==='unit49-50')core.learningContext=unit;
})(globalThis);
