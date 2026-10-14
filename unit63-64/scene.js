(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit63-64/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location');
 element.setAttribute('role','group');element.setAttribute('aria-label','医生再次来访场景');
 const actors={};
 for(const [key,label] of [['mother','Mrs. Williams'],['doctor','Doctor'],['bed','Jimmy'],['father-bed','Mr. Williams']]){
  const wrap=node('div','dialogue-actor visit-actor actor-'+key);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+'完整人物','webp'),node('span','actor-label',label));element.append(wrap);actors[key]=wrap;
 }
 element.append(location);
 function update(i){
  const bedside=i===4,father=i>=10,motherLeft=i===11;
  element.dataset.beat=father?'father':bedside?'bedside':i>=5?'instructions':'welcome';
  actors.doctor.hidden=motherLeft;actors.bed.hidden=!bedside;actors['father-bed'].hidden=!father;actors.mother.hidden=bedside||i===10;
  actors.mother.classList.toggle('at-left',motherLeft);
  actors.mother.querySelector('img').style.transform=motherLeft?'scaleX(-1)':'';
  actors.mother.querySelector('img').alt=motherLeft?'妈妈朝向右侧卧床的爸爸':'妈妈朝向左侧医生';
  actors.doctor.querySelector('img').alt=bedside?'医生朝向右侧Jimmy，白大褂、双手和鞋子完整':father?'医生朝向右侧Mr. Williams':'医生朝向右侧妈妈';
  actors.bed.querySelector('img').alt='好些了的Jimmy坐在完整的床上，朝向左侧医生';
  actors['father-bed'].querySelector('img').alt='Mr. Williams穿睡衣躺在完整的床上，朝向左侧交谈者';
  location.textContent=father?'Mr. Williams 的房间':i>=4?'Jimmy 的房间':'Williams 家 · 请上楼';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model visit-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u6364-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.sent='false';view.setAttribute('role','group');view.setAttribute('aria-label','生活提醒情境');
  if(task==='window'){const sign=node('span','reminder-sign','等待挂牌');view.append(picture('closed-window','application-prop','关闭的窗户'),sign);}
  else if(task==='library'||task==='vase'){view.append(picture(task==='library'?'library':'vase','application-prop',task==='library'?'安静的图书馆':'完整的花瓶'));}
  else if(task==='timer'){const timer=node('div','reading-timer');timer.append(node('span','','已读 10 分钟'),node('strong','','再读 5 分钟'));view.append(timer);}
  else if(task==='note'){view.append(picture('bed','application-bed','Jimmy坐在床上，床脚完整','webp'));}
  else if(task==='numbers'){view.append(node('div','page-label','110 · 221 · 332'));}
  else{view.append(picture('mother','mini-mother','妈妈朝向左侧医生','webp'),picture('doctor','mini-doctor','医生朝向右侧妈妈，衣服和手部完整','webp'));}
  intro.append(view);content.prepend(intro);
 },answer(value){const sent=value!==null&&task==='window';view.dataset.sent=String(sent);const sign=view.querySelector('.reminder-sign');if(sign)sign.textContent=sent?'已挂好':'等待挂牌';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit6364Scene={storyProps,create};
})(globalThis.CanranCore);
