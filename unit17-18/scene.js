(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const picture=(name,alt,cls='')=>{const e=node('img',cls);e.src='/assets/unit17-18/'+name+'-v1.webp';e.alt=alt;return e;};
function storyProps(){
 const element=node('div','office-world');element.setAttribute('role','group');element.setAttribute('aria-label','Jackson和Richards在办公室介绍同事');
 const cast=node('div','office-cast');
 for(const [id,name,alt]of [['jackson','Mr. Jackson','Jackson面向右侧，伸手介绍同事'],['richards','Mr. Richards','Richards戴着帽子和眼镜，面向左侧听介绍']]){
  const actor=node('div','dialogue-actor '+id);actor.dataset.actor=id;actor.append(picture('cast-'+id,alt,'cast-image'),node('span','actor-label',name));cast.append(actor);
 }
 const guests=node('div','office-guests'),groups=new Map();
 for(const [id,names,alt]of [['women',['Nicola Grey','Claire Taylor'],'Nicola盘着发髻，Claire留着齐肩发，两人看向右侧访客'],['men',['Michael Baker','Jeremy Short'],'Michael穿着棕色背心，Jeremy戴着眼镜，两人看向右侧访客'],['jim',['Jim'],'Jim穿着浅色衬衫，面向右侧访客']]){
  const group=node('div','office-colleagues '+id),labels=node('div','colleague-labels');group.dataset.group=id;
  for(const name of names)labels.append(node('span','actor-label',name));
  group.append(picture('cast-'+id,alt,'cast-image'),labels);groups.set(id,group);guests.append(group);
 }
 element.append(node('p','office-location','办公室'),cast,guests);
 return{element,update(index){const phase=index<2?'welcome':index<7?'women':index<13?'men':'jim';element.dataset.phase=phase;for(const[id,group]of groups)group.hidden=id!==phase;}};
}
function create({element}){let status,heading;return{
 present(question,progress){element.classList.add('office-runner');const content=element.querySelector('.practice-content'),intro=node('div','office-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','office-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){status.textContent=value===null?'选好表达，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},
 finish(){},completion(){return null;},heading(){return element.querySelector('.office-intro .practice-progress')||heading;}
};}
core.unit1718Scene={storyProps,create};
})(globalThis.CanranCore);
