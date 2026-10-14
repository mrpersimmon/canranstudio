(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit49-50/'+name+'.svg';el.alt=alt;return el;};
function world({application=false}={}){
 const element=node('div','market-world');element.setAttribute('role','group');element.setAttribute('aria-label',application?'新采购单的备货场景':'老板与Mrs. Bird的肉店');
 const actors={};for(const[who,label]of [['butcher','The butcher'],['bird','Mrs. Bird']]){const person=node('div','market-actor dialogue-actor actor-'+who);person.dataset.actor=who;actors[who]=image(who);person.append(actors[who],node('span','',label));element.append(person);}
 const location=node('p','market-location',application?'换个情境 · 一张新采购单':'在肉店里');
 const counter=image('counter','market-counter'),steak=image('counter-steak','market-steak','柜台上的一块牛排'),mince=image('counter-mince','market-mince','装好的一磅肉馅'),scale=image('scale','market-scale','店里的秤'),order=image('order-cabbage-pear','market-order','按采购单装好的卷心菜和梨');element.append(counter,steak,mince,scale,order,location);
 function pose(who,name){if(actors[who].dataset.pose===name)return;actors[who].dataset.pose=name;actors[who].src='/assets/unit49-50/'+name+'.svg';}
 function show({steakOwner='counter',minceAdded=false,prepared=false,choice=false}={}){
  element.dataset.steak=steakOwner;element.dataset.mince=String(minceAdded);element.dataset.prepared=String(prepared);
  pose('butcher',!application&&steakOwner==='butcher'?'butcher-steak':'butcher');
  pose('bird',!application&&steakOwner==='bird'?'bird-parcel':choice?'bird-choose':'bird');
  steak.hidden=application||steakOwner!=='counter';mince.hidden=application||!minceAdded;order.hidden=!prepared;scale.hidden=application;
 }
 show();return{element,show};
}
function storyProps(){const view=world();return{element:view.element,update(i){view.show({steakOwner:i>=7?'bird':i===6?'butcher':'counter',minceAdded:i>=7,choice:i>=2&&i<6});}};}
function create({element}){let view,heading,beat;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('market-runner');const content=element.querySelector('.practice-content'),intro=node('div','market-intro');heading=node('h3','',question.display?.title||question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model market-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),english=node('p','',en);english.lang='en';row.append(english,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);view=world({application:true});view.element.classList.add('market-application');beat=question.id.replace('u4950-v2-a-','');view.element.dataset.task=beat;view.element.dataset.confirmed='false';intro.append(view.element);content.prepend(intro);
 },answer(value){view.element.dataset.confirmed=String(value!==null);view.show({prepared:value!==null&&beat==='order'});},finish(){},completion(){return null;},heading(){return element.querySelector('.market-intro .practice-progress')||heading;}
};}
core.unit4950Scene={storyProps,create};
})(globalThis.CanranCore);
