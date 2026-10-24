'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed against the three source books and stated task premises.
// Never obtain expected answers from the runtime answer fields or saved results.
const ANSWERS={
  "listen": [
    {
      "pairs": [
        [
          "excited",
          "兴奋的"
        ],
        [
          "amused",
          "感到有趣的"
        ],
        [
          "embarrassed",
          "尴尬的"
        ]
      ]
    },
    {
      "pairs": [
        [
          "opposite",
          "在……对面"
        ],
        [
          "get on",
          "登上（车等）"
        ],
        [
          "regularly",
          "定期地；经常地"
        ]
      ]
    },
    {
      "locate": "curiously"
    },
    "帽子显得滑稽",
    {
      "pairs": [
        [
          "powder",
          "香粉"
        ],
        [
          "compact",
          "带镜的化妆盒"
        ],
        [
          "smile",
          "微笑"
        ]
      ]
    },
    "和蔼地微笑",
    "把粉盒收好",
    "worried"
  ],
  "roles": [
    "Sally",
    "她以前从未乘过火车",
    "Sally靠窗，女士坐在她对面",
    "火车已经离开车站",
    "她化妆的目的",
    "收好自己的粉盒，并和蔼地微笑",
    "这是Sally说出的外貌评价",
    "Sally觉得有趣，妈妈感到尴尬"
  ],
  "grammar": [
    "Anna was invited by Tom.",
    {
      "fills": [
        "is",
        "are"
      ]
    },
    {
      "fills": [
        "was",
        "were"
      ]
    },
    {
      "fills": [
        "taken"
      ]
    },
    [
      "The wall",
      "is being",
      "painted",
      "now"
    ],
    [
      "The letter",
      "will be",
      "sent",
      "tomorrow"
    ],
    "两句语法都成立，第二句还说明了修理者",
    {
      "fills": [
        "I am"
      ]
    },
    [
      "The lights",
      "were",
      "turned on",
      "yesterday"
    ],
    {
      "fills": [
        "was not"
      ]
    },
    "Was the letter sent yesterday?",
    "A说明感受，B说明收到邀请的动作",
    "The room is cleaned every day.",
    {
      "fills": [
        "Yes",
        "No"
      ]
    },
    {
      "fills": [
        "four-year-old",
        "four years old"
      ]
    },
    {
      "fills": [
        "him"
      ]
    }
  ],
  "apply": [
    "Room B",
    "Sam was invited by Mia.",
    "It was repaired by Ben.",
    {
      "fills": [
        "will be",
        "sent"
      ]
    },
    [
      "The lights",
      "were",
      "turned off",
      "last night"
    ],
    "解释Sally为何兴奋；没有明确说明妈妈为何选择火车",
    "女士当时穿着蓝色外套",
    {
      "fills": [
        "is",
        "are"
      ]
    }
  ],
  "exam": [
    {
      "pairs": [
        [
          "worried",
          "担心的"
        ],
        [
          "regularly",
          "定期地；经常地"
        ],
        [
          "compact",
          "带镜的化妆盒"
        ]
      ]
    },
    {
      "fills": [
        "is",
        "are"
      ]
    },
    {
      "fills": [
        "were",
        "was"
      ]
    },
    {
      "fills": [
        "taken"
      ]
    },
    "The bike is being repaired now.",
    [
      "The message",
      "will be",
      "sent",
      "tomorrow"
    ],
    "两句都可用，B还给出具体行动者",
    {
      "fills": [
        "We were"
      ]
    },
    [
      "The taps",
      "were",
      "turned on",
      "this morning"
    ],
    {
      "fills": [
        "were not"
      ]
    },
    "Was the car repaired yesterday?",
    "A描述感受，B说明接受了帮助",
    "The windows are checked every day.",
    {
      "fills": [
        "Yes",
        "No"
      ]
    },
    {
      "fills": [
        "five-year-old",
        "five years old"
      ]
    },
    "火车离站在先，女士拿出粉盒在后",
    "Sally作出了这个评价，不能推出所有人都这样认为",
    "不能，这里说明女士的目的",
    "妈妈决定坐火车；选择火车的具体原因未明说",
    "Mia was helped by Sam.",
    {
      "fills": [
        "them"
      ]
    }
  ]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit141-142/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit141-142/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
