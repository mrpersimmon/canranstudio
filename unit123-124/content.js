(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit123-124/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页250–253／PDF283–286',grammarSource='《同步导学》Grammar纸页205／PDF219；《语法练习册》纸页361–365／PDF375–379';
const rows=[
['during','在……期间','/ˈdjʊərɪŋ/','during'],['trip','旅行（名词）','/trɪp/','trip'],['travel','旅行（动词）','/ˈtrævl/','travel'],['offer','提供；提出','/ˈɒfə/','offer'],['job','工作','/dʒɒb/','job'],['guess','猜','/ɡes/','guess'],
['grow','生长；留（胡须等）','/ɡrəʊ/','grow'],['beard','络腮胡子','/bɪəd/','beard'],['kitten','小猫','/ˈkɪtn/','kitten'],['photograph','照片','/ˈfəʊtəɡrɑːf/','photograph'],['Australia','澳大利亚','/ɒˈstreɪliə/','australia'],['ship','船；轮船','/ʃɪp/','ship'],
['shave off','刮掉','/ʃeɪv ɒf/','shave-off'],['come home','回家','/kʌm həʊm/','come-home'],['beautiful','美丽的','/ˈbjuːtɪfl/','beautiful'],['remember','记得；想起','/rɪˈmembə/','remember'],['people','人们','/ˈpiːpl/','people'],['on','在……上；乘坐（本课）','/ɒn/','on'],
['about','关于','/əˈbaʊt/','about'],['decide','决定','/dɪˈsaɪd/','decide'],['test','测验','/test/','test'],['village','村庄','/ˈvɪlɪdʒ/','village'],['umbrella','伞','/ʌmˈbrelə/','umbrella'],['medicine','药物','/ˈmedsn/','medicine']
];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:art==='beard'?'/assets/unit123-124/beard-photo.webp':image(art)}));
const unit={id:'unit123-124',version:1,contentRevision:'travel-photo-v1',mode:'classroom',title:'旅行照片里的故事',path:'/unit123-124/',start:'learn/words',progress:{learningKey:'canran:unit123-124:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识照片里的词语',activities:[['words','旅行小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'看懂旅行中的往事',activities:[['text','旅行照片小剧场','book'],['roles','照片小侦探','people']],required:['text','roles']},
{id:'l3',title:'说得简洁又生动',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'给照片写说明',activities:[['apply','照片小记录员','give']],required:['apply']},
{id:'l5',title:'完成照片挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'photograph',storyQuestion:'Who is the man with the beard?（照片中留络腮胡子的男士是谁？）',completionTitles:{listen:'旅行词语认清啦！',roles:'照片里的往事读懂啦！',grammar:'简洁生动说出来啦！',apply:'照片说明写好啦！',exam:'照片挑战完成！'},reward:{edition:'travel-photo-v1',title:'照片讲述小达人',lesson:'Lesson 123–124',scene:'/assets/unit123-124/keepsake-story-v1.webp',alt:'Mike与Scott一起看旅行照片，照片中的Mike留着络腮胡子',color:'#77979d',zones:[['listen','单词寻宝'],['roles','照片小侦探'],['grammar','语法小工坊'],['apply','照片小记录员'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={mike:'Mike',scott:'Scott'};
unit.learning.DIALOGUE=[
['mike','Look, Scott. This is a photograph I took during my trip to Australia.','看，Scott。这是我到澳大利亚旅行时拍的一张照片。'],
['scott','Let me see it, Mike.','让我看看，Mike。'],
['scott','This is a good photograph. Who are these people?','这张照片拍得很好。这些人是谁？'],
['mike','They’re people I met during the trip.','他们是我旅行时认识的人。'],
['mike','That’s the ship we travelled on.','那就是我们当时乘坐的船。'],
['scott','What a beautiful ship!','多么漂亮的船啊！'],
['scott','Who’s this?','这个人是谁？'],
['mike','That’s the man I told you about. Remember?','这就是我跟你提过的那个人。还记得吗？'],
['scott','Ah yes. The one who offered you a job in Australia.','啊，记得。就是在澳大利亚给你提供工作机会的那个人。'],
['mike','That’s right.','对，就是他。'],
['scott','Who’s this?','这个人是谁？'],
['mike','Guess!','你猜！'],
['scott','It’s not you, is it?','这不是你，对吧？'],
['mike','That’s right.','不，是我。'],
['mike','I grew a beard during the trip, but I shaved it off when I came home.','我在旅行期间留了胡子，但回家时把它刮掉了。'],
['scott','Why did you shave it off?','你为什么把胡子刮掉了？'],
['mike','My wife didn’t like it!','我妻子不喜欢它！']
].map(([who,text,cn],i)=>({id:'u123124-line'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines}),ctx=(input,context)=>({...input,context});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u123124-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-beard','识别beard','哪个词表示络腮胡子？',choice(['beard','hat','kitten'],'beard',{optionImages:{beard:'/assets/unit123-124/beard-photo.webp',hat:image('hat'),kitten:image('kitten')}}),'beard指下巴及脸颊一带的胡子。'),
q('v-trip','旅行和期间词义','配好三个表达。',match([['during the trip','旅行期间'],['a trip','一次旅行'],['travel','旅行（动词）']]),'trip在这里是一次旅行；travel作旅行的动词；during说明期间。'),
q('v-offer','工作机会与猜测词义','配好三个词。',match([['offer','提供；提出'],['job','工作'],['guess','猜']]),'提供机会和接受机会不同；guess是猜。'),
q('v-grow','grow的过去式','报告过去留过胡子，用哪个词形？',fill([blank('I','a beard during the trip.',['grew','grown','growed'])],['grew']),'grow—grew—grown，过去式是grew。'),
q('v-kitten','kitten的词义','kitten表示什么？',choice(['小猫','轮船','照片'],'小猫'),'124课的新词kitten是小猫。'),
q('v-photo','take a photograph的含义','I took a photograph. 在拍摄情境中表示什么？',choice(['我拍了一张照片','我刮掉了胡子','我提供了一份工作'],'我拍了一张照片'),'take a photograph是拍照，不机械逐词译成拿走。'),
q('v-shave','shave off的动作对象','I shaved it off. 这里it指胡子，句子是什么意思？',choice(['我把胡子刮掉了','我把船开走了','我把照片寄出了'],'我把胡子刮掉了'),'shave off表示刮掉，it按前文指beard。'),
q('v-locate','原文词义定位','点出表示“在……期间”的词。',{type:'locate',fragments:['I grew a ',{value:'beard'},' ',{value:'during'},' the trip.'],options:['beard','during'],answer:'during'},'during引出旅行期间。')
];
unit.questions.roles=[
q('r-photo','拍摄者与观看者分开','谁在澳大利亚旅行时拍了这张照片？',choice(['Mike','Scott','Mike的妻子'],'Mike',{context:'Mike: Look, Scott. This is a photograph I took during my trip to Australia.'}),'说话人Mike的I指自己，Scott是正在看照片的朋友。'),
q('r-people','照片人物的关系','Mike怎样介绍照片里的这些人？',choice(['旅行时认识的人','他已经雇用的同事','Scott的全部家人'],'旅行时认识的人',{context:'Scott: Who are these people?\nMike: They’re people I met during the trip.'}),'认识的人不自动变成同事或亲属，原文未给总人数。'),
q('r-we','不扩大we的范围','we travelled on能单独证明Scott也同行了吗？',choice(['不能，原文没有说明we是否包含Scott','能，听照片故事的人都必定同行','能，Scott就是船长'],'不能，原文没有说明we是否包含Scott',{context:'Mike, showing Scott a photograph: That’s the ship we travelled on.'}),'we包含Mike及同行者，但不能据听话人的在场身份补出旅行名单。'),
q('r-praise','保留人物的赞叹','What a beautiful ship! 表达什么？',choice(['Scott赞叹这条船漂亮','Scott给出了船票价格','Scott保证所有船都一样漂亮'],'Scott赞叹这条船漂亮',{context:'Mike: That’s the ship we travelled on.\nScott: What a beautiful ship!'}),'这是Scott对所指船的评价，不是价格或所有船的普遍事实。'),
q('r-offer','提供机会不等于接受','关于那份工作，原文能确认什么？',choice(['那个人提供过工作机会，未说明Mike是否接受','Mike已接受并开始上班','Scott已经替Mike签了合同'],'那个人提供过工作机会，未说明Mike是否接受',{context:'Scott: The one who offered you a job in Australia.\nMike: That’s right.'}),'offer记录提供机会，不单独证明接受、入职或工作结果。'),
q('r-told','核对tell的双方','I told you about中的I和you是谁？',choice(['I是Mike，you是Scott','I是Scott，you是Mike','两者都指提供工作的人'],'I是Mike，you是Scott',{context:'Mike says to Scott: That’s the man I told you about. Remember?'}),'用当前说话人与听话人核对代词，about保留谈论对象。'),
q('r-beard','依据后文识别胡子人物','结合后面的明确说明，照片中留胡子的男士是谁？',choice(['Mike自己','Scott','提供工作机会的男士'],'Mike自己',{context:'Scott: It’s not you, is it?\nMike: That’s right. I grew a beard during the trip, but I shaved it off when I came home.'}),'后文I grew a beard和回家刮掉把身份说清；不只截取That’s right机械判断肯否。'),
q('r-time','照片过去与现场当前分开','Mike的胡子发生了什么变化？',choice(['旅行期间留了胡子，回家时刮掉','拍照时没有，回家后才留','Scott在旅行时把Mike的胡子刮掉'],'旅行期间留了胡子，回家时刮掉',{context:'Mike: I grew a beard during the trip, but I shaved it off when I came home.'}),'同一个人不同时期的外貌不同，不把照片当成现场状态。'),
q('r-reason','保留Mike给出的原因','Mike怎样解释自己刮掉胡子的原因？',choice(['他说妻子不喜欢那胡子','他说为了让Scott认出照片中的自己','他说为了接受那份工作'],'他说妻子不喜欢那胡子',{context:'Scott: Why did you shave it off?\nMike: My wife didn’t like it!'}),'只保留他说出的理由，不添加其他动机或要求。'),
q('r-scope','个人喜好不变成普遍判断','由结尾能推出所有人都不喜欢胡子吗？',choice(['不能，只知道Mike这样描述妻子的喜好','能，个人喜好都适用于所有人','能，胡子本身必定不好看'],'不能，只知道Mike这样描述妻子的喜好',{context:'Mike: My wife didn’t like it!'}),'人物对一件事的喜好不代表所有人的审美。')
];
unit.questions.grammar=[
g('object','宾语关系词省略仍保留动作关系','省略关系词后，补好两处描述。',ctx(fill([blank('They’re people','during the trip.',['I met','I met them']),blank('This is a photograph','yesterday.',['I took','I took it'])],['I met','I took']),'I met these people during the trip. I took this photograph yesterday. Keep the same people, photograph and actions.'),'people和photograph是met／took的对象；省略关系词后不再重复them／it。','先找从句里谁做动作。',model(['This is the bag which I bought.','This is the bag I bought.'])),
g('subject','主语关系词不能单独删去','保留offered这一过去事件，哪句完整？',choice(['That’s the man who offered me a job.','That’s the man offered me a job.','That’s the man who he offered me a job.'],'That’s the man who offered me a job.',{context:'The man offered me a job last year. Identify him using the same past event; do not change it into an ongoing action.'}),'who是offered的主语，不能照宾语规则只删who，也不再加he。','这个动作前还有另一个主语吗？',model(['The boy who called me is Ben.','who做主语，不只删去who。'])),
g('reduce-one','关系词和be一起简化','保持现在的站立状态，按124课示范简化。',ctx(bank(['The man','standing behind the counter','is Ben','is standing behind the counter'],'The man standing behind the counter is Ben',3),'The man who is standing behind the counter is Ben. He is standing there now.'),'这里一起省去who is，保留standing短语；不是只去掉who。','who is后面是哪种动词形式？',model(['The woman who is reading is May.','The woman reading is May.'])),
g('reduce-many','多人进行状态的简化','补成保留现在动作的简洁描述。',ctx(fill([blank('The men','the road are our neighbours.',['repairing','repaired','are repairing'])],['repairing']),'The men who are repairing the road are our neighbours. Their repair work is in progress now.'),'省去who are，留下repairing；不能把正在修改成已修完的事件。','谁正在修路？哪些词一起省去？',model(['The children who are playing are my cousins.','The children playing are my cousins.'])),
g('place','be后位置短语的简化','按同一位置简化，不改变所指男孩。',choice(['The boy on the blue bike is Ben.','The boy is on the blue bike is Ben.','The boy who on the blue bike is Ben.'],'The boy on the blue bike is Ben.',{context:'The boy who is on the blue bike is Ben. He is on that bike now.'}),'这个例子省去who is后留下位置短语；不把所有含be的句子都当成可任意删除。','保留说明位置的整个短语。',model(['The car which is on the right is mine.','The car on the right is mine.'])),
g('time','简化表达的时间仍依靠语境','按照片的过去时刻还原完整描述。',ctx(fill([blank('The woman who','at nine yesterday is May.',['was waiting','is waiting','will wait'])],['was waiting']),'This is a photograph taken at nine yesterday. May was waiting at that moment. The caption says “the woman waiting at nine yesterday”.'),'waiting短语本身不显示过去或现在，完整句的时态要由照片时间和事实确定。','这张照片是哪一个时刻拍的？',model(['In yesterday’s photograph, the boy standing by the door was Ben.','还原当时状态可用who was standing。'])),
g('on','省略宾语关系词保留on','用省略关系词的句子说明乘坐的船。',ctx(bank(['This is the ship','we travelled','on','it'],'This is the ship we travelled on',3),'This is the ship. We travelled on it. Combine the sentences and omit the object relative pronoun.'),'关系词可省，travelled on的on仍表达乘坐关系，it不再重复。','省略的是关系词，不是介词。',model(['This is the chair I sat on.','sat on的on保留在后面。'])),
g('about','谈论对象的about不能丢','按原意合并，省略宾语关系词。',ctx(bank(['That’s the man','I told you','about','him'],'That’s the man I told you about',3),'That’s the man. I told you about him. You are the listener; the man is the topic.'),'you是听话人，要保留；about后的him由所指man承接。','谁听到了，谈论的又是谁？',model(['This is the book Ben told me about.','me是听话人，book是谈论对象。'])),
g('front','前置介词后的关系词不能直接省','哪项把关系词省去，同时保留原意？',choice(['The woman I spoke to is May.','The woman to I spoke is May.','The woman I spoke is May.'],'The woman I spoke to is May.',{context:'The woman to whom I spoke is May. Rewrite using no relative pronoun; keep the relation expressed by spoke to.'}),'保留前置to时不能直接删whom；改写时把to放回后面，再省宾语关系词。','to要留在句子的哪个位置？',model(['The house in which we live → the house we live in','不能只把which删成the house in we live。'])),
g('recipient','不能把接收者一起删掉','合并并保留“妈妈给我”的完整意思。',choice(['This is the gift my mother gave me.','This is the gift my mother gave it to me.','This is the gift I gave my mother.'],'This is the gift my mother gave me.',{context:'This is the gift. My mother gave me the gift. Keep the giver and the receiver unchanged.'}),'gift是被替代的对象，me仍是接收者，不反转赠送方向。','哪些词重复指gift，哪个词是接收者？',model(['This is the letter May sent me.','letter是寄出的物品，me是收信者。'])),
g('finite','宾语关系词省略后仍保留完整谓语','按昨天已经找到的事实补好句子。',ctx(fill([blank('This is the kitten Jane','in the garden yesterday.',['found','finding','find'])],['found']),'Jane found this kitten in the garden yesterday. The finding was a completed event yesterday.'),'这里Jane是从句主语，后面仍需过去式found；不是所有省略句都改成-ing。','句子里已有Jane，动作发生在什么时候？',model(['This is the ticket Ben bought yesterday.','bought仍是过去事件。'])),
g('perspective','124C回应时交换说话视角','你是Ben，回应May，补好两个人称。',ctx(fill([blank('That’s right. This is the film','told',['you','I']),blank('','about.',['me','you'])],['you','me']),'May says to Ben: “This is the film. I told you about it.” Ben now replies to May, following Lesson124 C.'),'May原话的I变为Ben回应里的you；原话you指Ben，回应里用me。','现在是谁开口？',model(['May: This is the place. I wrote to you about it.','Ben: That’s right. This is the place you wrote to me about.'])),
g('during','发生期间与持续时长分开','按要表达的信息选during或for。',ctx(fill([blank('I took the photograph','the trip.',['during','for']),blank('The trip lasted','two weeks.',['for','during'])],['during','for']),'The photograph was taken while the trip was happening; say when it happened, not its purpose. The whole trip lasted two weeks; say how long.'),'during the trip说明发生期间，for two weeks说明持续多久；期间发生不表示全程持续。','一处问什么时候，一处问多久。',model(['I met May during the holiday.','I stayed there for three days.'])),
g('article','单数可数名词的a或an','用What表达赞叹，分别选择冠词。',ctx(fill([blank('What','beautiful ship!',['a','an']),blank('What','interesting story!',['an','a'])],['a','an']),'Admire one beautiful ship and one interesting story. Use the singular countable noun pattern with What.'),'单数可数名词用a／an；选择看紧接着的发音，beautiful前a，interesting前an。','冠词后紧接哪一个词？',model(['What a lovely garden!','What an old boat!'])),
g('plural','复数名词的What感叹','保留多张照片，选择合适赞叹。',choice(['What beautiful photographs!','What a beautiful photographs!','What an beautiful photographs!'],'What beautiful photographs!',{context:'You are admiring several beautiful photographs together, not just one.'}),'photographs是复数，不加单数冠词a／an。','这次赞叹的是一张还是多张？',model(['What lovely flowers!','复数flowers前不加a／an。'])),
g('mass','本课weather用法不加a','用What赞叹好天气。',choice(['What fine weather!','What a fine weather!','What an fine weather!'],'What fine weather!',{context:'The speaker is pleased with today’s fine weather. Use weather in its ordinary uncountable sense.'}),'本课天气义weather不可数；前面有fine不意味着就可加a。','形容词会自动改变这个名词的用法吗？',model(['What lovely weather!','和What a lovely day!的名词用法不同。'])),
g('how-adjective','How加形容词的常用感叹结构','按教材的陈述词序，表达“这条船真漂亮”。',ctx(bank(['How','beautiful','the ship','is','What'],'How beautiful the ship is',4,'!'),'Admire the beauty of the ship. Use the usual How + adjective + subject + verb pattern.'),'形容词beautiful后接the ship is；本题练常用陈述词序，不概括所有修辞性句式。','先是程度，再是主语和谓语。',model(['How kind you are!','How tall the tree is!'])),
g('how-adverb','How加副词表达动作程度','按给定意图夸她唱得好听，用How。',ctx(bank(['How','beautifully','she','sings','beautiful'],'How beautifully she sings',4,'!'),'A listener wants to praise the beauty of May’s singing. Build the exclamation with How.'),'beautifully修饰sings这一动作，不能用形容词beautiful代替这里的副词。','描述人，还是描述唱的方式？',model(['How quickly he runs!','quickly说明跑的方式。'])),
g('what-how','What名词结构与How形容词结构对照','补好两种表达同一赞叹的结构。',ctx(fill([blank('','a beautiful photograph!',['What','How']),blank('','beautiful the photograph is!',['How','What'])],['What','How']),'Admire the same single photograph. The first sentence includes the noun phrase a beautiful photograph; the second puts beautiful before the subject.'),'What后接所赞叹的名词结构，How在这里直接修饰beautiful。','后面紧跟名词结构，还是直接跟形容词？',model(['What an interesting book!','How interesting the book is!'])),
g('tag','否定问句的回应按事实','两张照片身份已知，用英语事实补短答。',ctx(fill([blank('A: It’s not Ben, is it? B:',' , it is.',['Yes','No']),blank('A: It’s not Ben, is it? B:',' , it isn’t.',['No','Yes'])],['Yes','No']),'Photo1 is definitely Ben. Photo2 is definitely Tom, not Ben. Answer the same negative tag question for each photo.'),'事实是Ben用Yes, it is；事实不是Ben用No, it isn’t。不把原文含糊的That’s right孤立成通用肯否规则。','先看身份事实，不逐字翻中文“是／不是”。',model(['Isn’t that May? It is May. → Yes, it is.','Isn’t that May? It is Rose. → No, it isn’t.'])),
g('transfer-object','撤去示范后保留宾语和介词关系','省略关系词并合并句子。',ctx(bank(['These are the boxes','we keep the papers','in','them'],'These are the boxes we keep the papers in',3),'These are the boxes. We keep the papers in them. Keep the boxes plural and the location relation.'),'in保留，重复的them省去，we仍是从句主语。'),
g('transfer-reduce','撤去示范后一起简化who和be','保留现在正在进行的动作。',ctx(bank(['The woman','reading by the window','is May','is reading by the window'],'The woman reading by the window is May',3),'The woman who is reading by the window is May. She is reading there now.'),'省去who is而保留reading短语。'),
g('transfer-exclaim','撤去示范后区分感叹结构','按单个故事与动作程度补好开头。',ctx(fill([blank('','an interesting story!',['What','How']),blank('','quickly he runs!',['How','What'])],['What','How']),'Express admiration for one interesting story, then for the speed of his running. Use the given sentence patterns.'),'名词结构用What；动作的程度副词用How。')
];
unit.questions.apply=[
q('a-photograph','按作者与时间辨认照片','找出the photograph Maya took on Monday。',choice(['A','B','C'],'A',{context:'Read the photographer and day for each photo. Choose the photograph Maya took on Monday.',image:image('photo-record'),imageAlt:'照片记录：A由Maya在Monday拍摄，B由Leo在Monday拍摄，C由Maya在Tuesday拍摄。'}),'A同时符合拍摄者与日期；不能只看其中一项。'),
q('a-caption','按正在发生的动作写简洁说明','按照片说明一起省去who is。',ctx(bank(['The man','standing by the ship','is Ben','is standing by the ship'],'The man standing by the ship is Ben',3),'The man who is standing by the ship is Ben. The photograph shows him standing there at that moment.'),'保留standing短语和人物，不只删who留下两个is。'),
q('a-reply','交换说话人后的124C回应','你是Ben，确认May的话，选择回应。',choice(['That’s right. This is the film you told me about.','That’s right. This is the film I told you about.','This is the film you told me about it.'],'That’s right. This is the film you told me about.',{context:'May says to Ben: “This is the film. I told you about it.” Ben now replies to May.'}),'Ben回应时you指May、me指自己；about保留，it不再重复。'),
q('a-prepositions','省略后保留两个必要介词','按原句补好两个简洁说明。',ctx(fill([blank('This is the ship I travelled',' .',['on','about']),blank('This is the friend I told you',' .',['about','on'])],['on','about']),'I travelled on this ship. I told you about this friend. Combine each pair without a relative pronoun.'),'on是乘坐关系，about是谈论对象关系。'),
q('a-praise','读图保留复数再作感叹','用What赞叹图中所有的船，保留数量。',choice(['What beautiful ships!','What a beautiful ship!','What a beautiful ships!'],'What beautiful ships!',{context:'Look at all the ships in this postcard. Use What to admire them together and keep the number shown.',image:image('two-ships'),imageAlt:'明信片中有两条完整的船，上下各一条，海面中没有其他船。'}),'图中是两条船，ships用复数；单数句本身可合法，但不符合这次全部船只的数量。'),
q('a-how','以副词表达动作的程度','按给定赞叹意图，用How组织句子。',ctx(bank(['How','beautifully','she','sings','What'],'How beautifully she sings',4,'!'),'A listener admires May’s singing and wants to praise the way she sings. Use How with beautifully.'),'beautifully修饰sings；按题目指定的赞叹意图表达。'),
q('a-decision','124C回应保留must而不添加决定结果','你是Ben，回应May，保留她的必要性。',ctx(bank(['That’s right.','This is something','you must decide','about','you have decided'],'That’s right. This is something you must decide about',4),'May says to Ben: “This is something. I must decide about it.” Ben confirms what May needs to decide. No decision has been made yet.'),'I变成you，must保留；必须决定不等于已经决定。'),
q('a-clue','省略关系词不等于删去辨认线索','只剩the ship，还能唯一确定Ben乘过哪条吗？',choice(['不能，仍需保留Ben travelled on这段辨认线索','能，省略关系词就应该删掉整个修饰部分','能，所有船都指同一条'],'不能，仍需保留Ben travelled on这段辨认线索',{context:'There are two ships in the record. Ben travelled on ship A; Ada travelled on ship B. We want to shorten “the ship that Ben travelled on” while keeping its meaning.'}),'省略that后仍说the ship Ben travelled on，不删掉识别所需的关系。')
];
unit.questions.exam=[
q('e-words','核心词义抽样','配好三个词。',match([['offer','提供；提出'],['beard','络腮胡子'],['kitten','小猫']]),'按本课词义核对。'),
q('e-identity','独立核对照片与现场身份','留着胡子的照片人物是谁？',choice(['旅行期间的Mike','现在的Scott','Mike的妻子'],'旅行期间的Mike',{context:'Mike: I grew a beard during the trip, but I shaved it off when I came home.'}),'同一人的过去照片不等于当前外貌。'),
q('e-object','独立省略宾语关系词','补好简洁描述，不重复对象。',ctx(fill([blank('These are the people','yesterday.',['I saw','I saw them']),blank('This is the book','last week.',['I bought','I bought it'])],['I saw','I bought']),'I saw these people yesterday. I bought this book last week. Combine each pair without an object relative pronoun.'),'省去关系词后，句中主语和动作保留，不再重复them／it。'),
q('e-subject','独立保留主语关系词','保留昨天的来访事件，选择完整句子。',choice(['The man who came yesterday is Ben.','The man came yesterday is Ben.','The man who he came yesterday is Ben.'],'The man who came yesterday is Ben.',{context:'Ben is the man. He came yesterday. Combine the two clauses, keeping came as the past event.'}),'who在从句中作主语，不能只删或重复he。'),
q('e-reduce','独立简化正在发生的动作','一起省略who are，保持当前状态。',ctx(bank(['The people','waiting by the door','are our friends','are waiting by the door'],'The people waiting by the door are our friends',3),'The people who are waiting by the door are our friends. They are waiting there now.'),'保留waiting短语，不改变动作或关系。'),
q('e-place','独立简化位置描述','哪句保持相同位置和身份？',choice(['The car on the left is mine.','The car is on the left is mine.','The car which on the left is mine.'],'The car on the left is mine.',{context:'The car which is on the left is mine.'}),'这个位置短语可按教材示范省去which is。'),
q('e-time','独立从照片时间还原时态','按过去照片的明确时刻还原。',ctx(fill([blank('The boy who','at eight yesterday is Tom.',['was reading','is reading','will read'])],['was reading']),'The photograph was taken at eight yesterday. Tom was reading then. The short caption is “the boy reading at eight yesterday”.'),'reading短语不单独决定时间，要回到照片事实。'),
q('e-on','独立保留介词on','合并并省略宾语关系词。',ctx(bank(['This is the chair','I sat','on','it'],'This is the chair I sat on',3),'This is the chair. I sat on it.'),'on保留，it不再重复。'),
q('e-recipient','独立保留听话人和about','按原意选出简洁描述。',choice(['This is the village I wrote to you about.','This is the village you wrote to me about.','This is the village I wrote to you about it.'],'This is the village I wrote to you about.',{context:'This is the village. I wrote to you about it. Keep the same speaker and listener; this is a combination task, not a reply.'}),'这次只是同一说话人合并，没有换回应角色；保留I、you和about。'),
q('e-front','独立核对前置介词','不使用关系词时，哪项保持原意？',choice(['The house we live in is small.','The house in we live is small.','The house we live is small.'],'The house we live in is small.',{context:'The house in which we live is small. Rewrite with no relative pronoun, keeping the location relation.'}),'in放后面后可以省which，不能只删除前置in后面的which。'),
q('e-finite','独立保留已完成事件的谓语','用昨天的完整事件补句。',ctx(fill([blank('This is the ticket May','yesterday.',['bought','buying','buy'])],['bought']),'May bought this ticket yesterday. The purchase was completed yesterday.'),'宾语关系词省略不使从句失去完整过去谓语。'),
q('e-perspective','独立交换124C回应视角','你是May，回应Ben并补好两个人称。',ctx(fill([blank('That’s right. This is the village','wrote to',['you','I']),blank('','about.',['me','you'])],['you','me']),'Ben says to May: “This is the village. I wrote to you about it.” May now replies to Ben.'),'May回应时you指Ben、me指自己，与不换说话人的合并题不同。'),
q('e-during','独立区分发生期间与持续多久','按所需信息补好两个介词。',ctx(fill([blank('I met Ben','the holiday.',['during','for']),blank('I stayed there','three days.',['for','during'])],['during','for']),'The meeting happened while the holiday was taking place. The stay lasted three days. State the time period of the meeting and the length of the stay.'),'during说明在哪段期间发生；for说明持续长度。'),
q('e-article','独立选择感叹句冠词','按单数可数物品选择a或an。',ctx(fill([blank('What','old ship!',['an','a']),blank('What','lovely kitten!',['a','an'])],['an','a']),'Admire one old ship and one lovely kitten using What.'),'a／an按紧接的发音选择，不仅看后面的名词。'),
q('e-plural','独立保留复数感叹','赞叹多朵花，哪句符合数量？',choice(['What beautiful flowers!','What a beautiful flower!','What a beautiful flowers!'],'What beautiful flowers!',{context:'The speaker admires several flowers together, not a single flower.'}),'plural flowers不配a；单数句虽合法但改变了这里的数量。'),
q('e-mass','独立使用不可数weather','用What赞叹今天的好天气。',choice(['What lovely weather!','What a lovely weather!','What an lovely weather!'],'What lovely weather!',{context:'Use weather in its ordinary uncountable meaning to admire today’s conditions.'}),'有形容词也不自动允许a。'),
q('e-how-adjective','独立组织形容词感叹','按教材常用陈述词序，夸对方友善。',ctx(bank(['How','kind','you','are','What'],'How kind you are',4,'!'),'The speaker wants to praise the listener’s kindness. Use How + adjective + subject + verb.'),'kind形容对方，后接you are。'),
q('e-how-adverb','独立组织副词感叹','按给定意图赞叹他跑得快。',ctx(bank(['How','quickly','he','runs','quick'],'How quickly he runs',4,'!'),'A spectator admires the speed of Ben’s running. Use How with quickly in the written sentence.'),'quickly修饰runs，不用形容词quick代替此处副词。'),
q('e-what-how','独立区分名词结构与形容词结构','补好两句感叹的开头。',ctx(fill([blank('','a lovely garden!',['What','How']),blank('','lovely the garden is!',['How','What'])],['What','How']),'Admire the same garden using the two given sentence patterns.'),'What接名词结构，How直接修饰lovely。'),
q('e-tag','独立按事实回应否定问句','按两张照片的身份补短答。',ctx(fill([blank('It’s not May, is it?',' , it is.',['Yes','No']),blank('It’s not May, is it?',' , it isn’t.',['No','Yes'])],['Yes','No']),'Photo1 is definitely May. Photo2 is definitely Rose, not May. Answer about each photo separately.'),'按身份事实选Yes／No，不机械照抄否定形式。'),
q('e-grow','独立区分grow的词形','按过去句和完成式选择词形。',fill([blank('Last year he','a beard.',['grew','grown']),blank('His hair has','long.',['grown','grew'])],['grew','grown']),'过去式grew，过去分词grown。'),
q('e-offer','独立限制工作结果推断','仅凭这句话，能确认Mike接受工作了吗？',choice(['不能，只确认对方提供过工作机会','能，offer就等于已经接受','能，Mike已经开始领取工资'],'不能，只确认对方提供过工作机会',{context:'The one who offered you a job in Australia.'}),'提供机会与接受或入职是不同事实。'),
q('e-reason','独立保留人物说法的范围','哪项最忠实于结尾？',choice(['Mike说妻子不喜欢那胡子，这是他给出的刮胡子理由','原文说所有人都不喜欢胡子','原文说Scott要求Mike留胡子'],'Mike说妻子不喜欢那胡子，这是他给出的刮胡子理由',{context:'Scott: Why did you shave it off?\nMike: My wife didn’t like it!'}),'保留人物归属和原话范围，不扩张喜好或要求。'),
q('e-negative-reply','独立回应时保留否定和完成式','你是Ben，确认May的原话，哪句保留原意？',choice(['That’s right. This is something new you haven’t thought about.','That’s right. This is something new you have already decided.','That’s right. This is something new I haven’t thought about.'],'That’s right. This is something new you haven’t thought about.',{context:'May says to Ben: “This is something new. I haven’t thought about it.” Ben now replies to May.'}),'I变you，haven’t thought保持否定完成式；不能改成已经决定或改成Ben的经历。')
];
unit.learning.REFERENCE=[
'本课的简洁描述有两种做法，不能混成“关系词都能删”。在本课限定从句中，宾语关系词可省：the photograph I took、the people I met。省略后保留从句主语与完整谓语，不再加重复的it／them。',
'The one who offered you a job中who是offered的主语，不能只删who。The man who is standing…可以按124课示范一起省去who is，留下standing短语；多人who are repairing同理。不能只删who却留下两个谓语，也不把所有动词机械改成-ing。',
'位置短语也可按给定例子简化：the boy who is on the bike → the boy on the bike。简化短语中的-ing本身不说明现在或过去；照片的拍摄时刻与动作状态仍要核对。已经完成的过去事件不能只为省词就改成正在进行。',
'介词仍表达原有关系：the ship we travelled on、the man I told you about、the boxes we keep papers in。省略关系词不等于删掉on／about／in，也不等于删掉整段辨认线索。',
'本课的正式前置介词写法如to whom／in which不能直接去掉关系词，也不用to that。要改成省略关系词的形式，可把介词放回句末：the woman I spoke to、the house we live in。不是所有从句都能省关系词，补充说明的边界另按语境核对。',
'宾语不止一个时，保留接收者：the gift my mother gave me中me不是重复的gift。124C回应别人的话还需交换视角：May说I told you about it；Ben回应you told me about。单纯合并句子时不换说话人，不能看到I就一律改you。',
'What感叹常用名词结构：What a beautiful ship! 单数可数名词要注意a／an及紧接的发音；复数如What beautiful ships!，天气义不可数如What fine weather!，不用单数冠词。形容词本身不保证任何不可数名词都能加a。',
'同一词的用法须看语境：What a nice breakfast!可赞叹具体一顿早餐，What a surprise!中的surprise是一次令人惊讶的事；不能把它们推广成What a fine weather。教材的一场大雨表达按具体事件理解，日常天气表达仍核对名词用法。',
'How感叹常用How＋形容词／副词＋主语＋谓语：How kind you are! How beautifully she sings! 形容词kind描述人，副词beautifully描述唱的方式。本课练这些常用结构；英语还有其他修辞性感叹形式，不能把所有其他词序一概说成错误。',
'during the trip说明在旅行期间发生，不表示整段旅程一直做同一件事；for two weeks说明持续多久。during后通常接名词性期间；不把期间、时长、发生次数和具体日期混为一谈。',
'grow—grew—grown：过去式grew、过去分词grown，三个音标在课本小参考保留。grow a beard指留胡子，shave it off指刮掉它；it指beard，代词放在shave与off中间。',
'原文两处That’s right原样保留。第一次确认提供工作的男士；第二次接在It’s not you, is it?之后，孤立看容易含糊。本课按教材参考译文和后文I grew a beard理解为照片中的人是Mike，不把这句回应教成否定问句的通用规则。另设身份明确的两种情境，分别练Yes, it is／No, it isn’t。',
'Mike现在与照片中的过去外貌分开；提供工作机会不证明接受或入职；we travelled on未明确把Scott列为同行者。妻子不喜欢胡子是Mike给出的解释，不扩成其他动机、要求或所有人的审美。',
'124课A合并同指对象，B写Which…?、That…?和确认回应，C由听话人回应。C中的have heard／haven’t thought／must decide按原来的时态、否定和必要性保留，不改成已经决定。练习中的小偷、警方和其他人物是独立情境，不补进原文故事。'
];
unit.learning.MODEL_TITLE='课本小参考 · 124课1–9';
unit.learning.VERB_FORMS=[['原形','grow','/ɡrəʊ/'],['过去式','grew','/ɡruː/'],['过去分词','grown','/ɡrəʊn/']];
unit.learning.STRUCTURE_MODELS=[['用途','形式','例子'],['省略宾语关系词','名词 + 从句主语 + 动词','the photograph I took'],['一起省去关系词与be','名词 + -ing短语','the man standing behind the counter'],['保留句末介词','名词 + 从句 + 介词','the ship we travelled on'],['单数可数名词感叹','What + a/an + 形容词 + 名词!','What a beautiful ship!'],['复数／不可数名词感叹','What + 形容词 + 名词!','What lovely weather!'],['形容词／副词感叹','How + 形容词/副词 + 主语 + 谓语!','How beautifully she sings!']];
unit.learning.MODELS=[
['1 · Who served you? The man standing behind the counter.','谁接待了你？站在柜台后面的那位男士。','counter'],
['2 · Who served you? The woman standing behind the counter.','谁接待了你？站在柜台后面的那位女士。','counter'],
['3 · Who is making that noise? The men repairing the road.','谁发出那样的响声？正在修路的那些男士。','road'],
['4 · I served him yesterday. He is the man I served yesterday.','我昨天接待过他。他就是我昨天接待的男士。','people'],
['5 · I served her yesterday. She is the woman I served yesterday.','我昨天接待过她。她就是我昨天接待的女士。','people'],
['6 · I saw them yesterday. They are the men I saw yesterday.','我昨天看见过他们。他们就是我昨天看见的那些男士。','people'],
['7 · What’s this? This is the book I bought yesterday.','这是什么？这是我昨天买的书。','book'],
['8 · What are these? These are the books I bought yesterday.','这些是什么？这些是我昨天买的书。','books'],
['9 · What’s this? This is the kitten I found in the garden.','这是什么？这是我在花园里找到的小猫。','kitten']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 合并并省略宾语关系词',answerLines:2,instruction:'每对句子指同一个人或物，省略宾语关系词，保留动作执行者、单复数、时间及必要介词，不重复her／it／him／them。每题一个长句，留两行。',examples:['She is the girl. I met her yesterday. → She is the girl I met yesterday.','This is the book. I bought it yesterday. → This is the book I bought yesterday.','This is the ship. I travelled on it. → This is the ship I travelled on.'],items:['She is the woman. I drove her to London.','That’s the film. I saw it.','That’s the man. I spoke to him.','They are the thieves. The police caught them.','These are the letters. I typed them.','These are the people. You asked me about them.']},
{title:'B · 提问并确认所指对象',answerLines:3,instruction:'按例写Which…?、That…?和Yes回应三部分，每题三行。假定双方正在指同一对象；原叙述者仍是最后回答的人，保留I及动作对象，不把单数变复数。',examples:['I met that man yesterday. → Which man? That man? Yes, that’s the man I met yesterday.'],items:['I saw that man yesterday.','I repaired that car yesterday.','I drove that woman to London yesterday.','I bought that umbrella yesterday.','I took that medicine yesterday.','I invited that man to my house yesterday.']},
{title:'C · 听话人确认并换视角回应',answerLines:2,instruction:'由听话人按例回应That’s right.再写确认句，保留about；原话I在回应中改you，原话you按需要改me，her／him所指对象不改变。have heard、haven’t thought、must decide保留原形式和含义。每题两句，留两行。',examples:['This is the film. I told you about it. → That’s right. This is the film you told me about.'],items:['This is the village. I wrote to you about it.','He is the person. I have heard about him.','This is the test. I spoke to you about it.','She is the woman. I read about her.','This is something new. I haven’t thought about it.','This is something. I must decide about it.']}
];
core.unit123124=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
