(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit77-78/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','牙科诊所前台');element.setAttribute('role','group');element.setAttribute('aria-label','克罗夫特先生与护士面对面交谈的诊所场景');
 for(const[key,label,side,alt]of [['croft','Mr. Croft','left','克罗夫特先生扶着面颊，面向右侧护士'],['nurse','Nurse','right','护士拿着预约本，面向左侧的克罗夫特先生']]){const wrap=node('div','dialogue-actor visit-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',alt,'webp'),node('span','actor-label',label));element.append(wrap);}
 element.append(location);
 function update(i){

  element.dataset.proposal=i>=8?'afternoon':i>=6?'morning':'none';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u7778-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','核对诊所时间资料');
  const entries={offer:['appointment','时间提议待核对','按护士的话记录'],afternoon:['pm','2 p.m.','下午钟点'],prepositions:['calendar','at · on · in','根据时间种类配好'],month:['january','5 January 2026','两个月以前'], 'half-hour':['quarter-past','11:15','半小时以前'],past:['air','this morning','下午回看上午'],reply:['school','School ends at 3 p.m.','核对能否两点来'],when:['lose','Sunday','昨天发生了什么']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','diary-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){
  const checked=value!==null&&['offer','afternoon'].includes(task);view.dataset.opened=String(checked);
  if(task==='offer'){view.querySelector('.diary-page strong').textContent=checked?'10 a.m.':'时间提议待核对';view.querySelector('.diary-page span').textContent=checked?'Monday, April 24th · 提议':'按护士的话记录';}
  if(task==='afternoon'){view.querySelector('.diary-page strong').textContent=checked?'14:00':'2 p.m.';view.querySelector('.diary-page span').textContent=checked?'时间核对完成':'下午钟点';}
 },finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit7778Scene={storyProps,create};
})(globalThis.CanranCore);
