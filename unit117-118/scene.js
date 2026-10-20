(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit117-118/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','breakfast-world');element.setAttribute('role','group');element.setAttribute('aria-label','母亲讲述的早餐往事');
 const cast=[
 ['mother','Mother',[['mother','mother-neutral','母亲面向右侧'],['mother-breakfast','mother-breakfast','母亲面向右侧，手持早餐盘'],['mother-concerned','mother-concerned','母亲面向孩子，神情关切，手中没有硬币'],['mother-phone','mother-phone','母亲在家中接电话，另一手持掸子']]],
 ['father','Father',[['father','father-neutral','父亲面向左侧，低头看，手中没有硬币'],['father-phone','father-phone','父亲在办公室打电话，面向左侧']]],
 ['tommy','Tommy',[['tommy','tommy-neutral','Tommy面向左侧，双手放下且空着']]]];
 for(const[key,label,poses]of cast){const wrap=node('div','dialogue-actor breakfast-actor');wrap.dataset.actor=key;wrap.hidden=true;for(const[name,cls,alt]of poses){const img=picture(name,'breakfast-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 const scatter=picture('coins-scattered','floor-coins coins-scattered','地上散落的硬币，情节示意，不表示原文总数。'),two=picture('two-coins','floor-coins two-coins','地板上的两枚小硬币，面额未标。');scatter.hidden=two.hidden=true;element.append(scatter,two);
 const place=node('p','breakfast-location','饭厅');element.append(place);
 return{element,update(i){
  const phone=i>=4,child=i===2||i===3;const right=child?'tommy':'father';
  element.dataset.place=phone?'phone':'dining';place.textContent=phone?'家中 · 办公室':'饭厅';
  for(const actor of element.querySelectorAll('.breakfast-actor')){const key=actor.dataset.actor;actor.hidden=key!=='mother'&&key!==right;actor.dataset.position=key==='mother'?'left':'right';actor.querySelector('.actor-label').textContent=key==='mother'?(phone?'Mother · 家中':'Mother'):key==='father'?(phone?'Father · 办公室':'Father'):'Tommy';}
  const poses={'.mother-neutral':i<2,'.mother-breakfast':i===2,'.mother-concerned':i===3,'.mother-phone':phone,'.father-neutral':!phone,'.father-phone':phone,'.tommy-neutral':true};
  for(const[selector,visible]of Object.entries(poses))element.querySelector(selector).hidden=!visible;
  scatter.hidden=i!==0&&i!==1;two.hidden=i!==2;
 },sideFor:()=> 'left'};
}
const tasks={
reading:['Read the time record','Find the marked moment.','May was reading at 18:10.'],
parallel:['Compare two activities','Read both rows at 18:10.','Both activities were in progress.'],
reply:['Answer about the past','Use the speaker’s own record.','I was drawing a picture.'],
correct:['Correct the activity','Keep the stated time and person.','Tim was reading, not playing.'],
caption:['Write a time caption','Keep the exact moment clear.','The bell rang as the door was opening.'],
books:['Record the two books','Use the requested pronoun phrase.','I put them both on the table.'],
keys:['Check the search result','Compare found and still missing.','Not all the keys were found.'],
next:['Check the limit of the record','Look for what happened afterwards.','The later action is still unknown.']
};
function create({element}){let view,heading,task;return{present(question,progress){
 element.classList.remove('role-runner');element.classList.add('breakfast-runner');const content=element.querySelector('.practice-content'),intro=node('div','breakfast-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 task=question.id.replace('u117118-v1-a-','');const[title,detail]=tasks[task];view=node('div','breakfast-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','往事任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit117-118/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.breakfast-intro .practice-progress')||heading;}};}
core.unit117118Scene={storyProps,create};
})(globalThis.CanranCore);
