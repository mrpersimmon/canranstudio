(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit115-116/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页234–237／PDF267–270',grammarSource='《同步导学》Grammar纸页192–193／PDF206–207；《语法练习册》纸页335–343／PDF349–357';
const rows=[
['anyone','任何人；有人（疑问语境）','/ˈeniwʌn/','anyone'],['knock','敲；打','/nɒk/','knock'],['everything','一切事物','/ˈevriθɪŋ/','everything'],['quiet','宁静的；安静的','/ˈkwaɪət/','quiet'],['impossible','不可能的','/ɪmˈpɒsəbəl/','impossible'],['invite','邀请','/ɪnˈvaɪt/','invite'],
['anything','任何东西；什么（疑问语境）','/ˈeniθɪŋ/','anything'],['nothing','什么也没有；没有什么','/ˈnʌθɪŋ/','nothing'],['lemonade','柠檬水','/ˌleməˈneɪd/','lemonade'],['joke','开玩笑','/dʒəʊk/','joke'],['asleep','睡着的','/əˈsliːp/','asleep'],['glasses','眼镜（复数形式）','/ˈɡlɑːsɪz/','glasses'],
['everyone','每个人；大家','/ˈevriwʌn/','everyone'],['everybody','每个人；大家','/ˈevribɒdi/','everyone'],['no one','没有人','/ˈnəʊ wʌn/','nobody'],['nobody','没有人','/ˈnəʊbədi/','nobody'],['someone','某人；有人','/ˈsʌmwʌn/','someone'],['somebody','某人；有人','/ˈsʌmbədi/','someone'],
['something','某物；某事','/ˈsʌmθɪŋ/','something'],['anywhere','任何地方；什么地方（疑问语境）','/ˈeniweə/','anywhere'],['everywhere','各处；到处','/ˈevriweə/','everywhere'],['nowhere','无处；哪里也不','/ˈnəʊweə/','nowhere'],['somewhere','某处','/ˈsʌmweə/','somewhere'],['anybody','任何人；有人（疑问语境）','/ˈenibɒdi/','anyone'],
['none','一个也没有；一点也没有','/nʌn/','none'],['beer','啤酒（原文饮品）','/bɪə/','beer'],['garden','花园','/ˈɡɑːdən/','garden'],['look through','透过……看','/lʊk θruː/','window'],['back door','后门','/bæk dɔː/','door'],['left','剩下的（本课）','/left/','left'],['at all','（否定句中）一点也；根本','/ət ɔːl/','at-all']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit115-116',version:1,contentRevision:'garden-indefinites-v1',mode:'classroom',title:'敲门后的花园聚会',path:'/unit115-116/',start:'learn/words',progress:{learningKey:'canran:unit115-116:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识拜访与聚会',activities:[['words','花园小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进敲门故事',activities:[['text','花园小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清人事物与地点',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'寻找与招待朋友',activities:[['apply','花园小帮手','give']],required:['apply']},
{id:'l5',title:'完成花园挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'lemonade',storyQuestion:'What does Jim have to drink?（吉姆有什么可喝的？）',completionTitles:{listen:'拜访词语认清啦！',roles:'敲门故事读懂啦！',grammar:'人事物与地点说清啦！',apply:'花园任务完成啦！',exam:'花园挑战完成！'},reward:{edition:'garden-indefinites-v1',title:'花园表达小达人',lesson:'Lesson 115–116',scene:'/assets/unit115-116/keepsake-story-v1.webp',alt:'Tom在花园里向Jim提供啤酒，Carol微笑',color:'#8b9f76',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','花园小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={helen:'Helen',jim:'Jim',carol:'Carol',tom:'Tom'};
unit.learning.DIALOGUE=[
['helen','Isn’t there anyone at home?','家里没有人吗？'],
['jim','I’ll knock again, Helen. Everything’s very quiet. I’m sure there’s no one at home.','海伦，我再敲一次。一点动静也没有。我肯定家里没人。'],
['helen','But that’s impossible. Carol and Tom invited us to lunch. Look through the window.','但那不可能。卡罗尔和汤姆邀请我们来吃午饭。透过窗户看看。'],
['helen','Can you see anything?','你能看见什么吗？'],
['jim','Nothing at all.','什么也看不见。'],
['helen','Let’s try the back door.','我们去后门试试。'],
['jim','Look! Everyone’s in the garden.','瞧！大家都在花园里。'],
['carol','Hello, Helen. Hello, Jim.','你好，海伦。你好，吉姆。'],
['tom','Everybody wants to have lunch in the garden. It’s nice and warm out here.','大家都想在花园里吃午饭。外面挺暖和。'],
['carol','Come and have something to drink.','来喝点东西吧。'],
['jim','Thanks, Carol. May I have a glass of beer please?','谢谢，卡罗尔。可以给我一杯啤酒吗？'],
['carol','Beer? There’s none left. You can have some lemonade.','啤酒？一点也没剩下。你可以喝点柠檬水。'],
['jim','Lemonade!','柠檬水！'],
['tom','Don’t believe her, Jim. She’s only joking. Have some beer!','吉姆，别信她的。她只是在开玩笑。喝点啤酒吧！']
].map(([who,text,cn],i)=>({id:'u115116-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u115116-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-knock','knock的动作义','哪个词表示“敲门”的敲？',choice(['knock','invite','joke'],'knock',{optionImages:{knock:image('knock'),invite:image('invite'),joke:image('joke')}}),'knock是敲，不是邀请或开玩笑。'),
q('v-meaning','拜访中的状态与动作','把三个词配好。',match([['quiet','安静的'],['impossible','不可能的'],['invite','邀请']]),'quiet说状态；invite说邀请这个动作。'),
q('v-category','分清人事物地点','给三个表达找到相应的意思。',match([['someone','某人'],['something','某物或某事'],['somewhere','某处']]),'-one指人，-thing指事物，-where指地点。'),
q('v-joke','joke在原文的意思','She’s only joking.中的joking表示什么？',choice(['在开玩笑','已经离开','正在敲门'],'在开玩笑'),'joking是joke在句中的形式。'),
q('v-lemonade','识别柠檬水','哪个词表示柠檬水？',choice(['lemonade','beer','milk'],'lemonade',{optionImages:{lemonade:image('lemonade'),beer:image('beer'),milk:image('milk')}}),'lemonade是柠檬水，不是啤酒或牛奶。'),
q('v-asleep','asleep的状态义','The baby is asleep.表示什么？',choice(['婴儿睡着了','婴儿只是想睡但还醒着','婴儿正在敲门'],'婴儿睡着了'),'asleep说已经处于睡眠状态，不等于只是困倦。'),
q('v-glasses','glasses与glass的词义','My glasses are on the desk.中glasses指什么？',choice(['眼镜','一只饮水杯','花园里的门'],'眼镜'),'glasses指眼镜；a glass of beer中的glass是杯子。'),
q('v-anything','定位指事物的词','点出句中表示“什么东西”的词。',{type:'locate',fragments:['Can ',{value:'you'},' see ',{value:'anything'},'?'],options:['you','anything'],answer:'anything'},'anything问事物，you指听话人。'),
q('v-at-all','否定加强语气','Nothing at all.在窗边对话表示什么？',choice(['什么也看不见','所有东西都看见了','肯定每个人都睡着了'],'什么也看不见'),'at all加强否定，不说明看不见的原因。')
];
unit.questions.roles=[
q('r-invite','核对邀请者与客人','谁邀请Helen和Jim来吃午饭？',choice(['Carol和Tom','Helen和Jim','Jim一个人'],'Carol和Tom',{context:'Helen: “Carol and Tom invited us to lunch.”'}),'us在Helen的话里指Helen和Jim。'),
q('r-belief','区分判断与后来发现','Jim开头说家里没人，这是什么？',choice(['他当时的判断，后来发现大家在花园','已经逐个房间核实的结果','证明Carol和Tom取消了邀请'],'他当时的判断，后来发现大家在花园',{context:'Jim first: “Everything’s very quiet. I’m sure there’s no one at home.”\nJim later: “Look! Everyone’s in the garden.”'}),'保留原话归属；安静不能单独证明无人。'),
q('r-window','看不见与不存在分开','Nothing at all.能证明整所房子没有人吗？',choice(['不能，只说明Jim当时从窗口看不见什么','能，任何看不见的东西都不存在','能，所有人都已离开城市'],'不能，只说明Jim当时从窗口看不见什么',{context:'Helen: “Look through the window.”\nHelen: “Can you see anything?”\nJim: “Nothing at all.”'}),'观察范围是当时的窗口，不扩成整所房子的核查。'),
q('r-door','辨认接下来的建议','Helen接着建议去哪里试试？',choice(['the back door','the shop','the station'],'the back door',{context:'Helen: “Let’s try the back door.”'}),'back door是后门，不给建议补写额外原因。'),
q('r-garden','核对故事地点','后来发现大家在哪里？',choice(['in the garden','at the airport','in the shop'],'in the garden',{context:'Jim: “Look! Everyone’s in the garden.”'}),'这里的everyone是故事相关的人，不是全世界所有人。'),
q('r-lunch','愿望与完成分开','Tom的话是否说明大家已经吃完午饭？',choice(['没有，只说大家想在花园吃午饭','是，wants表示已经完成','是，温暖就说明吃完了'],'没有，只说大家想在花园吃午饭',{context:'Tom: “Everybody wants to have lunch in the garden. It’s nice and warm out here.”'}),'wants to表达愿望，课文没有交代用餐完成。'),
q('r-joke','根据后文理解玩笑','读到结尾后，怎样理解Carol说的There’s none left？',choice(['Tom说明她在开玩笑，并请Jim喝啤酒','这是最终核实没有啤酒的库存单','Tom也说只能喝柠檬水'],'Tom说明她在开玩笑，并请Jim喝啤酒',{context:'Carol: “Beer? There’s none left. You can have some lemonade.”\nTom: “Don’t believe her, Jim. She’s only joking. Have some beer!”'}),'不能把被后文澄清的玩笑当成最终库存事实。'),
q('r-drink','教材问题与实际发生边界','课文末尾Tom请Jim喝什么？',choice(['beer；原文没有写Jim已经喝下','lemonade；Jim明确说自己过敏','milk；Jim已经喝完'],'beer；原文没有写Jim已经喝下',{context:'Tom: “Have some beer!”'}),'保留教材问题的饮品线索；邀请喝不等于已经喝。'),
q('r-reaction','不从感叹补个人偏好','只凭Jim说Lemonade!，能确定什么？',choice(['他重复了饮品名称，不能确定过敏或永久不喜欢','他对柠檬过敏','他从来不喝柠檬水'],'他重复了饮品名称，不能确定过敏或永久不喜欢',{context:'Carol: “You can have some lemonade.”\nJim: “Lemonade!”'}),'标点和重复不能替代未说出的健康状况或长期偏好。')
];
unit.questions.grammar=[
g('people-things','人和事物的词形','按两条信息分别补全。',ctx(fill([blank('There is','at the door.',['someone','something']),blank('There is','in the bag.',['something','someone'])],['someone','something']),'A visitor is at the door.\nA book is in the bag.'),'指人用-one／-body，指事物用-thing。','先分清说的是人还是物品。',model(['Somebody is in the kitchen.','Something is on the shelf.'])),
g('place','地点表达','说一处未具体指出的地方。',ctx(fill([blank('The key is','in the room.',['somewhere','someone','something'])],['somewhere']),'The key is in the room, but its exact place is not known.'),'-where表达地点，somewhere不指出具体是哪一处。','现在缺的是人、东西，还是位置？',model(['My bag is somewhere in the house.','没有给出具体位置。'])),
g('whole-group','every的范围','说清所指群体与物品全体。',ctx(fill([blank('','in this group is ready.',['Everyone','Everything']),blank('','on this list is ready.',['Everything','Everyone'])],['Everyone','Everything']),'The group contains May, Ben and Kim. All three are ready.\nThe list contains cups, plates and food. All these things are ready.'),'everyone指所说群体中的每个人；everything指所说范围的全部事物。','先核对全体是人还是事物。',model(['All four pupils are here. → Everyone in this group is here.','不是全世界的人。'])),
g('same-meaning','one与body同义替换','保持“有人在等”这个意思，哪一项正确？',choice(['Someone is waiting和Somebody is waiting都可以','只能用Someone，Somebody是物品','Someone表示地点，Somebody表示时间'],'Someone is waiting和Somebody is waiting都可以'),'相应的-one与-body都指人；不要互设为唯一答案干扰项。','两种词尾指向同一类对象。',model(['No one is outside. / Nobody is outside.','两句都表示外面没有人。'])),
g('be','不定代词主语与单数be','按现在和昨天分别选好be。',ctx(fill([blank('Everybody','here now.',['is','are']),blank('Everything','ready yesterday.',['was','were'])],['is','was']),'All the guests are here now.\nAll the things were ready yesterday.'),'everybody／everything作主语用单数谓语；时间仍需单独核对。','大家很多，但这里的主语按单数搭配。',model(['Someone is at the gate.','Nothing was missing yesterday.'])),
g('verb','一般现在时单数谓语','用everybody概括这个群体的愿望。',ctx(fill([blank('Everybody in this group','to eat outside.',['wants','want'])],['wants']),'The three friends all want to eat outside now.'),'everybody作主语，普通现在时用wants；不表示愿望已经实现。','主语换成everybody后检查动词形式。',model(['Everyone likes this game.','动词与everyone搭配。'])),
g('questions','疑问句区分人和物','两句分别问人和物品，选好词。',ctx(fill([blank('Is there','in the kitchen?',['anyone','anything']),blank('Is there','in the box?',['anything','anyone'])],['anyone','anything']),'First ask whether a person is in the kitchen.\nThen ask whether an object is in the box.'),'anyone／anybody问人，anything问事物；问句本身不证明有或没有。','问的对象分别是什么？',model(['Is there anybody in the library?','Can you see anything on the desk?'])),
g('negative-object','not any的否定表达','保持两条已知事实，补好否定句。',ctx(fill([blank('I didn’t see','there.',['anybody','nobody']),blank('I didn’t hear','there.',['anything','nothing'])],['anybody','anything']),'I saw no people there, and I heard no sound there.'),'didn’t已经否定；本课标准零数量表达用anybody／anything，不再叠加no。','句中是否已经有否定词？',model(['She hasn’t got anything to read.','这里不用nothing重复表达同一个否定。'])),
g('negative-subject','nobody作主语的表达','这个房间已经确认无人，用nobody拼句。',ctx(bank(['Nobody','is','in the room','are','isn’t'],'Nobody is in the room',3),'The whole room has been checked. There are no people inside.'),'nobody本身表示没有人；后用is，不需再加not。','否定已经在哪个词里？',model(['No one can open this box.','No one已经表达无人。'])),
g('past-person','过去式否定改写保留人和时间','用no one改写，保留昨天的事实。',ctx(fill([blank('I','',['saw','see']),blank('','yesterday.',['no one','nothing'])],['saw','no one']),'Original: I didn’t see anyone yesterday.'),'去掉didn’t后用saw；anyone变no one，仍然指人。','人、时间与动词形式都不能丢。',model(['She didn’t meet anybody. → She met nobody.','否定意思不变，动词恢复过去式。'])),
g('past-place','过去式地点否定改写','用nowhere改写，保留原意。',ctx(fill([blank('He','',['went','go']),blank('','yesterday.',['nowhere','nothing'])],['went','nowhere']),'Original: He didn’t go anywhere yesterday.'),'didn’t go anywhere可改went nowhere；地点与过去时间都保留。','去掉didn’t后，go要怎样变化？',model(['She didn’t buy anything. → She bought nothing.','这里演示去掉didn’t后的过去式。'])),
g('nowhere','nowhere的情境意义','这个人昨天去哪儿了？',choice(['Nowhere. He stayed at home.','Everywhere. He stayed at home.','Somebody. He stayed at home.'],'Nowhere. He stayed at home.',{context:'Ben stayed at home all day yesterday. He did not go out.'}),'回答去哪里时，nowhere表示没有去别处，不是人不存在。','材料说他是否出门？',model(['Where did you go last Sunday? — Nowhere.','表示那天没有外出。'])),
g('search','everywhere与not anywhere','按查找范围补全两句话。',ctx(fill([blank('I looked','in these three rooms.',['everywhere','nowhere']),blank('I couldn’t find the key','in them.',['anywhere','somebody'])],['everywhere','anywhere']),'I checked all places in these three rooms for the key. I did not find it in any of the three rooms.'),'everywhere与明确范围一起用；couldn’t find anywhere是这个范围内哪里也找不到。','查过所有地方，与结果没有找到，是两件事。',model(['I searched everywhere in the kitchen.','I couldn’t find my pen anywhere in the kitchen.'])),
g('adjective','形容词放在复合代词后','按给定词块描述盒子里的有趣物品。',ctx(bank(['There is','something','interesting','in the box','somebody'],'There is something interesting in the box',4),'A small puzzle is in the box. It is interesting.'),'修饰something的形容词放在后面：something interesting。','先说某物，再补充它的特点。',model(['I need something warm.','不能把warm放到something前面。'])),
g('infinitive','不定式修饰语后置','角色没有可读的东西，用词块表达。',ctx(bank(['I’ve got','nothing','to read','read to'],'I’ve got nothing to read',3),'The character has no books, newspapers or other reading material.'),'nothing to read表示没有可读的东西，to read放在nothing后面。','表达用途的to短语放在哪里？',model(['We have something to eat.','to eat说明这些东西的用途。'])),
g('function','主语宾语表语在表达中的意义','把句子与准确意思配好。',match([['Someone is waiting.','有人正在等。'],['I met someone.','我遇见了某个人。'],['That’s nothing.','那不算什么。']]),'同类词可以说谁做事、动作涉及谁，也可放在be后；用句意理解，不背位置名称。','留意每句是谁做了什么。',model(['Something is moving.','I can see something.','“某物”在两句中承担不同位置。'])),
g('offer','some也能进入邀请问句','主人这样说是在做什么？',choice(['邀请客人喝点东西','断言没有任何饮料','问所有饮料的精确价格'],'邀请客人喝点东西',{context:'Host to guest: “Would you like something to drink?”'}),'邀请或期待肯定回答的问句可以用something；不要把some用于问句一律判错。','这里是在招待客人。',model(['Would you like something to eat?','用问句提供食物。'])),
g('free-choice','any也能表达任意选择','阅读开放规则，Anyone在这里表示什么？',choice(['任何人都可以加入，不限定某个人','已经每个人都加入了','没有人可以加入'],'任何人都可以加入，不限定某个人',{context:'This game is open to all visitors. The sign says: “Anyone can join.”'}),'any-可在肯定句表示无论谁；可以参加不等于已经参加。','这是开放资格，还是到场名单？',model(['You may sit anywhere in this room.','表示房间内任选位置。'])),
g('negative-question','否定问句按事实回答','分别回答Isn’t there anyone in the room?。',choice(['A: Yes, there is. B: No, there isn’t.','A: No, there isn’t. B: Yes, there is.','两人都答No，因为问句有Isn’t'],'A: Yes, there is. B: No, there isn’t.',{context:'Room A contains one visitor.\nRoom B has been fully checked and contains no people.'}),'有就Yes, there is；没有就No, there isn’t，不照中文是／不是套。','先判断实际有人还是没人。',model(['Isn’t the door open? It is open. → Yes, it is.','It is closed. → No, it isn’t.'])),
g('none-left','none承接剩余数量','按明确库存回答还剩多少牛奶。',choice(['There’s none left.','There’s nobody left.','There’s someone left.'],'There’s none left.',{context:'All the milk in this jug has been used. The jug is empty.\nHow much milk is left in it?'}),'none承接牛奶数量；left在这里表示剩下的，不是左边。','问的是饮品的剩余量。',model(['How many biscuits are left in this tin? — None.','先知道问的是哪一种物品。'])),
g('independent-category','独立区分指人事物地点','为三个句子匹配缺少的词。',match([['_____ is at the gate.（一位访客）','Someone'],['There is _____ on the table.（一个包）','something'],['My pen is _____ in this room.（具体位置未知）','somewhere']]),'由句子和对象线索选择，不把人、事物和地点混在一起。'),
g('independent-agreement','独立核对单数谓语','按群体事实补好现在表达。',ctx(fill([blank('Everyone','ready now.',['is','are']),blank('Everybody','to start.',['wants','want'])],['is','wants']),'All four players are ready now, and all four want to start.'),'everyone和everybody作主语都用单数谓语。'),
g('independent-past','独立改写过去否定','用nothing改写且保留昨天。',ctx(fill([blank('She','',['heard','hear']),blank('','yesterday.',['nothing','anything'])],['heard','nothing']),'Original: She didn’t hear anything yesterday.'),'didn’t hear变heard，anything变nothing；不改时间与事实。'),
g('independent-modifier','独立组织后置修饰语','她有一些好吃的东西，按词块表达。',ctx(bank(['She has','something','nice','to eat','eat to'],'She has something nice to eat',4),'She has some food, and the food is nice.'),'nice和to eat都放在something后面。')
];
unit.questions.apply=[
q('a-box','看图核对无物品','哪个打开的盒子可以说There’s nothing in it？',choice(['A','B','C'],'A',{context:'Check only the contents of the three open boxes.',optionImages:{A:image('box-empty'),B:image('box-ball'),C:image('box-books')}}),'A盒内没有物品；不把盒外或其他房间算进去。'),
q('a-search','按有限范围记录查找','查看图中标记，哪句符合查找记录？',choice(['She looked everywhere on this map.','She went nowhere yesterday.','Nobody can enter this room.'],'She looked everywhere on this map.',{context:'The map contains exactly three search spots: Desk, Chair and Shelf. A green tick means the spot was checked.',image:image('search-map'),imageAlt:'查找图：Desk、Chair、Shelf三处各有一个绿色勾号。'}),'三个所列地点都查过，只概括这张图中的范围。'),
q('a-ready','按实际名单概括全体','核对小组名单后，记录谁已准备好。',choice(['Everyone in this group is ready.','Nobody in this group is ready.','Everything in this group are ready.'],'Everyone in this group is ready.',{context:'Group: May, Kim, Lee.\nMay: ready. Kim: ready. Lee: ready.\nThese are all the members of this group.'}),'名单给出全体范围；用everyone和is。'),
q('a-offer','选择与招待意图一致的下一句','客人想接受柠檬水，接下来怎样回应主人？',choice(['Yes, please. Some lemonade.','No one is in the library.','I saw nothing yesterday.'],'Yes, please. Some lemonade.',{context:'Host: “Would you like something to drink?”\nGuest wants to accept some lemonade.'}),'这是选择对话下一句；按客人的明确意图接受饮品。'),
q('a-boundary','不把局部观察扩大成全屋事实','检查完一个空盒子，能确定哪项？',choice(['这个盒子里没有东西，其他地方还不知道','整所房子里没有任何东西','这个房间里肯定没人'],'这个盒子里没有东西，其他地方还不知道',{context:'The open box has been fully checked. It is empty.\nNo other place has been checked.',image:image('box-empty'),imageAlt:'打开的空盒子。'}),'nothing的观察范围是这个盒子，不扩大成全屋。'),
q('a-report','保留过去与人物的改写','用no one写出相同的昨天记录。',ctx(bank(['I','met','no one','yesterday','meet'],'I met no one yesterday',4),'Original: I didn’t meet anyone yesterday.'),'去掉didn’t后meet变met，人物与昨天不变。'),
q('a-glasses','分清寻找的物品','朋友要找眼镜，选择对应物品。',choice(['A','B','C'],'A',{context:'Friend: “I can’t find my glasses.”',optionImages:{A:image('glasses'),B:image('glass'),C:image('lemonade')}}),'glasses是眼镜，不是glass饮水杯或柠檬水。'),
q('a-somewhere','未知具体位置仍可表达存在','钥匙已确认在房间里，但位置未记下，怎样留言？',choice(['The key is somewhere in the room.','The key is nowhere in the room.','The key is someone in the room.'],'The key is somewhere in the room.',{context:'The key is in this room. Its exact position was not recorded.'}),'somewhere表达某处，不假装已找到准确位置。')
];
unit.questions.exam=[
q('e-belief','综合核对初始判断','后来发现大家在花园，开头Jim的话应如何归类？',choice(['Jim当时的判断，后来得到新信息','已核实全屋没人','Helen取消了聚会'],'Jim当时的判断，后来得到新信息',{context:'First: Jim says, “I’m sure there’s no one at home.”\nLater: Jim says, “Everyone’s in the garden.”'}),'保留人物观点与后续观察的区别。'),
q('e-drink','综合核对玩笑与结尾','根据最后两人的话，哪项准确？',choice(['Tom说明Carol在开玩笑，并提供啤酒；未写Jim已经喝下','最终只能喝柠檬水','Jim喝完啤酒后离开了'],'Tom说明Carol在开玩笑，并提供啤酒；未写Jim已经喝下',{context:'Carol: “There’s none left. You can have some lemonade.”\nTom: “She’s only joking. Have some beer!”'}),'用后文理解前话，不补实际喝下或离开的结局。'),
q('e-vocab','独立区分词义','配好本课三项词义。',match([['invite','邀请'],['asleep','睡着的'],['glasses','眼镜']]),'邀请、睡着的状态和眼镜各有不同含义。'),
q('e-category','独立判断人事物地点','按材料匹配合适的表达。',match([['一个未说明身份的人','someone'],['一件未说明是什么的物品','something'],['一个未说明具体位置的地方','somewhere']]),'词尾对应人、事物和地点。'),
q('e-whole','独立判断全部范围','只概括列出的全部物品，补完整。',ctx(fill([blank('','on this list is ready.',['Everything','Everyone','Nothing'])],['Everything']),'List: cups, plates and food. All three kinds of things are ready.'),'全部对象是物品，用everything。'),
q('e-synonyms','不误判同义人称形式','明确没有人在门外，哪项正确？',choice(['No one is outside和Nobody is outside都符合','只有Nobody能用，No one不能表示人','必须写Noone is outside'],'No one is outside和Nobody is outside都符合',{context:'The area outside the door has been checked. There are no people there.'}),'no one和nobody都可指没有人；no one不合写为noone。'),
q('e-be','独立核对单数be及时间','按资料补好现在和昨天的be。',ctx(fill([blank('Someone','at the gate now.',['is','are']),blank('Everything','ready yesterday.',['was','were'])],['is','was']),'A visitor is at the gate now.\nAll the things were ready yesterday.'),'复合不定代词主语与单数be搭配。'),
q('e-verb','独立选择单数动作形式','按全组的愿望填写。',ctx(fill([blank('Everybody','to play this game.',['wants','want'])],['wants']),'All five children in this group want to play this game.'),'everybody＋wants，愿望不等于已开始玩。'),
q('e-question','独立区分问人与问物','分别问人和物品。',ctx(fill([blank('Is there','at the door?',['anyone','anything']),blank('Is there','in the bag?',['anything','anyone'])],['anyone','anything']),'First ask whether a person is at the door.\nThen ask whether an object is inside the bag.'),'问人用anyone，问物用anything。'),
q('e-negative','独立避免重复否定','这次没有听见声音，保留didn’t。',ctx(fill([blank('I didn’t hear','in the room.',['anything','nothing'])],['anything']),'During this visit, I heard no sound in the room.'),'已有didn’t，本课标准表达接anything。'),
q('e-subject','独立使用否定主语','房间无人，用词块表达。',ctx(bank(['Nobody','is','in the room','are','isn’t'],'Nobody is in the room',3),'The whole room has been checked. No people are inside.'),'nobody已表示否定，谓语用is。'),
q('e-past-person','独立改写过去动作与人物','用no one改写。',ctx(fill([blank('She','',['met','meet']),blank('','yesterday.',['no one','nothing'])],['met','no one']),'Original: She didn’t meet anyone yesterday.'),'met保留过去，no one保留人物。'),
q('e-past-thing','独立改写过去动作与事物','用nothing改写。',ctx(fill([blank('He','',['bought','buy']),blank('','last Monday.',['nothing','anyone'])],['bought','nothing']),'Original: He didn’t buy anything last Monday.'),'去掉didn’t，用bought；last Monday保留。'),
q('e-past-place','独立改写过去地点否定','保持原意，用nowhere改写。',ctx(bank(['We','went','nowhere','yesterday','go'],'We went nowhere yesterday',4),'Original: We didn’t go anywhere yesterday.'),'过去动作went与地点nowhere同时保留。'),
q('e-search','独立核对查找范围与结果','按记录完成查找报告。',ctx(fill([blank('We looked','in these two rooms.',['everywhere','nowhere']),blank('We couldn’t find the bag','in them.',['anywhere','anybody'])],['everywhere','anywhere']),'All places in these two rooms were searched. The bag was not found in either room.'),'全部查过与没有找到分开表达，范围只限这两个房间。'),
q('e-adjective','独立组织后置形容词','给某件物品加上cold这个特点。',ctx(bank(['I want','something','cold','cold something'],'I want something cold',3),'The speaker wants a cold thing to drink, without naming a particular drink.'),'形容词cold放在something后面。'),
q('e-infinitive','独立组织后置不定式','角色没有可吃的东西，按词块表达。',ctx(bank(['I’ve got','nothing','to eat','eat to'],'I’ve got nothing to eat',3),'The character has no food available.'),'to eat放在nothing后面。'),
q('e-offer','独立识别邀请问句','Which sentence offers a drink?（哪句在提供饮品？）',choice(['Would you like something to drink?','There is nobody at home.','I went nowhere yesterday.'],'Would you like something to drink?'),'something可用于邀请问句，不机械排除some-。'),
q('e-any','独立理解任意资格','这条规则说明什么？',choice(['任何访客都可以参加，不说明所有人已参加','没有访客能参加','已经所有访客都参加了'],'任何访客都可以参加，不说明所有人已参加',{context:'The game is open to all visitors. “Anyone can join.”'}),'anyone在此表示无论谁都可参加。'),
q('e-yes','独立回应有人的否定问句','按实际情况回答。',choice(['Yes, there is.','No, there isn’t.','Yes, there are.'],'Yes, there is.',{context:'One visitor is in the room.\nQuestion: “Isn’t there anyone in the room?”'}),'实际有人，回答Yes, there is。'),
q('e-no','独立回应无人的否定问句','按实际情况回答。',choice(['No, there isn’t.','Yes, there is.','No, there is.'],'No, there isn’t.',{context:'The room has been fully checked. No people are in it.\nQuestion: “Isn’t there anyone in the room?”'}),'实际没有人，回答No, there isn’t。'),
q('e-left','独立理解剩余数量','按已核实的杯中牛奶情况选择。',choice(['There’s none left.','There’s someone left.','There’s everybody left.'],'There’s none left.',{context:'All the milk in this cup has been drunk. The cup is empty.\nHow much milk is left in it?'}),'none承接牛奶的零数量；left不是左边。'),
q('e-scope','独立限制观察结论','只检查一个空盒子，哪句有依据？',choice(['There is nothing in this box.','There is nothing anywhere in the house.','There is nobody in the garden.'],'There is nothing in this box.',{context:'This box has been checked and is empty. No other place has been checked.'}),'没有资料的地方保留未知。'),
q('e-modifiers','独立同时组织特点与用途','按词块表达有好看的读物。',ctx(bank(['She has','something','interesting','to read','read to'],'She has something interesting to read',4),'She has some reading material. It is interesting.'),'interesting和to read都放在something之后。')
];
unit.learning.REFERENCE=[
'本课以导学Grammar纸页192–193为主线。用-one／-body说人、-thing说事物、-where说地点；先看语境里的对象和范围，再选some／any／no／every，不靠句末标点猜答案。',
'someone与somebody、anyone与anybody、everyone与everybody、no one与nobody含义相应。no one按课本写成两个词；no-one也是可见的合法写法，不把它当语法错误。116课词表首行Every／None／Any／Some保留；没有人／事物／地点的复合形式用no-，不是在none后拼词尾。图鉴中的抽象图标帮助记忆，具体题目以可见事实或审定图为依据。',
'someone、everybody、nothing、everything等作本课句子的主语时用单数谓语：Someone is…；Everybody wants…；Everything was…。地点词在本课多修饰动作，不因出现somewhere就强行把整句谓语改成单数。普通句中的名词主语仍按自己的数搭配。',
'some-常用于肯定表达，也可用于邀请或期待肯定回答的问句；any-常用于一般询问、否定表达，还可表示无论谁或任意一个。Would you like something to drink?与Anyone can join都是合法语境，不能把常见分布写成绝对禁令。',
'no-自带否定含义。本课标准的零数量表达用I didn’t see anyone／I saw no one，不把didn’t和no one叠在一起。改写要同时保持时态、对象、地点和范围：didn’t meet→met，didn’t buy→bought，didn’t go anywhere→went nowhere。',
'everyone／everything／everywhere描述语境指定范围内的全体。查完两间房不等于查过全世界；从一个窗口看不见东西也不能推出整所房子无人。找遍了与没有找到分开表达，不能把结果倒推成搜索覆盖。',
'形容词和表示用途的不定式放在复合代词后：something warm、nothing to read、something nice to eat。给出整块something nice不能算独立考过词序，所以本课会拆开这些词块再练。',
'这些词可以在主语、宾语及be后表达不同意思，先读懂句意，不背位置标签。导学中a somebody／a nobody的“大人物／小人物”属于另一种名词义，保留在教师核对记录，不作为本课不定代词的核心判分例子。',
'Isn’t there anyone…?按事实回应：有用Yes, there is；没有用No, there isn’t。问句本身不提供人数，也不能只凭否定形式确定人物生气或不满。',
'There’s none left中的none承接前文所问的量，left是剩下的；不能从零杯数推成没有任何物品或任何人。原文Carol说没啤酒后，Tom说明是玩笑并提供啤酒，因此不能把Carol这句当最终库存事实。',
'Jim开头的I’m sure是他的判断；后来大家在花园。Tom说wants to have lunch是愿望，Have some beer是邀请；正文没有确认午饭吃完或Jim喝下。Lemonade!也不能证明过敏或永久偏好。课文页面不自动显示这些理解结论。',
'116课a–l完整保留，A4／B6／C4／D4共18题。B按练习设定作否定回答，不从问句本身推断没有；C保留原来they所指群体、动作和进行时；D按教材角色设定“答话人没有、另一角色有”，并按Sam／Jane／Alan与children选择he／she／they及has／have。'
];
unit.learning.MODEL_TITLE='课本小参考 · 116课a–l';
unit.learning.PRONOUN_MODELS=[
['Every','None','Any','Some'],
['Everyone','No one','Anyone','Someone'],
['Everybody','Nobody','Anybody','Somebody'],
['Everything','Nothing','Anything','Something'],
['Everywhere','Nowhere','Anywhere','Somewhere']
];
unit.learning.MODELS=[
['a · Everyone is asleep. Everybody is asleep.','大家都睡着了。','asleep'],
['b · Everything is untidy.','所有东西都乱糟糟的。','everything'],
['c · I looked for my pen everywhere.','我到处找我的钢笔。','everywhere'],
['d · Is there anyone at home? Is there anybody at home?','家里有人吗？','anyone'],
['e · Is there anything in that box?','那个盒子里有东西吗？','anything'],
['f · I couldn’t find my pen anywhere.','我哪儿也找不到我的钢笔。','anywhere'],
['g · There’s no one at home. There’s nobody at home.','家里没有人。','nobody'],
['h · There’s nothing in this box.','这个盒子里没有东西。','nothing'],
['i · Where did you go yesterday? — Nowhere. I stayed at home.','昨天去了哪里？——哪儿也没去。我待在家里。','nowhere'],
['j · There’s someone in the garden. There’s somebody in the garden.','花园里有人。','someone'],
['k · There’s something under that chair!','那把椅子下面有东西！','something'],
['l · My glasses must be somewhere! — You’re wearing them!','我的眼镜一定在某个地方！——你正戴着呢！','glasses']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 否定改写',answerLines:1,instruction:'保留4题，按例用no-表达同一否定事实。删除didn’t后恢复过去式，不删除人、地点或原来的时间含义。',examples:['I didn’t buy anything. → I bought nothing.'],items:['I didn’t do anything.','I didn’t see anyone.','I didn’t go anywhere.','I didn’t meet anybody.']},
{title:'B · 两种否定回答',answerLines:2,instruction:'保留6题，每题写not any-和no-两种回答。按例设置角色未做所问的事；问句本身不证明没有发生。speak to／write to中的to保留。',examples:['Did you see anyone? → No, I didn’t see anyone. I saw no one.'],items:['Did you hear anything?','Did you speak to anyone?','Did you go anywhere?','Did you buy anything?','Did you write to anybody?','Did you meet anyone?']},
{title:'C · 用everyone概括原来的一组人',answerLines:1,instruction:'保留4题。everyone指原句they所指的全部人，are改is，继续保留进行时的-ing、地点及对象；不能把“每个人”扩大成别的群体。',examples:['They’re all watching television. → Everyone’s watching television.'],items:['They’re all looking out of the window.','They’re all hurrying to work.','They’re all eating.','They’re all drinking lemonade.']},
{title:'D · 自己没有，另一角色有',answerLines:3,instruction:'保留4题，每题三句：答话人的not any-句、no-句，以及另一角色的some-句。按例设定两方的不同情况，不从第一人的事实猜第二人；children用they／have，其他人物按教材称呼回应。',examples:['Have you got anything to wear? → No, I haven’t got anything to wear. I’ve got nothing to wear.','What about Penny? → She’s got something to wear.'],items:['Have you got anything to eat? What about Sam?','Have you got anything to do? What about the children?','Have you got anything to drink? What about Jane?','Have you got anything to read? What about Alan?']}
];
core.unit115116=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
