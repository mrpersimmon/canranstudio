(function(root){
'use strict';
const core=root.CanranCore,image=name=>'/assets/unit103-104/'+name+'.svg';
const textSource='《新概念英语智慧版1》纸页210–213／PDF243–246';
const grammarSource='《同步导学》Grammar纸页178–179／PDF192–193，练习180／194；《语法练习册》纸页296–302／PDF310–316';
const rows=[['exam','考试','/ɪɡˈzæm/','exam'],['pass','及格；通过','/pɑːs/','pass'],['mathematics','数学','/ˌmæθəˈmætɪks/','maths'],['maths','mathematics的缩写','/mæθs/','maths'],['question','问题','/ˈkwestʃən/','question'],['easy','容易的','/ˈiːzi/','easy'],['enough','足够；足够地','/ɪˈnʌf/','enough'],['paper','试卷（本课词义）','/ˈpeɪpə/','paper'],['fail','未及格；失败','/feɪl/','fail'],['answer','回答','/ˈɑːnsə/','answer'],['mark','分数','/mɑːk/','mark'],['rest','其余部分（本课词义）','/rest/','rest'],['difficult','困难的','/ˈdɪfɪkəlt/','difficult'],['hate','讨厌','/heɪt/','hate'],['low','低的；矮的','/ləʊ/','low'],['cheer','振作；振奋','/tʃɪə/','cheer'],['guy','人；家伙（口语）','/ɡaɪ/','guy'],['top','上方；顶部','/tɒp/','top'],['clever','聪明的','/ˈklevə/','clever'],['stupid','笨的（贬义词）','/ˈstjuːpɪd/','stupid'],['cheap','便宜的','/tʃiːp/','cheap'],['expensive','贵的','/ɪkˈspensɪv/','expensive'],['fresh','新鲜的','/freʃ/','fresh'],['stale','不新鲜的；变味的','/steɪl/','stale'],['loud','大声的','/laʊd/','loud'],['high','高的','/haɪ/','high'],['hard','硬的（梨的语境）','/hɑːd/','hard'],['sweet','甜的','/swiːt/','sweet'],['soft','软的','/sɒft/','soft'],['sour','酸的','/ˈsaʊə/','sour'],['too','太；超过合适程度（本课）','/tuː/','too'],['very','非常','/ˈveri/','very'],['could','过去能够；也可用于礼貌请求','/kʊd/','could'],['couldn’t','could not的缩写','/ˈkʊdənt/','couldnt'],['cheer up','振作起来','/tʃɪər ʌp/','cheer'],['the rest of','……的其余部分','/ðə rest əv/','rest']];
const WORDS=rows.map(([en,cn,ph,art])=>({en,cn,ph,image:image(art)}));
const unit={id:'unit103-104',version:1,contentRevision:'degree-could-v1',mode:'classroom',title:'考场外的对话',path:'/unit103-104/',start:'learn/words',progress:{learningKey:'canran:unit103-104:learning:v1'},objects:WORDS,learning:{WORDS,FEEDBACK:core.courseCatalog.requireCourseDefinition('lesson49').learning.FEEDBACK},stages:[
{id:'l1',title:'认识考试与程度',activities:[['words','程度小图鉴','cards'],['listen','单词寻宝','cards']],required:['listen']},
{id:'l2',title:'走进考后对话',activities:[['text','考场外小剧场','book'],['roles','故事小侦探','people']],required:['text','roles']},
{id:'l3',title:'说清程度与能力',activities:[['grammar','语法小工坊','speech']],required:['grammar']},
{id:'l4',title:'选择合适表达',activities:[['apply','表达小帮手','give']],required:['apply']},
{id:'l5',title:'完成表达挑战',activities:[['exam','综合挑战','star'],['certificate','我的单元纪念卡','star']],required:['exam']}
],questions:{},storyIcon:'paper',storyQuestion:'考试持续了多长时间？',completionTitles:{listen:'程度词语认清啦！',roles:'考后故事读懂啦！',grammar:'程度与能力说清啦！',apply:'合适表达选好啦！',exam:'表达挑战完成！'},reward:{edition:'degree-could-v1',title:'程度表达小达人',lesson:'Lesson 103–104',scene:'/assets/unit103-104/keepsake-story-v1.webp',alt:'Gary和Richard在考场外交流',color:'#63899e',zones:[['listen','单词寻宝'],['roles','故事小侦探'],['grammar','语法小工坊'],['apply','表达小帮手'],['exam','综合挑战']].map(([id,title])=>({id,title}))}};
unit.learning.SPEAKERS={gary:'Gary',richard:'Richard'};
unit.learning.DIALOGUE=[
['gary','How was the exam, Richard?','Richard，考试考得怎么样？'],
['richard','Not too bad. I think I passed in English and Mathematics. The questions were very easy. How about you, Gary?','不算太坏。我想我的英语和数学及格了。题目很容易。Gary，你觉得怎么样？'],
['gary','The English and Maths papers weren’t easy enough for me. I hope I haven’t failed.','英语和数学试题对我来说不那么容易。我希望别不及格。'],
['richard','I think I failed the French paper. I could answer sixteen of the questions. They were very easy. But I couldn’t answer the rest. They were too difficult for me.','我想我的法语及不了格。我能回答其中16道题，这些题很容易。但我答不出其余的题，那些题对我来说太难了。'],
['gary','French tests are awful, aren’t they?','法语考试太可怕了，你说呢？'],
['richard','I hate them. I’m sure I’ve got a low mark.','我讨厌法语考试。我的成绩肯定很低。'],
['gary','Oh, cheer up! Perhaps we didn’t do too badly. The guy next to me wrote his name at the top of the paper.','啊，别灰心！或许我们考得还不太糟呢。坐在我旁边的那个人在试卷顶部写了自己的名字。'],
['richard','Yes?','是吗？'],
['gary','Then he sat there and looked at it for three hours! He didn’t write a word!','然后他就坐在那里，对着试卷看了3个小时！一个字也没写！']
].map(([who,text,cn],i)=>({id:'u103104-d'+(i+1),who,text,cn,source:textSource}));
const choice=(options,answer,extra={})=>({options,answer,...extra}),blank=(before,after,options)=>({before,after,options}),fill=(blanks,answers)=>({type:'cloze',blanks,answer:JSON.stringify(answers)}),bank=(tokens,answer,slots,suffix='.')=>({type:'wordbank',tokens,slots,answer,suffix}),match=pairs=>({type:'match',pairs:pairs.map(([en,cn],i)=>({id:String(i+1),en,cn})),answer:JSON.stringify(pairs.map((_,i)=>String(i+1)))}),model=(...lines)=>({lines});
const q=(id,target,prompt,input,explanation,hint='')=>{const{context:material,...view}=input;return{id:'u103104-v1-'+id,target,prompt,source:textSource,...view,...(material?{display:{title:prompt,material}}:{}),explanation,hint};};
const g=(id,target,prompt,input,rule,hint='',demo)=>({...q('g-'+id,target,prompt,input,rule,hint),source:grammarSource,workshop:{rule,...(demo?{model:demo}:{})}});
unit.questions.listen=[
q('v-paper','本课paper词义','本课哪一个词表示“试卷”？',choice(['paper','question','mark'],'paper',{optionImages:{paper:image('paper'),question:image('question'),mark:image('mark')}}),'paper作试卷时可数；不是所有paper都指一张试卷。'),
q('v-exam','考试结果与问题词义','把三个词配好。',match([['exam','考试'],['pass','及格；通过'],['fail','未及格；失败']]),'词义与人物实际成绩分开，课文没有公布最终成绩。'),
q('v-rest','rest的当前词义','I couldn’t answer the rest.中的the rest指什么？',choice(['其余的题','休息的时间','试卷最上面'],'其余的题'),'这里是剩下的题，不能套用休息的词义。'),
q('v-answer','answer词义定位','点出表示“回答”的词。',{type:'locate',fragments:['I could ',{value:'answer'},' sixteen of the ',{value:'questions'},'.'],options:['answer','questions'],answer:'answer'},'answer在这里是动词。'),
q('v-low','low的不同语境','a low mark / a low wall分别指什么？',choice(['分数低／墙矮','声音大／墙高','价格高／分数高'],'分数低／墙矮'),'low的具体含义由修饰的对象决定。'),
q('v-cheer','cheer up的语境','Gary说Oh, cheer up!，在做什么？',choice(['鼓励Richard振作','宣布Richard已经及格','让Richard不要再学习'],'鼓励Richard振作'),'鼓励不等于公布分数。'),
q('v-pairs','104课形容词词义','配好这三个形容词。',match([['cheap','便宜的'],['fresh','新鲜的'],['sour','酸的']]),'它们描述价格、新鲜程度和味道，不能互相替代。'),
q('v-stupid','识别贬义词且不从表现贴标签','stupid的词义与使用，哪项准确？',choice(['意为笨的，带贬义；不能由一道题不会就给人贴标签','表示试卷很新鲜','表示某人已得到高分'],'意为笨的，带贬义；不能由一道题不会就给人贴标签'),'保留教材词义，区分某次表现与对人的判断。')
];
unit.questions.roles=[
q('r-english','区分判断与成绩公布','Richard对英语和数学怎样说？',choice(['他认为自己及格了','老师已正式宣布满分','他知道两科都得了零分'],'他认为自己及格了'),'I think保留推测，不能改成成绩已经公布。'),
q('r-gary','辨认不同人物的感受','Gary觉得英语和数学试卷怎样？',choice(['对他不够容易，希望没不及格','每道题都很容易，已确认满分','他明确说没有参加考试'],'对他不够容易，希望没不及格'),'同一试卷对两人可能有不同难度。'),
q('r-sixteen','原文数量与能力','Richard说自己能回答多少道法语题？',choice(['16道','3道','所有题'],'16道'),'能回答16道不等于已确认16道全对，也没有给出总题数。'),
q('r-rest','其余题的指代','Richard说the rest太难，指的是？',choice(['除那16道之外的其余题','全部题都没有一道容易','另外两门考试的全部题'],'除那16道之外的其余题'),'先分清已经说的16道和剩余部分。'),
q('r-opinion','人物评价的边界','French tests are awful是怎样的信息？',choice(['Gary在表达自己的评价','所有法语考试都必然可怕的事实','老师发布的考试规则'],'Gary在表达自己的评价'),'保留原文，不把人物的感受教成普遍事实。'),
q('r-name','先后事件与绝对说法','根据Gary前后两段话，旁边那个人做了什么？',choice(['先写了姓名，之后没有写答题内容','整张纸连名字都没有','先答完全部题，再写姓名'],'先写了姓名，之后没有写答题内容'),'不能只截取didn’t write a word而抹去前面的姓名。'),
q('r-duration','教材开场问题','按课文信息，考试持续多久？',choice(['3小时','16小时','3分钟'],'3小时'),'课文给出for three hours，没有给开始或结束钟点。'),
q('r-outcome','保留未知结果','结尾能否确认Gary和Richard最终都及格？',choice(['不能，文中没有最终成绩','能，Gary的安慰等于正式成绩','能，比别人多写就一定及格'],'不能，文中没有最终成绩'),'想法、希望、确信和安慰都不替代成绩记录。')
];
unit.questions.grammar=[
g('too','too表达超过合适程度','要表达“太重，超过我能提起的程度”，填哪个词？',{...fill([blank('The box is','heavy for me to lift.',['too','very','enough'])],['too']),context:'The box is heavier than I can lift.\nExpress “more than I can manage”.'},'too表示超过此处合适或能承受的程度，放在形容词前。','看任务要求强调的是否是超出限度。',model(['The bag is too big to fit in this locker.','不是只说很大，还说明大到放不进去。'])),
g('very','very不自动表示不能完成','只知道The bag is very heavy.，能确定我一定提不起来吗？',choice(['不能，还需要知道我的能力','能，very必定等于too','能，heavy必定表示任何人都拿不动'],'不能，还需要知道我的能力'),'very加强程度，本身不保证超出某个人的能力。','程度高与超过限度是一回事吗？',model(['This puzzle is very difficult, but Ben can solve it.','很难与能解决可以同时成立。'])),
g('adjective','enough放在形容词后','按“足够大”补全句子。',fill([blank('The box is big','for the book.',['enough','too','very'])],['enough']),'修饰形容词时，enough放在形容词后。','空格前已经有big。',model(['The bag is light enough.','light在前，enough在后。'])),
g('noun','enough修饰名词数量','四个人有四把椅子，表示数量足够。',{...fill([blank('We have','chairs for everyone.',['enough','very','too'])],['enough']),context:'Four people need seats. There are four chairs.'},'本课常用enough＋名词，说明数量足够。','这里修饰的是chairs的数量。',model(['We have enough paper for the activity.','名词paper前放enough。'])),
g('adverb','enough放在副词后','用给定词块说“足够慢地”。',bank(['slowly','enough','too'],'slowly enough',2,''),'修饰副词也放后面：slowly enough。','slowly说明动作怎样进行。',model(['She spoke clearly enough for us to understand.','clearly在前，enough在后。'])),
g('verb','enough可修饰动作完成的量','按“已经练得足够”组织词块。',bank(['We have practised','enough','enoughly'],'We have practised enough',2),'enough也可以放在动词短语后表示做的量足够。','不要给enough再加ly。',model(['I have read enough for today.','enough说明已经读的量。'])),
g('too-person','too…for某人to做某事','箱子对他太重，补好人物与动作。',{...fill([blank('The box is too heavy for','',['him','he']),blank('to',' .',['lift','lifting'])],['him','lift']),context:'Ben cannot lift this box because it is too heavy for him.'},'for后用宾格him，to后接动词原形。','谁提箱子？哪个词后面要原形？',model(['The print is too small for her to read.','for her交代对谁，to read交代做什么。'])),
g('enough-object','enough结构不重复前面的宾语','箱子已在句首，哪句符合本课结构？',choice(['The box is light enough for me to carry.','The box is light enough for I to carry.','The box is light enough for me to carry it.'],'The box is light enough for me to carry.'),'在这个结构中，carry的对象已经是句首the box，不再重复it。','句首已经说明搬的是什么。',model(['The questions are easy enough for us to answer.','这里不再加them。'])),
g('not-enough','not…enough表示未达到需要','书比盒子宽，按“不够大”补全。',{...fill([blank('The box isn’t','enough for the book.',['big','small'])],['big']),context:'The book is 40 cm wide. The box is only 30 cm wide.'},'未达到容纳书所需的大小，用not big enough。','不足的是哪一种程度？',model(['The shelf isn’t low enough for May to reach.','表示高度还不够低，May够不到。'])),
g('opposite','too与not…enough改写保留意思','用not…enough保留“对我太重”的意思。',choice(['It isn’t light enough for me to carry.','It is light enough for me to carry.','It isn’t heavy enough for me to carry.'],'It isn’t light enough for me to carry.',{context:'The case is too heavy for me to carry.'}),'too heavy对应not light enough；不能只替换副词而不核对形容词方向。','heavy与light方向相反。',model(['too short to reach → not tall enough to reach','换结构时一起核对反义词和否定。'])),
g('relative','程度判断与具体人物有关','只按给定预算，书对谁太贵而买不起？',choice(['Paul','Lily','两人都买不起'],'Paul',{context:'Book price: £10\nPaul has £8. Lily has £12.\nThey can spend all this money on the book.'}),'同一价格是否超出能力，要结合各自的预算。','先分别比较书价和两人的钱。',model(['A bag costs £6. Ben has £4: too expensive for Ben.','不把对一个人太贵说成对所有人太贵。'])),
g('could-past','could表示过去的能力','描述她五岁时已经具备的能力。',{...fill([blank('She','read at the age of five.',['could','can','could to'])],['could']),context:'Anna learnt to read at five. We are describing her ability at that past age.'},'过去的能力用could，后接动词原形。','不是在请求别人现在帮忙。',model(['Ben could swim when he was eight.','说明过去会做什么。'])),
g('could-negative','couldn’t与动词原形','当时不会写，但会读，补好前半句。',{...fill([blank('He','',['couldn’t','didn’t could']),blank('','at five, but he could read.',['write','wrote'])],['couldn’t','write']),context:'At five, Ben could read but he did not know how to write.'},'否定用couldn’t，后面仍用write原形。','couldn’t已经包含否定，不再加didn’t。',model(['She couldn’t ride a bike at six.','不是didn’t could，也不是couldn’t rode。'])),
g('could-meanings','同一could的过去能力与现在请求','两句里的could分别做什么？',choice(['A说过去能力，B是现在的礼貌请求','两句都只谈过去能力','两句都已经授予许可'],'A说过去能力，B是现在的礼貌请求',{context:'A: “I could read when I was five.”\nB: Anna asks a classmate now: “Could you read this word for me, please?”'}),'could不仅是过去时形式，也可用于现在的礼貌请求。','看时间和说话人正在做的事。',model(['I could swim at eight.（过去能力）','Could I use your ruler, please?（现在请求许可）'])),
g('permission','用Could I礼貌请求许可','现在向同桌借笔，请用Could I组织问句。',{...bank(['Could I','borrow your pen','please','I could'],'Could I borrow your pen please',3,'?'),context:'You need a pen now. Ask your classmate for permission to borrow theirs.'},'Could I…?请求许可，并不表示已经得到许可。','先问，等待对方回应。',model(['Could I use your dictionary, please?','现在的请求不需要改成过去发生的事。'])),
g('permission-reply','当前许可回应使用can或can’t','第一位同桌同意，第二位暂时不能借出。',{...fill([blank('A: Yes, you',' .',['can','could']),blank('B: Sorry, you','use it now. I need it.',['can’t','couldn’t'])],['can','can’t']),context:'Both questions are “Could I use your ruler now?”\nA agrees. B refuses because B needs the ruler now.'},'问句可以用could，当前明确许可通常用can，拒绝用can’t；不能机械照抄could。','回答的是现在能不能用。',model(['“Could I borrow this book?” — “Yes, you can.”','“Could I use it now?” — “Sorry, you can’t. I’m using it.”'])),
g('independent-enough','独立区分数量与程度位置','补好两种enough结构。',fill([blank('We have','water.',['enough','too']),blank('The water is warm',' .',['enough','very'])],['enough','enough']),'修饰名词water放前；修饰形容词warm放后。'),
g('independent-past','独立回应过去能力问句','她八岁时会游泳，回答过去能力问题。',choice(['Yes, she could.','Yes, she can.','No, she couldn’t.'],'Yes, she could.',{context:'At eight, Anna knew how to swim.\n“Could Anna swim at eight?”'}),'问题明确询问过去能力，按过去事实回应。'),
g('independent-request','独立组织请求帮助','请用Could you请老师解释这个词。',{...bank(['Could you','explain this word','please','You could'],'Could you explain this word please',3,'?'),context:'You do not understand a word now. Politely ask the teacher for help.'},'Could you…?在这里是现在的请求，不是问过去是否会解释。'),
g('independent-structure','独立选择too…for…to结构','字太小，May看不清；选对结构。',choice(['The print is too small for her to read.','The print is too small for she to read.','The print is too small for her to reading.'],'The print is too small for her to read.',{context:'May cannot read the print because it is too small for her.'}),'for后宾格，to后原形；含义仍是她读不清。')
];
unit.questions.apply=[
q('a-quantity','根据所需数量判断enough','四个人各要一张卡，桌上三张。哪句符合？',choice(['There aren’t enough cards.','There are enough cards.','There are too many cards.'],'There aren’t enough cards.',{context:'Four people need one card each.\nThere are three cards on the table.'}),'需要四张、只有三张，数量不足。'),
q('a-size','根据尺寸选择足够大的盒子','只比较给定宽度，哪个盒子能装下这本书？',choice(['A · 内宽30 cm','B · 内宽45 cm'],'B · 内宽45 cm',{context:'Book width: 40 cm\nBox A inside width: 30 cm\nBox B inside width: 45 cm\nBoth boxes have enough height and depth.',optionImages:{'A · 内宽30 cm':image('box-30'),'B · 内宽45 cm':image('box-45')}}),'B宽度足够；材料已明确另外两个方向也足够。'),
q('a-person','对不同人物判断too expensive','票对谁太贵而买不起？',choice(['Mia','Leo','两人都买得起'],'Mia',{context:'Ticket: £10\nMia has £8. Leo has £12.\nThey can use all their money for this ticket.'}),'for谁要由该人的条件决定。'),
q('a-limit','用too明确表达超出限度','要保留“太吵以至于读不下去”，怎样说？',choice(['The music is too loud for Kim to read.','The music isn’t loud enough for Kim to read.','The music is low enough for Kim to read.'],'The music is too loud for Kim to read.',{context:'Kim cannot read because the music is louder than she can manage.'}),'这里表达过量造成困难，不是音量不够大。'),
q('a-past','保持过去能力的肯定与否定','按记录说明May五岁时的能力。',choice(['She could read, but she couldn’t write.','She could write, but she couldn’t read.','She couldn’t read or write.'],'She could read, but she couldn’t write.',{context:'May at five: knew how to read; did not know how to write.'}),'分别保留两种不同能力，不把一项不会推成全部不会。'),
q('a-request','在任务中礼貌请求帮助','你现在听不清，请用Could you请求对方说大声一点。',{...bank(['Could you','speak up','please','You could'],'Could you speak up please',3,'?'),context:'You cannot hear the speaker clearly now.'},'这是当前请求，不是对过去能力的评价。'),
q('a-allow','回应现在的许可请求','你同意对方现在使用字典，怎样明确回应？',choice(['Yes, you can. Here you are.','Yes, you could when you were five.','No, you can’t. I need it.'],'Yes, you can. Here you are.',{context:'A classmate asks: “Could I use your dictionary now?”\nYou agree to lend it now.'}),'明确同意当前许可用can；不把问题的could直接照抄。'),
q('a-encourage','鼓励不等于确认成绩','同伴担心考试结果，成绩还没公布。哪句合适？',choice(['Cheer up. Let’s wait for the results.','You have definitely passed every paper.','Not answering a question means you are stupid.'],'Cheer up. Let’s wait for the results.',{context:'Your friend is worried. The results have not been announced.'}),'可以鼓励，但不能编造及格结果或用一次表现给人贴标签。')
];
unit.questions.exam=[
q('e-result','独立保留人物判断','I think I passed in English and Mathematics.能确认什么？',choice(['Richard认为自己及格，正式成绩仍未给出','老师已宣布他满分','两人都已正式及格'],'Richard认为自己及格，正式成绩仍未给出'),'不能去掉I think的判断边界。'),
q('e-sixteen','独立核对数量和未知项','原文中的sixteen能说明什么？',choice(['Richard说能回答16道，不能据此确定分数或总题数','整份试卷一定只有16道题','他已确认得到16分'],'Richard说能回答16道，不能据此确定分数或总题数'),'能回答的数量不自动等于答对数量或分数。'),
q('e-time','独立核对教材时长','课文给出的考试时长是？',choice(['three hours','sixteen hours','three minutes'],'three hours'),'不添加原文没有的开考钟点。'),
q('e-opinion','独立区分观点与普遍事实','French tests are awful是？',choice(['Gary的评价','所有人的共同事实','学校正式评分规则'],'Gary的评价'),'原文观点不变成普遍结论。'),
q('e-name','独立整合前后叙事','旁边那个人的情况是哪项？',choice(['写了姓名后没有写答题内容','连姓名都没写','明确得到零分'],'写了姓名后没有写答题内容'),'结合前后两处原文；没有公布此人的分数。'),
q('e-too','独立用too表达超出限度','明确表达“太大而放不进去”，填哪个词？',{...fill([blank('The bag is','big to fit in the locker.',['too','very','enough'])],['too']),context:'The bag is bigger than the space inside the locker.\nExpress “beyond the size that fits”.'},'too在这里强调超过能够放入的程度。'),
q('e-very','独立理解very的边界','仅凭The question is very difficult.可以确定每个人都答不出吗？',choice(['不能，very本身不表示所有人都无法完成','能，very与too永远完全相同','能，difficult等于没有答案'],'不能，very本身不表示所有人都无法完成'),'需要具体人物的能力信息。'),
q('e-adjective','独立使用形容词后enough','补全“足够轻”。',fill([blank('The bag is light','for me to carry.',['enough','too','very'])],['enough']),'形容词后用enough。'),
q('e-noun','独立使用名词前enough','表示有足够的时间。',fill([blank('We have','time to finish.',['enough','very','too'])],['enough']),'常见数量结构enough time。'),
q('e-adverb','独立使用副词后enough','按“足够清楚地”拼好表达。',bank(['clearly','enough','very'],'clearly enough',2,''),'副词后放enough。'),
q('e-verb','独立使用动词后enough','用词块表达“已经读得足够”。',bank(['I have read','enough','enoughly'],'I have read enough',2),'enough不需要加ly。'),
q('e-for-to','独立使用宾格与不定式','对他们太重，搬不动。',fill([blank('The table is too heavy for','',['them','they']),blank('to',' .',['move','moving'])],['them','move']),'for them，to move。'),
q('e-object','独立避免重复宾语','哪句正确表达题目足够容易让她回答？',choice(['The questions are easy enough for her to answer.','The questions are easy enough for she to answer.','The questions are easy enough for her to answer them.'],'The questions are easy enough for her to answer.'),'句首questions已经是回答的对象，这个结构不再加them。'),
q('e-not','独立表达程度不足','书宽35 cm，盒内宽25 cm；表示“不够大”。',{...fill([blank('The box isn’t','enough.',['big','small'])],['big']),context:'Book width: 35 cm. Box inside width: 25 cm.'},'不是不够小，而是不够大。'),
q('e-opposite','独立保持相反形容词改写含义','按not…enough改写too high，保留够不到的意思。',choice(['The shelf isn’t low enough for him to reach.','The shelf is low enough for him to reach.','The shelf isn’t high enough for him to reach.'],'The shelf isn’t low enough for him to reach.',{context:'The shelf is too high for Ben to reach.'}),'too high对应not low enough。'),
q('e-person','独立比较人物条件','只按预算，书对谁太贵？',choice(['Tom','Ann','两人都买不起'],'Tom',{context:'Book: £9. Tom has £7. Ann has £11.\nEach can spend all this money on the book.'}),'比较对象与各自条件，不按颜色或人物外貌判断。'),
q('e-past','独立表达过去能力','描述他六岁时就会读。',{...fill([blank('He','read at six.',['could','can','could to'])],['could']),context:'Ben learnt to read at six. Describe his ability at that past age.'},'过去能力could＋原形。'),
q('e-negative','独立表达过去不会','当时她还不会骑车。',fill([blank('She','',['couldn’t','didn’t could']),blank('','a bike at seven.',['ride','rode'])],['couldn’t','ride']),'couldn’t后接原形。'),
q('e-past-yes','独立肯定回应过去能力','他八岁时会弹钢琴，怎样回答？',choice(['Yes, he could.','No, he couldn’t.','Yes, he can.'],'Yes, he could.',{context:'At eight, Tom knew how to play the piano.\n“Could Tom play the piano at eight?”'}),'按给定过去能力回答。'),
q('e-past-no','独立否定回应过去能力','他八岁时不会弹钢琴，怎样回答？',choice(['No, he couldn’t.','Yes, he could.','No, he can’t.'],'No, he couldn’t.',{context:'At eight, Tom did not know how to play the piano.\n“Could Tom play the piano at eight?”'}),'同一问句，事实相反时回应相反。'),
q('e-permission','独立组织许可请求','请用Could I询问现在能否用尺子。',{...bank(['Could I','use your ruler','please','I could'],'Could I use your ruler please',3,'?'),context:'You need a ruler now. Ask a classmate before using theirs.'},'请求不等于已经被允许。'),
q('e-help','独立识别现在请求帮助','同伴现在问Could you explain this word, please?，你愿意帮忙，怎样答？',choice(['Of course. Let me help you.','I could explain it when I was five.','This means you have already passed.'],'Of course. Let me help you.'),'回应当前请求，不转去讲过去能力。'),
q('e-permission-reply','独立给予与拒绝当前许可','按两位物主的明确决定回答。',{...fill([blank('A agrees: Yes, you',' .',['can','could']),blank('B refuses: Sorry, you','use it now.',['can’t','couldn’t'])],['can','can’t']),context:'Both hear: “Could I use your pen now?”\nA lends the pen now. B needs it and does not lend it.'},'现在的许可与拒绝用can／can’t，不机械复述could。'),
q('e-meanings','独立区分could的两种核心用途','A和B的could分别是什么意思？',choice(['A是过去能力，B是现在礼貌请求','A和B都证明已得到许可','A和B都只说过去'],'A是过去能力，B是现在礼貌请求',{context:'A: “I could write when I was six.”\nB, spoken to a teacher now: “Could you write this word for me, please?”'}),'形式相同，意义由具体时间和交际任务决定。')
];
unit.learning.REFERENCE=[
'本课Grammar主线是too与enough及could的两种用法。very强调程度高，too在这里表示超过合适或可承受的程度；very difficult不自动等于某个人一定做不了。too easy也可能表示过于简单，所以too不是只跟负面形容词。',
'too＋形容词／副词，形容词／副词＋enough：too heavy、too quickly；big enough、clearly enough。enough还能修饰动作量，如I have practised enough。表示数量时，本课练常用的enough＋名词，如enough paper、enough chairs。导学也列名词后置写法；本课不拿后置位置本身作为唯一判错依据。',
'常见结构：too…(for somebody) to do…／…enough (for somebody) to do…。for后用宾格，如for him／for us；to后动词原形。The box is light enough for me to carry中，carry的对象已是句首the box，不再重复it。',
'not…enough表示程度或数量不足。保持意思改写时，要核对反义词、否定、人物和动作：too heavy for me to carry可以说not light enough for me to carry。一个盒子对这本书不够大，不代表它对每一本书都不够大。',
'could＋原形可表示过去的能力，否定为couldn’t＋原形，问句为Could＋主语＋原形…?。本课按明确的过去能力练习，不从“现在会”自动推断“过去也会”，也不把会做某事必然理解成已经实际做过。',
'could还可用于现在礼貌地请求许可或帮助：Could I use your pen?／Could you help me?。问句不是过去事件，也不等于已获许可。明确给予当前许可通常说Yes, you can.；拒绝说Sorry, you can’t.等，不机械沿用could。',
'104课保留very、too、enough的完整替换和A6／B12。某些单独空格放very或too都能构成英语句子，例如He was ___ busy；线上若要唯一作答，就明说是在表达“很”还是“超出能做的程度”，或指定所练结构，不能把另一种合法说法一概判为语法错误。',
'paper在本课表示试卷，可数；表示纸这种材料时通常不可数。the rest是其余部分，不等于休息。low可说分数低、音量低或墙矮；hard在梨的语境是硬，不把一个词义套给所有句子。',
'clever和stupid保留教材词义与104课C／D参考，但不把一次答题困难归结为人的固定能力，更不把stupid用作孩子的反馈或称号。原书替换是语言材料，线上练习用清楚的任务条件描述困难。',
'Richard的I think、I’m sure和Gary的I hope／perhaps均按原文保留，不能代替已公布成绩。16是他说能回答的题数，不是已核实的正确数或得分；总题数未给出。末尾先写姓名，后未写答题内容，不能说整张试卷连名字都没有。',
'French tests are awful是人物评价，不是法语考试必然可怕的普遍事实。课文只给三小时时长，不添加开考钟点。课本价格和练习预算均是教材或虚构材料，不代表今天的售价。'
];
unit.learning.MODEL_TITLE='课本小参考 · 104课框架与A–P替换';
unit.learning.DEGREE_MODELS=[['原句／条件','合并表达'],['I could answer the questions. They were very easy.','The questions were easy enough for me to answer.'],['I couldn’t answer the questions. They were too difficult.','The questions were too difficult for me to answer.']];
unit.learning.MODELS=[['A · easy','answer all the questions','容易的','easy'],['B · difficult','answer all the questions','困难的','difficult'],['C · clever','answer all the questions','聪明的（教材用词）','clever'],['D · stupid','answer all the questions','笨的（教材贬义词，不用作同学标签）','stupid'],['E · cheap','buy the car','便宜的（教材图示£150）','car-cheap'],['F · expensive','buy the car','贵的（教材图示£8,000）','car-expensive'],['G · fresh','eat the cakes','新鲜的','fresh'],['H · stale','eat the cakes','不新鲜的','stale'],['I · loud','hear the stereo','音量大的','loud'],['J · low','hear the stereo','音量低的','low-sound'],['K · low','climb the wall','墙矮','low'],['L · high','climb the wall','墙高','high'],['M · soft','eat the pear','软的','soft'],['N · hard','eat the pear','硬的','hard'],['O · sweet','eat the orange','甜的','sweet'],['P · sour','eat the orange','酸的','sour']].map(([en,task,cn,art])=>({en,cn:task+' · '+cn,image:image(art)}));
unit.learning.WRITING=[
{title:'A · 用too、very或enough填空',instruction:'完整保留课本6题。先说清想表达“非常”“超过限度”还是“足够”。部分语境可用不同词形成合理句子，课堂应说明所要表达的意思，不把不同强调一律判错。',examples:[],items:['I couldn’t speak to the boss. He was ________ busy.','I couldn’t go out. It was ________ cold for me to go out.','I could answer all the questions. They were ________ easy.','Is that suitcase light ________ for you to carry?','Is your brother old ________ to be a member of our association?','They couldn’t see that film. They were ________ young.']},
{title:'B · 回答过去能力并说明程度',instruction:'完整保留课本12题和两组例子。按括号提供的Yes／No和形容词回应，for后人物与提问对应；只是阅读和书写，不要求实际搬重物、攀墙或尝试食物。',examples:['Could he answer all the questions? (Yes/easy) → Yes, he could. They were easy enough for him to answer.','Could he answer all the questions? (No/difficult) → No, he couldn’t. They were too difficult for him to answer.'],items:['Could he buy the car? (Yes/cheap)','Could he buy the car? (No/expensive)','Could they eat the cakes? (Yes/fresh)','Could they eat the cakes? (No/stale)','Could they hear the stereo? (Yes/loud)','Could they hear the stereo? (No/low)','Could he climb the wall? (Yes/low)','Could he climb the wall? (No/high)','Could she eat the pear? (Yes/soft)','Could she eat the pear? (No/hard)','Could she eat the orange? (Yes/sweet)','Could she eat the orange? (No/sour)']}
];
core.unit103104=unit;if(typeof document!=='undefined'&&document.documentElement.dataset.unit===unit.id)core.learningContext=unit;
})(globalThis);

