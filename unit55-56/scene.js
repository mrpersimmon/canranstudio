(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const picture=(name,cls='',alt='',format='svg')=>{const el=node('img',cls);el.src='/assets/unit55-56/'+name+'.'+format;el.alt=alt;return el;};
function world({application=false}={}){
 const element=node('div','family-world');element.setAttribute('role','group');element.setAttribute('aria-label',application?'日程整理区':'索耶家的日常场景');
 for(const[who,label]of [['mr-sawyer','Mr. Sawyer'],['mrs-sawyer','Mrs. Sawyer'],['children','the children']]){const actor=node('div','family-actor dialogue-actor actor-'+who);actor.dataset.actor=who;actor.append(picture(who,'','', 'webp'),node('span','',label));element.append(actor);}
 const night=picture('family-night','family-evening','索耶先生读报，孩子们在桌边做作业，索耶夫人陪伴在旁','webp');night.hidden=true;element.append(night);
 const location=node('p','family-location');
 const prop=picture('home','family-prop','索耶家的房子'),label=application?node('p','family-prop-label'):null;element.append(prop,location);if(label)element.append(label);
 const beats=[['welcome','索耶家 · 87 King Street','home','家的一天'],['morning','早晨 · 去上班和上学','home','出门啦'],['chores','白天 · 在家做家务','housework','在家'],['noon','中午 · 吃午饭','lunch','午饭时间'],['afternoon','下午 · 和朋友见面','together','一起喝茶'],['early','傍晚 · 孩子们先到家','home','到家早'],['late','傍晚 · 爸爸下班回家','home','到家晚'],['night','夜晚 · 作业、读报与休息',null,'']];
 function show(index=0,confirmed=false){
  const key=Math.max(0,Math.min(7,index)),[beat,title,art,caption]=beats[key];element.dataset.beat=application?'schedule':beat;element.dataset.confirmed=String(confirmed);element.dataset.sent=String(confirmed);
  location.textContent=application?'日程小编 · 核对每一项':'索耶家 · 87 King Street';
  for(const actor of element.querySelectorAll('.family-actor')){const who=actor.dataset.actor;actor.hidden=!application&&((key===0||key===7)||((key===2||key===3||key===4)&&who!=='mrs-sawyer')||(key===5&&who!=='children')||(key===6&&who!=='mr-sawyer')||(key===1&&who==='mrs-sawyer'));
   if(application)actor.hidden=who==='children';
  }
  night.hidden=application||(key!==0&&key!==7);
  prop.hidden=!application&&key===7;if(label)label.hidden=prop.hidden;
  const file=application?(confirmed?'schedule-complete':'schedule'):art;
  if(file&&prop.dataset.file!==file){prop.src='/assets/unit55-56/'+file+'.svg';prop.dataset.file=file;}
  if(label)label.textContent=confirmed?'日程核对完成':'日程记录';prop.alt=application?'日程记录表':({home:'房子',housework:'家务用品',lunch:'午餐餐具',together:'茶具'})[art]||'场景物品';
 }
 show();return{element,show};
}
function storyProps(){const view=world();return{element:view.element,update(i){view.show(Math.max(0,i));}};}
function create({element}){let view,heading,beat;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('family-runner');const content=element.querySelector('.practice-content'),intro=node('div','family-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
 if(question.workshop?.model){const demo=node('aside','grammar-model family-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
 intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 view=world({application:true});view.element.classList.add('family-application');beat=question.id.replace('u5556-v1-a-','');view.element.dataset.task=beat;intro.append(view.element);content.prepend(intro);},
 answer(value){view.show(0,value!==null&&beat==='send');},finish(){},completion(){return null;},heading(){return element.querySelector('.family-intro .practice-progress')||heading;}
};}
core.unit5556Scene={storyProps,create};
})(globalThis.CanranCore);
