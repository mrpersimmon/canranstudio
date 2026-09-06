'use strict';
// Numbers printed beside the even-lesson illustrations. We introduce a small
// representative group on the path and retain the complete set for replay.
module.exports={
  numbers:{
    8:[11,12,13,14,15,16,17,18,19,20],10:[21,22],12:[22,23,24,25,26,27,28,29,30,31],
    14:[20,30,40,50,60,70,80,90,100,101],16:[20,30,40,50,60,70,80,90,100,101,102,103,104,105,106,107,108,109,110],
    18:[100,200,300,400,500,600,700,800,900,1000,1001,1002,1003,1004,1005],
    20:[105,106,217,218,321,322,433,434,545,546,657,658,769,770,881,882,998,999,1000,1001],
    22:Array.from({length:16},(_,i)=>1001+i),24:[1117,1218,1319,1420,1521,1622,1723,1824,1925,2000],
    26:[3000,4000,5000,6000,7000,8000,9000,10000],28:[1120,2230,3340,4450,5560,6670,7780,8890,9999,10001],
    32:[20000,30000,40000,50000,60000,70000,80000,90000,100000,200000,300000,400000,500000,600000,700000,800000,900000,1000000],
    34:[220231,331342,442453,553564,664675,775786,886897,997998,1000001,1100000,1500000,2000000],
    36:[1,2,3,4,5,6,7,8,9,10,11,12],38:[1,2,3,4,5,6,7,8,9,10,11,12],
    40:[13,14,15,16,17,18,19,20,30,40,50,60],42:[13,14,15,16,17,18,19,20,30,40,50,60,70,80,90,100],
    44:[70,80,90,100,200,300,400,500,600,700,800,900],
    46:[1000,5000,10000,100000,210000,350000,500000,1000000]
  },
  ordinals:{48:['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth'],50:['thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth','twenty-first','twenty-second','twenty-third','twenty-fourth']},
  examples:{
    7:`What is her job?|她的职业是什么？|her|she/he|名词 job 前面用 her，表示她的。
He is an engineer.|他是一名工程师。|an|a/some|engineer 以元音音素开头，用 an。`,
    11:`Is this your umbrella?|这是你的雨伞吗？|your|you/yours|umbrella 前用 your。
It is my father's suit.|它是我爸爸的西装。|father's|father/fathers|单个所有者后加 ’s。`,
    17:`They are not mechanics. They are sales reps.|他们不是机械师，他们是销售代表。|not|no/yes|先否定，再给出正确职业。
These women are keyboard operators.|这些女士是键盘操作员。|women|woman/man|woman 的复数为 women。`,
    19:`Are the shoes dirty or clean?|这些鞋脏还是干净？|or|and/but|二选一的问题用 or。
They are not dirty. They are clean.|它们不脏，很干净。|not|no/yes|先否定错误描述，再说明真实状态。`,
    21:`Give him a new book.|给他一本新书。|him|he/his|give 后面的人用 him。
Give us a clean cup.|给我们一个干净的杯子。|us|we/our|give 后面用 us，表示我们。`,
    23:`Give them some spoons.|给他们一些勺子。|them|they/their|动词 give 后用宾格 them。
Give her some books.|给她一些书。|her|she/hers|动作的接受者用 her。`,
    25:`There is a book on the table.|桌子上有一本书。|a|an/some|第一次提到一本书，用 a book。
The book is red.|那本书是红色的。|The|An/Some|再次提到已知的那本书，用 the book。`,
    27:`Are there any plates in the kitchen?|厨房里有盘子吗？|Are|Is/Am|plates 是复数，询问用 Are there any。
There are not any books on the table.|桌子上没有书。|any|a/an|否定句用 not any，books 用复数。`,
    29:`Take off your coat.|脱下你的外套。|off|on/in|take off 表示脱下。
Turn on the stereo.|打开音响。|on|off/under|turn on 表示打开电器。`,
    31:`She is not emptying the basket.|她不是在倒空篮子。|emptying|empty/empties|is not 后面仍用 -ing。
He is cleaning his teeth.|他正在刷牙。|teeth|tooth/ tooths|tooth 的复数是 teeth。`,
    35:`They are coming out of the building.|他们正从大楼里出来。|out of|into/along|从里面出来用 out of。
She is sitting beside her mother.|她正坐在妈妈旁边。|beside|between/into|旁边用 beside。`,
    37:`What are you doing now?|你现在正在做什么？|doing|do/does|doing now 询问当前动作。
What are you going to do?|你打算做什么？|do|doing/does|going to do 询问将来的打算。`,
    39:`I am going to put them on.|我打算穿上它们。|them|they/their|them 代替复数衣物，放在 put 和 on 之间。
I am going to turn it off.|我打算关掉它。|off|on/in|turn it off 中 it 放在动词与 off 之间。`,
    41:`There is a bottle of milk.|有一瓶牛奶。|bottle|loaf/bar|一瓶牛奶用 a bottle of milk。
There is not any tea.|没有茶叶。|any|a/an|否定句的不可数名词前用 any。`,
    43:`There are some knives, but there are not any forks.|有一些刀，但没有叉子。|knives|knifes/knife|knife 的复数为 knives。
I can see some dishes.|我能看见一些盘子。|dishes|dish/dishs|dish 的复数加 es。`,
    45:`We can wash the dishes.|我们会洗盘子。|can|are/is|can 后接 wash 原形。
She can make cakes, but she cannot make biscuits.|她会做蛋糕，但不会做饼干。|cannot|can/is|后半句表达不会，用 cannot。`,
    47:`I like apples, but I do not want one.|我喜欢苹果，但现在不想要一个。|want|like/am|like 是喜好，want 是现在想要。
I like butter, but I do not want any.|我喜欢黄油，但现在不想要。|any|one/a|butter 不可数，不能用 one 代替一件。`,
    49:`Does she like tomatoes?|她喜欢西红柿吗？|Does|Do/Is|第三人称单数问句用 Does。
She likes pears, but she does not want any.|她喜欢梨，但现在不想要。|want|wants/wanting|does not 后用 want 原形。`
  }
};
