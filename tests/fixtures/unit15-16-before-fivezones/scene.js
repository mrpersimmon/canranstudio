(function(root){
 'use strict';
 const core=root.CanranCore,content=core.unit1516.learning;
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 const local=name=>'/assets/unit15-16/'+name+'.svg';
 function image(name,alt='',className=''){const el=node('img','',className);el.src=local(name);el.alt=alt;return el;}
 function cast(){
  const element=node('div','','customs-cast');
  for(const [person,who] of [['officer','teacher'],['girls','student']]){
   const actor=node('div','','dialogue-actor');actor.dataset.actor=who;actor.append(image(person),node('span',content.PEOPLE[person].name));element.append(actor);
  }
  const friends=node('div','','customs-friends');friends.append(image('friend'),node('span','同行朋友'));
  const counter=image('counter','','customs-counter'),passports=image('passports','姑娘们准备递交的两本护照','story-passports'),other=image('cases-grey','官员询问的另一对箱子，尚未确认归属','story-other-cases'),own=image('cases-brown','姑娘们自己的棕色箱子','story-own-cases');
  const clear=node('span','检查结束','customs-clear');
  element.append(friends,counter,passports,other,own,clear);
  return{element,showLine(index){
   element.dataset.phase=index<3?'arrival':index<6?'friends':index===6?'request':index===7?'handover':index<10?'other-cases':index===10?'brown-cases':index<16?'travellers':'clear';
   friends.hidden=index<3;friends.classList.toggle('is-referenced',[3,4,5,14,15].includes(index));
   passports.hidden=index<6;passports.dataset.place=index<7?'girls':'counter';passports.alt=index<7?'姑娘们准备递交的两本护照':'已经递到官员面前的两本护照';
   other.hidden=index<8;own.hidden=index<10;own.dataset.place=index<11?'waiting':'girls';clear.hidden=index<16;
   element.querySelectorAll('.dialogue-actor').forEach(el=>el.classList.toggle('is-current',el.dataset.actor===content.DIALOGUE[index]?.who));
  }};
 }
 // Illustration state is separate from the content signature and cannot award progress.
 const tasks={
  'story-friends':{art:'friend',result:'分清姑娘们和同行朋友了。'},
  'story-they':{art:'passports',result:'官员要的护照，递到了柜台。',handover:true},
  'story-finish':{art:'officer',result:'检查结束，大家可以继续出发。'},
  'reply-we':{art:'girls',result:'姑娘们一起回答：Yes, we are.'},
  'reply-negative':{art:'friend',result:"说的是朋友：No, they aren't."},
  'reply-our':{art:'cases-brown',result:'我们的箱子：Our cases。'},
  'exam-card':{art:'friend',result:'国籍与身份都核对好了。'},
  'exam-passports':{art:'passports',result:'确认的是两本护照：Yes, they are.',handover:true},
  'deny-we':{art:'girls',result:'姑娘们否定了对自己的猜测。'},
  'deny-friends':{art:'friend',result:'按新资料核对朋友们的国籍。'},
  'these-plural':{art:'tickets',result:'两张车票，复数问句检查好了。'},
  'ask-colour':{art:'cases-brown',result:'箱子问色句拼好了。'},
  'our-hats':{art:'hats',alt:'两顶灰色帽子，都带黑色帽带',result:'谁的、数量、两种颜色都说清了。'},
  'plural-labels':{art:'dresses',alt:'两条绿色连衣裙',result:'两种复数标签都核对好了。'},
  'articles':{art:'cars',result:'两种首音，分别配上 a 或 an。'},
  'they-cases':{art:'cases-brown',result:'这次说的是箱子，不能套用护照。'},
  'thanks':{art:'girls',result:'检查结束，谢谢大家！'}
 };
 function taskView(){
  const element=node('div','','customs-task'),question=node('div'),heading=node('h3','','customs-task-heading'),board=node('div','','customs-evidence');
  const picture=image('passport'),result=node('p','','customs-task-result');board.append(picture);element.append(question,board,result);let detail;
  return{element,heading:()=>heading,present(q,progress){
   detail=tasks[q.id.replace(/^u1516-(?:v1|final-v2|tasks-v4)-/,'')]||{art:'passport',result:''};
   element.hidden=false;element.dataset.phase='waiting';board.classList.toggle('is-handover',!!detail.handover);
   question.replaceChildren(progress,heading);heading.textContent=q.prompt;heading.tabIndex=-1;picture.src=local(detail.art);picture.alt=detail.alt||'';result.textContent='';
  },answer(value){element.dataset.phase=value?'checked':'waiting';result.textContent=value?detail.result:'';},finish(){element.hidden=true;}};
 }
 function result(id){
  const box=node('div','','customs-result');box.append(image('passports'),image('cases-brown'));
  box.append(node('p',{roles:'护照和同行者的线索找到了！',reply:'我们、朋友和我们的行李，分清楚了！',forms:'出行清单的单词准备好了！',trans:'行李问答拼好了！',exam:'出行记录核对完成，一起出发！'}[id]));return box;
 }
 core.unit1516Scene={cast,taskView,result};
})(globalThis);
