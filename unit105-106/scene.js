(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit105-106/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','office-world');element.setAttribute('role','group');element.setAttribute('aria-label','办公室：老板与Bob、Sandra交谈');
 const actors={};
 for(const[key,label,side]of [['boss','The boss','left'],['bob','Bob','right'],['sandra','Sandra','right']]){
  const wrap=node('div','dialogue-actor office-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'office-cast'+(key==='boss'?' boss-letter-pose':''),label+'全身完整，面向'+(side==='left'?'右侧':'左侧')+'交谈者','webp'));
  if(key==='boss'){const finalPose=picture('boss-dictionary','office-cast boss-dictionary-pose','The boss持词典，面向右侧交谈者','webp');finalPose.hidden=true;wrap.append(finalPose);}
  wrap.append(node('span','actor-label',label));actors[key]=wrap;element.append(wrap);
 }
 element.append(node('p','office-location','办公室'));
 return{element,update(i){actors.bob.hidden=i>=3;actors.sandra.hidden=i<3;actors.boss.querySelector('.boss-letter-pose').hidden=i>=10;actors.boss.querySelector('.boss-dictionary-pose').hidden=i<10;element.dataset.reading=String(i>=0);},sideFor:(_i,who)=>who==='boss'?'left':'right'};
}
const tasks={self:['A personal task','Say who will do the action.','I want to check this letter.'],task:['Two task cards','Keep the person and action together.','I want Anna to correct the letter.'],no:['A reminder for Ben','Pass on the reminder.','Tell Ben not to open the window.'],two:['An art task','Keep both instructions.','Blue, not red.'],books:['Books to bring','Check who owns the books.','The teacher wants her to bring her books.'],reason:['A reminder about the bus','Use the reason in the note.','Because she doesn’t want him to miss the bus.'],polite:['Ask a classmate','Choose words for a polite request.','Could you help me find this word, please?'],result:['A task update','Record only what is known.','May has agreed. Completion is not yet known.']};
function create({element}){let view,heading,task;return{present(question,progress){element.classList.remove('role-runner');element.classList.add('office-runner');const content=element.querySelector('.practice-content'),intro=node('div','office-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u105106-v1-a-','');const[title,detail]=tasks[task];view=node('div','office-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','行动任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit105-106/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.office-intro .practice-progress')||heading;}};}
core.unit105106Scene={storyProps,create};
})(globalThis.CanranCore);
