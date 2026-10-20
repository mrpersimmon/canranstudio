(function(root){
'use strict';
const base='/assets/unit35-36/',image=n=>base+n+'.svg',source='《新概念英语智慧版1》纸页70–73（PDF103–106）';
const words=[
 ['photograph','照片','/ˈfəʊtəɡrɑːf/'],['village','村庄','/ˈvɪlɪdʒ/'],['valley','山谷','/ˈvæli/'],['between','在……之间','/bɪˈtwiːn/'],['hill','小山','/hɪl/'],['another','另一个','/əˈnʌðə/'],['wife','妻子','/waɪf/'],['along','沿着','/əˈlɒŋ/'],['bank','本课：河岸','/bæŋk/'],['water','水','/ˈwɔːtə/'],['swim','游泳','/swɪm/'],['building','建筑物；大楼','/ˈbɪldɪŋ/'],['park','公园','/pɑːk/'],['into','进入','/ˈɪntuː/'],['beside','在……旁边','/bɪˈsaɪd/'],['off','离开','/ɒf/']
].map(([en,cn,ph])=>({en,cn,ph,image:image(en),source,phoneticSource:'教材英式音标；into取Cambridge独立读词形式',...({wife:{example:'my wife and I'},another:{example:'another photograph'},bank:{example:'the banks of the river'},between:{example:'between two hills'}}[en]||{})}));
const text=[
 ['This is a photograph of our village.','这是我们村庄的一张照片。'],['Our village is in a valley.','我们的村庄坐落在一个山谷里。'],['It is between two hills.','它位于两座小山之间。'],['The village is on a river.','村庄靠近一条河。'],
 ['Here is another photograph of the village.','这是村庄的另一张照片。'],['My wife and I are walking along the banks of the river.','我和妻子正沿着河岸走。'],['We are on the left.','我们在照片的左边。'],['There is a boy in the water.','水里有一个男孩。'],['He is swimming across the river.','他正在横渡这条河。'],
 ['Here is another photograph.','这是另一张照片。'],['This is the school building.','这是学校的楼房。'],['It is beside a park.','它在一个公园旁边。'],['The park is on the right.','公园在照片的右边。'],['Some children are coming out of the building.','一些孩子正从楼里出来。'],['Some of them are going into the park.','他们中的一些正走进公园。']
].map(([text,cn],i)=>({who:'narrator',person:'narrator',text,cn,source,sourceId:'L35-'+(i+1)}));
const q=(id,target,prompt,extra,why)=>({id:'u3536-v1-'+id,target,prompt,source,decision:target,hint:'',explanation:'',...extra,distractorRationale:why});
const choice=(id,target,prompt,options,answer,why,extra={})=>q(id,target,prompt,{options,answer,...extra},why);
const match=(id,target,prompt,pairs,why)=>q(id,target,prompt,{type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i)))},why);
const cloze=(id,target,prompt,blanks,answers,why,extra={})=>q(id,target,prompt,{type:'cloze',blanks:blanks.map(([before,after,options])=>({before,after,options})),answer:JSON.stringify(answers),...extra},why);
const order=(id,target,prompt,tokens,why)=>q(id,target,prompt,{type:'order',tokens,answer:tokens.join(' ')},why);
const locate=(id,target,prompt,fragments,answer,why)=>q(id,target,prompt,{type:'locate',fragments,options:fragments.filter(v=>typeof v==='object').map(v=>v.value),answer},why);
const pics=(a,b,c)=>({options:['照片一','照片二','照片三'],optionImages:Object.fromEntries([a,b,c].map((n,i)=>[['照片一','照片二','照片三'][i],image(n)])),optionImageAlts:Object.fromEntries([a,b,c].map((n,i)=>[['照片一','照片二','照片三'][i],{'into-scene':'人沿箭头从门外走向店内','out-scene':'人沿箭头从店内走向门外','man-out-scene':'男士沿箭头从店内走向门外','woman-into-scene':'女士沿箭头从门外走向店内','beside-scene':'孩子坐在妈妈旁边','across-scene':'两人沿箭头从街道一侧走向另一侧','along-scene':'猫沿着墙的长度方向跑','off-scene':'孩子沿向下箭头离开树枝','between-scene':'一个人在两个警察中间行走','near-scene':'女孩坐在树附近','under-scene':'飞机正从桥洞下方飞过','over-scene':'飞机从桥梁上空飞过','on-scene':'一家人坐在草地上','in-scene':'男士和女士坐在客厅内阅读'}[n]]))});
const questions={
 listen:[
  match('places','首次区分照片、村庄和山谷','把英文和意思配起来。',[['photograph','照片'],['village','村庄'],['valley','山谷']],'三个新概念，不再整组反向翻译。'),
  match('landscape','区分山、岸与水','给风景里的词语配上意思。',[['hill','小山'],['bank','河岸'],['water','水']],'bank以本课河岸义出现，不教作银行；水不是岸。'),
  match('more-words','区分建筑、公园和游泳','再认三个新词。',[['building','建筑物'],['park','公园'],['swim','游泳']],'三项不同新词义，动作与地点按本课词表介绍。'),
  choice('another','理解another的新增一个','Here is another photograph.\n这里说的是哪一张？',['另一张照片','刚才那张照片','全部照片'],'另一张照片','another不是again，也不是所有；本课照片语境限制含义。'),
  choice('wife','从语境识别妻子关系','My wife and I are walking.\nwife 在这里指谁？',['说话人的妻子','说话人的女儿','说话人的妈妈'],'说话人的妻子','关系来自英文，不从头像猜测；不补造姓名。')
 ],
 roles:[
  choice('on-river','理解村庄临河而非在水面','The village is on a river.\n这句介绍村庄在哪里？',['在河边','浮在河面上','在河水里'],'在河边','on依语境解释；与上课boats on the river明确区别。'),
  locate('we','跨句定位We所指人物','点出 We 所指的完整人物词组。',[{value:'My wife and I'},' are walking along ',{value:'the banks of the river'},'.\nWe are on ',{value:'the left'},'.'],'My wife and I','完整人物词组作选区；地点与人不能混同。'),
  choice('school-map','同时读懂beside与right','The school building is beside a park.\nThe park is on the right.\n哪张照片符合介绍？',['照片一','照片二','照片三'],'照片二','三张同规格相片分别为左右反向、正确相邻、河流相隔；不能靠物品存在猜答案。',{optionImages:{'照片一':image('school-left-park'),'照片二':image('school-right-park'),'照片三':image('school-across-park')},optionImageAlts:{'照片一':'公园在左，学校在右，二者相邻','照片二':'学校在左，公园在右，二者相邻','照片三':'学校与右侧公园之间隔着一条宽河'}}),
  locate('them','跨句找到some of them的对象','点出 them 指的那群人。',[{value:'Some children'},' are coming out of ',{value:'the building'},'.\nSome of them are going into ',{value:'the park'},'.'],'Some children','对象为前句孩子；不是building或park，也不推断全部都进公园。')
 ],
 observe:[
  choice('into','读into，选择走进的方向','The man is going into the shop.\n选择对应的照片。',pics('man-out-scene','beside-scene','into-scene').options,'照片三','相同门口图保持尺度；必须判断内外与动作方向，不能只认shop。',pics('man-out-scene','beside-scene','into-scene')),
  cloze('along-across','区分沿着与横穿','按图为两段路线选词。',[['They are walking ',' the street.',['across','along','into']],['The cats are running ',' the wall.',['along','across','under']]],['across','along'],'两种相反路线条件，图中箭头分别跨过宽度、顺着长度；不捆成整句选项。',{image:image('routes-compare'),imageAlt:'上图两人横穿街道，下图两只猫沿墙的长度方向跑'}),
  choice('between','读between two hills找村庄','The village is between two hills.\n选择对应的照片。',['照片一','照片二','照片三'],'照片一','三个村庄分别在两山中间、单山旁、山顶；房屋与山同等待遇。',{optionImages:{'照片一':image('village-between'),'照片二':image('village-beside'),'照片三':image('village-top')},optionImageAlts:{'照片一':'房屋在两座小山之间的低处','照片二':'房屋在一座小山旁边','照片三':'房屋在一座小山的顶部'}}),
  choice('off','理解off表示离开接触处','The children are jumping off the branch.\n选择对应的照片。',pics('on-scene','off-scene','near-scene').options,'照片二','树枝是出发处，离开后下降；不等于坐在草地或树旁。只观察教材动作。',pics('on-scene','off-scene','near-scene'))
 ],
 be:[
  choice('where-purpose','辨别问去向与问动作','想问“那个男人正在往哪里走”，该选哪一句？',['Where is the man going?','What is the man doing?','Who is the man?'],'Where is the man going?','真正比较提问目的；不能用一个完整动作回答就声称唯一决定Where。'),
  cloze('where-be','Where问句的单复数be','为两句问话分别选词。',[['Where ',' the boy swimming?',['is','are','am']],['Where ',' the children going?',['are','is','am']]],['is','are'],'必要的单复数对比，动作已有ing，真正检验be选择。'),
  locate('place-phrase','从完整回答中找地点信息','回答里，点出表示“在哪里”的完整词组。',['She is ',{value:'sitting'},' ',{value:'near the tree'},'.'],'near the tree','动作sitting与位置near the tree分开；不随意拆成near和tree。'),
  cloze('double','比较双写与直接加ing','分别填入 swim 和 walk 的 -ing 形式。',[['He is ',' across the river.',['swimming','swiming','swim']],['They are ',' along the banks.',['walking','walkking','walk']]],['swimming','walking'],'swim双写m，walk不满足本课条件；不能教成所有词都双写。')
 ],
 trans:[
  order('where-single','组织单数Where动作问句','那个男孩正在什么地方游泳？',['Where','is','the','boy','swimming?'],'撤去整句支持组织Where+is+主语+动作；不是重做What问句。'),
  order('going-into','组织复数动作与去向','这些孩子正在走进公园。',['The','children','are','going','into','the','park.'],'从照片阅读到组织描述；不要求先拼完又拆成多个更简单任务。')
 ],
 exam:[
  cloze('final-geography','两山之间与临河的地理关系','按原文补全村庄介绍。',[['Our village is ',' two hills.',['between','under','into']],['The village is ',' a river.',['on','in','under']]],['between','on'],'抽样复习两个不同关系；on须和主语village一起解释，不是村庄浮在水面。'),
  choice('final-words','抽样区分本课地貌与河岸词','选出照片里绿色低处的名称。',['valley','hill','bank'],'valley','用新视角地形图抽样词义；明确标示谷底，两侧山与岸是干扰。',{image:image('valley'),imageAlt:'两座小山之间的低处有一个中性指示点'}),
  choice('final-we','We指说话者和妻子','My wife and I are walking along the banks. We are on the left.\n谁在照片左边？',['说话人和妻子','只有说话人','说话人和男孩'],'说话人和妻子','间隔复习第一人称复数指代，不能看画中所有人就选全部。'),
  choice('final-direction-text','区分出来的地点与进去的地点','Some children are coming out of the building.\nSome of them are going into the park.\n哪条记录符合原文？',['从楼里出来，其中一些走进公园。','从公园出来，其中一些走进楼里。','从楼里出来，全都离开公园。'],'从楼里出来，其中一些走进公园。','结合两句读出起点终点；不靠只认park或building。'),
  choice('final-some','不把some of them扩大为全部','Some of them are going into the park.\n这句话有没有明确说“他们全部进公园”？',['没有，只说了其中一些。','有，明确说了全部。','有，说所有人都离开公园。'],'没有，只说了其中一些。','只问原文是否明说全部，不从some推出剩下的人一定不去。'),
  choice('final-out','读out of，选择相反的门口方向','The woman is going out of the shop.\n选择对应的照片。',pics('woman-into-scene','out-scene','beside-scene').options,'照片二','从前面into反向条件到out of；同场景只改变方向，必要的语义对比。',pics('woman-into-scene','out-scene','beside-scene')),
  cloze('final-route','沿河岸与横渡河流','按课文，分别补全夫妻和男孩的路线。',[['My wife and I are walking ',' the banks of the river.',['along','across','into']],['He is swimming ',' the river.',['across','along','beside']]],['along','across'],'将街／墙对比迁移到岸／河；要结合每句对象。'),
  cloze('final-beside-between','旁边与两个对象之间','按两幅图补全位置。',[['He is sitting ',' his mother.',['beside','between','under']],['The man is walking ',' two policemen.',['between','beside','into']]],['beside','between'],'两图不同参照条件，不将between绝对限定只能两者，范围限本课。',{image:image('positions-compare'),imageAlt:'上图男孩坐在妈妈旁边，下图一个人在两个警察之间行走'}),
  choice('final-off','理解离开树枝的动作','The children are jumping off the branch.\noff 在这里表示什么？',['从树枝上离开、向下跳','坐在树枝上不动','走进树枝里面'],'从树枝上离开、向下跳','间隔抽样检验off义，不要求模仿动作。'),
  cloze('final-over-under','区分飞机从桥下和桥上空经过','按图补全两架飞机的位置。',[['1. The aeroplane is flying ',' the bridge.',['under','over','into']],['2. The aeroplane is flying ',' the bridge.',['over','under','along']]],['under','over'],'同型飞机、同一桥分别在拱下与上空，不能只看到plane就猜over。',{image:image('flights-compare'),imageAlt:'照片1中飞机从桥洞下方飞过；照片2中飞机在桥梁上空飞行'}),
  cloze('final-on-in','草地表面与客厅内部','按图选出合适的位置词。',[['They are sitting ',' the grass.',['on','in','under']],['They are reading ',' the living room.',['in','on','off']]],['on','in'],'两种不同空间关系；与村庄on a river语境义明确区分。',{image:image('rest-compare'),imageAlt:'上图一家人坐在草地上；下图两位成人在客厅内阅读'}),
  locate('final-near','从新回答中定位near地点信息','点出回答中表示位置的完整词组。',['Where is the boy sitting?\nHe is ',{value:'sitting'},' ',{value:'near the tree'},'.'],'near the tree','由she换成boy不称新能力，作为Where回答的间隔复习只保留一项。'),
  choice('final-question-purpose','选择询问位置的问句','你知道他们正在读书，想问“在哪里读”，该怎么问？',['Where are they reading?','What are they doing?','Who are they?'],'Where are they reading?','信息已知/未知决定提问，不只判断语法对错。'),
  cloze('final-is-are','Where问句单复数核验','分别补全问句。',[['Where ',' the man standing?',['is','are','am']],['Where ',' the cats running?',['are','is','am']]],['is','are'],'间隔复习明确单数／复数，不把现成词块算作be选择。'),
  order('final-where-plural','独立组织复数Where动作问句','这些猫正在哪里跑？',['Where','are','the','cats','running?'],'从单数示范到复数组织；属于有支架的组织，不声称独立写句。'),
  cloze('final-spelling','双写与去不发音e的边界','分别填入 run 和 come 的 -ing 形式。',[['The cats are ',' along the wall.',['running','runing','run']],['The children are ',' out of the building.',['coming','comeing','comming']]],['running','coming'],'新双写规则迁移到run，与已教come删e比较，防所有词都双写。')
 ]
};
const gallery=[
 ['one','into-scene','The man is going into the shop.','那个男人正走进商店。','man going','into the shop'],
 ['two','out-scene','The woman is going out of the shop.','那个女人正走出商店。','woman going','out of the shop'],
 ['three','beside-scene','He is sitting beside his mother.','他正坐在妈妈旁边。','he sitting','beside his mother'],
 ['four','across-scene','They are walking across the street.','他们正横穿街道。','they walking','across the street'],
 ['five','along-scene','The cats are running along the wall.','这些猫正沿着墙跑。','the cats running','along the wall'],
 ['six','off-scene','The children are jumping off the branch.','这些孩子正从树枝上跳下来。','the children jumping','off the branch'],
 ['seven','between-scene','The man is walking between two policemen.','那个男人正走在两位警察之间。','man standing','between two policemen'],
 ['eight','near-scene','She is sitting near the tree.','她正坐在树附近。','she sitting','near the tree'],
 ['nine','under-scene','It is flying under the bridge.','它正从桥下飞过。','it flying','under the bridge'],
 ['ten','over-scene','The aeroplane is flying over the bridge.','飞机正从桥上空飞过。','the aeroplane flying','over the bridge'],
 ['eleven','on-scene','They are sitting on the grass.','他们正坐在草地上。','they sitting','on the grass'],
 ['twelve','in-scene','The man and the woman are reading in the living room.','那个男人和那个女人正在客厅里读书。','the man and the woman reading','in the living room']
];
const definition={id:'unit35-36',version:1,mode:'classroom',title:'村庄相册探险',path:'/unit35-36/',start:'learn/words',progress:{learningKey:'canran:unit35-36:learning:v1'},objects:words,
 stages:[
 {id:'l1',title:'翻开村庄相册',activities:[['words','村庄小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
 {id:'l2',title:'三张照片的故事',activities:[['text','村庄故事相册','book'],['roles','相册小侦探','question']],required:['text','roles']},
 {id:'l3',title:'看看往哪儿走',activities:[['models','位置与路线画册','cards'],['observe','路线小侦探','question']],required:['observe']},
 {id:'l4',title:'问问在哪里',activities:[['phrases','位置问答小锦囊','book'],['be','问答发现站','question'],['trans','词块拼装台','order']],required:['be','trans']},
 {id:'l5',title:'收好村庄发现',activities:[['exam','村庄发现挑战','star'],['certificate','我的村庄相册','star']],required:['exam']}
 ],questions,learning:{WORDS:words,PEOPLE:{narrator:{name:''},man:{name:'叙述者',image:image('man')},'wife-portrait':{name:'妻子',image:image('wife-portrait')}},DIALOGUE:text,
 PHRASES:[['Where is the boy swimming?','问正在游泳的位置。','swim'],['He’s swimming across the river.','He’s = He is','swim'],['Where are the children going?','问孩子们正往哪里去。','photo-school'],['They’re going into the park.','They’re = They are','photo-school']].map(([en,cn,n])=>({en,cn,image:image(n)})),
 GALLERY:gallery.map(([numberLabel,art,en,cn],i)=>({numberLabel:(i+1)+' · '+numberLabel,en,cn,image:image(art)})),
 WRITING_A:[['Swim','He is __________ across the river.'],['Sit','She is __________ on the grass.'],['Run','The cat is __________ along the wall.']],WRITING_B:gallery.map(a=>[a[4],a[5]])
 }};
definition.learning.FEEDBACK=root.CanranCore.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK;
root.CanranCore.unit3536=definition;
if(root.document?.documentElement.dataset.unit===definition.id)root.CanranCore.learningContext=definition;
})(globalThis);

// Keep the actual v1 predecessor above intact for migration and old certificates.
(function(core){
'use strict';
const old=core.unit3536;core.unit3536LegacyDefinition=JSON.parse(JSON.stringify(old));
const source='课本纸70–73／PDF103–106；语法练习册纸95–99／PDF109–113';
const grammarSource='同步导学纸63–66／PDF77–80，Grammar纸64–65／PDF78–79；'+source;
const unit={id:'unit35-36',version:1,mode:'classroom',contentRevision:'village-five-zones-v1',legacyEdition:'unit35-36-completion-v1',title:'村庄相册探险',path:'/unit35-36/',start:'learn/words',progress:old.progress,learning:old.learning,objects:old.objects,questions:{},
stages:[{id:'l1',title:'翻开村庄相册',activities:[['words','村庄小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},{id:'l2',title:'三张照片的故事',activities:[['text','村庄故事相册','book'],['roles','相册小侦探','question']],required:['text','roles']},{id:'l3',title:'看懂位置与路线',activities:[['grammar','语法小工坊','speech']],required:['grammar']},{id:'l4',title:'问问在哪里',activities:[['apply','去向问答站','heart']],required:['apply']},{id:'l5',title:'收好村庄发现',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}],
routeAliases:{'learn/phrases':'learn/grammar','learn/observe':'learn/grammar','learn/be':'learn/apply','learn/models':'learn/apply','learn/trans':'learn/apply'},
reward:{edition:'village-five-zones-v1',title:'细心村庄观察员',lesson:'Lesson 35–36',scene:'/assets/unit35-36/keepsake-story-v1.webp',alt:'夫妻翻看村庄、河岸和学校的三张照片',color:'#57734D',zones:[['listen','单词寻宝'],['roles','相册小侦探'],['grammar','语法小工坊'],['apply','去向问答站'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
const choice=(options,answer,material='')=>({options,answer,material});
const blank=(before,after,options)=>({before,after,options});
const fill=(blanks,answers,material='')=>({type:'cloze',blanks,answer:JSON.stringify(answers),material});
const q=(id,target,prompt,input,explanation)=>{const{material,...fields}=input;return{id:'u3536-five-'+id,target,prompt,source,...fields,...(material?{display:{title:prompt,material}}:{}),explanation,hint:''};};
const g=(id,target,prompt,input,rule,demo)=>({...q('g-'+id,target,prompt,input,rule),source:grammarSource,workshop:{rule,model:{lines:demo}}});
unit.questions.listen=old.questions.listen;unit.questions.roles=old.questions.roles;
unit.questions.grammar=[
g('between','between表示在明确参照物之间','一只猫坐在两把椅子的中间。补全句子。',choice(['between','beside','under'],'between','The cat is sitting ___ two chairs.\nchair：椅子'),'本题以两把椅子为参照，猫在它们之间，用between。不要把本课例子扩成所有语境都只能用于两者。',[['Louise sat between Jack and Lily.','导学原例：路易丝坐在杰克和莉莉之间。两个人分别在她两侧。']]),
g('along','along表示顺着长度方向','这句话中的along说明怎样的路线？',choice(['顺着墙的长度方向跑。','从墙的一边穿到另一边。','跑到墙的下面。'],'顺着墙的长度方向跑。','The cats are running along the wall.'),'along沿着参照物延伸的方向；across表示从一边到另一边。',[['They are walking along the river.','导学原例：他们正沿着河走。路线顺着河岸延伸，不是横渡河流。']]),
g('beside','beside表示旁边','椅子放在桌子旁边，两者并排。补全句子。',choice(['beside','under','into'],'beside','The chair is ___ the table.\nchair：椅子'),'beside表示在旁边；本题说明并排，不是桌下，也不是走进去的路线。',[['The dog is sitting beside an old man.','导学原例：狗正坐在一位老人旁边。']]),
g('into-in','区分进入的动作与在里面的状态','这两句分别说明什么？',choice(['男孩正在走进房间；女孩坐在房间里面。','男孩正在走出房间；女孩坐在房间里面。','男孩已经坐在房间里；女孩正在走进来。'],'男孩正在走进房间；女孩坐在房间里面。','The boy is going into the room.\nThe girl is sitting in the room.'),'第一句into强调由外到内的移动，第二句in说明在里面。in有时也可表达进入，不把go in等合法表达判为普遍错误。',[['He jumped into the river.','导学原例：他跳进河里，into强调进入。这里只读例句，不模仿动作。'],['There are some clothes in the case.','导学原例：箱子里有一些衣服。in说明衣服在箱内。case：箱子。']]),
g('come-in','把动词和后面的方向词一起理解','老师已经在教室里，对站在门外的孩子说这句话。老师请孩子怎样做？',choice(['走进来。','走出去。','待在门口。'],'走进来。','Come in.'),'Come in.表示进来，in和come一起表达方向；这里无需在in后补一个地点名词。',[['Go out.','从屋内走出去。理解动词和后面的方向词，需要看所在的位置和移动方向。']]),
...old.questions.observe];
unit.questions.apply=[...old.questions.be,...old.questions.trans,
q('a-boundary','撤去示范后区别在里面、进入与出去','为三条完整表达配上意思。',{type:'match',pairs:[{id:'0',en:'sit in the room',cn:'坐在房间里面'},{id:'1',en:'go into the room',cn:'走进房间'},{id:'2',en:'go out of the room',cn:'走出房间'}],answer:JSON.stringify(['0','1','2'])},'in表示所在位置，into和out of分别表示进入与离开；不是只看room就选同一个意思。')];
unit.questions.exam=[...old.questions.exam,
q('e-boundary','独立区分容器内状态与进入容器动作','哪条记录符合这两句？',choice(['猫正跳进箱子；球已经在箱子里面。','猫正跳出箱子；球已经在箱子里面。','猫已经坐在箱子里；球正跳进箱子。'],'猫正跳进箱子；球已经在箱子里面。','The cat is jumping into the box.\nThe ball is in the box.'),'into强调猫由外到内，in在第二句说明球已经在箱内；不把in的其他合法用法当错误。'),
q('e-come-out','独立依据说话人位置理解动词加方向词','妈妈已经在屋外的花园里，对仍在屋内的孩子说这句话。她请孩子怎样做？',choice(['从屋里出来，到花园这边。','从花园走回屋里。','一直待在屋里。'],'从屋里出来，到花园这边。','Come out.'),'妈妈在外、孩子在内，Come out.请孩子从里面出来，朝说话人这边移动。')];
unit.taskSessions=Object.fromEntries(unit.reward.zones.map(z=>[z.id,'five-zones-v1']));
const previous={listen:['listen'],roles:['roles'],grammar:['observe'],apply:['be','trans'],exam:['exam']};
unit.taskPredecessors=Object.fromEntries(Object.entries(previous).map(([id,ids])=>[id,ids.map(prior=>({key:'unit3536-'+prior+'-practice/v1',questions:old.questions[prior]}))]));
core.unit3536=unit;if(globalThis.document?.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis.CanranCore);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit3536,excerpts={"u3536-v1-final-geography":[0,1,2,3],"u3536-v1-final-route":[4,5,6,7,8]},speakers={"narrator":""};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 35',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
