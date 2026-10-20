(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit115-116/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','garden-world');element.setAttribute('role','group');element.setAttribute('aria-label','门口与花园的对话');
 const cast=[
 ['helen','Helen',[['helen','helen-talk','Helen面向右侧交谈']]],
 ['jim','Jim',[['jim','jim-talk','Jim空手交谈'],['jim-knock','jim-knock','Jim面向右侧抬手敲门'],['jim-look','jim-look','Jim面向右侧透过窗户看']]],
 ['carol','Carol',[['carol','carol-talk','Carol面向左侧迎接朋友']]],
 ['tom','Tom',[['tom','tom-talk','Tom面向左侧交谈，空手'],['tom-beer','tom-beer','Tom面向左侧，自己持有一瓶啤酒']]]];
 for(const[key,label,poses]of cast){const wrap=node('div','dialogue-actor garden-actor');wrap.dataset.actor=key;wrap.hidden=true;for(const[name,cls,alt]of poses){const img=picture(name,'garden-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 const location=node('p','garden-location','门口');element.append(location);
 const pair=i=>i<6?['helen','jim']:i===7?['helen','carol']:i===6||i===8||i===13?['jim','tom']:['jim','carol'];
 return{element,update(i){
  const current=pair(i);element.dataset.place=i<6?'door':'garden';element.dataset.view=i===3||i===4?'window':'door';location.textContent=i<6?'门口':'花园';
  for(const actor of element.querySelectorAll('.garden-actor')){const key=actor.dataset.actor;actor.hidden=!current.includes(key);actor.dataset.position=current.indexOf(key)===0?'left':'right';}
  const poses={'.helen-talk':true,'.jim-talk':i!==1&&i!==3&&i!==4,'.jim-knock':i===1,'.jim-look':i===3||i===4,'.carol-talk':true,'.tom-talk':i!==13,'.tom-beer':i===13};
  for(const[selector,visible]of Object.entries(poses))element.querySelector(selector).hidden=!visible;
 },sideFor:(i,who)=>pair(i)[0]===who?'left':'right'};
}
const tasks={
box:['Check the open boxes','Look inside each box.','The empty box is A.'],
search:['Record the search','Read the three marked spots.','All three spots were checked.'],
ready:['Check the guest list','Use only the named group.','Everyone in this group is ready.'],
offer:['Offer a drink','Follow the guest’s stated choice.','The guest accepts some lemonade.'],
boundary:['Keep the observation clear','Report only the checked place.','This box is empty.'],
report:['Write yesterday’s note','Keep the time and the people.','I met no one yesterday.'],
glasses:['Find the right object','Read what the friend needs.','These are glasses.'],
somewhere:['Leave a useful message','Keep the unknown position clear.','The key is somewhere in the room.']
};
function create({element}){let view,heading,task;return{present(question,progress){
 element.classList.remove('role-runner');element.classList.add('garden-runner');
 const content=element.querySelector('.practice-content'),intro=node('div','garden-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);
 const material=content.querySelector('.practice-context');if(material)intro.append(material);
 task=question.id.replace('u115116-v1-a-','');const[title,detail]=tasks[task];view=node('div','garden-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','花园任务记录');
 view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit115-116/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.garden-intro .practice-progress')||heading;}};}
core.unit115116Scene={storyProps,create};
})(globalThis.CanranCore);
