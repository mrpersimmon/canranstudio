(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit47-48/'+name+'.svg';el.alt=alt;return el;};
function world({application=false}={}){
 const element=node('div','coffee-world');element.setAttribute('role','group');element.setAttribute('aria-label',application?'Ann招待Christine的另一场茶点聚会':'Christine和Ann的咖啡桌');
 const actors={};
 for(const [who,label]of [['christine','Christine'],['ann','Ann']]){
  const person=node('div','coffee-actor dialogue-actor actor-'+who);person.dataset.actor=who;actors[who]=image(who);person.append(actors[who],node('span','',label));element.append(person);
 }
 const location=node('p','coffee-location',application?'换个情境 · Ann 来招待 Christine':'Christine 的客厅');
 const table=image('table','coffee-table'),cup=image(application?'cup':'coffee','coffee-cup','桌上的杯子'),sugar=image('sugar','coffee-sugar','糖罐'),milk=image('milk-jug','coffee-milk','未倒入咖啡的奶壶'),plate=image('plate','coffee-plate','饼干盘'),biscuit=image('biscuit','coffee-biscuit','盘中的一块饼干'),order=image('tea-biscuit','coffee-order','为客人准备的茶和一块饼干');
 element.append(table,cup,sugar,milk,plate,biscuit,order,location);order.hidden=true;
 function pose(who,name){if(actors[who].dataset.pose===name)return;actors[who].dataset.pose=name;actors[who].src='/assets/unit47-48/'+name+'.svg';}
 function show({cupOwner='table',sugarAccepted=false,milkDeclined=false,biscuitOwner='table',offer='none',prepared=false}={}){
  element.dataset.cup=cupOwner;element.dataset.sugar=String(sugarAccepted);element.dataset.milk=milkDeclined?'declined':'waiting';element.dataset.biscuit=biscuitOwner;element.dataset.offer=offer;element.dataset.prepared=String(prepared);
  pose('christine',application?'christine':offer==='sugar'?'christine-sugar':offer==='none'?'christine':'christine-offer');
  pose('ann',application?'ann':biscuitOwner==='ann'?'ann-biscuit':cupOwner==='ann'?'ann-cup':'ann');
  cup.hidden=cupOwner==='ann'||prepared;biscuit.hidden=biscuitOwner==='ann'||prepared;plate.hidden=prepared;order.hidden=!prepared;
  sugar.classList.toggle('is-used',sugarAccepted);milk.classList.toggle('is-offered',offer==='milk'&&!milkDeclined);
 }
 show();return{element,show};
}
function storyProps(){const view=world();return{element:view.element,update(i){view.show({cupOwner:i>=3?'ann':'table',sugarAccepted:i>=5,milkDeclined:i>=7,biscuitOwner:i>=11?'ann':'table',offer:i===2?'cup':i===4||i===5?'sugar':i===6?'milk':i>=8&&i<11?'biscuit':'none'});}};}
function create({element}){
 let view,heading,beat;
 return{
  present(question,progress){
   element.classList.remove('role-runner');element.classList.add('coffee-runner');const content=element.querySelector('.practice-content'),intro=node('div','coffee-intro');
   heading=node('h3','',question.display?.title||question.prompt);heading.tabIndex=-1;intro.append(progress);
   if(question.workshop?.model){
    const demo=node('aside','grammar-model coffee-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');
    for(const [en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),english=node('p','',en);english.lang='en';row.append(english,node('small','',cn));demo.append(row);}
    intro.append(demo);
   }
   intro.append(heading);
   const material=content.querySelector('.practice-context');if(material)intro.append(material);
   view=world({application:true});view.element.classList.add('coffee-application');beat=question.id.replace('u4748-v1-a-','');view.element.dataset.task=beat;view.element.dataset.confirmed='false';view.show();intro.append(view.element);content.prepend(intro);
  },
  answer(value){view.element.dataset.confirmed=String(value!==null);view.show({prepared:value!==null&&beat==='handoff'});},
  finish(){},completion(){return null;},heading(){return element.querySelector('.coffee-intro .practice-progress')||heading;}
 };
}
core.unit4748Scene={storyProps,create};
})(globalThis.CanranCore);
