(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit119-120/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','night-world');element.setAttribute('role','group');element.setAttribute('aria-label','George家中的故事场景');
 const cast=[
 ['george','George',[['george-reading','george-reading','George在床上看书，完整床架和双脚可见'],['george-alert','george-alert','George下楼查看，双手空着，神情留意'],['george','george-smile','George向右看着Henry微笑，手掌摊开']]],
 ['thieves','Two thieves',[['thieves-torch','thieves-torch','两位小偷在黑暗中，一位拿着手电筒'],['thieves-running','thieves-running','两位小偷向左跑开，手中没有手电筒']]],
 ['henry','Henry',[['henry','henry-perch','Henry睁着眼睛在栖架上，朝左看着George']]]];
 for(const[key,label,poses]of cast){const wrap=node('div','dialogue-actor night-actor');wrap.dataset.actor=key;wrap.hidden=true;for(const[name,cls,alt]of poses){const img=picture(name,'night-cast '+cls,alt+'，完整显示','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 const dropped=picture('torch-dropped','floor-torch','小偷扔在地上的手电筒');dropped.hidden=true;element.append(dropped);
 const place=node('p','night-location','George的家');element.append(place);
 return{element,update(i){
  element.dataset.place=i===1?'bedroom':i>=5?'lit':'dark';place.textContent=i===1?'卧室':i>=4?'楼下':i>=2?'饭厅':'George的家';
  const visible={george:i===1||i>=4,thieves:i===2||i===3,henry:i===6};
  for(const actor of element.querySelectorAll('.night-actor')){const key=actor.dataset.actor;actor.hidden=!visible[key];actor.dataset.position=i===6?(key==='george'?'left':'right'):'center';actor.dataset.pose=key==='george'?(i===1?'reading':i===6?'smile':'alert'):key==='thieves'?(i===2?'torch':'running'):'perch';}
  const poses={'.george-reading':i===1,'.george-alert':i===4||i===5,'.george-smile':i===6,'.thieves-torch':i===2,'.thieves-running':i===3,'.henry-perch':i===6};
  for(const[selector,show]of Object.entries(poses))element.querySelector(selector).hidden=!show;
  dropped.hidden=i!==3;
 },sideFor:()=> 'left'};
}
const tasks={
train:['Read the station record','Compare the two times.','The train had already left.'],
diary:['Read Jimmy’s diary','Keep the order of events.','Jimmy left after breakfast.'],
first:['Tell a first experience','Use the two reference points.','Now, and before this experience.'],
reason:['Explain the earlier action','Keep the listener clear.','You had already corrected it.'],
before:['Read the work record','Keep the same event order.','Work was finished before going out.'],
questions:['Ask and answer','Use the completion record.','Yes, they had.'],
duration:['Read the years recorded','Check what is known afterwards.','The later move is not recorded.'],
facts:['Find the missing evidence','Separate a request and its result.','We need Henry’s later actions.']
};
function create({element}){let view,heading,task;return{present(question,progress){
 element.classList.remove('role-runner');element.classList.add('night-runner');const content=element.querySelector('.practice-content'),intro=node('div','night-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
 task=question.id.replace('u119120-v1-a-','');const[title,detail]=tasks[task];view=node('div','night-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','时序任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit119-120/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.night-intro .practice-progress')||heading;}};}
core.unit119120Scene={storyProps,create};
})(globalThis.CanranCore);
