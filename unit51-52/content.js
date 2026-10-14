(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit51-52/'+name+'.svg';
const textSource='《新概念英语智慧版1》Lesson51–52，纸页102–105／PDF135–138';
const grammarSource='《同步导学》Grammar纸页94／PDF108；《语法练习册》纸页142–146／PDF156–160';
const WORDS=[
 ['Greece','希腊','/ɡriːs/','greece'],['climate','气候','/ˈklaɪmət/','climate'],['country','国家','/ˈkʌntri/','country'],['pleasant','宜人的','/ˈplezənt/','pleasant'],['weather','天气','/ˈweðə/','weather'],['spring','春季','/sprɪŋ/','spring'],
 ['windy','有风的','/ˈwɪndi/','windy'],['warm','温暖的','/wɔːm/','warm'],['rain','下雨','/reɪn/','rain'],['sometimes','有时','/ˈsʌmtaɪmz/','sometimes'],['summer','夏季','/ˈsʌmə/','summer'],['autumn','秋季','/ˈɔːtəm/','autumn'],
 ['winter','冬季','/ˈwɪntə/','winter'],['snow','下雪','/snəʊ/','snow'],['January','一月','/ˈdʒænjuəri/','month-1'],['February','二月','/ˈfebruəri/','month-2'],['March','三月','/mɑːtʃ/','month-3'],['April','四月','/ˈeɪprəl/','month-4'],
 ['May','五月','/meɪ/','month-5'],['June','六月','/dʒuːn/','month-6'],['July','七月','/dʒuˈlaɪ/','month-7'],['August','八月','/ˈɔːɡəst/','month-8'],['September','九月','/sepˈtembə/','month-9'],['October','十月','/ɒkˈtəʊbə/','month-10'],
 ['November','十一月','/nəʊˈvembə/','month-11'],['December','十二月','/dɪˈsembə/','month-12'],['the U.S.','美国','/ðə ˌjuː ˈes/','us'],['Brazil','巴西','/brəˈzɪl/','brazil'],['the Netherlands','荷兰','/ðə ˈneðələndz/','netherlands'],['England','英格兰','/ˈɪŋɡlənd/','england'],
 ['France','法国','/frɑːns/','france'],['Germany','德国','/ˈdʒɜːməni/','germany'],['Italy','意大利','/ˈɪtəli/','italy'],['Norway','挪威','/ˈnɔːweɪ/','norway'],['Russia','俄罗斯','/ˈrʌʃə/','russia'],['Spain','西班牙','/speɪn/','spain'],
 ['Sweden','瑞典','/ˈswiːdn/','sweden'],['always','总是','/ˈɔːlweɪz/','always'],['often','经常','/ˈɒfn/','often'],['shine','照耀','/ʃaɪn/','shine'],['hot','热的','/hɒt/','hot'],['cold','冷的','/kəʊld/','cold']
].map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit51-52',version:1,contentRevision:'climate-postcards-v1',mode:'classroom',title:'希腊四季明信片',path:'/unit51-52/',start:'learn/words',progress:{learningKey:'canran:unit51-52:learning:v1'},objects:WORDS,
 learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},
 stages:[
 {id:'l1',title:'装好旅行词袋',activities:[['words','旅行小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'翻开四季相册',activities:[['text','四季小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
 {id:'l3',title:'问问是什么样',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
 {id:'l4',title:'寄一张明信片',activities:[['apply','明信片小向导','give']],required:['apply']},
 {id:'l5',title:'四季旅行挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
 ],questions:{},reward:{edition:'climate-postcards-v1',title:'四季旅行小向导',lesson:'Lesson 51–52',scene:'/assets/unit51-52/keepsake-story-v1.webp',alt:'Dimitri翻开四季相册，Hans指着春天的照片，两人一起交流',color:'#407c90',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','明信片小向导'],['exam','综合挑战']].map(([id,title])=>({id,title}))}
};
unit.learning.DIALOGUE=[
 ['hans','Where do you come from?','你来自哪里？'],['dimitri','I come from Greece.','我来自希腊。'],
 ['hans','What’s the climate like in your country?','你们国家的气候怎么样？'],['dimitri','It’s very pleasant.','气候非常宜人。'],
 ['hans','What’s the weather like in spring?','春季的天气怎么样？'],['dimitri','It’s often windy in March. It’s always warm in April and May, but it rains sometimes.','三月里常常刮风。四月和五月总是暖洋洋的，但有时下雨。'],
 ['hans','What’s it like in summer?','夏季的天气怎么样呢？'],['dimitri','It’s always hot in June, July and August. The sun shines every day.','六月、七月和八月总是炎热的。每天都有阳光。'],
 ['hans','Is it cold or warm in autumn?','秋季的天气是冷还是暖呢？'],['dimitri','It’s always warm in September and October. It’s often cold in November and it rains sometimes.','九月和十月总是暖和的。十一月常常就冷了，而且有时下雨。'],
 ['hans','Is it very cold in winter?','冬季的天气很冷吗？'],['dimitri','It’s often cold in December, January and February. It snows sometimes.','十二月、一月和二月常常很冷。有时下雪。']
].map(([who,text,cn],i)=>({id:'u5152-d'+(i+1),who,text,cn,source:textSource}));
const q=(id,target,prompt,input,explanation,hint='')=>({id:'u5152-v1-'+id,target,prompt,source:textSource,...input,explanation,hint});
const choice=(options,answer,extra={})=>({options,answer,...extra});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)});
const bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix});
const match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))});
const model=(...lines)=>({lines});
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
 q('v-seasons','辨认四季','把季节与意思连起来。',match([['spring','春季'],['summer','夏季'],['autumn','秋季'],['winter','冬季']]),'四个词分别表示春、夏、秋、冬。'),
 q('v-weather','weather与climate的时间尺度','“今天刮风了。”说的是今天的什么？',choice(['weather','climate','country'],'weather'),'weather说具体天气，climate说一个地区长期的气候特点。'),
 q('v-windy','windy的词义','图上的树被风吹弯了。哪个词适合？',choice(['windy','hot','cold'],'windy',{image:image('windy'),imageAlt:'风吹动树枝和飘带'}),'windy表示有风的。'),
 q('v-frequency','区分三个频率词','把词与意思连起来。',match([['always','总是'],['often','经常'],['sometimes','有时']]),'有时不等于总是；频率词不对应固定百分比。'),
 q('v-months','辨认跨季月份','给月份配上数字。',match([['February','二月'],['June','六月'],['September','九月'],['December','十二月']]),'这些是月份的英文名称，首字母大写。'),
 q('v-country','识别国家名称','给国家名称配上中文。',match([['Brazil','巴西'],['the Netherlands','荷兰'],['Norway','挪威'],['Sweden','瑞典']]),'国家名称和国籍词不同。'),
 q('v-rain','rain与snow的区别','雨滴从云中落下来。选出“下雨”。',choice(['rain','snow','shine'],'rain',{image:image('rain'),imageAlt:'云下落着蓝色雨滴'}),'rain表示下雨，snow表示下雪。'),
 q('v-pleasant','理解pleasant','a pleasant climate 指什么样的气候？',choice(['宜人的','一定很热的','天天下雪的'],'宜人的'),'pleasant表示宜人的，不是某种固定温度。')
];
unit.questions.roles=[
 q('r-origin','从原文确认来源','Dimitri来自哪个国家？',choice(['Greece','Germany','France'],'Greece',{optionImages:{Greece:image('greece'),Germany:image('germany'),France:image('france')}}),'他亲口说I come from Greece.。','找Dimitri的第一句回答。'),
 q('r-spring','区分同季不同月份的天气','按Dimitri的描述，三月和四、五月有什么不同？',fill([blank('March: often ','',['windy','hot']),blank('April and May: always ','',['warm','cold'])],['windy','warm']),'三月常刮风，四月和五月总是暖和。','同一季节里，不同月份的描述也不同。'),
 q('r-summer','定位夏季日照频率','点出“每天”。',{type:'locate',fragments:['The sun ',{value:'shines'},' ',{value:'every day'},'.'],options:['shines','every day'],answer:'every day'},'Dimitri说夏季每天都有阳光。','找说明频率的词组。'),
 q('r-autumn','理解秋季内的变化','Dimitri说，秋季哪一个月常常冷？',choice(['November','September','October'],'November'),'他说十一月常常冷，不是把整个秋季都说成冷。','留意秋季回答的第二句话。'),
 q('r-winter','理解有时下雪','课文说希腊冬季下雪吗？',choice(['有时下雪','每天都下雪','从来不下雪'],'有时下雪'),'It snows sometimes.表示有时下雪。','判断频率词，而不只看snow。'),
 q('r-boundary','区分课文气候与实时天气','读完这个故事，能确定哪一件事？',choice(['Dimitri觉得本国气候宜人','今天希腊每个地方都晴天','Hans正在希腊过冬'],'Dimitri觉得本国气候宜人'),'课文是Dimitri的气候介绍，没有给今天各地的实况。','只选择原文明确说出的信息。')
];
unit.questions.grammar=[
 g('meaning','识别询问状况的意义','What’s the weather like? 在问什么？',choice(['天气怎么样','你喜欢什么天气','天气来自哪里'],'天气怎么样'),'What’s … like?用于询问状况或特点。','把整句当作一个提问方式。',model(['What’s the climate like?','气候怎么样？'],['It’s pleasant.','气候宜人。'])),
 g('order','组成询问天气的句子','用词块问：今天的天气怎么样？',bank(['What’s','the weather','like','today','Do'],'What’s the weather like today',4,'?'),'What’s＋询问对象＋like?；today说明时间。','先放提问词，再放想了解的对象。',model(['What’s the climate like in your country?','你们国家的气候怎么样？'])),
 g('climate','询问地区气候的对象与like位置','问这个国家的气候怎么样。',fill([blank('What’s the ','',['climate','country']),blank('',' in your country?',['like','from'])],['climate','like']),'the climate是询问对象，like留在它后面。','不是问国家的名字。',model(['What’s the weather like in winter?','冬天天气怎么样？'])),
 g('contraction','识别此结构中What’s等于What is','在这句中，What’s的完整形式是什么？\nWhat’s the weather like?',choice(['What is','What does','What are'],'What is'),'这里What’s是What is的缩写。','后面的weather用单数形式。',model(['What is the room like? → What’s the room like?','这个房间是什么样的？'])),
 g('it','用it指代天气并接be','今天很冷。补全回答：\nWhat’s the weather like today?',fill([blank('',' cold.',['It’s','They’re','I’m'])],['It’s']),'谈天气常用it，It’s＝It is。','回答说的是天气，不是我。',model(['What’s the climate like? — It’s warm.','用it接着说气候。'])),
 g('adjective','形容词回答状况问题','天气卡写着“有风”。怎样回答？\nWhat’s the weather like?',choice(['It’s windy.','I like wind.','It comes from Greece.'],'It’s windy.'),'windy这样的形容词可以说明天气状况。','回答要描述天气，而不是喜好。',model(['What’s the weather like? — It’s hot.','hot说明天气热。'])),
 g('rain','区分形容词warm和天气动词rains','补全天气描述：天气暖和，有时下雨。',fill([blank('It ',' warm.',['is','rains']),blank('It ',' sometimes.',['rains','is rain'])],['is','rains']),'形容词warm前用is；rain作动词时，这里用rains，不说is rain。','两句话分别描述温度和降雨。',model(['It is cold. It snows sometimes.','cold是形容词；snows表示下雪。'])),
 g('person','询问人物特点并匹配回答人称','问新同学Anna是什么样的人；卡片说她很友善。',choice(['She’s friendly.','It’s hot.','She likes tea.'],'She’s friendly.'),'What’s Anna like?可以问人物特点，按材料回答，不能只理解成问长相。','Anna是谁？卡片给了她的什么特点？',model(['What’s Tom like? — He’s quiet.','quiet：安静的。用he接着说Tom。'])),
 g('object','询问物品特点','问“这个房间是什么样的？”',bank(['What’s','the room','like','Does'],'What’s the room like',3,'?'),'What’s … like?也可以问事物的特点。','把询问对象放在中间。',model(['What’s your bag like? — It’s small.','也能用来问书包的特点。'])),
 g('detail','根据材料给更具体的回答','旅行卡：温暖，但有时下雨。\n哪句把两条信息都说到了？',choice(['It’s warm, but it rains sometimes.','It’s warm every day and it never rains.','It’s always cold.'],'It’s warm, but it rains sometimes.'),'回答可以先说总体特点，再补充准确的信息。','检查温度和下雨频率两个条件。',model(['It’s often cold. It snows sometimes.','先说温度，再补充下雪的情况。'])),
 g('independent-object','撤去示范后依据物品信息回答','房间卡：大、干净。\nWhat’s the room like?',choice(['It’s big and clean.','It’s cold and windy.','I like my room.'],'It’s big and clean.'),'根据房间特点回答，不把问题改成喜好问题。','检查回答有没有描述房间。'),
 g('independent-weather','独立从情境构成完整提问','你想知道那里的春天天气怎么样。',bank(['What’s','the weather','like','in spring','Where'],'What’s the weather like in spring',4,'?'),'询问天气状况用What’s the weather like…?。','先确定你想问的是状况还是地点。')
];
unit.questions.apply=[
 q('a-source','填写明信片上的国家来源','新朋友写：I’m Brazilian.\n给他的来源句补上国家。',choice(['I come from Brazil.','I come from Brazilian.','I am Brazil.'],'I come from Brazil.'),'Brazil是国家；Brazilian在这里表示巴西人。','come from后面填国家名称。'),
 q('a-third','来源表达的第三人称形式','卡片主人是Anna，她来自法国。',fill([blank('She ','',['comes','come','is come']),blank('from ','.',['France','French'])],['comes','France']),'She comes from France.：she后用comes，from后是国家。','句子说“来自”，而不是“是法国人”。'),
 q('a-question','给复数来源信息提问','两位客人准备填写来源地。用词块问他们来自哪里。',bank(['Where','do','you','come from','are'],'Where do you come from',4,'?'),'Where do you come from?可询问一个你或你们。','come是动作词，这里不用are来提问。'),
 q('a-correction','在明确事实下否定错误来源','Dimitri来自希腊。有人问Does he come from Italy?\n补全纠正。',fill([blank('No, he ',' come from Italy.',['doesn’t','don’t']),blank('He ',' from Greece.',['comes','come'])],['doesn’t','comes']),'doesn’t后用come，肯定句he后用comes。','先否定错误国家，再说正确来源。'),
 q('a-climate','按明信片完整材料选择插图','明信片写着：It’s cold. It snows sometimes.\n选一幅能表现这段天气的图。',choice(['下雪的冬日','刮风的春日','炎热的夏日'],'下雪的冬日',{optionImages:{'下雪的冬日':image('winter'),'刮风的春日':image('windy'),'炎热的夏日':image('summer')}}),'图表现寒冷和下雪，不把sometimes改成每天。','同时看温度和天气现象。'),
 q('a-calendar','按月份顺序整理旅行卡','旅行卡依次记录：六月、七月、八月。\n把月份按这个顺序拼好。',bank(['June','July','August','April'],'June July August',3,''),'June、July、August分别是六、七、八月。','先认月份，再确认先后。'),
 q('a-date','识别20th–31st中的特殊词尾','给明信片日期配对。',match([['21st','twenty-first'],['22nd','twenty-second'],['23rd','twenty-third'],['31st','thirty-first']]),'复合序数词的末尾随最后一个数变化。','留意first、second、third的词尾。'),
 q('a-send','独立整合来源和天气信息','寄信人写：I come from Norway. It’s warm today.\n选出与这张明信片相符的介绍。',choice(['来自挪威，今天温暖','来自瑞典，今天温暖','来自挪威，今天寒冷'],'来自挪威，今天温暖'),'人物来源与当天天气都要依据本张明信片。','不要只核对其中一个条件。')
];
// Small worked examples precede new source/nationality forms. None is the current answer.
const applicationModels={
 'source':model(['I’m English. I come from England.','English说国籍，England是地方名称。']),
 'third':model(['He’s Italian. He comes from Italy.','he后用comes，from后说国家。']),
 'question':model(['Where do they come from?','他们来自哪里？']),
 'correction':model(['She doesn’t come from France. She comes from Spain.','否定用doesn’t＋come；肯定用comes。']),
 'date':model(['20th · twentieth / 30th · thirtieth','第二十／第三十；整十序数词结尾是-tieth。'])
};
for(const item of unit.questions.apply){const demo=applicationModels[item.id.replace('u5152-v1-a-','')];if(demo)item.workshop={model:demo};}
unit.questions.exam=[
 q('e-scale','独立区分气候与天气','“这个地区长期的冷热、降雨特点”应选哪个词？',choice(['climate','weather','country'],'climate'),'climate表示长期气候特点。'),
 q('e-months','抽样未在前区配对的月份','给月份配对。',match([['January','一月'],['April','四月'],['August','八月'],['November','十一月']]),'月份名称首字母大写。'),
 q('e-countries','抽样其余国家词义','把国家与名称连起来。',match([['Italy','意大利'],['Russia','俄罗斯'],['Spain','西班牙'],['the U.S.','美国']]),'国名表示国家，不能与国籍词混写。'),
 q('e-origin','综合原文人物来源与评价','课文中的Dimitri怎样介绍自己的国家？',choice(['来自希腊，气候宜人','来自德国，气候宜人','来自希腊，全年严寒'],'来自希腊，气候宜人'),'这是原文明确给出的两项信息。'),
 q('e-autumn','独立理解同季不同月份','按课文补全秋季记录。',fill([blank('September and October: always ','',['warm','cold']),blank('November: often ','',['cold','hot'])],['warm','cold']),'原文区分了九、十月与十一月。'),
 q('e-winter','不把课文频率绝对化','哪一张冬季记录符合课文？',choice(['常常冷，有时下雪','总是热，从不下雪','每天都下雪'],'常常冷，有时下雪'),'often cold、snows sometimes，不等于每天都下雪。'),
 q('e-frequency','辨认有时的表达','点出“有时”。',{type:'locate',fragments:['It ',{value:'rains'},' ',{value:'sometimes'},'.'],options:['rains','sometimes'],answer:'sometimes'},'sometimes表示有时。'),
 q('e-weather','独立构成状况提问','问“今天的天气怎么样？”',bank(['What','is','the weather','like today','Does'],'What is the weather like today',4,'?'),'What is与What’s在这里意义相同。'),
 q('e-climate','独立区分What’s和Where','补全：你们国家的气候怎么样？',fill([blank('',' the climate',['What’s','Where’s']),blank('',' in your country?',['like','from'])],['What’s','like']),'What’s … like?问状况；Where问地点。'),
 q('e-person','独立理解人物特点与代词','Tom很安静。别人问What’s Tom like?，怎样回答？',choice(['He’s quiet.','It’s quiet.','He likes coffee.'],'He’s quiet.'),'用he指Tom，用quiet说他的特点。'),
 q('e-object','独立构成事物特点提问','想了解新书包是什么样的。',bank(['What’s','your new bag','like','Where'],'What’s your new bag like',3,'?'),'把新书包作为询问对象。'),
 q('e-detail','依据天气材料准确回答','天气卡：今天温暖，没有下雨。\nWhat’s the weather like today?',choice(['It’s warm. It isn’t raining.','It’s cold. It’s snowing.','I like warm weather.'],'It’s warm. It isn’t raining.'),'用材料中的温度和降雨信息回答。'),
 q('e-form','独立使用形容词与天气动词','说“天气很热，太阳每天照耀”。',fill([blank('It ',' hot.',['is','shines']),blank('The sun ',' every day.',['shines','is shine'])],['is','shines']),'hot前用is；the sun作第三人称单数，动词用shines。'),
 q('e-like','不把询问状况误作喜好','What’s the climate like? 哪句回答切题？',choice(['It’s very pleasant.','Yes, I like it.','I come from Sweden.'],'It’s very pleasant.'),'这里like不是让你回答喜欢不喜欢。'),
 q('e-third','来源与国籍的不同句式','他是希腊人；他来自希腊。',fill([blank('He ',' Greek.',['is','comes']),blank('He ',' from Greece.',['comes','is come'])],['is','comes']),'国籍用be；来自用come from。'),
 q('e-plural','复数来源与国籍','我们是英格兰人，来自英格兰。按卡片补全。',fill([blank('We ',' English.',['are','is']),blank('We ',' from England.',['come','comes'])],['are','come']),'we后用are与come。England特指英格兰。'),
 q('e-do','独立询问两人的来源','用词块问：他们来自哪里？',bank(['Where','do','they','come from','are'],'Where do they come from',4,'?'),'they的来源问句用do。'),
 q('e-does','第三人称来源问句与动词还原','补全：她来自西班牙吗？',fill([blank('',' she',['Does','Do','Is']),blank('',' from Spain?',['come','comes'])],['Does','come']),'Does后面的动词用原形come。'),
 q('e-negative','独立否定错误来源','他来自巴西。用词块说“他不来自挪威”。',bank(['He','doesn’t','come from','Norway','comes from','don’t'],'He doesn’t come from Norway',4),'doesn’t后用come，不保留comes。'),
 q('e-nationality','从来源信息转为国籍回答','卡片写：She comes from the Netherlands.\nWhat nationality is she?',choice(['She’s Dutch.','She’s the Netherlands.','She comes Dutch.'],'She’s Dutch.'),'Dutch是荷兰人的国籍表达。'),
 q('e-ordinal','独立辨认日期序数词','“第二十一”怎样写？',choice(['twenty-first','twenty-one','twenty-oneth'],'twenty-first'),'21st是twenty-first，不能写成基数词或oneth。'),
 q('e-transfer','整合新材料且避免推断','另一张旅行卡写：I come from Germany. It rains sometimes in spring.\n哪句介绍准确？',choice(['来自德国，春季有时下雨','来自希腊，春季有时下雨','来自德国，春季每天都下雨'],'来自德国，春季有时下雨'),'新材料的国家与频率都要保留，不能套用Dimitri的来源。')
];
const modelData=[['I’m American.','I come from the U.S.','us','twentieth'],['He’s Brazilian.','He comes from Brazil.','brazil','twenty-first'],['She’s Dutch.','She comes from the Netherlands.','netherlands','twenty-second'],['We’re English.','We come from England.','england','twenty-third'],['They’re French.','They come from France.','france','twenty-fourth'],['You’re German.','You come from Germany.','germany','twenty-fifth'],['He’s Greek.','He comes from Greece.','greece','twenty-sixth'],['You’re Italian.','You come from Italy.','italy','twenty-seventh'],['We’re Norwegian.','We come from Norway.','norway','twenty-eighth'],['They’re Russian.','They come from Russia.','russia','twenty-ninth'],['She’s Spanish.','She comes from Spain.','spain','thirtieth'],['I’m Swedish.','I come from Sweden.','sweden','thirty-first']];
unit.learning.MODELS=modelData.map(([en,cn,art,ordinal],i)=>({en,cn,image:image(art),number:(i+20)+({21:'st',22:'nd',23:'rd',31:'st'}[i+20]||'th')+' · '+ordinal}));
unit.learning.WRITING_A=['We come from Germany, but Dimitri ___ from Greece.','I like cold weather, but he ___ warm weather.','He comes from the U.S., but she ___ from England.','She doesn’t like the winter, but she ___ the summer.','I come from Norway, but you ___ from Spain.','Stella comes from Spain, but Hans and Karl ___ from Germany.','We don’t come from Spain. We ___ from Brazil.'];
unit.learning.WRITING_B=['she / (England) / the U.S.','they / (France) / England','he / (France) / Germany','he / (Italy) / Greece','they / (Greece) / Italy','they / (Brazil) / Norway','they / (Norway) / Greece','she / (Italy) / Spain','she / (Norway) / France','he / (the U.S.) / Brazil'];
unit.source={text:textSource,grammar:grammarSource};core.unit5152=unit;
if(root.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);
