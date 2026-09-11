'use strict';
// Authored alternatives: each set contrasts the actual target, not random words.
module.exports={
  placementSamplingPolicy:'skipped-first-v1',
  questions:require('./no-keyboard-question-design.json'),
  gaps:{
    'PL12-0':['me','you'], 'PL12-5':['very much','please'],
    'PL12-7':['your','you'], 'PL12-9':['this','your'],
    'CH12-1':['your','you'], 'CH12-3':['coat','dress','shirt'], 'CH12-5':['very','yes'],
    'CH34-1':['my','your'], 'CH34-3':['daughter','son'], 'CH34-5':['and','not'],
    'CH56-1':['She','He','It'], 'CH56-3':['new','nice'], 'CH56-5':['an','a'],
    'CHALL-2':['it','you'], 'CHALL-4':['too','not']
  },
  // The prompt makes the speaker's intent explicit, so both yes and no cannot fit.
  replies:{
    'L01-D04':{prompt:'没有听清楚，想请对方再说一遍，选择合适的回应。',options:['Pardon?','Thank you very much.'],form:'T09'},
    'L01-D06':{prompt:'主人确认：这确实是她的包。她怎样回答 “Is this your handbag?”',options:['Yes, it is.','Pardon?'],form:'T09'},
    'L03-D09':{prompt:'这把伞不是你的。听到 “Is this your umbrella?”，应该怎样回答？',options:["No, it isn't.",'Yes, it is.'],form:'T09'},
    'L05-D08':{prompt:'刚认识一位新同学，选择见面时的招呼。',options:['Nice to meet you.','Pardon?'],form:'T09'}
  },
  keywords:[
    {nodeId:'R01',ref:'L03-D01',words:['coat','umbrella','ticket'],correct:[0,1],prerequisites:['L03-D01','L03-D02']},
    {nodeId:'K04',ref:'NCE-U01-C-Q-COAT',words:['your','coat','dress'],correct:[0,1],prerequisites:['NCE-U01-C-Q-COAT','L02-W06']}
  ],
  soundContrasts:[{nodeId:'L15-REVIEW',refs:['L01-W05','L16-W03'],reason:'this / these：已学指示词的元音和词尾声音不同。'}],
  grammar:{
    s:{form:'T08',mechanism:'cloze',title:'选词补句',prompt:'说说他的喜好：他喜欢鸡肉。',prefix:'He ',suffix:' chicken.',options:['likes','like']},
    correct:{form:'T11',mechanism:'repair',title:'找一找，改一改',prompt:'这句只有一个动词形式需要修改。先点那个词，再选正确的词。',words:['She','does','not','likes','steak.'],wrongIndex:3,options:['like','liking']},
    question:{form:'T07',mechanism:'order',title:'帮他问一问',prompt:'想问他要不要卷心菜。用 Does 开头，按“Does + he + want”的顺序，再接 any cabbage。'},
    'transfer-s':{form:'T01',mechanism:'choice',title:'看场景，选一句',prompt:'她最喜欢吃土豆。选出描述她喜好的句子。',sceneEntityId:'scene-likes-potatoes',options:['She likes potatoes.','She like potatoes.']},
    'transfer-base':{form:'T09',mechanism:'choice',title:'替朋友说明喜好',prompt:'朋友不喜欢卷心菜。选一句，告诉点餐的伙伴。',options:['He does not like cabbage.','He does not likes cabbage.']},
    'transfer-question':{form:'T07',mechanism:'order',title:'问问她的选择',prompt:'鸡肉可以点给她吗？帮大家问她想不想要一些鸡肉，用 any 来提问。'}
  },
  delayed:{
    s:{form:'T08',mechanism:'cloze',title:'帮伙伴补上一句',prompt:'他喜欢卷心菜。',prefix:'He ',suffix:' cabbage.',options:['likes','like']},
    base:{form:'T09',mechanism:'choice',title:'换一位朋友点餐',prompt:'她不喜欢土豆。替她说明喜好。',options:['She does not like potatoes.','She does not likes potatoes.']},
    question:{form:'T07',mechanism:'order',title:'问问伙伴要什么',prompt:'帮他问问：他想要一些鸡肉吗？用 any 来提问。'}
  }
};
