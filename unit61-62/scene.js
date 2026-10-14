(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit61-62/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','Williams 家');
 element.setAttribute('role','group');element.setAttribute('aria-label','医生家访场景');
 const actors={};
 for(const [key,label] of [['father','Mr. Williams'],['mother','Mrs. Williams'],['doctor','Doctor'],['bed','Jimmy']]){
  const wrap=node('div','dialogue-actor visit-actor actor-'+key);wrap.dataset.actor=key;const pic=picture(key,'visit-cast',label+'完整人物','webp');wrap.append(pic,node('span','actor-label',label));element.append(wrap);actors[key]=wrap;
 }
 const phone=node('div','visit-phone');phone.append(picture('telephone','phone-prop','课文中的电话'),node('span','phone-number','09754'));
 element.append(location,phone);
 function update(i){
  const arrived=i>=9,examining=i===9;
  element.dataset.beat=examining?'examination':arrived?'explanation':i>=7?'phone':'parents';
  actors.doctor.hidden=!arrived;actors.bed.hidden=!examining;actors.father.hidden=examining||i===12;actors.mother.hidden=arrived&&i!==12;
  actors.father.classList.toggle('at-right',arrived);
  // Only the art mirrors when father switches side; his name stays readable.
  actors.father.querySelector('img').style.transform=arrived?'scaleX(-1)':'';
  actors.father.querySelector('img').alt=arrived?'爸爸朝向左侧医生':'爸爸朝向右侧妈妈';
  actors.mother.querySelector('img').alt=arrived?'妈妈朝向左侧医生':'妈妈朝向左侧爸爸';
  actors.doctor.querySelector('img').alt=examining?'医生朝向右侧Jimmy':'医生朝向右侧家长';
  actors.bed.querySelector('img').alt='Jimmy坐在完整的床上，朝向左侧医生';
  phone.hidden=arrived||i<7;location.textContent=arrived?'医生来到 Jimmy 的房间':'Williams 家';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model visit-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u6162-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.sent='false';view.setAttribute('role','group');view.setAttribute('aria-label','传话情境');
  if(task==='call'){view.append(picture('telephone','application-phone','课文的电话'),node('span','call-status','等待核对号码'));}
  else if(task==='instruction'){view.append(picture('bed','application-bed','Jimmy在床上','webp'));}
  else if(task==='ordinal'){view.append(node('div','page-label','Lesson 62'));}
  else{view.append(picture('mother','mini-mother','妈妈朝向左侧医生','webp'),picture('doctor','mini-doctor','医生朝向右侧妈妈','webp'));}
  intro.append(view);content.prepend(intro);
 },answer(value){const sent=value!==null&&task==='call';view.dataset.sent=String(sent);const status=view.querySelector('.call-status');if(status)status.textContent=sent?'已按便签联系医生':'等待核对号码';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit6162Scene={storyProps,create};
})(globalThis.CanranCore);
