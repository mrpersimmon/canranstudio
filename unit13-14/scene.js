(function(root){
 'use strict';
 const core=root.CanranCore,content=core.unit1314.learning;
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 const local=name=>'/assets/unit13-14/'+name+'.svg';
 function image(name,alt='',className=''){const el=node('img','',className);el.src=local(name);el.alt=alt;return el;}
 function cast(){
  const element=node('div','','dress-cast');
  for(const [person,who] of [['louise','teacher'],['anna','student']]){
   const actor=node('div','','dialogue-actor');actor.dataset.actor=who;actor.append(image(person),node('span',content.PEOPLE[person].name));element.append(actor);
  }
  const wardrobe=node('div','','story-wardrobe');wardrobe.setAttribute('aria-hidden','true');
  const dress=image('dress','Anna 展示的新绿色连衣裙','story-dress'),box=image('hat-box','Anna 拿出的帽盒','story-hatbox'),hat=image('hat','','story-hat');
  element.append(wardrobe,dress,box,hat);
  return{element,showLine(index){
   const phase=index<2?'arrival':index===2?'upstairs':index<5?'room':index<8?'dress':index<10?'hatbox':index<12?'matching':'admire';
   element.dataset.phase=phase;wardrobe.hidden=index<3;wardrobe.classList.toggle('is-open',index>=5);
   dress.hidden=index<5;box.hidden=index<8;box.src=local(index<10?'hat-box':'hat-box-open');hat.hidden=index<10;
   hat.alt=index===12?'Anna 戴起自己的绿色帽子':'从帽盒中拿出的绿色帽子';
   element.querySelectorAll('.dialogue-actor').forEach(el=>el.classList.toggle('is-current',el.dataset.actor===content.DIALOGUE[index]?.who));
  }};
 }
 // Presentation does not replace the question manuscript or its progress signature.
 const tasks={
  'story-hat':{art:'hat-box',result:'绿色帽子和连衣裙相配。',success:['dress','hat']},
  'story-too':{art:'hat-box',result:'裙子是新的，帽子也是新的。',success:['dress','hat']},
  'ask-colour':{art:'hat-box',result:"What colour's your hat?"},
  'read-two':{art:'dog',result:'同一只狗，棕色和白色。'},
  'build-merge':{art:'dog',result:"This is Helen's dog."},
  'build-question':{art:'hat-grey-black',result:"What colour's Steven's hat?"},
  'build-description':{art:'coat-grey',result:"Her coat's grey."},
  'exam-same':{art:'case-yellow',result:'case · yellow / hat · yellow',success:['case-yellow','hat-yellow']},
  'exam-owner':{art:'carpet',result:"Her carpet's red."},
  'invite-upstairs':{art:'anna',result:'去楼上看 Anna 的新裙子。'},
  'new-too':{art:'hat-box',result:'too 承接 new：也是新的。'},
  'ask-direct':{art:'dress',result:'What colour is your dress?'},
  'two-colours':{art:'hat-grey-black',alt:'一顶灰色帽子，带黑色帽带',result:"His hat's grey and black."},
  'expand-is':{art:'umbrella-black',result:"Steven's umbrella is black."},
  'family-merge':{art:'suit-grey',result:"This is my father's suit."},
  'ask-third':{art:'coat-grey',result:"What colour's Sophie's coat?"},
  'praise-hat':{art:'hat',result:'That is a lovely hat!'}
 };
 function taskView(){
  const element=node('div','','dress-task'),question=node('div'),heading=node('h3','','dress-task-heading'),board=node('div','','dress-evidence');
  const picture=image('colour'),extra=image('hat','','dress-success-prop'),result=node('p','','dress-task-result');extra.hidden=true;
  board.append(picture,extra);element.append(question,board,result);let detail;
  return{element,heading:()=>heading,
   present(q,progress){detail=tasks[q.id.replace(/^u1314-(?:v1|final-v2)-/,'')]||{art:'colour',result:q.answer};element.hidden=false;question.replaceChildren(progress,heading);heading.textContent=q.prompt;heading.tabIndex=-1;picture.src=local(detail.art);picture.alt=detail.alt||'';extra.hidden=true;result.textContent='';},
   answer(value){result.textContent=value?detail.result:'';if(value&&detail.success){picture.src=local(detail.success[0]);extra.src=local(detail.success[1]);extra.hidden=false;}},
   finish(){element.hidden=true;}
  };
 }
 function result(id){
  const box=node('div','','dress-result');box.append(image('dress'),image('hat'));
  box.append(node('p',{roles:'找到新衣和新帽子的线索了！',colours:'物品与颜色说清楚了！',trans:'问色和介绍都拼好了！',exam:'你的配色记录完成了！'}[id]));return box;
 }
 core.unit1314Scene={cast,taskView,result};
})(globalThis);