// 2026-10-20 reviewed reading excerpts: presentation metadata only.
// Keep scored questions, draft signatures, reward editions and original text intact.
(function(core){
 const unit=core.unit103104,excerpts={"u103104-v1-r-english":[0,1],"u103104-v1-r-gary":[1,2],"u103104-v1-r-sixteen":[3],"u103104-v1-r-rest":[3],"u103104-v1-r-name":[6,7,8],"u103104-v1-r-duration":[6,7,8],"u103104-v1-r-outcome":[0,1,2,3,4,5,6,7,8],"u103104-v1-e-sixteen":[3],"u103104-v1-e-time":[6,7,8]},speakers={"gary":"Gary","richard":"Richard"};
 unit.copy=unit.copy||{};unit.copy.questions=unit.copy.questions||{};
 const questions=Object.values(unit.questions).flat();
 for(const [id,indexes]of Object.entries(excerpts)){
  const question=questions.find(q=>q.id===id),existing=unit.copy.questions[id]||{};
  const lines=indexes.map(index=>{const line=unit.learning.DIALOGUE[index],name=speakers[line.person||line.who];return (name?name+': ':'')+line.text;});
  const prior=existing.material??question.display?.material;
  unit.copy.questions[id]={...existing,title:existing.title||question.display?.title||question.prompt,material:[prior,'Lesson 103',...lines].filter(Boolean).join('\n')};
 }
})(globalThis.CanranCore);
