(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit121-122/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','bookshop-world');element.setAttribute('role','group');element.setAttribute('aria-label','书店柜台旁的对话');
 const cast=[['customer','Customer',[['customer','customer-plain','顾客没有戴帽子，双手空着'],['customer-holding','customer-holding','顾客手中拿着一顶帽子，尚未戴上'],['customer-hat','customer-hat','顾客已戴上帽子，一手轻触帽檐']]],['manager','Manager',[['manager','manager-talk','经理摊开手询问']]],['caroline','Caroline',[['caroline','caroline-think','Caroline思索，尚未认出顾客'],['caroline-recognize','caroline-recognize','Caroline认出顾客后微笑，双手没有词典']]]];
 for(const[key,label,poses]of cast){const wrap=node('div','dialogue-actor bookshop-actor');wrap.dataset.actor=key;wrap.hidden=true;for(const[name,cls,alt]of poses){const img=picture(name,'bookshop-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 const counter=picture('counter-with-books','story-counter','开放式柜台上放着两本词典，一本绿色、一本砖红色，下方双脚可见，词典尚未交给顾客');element.append(counter,node('p','bookshop-location','书店 · 柜台旁'));
 const group=node('div','bookshop-group'),questioning=picture('question-trio','bookshop-group-image questioning-trio','顾客戴着帽子，经理向Caroline询问，Caroline仍在思索；两本词典放在柜台上，三人全身完整','webp'),recognized=picture('recognition-trio','bookshop-group-image recognized-trio','Caroline认出戴帽子的顾客，经理在旁；两本词典仍在柜台上，三人全身完整','webp'),labels=node('div','bookshop-group-labels');group.hidden=true;
 for(const[key,label]of [['customer','Customer'],['manager','Manager'],['caroline','Caroline']]){const wrap=node('div','dialogue-actor bookshop-trio-label');wrap.dataset.actor=key;wrap.dataset.position=key==='customer'?'left':key==='manager'?'middle':'right';wrap.append(node('span','actor-label',label));labels.append(wrap);}group.append(questioning,recognized,labels);element.append(group);
 const positions=i=>i>=11?{customer:'left',manager:'middle',caroline:'right'}:i===5||i===6?{manager:'left',caroline:'right'}:i===2?{customer:'left',caroline:'right'}:{customer:'left',manager:'right'};
 return{element,update(i){
  const current=positions(i);element.dataset.cast=i>=11?'three':'two';element.dataset.hat=i>=11?'worn':i>=8?'held':'absent';
  for(const actor of element.querySelectorAll('.bookshop-actor')){const key=actor.dataset.actor;actor.hidden=i>=11||!Object.hasOwn(current,key);actor.dataset.position=current[key]||'right';}
  const poses={'.customer-plain':i<8,'.customer-holding':i>=8&&i<11,'.customer-hat':i>=11,'.manager-talk':true,'.caroline-think':i<12,'.caroline-recognize':i===12};
  for(const[selector,show]of Object.entries(poses))element.querySelector(selector).hidden=!show;
  counter.hidden=i<0||i>=11;group.hidden=i<11;questioning.hidden=i!==11;recognized.hidden=i!==12;group.dataset.phase=i===12?'recognized':'question';
 },sideFor:(i,who)=>positions(i)[who]==='middle'?'center':positions(i)[who]||'left'};
}
const tasks={counter:['Find the described book','Read the position carefully.','Book A is on the counter.'],person:['Identify the person','Use the stated action.','Ben is repairing the road.'],books:['Write the book record','Keep the buyer and the books.','These are the books I bought.'],put:['Make a polite request','Keep the hat’s pronoun.','Would you put it on, please?'],service:['Read the service record','Follow who served whom.','Pat served Lee.'],forget:['Check what happened','Separate buying and taking.','The books were not taken away.'],unique:['Check the description','Compare every candidate.','We need another distinguishing clue.'],promise:['Check the action record','Separate agreement and action.','Only agreement is recorded.']};
function create({element}){let view,heading,task;return{present(question,progress){
 element.classList.remove('role-runner');element.classList.add('bookshop-runner');const content=element.querySelector('.practice-content'),intro=node('div','bookshop-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 task=question.id.replace('u121122-v1-a-','');const[title,detail]=tasks[task];view=node('div','bookshop-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','线索任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit121-122/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.bookshop-intro .practice-progress')||heading;}};}
core.unit121122Scene={storyProps,create};
})(globalThis.CanranCore);
