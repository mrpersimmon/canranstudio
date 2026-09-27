'use strict';
const{expect}=require('@playwright/test');
// Reviewed teaching blueprint answers; never read an answer from the running page.
const EXAMS={
 "17-18": [
  "They are keyboard operators.",
  "women · nurses / men · engineers",
  "How do you do?",
  "Who is this young man?",
  "He · His",
  "a man · a woman",
  "policewomen · housewives",
  "They aren't mechanics. They're engineers.",
  [
   "Those",
   "men",
   "aren't",
   "very",
   "busy."
  ],
  "他们很勤奋，是否忙碌还不知道。"
 ],
 "19-20": [
  "累了；不渴",
  "大；不是新的",
  "Yes, we are, thank you!",
  "am · are · is",
  "They're light.",
  "旧的 · 年老的",
  "tall · long",
  "箱子小，但很重。",
  [
   "Are",
   "they",
   "dirty",
   "or",
   "clean?"
  ],
  "孩子们不冷。"
 ],
 "21-22": [
  {"object":"小瓶子","recipient":"简（Jane）"},
  "还要确认要空的还是满的。",
  "spoon",
  "Which box?",
  "him",
  "接收者“她” · “她的”",
  "Their",
  "an empty glass · a full glass",
  [
   "Give",
   "us",
   "a",
   "little box,",
   "please."
  ],
  "No, not this large one. That small one."
 ],
 "23-24": [
  "把床上的几本杂志递给简。",
  "桌子上的那些杯子",
  "要多个玻璃杯，没说具体几只。",
  "newspapers",
  "Those books?",
  "甲组",
  "her",
  "our · us",
  [
   "Give",
   "him",
   "some",
   "plates,",
   "please."
  ],
  "A"
 ],
 "25-26": [
  "甲图",
  "桌上有杯子。",
  "左边 · 右边 · 中间",
  "bottle · cup",
  "It",
  "an · The",
  [
   "Where",
   "is",
   "the",
   "bottle?"
  ],
  "There is a bottle in the refrigerator.",
  "There's a clean cup on the table."
 ],
 "27-28": [
  "甲图",
  "桌上没有杯子。",
  "television · table · stereo",
  "There are some knives near that tin.",
  "any · any",
  "knives · 桌上",
  [
   "Where",
   "are",
   "they?"
  ],
  "No, there aren't. There are some magazines.",
  "没有说明确切数量。",
  "A 靠近窗户；B 放在电视机上。"
 ],
 "29-30": [
  "甲图",
  "Clean it!",
  "What must I do?",
  "收衣服进衣柜 · 整理床铺",
  "is · 琼斯太太的",
  [
   "Open",
   "the",
   "window",
   "and",
   "air",
   "the",
   "room."
  ],
  "Put these clothes in the wardrobe.",
  "Then make the bed.",
  "Dust the dressing table.",
  "Empty the cup.",
  "Put on your shirt. → Take off your shirt.",
  "Read this magazine. / Sharpen these pencils."
 ]
};
const taskCases=require('./units1-30-tasks');
for(const pair of Object.keys(EXAMS))EXAMS[pair]=taskCases.answers(pair,'exam').map(q=>q.answer);
async function selectAnswer(room,answer){await taskCases.select(room,answer);}
async function finishExamFrom(page,pair,start=0){const room=page.locator('.stage-exam'),answers=EXAMS[pair];
 for(let i=start;i<answers.length;i++){await selectAnswer(room,answers[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await room.getByRole('button',{name:i===answers.length-1?'查看本次记录':'下一题',exact:true}).click();}
}
async function expectPagedTexts(room,selector,expected,label='图册'){
 const seen=[],next=room.getByRole('button',{name:'下一页'+label,exact:true}),prev=room.getByRole('button',{name:'上一页'+label,exact:true});
 while(await prev.isEnabled())await prev.click();
 do{seen.push(...await room.locator(selector).allTextContents());if(!await next.isEnabled())break;await next.click();}while(seen.length<=expected.length);
 expect(seen).toEqual(expected);
}
module.exports={EXAMS,selectAnswer,finishExamFrom,expectPagedTexts};
