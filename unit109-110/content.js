(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit109-110/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页222–225／PDF255–258',grammarSource='《同步导学》Grammar纸页185–186／PDF199–200；《语法练习册》纸页314–320／PDF328–334';
const rows=[['idea','主意','/aɪˈdɪə/','idea'],['a little','少许（修饰不可数名词）','/ə ˈlɪtl/','a-little'],['teaspoonful','一满茶匙的量','/ˈtiːspuːnfʊl/','teaspoonful'],['less','更少的（数量）','/les/','less'],['a few','几个（修饰可数名词）','/ə fjuː/','a-few'],['pity','遗憾','/ˈpɪti/','pity'],['instead','代替','/ɪnˈsted/','instead'],['advice','建议；忠告','/ədˈvaɪs/','advice'],['most','最多的','/məʊst/','most'],['least','最少的（本课数量）','/liːst/','least'],['best','最好的','/best/','best'],['worse','更坏的；更差的','/wɜːs/','worse'],['worst','最坏的；最差的','/wɜːst/','worst'],['much','许多（修饰不可数名词）','/mʌtʃ/','much'],['many','许多（修饰可数名词）','/ˈmeni/','many'],['little','很少（数量）','/ˈlɪtl/','little'],['few','很少几个','/fjuː/','few'],['more','更多的','/mɔː/','more'],['fewer','更少的（可数）','/ˈfjuːə/','fewer'],['fewest','最少的（可数）','/ˈfjuːɪst/','fewest'],['better','更好的；更好地','/ˈbetə/','better'],['well','好地；身体好的','/wel/','well'],['ill','生病的；不舒服的','/ɪl/','ill'],['far','远的','/fɑː/','far'],['farther','更远的（距离）','/ˈfɑːðə/','farther'],['further','更远的（距离）','/ˈfɜːðə/','further'],['farthest','最远的（距离）','/ˈfɑːðɪst/','farthest'],['furthest','最远的（距离）','/ˈfɜːðɪst/','furthest'],['coffee','咖啡','/ˈkɒfi/','coffee'],['milk','牛奶','/mɪlk/','milk'],['sugar','糖','/ˈʃʊɡə/','sugar'],['biscuit','饼干','/ˈbɪskɪt/','biscuit'],['empty','空的','/ˈempti/','empty'],['half','一半','/hɑːf/','half'],['enough','足够的；足够地','/ɪˈnʌf/','enough']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit109-110',version:1,contentRevision:'coffee-quantity-v1',mode:'classroom',title:'咖啡桌上的数量',path:'/unit109-110/',start:'learn/words',progress:{learningKey:'canran:unit109-110:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识数量词语',activities:[['words','数量小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进咖啡时间',activities:[['text','咖啡时间小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清多少与比较',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'分享与核对数量',activities:[['apply','数量小帮手','give']],required:['apply']},
{id:'l5',title:'完成数量挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'coffee',storyQuestion:'Jane喝咖啡时配着吃什么？',completionTitles:{listen:'数量词语认清啦！',roles:'咖啡时间故事读懂啦！',grammar:'多少与比较说清啦！',apply:'分享的数量核对啦！',exam:'数量挑战完成！'},reward:{edition:'coffee-quantity-v1',title:'数量表达小达人',lesson:'Lesson 109–110',scene:'/assets/unit109-110/keepsake-story-v1.webp',alt:'Charlotte给Jane递上饼干',color:'#9d805a',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','数量小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={charlotte:'Charlotte',jane:'Jane'};
unit.learning.DIALOGUE=[
['charlotte','Shall I make some coffee, Jane?','Jane，我来煮点咖啡好吗？'],
['jane','That’s a good idea, Charlotte.','这是个好主意，Charlotte。'],
['charlotte','It’s ready. Do you want any milk?','咖啡好了。你要放点牛奶吗？'],
['jane','Just a little, please.','请稍加一点。'],
['charlotte','What about some sugar? Two teaspoonfuls?','加点糖怎么样？两茶匙行吗？'],
['jane','No, less than that. One and a half teaspoonfuls, please. That’s enough for me.','不，再少一些。请放一勺半。那对我已足够了。'],
['jane','That was very nice.','太好了。'],
['charlotte','Would you like some more?','你再来点儿吗？'],
['jane','Yes, please.','好的，请再来一点。'],
['jane','I’d like a cigarette, too. May I have one?','我还想抽支烟。可以给我一支吗？'],
['charlotte','Of course. I think there are a few in that box.','当然可以。我想那个盒子里有一些。'],
['jane','I’m afraid it’s empty.','恐怕盒子是空的。'],
['charlotte','What a pity!','真遗憾！'],
['jane','It doesn’t matter.','没关系。'],
['charlotte','Have a biscuit instead. Eat more and smoke less!','那就吃块饼干吧。多吃点儿，少抽点儿！'],
['jane','That’s very good advice!','这是极好的忠告啊！']
].map(([who,text,cn],i)=>({id:'u109110-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u109110-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-spoon','teaspoonful的量义','哪个词表示“一满茶匙的量”？',choice(['teaspoonful','biscuit','cup'],'teaspoonful',{optionImages:{teaspoonful:image('teaspoonful'),biscuit:image('biscuit'),cup:image('cup')}}),'teaspoonful强调一满茶匙的量，不只是茶匙这个物品。'),
q('v-match','主意遗憾与替代','把三个词配好。',match([['idea','主意'],['pity','遗憾'],['instead','代替']]),'三个词分别表达想法、遗憾和替代。'),
q('v-advice','advice词义','That’s very good advice!中的advice指什么？',choice(['建议；忠告','糖的数量','装东西的盒子'],'建议；忠告'),'advice在这里是建议、忠告。'),
q('v-milk','a little的原文指代','Jane回答Just a little, please.，当时说的是哪一样？',choice(['牛奶','饼干的个数','盒子的大小'],'牛奶'),'紧接Do you want any milk?，不能移到后面的糖量。'),
q('v-less','less的当前含义','less sugar表示什么？',choice(['更少的糖','更小的糖碗','更多的糖'],'更少的糖'),'本课less比较数量，不是容器尺寸。'),
q('v-least','least的数量义','the least milk表示什么？',choice(['比较范围内最少的牛奶','最小的杯子','最多的牛奶'],'比较范围内最少的牛奶'),'少量与小容器不同，要看所比较的量。'),
q('v-quality','质量比较词义','配好这三个不同程度的词。',match([['best','最好的'],['worse','更差的'],['worst','最差的']]),'更差与最差的比较范围不同。'),
q('v-instead','定位表示替代的词','点出表示“代替”的词。',{type:'locate',fragments:['Have a ',{value:'biscuit'},' ',{value:'instead'},'.'],options:['biscuit','instead'],answer:'instead'},'instead表示换成另一种选择。')
];
unit.questions.roles=[
q('r-offer','辨认提议人','是谁先提议煮咖啡？',choice(['Charlotte','Jane','没有出现的人'],'Charlotte'),'开场是Charlotte说Shall I make some coffee?。'),
q('r-milk','区分牛奶与糖的数量','Jane对牛奶的要求是什么？',choice(['只要少许，没有给出精确茶匙数','正好两满茶匙','正好一勺半'],'只要少许，没有给出精确茶匙数'),'a little是牛奶；一勺半说的是后面的糖。'),
q('r-sugar','核对一勺半与比较基准','Charlotte提议两茶匙糖，Jane最终要求多少？',choice(['一勺半，比两勺少','两勺，完全不改','三勺，比两勺多'],'一勺半，比两勺少'),'less than that中的that指提议的两茶匙。'),
q('r-more','回应再来一些的提议','Charlotte问Would you like some more?，Jane怎样回答？',choice(['Yes, please.','No, thank you.','It’s empty.'],'Yes, please.'),'按原文回应，不把后面的空盒答语提前。'),
q('r-think','区分猜测与清点结果','I think there are a few in that box.说明什么？',choice(['Charlotte认为盒里有一些，还不是清点结果','Charlotte已经逐个数清','盒里一定有三支'],'Charlotte认为盒里有一些，还不是清点结果'),'I think保留判断，a few也不是精确数目三。'),
q('r-empty','检查结果与未知原因','Jane后来发现了什么？',choice(['盒子是空的，原因没有交代','Charlotte故意藏起了东西','Jane已经把里面的东西用光'],'盒子是空的，原因没有交代'),'报告观察结果，不添加动机或此前发生的事。'),
q('r-biscuit','教材开场问题','按课文，Jane喝咖啡时配着吃什么？',choice(['饼干','巧克力蛋糕','橘子'],'饼干'),'教材问题对应结尾的Have a biscuit instead。没有交代最终吃了几块。'),
q('r-advice','人物建议与课程任务分开','结尾的Eat more and smoke less!应怎样理解？',choice(['Charlotte在这段对话里给Jane的建议','所有学生必须照做的活动指令','Jane已经长期改变习惯的记录'],'Charlotte在这段对话里给Jane的建议'),'保留成人角色原话，不把它变成学生操作要求或已发生的长期结果。')
];
unit.questions.grammar=[
g('much-many','区分much与many','根据名词的当前用法补好两句。',fill([blank('I haven’t got','milk.',['much','many']),blank('I haven’t got','biscuits.',['many','much'])],['much','many']),'本课谈饮料总量用much，可数复数biscuits用many。','先看是在说总量还是能逐个数的物品。',model(['not much water / not many pens','water谈总量；pens可逐支数。'])),
g('few-little','few与little匹配名词','在very后选好数量词。',fill([blank('There are very','apples.',['few','little']),blank('There is very','juice.',['little','few'])],['few','little']),'few配可数复数，little配此处不可数的juice。','看两句话里的名词。',model(['very few books / very little time','少量的数量词也要匹配名词类型。'])),
g('a-few','a few强调还有一些','强调“还有几个可以借”，选合适表达。',{...fill([blank('I have','pencils to lend.',['a few','few'])],['a few']),context:'Anna has three spare pencils. She is pleased that she has some to lend.\nEmphasise the positive fact that some are available.'},'a few在这里强调确实还有一些；few会改变信息重点。','任务要强调还有一些，还是强调数量少？',model(['I have a few cards to share.','强调有一些可以分享。'])),
g('few-focus','few强调数量很少','强调数量太少、不满足当前需要。',{...fill([blank('We have','pencils for the group.',['few','a few'])],['few']),context:'Ten people each need a pencil. Only two pencils are available.\nEmphasise the shortage.'},'本题要强调不足，few符合任务；a few强调还有一些，不是同一种信息重点。','数量与需要之间有什么差距？',model(['There are few chairs, so most people must stand.','强调椅子很少。'])),
g('a-little','a little强调还有一点','强调“还有一点牛奶”，选合适表达。',{...fill([blank('There is','milk left.',['a little','little'])],['a little']),context:'Some milk remains. The speaker is glad that there is still some.\nEmphasise that some is available.'},'a little在这里肯定还有少许，不自动保证任何任务都够用。','注意说话人要强调存在还是不足。',model(['We have a little water for the plant.','表示还有一些水。'])),
g('little-focus','little强调量很少','强调剩余的量不够当前任务。',{...fill([blank('We have','water left.',['little','a little'])],['little']),context:'The activity needs 200 ml of water. Only 20 ml remains.\nEmphasise the shortage.'},'little带出很少、当前不足的重点；不是说精确为零。','少许的存在与强调不足不同。',model(['There is little time left. We must hurry.','强调时间很少。'])),
g('only','only与两词数量短语','按本课only a…结构，填入两词短语。',fill([blank('There are only','books left.',['a few','a little']),blank('There is only','milk left.',['a little','a few'])],['a few','a little']),'only a few／only a little仍可强调数量少；不能把带a永远解释成够用。','books与milk的数量类型不同。',model(['only a few pens / only a little ink','only会影响整句强调的重点。'])),
g('enough','少量不自动等于足够','有a few cards，就一定够当前任务吗？',choice(['不够，三张少于需要的六张','一定够，因为a few总表示足够','完全没有卡片'],'不够，三张少于需要的六张',{context:'“I have a few cards.” There are three cards.\nSix people each need one card.'}),'是否足够要比较实际数量与需要，不能只看a few。','需要几张，实际有几张？',model(['A little water may be enough for one small task, but not another.','少许与足够不是同一个判断。'])),
g('zero','little不能机械等同零','只看到very little water，可以把数量写成精确的0吗？',choice(['不能，需核对实际数量','可以，little永远等于0','可以，very little等于许多'],'不能，需核对实际数量'),'very little表示很少，不是精确测量值。','数量词是否已经给出了一个数字？',model(['Few seats remain.','很少座位剩下，不等于已经清点为零。'])),
g('more','more可比较数量或总量','补全“更多书”和“更多牛奶”。',fill([blank('','books',['more','manyer']),blank('','milk',['more','mucher'])],['more','more']),'many和much的比较形式都是more。','看原来的不规则变化。',model(['more pens / more water','同一个more可以跟可数复数或不可数名词。'])),
g('most','most表示范围内最多','根据三人的记录补全。',{...fill([blank('Ben has the','books of the three.',['most','more'])],['most']),context:'Anna has 2 books. May has 5 books. Ben has 8 books.\nThese are the three people being compared.'},'many／much的最高级是most，需要保留比较范围。','是在和一个人比较，还是找三人中最多？',model(['Of three jars with 100, 200 and 300 ml of water, the last has the most.','the most说明给定范围内最多。'])),
g('less-fewer','less与fewer的常规书面搭配','按本课常规书面用法表达“更少的水、更少的杯子”。',fill([blank('','water',['less','fewer']),blank('','cups',['fewer','less'])],['less','fewer']),'本课用less比较水的总量，用fewer比较可数杯子的个数。','这里修饰的中心名词分别是什么？',model(['less money / fewer coins','总量与可数物品分别表达。'])),
g('least-fewest','least与fewest的范围和搭配','按完整记录补好两个最少。',{...fill([blank('Tray A has the','milk.',['least','fewest']),blank('Tray A has the','biscuits.',['fewest','least'])],['least','fewest']),context:'All three trays:\nA: 100 ml milk and 2 biscuits.\nB: 200 ml milk and 4 biscuits.\nC: 300 ml milk and 6 biscuits.'},'little → less → least；few → fewer → fewest。比较同一项目时保留名词类型。','不要把牛奶总量和饼干个数混成同一种量。',model(['the least water / the fewest bottles','总量最少与瓶数最少分别表达。'])),
g('measure','一又二分之一后用复数计量词','按原文补好计量词。',fill([blank('One and a half','of sugar, please.',['teaspoonfuls','teaspoonful'])],['teaspoonfuls']),'一勺半大于一，这里计量名词用复数teaspoonfuls。','变化的是可数的计量词。',model(['two and a half cups of water','water本身不加复数，cups表示杯数。'])),
g('good-well','good与well的不规则比较','表达“这个主意更好；Bob画得比以前好”。',fill([blank('This idea is','than that one.',['better','gooder']),blank('Bob draws','than before.',['better','weller'])],['better','better']),'good和well都可对应better，但good描述主意，well的这个用法描述动作做得怎样。','形式相同，修饰的对象不同。',model(['This answer is good; that answer is better.','May reads well; Kim reads better.'])),
g('bad-ill','bad与ill的不规则形式','按例句要求：第一句“更差”，第二句“三天中最不舒服”。',fill([blank('This road is','than that one. (bad)',['worse','badder']),blank('Of those three days, he felt','on Tuesday. (ill)',['worst','illest'])],['worse','worst']),'本课bad／ill用worse／worst；这里只练句子表达，不由词形推断具体情况。','先分清更与给定范围内最。',model(['The weather is bad; it was worse yesterday.','That was the worst weather of the week.'])),
g('far','far的两组距离形式','根据距离记录，哪句话准确并保留两种合法形式？',choice(['B is farther/further than A; C is the farthest/furthest of the three.','A is farther/further than C; B is the farthest/furthest.','All three routes are the same distance.'],'B is farther/further than A; C is the farthest/furthest of the three.',{context:'Distances from the same starting point:\nRoute A: 1 km; Route B: 3 km; Route C: 5 km.'}),'在本课实际距离语境里，farther／further及farthest／furthest两组都保留。','比较的是同一起点的距离。',model(['far → farther / further → farthest / furthest','两组在这里都可以，不把另一组设为错误。'])),
g('rewrite','some不能推出更多或最少','只知道I’ve got some coffee.，能推出我比你多吗？',choice(['不能，还不知道你有多少','能，some就表示比别人多','能，some就表示我最少'],'不能，还不知道你有多少',{context:'Only my statement is given. Your amount is not stated.'}),'110课C／D改写加入了比较条件，原句本身没有提供那些事实。','是否知道另一个人的数量？',model(['A has 2 cups and B has 4 cups.','给出数量后才可以比较；只有“有一些”不够。'])),
g('independent-nouns','独立匹配名词数量词','根据名词用法补全。',fill([blank('How','apples are there?',['many','much']),blank('How','juice is there?',['much','many'])],['many','much']),'可数复数用many，此处juice总量用much。'),
g('independent-focus','独立区分存在与不足的重点','按两位说话人的明确意图选择。',{...fill([blank('A: We have','water left.',['a little','little']),blank('B: We have','books for the group.',['few','a few'])],['a little','few']),context:'A is glad that some water remains and wants to emphasise that some is available.\nB has two books for ten readers and wants to emphasise the shortage.'},'先核对说话人的信息重点，不能只靠一个数字机械选择。'),
g('independent-compare','独立区分比较级最高级与名词类型','按完整记录填好两处。',{...fill([blank('A has','milk than B.',['less','fewer']),blank('A has the','cups of the three.',['fewest','least'])],['less','fewest']),context:'A: 100 ml milk, 2 cups.\nB: 200 ml milk, 4 cups.\nC: 300 ml milk, 6 cups.'},'牛奶的比较用less；三组杯数中最少用fewest。'),
g('independent-far','独立组织距离比较','请用给定farther词块表达公园更远。',{...bank(['The park is','farther from our school','than the library','farthest from our school'],'The park is farther from our school than the library',3),context:'Distances from our school: park 3 km; library 1 km.\nUse farther.'},'按指定形式组织比较；further在同样距离语境也可用，并非错误。')
];
unit.questions.apply=[
q('a-recipe','把一勺半与量图对应','配方要求一勺半糖，哪幅量图相符？',choice(['A · 一满匙','B · 一满匙和半匙','C · 两满匙'],'B · 一满匙和半匙',{context:'The recipe asks for one and a half teaspoonfuls of sugar.\nEach full spoon in the diagrams represents one teaspoonful.',optionImages:{'A · 一满匙':image('spoons-one'),'B · 一满匙和半匙':image('spoons-one-half'),'C · 两满匙':image('spoons-two')}}),'一满匙加半匙等于一勺半，小于两满匙；这不是牛奶的原文数量。'),
q('a-least','比较同单位的饮料总量','三个相同量杯里，哪杯牛奶最少？',choice(['A · 100 ml','B · 200 ml','C · 300 ml'],'A · 100 ml',{context:'Three identical measuring cups:\nA: 100 ml milk; B: 200 ml milk; C: 300 ml milk.\nCompare the amounts of milk.',optionImages:{'A · 100 ml':image('milk-100'),'B · 200 ml':image('milk-200'),'C · 300 ml':image('milk-300')}}),'用同一种液体、同一单位及相同容器比较；100 ml最少。'),
q('a-enough','有几个与满足需要分开','按材料，哪句同时保留数量与需要？',choice(['We have a few cups, but not enough for everyone.','We have no cups at all.','We have enough cups for everyone.'],'We have a few cups, but not enough for everyone.',{context:'Four people each need one cup. We have three cups.'}),'有一些不等于当前够用，也不等于没有。'),
q('a-fewer','在任务中区分less与fewer','按本课常规书面用法补全。',{...fill([blank('Group A used','water than Group B.',['less','fewer']),blank('Group A used','cups than Group B.',['fewer','less'])],['less','fewer']),context:'Group A used 100 ml water and 2 cups.\nGroup B used 200 ml water and 4 cups.'},'water的总量用less，cups的个数用fewer。'),
q('a-offer','明确意愿后回应提议','你愿意再要一些水，怎样回应？',choice(['Yes, please.','No, thank you.','It is the farthest.'],'Yes, please.',{context:'A classmate asks: “Would you like some more water?”\nYou want to accept the offer.'}),'按已给的意愿回应，不能只从现有水量猜想法。'),
q('a-check','猜测后先核对实际数量','伙伴只说I think there are a few biscuits in the box.，记录数量前应该做什么？',choice(['先查看并核对盒内实际数量','直接记录恰好三块','直接记录盒子一定是空的'],'先查看并核对盒内实际数量',{context:'No one has checked the box yet.'}),'猜测不等于观察；a few也不是精确数字。'),
q('a-instead','组织明确的替代选择','伙伴同意用苹果代替饼干，用词块表达。',{...bank(['Have an apple','instead','too'],'Have an apple instead',2),context:'There are no biscuits. Your friend agrees to have an apple as the alternative.'},'instead表示替代，不是同时再添一个。'),
q('a-distance','同一起点比较远近','从同一所学校出发，哪处最远？',choice(['the station','the park','the library'],'the station',{context:'Distances from the same school:\nLibrary: 1 km; park: 3 km; station: 5 km.'}),'比较同一起点的距离，车站5 km最远；不把不同起点混在一起。')
];
unit.questions.exam=[
q('e-milk','独立核对牛奶数量','原文为牛奶给出了什么数量？',choice(['a little，没有精确茶匙数','one and a half teaspoonfuls','two teaspoonfuls'],'a little，没有精确茶匙数'),'牛奶的少许与后面糖的精确计量分开。'),
q('e-sugar','独立核对糖量与参照','Jane要求的糖量与Charlotte的提议相比怎样？',choice(['一勺半，比提议的两勺少','两勺，和提议完全相同','三勺，比提议多'],'一勺半，比提议的两勺少'),'less than that对应两勺的提议。'),
q('e-box','独立区分判断与观察','盒子的情况怎样被确认？',choice(['Charlotte先估计有一些，Jane后来发现空盒','Charlotte开始就给出精确清点数','Jane说明自己刚把盒子用空'],'Charlotte先估计有一些，Jane后来发现空盒'),'原文没有说明空盒的原因。'),
q('e-instead','独立核对教材替代物','Charlotte最后提议用什么替代？',choice(['a biscuit','an orange','a cake'],'a biscuit'),'保留原文biscuit，不补写最终吃了几块。'),
q('e-much-many','独立匹配much与many','按当前名词用法补全。',fill([blank('We haven’t got','money.',['much','many']),blank('We haven’t got','books.',['many','much'])],['much','many']),'money谈总量，books可逐本数。'),
q('e-few-little','独立匹配few与little','在very后补好数量词。',fill([blank('There are very','oranges.',['few','little']),blank('There is very','jam.',['little','few'])],['few','little']),'复数oranges用few，此处jam总量用little。'),
q('e-a-few','独立表达还有几个','强调还有一些可分享的卡片。',{...fill([blank('I have','cards to share.',['a few','few'])],['a few']),context:'The speaker has three spare cards and is glad that some are available to share.\nEmphasise that some are available.'},'按表达重点使用a few，不把它定义成固定三张。'),
q('e-few-focus','独立表达数量很少的重点','强调椅子数量不够这次活动。',{...fill([blank('We have','chairs for this group.',['few','a few'])],['few']),context:'There are two chairs for ten people.\nThe speaker wants to emphasise the shortage.'},'这道任务强调不足，不是评价另一种句子在所有场合都错。'),
q('e-little-focus','独立表达很少但不等于零','只剩一小匙水，哪项准确？',choice(['There is very little water, but it is not zero.','There is no water at all.','There is a large amount of water.'],'There is very little water, but it is not zero.',{context:'One small spoonful of water remains.'}),'少量与精确零不同。'),
q('e-only','独立使用两词数量短语','按本课only a…结构补全。',fill([blank('There are only','pens left.',['a few','a little']),blank('There is only','ink left.',['a little','a few'])],['a few','a little']),'按名词类型选择两词短语，only可以强调数量有限。'),
q('e-enough','独立核对少量与所需数量','有三张卡，任务需要六张，哪项正确？',choice(['有一些，但不够这次任务','完全没有卡片','有a few就必定足够'],'有一些，但不够这次任务',{context:'We have a few cards: 3 cards.\nThe task needs 6 cards.'}),'够不够取决于实际数量与需要。'),
q('e-relative','独立区分相对最少与足够','A的数量最少，是否仍够这次任务？',choice(['够，A有3张，任务只需2张','不够，fewest必定等于没有','不能比较，三组数量一样'],'够，A有3张，任务只需2张',{context:'Cards: A has 3, B has 5, C has 8.\nThis task needs 2 cards.'}),'范围内最少并不意味着零，也不必然不足。'),
q('e-more','独立使用more比较两种名词','补全“更多苹果”和“更多水”。',fill([blank('','apples',['more','manyer']),blank('','water',['more','mucher'])],['more','more']),'many／much都对应more。'),
q('e-most','独立判断最多的总量','哪杯拥有三杯中最多的水？',choice(['C','A','B'],'C',{context:'Three identical cups: A has 100 ml water, B has 200 ml, C has 300 ml.'}),'300 ml在给定三杯里最多。'),
q('e-less-fewer','独立使用less与fewer','按本课常规书面用法比较。',{...fill([blank('A has','juice than B.',['less','fewer']),blank('A has','bottles than B.',['fewer','less'])],['less','fewer']),context:'A: 100 ml juice and 2 bottles.\nB: 200 ml juice and 4 bottles.'},'juice按总量用less，bottles按个数用fewer。'),
q('e-least-fewest','独立使用两种最少','按完整记录补全。',{...fill([blank('A has the','water.',['least','fewest']),blank('A has the','cups.',['fewest','least'])],['least','fewest']),context:'All three groups:\nA: 100 ml water, 2 cups.\nB: 300 ml water, 5 cups.\nC: 500 ml water, 8 cups.'},'water用least；可数cups用fewest。'),
q('e-unit','独立辨认计量名词','three bottles of milk中，哪一部分按个数数？',choice(['bottles，瓶数','milk在这里自动变成复数','整个短语完全不能计数'],'bottles，瓶数'),'计量词bottles可数，milk本身在这里仍表示饮料总量。'),
q('e-measure','独立使用一又二分之一后的复数','填好计量词。',fill([blank('One and a half','of sugar.',['teaspoonfuls','teaspoonful'])],['teaspoonfuls']),'计量名词在一勺半后用复数。'),
q('e-good-well','独立使用good与well的比较形式','第一句表示更好，第二句表示三人中表现最好。',fill([blank('This plan is','than that one. (good)',['better','gooder']),blank('Of the three, Anna reads the',' . (well)',['best','wellest'])],['better','best']),'good／well可对应better／best，分别核对形容词与动作表现。'),
q('e-bad-ill','独立使用bad与ill的形式','第一句表示更差，第二句表示三天中最不舒服。',fill([blank('This weather is','than yesterday’s. (bad)',['worse','badder']),blank('Of those three days, he felt','on Monday. (ill)',['worst','illest'])],['worse','worst']),'本课使用worse／worst，不机械加词尾。'),
q('e-far','独立识别合法距离变体','谈实际距离“更远”时，本课保留哪些形式？',choice(['farther和further都可以','只有farther正确','只有further正确'],'farther和further都可以'),'不把另一种合法形式设成错误。'),
q('e-farthest','独立组织最远的表达','按记录，用给定furthest词块拼句。',{...bank(['The museum is','the furthest','from the school','further than'],'The museum is the furthest from the school',3),context:'Distances from the same school: library 1 km; park 2 km; museum 4 km.\nUse furthest.'},'在这三处中博物馆最远；farthest在同样距离语境也可用。'),
q('e-rewrite','独立核对改写增加的事实','只知道I’ve got some books.，能推出我比你少且最少吗？',choice(['不能，还缺比较对象的数量和范围','能，some总表示比你少','能，some和fewest完全相同'],'不能，还缺比较对象的数量和范围'),'原书写改写是按新设条件表达，不是由some自动推出比较。'),
q('e-advice','独立使用不可数advice','要表达“一条建议”，选哪个短语？',choice(['a piece of advice','an advice','a few advice'],'a piece of advice'),'本课advice不可数，用a piece of表示一条。'),
q('e-alternative','独立表达替代','伙伴同意以苹果代替已经没有的饼干，怎样说？',choice(['Have an apple instead.','Have an apple and a biscuit too.','There are definitely many biscuits.'],'Have an apple instead.',{context:'No biscuits are available. Your friend agrees to choose an apple as the alternative.'}),'替代不等于两样同时都有。'),
q('e-offer','独立按意愿回应提议','你此时不想再喝水，怎样礼貌回应？',choice(['No, thank you.','Yes, please.','It is the best.'],'No, thank you.',{context:'A classmate asks: “Would you like some more water?”\nYou do not want any more now.'}),'根据明确意愿回应，不单凭还有多少猜想法。')
];
unit.learning.REFERENCE=[
'本课主线有两部分：不规则比较形式，以及名词的数和数量词。many／few用于可数复数，much／little用于本课的不可数总量；a few和a little分别表示还有一些。不是所有词永远只有一种名词用法，先看当前语境。',
'few／little常强调数量很少；a few／a little通常肯定还有一些。它们都不是固定数字。说话人要强调存在还是不足，应有场景或任务说明；同样有三张卡，可以强调还有一些，也可以强调不足，不能把信息重点不同的句子一律判为语法错误。',
'少量不自动等于足够，最少不自动等于零。a few cards是否够用，要比较卡片数与所需数；fewest说相对范围内最少。只有明确清点或量取后才记录精确的0，不能把little／few直接换成no。',
'only a few／only a little可强调数量有限。many／much → more → most；little（数量）→ less → least；few → fewer → fewest。more／most能跟可数复数或不可数名词。本课用less milk、fewer biscuits等常规书面搭配，不把这一入门分工推广成所有口语和计量场景的绝对禁令。',
'计量词与所量的名词分开：three bottles of milk中bottles可数，milk在这里仍谈总量；one and a half teaspoonfuls中teaspoonfuls用复数。一勺半与两勺可比较，但原文没有给糖的克数，不把茶匙数自动换算成克数。',
'good／well → better → best；bad／ill → worse → worst。good可描述主意，well可表示动作做得好，也可表示身体好；本课例句分别注明用法，不把同形词都当同一词性或同一含义。',
'实际距离的far有两组形式：farther／further，farthest／furthest。本课保留两组；需要唯一组句时明确指定所用词块，不把另一组本身判错。比较距离要交代同一起点；further还可表达进一步的意思，那不是本课距离题要检验的目标。',
'advice、money、stationery在本课按不可数用；biscuits、books、oranges按可数复数用。说一条建议可用a piece of advice。fruit、coffee等在其他语境可有不同用法，本课任务注明谈总量，不用未消歧的服务份数或种类作唯一错项。',
'110课A的haven’t got any比haven’t got much／many更强，不能宣称二者双向等义。B按例表达不多／很少，不是由“有没有”的问句自动得知数量。C、D从some改为more、less、fewer或最少，加入了比较事实；纸笔练习按教师设定的角色和数量场景表达。',
'原文的牛奶只要a little，糖要求one and a half teaspoonfuls；That’s enough for me保留为Jane在这段对话里的要求。Would you like some more?是提议再来一些；some可用于此类提议，不机械把所有问句里的some改成any。接受或拒绝还要看明确意愿。',
'Charlotte说I think there are a few，是猜测；Jane说it’s empty，是随后检查的结果。没有交代空盒原因，不能添加谁拿走了东西、故意隐瞒或此前已清点的情节。',
'原文涉及cigarette（香烟）及smoke（吸烟）的成人角色对话，完整保留作阅读材料；应用任务改用普通物品、饮料总量、计量和替代选择，不设计学生索烟或吸烟操作。Eat more and smoke less及Jane的评价属于人物台词，不作为面向学生的通用生活建议，也不证明人物长期习惯已改变。'
];
unit.learning.MODEL_TITLE='课本小参考 · 110课I–Z数量比较';
unit.learning.QUANTITY_MODELS=[['原级／用法','比较级','最高级'],['many / much','more','most'],['little（数量）','less','least'],['few','fewer','fewest'],['good / well','better','best'],['bad / ill','worse','worst'],['far（实际距离）','farther / further','farthest / furthest']];
unit.learning.MODELS=[
['I · Have you got any chocolate? I haven’t got much.','巧克力总量：问有没有，回应不多。','chocolate'],
['J · I’ve got more than you have.','巧克力比你多。','chocolate-more'],
['K · I’ve got the most.','在给定范围内巧克力最多。','chocolate-most'],
['L · Have you got any chocolate? I’ve got very little.','巧克力总量：回应很少。','chocolate'],
['M · I’ve got less than you have.','巧克力比你少。','chocolate-less'],
['N · I’ve got the least.','在给定范围内巧克力最少。','chocolate-least'],
['O · Have you made any mistakes? I haven’t made many.','错误个数：问是否犯错，回应不多。','mistakes'],
['P · I’ve made more than you have.','错误个数比你多。','mistakes-more'],
['Q · I’ve made the most.','在给定范围内错误最多。','mistakes-most'],
['R · Have you made any mistakes? I’ve made very few.','错误个数：回应很少。','mistakes'],
['S · I’ve made fewer than you have.','错误个数比你少。','mistakes-fewer'],
['T · I’ve made the fewest.','在给定范围内错误最少。','mistakes-fewest'],
['U · You must see my new car. It’s very good.','教材人物对汽车的评价。','car'],
['V · This one’s better.','这辆更好（教材比较情境）。','car'],
['W · This one’s the best I’ve ever seen.','这是我见过最好的，不扩大为全世界最好。','car'],
['X · You mustn’t go to that restaurant. It’s very bad.','教材人物对餐馆的评价，不作为现实推荐。','restaurant'],
['Y · This one’s worse.','这家更差（教材比较情境）。','restaurant'],
['Z · This one’s the worst I’ve ever seen.','这是我见过最差的，保留个人见闻范围。','restaurant']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 用much、many、less或fewer填空',instruction:'完整保留4题。核对名词类型与than；any的否定句更明确地表示没有，不能把它与“不多”当成双向同义。',examples:[],items:['I haven’t got any pens. I haven’t got ________ either.','I’ve got some money. I’ve got ________ than you have.','I haven’t got any money. I haven’t got ________ either.','I’ve got some books. I’ve got ________ than you have.']},
{title:'B · 回答数量问句',answerLines:2,instruction:'完整保留6题，每题仿例写两句。按练习设定表达不多／很少；问句本身不提供实际数量。',examples:['Have you got any coffee? → I haven’t got much coffee. I’ve got very little.','Have you got any biscuits? → I haven’t got many biscuits. I’ve got very few.'],items:['Have you got any jam?','Have you got any potatoes?','Have you got any oranges?','Have you got any vegetables?','Have you got any meat?','Have you got any money?']},
{title:'C · 按新设条件表达更多',instruction:'完整保留6题。按例写more…than you have；这是加入新的比较条件，不由some自动推出，请按教师设定的角色数量完成。',examples:['I’ve got some coffee. → I’ve got more coffee than you have.'],items:['I’ve got some soap.','I’ve got some fruit.','I’ve got some books.','I’ve got some presents.','I’ve got some eggs.','I’ve got some stationery.']},
{title:'D · 写出更少与最少两句',answerLines:2,instruction:'完整保留6题，每题写比较级和最高级两句。按名词选择less／least或fewer／fewest，比较对象与范围作为练习新设条件。',examples:['I’ve got some coffee. → I’ve got less coffee than you have. I’ve got the least.','I’ve got some biscuits. → I’ve got fewer biscuits than you have. I’ve got the fewest.'],items:['I’ve got some jam.','I’ve got some potatoes.','I’ve got some vegetables.','I’ve got some oranges.','I’ve got some meat.','I’ve got some money.']}
];
core.unit109110=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit109110,excerpts={"u109110-v1-r-offer":[0,1],"u109110-v1-r-milk":[2,3],"u109110-v1-r-sugar":[4,5],"u109110-v1-r-more":[6,7,8],"u109110-v1-r-empty":[9,10,11,12,13],"u109110-v1-r-biscuit":[14,15],"u109110-v1-e-milk":[2,3]},speakers={"charlotte":"Charlotte","jane":"Jane"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 109',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
