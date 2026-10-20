(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit133-134/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','news-world');element.setAttribute('role','group');element.setAttribute('aria-label','机场采访与街头读报');
 const group=node('div','news-group');
 for(const[name,alt]of [['interview','记者在左面向右侧的Marsh小姐询问；她穿蓝色连衣裙和棕色大衣，全身完整'],['interview-answer','Marsh小姐面向左侧的记者回答，记者用笔记本记录；双手双脚完整'],['read','Kate在左读一份报纸，Liz在右面对她和报纸听，人物全身完整'],['wonder','Liz面向Kate和同一份报纸表达好奇，没有揭晓额外原因']]){const im=picture(name,'news-cast '+name,alt,'webp');im.hidden=true;group.append(im);}
 for(const[who,label,side]of [['reporter','Reporter','left'],['marsh','Miss Marsh','right'],['kate','Kate','left'],['liz','Liz','right']]){const actor=node('div','dialogue-actor news-label');actor.dataset.actor=who;actor.dataset.position=side;actor.append(node('span','actor-label',label));group.append(actor);}
 const location=node('p','news-location','伦敦机场');element.append(group,location);
 return{element,update(i){
  const street=i>=5;const pose=street?(i===13?'wonder':'read'):(i===1||i>=3?'interview-answer':'interview');
  element.dataset.scene=street?'street':'airport';group.dataset.pose=pose;location.textContent=street?'街头报摊':'伦敦机场';
  for(const im of group.querySelectorAll('.news-cast'))im.hidden=!im.classList.contains(pose);
  for(const actor of group.querySelectorAll('.dialogue-actor'))actor.hidden=street?!['kate','liz'].includes(actor.dataset.actor):!['reporter','marsh'].includes(actor.dataset.actor);
 },sideFor:(_,who)=>['reporter','kate'].includes(who)?'left':'right'};
}
const tasks={source:['Check the source','Keep each speaker distinct.','The source is recorded.'],person:['Check the people','Keep the speaker and listener clear.','The people are recorded.'],calendar:['Check the dates','Keep the original article in view.','The date is recorded.'],negative:['Keep the meaning','Do not reverse the preference.','The meaning is recorded.'],two:['Check both clauses','Keep both pieces of information.','Both clauses are recorded.'],past:['Check the earlier action','Keep the person and the owner.','The earlier action is recorded.'],next:['Read and reply','Keep the original message.','The reply is recorded.'],quote:['Check the evidence','A report and an exact quotation differ.','The evidence is recorded.']};
function create({element}){let view,heading,task;return{present(question,progress){element.classList.remove('role-runner');element.classList.add('news-runner');const content=element.querySelector('.practice-content'),intro=node('div','news-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u133134-v1-a-','');view=node('div','news-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','报道核对记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',tasks[task][0]),node('span','',tasks[task][1]));view.append(card);intro.append(view);content.prepend(intro);},answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit133-134/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.news-intro .practice-progress')||heading;}};}
core.unit133134Scene={storyProps,create};
})(globalThis.CanranCore);
