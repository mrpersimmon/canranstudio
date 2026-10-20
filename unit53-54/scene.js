(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const image=(name,cls='',alt='',format='svg')=>{const el=node('img',cls);el.src='/assets/unit53-54/'+name+'.'+format;el.alt=alt;return el;};
function world({application=false}={}){
 const element=node('div','weather-world');element.setAttribute('role','group');element.setAttribute('aria-label',application?'观察站接待区':'Hans和Jim的天气观察站');
 for(const [who,label]of [['hans','Hans'],['jim','Jim']]){const person=node('div','weather-actor dialogue-actor actor-'+who);person.dataset.actor=who;person.append(image(who,'','', 'webp'),node('span','',label));element.append(person);}
 const location=node('p','weather-location',application?'观察站 · 欢迎新朋友':'花园里的天气观察站');
 const board=image('board-directions','weather-board','观察站方位板'),label=application?node('p','weather-board-label','方位观察'):null;
 element.append(board,location);if(label)element.append(label);
 function show(page='directions',sent=false){element.dataset.observation=page;element.dataset.sent=String(sent);const file=sent?'board-complete':'board-'+page;if(board.dataset.file!==file){board.src='/assets/unit53-54/'+file+'.svg';board.dataset.file=file;}
 if(label)label.textContent=sent?'接待记录完成':'方位观察';board.alt=sent?'接待记录板':page==='directions'?'观察站方位板':page==='regions'?'天气图示板':'日夜长短示意板';
 }
 show();return {element,show};
}
function storyProps(){const view=world();return{element:view.element,update(i){view.show(i>=7?'short-day':i>=6?'long-day':i>=4?'regions':'directions');}};}
function create({element}){let view,heading,beat;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('weather-runner');const content=element.querySelector('.practice-content'),intro=node('div','weather-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
 if(question.workshop?.model){const demo=node('aside','grammar-model weather-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
 intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 view=world({application:true});view.element.classList.add('weather-application');beat=question.id.replace('u5354-v1-a-','');view.element.dataset.task=beat;view.element.dataset.confirmed='false';intro.append(view.element);content.prepend(intro);},
 answer(value){view.element.dataset.confirmed=String(value!==null);view.show('directions',value!==null&&beat==='send');},finish(){},completion(){return null;},heading(){return element.querySelector('.weather-intro .practice-progress')||heading;}
};}
core.unit5354Scene={storyProps,create};
})(globalThis.CanranCore);
