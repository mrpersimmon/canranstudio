'use strict';
// Authoritative authored learning tasks. Each example is introduced before any
// independent challenge. Correct answer is first here; runtime shuffles options.
// examples: English | Chinese task | tested span | distractors | explanation.
// checks: last heard line number | question | correct | distractors | explanation.
module.exports = [
{lesson:7,title:'认识新同学',scene:'arrival',goal:'介绍姓名、国籍和职业',note:'I am / You are 用来介绍身份。an engineer 用 an；a teacher 用 a。问职业用 What’s your job?，问国籍用 What nationality are you?。',checks:`
10|罗伯特来自哪里？|意大利|法国/中国|他说自己是 Italian，意大利人。
16|罗伯特的职业是什么？|工程师|老师/键盘操作员|Robert 是 engineer；Sophie 才是 keyboard operator。`,examples:`
I am an engineer.|我是一名工程师。|am|is/are|I 后面用 am。
Are you a nurse?|你是一名护士吗？|Are|Is/Am|询问“你是……吗”用 Are you …?
I am not a teacher.|我不是一名老师。|not|no/yes|在 am 后面加 not，表达“不是”。
What is your job?|你的职业是什么？|job|name/nationality|询问职业用 job；name 问姓名。`},
{lesson:9,title:'今天怎么样？',scene:'arrival',goal:'问候并描述人物的状态',note:'How are you? 问候身体或近况；I’m fine./I’m very well. 可以回答。He is / She is 描述一个人；tall/short、hot/cold 等成对理解。',checks:`
6|听到“How are you?”，对方在问什么？|你最近好吗|你做什么工作/你叫什么名字|这是问候近况，不是在问身份。
14|最后，他们在做什么？|互相告别|询问工作/认领衣服|Goodbye 表示告别；Nice to see you 表达见到对方很高兴。`,examples:`
I am very well.|我很好。|well|cold/busy|回答近况时可以说 I am very well.
She is tall.|她个子高。|tall|short/dirty|tall 表示高；short 表示矮。
He is not busy.|他不忙。|not|no/yes|is not 表达“不是、不处于某状态”。
Is she cold?|她冷吗？|Is|Are/Am|主语 she 搭配 is，问句把 is 放前面。`},
{lesson:11,title:'这是谁的衣服？',scene:'clothes',goal:'辨认物主，区分 my、your、his 和 her',note:'Whose …? 问“谁的”。my/your/his/her 放在名词前。Tim’s shirt 表示蒂姆的衬衫，所有者的名字后加 ’s。',checks:`
8|戴夫的衬衫是什么颜色？|蓝色|白色/绿色|Dave 说他的衬衫是 blue。
16|这件白衬衫属于谁？|蒂姆|戴夫/老师|老师问 Tim 这是不是他的衬衫，Tim 回答 Yes, sir.。`,examples:`
This is his shirt.|这是他的衬衫。|his|her/your|his 表示“他的”。
This is her blouse.|这是她的女衬衫。|her|his/my|her 表示“她的”。
Whose tie is this?|这是谁的领带？|Whose|What/How|问物主用 Whose。
It is my brother's tie.|它是我哥哥的领带。|brother's|brother/brothers|一个哥哥的物品用 brother’s。`},
{lesson:13,title:'搭配喜欢的颜色',scene:'clothes',goal:'用颜色描述物品并理解 same',note:'What colour is …? 问单个物品的颜色。the same colour 表示相同颜色；green 既能作颜色名，也能放在名词前。',checks:`
6|安娜的新连衣裙是什么颜色？|绿色|蓝色/白色|Anna 说 It’s green.
13|帽子与连衣裙的颜色有什么关系？|颜色相同|帽子更深/颜色不同|the same colour 表示颜色相同。`,examples:`
What colour is your hat?|你的帽子是什么颜色？|colour|job/name|问颜色用 What colour …?
My hat is green.|我的帽子是绿色的。|green|white/blue|green 是绿色。
This is a brown case.|这是一个棕色的箱子。|brown|green/blue|颜色词可以放在物品名称前面。
They are the same colour.|它们的颜色相同。|same|smart/lovely|the same colour 表示同一种颜色。`},
{lesson:15,title:'一起通过海关',scene:'customs',goal:'介绍多个人，辨认这些与那些',note:'I am 变成多人时用 We are；He/She is 变成多人时用 They are。these 指这些，those 指那些；复数物品搭配 are。',checks:`
10|同行的朋友是哪里人？|挪威人|丹麦人/法国人|They are Norwegian 说的是朋友的国籍。
18|旅行者的箱子是什么颜色？|棕色|黑色/蓝色|Our cases are brown. 指他们自己的箱子。`,examples:`
We are tourists.|我们是游客。|are|is/am|we 搭配 are，tourist 要用复数 tourists。
Are these your passports?|这些是你们的护照吗？|these|this/that|passports 是复数，搭配 these。
Our cases are brown.|我们的箱子是棕色的。|Our|We/They|名词前用物主词 our。
They are not Danish.|他们不是丹麦人。|not|no/yes|are 后加 not 构成否定。`},
{lesson:17,title:'参观新办公室',scene:'office',goal:'介绍不同岗位的人，巩固复数身份句',note:'Who are they? 问多人身份；What are their jobs? 问多人职业。employees、assistants 等复数通常加 s；man 的复数是 men。',checks:`
10|妮可拉和克莱尔做什么工作？|键盘操作员|销售代表/办公室助理|介绍她们时使用 keyboard operators。
18|吉姆是什么岗位？|办公室助理|销售代表/教师|Jim is our office assistant.`,examples:`
They are office assistants.|他们是办公室助理。|are|is/am|they 后用 are，职业名词用复数。
These men are sales reps.|这些男士是销售代表。|men|man/woman|man 的复数形式是 men。
What are their jobs?|他们的职业是什么？|their|they/them|their 放在名词 jobs 前。
The employees are hard-working.|这些雇员工作勤奋。|hard-working|thirsty/lazy|hard-working 表示勤奋。`},
{lesson:19,title:'休息一下，再出发',scene:'rest',goal:'理解需要，用形容词描述一组人或物',note:'What’s the matter? 问怎么了。tired 是累，thirsty 是渴。they are + 形容词描述一组人或物；形容词本身不加复数 s。',checks:`
7|孩子们一开始怎么了？|又累又渴|又冷又忙/又饿又热|孩子们说 tired 和 thirsty。
14|妈妈给孩子们买了什么？|两个冰淇淋|两杯茶/两个苹果|Two ice creams please. 表达需要两个。`,examples:`
We are tired and thirsty.|我们又累又渴。|thirsty|busy/dirty|thirsty 表示口渴。
The boxes are heavy.|这些箱子很重。|heavy|light/empty|heavy 与 light 是相反的轻重状态。
Are the shops open?|这些商店开着门吗？|open|shut/small|open 与 shut 是相反状态。
These shoes are small.|这些鞋很小。|are|is/am|shoes 是复数，动词用 are。`},
{lesson:21,title:'选对那一本',scene:'library',goal:'用 which 和 one 说清楚要哪一个',checks:`
4|他想要哪本书？|红色的那本|蓝色的那本/绿色的那本|The red one 指红色的那本书。
8|“This one?”中的 one 指什么？|一本书|一个人/一个杯子|one 代替刚刚提到的 book。`,examples:`
Give me a small box.|给我一个小盒子。|small|large/full|形容词放在名词 box 前。
Give me an empty glass.|给我一个空玻璃杯。|an|a/some|empty 以元音音素开头，前面用 an。
The red one is full.|红色的那个是满的。|full|empty/blunt|full 和 empty 分别表示满和空。
Which knife is sharp?|哪把刀是锋利的？|Which|Whose/How|问“哪一把”用 Which。`},
{lesson:23,title:'说清楚是哪一些',scene:'library',goal:'用 ones 和位置描述多个物品',checks:`
5|他要的玻璃杯在哪里？|架子上|桌子上/地板上|The ones on the shelf. 明确了架子上的那些。
9|这里为什么用 ones？|代替多个玻璃杯|表示一个玻璃杯/表示一个架子|glasses 是复数，所以用 ones。`,examples:`
Give me some plates.|给我一些盘子。|some|a/an|plates 是复数，不能搭配 a/an。
The ones on the table.|桌子上的那些。|ones|one/it|代替复数物品用 ones。
These magazines are on the bed.|这些杂志在床上。|on|under/in|on 表示放在表面上。
Which glasses are clean?|哪些玻璃杯是干净的？|are|is/am|glasses 为复数，搭配 are。`},
{lesson:25,title:'走进史密斯家的厨房',scene:'kitchen',goal:'描述房间里有什么以及单个物品的位置',checks:`
7|蓝色的电灶在哪边？|左边|右边/房间中央|The cooker is blue. It is on the left.
12|桌上的瓶子是什么状态？|空的|满的/脏的|The bottle is empty.`,examples:`
There is a cup on the table.|桌子上有一个杯子。|is|are/am|a cup 是单数，用 There is。
The refrigerator is on the right.|冰箱在右边。|right|left/middle|on the right 表示在右边。
Where is the bottle?|瓶子在哪里？|Where|Who/Whose|询问地点用 Where。
The cooker is in the kitchen.|炉灶在厨房里。|in|under/across|房间里面用 in。`},
{lesson:27,title:'客厅里的线索',scene:'living-room',goal:'区分 there is 与 there are，描述复数物品的位置',checks:`
6|桌子上放着什么？|报纸|杂志/书|报纸在桌上，杂志在电视机上。
13|书放在哪里？|音响上|桌子上/电视机上|There are some books on the stereo.`,examples:`
There are some pictures on the wall.|墙上有一些画。|are|is/am|some pictures 是复数，用 are。
The armchairs are near the table.|扶手椅在桌子旁边。|near|under/into|near 表示靠近。
Where are the trousers?|长裤在哪里？|are|is/am|trousers 按复数使用。
There is a stereo near the door.|门边有一套音响。|is|are/am|a stereo 是单数，仍用 is。`},
{lesson:29,title:'一起整理房间',scene:'bedroom',goal:'理解指令并区分不同动作',checks:`
6|衣服应该放在哪里？|衣柜里|床上/窗外|put these clothes in the wardrobe。
9|最后要怎样清洁地板？|扫地|掸灰/整理床铺|sweep the floor 是扫地。`,examples:`
Open the window, please.|请打开窗户。|Open|Shut/Read|窗户的“打开”用 open。
Turn off the television.|关掉电视机。|off|on/in|turn off 是关电器，turn on 是打开。
I must make the bed.|我必须整理床铺。|make|making/makes|must 后用动词原形。
Put these clothes in the wardrobe.|把这些衣服放进衣柜。|wardrobe|refrigerator/basket|衣柜是 wardrobe。`},
{lesson:31,title:'花园里正在发生什么',scene:'garden',goal:'用现在进行时说动作，区分人物和宠物',checks:`
7|谁正在爬树？|蒂姆|萨莉/宠物猫|Tim is climbing the tree. 萨莉坐在树下。
14|小狗正在做什么？|追着宠物猫跑|坐在树下/爬树|It’s running after a cat.`,examples:`
She is sitting under the tree.|她正坐在树下。|sitting|sit/sits|is 后用 sitting，注意双写 t。
He is typing a letter.|他正在打一封信。|typing|type/types|type 变 typing 时去掉末尾 e。
The dog is eating a bone.|小狗正在吃骨头。|eating|eat/eats|is eating 表示正在吃。
What is she doing?|她正在做什么？|doing|do/does|询问正在做什么：What is she doing?`},
{lesson:33,title:'桥上的一家人',scene:'bridge',goal:'描述多个角色正在做什么和移动方向',checks:`
6|一家人正在哪里走？|桥上|桥下/河里|They are walking over the bridge.
10|大船和飞机分别从哪里经过？|大船从桥下，飞机从河上方|大船从桥上，飞机从河下/它们都从桥上|under the bridge 与 over the river 描述不同位置。`,examples:`
They are walking over the bridge.|他们正从桥上走过。|are|is/am|They 搭配 are。
The ship is going under the bridge.|大船正从桥下驶过。|under|over/near|under 表示在下面通过。
The children are sleeping.|孩子们正在睡觉。|sleeping|sleep/sleeps|are sleeping 表示正在睡觉。
What are they doing?|他们正在做什么？|are|is/am|多人用 What are they doing?`},
{lesson:35,title:'沿着河岸逛村庄',scene:'village',goal:'区分沿着、横穿、进入与出来',checks:`
9|男孩怎样游过河？|横穿河流|沿河岸步行/在桥上走|across 是从一边到另一边。
15|孩子们从哪里出来，往哪里去？|从学校出来，走进公园|从公园出来，走进学校/从河里出来，走进学校|out of the building 与 into the park。`,examples:`
The village is between two hills.|村庄在两座小山之间。|between|under/into|between 表示两者之间。
We are walking along the river.|我们正沿着河走。|along|across/into|沿着河的方向用 along。
He is swimming across the river.|他正在游过河。|across|along/beside|横穿到另一边用 across。
They are going into the park.|他们正走进公园。|into|off/out of|into 是从外面进入里面。`},
{lesson:37,title:'给苏珊做一个书架',scene:'bookcase',goal:'区分正在进行和未来打算',checks:`
10|乔治需要哪把锤子？|大的那把|小的那把/两把都要|The big one.
18|书架为什么要漆成粉红色？|这是苏珊最喜欢的颜色|这是丹最喜欢的颜色/因为已经漆好了|书架是给女儿 Susan 的，Pink’s her favourite colour。`,examples:`
I am making a bookcase.|我正在做一个书架。|making|make/makes|am making 是现在正在做。
I am going to paint it pink.|我打算把它漆成粉红色。|paint|painting/paints|going to 后面用动词原形。
She is going to do her homework.|她打算做家庭作业。|do|doing/does|be going to do 表示打算做。
We are going to listen to the stereo.|我们打算听音响。|to|at/in|listen to 是“听”的固定搭配。`},
{lesson:39,title:'花瓶应该放哪里',scene:'vase',goal:'理解否定指令和物品代词',checks:`
6|萨姆最初想把花瓶放在哪里？|窗户前面|衣柜里面/门后面|他说 in front of the window，后面还会改变。
13|花瓶最后放在哪里？|架子上|窗户前的桌子上/地板上|Penny 改了位置：on this shelf。`,examples:`
Do not put it there.|不要把它放在那里。|not|no/yes|否定指令用 Do not 或 Don’t。
Give it to me.|把它给我。|me|I/my|to 后面用 me，不能用 I 或 my。
I am going to show it to her.|我打算把它给她看。|her|she/hers|to 后面用宾格 her。
Put the vase on the shelf.|把花瓶放在架子上。|shelf|floor/bed|根据中文目标选择 shelf。`},
{lesson:41,title:'袋子里装了什么',scene:'pantry',goal:'用量词描述食物，区分可数与不可数',checks:`
9|面包的数量怎样表达？|a loaf of bread|a bottle of bread/a bar of bread|一条面包用 a loaf of bread。
16|“Not very.”说明什么？|包不太重|包里没有东西/包非常重|回答 heavy 的程度：不太重。`,examples:`
There is some cheese in the bag.|袋子里有一些奶酪。|some|a/an|cheese 通常不可数，不直接加 a。
Is there any milk?|有牛奶吗？|any|a/an|这里询问是否有牛奶，用 any。
Give me a loaf of bread.|给我一条面包。|loaf|bottle/bar|bread 的计量搭配是 a loaf of。
There is a bar of soap.|有一块肥皂。|bar|loaf/bottle|一块肥皂用 a bar of soap。`},
{lesson:43,title:'找到茶叶和茶杯',scene:'tea',goal:'用 can 表达能力，询问是否有物品',checks:`
8|茶叶放在哪里？|茶壶后面|橱柜里面/水壶里面|behind the teapot；teapot 与 kettle 不同。
17|茶杯在哪里？|橱柜里|桌子上/椅子上|There are some in the cupboard.`,examples:`
Are there any cups in the cupboard?|橱柜里有茶杯吗？|Are|Is/Am|cups 是复数，用 Are there。
Is there any water in the kettle?|水壶里有水吗？|Is|Are/Am|water 是不可数名词，用 Is there。
I can see the teapot.|我能看见茶壶。|see|seeing/sees|can 后接动词原形。
The tea is behind the teapot.|茶叶在茶壶后面。|behind|under/in|behind 表示在后面。`},
{lesson:45,title:'为什么打不了这封信',scene:'letter',goal:'表达能力与请求，理解不能完成的原因',checks:`
9|老板希望帕梅拉做什么？|打这封信|寄一个包裹/煮一杯茶|type this letter 表示把信打出来。
18|她最后不能打信的原因是什么？|看不懂老板的字迹|她不会打字/她不在办公室|会打字，但看不懂 handwriting；不要把任务受阻当作没有能力。`,examples:`
Can you type this letter?|你能打这封信吗？|type|typing/types|can 后接动词原形。
She cannot read the letter.|她看不懂这封信。|cannot|can/is|cannot 表示不能，也可以写 can’t。
Can he lift the box?|他能举起这个箱子吗？|lift|lifts/lifting|can 不随 he 改变，后面仍用 lift。
Yes, of course I can.|是的，我当然能。|can|am/do|回答 Can you …? 用 I can。`},
{lesson:47,title:'说出你的喜好',scene:'coffee',goal:'区分通常喜欢与现在想要',checks:`
10|安的咖啡里要加什么？|加糖，不加奶|加奶，不加糖/糖和奶都加|她接受 sugar，拒绝 milk，喜欢 black coffee。
14|对方递来饼干，安怎样接受？|Yes, please.|No, thank you./I am a teacher.|接受给予用 Yes, please.`,examples:`
Do you like apples?|你喜欢苹果吗？|Do|Are/Is|问日常喜好用 Do you like …?
I do not like milk.|我不喜欢牛奶。|not|no/yes|do not like 表示不喜欢。
Do you want a biscuit?|你想要一块饼干吗？|want|are/is|want 表示现在想要。
Yes, please.|好的，请给我。|please|thanks/not|接受给予，用 Yes, please.。`},
{lesson:49,title:'替家人挑选食物',scene:'market',goal:'用第三人称谈喜好，综合前五十课',checks:`
9|伯德太太和丈夫都喜欢羊肉吗？|太太喜欢，丈夫不喜欢|两人都喜欢/两人都不喜欢|I like lamb, but my husband doesn’t.
15|丈夫喜欢什么，不喜欢什么？|喜欢牛排，不喜欢鸡肉|喜欢鸡肉，不喜欢牛排/两样都不喜欢|likes steak，doesn’t like chicken。`,examples:`
He likes steak.|他喜欢牛排。|likes|like/liking|主语 he，肯定句 like 加 s。
She does not like cabbage.|她不喜欢卷心菜。|like|likes/liking|does not 后恢复动词原形 like。
Does he want any potatoes?|他想要一些土豆吗？|Does|Do/Is|主语 he，用 Does … want?。
I do not like chicken either.|我也不喜欢鸡肉。|either|too/very|否定句末的“也不”用 either。`}
];
