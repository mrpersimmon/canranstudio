/* Display wording only. Do not edit question manuscripts, round identities,
   answers or permanent awards for a presentation change. */
(function(core){
 'use strict';
 const copy=core.unit12.copy;
 Object.assign(copy,{
  incorrectFeedback:'答错了，再试试。',
  roundIntro:'本组每题一次答对，可点亮一颗星。',
  reviewCorrect:'首答正确',reviewCorrected:'订正后答对',
  recordScope:true,
  completionStatistics:'questions',
  correctedCompletion:'已完成！再练一轮全对，可点亮星星。'
 });
 const edits={
  'u12-grammar-v4-ask-about-self':{title:'用词块问：我是学生吗？',rule:'I 不变，am 放前面：Am I a student?'},
  'u12-grammar-v4-expand-isnt':{title:'isn’t 等于哪两个词？'},
  'u12-grammar-v4-affirmative-replies':{title:'钢笔是你的，怎么回答？'},
  'u12-types-v1-t13':{title:'包是女士的，帮她回答。'}
 };
 for(const[id,value]of Object.entries(edits))copy.questions[id]={...copy.questions[id],...value};
 copy.references={
  'Excuse me!':'礼貌叫住别人',
  'Yes?':'回应别人：什么事？',
  'Pardon?':'没听清，请再说一遍',
  'Yes, it is.':'对，东西是我的。',
  'Thank you very much.':'谢谢你的帮助'
 };
})(globalThis.CanranCore);
