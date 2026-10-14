// Exact pre-polish questions: migration only, never treated as new answers.
(function(core){core.unit4142Previous = {
  "apply": [
    {
      "id": "u4142-v1-a-bread",
      "target": "读懂量词并选择真实物品",
      "prompt": "Penny 的清单：a loaf of bread\n先把它装进袋子。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "bread",
        "soap",
        "milk"
      ],
      "answer": "bread",
      "optionImages": {
        "bread": "/assets/unit41-42/bread.svg",
        "soap": "/assets/unit41-42/soap.svg",
        "milk": "/assets/unit41-42/milk.svg"
      },
      "explanation": "一条面包已经放进袋子。",
      "hint": "看看 loaf 搭配的物品。",
      "distractorReasons": {
        "soap": "不符合本题明确给出的数量、物品、说话者或句型。一条面包已经放进袋子。",
        "milk": "不符合本题明确给出的数量、物品、说话者或句型。一条面包已经放进袋子。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-a-bottles",
      "target": "按清单核对瓶数",
      "prompt": "再放入 two bottles of milk。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "一瓶牛奶",
        "两瓶牛奶",
        "三块肥皂"
      ],
      "answer": "两瓶牛奶",
      "optionImages": {
        "一瓶牛奶": "/assets/unit41-42/milk.svg",
        "两瓶牛奶": "/assets/unit41-42/two-bottles.svg",
        "三块肥皂": "/assets/unit41-42/three-bars.svg"
      },
      "explanation": "two bottles 是两瓶，牛奶本身不加 s。",
      "hint": "先核对 two，再核对瓶里的物品。",
      "distractorReasons": {
        "一瓶牛奶": "不符合本题明确给出的数量、物品、说话者或句型。two bottles 是两瓶，牛奶本身不加 s。",
        "三块肥皂": "不符合本题明确给出的数量、物品、说话者或句型。two bottles 是两瓶，牛奶本身不加 s。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-a-check",
      "target": "按实际清单作否定回答",
      "prompt": "袋里目前只有一条面包、两瓶牛奶。\nSam：Is there any soap in the bag?",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "No, there isn’t.",
        "Yes, there is.",
        "Not very."
      ],
      "answer": "No, there isn’t.",
      "reference": "袋里目前只有：一条面包、两瓶牛奶。",
      "explanation": "当前清单里没有肥皂，所以回答 No, there isn’t.。",
      "hint": "只按当前清单回答。",
      "distractorReasons": {
        "Yes, there is.": "不符合本题明确给出的数量、物品、说话者或句型。当前清单里没有肥皂，所以回答 No, there isn’t.。",
        "Not very.": "不符合本题明确给出的数量、物品、说话者或句型。当前清单里没有肥皂，所以回答 No, there isn’t.。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-a-place",
      "target": "用 in/on 区分物品与容器的位置",
      "prompt": "把标签贴对：牛奶在瓶里，瓶子在桌上。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "The milk is ",
          "after": " the bottle.",
          "options": [
            "in",
            "on"
          ]
        },
        {
          "before": "The bottle is ",
          "after": " the table.",
          "options": [
            "in",
            "on"
          ]
        }
      ],
      "answer": "[\"in\",\"on\"]",
      "explanation": "内容物在容器里用 in；瓶子在桌面上用 on。",
      "hint": "分别看牛奶和瓶子在哪里。",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-a-note",
      "target": "为整理结果组成准确记录",
      "prompt": "桌上留下了一块乳酪。用词块记下来。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "wordbank",
      "tokens": [
        "There is",
        "a piece",
        "of cheese",
        "on the table",
        "in the bag"
      ],
      "slots": 4,
      "answer": "There is a piece of cheese on the table",
      "suffix": ".",
      "explanation": "有一块乳酪，用 There is a piece of cheese…。",
      "hint": "先写物品的量，再写题目给定的位置。",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    }
  ],
  "exam": [
    {
      "id": "u4142-v1-e-bread",
      "target": "独立辨认 bread",
      "prompt": "图中是什么？",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "bread",
        "cheese",
        "soap"
      ],
      "answer": "bread",
      "image": "/assets/unit41-42/bread.svg",
      "imageAlt": "一条面包",
      "explanation": "bread 是面包。",
      "hint": "",
      "distractorReasons": {
        "cheese": "不符合本题明确给出的数量、物品、说话者或句型。bread 是面包。",
        "soap": "不符合本题明确给出的数量、物品、说话者或句型。bread 是面包。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-words",
      "target": "区分四种常见物品",
      "prompt": "给词和意思配对。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "match",
      "pairs": [
        {
          "id": "1",
          "en": "sugar",
          "cn": "糖"
        },
        {
          "id": "2",
          "en": "tea",
          "cn": "茶"
        },
        {
          "id": "3",
          "en": "soap",
          "cn": "肥皂"
        },
        {
          "id": "4",
          "en": "chocolate",
          "cn": "巧克力"
        }
      ],
      "answer": "[\"1\",\"2\",\"3\",\"4\"]",
      "explanation": "留意相近物品词的不同词义。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-reading",
      "target": "综合读取重量感受与地点",
      "prompt": "Sam：Is that bag heavy, Penny?\nPenny：Not very.\nSam：Put it on this chair.\n哪张记录准确？",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "不太重；放到椅子上",
        "非常重；放到椅子上",
        "不太重；放到桌子上"
      ],
      "answer": "不太重；放到椅子上",
      "explanation": "Not very. 回答重量；on this chair 说明地点。",
      "hint": "",
      "distractorReasons": {
        "非常重；放到椅子上": "不符合本题明确给出的数量、物品、说话者或句型。Not very. 回答重量；on this chair 说明地点。",
        "不太重；放到桌子上": "不符合本题明确给出的数量、物品、说话者或句型。Not very. 回答重量；on this chair 说明地点。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-weights",
      "target": "独立分辨原文咖啡与茶的重量",
      "prompt": "按原文补全采购记录。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "coffee：",
          "after": " a pound",
          "options": [
            "half",
            "a quarter of"
          ]
        },
        {
          "before": "tea：",
          "after": " a pound",
          "options": [
            "half",
            "a quarter of"
          ]
        }
      ],
      "answer": "[\"half\",\"a quarter of\"]",
      "explanation": "咖啡是 half a pound，茶是 a quarter of a pound。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-speaker",
      "target": "独立确认 me 的所指",
      "prompt": "Sam：Is that tin of tobacco for me?\n这一句的 me 指谁？",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "Sam",
        "Penny",
        "没有说明"
      ],
      "answer": "Sam",
      "optionImages": {
        "Sam": "/assets/unit41-42/sam.svg",
        "Penny": "/assets/unit41-42/penny.svg"
      },
      "explanation": "Sam 正在说话，me 指 Sam。",
      "hint": "",
      "distractorReasons": {
        "Penny": "不符合本题明确给出的数量、物品、说话者或句型。Sam 正在说话，me 指 Sam。",
        "没有说明": "不符合本题明确给出的数量、物品、说话者或句型。Sam 正在说话，me 指 Sam。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-measures",
      "target": "独立选择 loaf 与 piece",
      "prompt": "补全：一条面包；一块乳酪。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "a ",
          "after": " of bread",
          "options": [
            "loaf",
            "bottle",
            "tin"
          ]
        },
        {
          "before": "a ",
          "after": " of cheese",
          "options": [
            "piece",
            "bottle",
            "tin"
          ]
        }
      ],
      "answer": "[\"loaf\",\"piece\"]",
      "explanation": "本题用 a loaf of bread 和 a piece of cheese。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-plural",
      "target": "独立使用量词复数与 are",
      "prompt": "补全：有两瓶牛奶。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "There ",
          "after": " two",
          "options": [
            "are",
            "is"
          ]
        },
        {
          "before": "",
          "after": " of milk.",
          "options": [
            "bottles",
            "bottle",
            "milks"
          ]
        }
      ],
      "answer": "[\"are\",\"bottles\"]",
      "explanation": "数的是 two bottles，因此用 are；milk 在这里不加 s。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-some-a",
      "target": "区分单个物品与不可数的一些",
      "prompt": "补全：有一把勺子；有一些咖啡。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "There is ",
          "after": " spoon.",
          "options": [
            "a",
            "some",
            "any"
          ]
        },
        {
          "before": "There is ",
          "after": " coffee.",
          "options": [
            "a",
            "some",
            "any"
          ]
        }
      ],
      "answer": "[\"a\",\"some\"]",
      "explanation": "一把勺子是 a spoon；一些咖啡是 some coffee。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-any",
      "target": "独立组织询问不可数物品的句子",
      "prompt": "用词块问：那个袋子里有糖吗？",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "wordbank",
      "tokens": [
        "Is there",
        "any sugar",
        "in that bag",
        "some sugar"
      ],
      "slots": 3,
      "answer": "Is there any sugar in that bag",
      "suffix": "?",
      "explanation": "本课询问是否有糖，用 Is there any sugar…?",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-negative",
      "target": "独立组织 there be 否定句",
      "prompt": "用词块说：桌上没有肥皂。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "wordbank",
      "tokens": [
        "There isn’t",
        "any soap",
        "on the table",
        "some soap"
      ],
      "slots": 3,
      "answer": "There isn’t any soap on the table",
      "suffix": ".",
      "explanation": "否定句在这里用 isn’t any soap。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-one-some",
      "target": "用 one 或 some 避免重复名词",
      "prompt": "补全两句回答。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "Is there a passport? Yes, there is ",
          "after": " on the table.",
          "options": [
            "one",
            "some"
          ]
        },
        {
          "before": "Is there any chocolate? Yes, there is ",
          "after": " on the desk.",
          "options": [
            "one",
            "some"
          ]
        }
      ],
      "answer": "[\"one\",\"some\"]",
      "explanation": "one 代替一个护照；some 代替一些巧克力。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-position",
      "target": "区分内容物与容器的位置",
      "prompt": "茶在罐里，罐在桌上。补全标签。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "The tea is ",
          "after": " the tin.",
          "options": [
            "in",
            "on"
          ]
        },
        {
          "before": "The tin is ",
          "after": " the table.",
          "options": [
            "in",
            "on"
          ]
        }
      ],
      "answer": "[\"in\",\"on\"]",
      "explanation": "茶在罐里是 in；罐在桌上是 on。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-agreement",
      "target": "独立处理并列清单",
      "prompt": "根据第一项补全。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "type": "cloze",
      "blanks": [
        {
          "before": "There ",
          "after": " a loaf of bread and three bars of soap.",
          "options": [
            "is",
            "are"
          ]
        },
        {
          "before": "There ",
          "after": " two bottles of milk and a tin of tea.",
          "options": [
            "is",
            "are"
          ]
        }
      ],
      "answer": "[\"is\",\"are\"]",
      "explanation": "本课并列清单按紧接的第一项选择：a loaf 用 is，two bottles 用 are。",
      "hint": "",
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    },
    {
      "id": "u4142-v1-e-evidence",
      "target": "根据数量与否定信息综合回答",
      "prompt": "新清单：袋里只有两瓶牛奶，没有茶。\nSam：Is there any milk in the bag?\n选出准确回答。",
      "source": "《新概念英语智慧版1》Lesson 41–42，纸页82–85／PDF115–118",
      "options": [
        "Yes, there is. There are two bottles of milk.",
        "No, there isn’t. There is some tea.",
        "Yes, there is. There is one bottle of milk."
      ],
      "answer": "Yes, there is. There are two bottles of milk.",
      "explanation": "先用 Yes, there is. 回答有没有牛奶，再说明有两瓶。",
      "hint": "",
      "distractorReasons": {
        "No, there isn’t. There is some tea.": "不符合本题明确给出的数量、物品、说话者或句型。先用 Yes, there is. 回答有没有牛奶，再说明有两瓶。",
        "Yes, there is. There is one bottle of milk.": "不符合本题明确给出的数量、物品、说话者或句型。先用 Yes, there is. 回答有没有牛奶，再说明有两瓶。"
      },
      "distractorRationale": "干扰项来自本课易混词义、量词、单复数或肯否结构；按题目给定的事实判断。"
    }
  ]
};})(globalThis.CanranCore);
