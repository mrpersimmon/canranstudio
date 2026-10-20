(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit71-72/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','Jane 与 Pauline');element.setAttribute('role','group');element.setAttribute('aria-label','Jane与Pauline面对面讲述来电的场景');
 for(const[key,label,side]of [['jane','Jane','left'],['pauline','Pauline','right']]){const wrap=node('div','dialogue-actor visit-actor actor-'+key+' at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+(side==='left'?'面向右侧的Pauline':'面向左侧的Jane'),'webp'),node('span','actor-label',label));element.append(wrap);}
 const phone=picture('phone','story-phone','桌上的电话，听筒放在底座上');element.append(location,phone);
 function update(i){element.dataset.beat=i<0?'intro':i<=1?'count':i<=4?'office':i<=5?'six':i<=9?'nine':'end';}
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u7172-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.stamped='false';view.setAttribute('role','group');view.setAttribute('aria-label','核对过去的活动记录');
  const entries={calendar:['clean','yesterday','clean the shoes'],register:['phone','9 p.m.','answered · yesterday evening'],i:['telephone','you → I','telephone Jane'],morning:['turn-on','this morning','现在是晚上'],when:['telephone','telephone her husband','When?'],we:['stay','you + Sam → we','stayed at home · no game'],relative:['before-yesterday','Today: Wednesday','the day before yesterday'],what:['listen','Lucy · last night','listened to the radio']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop',detail));const page=node('div','diary-page');page.append(node('strong','',title),node('span','',detail));if(task==='register'){const stamp=node('span','diary-stamp','待核对');stamp.setAttribute('role','status');page.append(stamp);}view.append(page);intro.append(view);content.prepend(intro);
 },answer(value){const stamped=value!==null&&task==='register';view.dataset.stamped=String(stamped);const label=view.querySelector('.diary-stamp');if(label)label.textContent=stamped?'已核对 ✓':'待核对';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit7172Scene={storyProps,create};
})(globalThis.CanranCore);
