(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit99-100/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','message-world');element.setAttribute('role','group');element.setAttribute('aria-label','楼梯旁：Andy与Lucy交谈');
 for(const[key,label,side]of [['andy','Andy','left'],['lucy','Lucy','right']]){const wrap=node('div','dialogue-actor message-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'message-cast',key==='andy'?'Andy坐着，面向右侧的Lucy':'Lucy全身完整，面向左侧的Andy','webp'),node('span','actor-label',label));element.append(wrap);}
 element.append(node('p','message-location','楼梯旁'));
 const lucy=element.querySelector('[data-actor="lucy"] img');
 function update(i){element.dataset.scene=i>=8?'phone':'conversation';lucy.src='/assets/unit99-100/'+(i>=8?'lucy-phone':'lucy')+'.webp';lucy.alt=i>=8?'Lucy面向左侧，拿着电话转述消息':'Lucy全身完整，面向左侧的Andy';}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='andy'?'left':'right'};
}
const tasks={phone:['A phone message','Who will come?','Dr. Carter will come.'],person:['Mia’s message','Keep the person and the meaning.','Mia has lost her pen.'],group:['The boys’ message','Who does “we” refer to?','They don’t need any money.'],need:['Eva’s message','Keep what she needs.','She needs a licence.'],negative:['The mechanic’s message','Keep the negative meaning.','He can’t repair the car.'],time:['A plan from Monday','Report the plan, not its outcome.','He said that he would phone.'],belief:['Lucy’s view','Whose view is this?','Lucy is sure that Andy needs an X-ray.'],unknown:['No later update','Keep what is still unknown.','He says he will come. Arrival is not confirmed.']};
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('message-runner');const content=element.querySelector('.practice-content'),intro=node('div','message-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u99100-v1-a-','');const[title,detail]=tasks[task];view=node('div','message-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','传话记录');view.append(picture('message-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},
 answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit99-100/'+(checked?'message-checked':'message-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.message-intro .practice-progress')||heading;}
};}
core.unit99100Scene={storyProps,create};
})(globalThis.CanranCore);
