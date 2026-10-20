(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit85-86/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','电影院外');element.setAttribute('role','group');element.setAttribute('aria-label','电影院外，George与Ken面向彼此聊电影和旅行');
 for(const[key,label,side]of [['george','George','left'],['ken','Ken','right']]){const wrap=node('div','dialogue-actor visit-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+'全身完整，面向'+(side==='left'?'右侧Ken':'左侧George'),'webp'),node('span','actor-label',label));element.append(wrap);}
 const poster=node('figure','story-poster');poster.append(picture('poster','','电影海报中的巴黎'),node('figcaption','','电影海报'));element.append(poster);
 const memory=node('figure','story-memory');memory.append(picture('paris-memory','','Ken回忆四月的巴黎一直下雨'),node('figcaption','','Ken的旅行回忆'));memory.hidden=true;element.append(memory);
 element.append(location);

 function update(i){element.dataset.scene=i>=9?'travel-memory':i>=6?'film-experience':'cinema';memory.hidden=i<11;poster.hidden=i>=11;}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='ken'?'right':'left'};
}
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u8586-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','行程与行动记录');
 const entries={back:['returned','Amy · back home','cinema today → home'],away:['away','Ben · not back','left for the cinema'],stay:['stay','Mia · London','three days · still here'],film:['film','Anna · film seen','Paris: never visited'],questions:['city','Travel notebook','experience / when / how long'],done:['air','Room ✓ / Shoes ✗','done / not done'],clock:['type','Letter typed: 09:00','Now: 15:00'],homework:['homework','Yesterday’s homework','finished last night']};const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','diary-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null&&['back','away'].includes(task);view.dataset.opened=String(checked);if(task==='back'){view.querySelector('.diary-page strong').textContent=checked?'Amy · 行程已记录':'Amy · back home';}if(task==='away'){view.querySelector('.diary-page strong').textContent=checked?'Ben · 留言已写好':'Ben · not back';}},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit8586Scene={storyProps,create};
})(globalThis.CanranCore);
