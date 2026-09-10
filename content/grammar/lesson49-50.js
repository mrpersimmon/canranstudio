'use strict';
// New IDs are essential: an old word-bank result is never recast as writing.
module.exports={
 skills:[
  {id:'present-third-person-s',label:'第三人称单数肯定句',prerequisites:['subject-pronouns','present-base-verb'],misconceptions:['missing-s','extra-ing']},
  {id:'does-base-verb',label:'does 后用动词原形',prerequisites:['present-third-person-s'],misconceptions:['double-marking','missing-does']},
  {id:'does-question',label:'Does 引导一般疑问句',prerequisites:['does-base-verb'],misconceptions:['wrong-auxiliary','double-marking']}
 ],
 tasks:[
  ['s','present-third-person-s','recall','gap','他喜欢鸡肉。填写 like 的正确形式。','He ',' chicken.',['likes'],'He likes chicken.','主语 he，肯定句 like 加 s。'],
  ['correct','does-base-verb','correction','translation','改正一句中的动词错误：She does not likes steak.','','',['She does not like steak.',"She doesn't like steak."],'She does not like steak.','does 已经标记第三人称，后面用 like。'],
  ['question','does-question','transformation','translation','把 He wants some cabbage. 改为一般疑问句，使用 any。','','',['Does he want any cabbage?'],'Does he want any cabbage?','Does 放句首，want 用原形，some 改为 any。'],
  ['transfer-s','present-third-person-s','transfer','translation','她喜欢土豆。','','',['She likes potatoes.'],'She likes potatoes.','主语 she，肯定句 like 加 s。'],
  ['transfer-base','does-base-verb','transfer','translation','他不喜欢卷心菜。','','',['He does not like cabbage.',"He doesn't like cabbage."],'He does not like cabbage.','does not 后用动词原形 like。'],
  ['transfer-question','does-question','transfer','translation','她想要一些鸡肉吗？请用 Does 和 any。','','',['Does she want any chicken?'],'Does she want any chicken?','Does + she + want，问句中使用 any。']
 ],
 delayed:[
  ['s','present-third-person-s','他喜欢卷心菜。',['He likes cabbage.'],'主语 he，肯定句 like 加 s。'],
  ['base','does-base-verb','她不喜欢土豆。',['She does not like potatoes.',"She doesn't like potatoes."],'does not 后用 like。'],
  ['question','does-question','他想要一些鸡肉吗？请用 Does 和 any。',['Does he want any chicken?'],'Does + he + want，问句中使用 any。']
 ]
};
