(function(root){
 'use strict';
 const core=root.CanranCore,content=core.unit1112.learning;
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 const image=(path,alt='',className='')=>{const el=node('img','',className);el.src=path;el.alt=alt;return el;};
 const local=name=>'/assets/unit11-12/'+name+'.svg';
 function cast(){
  const element=node('div','','claim-cast');
  for(const person of ['teacher','dave','tim']){
   const actor=node('div','','dialogue-actor');actor.dataset.actor=person;actor.append(image(content.PEOPLE[person].image),node('span',content.PEOPLE[person].name));element.append(actor);
  }
  const stool=node('div','','claim-stool');stool.setAttribute('aria-hidden','true');
  const white=image(local('white-shirt'),'','claim-white'),blue=image(local('blue-shirt'),'Dave 展示自己的蓝衬衫','claim-blue');
  element.append(stool,white,blue);
  return{element,showLine(index){
   const phase=index<1?'waiting':index<13?'asking':index===13?'offering':index===14?'catching':'returned';
   element.dataset.phase=phase;blue.hidden=index<4;stool.hidden=index>=1;
   white.alt={waiting:'凳子上待认领的白衬衫',asking:'老师举着待认领的白衬衫',offering:'老师递出已确认的白衬衫',catching:'老师抛向 Tim 的白衬衫',returned:'Tim 接到自己的白衬衫'}[phase];
   element.querySelectorAll('.dialogue-actor').forEach(el=>el.classList.toggle('is-current',el.dataset.actor===content.DIALOGUE[index]?.person));
  }};
 }
 // Presentation-only cues. The original questions/signatures remain authoritative.
 const tasks={
  'story-owner':{image:local('white-shirt'),note:'Whose shirt is white?',result:'白衬衫 → Tim'},
  'story-it':{title:'Dave 说的 It 指哪件东西？',image:local('dave'),note:"老师：Is this your shirt, Dave?\nDave：It's not my shirt.",result:'It → 老师手里的白衬衫'},
  'owner-her':{title:'That is ___ car.',image:'/assets/unit1-2/car.svg',note:'车主 · Stella（she）',result:'Stella → her car'},
  'owner-your':{title:'Tim：Yes, it’s ___ umbrella.',image:'/assets/unit3-4/umbrella.svg',note:'伞属于 Dave。Tim 正对 Dave 说话。\nDave：This is my umbrella.',result:'Tim 对 Dave：your umbrella'},
  'owner-apostrophe':{image:local('white-shirt'),result:'Tim’s shirt is white.'},
  'build-whose':{title:'用 Whose 问远处领带是谁的。',image:local('tie'),note:'远处 · 主人还不知道',result:'Whose is that tie?'},
  'build-sister':{title:'用 my sister’s 回答它是谁的。',image:local('blouse'),note:'物主 · 我的姐姐',result:"It's my sister's."},
  'exam-read':{image:'/assets/unit1-2/pen.svg',result:'my brother · pen'},
  'exam-perhaps':{title:'Dave 这样说，老师下一步怎么做？',image:local('white-shirt'),note:'Dave：Perhaps it’s Tim’s.',result:'下一步：请 Tim 确认'},
  'exam-distractor':{title:'This is ___ pen.',image:'/assets/unit1-2/pen.svg',note:'Sophie（she）· 钢笔的主人\nPaul（he）· 站在旁边',result:'Sophie → her pen'}
 };
 function taskView(){
  const element=node('div','','claim-task'),question=node('div'),heading=node('h3','','claim-task-heading'),board=node('div','','claim-evidence');
  const picture=image(local('white-shirt')),note=node('p','','claim-evidence-note'),result=node('p','','claim-task-result');
  board.append(picture,note);element.append(question,board,result);let detail;
  return{element,heading:()=>heading,
   present(q,progress){detail=tasks[q.id.replace('u1112-v1-','')]||{image:local('white-shirt'),result:q.answer};element.hidden=false;question.replaceChildren(progress,heading);heading.textContent=detail.title||q.prompt;heading.tabIndex=-1;picture.src=detail.image;note.textContent=detail.note||'';note.hidden=!detail.note;board.classList.toggle('object-only',!detail.note);result.textContent='';},
   answer(value){result.textContent=value?detail.result:'';},finish(){element.hidden=true;}
  };
 }
 function result(id){
  const box=node('div','','claim-result');
  if(id==='roles'){box.append(image(local('blue-shirt')),node('p','Dave 的蓝衬衫'),image(local('white-shirt')),node('p','Tim 的白衬衫'));}
  else if(id==='owner'){box.append(image(local('lost-and-found')),node('p','先找主人，再看谁在对谁说话。'));}
  else {box.append(image(local('tie')),node('p','Whose is that tie?'));}
  return box;
 }
 core.unit1112Scene={cast,taskView,result};
})(globalThis);
