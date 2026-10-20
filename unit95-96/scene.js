(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit95-96/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','rail-world');element.setAttribute('role','group');element.setAttribute('aria-label','车站场景：人物随原文交谈对象切换');
 for(const[key,label,side]of [['george','George','left'],['ken','Ken','right'],['attendant','售票员','right'],['porter','乘务员','right']]){const wrap=node('div','dialogue-actor rail-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'rail-cast',label+'全身完整，面向'+(side==='left'?'右侧':'左侧')+'交谈者','webp'),node('span','actor-label',label));element.append(wrap);}
 const location=node('p','rail-location','售票处'),clock=node('figure','story-clock');clock.append(picture('time-0757','','原文中的钟面'),node('figcaption','','钟面'));element.append(location,clock);
 function update(i){const right=i<4?'attendant':i<10?'ken':'porter';for(const person of element.querySelectorAll('.dialogue-actor'))person.hidden=person.dataset.actor!=='george'&&person.dataset.actor!==right;const scene=i<4?'ticket':i===9?'bar':i<10?'station':'gate';element.dataset.scene=scene;location.textContent={ticket:'售票处',station:'车站',bar:'车站旁的酒吧',gate:'检票处'}[scene];clock.hidden=![7,8,13,14,15,16].includes(i);clock.querySelector('img').src='/assets/unit95-96/'+(i>=13?'time-0815':'time-0757')+'.svg';}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='george'?'left':'right'};
}
const tasks={tickets:['tickets','Travel request','Two people · London · return','Two return tickets to London'],slow:['clock','Check the exact time','Read the clock correction.','10 minutes until departure'],platform:['platform','Platform notice','Read the route before replying.','Platform Three · over the bridge'],advice:['advice','A rainy journey','Give your friend advice.','Take an umbrella'],wait:['station','A place to wait','Choose a quiet place.','We had better not wait here.'],calendar:['future','Rome travel plan','Use the date in the material.','15 January 2027'],reply:['sydney','Your travel plan','Reply for yourself.','I’ll go to Sydney in a month’s time.'],fast:['clock','Check the watch','Read the time difference.','Exact time · 14:15']};
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('rail-runner');const content=element.querySelector('.practice-content'),intro=node('div','rail-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u9596-v1-a-','');const[art,title,detail]=tasks[task];view=node('div','rail-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','出行核对记录');view.append(picture(art,'application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},
 answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?3:1];},finish(){},completion(){return null;},heading(){return element.querySelector('.rail-intro .practice-progress')||heading;}
};}
core.unit9596Scene={storyProps,create};
})(globalThis.CanranCore);
