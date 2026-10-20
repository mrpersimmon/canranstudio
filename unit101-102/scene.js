(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit101-102/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','postcard-world');element.setAttribute('role','group');element.setAttribute('aria-label','室内：Grandmother听Penny读明信片');
 for(const[key,label,side]of [['grandmother','Grandmother','left'],['penny','Penny','right']]){const wrap=node('div','dialogue-actor postcard-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'postcard-cast',key==='grandmother'?'Grandmother坐在左侧，面向右侧的Penny':'Penny坐在右侧，面向Grandmother，手持一张明信片','webp'),node('span','actor-label',label));element.append(wrap);}
 element.append(node('p','postcard-location','读明信片'));
 return{element,update(i){element.dataset.reading=String(i>=0);},sideFor:(_i,who)=>who==='grandmother'?'left':'right'};
}
const tasks={read:['A card from Ben','Who wrote these words?','The writer is Ben.'],hear:['A reading conversation','Respond to the request.','Of course. I’ll speak up.'],recipient:['A message for two people','Check who receives it.','Jimmy hopes they are all well.'], 'fact-yes':['Check a fact','Read the current situation.','Yes, he has.'],'fact-no':['Check a fact','Read the current situation.','No, he hasn’t.'],update:['A later update','Check whether it is finished.','She says she has written the card.'],check:['Check the cards','Complete the confirmation.','There are two cards, aren’t there?'],tone:['A confirmation','Read the speaker’s intention.','A falling tag can invite agreement.']};
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('postcard-runner');const content=element.querySelector('.practice-content'),intro=node('div','postcard-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u101102-v1-a-','');const[title,detail]=tasks[task];view=node('div','postcard-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','消息核对记录');view.append(picture('postcard-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},
 answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit101-102/'+(checked?'postcard-checked':'postcard-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.postcard-intro .practice-progress')||heading;}
};}
core.unit101102Scene={storyProps,create};
})(globalThis.CanranCore);
