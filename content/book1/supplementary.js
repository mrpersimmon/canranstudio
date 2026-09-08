'use strict';
// Even-lesson number labels and verb tables are retained as reference.
// Time tasks use authored examples of the textbook's clock-reading patterns.
module.exports={
  ordinals:{
    52:['twentieth','twenty-first','twenty-second','twenty-third','twenty-fourth','twenty-fifth','twenty-sixth','twenty-seventh','twenty-eighth','twenty-ninth','thirtieth','thirty-first'].map((word,i)=>[word,20+i]),
    54:[['twentieth',20],['thirtieth',30],['fortieth',40],['fiftieth',50],['sixtieth',60],['seventieth',70],['eightieth',80],['ninetieth',90],['one hundredth',100],['one hundred and first',101],['one hundred and second',102],['one hundred and third',103]],
    56:[['first',1],['second',2],['third',3],['fourth',4],['twenty-first',21],['twenty-second',22],['twenty-third',23],['twenty-fourth',24],['thirty-first',31],['thirty-second',32],['thirty-third',33],['thirty-fourth',34]],
    62:[['forty-first',41],['fifty-second',52],['sixty-third',63],['seventy-fourth',74],['eighty-fifth',85],['ninety-sixth',96],['one hundred and seventh',107],['one hundred and eighteenth',118]]
  },
  numbers:{
    64:[110,221,332,443,554,665,776,887,998],
    74:[101,102,103,104,105,106,107,108],
    76:[109,110,111,112,113,114,115,116,117,118,119,120,121,122,123],
    80:[120,121,122,123,124,125,226,227,228,229,230,231,332,333,334,335,336,437,438,439,440,441,543,544,545,546],
    82:[760,870,980,1010,1020,1030,1040,1050,1060,1070,1080,1090],
    84:Array.from({length:20},(_,i)=>(i+1)*1000)
  },
  examples:{
    57:`It is half past seven.|现在是七点半。|half past|half to/quarter to|half past seven 是七点半。
It is a quarter past eight.|现在是八点一刻。|a quarter past|a quarter to/half past|past 表示过了，八点一刻是 a quarter past eight。`,
    59:`It is a quarter to nine.|现在是差一刻九点。|to|past/at|差一刻到九点，用 a quarter to nine。
It is twenty past ten.|现在是十点二十。|twenty past|twenty to/half past|十点过二十分，用 twenty past ten。`,
    65:`She must arrive at a quarter past one.|她必须在一点一刻到达。|at|in/on|具体时刻前用 at。
We must leave at a quarter to four.|我们必须在差一刻四点离开。|a quarter to four|a quarter past four/half past four|差一刻四点是三点四十五分。`,
    67:`I was at home at half past five.|五点半时我在家。|at|on/in|具体时刻前用 at。
She was at school on January first.|一月一日她在学校。|on|in/at|具体日期前用 on。`,
    87:`She has already sent the letter.|她已经寄出那封信了。|sent|send/sending|send 的过去式和过去分词都是 sent。
He swept the floor yesterday.|他昨天扫了地。|swept|sweep/sweeps|sweep 的过去式是 swept。`,
    89:`I have read this book.|我读过这本书。|read|reading/reads|read 的过去分词拼写不变，读音与 red 相同。
She has already done her homework.|她已经做完作业了。|done|did/do|do 的过去分词是 done。`,
    95:`It is ten to six.|现在是差十分六点。|to|past/on|ten to six 是五点五十分。
It is five past eight.|现在是八点零五分。|past|to/at|five past eight 是八点过五分。`
  },
  translationAlternatives:{
    57:{7:['It is eight fifteen.','It is quarter past eight.']},
    59:{7:['It is ten twenty.']},
    65:{7:['We must leave at three forty-five.','We must leave at quarter to four.']},
    67:{7:['She was at school on the first of January.','She was at school on January the first.','She was at school on January 1st.']},
    95:{7:['It is eight oh five.','It is eight zero five.']}
  },
  tables:{
    88:[
      ['buy → bought → bought','买'],['find → found → found','找到'],['get → got → got','得到'],['have → had → had','有；进行'],['hear → heard → heard','听见'],['leave → left → left','离开'],['lose → lost → lost','丢失'],['make → made → made','制作'],['meet → met → met','遇见'],['send → sent → sent','寄送'],['sweep → swept → swept','打扫'],['tell → told → told','告诉']
    ],
    90:[
      ['cut → cut → cut','切'],['put → put → put','放'],['read → read → read','读：原形读 /riːd/，过去式和过去分词读 /red/'],['set → set → set','落下；放置'],['shut → shut → shut','关闭'],['do → did → done','做'],['come → came → come','来'],['give → gave → given','给'],['swim → swam → swum','游泳'],['take → took → taken','拿'],['eat → ate → eaten','吃'],['go → went → gone','去'],['rise → rose → risen','升起'],['see → saw → seen','看见'],['speak → spoke → spoken','说']
    ]
  }
};
