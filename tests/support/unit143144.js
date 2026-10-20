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
          "wood",
          "树林"
        ],
        [
          "city",
          "城市"
        ],
        [
          "beauty spot",
          "风景点"
        ]
      ]
    },
    {
      "pairs": [
        [
          "surround",
          "环绕"
        ],
        [
          "place",
          "放置"
        ],
        [
          "cover",
          "覆盖"
        ]
      ]
    },
    {
      "locate": "Among"
    },
    "穿行于树林之中",
    {
      "pairs": [
        [
          "litter basket",
          "废物筐"
        ],
        [
          "tyre",
          "轮胎"
        ],
        [
          "tin",
          "罐头盒；金属罐"
        ]
      ]
    },
    {
      "fills": [
        "hundred",
        "hundreds"
      ]
    },
    "罐头盒生锈了",
    "依法提出起诉"
  ],
  "roles": [
    "被美丽树林环绕的一座古老小镇",
    "游览小镇并在树林中散步",
    "保持树林整洁的要求已经传达给游客",
    "放在树下，但作者看到它们是空的",
    "在树林散步，所见使他难过",
    "七辆旧汽车和三台旧冰箱",
    "纸片、烟头、旧轮胎、空瓶子和生锈的罐头盒",
    "没有，文章引用了告示，没有给起诉记录",
    "严肃的告示立在垃圾之中，与现场形成反差"
  ],
  "grammar": [
    {
      "fills": [
        "has",
        "have"
      ]
    },
    {
      "fills": [
        "been"
      ]
    },
    {
      "fills": [
        "thrown"
      ]
    },
    {
      "fills": [
        "already",
        "yet"
      ]
    },
    [
      "The room",
      "had been",
      "cleaned",
      "before the visitors arrived"
    ],
    {
      "fills": [
        "was being"
      ]
    },
    "The work must be finished before five.",
    {
      "fills": [
        "be"
      ]
    },
    "The flowers must not be picked.",
    {
      "fills": [
        "Has",
        "been"
      ]
    },
    {
      "fills": [
        "Yes",
        "No"
      ]
    },
    [
      "It hasn’t been repaired yet",
      "but",
      "it will be repaired",
      "tomorrow"
    ],
    {
      "fills": [
        "be"
      ]
    },
    {
      "fills": [
        "would be"
      ]
    },
    "A描述感受，B明确说明接受了邀请",
    {
      "fills": [
        "was posted",
        "arrived"
      ]
    },
    "说明从星期一起一直保持锁着，直到现在"
  ],
  "apply": [
    "The baskets in Area A have been placed.",
    "The gate was being repaired at 09:00.",
    "No, not yet. They will be posted at 14:00.",
    {
      "fills": [
        "would be",
        "cleaned"
      ]
    },
    "不能，通知提出要求，没有完成记录",
    [
      "These books",
      "can be",
      "borrowed",
      "by pupils"
    ],
    {
      "fills": [
        "hasn’t",
        "been"
      ]
    },
    "废物筐已清空；地面的情况尚未检查"
  ],
  "exam": [
    {
      "pairs": [
        [
          "rusty",
          "生锈的"
        ],
        [
          "visitor",
          "游客；来访者"
        ],
        [
          "rubbish",
          "垃圾"
        ]
      ]
    },
    {
      "fills": [
        "hundred",
        "hundreds"
      ]
    },
    {
      "fills": [
        "has",
        "have"
      ]
    },
    {
      "fills": [
        "been"
      ]
    },
    {
      "fills": [
        "taken"
      ]
    },
    {
      "fills": [
        "already",
        "yet"
      ]
    },
    [
      "The gate",
      "had been",
      "repaired",
      "before we arrived"
    ],
    {
      "fills": [
        "were being"
      ]
    },
    {
      "fills": [
        "be"
      ]
    },
    "The room can be used by pupils.",
    "The gate must not be blocked.",
    {
      "fills": [
        "Have",
        "been"
      ]
    },
    {
      "fills": [
        "Yes",
        "No"
      ]
    },
    "It hasn’t been sent yet. It will be sent tomorrow.",
    {
      "fills": [
        "be"
      ]
    },
    {
      "fills": [
        "would be"
      ]
    },
    "A描述感受，B说明明确的被动事件",
    {
      "fills": [
        "was sent",
        "arrived"
      ]
    },
    "不能，明确说保护持续到现在",
    "保持整洁的要求已传达，仍有人乱扔垃圾",
    "Five tyres have been removed; two bottles haven’t been removed yet.",
    "有这样的告示，但没有给出实际起诉结果",
    "筐空不等于环境干净；告示与满地杂物形成反差"
  ]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit143-144/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit143-144/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
