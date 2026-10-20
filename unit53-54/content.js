(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit53-54/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson53–54，纸页106–109／PDF139–142';
const grammarSource='《同步导学》Grammar纸页96–97／PDF110–111；《语法练习册》纸页148–152／PDF162–166';
const WORDS=[
 ['mild','温和的','/maɪld/','mild'],['always','总是','/ˈɔːlweɪz/','always'],['north','北方','/nɔːθ/','north'],['east','东方','/iːst/','east'],['wet','潮湿的','/wet/','wet'],['west','西方','/west/','west'],
 ['south','南方','/saʊθ/','south'],['season','季节','/ˈsiːzn/','season'],['best','最；最好地','/best/','best'],['night','夜晚','/naɪt/','night'],['rise','升起','/raɪz/','rise'],['early','早','/ˈɜːli/','early'],
 ['set','（太阳）落下','/set/','set'],['late','晚；迟','/leɪt/','late'],['interesting','有趣的','/ˈɪntrəstɪŋ/','interesting'],['subject','话题','/ˈsʌbdʒɪkt/','subject'],['conversation','谈话','/ˌkɒnvəˈseɪʃn/','conversation'],['day','白天；一天','/deɪ/','day'],
 ['Australia','澳大利亚','/ɒˈstreɪliə/','australia'],['Australian','澳大利亚人；澳大利亚的','/ɒˈstreɪliən/','australia'],['Austria','奥地利','/ˈɒstriə/','austria'],['Austrian','奥地利人；奥地利的','/ˈɒstriən/','austria'],['Canada','加拿大','/ˈkænədə/','canada'],['Canadian','加拿大人；加拿大的','/kəˈneɪdiən/','canada'],
 ['China','中国','/ˈtʃaɪnə/','china'],['Chinese','中国人；中国的','/ˌtʃaɪˈniːz/','china'],['Finland','芬兰','/ˈfɪnlənd/','finland'],['Finnish','芬兰人；芬兰的','/ˈfɪnɪʃ/','finland'],['India','印度','/ˈɪndiə/','india'],['Indian','印度人；印度的','/ˈɪndiən/','india'],
 ['Japan','日本','/dʒəˈpæn/','japan'],['Japanese','日本人；日本的','/ˌdʒæpəˈniːz/','japan'],['South Korea','韩国','/ˌsaʊθ kəˈrɪə/','south-korea'],['South Korean','韩国人；韩国的','/ˌsaʊθ kəˈriːən/','south-korea'],['Nigeria','尼日利亚','/naɪˈdʒɪəriə/','nigeria'],['Nigerian','尼日利亚人；尼日利亚的','/naɪˈdʒɪəriən/','nigeria'],
 ['Poland','波兰','/ˈpəʊlənd/','poland'],['Polish','波兰人；波兰的','/ˈpəʊlɪʃ/','poland'],['Thailand','泰国','/ˈtaɪlænd/','thailand'],['Thai','泰国人；泰国的','/taɪ/','thailand'],['Turkey','土耳其','/ˈtɜːki/','turkey'],['Turkish','土耳其人；土耳其的','/ˈtɜːkɪʃ/','turkey']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit53-54',version:1,contentRevision:'weather-station-v1',mode:'classroom',title:'天气观察站',path:'/unit53-54/',start:'learn/words',progress:{learningKey:'canran:unit53-54:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
 {id:'l1',title:'带上观察词袋',activities:[['words','天气小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'和 Jim 聊天气',activities:[['text','天气小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'发现 like 的用法',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'接待新朋友',activities:[['apply','天气话题接力','give']],required:['apply']},
 {id:'l5',title:'观察站挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'weather-station-v1',title:'天气话题小达人',lesson:'Lesson 53–54',scene:'/assets/unit53-54/keepsake-story-v1.webp',alt:'Hans和Jim在花园天气观察站里指着方位天气板交流',color:'#6f8059',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','天气话题接力'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['hans','Where do you come from?','你来自哪里？'],['jim','I come from England.','我来自英格兰。'],
 ['hans','What’s the climate like in your country?','你们国家的气候怎么样？'],['jim','It’s mild, but it’s not always pleasant.','气候温和，但并不总是宜人的。'],
 ['jim','The weather’s often cold in the North and windy in the East. It’s often wet in the West and sometimes warm in the South.','北部的天气常常寒冷，东部常常刮风。西部常常潮湿，南部有时暖和。'],
 ['hans','Which seasons do you like best?','你最喜欢哪些季节？'],
 ['jim','I like spring and summer. The days are long and the nights are short. The sun rises early and sets late.','我喜欢春季和夏季。白天长，夜晚短。太阳升得早，落得晚。'],
 ['jim','I don’t like autumn and winter. The days are short and the nights are long. The sun rises late and sets early. Our climate is not very good, but it’s certainly interesting. It’s our favourite subject of conversation.','我不喜欢秋季和冬季。白天短，夜晚长。太阳升得晚，落得早。我们的气候不算很好，但的确很有意思。它是我们最喜欢谈论的话题。']
].map(([who,text,cn],i)=>({id:'u5354-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u5354-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-directions','辨认四个方位','把方位与意思连起来。',match([['north','北方'],['east','东方'],['west','西方'],['south','南方']]),'地图按上北下南、左西右东摆放时，可以这样认四个方位。'),
 q('v-night','区分昼夜','月亮和星星出现了，选出“夜晚”。',choice(['night','day','season'],'night',{image:image('night'),imageAlt:'深蓝夜空中的弯月和星星'}),'night是夜晚，day可表示白天。'),
 q('v-actions','理解升落与早晚','把词与意思连起来。',match([['rise','升起'],['set','落下'],['early','早'],['late','晚']]),'太阳升起用rise，太阳落下用set；early与late说明早晚。'),
 q('v-mild','辨认mild','天气不太热，也不太冷。哪个词表示“温和的”？',choice(['mild','wet','late'],'mild'),'mild说温度温和；不等于天天晴朗。'),
 q('v-countries','区分近似国家名称','给国家配上名称。',match([['Australia','澳大利亚'],['Austria','奥地利'],['Nigeria','尼日利亚'],['Poland','波兰']]),'Australia和Austria是两个不同国家。'),
 q('v-wet','辨认潮湿','地面湿漉漉的。选出相符的词。',choice(['wet','early','interesting'],'wet',{image:image('wet'),imageAlt:'雨靴旁有水滴和水洼'}),'wet表示湿的、潮湿的。'),
 q('v-topic','理解话题和谈话','给词组配上意思。',match([['an interesting subject','一个有趣的话题'],['a conversation','一次谈话'],['my favourite season','我最喜欢的季节']]),'这里subject是话题，不是学校的科目。'),
 q('v-frequency','不把always误作often','always 的意思是什么？',choice(['总是','有时','从不'],'总是'),'always表示总是；not always则是并不总是。')
];
unit.questions.roles=[
 q('r-origin','从原文确认来源','Jim来自哪里？',choice(['England','Australia','Austria'],'England'),'Jim说I come from England.。','看Jim第一次回答。'),
 q('r-mild','理解not always而非never','Jim说气候温和，还补充了什么？',choice(['并不总是宜人','从来都不宜人','一直都很宜人'],'并不总是宜人'),'not always pleasant是否定“总是”，不是说从来不宜人。','注意not与always一起使用。'),
 q('r-regions','依据Jim描述分辨四方天气','按Jim的介绍连一连。',match([['the North','often cold'],['the East','windy'],['the West','often wet'],['the South','sometimes warm']]),'这是Jim对本国气候的介绍，不是今天的天气预报。','回看Jim介绍四个方位的一段。'),
 q('r-season','提取人物明确喜好','Jim最喜欢哪些季节？',choice(['spring and summer','autumn and winter','summer and winter'],'spring and summer'),'他说I like spring and summer.。','喜欢的季节出现在Hans提问后。'),
 q('r-day','理解同一季节昼夜长短','按Jim的描述，春夏的昼夜怎样？',fill([blank('The days are ','.',['long','short']),blank('The nights are ','.',['short','long'])],['long','short']),'课文里的春夏白天长、夜晚短。','白天和夜晚两个条件都要看。'),
 q('r-sun','理解秋冬太阳升落时间','按课文补全秋冬的记录。',fill([blank('The sun rises ','',['late','early']),blank('and sets ','.',['early','late'])],['late','early']),'秋冬太阳升得晚、落得早。','这次问秋冬，不是春夏。'),
 q('r-topic','确认全文谈话主题','Jim说，大家最喜欢谈论什么？',choice(['他们的气候','某个国家的国旗','今天的午饭'],'他们的气候'),'最后一句的It指前面提到的climate。','读最后两句。')
];
unit.questions.grammar=[
 g('meaning','分辨like的喜欢与状况用法','I like summer. 中的 like 表示什么？',choice(['喜欢','像','来自'],'喜欢'),'like作动词时可以表示喜欢。','看like后面是在说什么。',model(['What’s the weather like?','天气怎么样？这里不是问喜欢。'],['I like spring.','我喜欢春天。这里like是动词。'])),
 g('object','like后的代词用宾格','Anna是我的朋友，我很喜欢她。补全：',fill([blank('I like ','.',['her','she','hers'])],['her']),'like后接人称代词时，这里用宾格her。','她在这句话中是被喜欢的人。',model(['Tom is kind. We like him.','Tom很好。我们喜欢他。him是宾格。'])),
 g('forms','承认like doing和like to do均可表达喜好','想说“我喜欢游泳”。下面两种说法哪一种可以使用？\nI like swimming. / I like to swim.',choice(['两句都可以','只有第一句可以','只有第二句可以'],'两句都可以'),'like doing和like to do都可以表达喜好，不能简单按“经常/偶尔”划成对错。','不把另一种正确形式排除。',model(['I like reading. / I like to read.','两种形式都能表示喜欢读书。'])),
 g('order','构成like to do结构','用词块说：我喜欢在春天散步。',bank(['I','like','to walk','in spring','walking to'],'I like to walk in spring',4),'like后可以接to＋动词原形。','选出一个完整的to do词块。',model(['I like to play in the garden.','我喜欢在花园里玩。'])),
 g('person','like sb to do表示喜欢某人做事','“Jim喜欢我们问问题”是哪一句？',choice(['Jim likes us to ask questions.','Jim likes we to ask questions.','Jim likes us ask questions.'],'Jim likes us to ask questions.'),'like＋某人（宾格）＋to do，表示喜欢某人做某事。','人物用宾格，动作前保留to。',model(['Mum likes me to read.','妈妈喜欢我读书。'])),
 g('want','would like to do表达想要','用词块说：我想喝点水。',bank(['I’d like','to drink','some water','drinking'],'I’d like to drink some water',3),'I’d like＝I would like；would like后接动作时用to do。','would like后面的动作形式与feel like不同。',model(['I’d like to sit here.','我想坐在这里。'])),
 g('invite','Would you like礼貌邀请与回应','Jim请你喝茶：Would you like some tea?\n你想喝，怎样接话？',choice(['Yes, please.','I like spring best.','It looks like tea.'],'Yes, please.'),'Would you like…?可以礼貌地询问想不想要，接受时可说Yes, please.。','回应这一次邀请。',model(['Would you like some juice? — No, thank you.','想喝果汁吗？——不用了，谢谢。'])),
 g('want-person','would like sb to do与主语指向','I’d like you to open the window. 谁来开窗？',choice(['you（你）','I（我）','the window（窗户）'],'you（你）'),'would like＋某人＋to do，表示想让某人做某事。','to open前紧接着谁？',model(['Jim would like me to help.','Jim想让我帮忙。是我来帮忙。'])),
 g('appearance','look like描述外观相似','这朵云像一只猫。补全：',fill([blank('This cloud ',' a cat.',['looks like','likes','would like'])],['looks like']),'look like表示看起来像。','这里说形状，不是在说喜欢猫。',model(['The cloud looks like a bird.','这朵云看起来像一只鸟。'])),
 g('character','be like可以询问性格','Anna很友善。What’s Anna like? 应该怎么答？',choice(['She’s friendly.','She likes tea.','She comes from India.'],'She’s friendly.'),'What is someone like?可以问性格、特点，不只问外貌。','回答要描述Anna是怎样的人。',model(['What’s Tom like? — He’s quiet.','Tom是怎样的人？——他很安静。'])),
 g('feel','feel like表达此时想要','Jim说I feel like a cup of tea. 他想要什么？',choice(['一杯茶','一张像茶杯的画','天天喝茶的习惯'],'一杯茶'),'feel like可以接名词，表示此时想要。','把feel like当作一个短语看。',model(['I feel like it.','我想要它／想做那件事，it要结合前文理解。'])),
 g('feel-form','feel like后用动词ing','想表达“我想去游泳”。补全：',fill([blank('I feel like ','.',['swimming','to swim','swim'])],['swimming']),'feel like后接动作时，用动词-ing形式。','这一题的结构是feel like。',model(['I feel like walking.','我想去散步。'])),
 g('about','What do you like about问喜欢哪点','What do you like about spring? 在问什么？',choice(['你喜欢春天的哪一点','春天在哪里','你想要一个春天吗'],'你喜欢春天的哪一点'),'What do you like about…?问喜欢某事物的什么方面。','留意about后面说的对象。',model(['What do you like about the book? — The pictures.','你喜欢这本书哪一点？——里面的图画。'])),
 g('opinion','How do you like问评价','How do you like this garden? 哪句回答切题？',choice(['It’s lovely.','By bus.','In the North.'],'It’s lovely.'),'How do you like…?在这里问看法，不是问交通方式。','lovely：很美、很可爱。',model(['How do you like the film? — It’s interesting.','你觉得电影怎么样？——很有趣。'])),
 g('independent-forms','撤去示范后区分would与feel结构','你想休息一下，用两种说法补全。',fill([blank('I’d like ',' a rest.',['to have','having']),blank('I feel like ',' a rest.',['having','to have'])],['to have','having']),'would like to have；feel like having。','先看每句话里like前面的词。'),
 g('independent-person','独立构成想让某人做事的句子','用词块说：她想让我帮忙。',bank(['She','would like','me','to help','I'],'She would like me to help',4),'would like me to help：想让我来帮忙。','动作的人用宾格me。'),
 g('independent-invite','独立理解动作邀请','Would you like to visit the garden? 对方在问什么？',choice(['你想参观花园吗','你平时喜欢什么花','花园看起来像什么'],'你想参观花园吗'),'Would you like to…?可以提出做某事的邀请。','visit：参观。'),
 g('independent-about','独立回应喜欢某事物的具体方面','What do you like about summer?\n你想说：我喜欢夏天漫长的白天。',choice(['I like the long days.','The days look like nights.','I’d like you to wait.'],'I like the long days.'),'about summer问喜欢夏天的哪一点。','选择夏天里你喜欢的具体特点。')
];
unit.questions.apply=[
 q('a-source','国家名与国籍词各就其位','新朋友说：I’m Canadian.\n给她补上来源地。',choice(['I come from Canada.','I come from Canadian.','I am Canada.'],'I come from Canada.'),'Canada是国家，Canadian是国籍词。','from后接国家名。'),
 q('a-third','第三人称来源与国籍','访客卡：Anna，来自印度。补全：',fill([blank('She ',' Indian.',['is','comes']),blank('She ',' from India.',['comes','come'])],['is','comes']),'国籍用be，来自用come from；she后用comes。','分清“是”与“来自”。'),
 q('a-question','询问多人的来源','两位新朋友来到观察站。问他们来自哪里。',bank(['Where','do','you','come from','does'],'Where do you come from',4,'?'),'询问you的来源用do，不用does。','这里you指你们。'),
 q('a-negative','否定错误来源并保留动词原形','Jim来自英格兰。否定“他来自澳大利亚”：',fill([blank('He ','',['doesn’t','don’t']),blank('',' from Australia.',['come','comes'])],['doesn’t','come']),'doesn’t之后come恢复原形。','he与助动词、动词都要配合。'),
 q('a-adverb','频率副词在实义动词前','记录板：太阳经常升得早。把often放到合适的位置。',bank(['The sun','often','rises','early','is'],'The sun often rises early',4),'often常放在实义动词rises之前。','这里rises已经是动词。'),
 q('a-preference','询问最喜欢的季节','想知道Jim最喜欢哪一个季节。补全问句：',fill([blank('Which season ',' you like',['do','does']),blank('','?',['best','very'])],['do','best']),'Which season do you like best?问最喜欢哪个季节。','best在这个问题里表示最。'),
 q('a-ordinal','识别整十和复合序数词','给观察记录编号配对。',match([['40th','fortieth'],['100th','hundredth'],['101st','hundred and first'],['102nd','hundred and second']]),'40th是fortieth；101st、102nd随末尾first、second变化。','四十的拼法是forty，序数词是fortieth。'),
 q('a-send','整合材料中的来源与偏好','访客卡：I come from Thailand. I like summer best.\n完成他的介绍。',choice(['来自泰国，最喜欢夏天','来自土耳其，最喜欢夏天','来自泰国，最喜欢冬天'],'来自泰国，最喜欢夏天'),'要同时核对来源与最喜欢的季节。','两条信息都要保留。')
];
const demos={source:model(['I’m Austrian. I come from Austria.','Austrian说国籍，Austria是国家。']),third:model(['He is Finnish. He comes from Finland.','第三人称单数在这里分别用is、comes。']),question:model(['Where do they come from?','他们来自哪里？']),negative:model(['She doesn’t come from Japan.','doesn’t后用动词原形。']),adverb:model(['It often rains. / It is often wet.','实义动词前；be动词后。']),preference:model(['Which season does she like best?','她最喜欢哪个季节？']),ordinal:model(['30th · thirtieth / 103rd · hundred and third','第三十／第一百零三；复合序数词末尾用third。'])};
for(const item of unit.questions.apply){const demo=demos[item.id.replace('u5354-v1-a-','')];if(demo)item.workshop={model:demo};}
unit.questions.exam=[
 q('e-directions','把方位词用于观察站平面图','这张平面图上方为北。小旗在观察站的哪一侧？',{...fill([blank('The flag is to the ',' of the station.',['east','west','south'])],['east']),image:image('station-route'),imageAlt:'平面图中央是观察站，小旗位于它右侧'},'上北下南的平面图中，右侧是东方east。'),
 q('e-day','独立理解课文秋冬昼夜','按Jim的描述，秋冬的昼夜怎样？',fill([blank('The days are ','.',['short','long']),blank('The nights are ','.',['long','short'])],['short','long']),'课文秋冬白天短、夜晚长。'),
 q('e-rise','区分升落和早晚','观察记录写着：The sun rises early and sets late.\n哪张记录准确？',choice(['太阳升得早，落得晚','太阳升得晚，落得早','太阳升得早，落得早'],'太阳升得早，落得晚'),'rises early升得早，sets late落得晚。'),
 q('e-countries','独立连接国家与国籍','把国家配上国籍词。',match([['Nigeria','Nigerian'],['Poland','Polish'],['Thailand','Thai'],['Turkey','Turkish']]),'国家名称和国籍词的形式并不总是按同一规则变化。'),
 q('e-origin','整合来源与不总是的含义','Jim怎样介绍自己国家的气候？',choice(['来自英格兰，温和但并不总是宜人','来自奥地利，气候一直宜人','来自英格兰，从来都不宜人'],'来自英格兰，温和但并不总是宜人'),'not always不等于never。'),
 q('e-regions','区分四方描述且保留频率','按Jim的原话，哪张记录正确？',choice(['西部常常潮湿，南部有时暖和','西部总是干燥，南部总是暖和','北部常常暖和，东部从不刮风'],'西部常常潮湿，南部有时暖和'),'often wet in the West；sometimes warm in the South。'),
 q('e-season','独立定位原文喜好','点出Jim喜欢的两个季节。',{type:'locate',fragments:['I like ',{value:'spring and summer'},'. The ',{value:'days are long'},'.'],options:['spring and summer','days are long'],answer:'spring and summer'},'spring and summer是他喜欢的季节。'),
 q('e-topic','理解话题与不夸大信息','从Jim的介绍能确定什么？',choice(['气候是他们爱谈的话题','英格兰今天各地都下雨','全世界夏天都一样长'],'气候是他们爱谈的话题'),'原文没有给当天实况，也不能推出全球昼夜都相同。'),
 q('e-frequency','独立识别频率词','“经常”与“总是”怎样配？',match([['often','经常'],['always','总是'],['sometimes','有时']]),'频率词不对应固定百分比。'),
 q('e-like','独立区分介词like与动词like','What’s the climate like? 在问什么？',choice(['气候怎么样','你喜欢气候吗','气候想要什么'],'气候怎么样'),'What is…like?询问状况或特点。'),
 q('e-object','独立选择like后的宾格','这两位新朋友很友善，我们喜欢他们。',fill([blank('We like ','.',['them','they','their'])],['them']),'like后用宾格them。'),
 q('e-forms','独立接受两种正确喜好结构','I like walking. / I like to walk.\n两句都能表示“我喜欢散步”吗？',choice(['可以，两种形式都正确','不可以，to walk总是错的','不可以，walking总是错的'],'可以，两种形式都正确'),'不把两种正确的like结构互判为错。'),
 q('e-person','独立使用like sb to do','Jim喜欢孩子们问问题。补全：',fill([blank('Jim likes ','',['them','they']),blank('',' questions.',['to ask','ask'])],['them','to ask']),'likes them to ask：喜欢他们提问。'),
 q('e-want','独立构成would like to do','用词块说：我想坐在这里。',bank(['I','would like','to sit','here','sitting'],'I would like to sit here',4),'would like后接动作时用to do。'),
 q('e-invite','独立礼貌回应想要邀请','Would you like some water?\n你现在不想喝，怎样礼貌回答？',choice(['No, thank you.','I don’t come from here.','What is it like?'],'No, thank you.'),'拒绝这次邀请可说No, thank you.。'),
 q('e-want-person','区分想让谁做事','Jim would like us to visit the garden. 谁去参观？',choice(['us（我们）','Jim','the garden（花园）'],'us（我们）'),'would like us to visit表示想让我们参观。'),
 q('e-appearance','独立表达外观相似','天上的云看起来像一只小狗。',fill([blank('The cloud ',' a dog.',['looks like','would like','likes'])],['looks like']),'look like说明看起来像。'),
 q('e-character','独立回应人物特点','Tom很安静。What’s Tom like? 应怎样回答？',choice(['He’s quiet.','He likes winter.','He’s from Canada.'],'He’s quiet.'),'问特点，按材料用quiet描述。'),
 q('e-feel','独立区分feel like与would like','想表达“我想喝茶”，补全两种说法。',fill([blank('I feel like ',' tea.',['drinking','to drink']),blank('I’d like ',' tea.',['to drink','drinking'])],['drinking','to drink']),'feel like drinking；would like to drink。'),
 q('e-about','独立回应喜欢哪一点','What do you like about this garden?\n你喜欢这里的花。',choice(['I like the flowers.','I would like you to come.','It looks like a bag.'],'I like the flowers.'),'about this garden问你喜欢花园的哪一点。'),
 q('e-opinion','独立理解How do you like评价提问','How do you like this book?\n书很有趣，怎样答？',choice(['It’s interesting.','By train.','At seven.'],'It’s interesting.'),'这里How do you like是在询问评价。'),
 q('e-source','独立区分复数国籍与来源','他们是日本人，来自日本。',fill([blank('They ',' Japanese.',['are','is']),blank('They ',' from Japan.',['come','comes'])],['are','come']),'复数they后分别用are、come。'),
 q('e-question','第三人称来源问句的动词还原','问“她来自韩国吗？”',fill([blank('',' she',['Does','Do']),blank('',' from South Korea?',['come','comes'])],['Does','come']),'Does she come from…?，Does后动词用原形。'),
 q('e-negative','独立把第三人称肯定句改否定','把The sun sets late.改成否定句。',bank(['The sun','doesn’t','set','late','sets','don’t'],'The sun doesn’t set late',4),'doesn’t之后set用原形。'),
 q('e-adverb','独立把频率副词放在be后','“西部常常潮湿”怎样说？',choice(['It is often wet in the West.','It often wet in the West.','It are often wet in the West.'],'It is often wet in the West.'),'本练习采用频率副词的常见位置：be后、实义动词前。'),
 q('e-preference','独立构成最喜欢的季节问句','问她最喜欢哪个季节。',bank(['Which season','does','she','like best','likes best'],'Which season does she like best',4,'?'),'does后用like，best表示最。'),
 q('e-ordinal','独立识别特殊序数词','给记录编号配上读法。',match([['30th','thirtieth'],['50th','fiftieth'],['90th','ninetieth'],['103rd','hundred and third']]),'整十序数词常变y为ie再加th；103rd以third结尾。'),
 q('e-transfer','整合新人物来源与邀请语气','新访客说：I come from Finland. I’d like to see the garden.\n哪张接待记录准确？',choice(['来自芬兰，想看看花园','来自印度，想看看花园','来自芬兰，花园像他'],'来自芬兰，想看看花园'),'from Finland说明来源；would like to see表示想看看。')
];
const modelData=[['I’m Australian.','I come from Australia.','australia','20th · twentieth'],['He’s Austrian.','He comes from Austria.','austria','30th · thirtieth'],['He’s Canadian.','He comes from Canada.','canada','40th · fortieth'],['We’re Chinese.','We come from China.','china','50th · fiftieth'],['You’re Finnish.','You come from Finland.','finland','60th · sixtieth'],['She’s Indian.','She comes from India.','india','70th · seventieth'],['You’re Japanese.','You come from Japan.','japan','80th · eightieth'],['I’m South Korean.','I come from South Korea.','south-korea','90th · ninetieth'],['We’re Nigerian.','We come from Nigeria.','nigeria','100th · hundredth'],['They’re Polish.','They come from Poland.','poland','101st · hundred and first'],['She is Thai.','She comes from Thailand.','thailand','102nd · hundred and second'],['She’s Turkish.','She comes from Turkey.','turkey','103rd · hundred and third']];
unit.learning.MODELS=modelData.map(([en,cn,art,number])=>({en,cn,image:image(art),number}));
unit.learning.WRITING_A=['The sun sets late.','He likes ice cream.','Mrs. Jones wants a biscuit.','Jim comes from England.'];
unit.learning.WRITING_B=['he / Australia','he / Austria','he / Canada','they / China','he / Finland','she / India','they / Japan','they / Nigeria','she / Turkey','she / South Korea'];
unit.learning.REFERENCE=['like＋名词／宾格代词：I like summer. / We like him.','like doing与like to do都能表达喜好：I like reading. / I like to read.','like somebody to do：Mum likes me to read.（妈妈喜欢我读书。）','would like＋名词／to do：I’d like some tea. / I’d like to rest.','would like somebody to do：I’d like you to help.（我想让你帮忙。）','Would you like…?：礼貌询问想要什么或发出邀请。','What is … like?问状况、性格或特点；look like说看起来像。','feel like＋名词／代词／doing：I feel like tea / it / walking.（想要／想做。）','What do you like about…?问喜欢哪点；How do you like…?问看法。','频率副词通常放在be之后、实义动词之前：It is often wet. / It often rains.','英格兰是England。课文四方天气与昼夜特点均以Jim的介绍为范围，不作实时或全球气候结论。'];
unit.source={text:textSource,grammar:grammarSource};core.unit5354=unit;
if(root.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit5354,excerpts={"u5354-v1-r-origin":[0,1],"u5354-v1-r-mild":[2,3],"u5354-v1-r-regions":[4],"u5354-v1-r-season":[5,6],"u5354-v1-r-day":[5,6],"u5354-v1-r-sun":[7],"u5354-v1-r-topic":[7]},speakers={"hans":"Hans","jim":"Jim"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 53',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
