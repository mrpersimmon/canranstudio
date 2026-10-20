'use strict';
// Independent reviewed expectations: textbook paper10–13, Guide Grammar11–12,
// and the v1.54 teaching manuscript. Never load application questions/answers.
const c=require('./units1-30-task-cases.json')['5-6'];
const previous=id=>c.changes.find(x=>x.group===id)?.answers||c.old[id];
const BEFORE={listen:previous('listen'),roles:previous('roles'),introduce:[...previous('refer'),...previous('articles')],cars:[...previous('choice'),...previous('trans')],exam:previous('exam')};
const item=(id,answer)=>({id:'u56-v154-'+id,answer,fresh:true});
const CURRENT={listen:BEFORE.listen,roles:BEFORE.roles.map((q,i)=>item('story-'+['new','chang','too'][i],q.answer)),introduce:[
 item('wh-meaning',"It's a Toyota."),item('wh-order',['What','make','is','it?']),item('who-answer','He is Hans.'),item('who-subject',['Who','is','Japanese?']),...BEFORE.introduce,
 item('wh-independent',{fills:['She is Sophie.','It is a Mini.']})
],cars:[...BEFORE.cars,item('choice-neither',"It's a Japanese car.")],exam:[
 ...BEFORE.exam.slice(0,5),item('exam-people',{fills:['He','She']}),item('exam-car-article',{fills:['It','an']}),item('exam-nationality',"She is French. She's a French student."),...BEFORE.exam.slice(7),
 item('exam-wh-order',['What','make','is','it?']),item('exam-who-subject','Who is German?'),item('exam-neither',"It's an American car.")
]};
module.exports={BEFORE,CURRENT,CLASSROOM:{listen:previous('listen'),roles:previous('roles'),refer:previous('refer'),articles:previous('articles'),choice:previous('choice'),trans:previous('trans'),exam:previous('exam')}};
