(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit113-114/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','bus-world');element.setAttribute('role','group');element.setAttribute('aria-label','公共汽车内的对话');
 const cast=[
 ['conductor','Conductor',[['conductor','conductor-empty','售票员面向左侧'],['conductor-note','conductor-note','售票员持一张纸币，面向左侧']]],
 ['man','Man',[['man','man-empty','男子空手面向右侧售票员'],['man-note','man-note','男子持一张纸币，面向右侧售票员']]],
 ['p1','1st Passenger',[['passenger-1','p1-pose','第一位乘客面向右侧售票员']]],
 ['p2','2nd Passenger',[['passenger-2','p2-pose','第二位乘客面向右侧售票员']]],
 ['p3','3rd Passenger',[['passenger-3','p3-pose','第三位乘客面向右侧售票员']]],
 ['p4','4th Passenger',[['passenger-4','p4-pose','第四位乘客面向右侧售票员']]],
 ['t1','1st Tramp',[['tramp-1','t1-empty','第一位流浪汉面向右侧，尚未展示零钱'],['tramp-1-coins','t1-coins','第一位流浪汉展示自己手中的零钱']]],
 ['t2','2nd Tramp',[['tramp-2','t2-empty','第二位流浪汉面向右侧，尚未展示零钱'],['tramp-2-coins','t2-coins','第二位流浪汉展示自己手中的零钱']]]
 ];
 for(const[key,label,poses]of cast){const wrap=node('div','dialogue-actor bus-actor');wrap.dataset.actor=key;wrap.hidden=true;for(const[name,cls,alt]of poses){const img=picture(name,'bus-cast '+cls,alt+'，全身完整','webp');img.hidden=true;wrap.append(img);}wrap.append(node('span','actor-label',label));element.append(wrap);}
 element.append(node('p','bus-location','公共汽车内'));
 return{element,update(i){
  const others=i>=12?['t1','t2']:i>=8&&i<=10?['p3','p4']:i>=5&&i<=7?['p1','p2']:['man'];
  element.dataset.group=others.join('-');element.dataset.castCount=String(others.length+1);
  for(const actor of element.querySelectorAll('.bus-actor')){
   const key=actor.dataset.actor;actor.hidden=key!=='conductor'&&!others.includes(key);actor.dataset.position=key==='conductor'?'right':others.indexOf(key)===0?'left':'middle';
  }
  const poses={'.conductor-empty':i<5,'.conductor-note':i>=5,'.man-note':i<5,'.man-empty':i>=5,'.p1-pose':true,'.p2-pose':true,'.p3-pose':true,'.p4-pose':true,'.t1-empty':i<13,'.t1-coins':i>=13,'.t2-empty':i<14,'.t2-coins':i>=14};
  for(const[selector,visible]of Object.entries(poses))element.querySelector(selector).hidden=!visible;
 },sideFor:(_i,who)=>who==='conductor'?'right':'left',actorsFor:who=>who==='tramps'?['t1','t2']:[who]};
}
const tasks={none:['Check the coin boxes','Count only the visible coins.','Box A has no coins.'],exchange:['Check an equal exchange','Every coin is worth £2.','Five £2 coins equal £10.'],can:['Reply about ability','Follow B’s stated ability.','So can I.'],different:['Report B’s own situation','Check whether the facts match.','B cannot swim.'],record:['Record both speakers','Read the second reply carefully.','Neither person has any envelopes.'],except:['Keep the two speakers clear','Choose the form after except.','Except us.'],unknown:['Check the amount','Look for denominations and quantities.','The exact total still needs checking.'],past:['Keep the time reference','Report the same past situation.','So was I.']};
function create({element}){let view,heading,task;return{present(question,progress){element.classList.remove('role-runner');element.classList.add('bus-runner');const content=element.querySelector('.practice-content'),intro=node('div','bus-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u113114-v1-a-','');const[title,detail]=tasks[task];view=node('div','bus-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','交流任务记录');view.append(picture('task-record','application-prop',''));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?2:0];view.querySelector('.application-prop').src='/assets/unit113-114/'+(checked?'task-checked':'task-record')+'.svg';},finish(){},completion(){return null;},heading(){return element.querySelector('.bus-intro .practice-progress')||heading;}};}
core.unit113114Scene={storyProps,create};
})(globalThis.CanranCore);
