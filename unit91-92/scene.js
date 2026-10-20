(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit91-92/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','future-world');element.setAttribute('role','group');element.setAttribute('aria-label','Catherine、Jenny、Linda在门前交谈，随对白切换交谈对象');
 for(const[key,label,side]of [['catherine','Catherine','left'],['jenny','Jenny','right'],['linda','Linda','left']]){
  const wrap=node('div','dialogue-actor future-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'future-cast',label+'全身完整，面向'+(side==='left'?'右侧Jenny':'左侧交谈者'),'webp'),node('span','actor-label',label));element.append(wrap);
 }
 const location=node('p','future-location','三位邻居 · Ian家门前');element.append(location);
 function update(i){const withLinda=[6,9,10,11].includes(i);element.dataset.scene=withLinda?'linda-jenny':'catherine-jenny';element.querySelector('[data-actor="linda"]').hidden=!withLinda;element.querySelector('[data-actor="catherine"]').hidden=withLinda;}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='jenny'?'right':'left'};
}
const tasks={
message:['regards','Linda → ? → Ian','Jenny will see Ian today.','Linda → Jenny → Ian'],
calendar:['calendar','Conversation: 10 June','Move: tomorrow afternoon','Ian · 11 June · afternoon'],
reply:['people','Will you see Ian today?','Jenny confirms her plan.','Jenny · Yes, I will.'],
help:['move','This box is too heavy.','You decide to help now.','Offer · I’ll help you.'],
plan:['bags','Plan: pack tomorrow','Not finished now.','Plan retained · not completed'],
ask:['repair','Repair my car','Ask about the future time.','When will you repair my car?'],
notice:['future','Read three notices','Arrangement / immediate / plan','Three meanings matched'],
boundary:['neighbour','I think…','The new people have not moved in.','Prediction · not a completed move']
};
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('future-runner');const content=element.querySelector('.practice-content'),intro=node('div','future-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u9192-v1-a-','');const[art,title,detail]=tasks[task];view=node('div','future-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','邻里约定记录');view.append(picture(art,'application-prop',title));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},
 answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?3:1];},finish(){},completion(){return null;},heading(){return element.querySelector('.future-intro .practice-progress')||heading;}
};}
core.unit9192Scene={storyProps,create};
})(globalThis.CanranCore);
