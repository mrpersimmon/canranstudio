(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const picture=(name,alt,cls='')=>{const e=node('img',cls);e.src='/assets/unit19-20/'+name+'-v1.webp';e.alt=alt;return e;};
function storyProps(){
 const element=node('div','park-world');element.setAttribute('role','group');element.setAttribute('aria-label','妈妈和两个孩子在公园长椅旁');
 const cast=node('div','park-cast'),family=picture('cast-standing','妈妈关心站在长椅旁的两个孩子','cast-image family-image');
 const labels=node('div','park-labels');for(const[id,name]of [['mother','妈妈'],['girl','女孩'],['boy','男孩']]){const actor=node('div','dialogue-actor '+id);actor.dataset.actor=id;actor.append(node('span','actor-label',name));labels.append(actor);}
 cast.append(family,labels);const vendor=picture('cast-vendor','卖冰淇淋的人站在小车后面','cast-image park-vendor');vendor.hidden=true;
 element.append(node('p','park-location','公园'),vendor,cast);
 return{element,update(index){
  const phase=index<3?'standing':index<7?'resting':index===7?'offering':'received';element.dataset.phase=phase;
  const assets={standing:['cast-standing','妈妈关心站在长椅旁的两个孩子'],resting:['cast-resting','孩子们坐在长椅上，双手空着，仍显得疲倦'],offering:['cast-offer','妈妈拿着两份冰淇淋，孩子们伸出空手'],received:['cast-received','两个孩子各拿着一份冰淇淋，妈妈双手空着']};
  family.src='/assets/unit19-20/'+assets[phase][0]+'-v1.webp';family.alt=assets[phase][1];vendor.hidden=index<6;
 }};
}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('park-runner');const content=element.querySelector('.practice-content'),intro=node('div','park-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','park-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'选好表达，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.park-intro .practice-progress')||heading;}
};}
core.unit1920Scene={storyProps,create};
})(globalThis.CanranCore);
