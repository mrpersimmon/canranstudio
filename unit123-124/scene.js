(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit123-124/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','photo-world');element.setAttribute('role','group');element.setAttribute('aria-label','Mike和Scott查看旅行照片');
 for(const[key,label,poses]of [['mike','Mike',[['mike','mike-show','Mike面向右侧介绍照片，当前没有胡子'],['mike-chin','mike-chin','Mike轻触已经刮净的下巴，面向右侧']]],['scott','Scott',[['scott','scott-listen','Scott面向左侧看照片'],['scott-surprised','scott-surprised','Scott面向左侧，露出好奇的表情']]]]){const wrap=node('div','dialogue-actor photo-actor');wrap.dataset.actor=key;wrap.dataset.position=key==='mike'?'left':'right';for(const[name,cls,alt]of poses){const img=picture(name,'photo-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 const display=node('figure','travel-photo-display');display.setAttribute('role','group');display.setAttribute('aria-label','旅行照片');
 for(const[name,key,alt,ext]of [['trip-people','people','照片中的三位旅客','webp'],['ship-photo','ship','照片中的一条轮船','svg'],['job-man','man','照片中戴帽子的男士，没有络腮胡子','webp'],['beard-photo','beard','照片中留着络腮胡子、戴圆眼镜的男士','webp']]){const img=picture(name,'travel-photo-image',alt,ext);img.dataset.photo=key;img.hidden=true;display.append(img);}display.append(node('figcaption','travel-photo-caption','照片'));display.hidden=true;element.append(display,node('p','photo-location','Mike与Scott · 看照片'));
 return{element,update(i){
  const current=i<4?'people':i<6?'ship':i<10?'man':'beard';element.dataset.photo=i<0?'none':current;
  display.hidden=i<0;for(const img of display.querySelectorAll('.travel-photo-image'))img.hidden=img.dataset.photo!==current;
  for(const[s,show]of Object.entries({'.mike-show':i<14,'.mike-chin':i>=14,'.scott-listen':i<10||i>=14,'.scott-surprised':i>=10&&i<14}))element.querySelector(s).hidden=!show;
 },sideFor:(_,who)=>who==='mike'?'left':'right'};
}
const tasks={photograph:['Read the photo record','Compare photographer and day.','Photo A matches both details.'],caption:['Write a short caption','Keep the person and the action.','The man standing there is Ben.'],reply:['Answer the speaker','Keep the speaker and listener clear.','You told me about the film.'],prepositions:['Complete the captions','Keep each original relation.','Travelled on; told you about.'],praise:['Admire the postcard','Keep the number shown.','What beautiful ships!'],how:['Praise the singing','Express the given feeling.','How beautifully she sings!'],decision:['Confirm the decision task','Keep what still needs deciding.','You must decide about it.'],clue:['Keep the identifying clue','Compare the two ships.','The description still needs its clue.']};
function create({element}){let view,heading,task;return{present(question,progress){
 element.classList.remove('role-runner');element.classList.add('photo-runner');const content=element.querySelector('.practice-content'),intro=node('div','photo-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 task=question.id.replace('u123124-v1-a-','');const[title,detail]=tasks[task];view=node('div','photo-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','照片任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit123-124/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.photo-intro .practice-progress')||heading;}};}
core.unit123124Scene={storyProps,create};
})(globalThis.CanranCore);
