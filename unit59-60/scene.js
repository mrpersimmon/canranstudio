(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const picture=(name,cls,alt,format='svg')=>{const el=node('img',cls);el.src='/assets/unit59-60/'+name+'.'+format;el.alt=alt;return el;};
function storyProps(){
 const element=node('div','stationery-world');element.setAttribute('role','group');element.setAttribute('aria-label','女士与售货员的文具店场景');
 const location=node('p','stationery-location','文具店'),actors={};
 for(const[who,label]of [['lady','Lady'],['assistant','Shop assistant']]){const actor=node('div','stationery-actor dialogue-actor actor-'+who);actor.dataset.actor=who;const img=picture(who,'stationery-cast',who==='lady'?'女士朝向右侧售货员':'售货员朝向左侧女士','webp');actor.append(img,node('span','actor-label',label));element.append(actor);actors[who]=img;}
 const desk=node('div','stationery-desk');const props={};for(const[key,alt]of [['large','大号信封'],['pad','大本信笺簿'],['glue','一瓶胶水'],['chalk','一小盒粉笔']]){props[key]=picture(key,'counter-prop prop-'+key,alt);desk.append(props[key]);}
 element.append(desk,location);
 const setPose=(who,name)=>{const src='/assets/unit59-60/'+name+'.webp';if(actors[who].getAttribute('src')!==src)actors[who].src=src;actors[who].dataset.pose=name;};
 function update(i){
  const bag=i>=12,showPad=i>=5&&i<=6;
  setPose('lady',bag?'lady-change':'lady');setPose('assistant',showPad?'assistant-pad':'assistant');
  props.large.hidden=bag;props.pad.hidden=bag||i<4||showPad;props.glue.hidden=bag||i<8;props.chalk.hidden=i<9;
  element.dataset.beat=i<3?'envelopes':i<7?'paper':i<9?'glue':i<12?'chalk':'change';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('stationery-runner');const content=element.querySelector('.practice-content'),intro=node('div','stationery-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model stationery-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u5960-v1-a-','');view=node('div','stationery-application');view.dataset.task=task;view.dataset.sent='false';view.setAttribute('role','group');view.setAttribute('aria-label','新客人的柜台');
  if(task==='time')view.append(picture('clock-10','counter-clock','十点整的钟面'));
  else if(task==='pack'){view.append(picture('glue','packing-item','等待装袋的胶水'),picture('bag','packing-bag','采购纸袋'));}
  else if(task==='stock'){view.append(picture('pad','stock-pad','有货的大本信笺簿'),node('p','stock-label','small pads · 0\nlarge pads · 有货'));}
  else{view.append(picture('lady','mini-lady','新顾客朝向售货员','webp'),picture('assistant','mini-assistant','售货员朝向顾客','webp'),picture(task==='size'?'size':task==='change'?'change':'bag','counter-task-prop','柜台上的物品'));}
  intro.append(view);content.prepend(intro);
 },answer(value){view.dataset.sent=String(value!==null&&task==='pack');},finish(){},completion(){return null;},heading(){return element.querySelector('.stationery-intro .practice-progress')||heading;}
};}
core.unit5960Scene={storyProps,create};
})(globalThis.CanranCore);
