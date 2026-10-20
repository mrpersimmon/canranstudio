(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit111-112/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','showroom-world');element.setAttribute('role','group');element.setAttribute('aria-label','电视机店：Frith夫妇与店员交谈');
 element.append(picture('display-models','showroom-displays','两台待比较的电视机'));
 for(const[key,label,poses]of [['mr','Mr. Frith',[['mr-frith','mr-pose','Frith先生面向右侧交谈']]],['mrs','Mrs. Frith',[['mrs-frith','mrs-right-pose','Frith太太面向右侧店员'],['mrs-frith-left','mrs-left-pose','Frith太太面向左侧丈夫']]],['assistant','Assistant',[['assistant','assistant-listen-pose','店员面向左侧听顾客说话'],['assistant-show','assistant-show-pose','店员面向左侧介绍电视机']]]]){
  const wrap=node('div','dialogue-actor showroom-actor');wrap.dataset.actor=key;
  for(const[name,cls,alt]of poses){const img=picture(name,'showroom-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}
  wrap.append(node('span','actor-label',label));element.append(wrap);
 }
 element.append(node('p','showroom-location','电视机店'));
 return{element,update(i){const wifeToHusband=i===2||i>=7,showing=[1,3,6].includes(i);for(const[selector,visible]of [['.mr-pose',true],['.mrs-right-pose',!wifeToHusband],['.mrs-left-pose',wifeToHusband],['.assistant-listen-pose',!showing],['.assistant-show-pose',showing]])element.querySelector(selector).hidden=!visible;element.dataset.reading=String(i>=0);},sideFor:(_i,who)=>who==='assistant'?'right':'left'};
}
const tasks={price:['Compare prices','Find the same price.','B costs as much as the red model: £40.'],weight:['Compare weights','Use the recorded kilograms.','A is not as heavy as the 5 kg box.'],quality:['Check the evidence','Keep price and quality separate.','More information about quality is needed.'],equal:['Compare one feature','Use the stated demonstration.','A is as clear as B.'],ask:['Ask for a price','Use a question about cost.','How much does this model cost?'],plan:['Read a payment plan','Include the first and all later payments.','The stated total is £50.'],range:['Keep the stated range','Report Mia’s comparison.','For Mia, C is the most difficult of these three.'],budget:['Check the available amount','Use all stated costs.','Model A is within the £45 amount.']};
function create({element}){let view,heading,task;return{present(question,progress){element.classList.remove('role-runner');element.classList.add('showroom-runner');const content=element.querySelector('.practice-content'),intro=node('div','showroom-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u111112-v1-a-','');const[title,detail]=tasks[task];view=node('div','showroom-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','比较任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit111-112/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.showroom-intro .practice-progress')||heading;}};}
core.unit111112Scene={storyProps,create};
})(globalThis.CanranCore);
