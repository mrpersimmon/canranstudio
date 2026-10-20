(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit107-108/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页218–221／PDF251–254',grammarSource='《同步导学》Grammar纸页184／PDF198；《语法练习册》纸页309–313／PDF323–327';
const rows=[['madam','女士；夫人（尊称）','/ˈmædəm/','madam'],['smart','漂亮的；时髦的（本课）','/smɑːt/','smart'],['as well','也；同样','/əz ˈwel/','as-well'],['suit','适合（款式、颜色等）','/suːt/','suit'],['pretty','漂亮的','/ˈprɪti/','pretty'],['dress','连衣裙','/dres/','dress-blue'],['colour','颜色','/ˈkʌlə/','colour'],['size','尺码；大小','/saɪz/','size'],['try','试；尝试','/traɪ/','try'],['in fashion','流行的；时髦的','/ɪn ˈfæʃən/','fashion'],['not…at all','根本不……；一点也不……','/nɒt ət ɔːl/','not-at-all'],['either','也（用于否定句等）','/ˈaɪðə/','either'],['another','另一个','/əˈnʌðə/','another'],['small','小的','/smɔːl/','small'],['large','大的','/lɑːdʒ/','large'],['tall','高的','/tɔːl/','tall'],['short','矮的；短的','/ʃɔːt/','short'],['hot','热的','/hɒt/','hot'],['heavy','重的','/ˈhevi/','heavy'],['thin','薄的；瘦的','/θɪn/','thin'],['wet','湿的','/wet/','wet'],['easy','容易的','/ˈiːzi/','easy'],['nice','好的；令人愉快的','/naɪs/','nice'],['more','更……（程度）','/mɔː/','more'],['most','最……（程度）','/məʊst/','most'],['less','不那么……（程度）','/les/','less'],['least','最不……（程度）','/liːst/','least'],['good','好的','/ɡʊd/','good'],['bad','坏的；差的','/bæd/','bad']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit107-108',version:1,contentRevision:'dress-comparison-v1',mode:'classroom',title:'服装店里的比较',path:'/unit107-108/',start:'learn/words',progress:{learningKey:'canran:unit107-108:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识衣服与比较',activities:[['words','服装店小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进服装店',activities:[['text','服装店小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清更与最',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'比较后再选择',activities:[['apply','比较小帮手','give']],required:['apply']},
{id:'l5',title:'完成比较挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'dress',storyQuestion:'这位女士想要什么样的服装？',completionTitles:{listen:'衣服与比较词认清啦！',roles:'服装店故事读懂啦！',grammar:'更与最说清啦！',apply:'比较条件看清啦！',exam:'比较挑战完成！'},reward:{edition:'dress-comparison-v1',title:'比较表达小达人',lesson:'Lesson 107–108',scene:'/assets/unit107-108/keepsake-story-v1.webp',alt:'店员与女士比较蓝裙和绿裙',color:'#a67e80',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','比较小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={assistant:'Assistant',lady:'Lady'};
unit.learning.DIALOGUE=[
['assistant','Do you like this dress, madam?','夫人，您喜欢这件衣服吗？'],
['lady','I like the colour very much. It’s a lovely dress, but it’s too small for me.','我很喜欢这颜色。这是件漂亮的衣服，可是对我来说太小了。'],
['assistant','What about this one? It’s a lovely dress. It’s very smart. Short skirts are in fashion now. Would you like to try it?','这件怎么样？这是件漂亮的衣服，它很时髦。短裙现在很流行。您要试一试吗？'],
['lady','All right.','好吧。'],
['lady','I’m afraid this green dress is too small for me as well. It’s smaller than the blue one.','恐怕这件绿色的我穿着也太小了。它比那件蓝色的还要小。'],
['lady','I don’t like the colour either. It doesn’t suit me at all. I think the blue dress is prettier.','我也不喜欢这种颜色。这颜色我穿根本不合适。我认为那件蓝色的更漂亮些。'],
['lady','Could you show me another blue dress? I want a dress like that one, but it must be my size.','您能再给我看一件蓝色的吗？我想要一件和那件一样的，但必须是我的尺寸。'],
['assistant','I’m afraid I haven’t got a larger dress. This is the largest dress in the shop.','恐怕没有更大的了。这是店里最大的一件。']
].map(([who,text,cn],i)=>({id:'u107108-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u107108-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-dress','服装词义','哪个词表示“连衣裙”？',choice(['dress','shirt','skirt'],'dress',{optionImages:{dress:image('dress-blue'),shirt:image('shirt'),skirt:image('skirt')}}),'dress是连衣裙，skirt是裙子，shirt是衬衫。'),
q('v-match','本课称呼动作与短语','把三个词或短语配好。',match([['madam','女士；夫人（尊称）'],['suit','适合'],['as well','也；同样']]),'按本课语境理解称呼、适合与“也”。'),
q('v-smart','smart的衣着义','It’s very smart.说的是衣服，smart在这里是什么意思？',choice(['漂亮、时髦','会思考、会算题','尺码一定合适'],'漂亮、时髦'),'这里评价衣服的样式，不是说它有人的思考能力。'),
q('v-suit','定位适合的动作词','点出表示“适合”的词。',{type:'locate',fragments:[{value:'Green'},' doesn’t ',{value:'suit'},' me.'],options:['Green','suit'],answer:'suit'},'这句谈颜色适不适合，不等于尺码合不合。'),
q('v-also','as well不表示大小相同','The green dress is too small as well.说明什么？',choice(['绿裙也太小，但不说明两裙一样大','两件裙子大小完全相同','绿裙一定比蓝裙大'],'绿裙也太小，但不说明两裙一样大'),'as well表示另一件也有这个情况，不是尺寸相等。'),
q('v-not-at-all','not at all的否定程度','It doesn’t suit me at all.是什么意思？',choice(['它根本不适合我','它非常适合我','它比另一件大'],'它根本不适合我'),'not…at all强调一点也不。'),
q('v-pretty','pretty词义','pretty在本课形容衣服时表示什么？',choice(['漂亮的','更重的','湿的'],'漂亮的'),'漂亮与大小、重量是不同描述。'),
q('v-size','size词义','It must be my size.中的size指什么？',choice(['尺码','颜色','价格'],'尺码'),'喜欢颜色还不够，女士也有尺码要求。')
];
unit.questions.roles=[
q('r-first','第一件衣服的优点与问题','女士怎样评价第一件蓝裙？',choice(['喜欢颜色，但对她太小','不喜欢颜色，但尺码正好','已经付款买下'],'喜欢颜色，但对她太小'),'喜欢颜色不等于尺码合适或已购买。'),
q('r-invite','邀请试穿与回应','店员问Would you like to try it?，女士怎样回答？',choice(['All right.','I have bought it.','It is the largest.'],'All right.'),'All right是同意试一试，不等于决定购买。'),
q('r-green','两件衣服的相对大小','绿裙与蓝裙相比怎样？',choice(['绿裙更小','绿裙更大','两件一样大'],'绿裙更小'),'It’s smaller than the blue one明确比较绿裙与蓝裙。'),
q('r-colour','明确不喜欢的颜色','女士后来不喜欢哪件衣服的颜色？',choice(['绿色的','蓝色的','没有说明'],'绿色的'),'the colour承接当前的green dress。'),
q('r-view','保留人物观点','I think the blue dress is prettier.是谁的看法？',choice(['女士的看法','每个人都必须接受的事实','店员刚宣布的规定'],'女士的看法'),'保留I think，不把个人审美变成统一事实。'),
q('r-request','教材开场问题的完整条件','女士想再看什么样的衣服？',choice(['像那件蓝裙、而且尺码适合她的','任意颜色，只要最大','刚才更小的绿裙'],'像那件蓝裙、而且尺码适合她的'),'颜色、样式与尺码要求一起保留。'),
q('r-largest','最高级的范围与适合程度','店员说largest，范围是什么？这能保证合身吗？',choice(['这家店里的衣服；不能保证合身','全世界所有衣服；保证合身','只有绿裙；保证合身'],'这家店里的衣服；不能保证合身'),'店内最大只是相对范围内的比较。'),
q('r-ending','保留未知购买结果','结尾交代女士买了哪件吗？',choice(['没有交代购买结果','明确买下蓝裙','明确买下绿裙'],'没有交代购买结果'),'没有付款或成交信息，不替故事补结局。')
];
unit.questions.grammar=[
g('regular','直接加er与est','选出small的比较级和最高级。',fill([blank('比较级：','',['smaller','smallest','small']),blank('最高级：','',['smallest','smaller','small'])],['smaller','smallest']),'许多单音节形容词直接加-er／-est。','比较与一组中最突出，用不同形式。',model(['tall → taller → tallest','原级 → 比较级 → 最高级。'])),
g('final-e','词尾e加r与st','选出large的两种形式。',fill([blank('比较级：','',['larger','largeer']),blank('最高级：','',['largest','largeest'])],['larger','largest']),'以e结尾，常直接加-r／-st。','不要再重复原词末尾的e。',model(['nice → nicer → nicest','末尾已经有e。'])),
g('final-y','辅音字母加y的变化','选出heavy的两种形式。',fill([blank('比较级：','',['heavier','heavyer']),blank('最高级：','',['heaviest','heavyest'])],['heavier','heaviest']),'这些辅音字母加y的形容词把y变i，再加-er／-est。','先检查y前面的字母。',model(['easy → easier → easiest','y变i，再接词尾。'])),
g('double','短元音后双写词尾','选出hot的两种形式。',fill([blank('比较级：','',['hotter','hoter']),blank('最高级：','',['hottest','hotest'])],['hotter','hottest']),'hot这类重读短元音加一个末尾辅音的词，双写末尾辅音再加词尾。','看看例子，变化时末尾的辅音怎样处理。',model(['thin → thinner → thinnest','比较级和最高级都双写末尾n。'])),
g('more-most','多音节词的更与最','用difficult表达“更难”和“最难”。',fill([blank('更难：','difficult',['more','most']),blank('最难：the','difficult',['most','more'])],['more','most']),'这类多音节形容词前用more／most，不再同时加-er／-est。','更与最的修饰词不同。',model(['more interesting / the most interesting','不叠加more和-er。'])),
g('less-least','多音节词的较低与最低程度','用less／least按价格比较。',{...fill([blank('The blue bag is','expensive than the red bag.',['less','least']),blank('The green bag is the','expensive of these three.',['least','less'])],['less','least']),context:'Prices: red bag £12; blue bag £10; green bag £8.\nUse less or least.'},'less表示比另一件程度低；least表示给定范围内最低。','先分清两者比较和三件之中。',model(['A ticket costs £5; B costs £7. A is less expensive.','Of three prices £5, £7 and £9, £5 is the least expensive.'])),
g('good','good的不规则变化','按老师对方案的评价填写比较句。',{...fill([blank('Plan B is','than Plan A.',['better','gooder']),blank('Plan C is the','of the three.',['best','goodest'])],['better','best']),context:'The teacher rates the three good plans:\nC is first, B is second, A is third.'},'good → better → best，不机械加词尾。','这组需要整体识记，再核对比较范围。',model(['This idea is good; that idea is better.','Of the three ideas, this is the best.'])),
g('bad','bad的不规则变化','按路况记录填写比较句。',{...fill([blank('Road A is','than Road B.',['worse','badder']),blank('Road A is the','of the three.',['worst','baddest'])],['worse','worst']),context:'Road condition, from best to worst:\nC, then B, then A.'},'本课标准形式bad → worse → worst。','不要把good的变化套过来。',model(['The weather was bad, then worse.','That was the worst weather of the week.'])),
g('than','明确比较对象时用than','用词块说明红尺比蓝尺长。',{...bank(['The red ruler is','longer than','the blue one','longest than'],'The red ruler is longer than the blue one',3),context:'Red ruler: 20 cm. Blue ruler: 12 cm.'},'明确说比哪个更……，用比较级＋than。','两把尺的长度已经给出。',model(['The blue bag is heavier than the brown one.','than引出比较对象。'])),
g('the','本课最高级名词结构','在这三把尺子中，补好“最短的尺子”。',{...fill([blank('This is','shortest ruler of the three.',['the','a','than'])],['the']),context:'This ruler is 8 cm; the other two are 12 cm and 20 cm.'},'本课练the＋最高级＋名词；范围是给出的三把尺子。','看清句子是在说最短的一个。',model(['This is the tallest tree in the garden.','the与最高级一起构成这里的名词短语。'])),
g('implicit','比较对象清楚时可省than短语','说话人手上的袋子太小，I need a larger bag.可以这样说吗？',choice(['可以，比较对象可由当前袋子理解','不可以，所有比较级都必须带than','不可以，larger只能表示最大'],'可以，比较对象可由当前袋子理解',{context:'The speaker is holding a bag that is too small and asks for a bigger one.'}),'比较级可以单独出现，前提是比较对象或意义清楚。','不是每句都要重复已明确的对象。',model(['This coat is too short. Have you got a longer one?','更长是相对当前这件，比较意义仍在。'])),
g('scope','最高级需要足够的范围信息','只按记录，能说B是三把尺中最长的吗？',choice(['还不能，C的长度未知','能，只要B比A长就够了','能，字母B总是最长'],'还不能，C的长度未知',{context:'Ruler A: 10 cm.\nRuler B: 20 cm.\nRuler C: length not recorded.'}),'知道B比A长，不足以确定它在含C的范围内最长。','全部比较对象的信息是否齐全？',model(['A: 10 cm; B: 20 cm; C: 30 cm.','有完整记录，才能判断C是这三把中最长的。'])),
g('time','比较不同日期时保留范围','按这三天的记录，哪句准确？',choice(['The day before yesterday was the hottest of these three days.','Yesterday was the hottest day of the year.','Today was hotter than yesterday.'],'The day before yesterday was the hottest of these three days.',{context:'Today in this record is 10 June.\n8 June: 30°C; 9 June: 27°C; 10 June: 25°C.\nOnly these three days were recorded.'}),'日期锚点决定前天是哪天；三天记录不能推出全年最高。','比较范围只有这三天。',model(['Today is 5 May. 3 May: 18°C; 4 May: 20°C; 5 May: 22°C.','Today is the hottest of these three days.'])),
g('one','one代替已提到的单数名词','the blue one里的one代替什么？',choice(['dress','colour','shop'],'dress',{context:'The green dress is smaller than the blue one.'}),'one代替前面已提到的单数物品dress，避免重复。','先看正在比较什么。',model(['The red case is heavier than the brown one.','one代替case。'])),
g('not-equivalent','原级不自动推出比较或最高级','只知道This box is very heavy.，能推出它最重吗？',choice(['不能，还要知道其他箱子的重量','能，very heavy就等于the heaviest','能，所有heavy的东西都最重'],'不能，还要知道其他箱子的重量'),'改写成比较级或最高级时加入了比较关系，需要相应事实。','很重与比谁更重／范围内最重不同。',model(['This tree is tall.','这句话本身没告诉我们另一棵树或整片树林的高度。'])),
g('ever-seen','I have ever seen限定个人见闻','I have ever seen把比较范围限定在哪里？',choice(['说话人见过的那些物品','全世界所有同类物品','商店里所有没见过的物品'],'说话人见过的那些物品',{context:'This is the largest crowd I have ever seen.'}),'个人见闻不是全世界的完整记录。','谁见过？范围是否被这句话限制？',model(['This is the longest river I have ever seen.','说话人见过的河，不直接等于世界最长的河。'])),
g('independent-spelling','独立核对词尾变化','分别填wet的比较级和nice的最高级。',fill([blank('wet的比较级：','',['wetter','weter']),blank('nice的最高级：','',['nicest','niceest'])],['wetter','nicest']),'wet双写t；nice末尾已有e。'),
g('independent-super','独立表达一组中的最重','按记录拼好句子。',{...bank(['The green case is','the heaviest','of the three','heavier than'],'The green case is the heaviest of the three',3),context:'All three cases: brown 4 kg; blue 6 kg; green 9 kg.'},'范围内9 kg最大，用the heaviest of the three。'),
g('independent-degree','独立选择more与least','按价格补好两句。',{...fill([blank('The red bag is','expensive than the blue bag.',['more','most']),blank('The green bag is the','expensive of the three.',['least','less'])],['more','least']),context:'Red bag £15; blue bag £12; green bag £9.\nThese are the three bags being compared.'},'15比12贵用more；9在三件中最低用least。'),
g('independent-choice','独立避免双重比较标记','用big的比较级表达甲比乙大，选正确形式。',choice(['Box A is bigger than Box B.','Box A is more bigger than Box B.','Box A is biggest than Box B.'],'Box A is bigger than Box B.'),'用bigger后，不再叠加more；比较对象前用than。')
];
unit.questions.apply=[
q('a-weight','根据重量比较两件物品','按记录，哪句准确？',choice(['The blue case is heavier than the brown one.','The brown case is heavier than the blue one.','Both cases have the same weight.'],'The blue case is heavier than the brown one.',{context:'Brown case: 4 kg. Blue case: 6 kg.'}),'重量根据给定数值，不根据画面面积猜。'),
q('a-heaviest','根据完整资料找组内最重','这三只箱子中，哪只最重？',choice(['brown','blue','green'],'green',{context:'These are all three cases.\nBrown: 4 kg; blue: 6 kg; green: 9 kg.',optionImages:{brown:image('case-brown-4'),blue:image('case-blue-6'),green:image('case-green-9')}}),'9 kg在这三只中最大；图上数值和文字记录一致。'),
q('a-price','用less比较价格','用less说明蓝帽比红帽便宜。',{...bank(['The blue hat is','less expensive than','the red one','least expensive than'],'The blue hat is less expensive than the red one',3),context:'Blue hat: £8. Red hat: £12.\nUse less.'},'较低价格用less expensive than，不用least连接两者。'),
q('a-label','同时核对颜色与尺码要求','哪张商品卡同时符合两个要求？',choice(['A · blue / L','B · blue / M','C · green / M'],'B · blue / M',{context:'Requested colour: blue.\nRequested size label: M.\nFor this task, match both labels; a larger label is not the goal.'}),'按明确的颜色和尺码标签选，不把更大当作更合适。'),
q('a-range','保持比较范围','哪句话只说明记录支持的范围？',choice(['C is the largest box in Shop A.','C is the largest box in the world.','C will fit every object.'],'C is the largest box in Shop A.',{context:'All boxes in Shop A: A, B and C.\nC is larger than A and B.\nNo information about other shops or objects is given.'}),'最大要保留范围，不能推成全球最大或万能合适。'),
q('a-view','个人偏好与共同事实','按Mia的话，选准确的记录。',choice(['Mia thinks the blue dress is prettier.','Everyone must like the blue dress more.','Mia has bought the blue dress.'],'Mia thinks the blue dress is prettier.',{context:'Mia says: “I think the blue dress is prettier.”\nNo purchase has been made.'}),'审美观点属于说话人，不能替她作出购买决定。'),
q('a-evidence','改成最高级需要额外证据','只有一句The bag is very heavy.，接下来怎样才能判断它最重？',choice(['还要比较同一范围内其他袋子的重量','直接把very改成the即可证明','看袋子的颜色就能判断'],'还要比较同一范围内其他袋子的重量',{context:'No weights or other bags have been described.'}),'结构转换不能凭空制造比较事实。'),
q('a-request','根据需求请求另一件','当前这件太小，怎样礼貌请求更大的一件？',choice(['Could you show me a larger one, please?','This one is the largest in the world.','I have already bought this one.'],'Could you show me a larger one, please?',{context:'The current dress is too small. You want to ask the assistant to show you a bigger one.'}),'请求另一件不表示店里一定有，也不表示已经购买。')
];
unit.questions.exam=[
q('e-size','独立核对原文尺寸关系','原文中的绿裙与蓝裙是什么关系？',choice(['绿裙更小，两件对女士都太小','绿裙更大而且合身','两件一样大而且都合身'],'绿裙更小，两件对女士都太小'),'也太小与更小同时成立。'),
q('e-view','独立保留观点归属','蓝裙更漂亮是哪类信息？',choice(['女士表达的看法','所有人共同确认的事实','已经成交的证明'],'女士表达的看法'),'I think限定说话人的看法。'),
q('e-fit','独立区分店内最大与合身','店内最大的一件就一定适合女士吗？',choice(['不一定，原文说这件对她仍太小','一定，largest等于合身','一定，蓝色就会变大'],'不一定，原文说这件对她仍太小'),'相对最大不保证达到某个人的需求。'),
q('e-ending','独立保留未知购买结果','文中是否交代最终付款买下哪件？',choice(['没有交代','蓝裙已经付款','绿裙已经付款'],'没有交代'),'不补写原文没有的结局。'),
q('e-regular','独立使用er与est','填写clean的比较级和最高级。',fill([blank('比较级：','',['cleaner','cleanest']),blank('最高级：','',['cleanest','cleaner'])],['cleaner','cleanest']),'clean直接加-er／-est。'),
q('e-final-e','独立处理词尾e','填写nice的两种形式。',fill([blank('比较级：','',['nicer','niceer']),blank('最高级：','',['nicest','niceest'])],['nicer','nicest']),'末尾已有e，只加-r／-st。'),
q('e-final-y','独立处理辅音字母加y','填写easy的两种形式。',fill([blank('比较级：','',['easier','easyer']),blank('最高级：','',['easiest','easyest'])],['easier','easiest']),'y变i，再加词尾。'),
q('e-double','独立处理双写','填写thin的两种形式，用来比较纸张厚薄。',fill([blank('比较级：','',['thinner','thiner']),blank('最高级：','',['thinnest','thinest'])],['thinner','thinnest']),'thin双写n后接词尾。'),
q('e-more-most','独立使用多音节比较形式','用interesting表达“更有趣”和“最有趣”。',fill([blank('更有趣：','interesting',['more','most']),blank('最有趣：the','interesting',['most','more'])],['more','most']),'用more／most修饰，不叠加-er／-est。'),
q('e-less-least','独立表达较低与最低价格','按价格用less／least补全。',{...fill([blank('B is','expensive than A.',['less','least']),blank('C is the','expensive of the three.',['least','less'])],['less','least']),context:'Three bags: A £20; B £15; C £10.\nUse less or least.'},'两者比较用less，三件中最低用least。'),
q('e-good','独立使用good的不规则形式','填写good的两种形式。',fill([blank('比较级：','',['better','gooder']),blank('最高级：','',['best','goodest'])],['better','best']),'good → better → best。'),
q('e-bad','独立使用bad的不规则形式','填写bad的两种形式。',fill([blank('比较级：','',['worse','badder']),blank('最高级：','',['worst','baddest'])],['worse','worst']),'本课使用bad → worse → worst。'),
q('e-than','独立组织than比较','红尺12 cm，蓝尺8 cm，拼好比较句。',{...bank(['The red ruler is','longer than','the blue one','longest than'],'The red ruler is longer than the blue one',3),context:'Red ruler: 12 cm. Blue ruler: 8 cm.'},'比较级＋than连接明确的比较对象。'),
q('e-the','独立使用最高级名词结构','补全这三件中最便宜的帽子。',{...fill([blank('This is','cheapest hat of the three.',['the','a','than'])],['the']),context:'This hat: £4. The other two hats: £6 and £8.'},'本课结构the cheapest hat，范围是三件。'),
q('e-implicit','独立理解省略比较对象','指着太短的围巾问Have you got a longer one?，是否缺少必要的than？',choice(['没有，比较对象是当前这条围巾','有，每个比较级都必须写than','有，longer只能作最高级'],'没有，比较对象是当前这条围巾'),'语境已明确比较对象，不必重复than短语。'),
q('e-scope','独立识别范围信息不足','能确定B是三只箱子中最重的吗？',choice(['不能，C的重量未知','能，B比A重就够了','能，三个字母已经给全了'],'不能，C的重量未知',{context:'Case A: 3 kg. Case B: 5 kg. Case C: weight not recorded.'}),'对象列全不等于比较数据齐全。'),
q('e-time','独立保留日期锚点与范围','按三天记录，哪句准确？',choice(['Yesterday was the hottest of these three days.','Today was the hottest day of the year.','The day before yesterday was hotter than yesterday.'],'Yesterday was the hottest of these three days.',{context:'Today in this record is 12 May.\n10 May: 21°C; 11 May: 28°C; 12 May: 24°C.\nOnly these three days are recorded.'}),'11 May是昨天；只判断这三天，不扩大到全年。'),
q('e-one','独立识别替代词','句中的one指什么？',choice(['dress','price','person'],'dress',{context:'The blue dress is smaller than the red one.'}),'one替代前面的dress。'),
q('e-evidence','独立区别原级与最高级','只知道This hat is very cheap.，能断定它是全店最便宜的吗？',choice(['不能，还需要其他帽子的价格','能，very cheap就是全店最便宜','能，便宜的东西只有一件'],'不能，还需要其他帽子的价格'),'very加强程度，没有给出全店比较。'),
q('e-ever','独立保留个人见闻范围','the biggest building I have ever seen中的范围是什么？',choice(['说话人曾经见过的建筑','世界上所有建筑','城市里所有没见过的建筑'],'说话人曾经见过的建筑'),'个人见闻不是全球调查结果。'),
q('e-reverse','独立保留反向比较的含义','按原意补全反向比较。',{...fill([blank('The blue ruler is','than the red one.',['shorter','longer','shortest'])],['shorter']),context:'The red ruler is longer than the blue ruler.'},'交换对象时要检查比较方向，不能照抄longer。'),
q('e-request','独立回应试穿邀请','店员邀请试一试，你同意，选合适回应。',choice(['All right, thank you.','I have already paid for it.','It must be the biggest in the world.'],'All right, thank you.',{context:'Assistant: “Would you like to try it?”\nYou agree to try it.'}),'同意试穿不等于购买。'),
q('e-either','独立表达否定句中的也','按“那件的颜色我也不喜欢”补全。',fill([blank('I don’t like this colour. I don’t like that colour',' .',['either','than','prettier'])],['either']),'这里用either补充另一个否定情况。'),
q('e-not-at-all','独立理解not at all','It doesn’t suit me at all.表达哪种意思？',choice(['根本不适合我','稍微大一点','我已经买下'],'根本不适合我'),'这是适合程度的否定，不表示大小或购买结果。')
];
unit.learning.REFERENCE=[
'比较级用于比较，例如small → smaller；最高级把一个对象放在明确范围里比较，例如the smallest of these three。比较可以针对两个对象或两组对象；本课最高级练三件及以上的清楚范围，不把这个入门安排写成所有语境的绝对限制。',
'常见构成：直接加-er／-est，如tall → taller → tallest；末尾e加-r／-st，如large → larger → largest；辅音字母加y的这类词先变i，如heavy → heavier → heaviest。hot、thin、big、wet这类重读短元音后只有一个末尾辅音的词，双写后再加词尾，不是所有词都双写。',
'较长的形容词常用more／most或less／least：more difficult、the most difficult；less expensive、the least expensive。表达的方向不同；不要在bigger前再加more。本课选搭配明确的常见词，不用存在合法变体的词强设唯一形式。',
'good → better → best，bad → worse → worst是不规则形式。导学本单元已明确这两组，因此本课保留基本识记与独立检验；下一单元如继续扩展，不表示本课可以省略。',
'明确比较对象时可用比较级＋than：smaller than the blue one。对象清楚时不必重复than短语，如I haven’t got a larger dress。one在这里代替dress，不能把one只理解成数字一。',
'本课常练the＋最高级＋名词，并用in the shop／of the three／I have ever seen交代范围。导学的“最高级前必须加the”是入门简化，my best friend等可以用物主限定词，不再加the；不把所有没有the的最高级都判错。这里不增加新的限定词必考关卡。',
'108课的原级、比较级、最高级是不同表达任务。I am very young不能凭空推出I am younger than you are或I am the youngest in the class；后两句增加了比较关系和范围。书写保留原例，按设定角色补充场景，不要求孩子据此真实自评或给同学排身材、年龄与性格名次。',
'108课A–L保留Sophie／Paul／Hans、三天温度、去年与今年的人群以及三只箱子。线上另设资料有明确日期锚点和数据，不从只有三天的记录推出全年最高，不把示意箱子画得更大就当作更重的证据。',
'同一个“最”必须保留范围：店里最大不等于世界最大，也不保证适合某个人。I have ever seen限制为说话人的见闻。个人审美如I think the blue dress is prettier保留为个人看法。',
'as well表示也，不表示两件衣服同样大；either可补充否定情况。not…at all强调根本不。smart本课说衣服漂亮、时髦；suit在颜色和款式语境表示适合，不自动等于尺码正好。',
'女士喜欢蓝色、认为蓝裙更漂亮，但需要自己的尺码；店员说店里没有更大的，并未提供成交结果。Short skirts are in fashion now是故事中店员的话，不作为今天的流行资讯，也不把尺码问题变成对女士身体的评价。'
];
unit.learning.MODEL_TITLE='课本小参考 · 108课A–L比较';
unit.learning.COMPARISON_MODELS=[['原级／方向','比较级','最高级'],['tall','taller','tallest'],['large','larger','largest'],['heavy','heavier','heaviest'],['hot','hotter','hottest'],['difficult · 更／最','more difficult','most difficult'],['expensive · 程度较低／最低','less expensive','least expensive'],['good','better','best'],['bad','worse','worst']];
unit.learning.MODELS=[
['A · Sophie is tall.','Sophie很高。','height-a'],['B · Paul is taller than Sophie.','Paul比Sophie高。','height-b'],['C · Hans is the tallest student in our class.','Hans是我们班最高的学生。','height-c'],
['D · It is hot today.','今天很热。','heat-a'],['E · It was hotter yesterday.','昨天更热。','heat-b'],['F · The day before yesterday was the hottest day in the year.','前天是这一年最热的一天（课本设定）。','heat-c'],
['G · There was a large crowd at the race last year.','去年比赛时人很多。','crowd-a'],['H · This year the crowd is larger.','今年人更多。','crowd-b'],['I · It is the largest crowd I have ever seen.','这是我见过的最大的人群。','crowd-c'],
['J · The brown suitcase is heavy.','棕色的箱子很重。','case-brown'],['K · The blue suitcase is heavier than the brown one.','蓝箱比棕箱更重。','case-blue'],['L · The green suitcase is the heaviest of them all.','绿箱是它们中最重的。','case-green']
].map(([en,cn,art])=>({en,cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 填入比较级',instruction:'完整保留5题与原例。先观察课本形式：cold—colder；nice—nicer；hot—hotter；heavy—heavier。按例表达后一个对象或时间的程度更高。',examples:['It is warm today, but it was ________ yesterday. → It is warm today, but it was warmer yesterday.'],items:['It is cool today, but it was ________ yesterday.','It is wet today, but it was ________ yesterday.','He’s late again today, but he was ________ yesterday.','This test is easy, but that one is ________.','This bookcase is large, but that one is ________.']},
{title:'B · 写出比较级与最高级两句',instruction:'完整保留8题，每题按原例写两句。比较句加入了新条件，不是与原句同义：请把I、you和class当作教师设定的教材角色，不要求真实自评或给同学排身材、性格名次。',examples:['I am very young. → I am younger than you are. I am the youngest in the class.'],items:['I am very old.','I am very tall.','I am very lazy.','I am very heavy.','I am very lucky.','I am very fat.','I am very thin.','I am very big.']},
{title:'C · 比较另一对象并限定见闻范围',instruction:'完整保留6题，每题按原例写比较句与最高级句。把that所指对象及说话人见过的范围作为练习新设条件；不能只由原句推出比较结果。',examples:['This policeman is tall. → But that policeman is taller. He is the tallest policeman I have ever seen.'],items:['This street is clean.','This man is old.','This river is long.','This woman is short.','This knife is blunt.','This car is cheap.']}
];
core.unit107108=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);


// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit107108,excerpts={"u107108-v1-r-first":[0,1,2,3,4,5],"u107108-v1-r-invite":[2,3],"u107108-v1-r-green":[4],"u107108-v1-r-colour":[4,5],"u107108-v1-r-view":[4,5],"u107108-v1-r-request":[6,7],"u107108-v1-r-largest":[6,7],"u107108-v1-r-ending":[0,1,2,3,4,5,6,7],"u107108-v1-e-size":[4,5]},speakers={"assistant":"Assistant","lady":"Lady"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 107',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
