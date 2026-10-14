(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit65-66/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','Jill 家 · 晚间门厅');element.setAttribute('role','group');element.setAttribute('aria-label','Jill一家在门厅商量出门的场景');const actors={};
 for(const[key,label]of [['father','Father · Tom'],['mother','Mother'],['jill','Jill']]){const wrap=node('div','dialogue-actor visit-actor actor-'+key);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+'完整人物','webp'),node('span','actor-label',label));element.append(wrap);actors[key]=wrap;}
 const key=node('div','story-key');key.append(picture('key','key-object','唯一一枚前门钥匙'),node('span','key-owner','爸爸保管'));element.append(location,key);
 function update(i){
  const parents=i===6||i===7,mumDaughter=i>=10;const left=parents||mumDaughter?'mother':'father',right=parents?'father':'jill';
  element.dataset.beat=parents?'parents':mumDaughter?'goodbye':i>=8?'handover':'before';element.dataset.keyOwner=i>=8?'jill':'father';
  for(const[name,wrap]of Object.entries(actors)){wrap.hidden=name!==left&&name!==right;wrap.classList.toggle('at-left',name===left);wrap.classList.toggle('at-right',name===right);const flip=name==='father'&&name===right;wrap.querySelector('img').style.transform=flip?'scaleX(-1)':'';wrap.querySelector('img').alt={father:'爸爸',mother:'妈妈',jill:'Jill'}[name]+(name===left?'朝向右侧交谈者':'朝向左侧交谈者')+'，头发、双手、衣服与鞋子完整';}
  key.querySelector('.key-owner').textContent=i>=8?'Jill 已接过':'爸爸保管';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model visit-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u6566-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.sent='false';view.setAttribute('role','group');view.setAttribute('aria-label','晚间约定情境');
  if(task==='key'){view.append(picture('front-door','application-door','前门'),picture('key','application-key','唯一一枚等待领取的钥匙'),picture('jill','mini-jill','Jill向左等待领取钥匙','webp'),node('span','key-state','待领取'));}
  else if(task==='clock'){view.append(picture('clock-0930','application-prop','钟面九点半'),node('div','page-label','Home at 9:30'));}
  else if(task==='birthday'){view.append(picture('birthday','application-prop','生日蛋糕'),node('div','page-label','Anna · 6 July'));}
  else if(task==='age'){view.append(picture('age','application-prop','年龄资料卡'),node('div','page-label','Ben · Age 12'));}
  else if(task==='when'){view.append(picture('clock-0345','application-prop','钟面三点四十五分'),node('div','page-label','Sam + You'));}
  else if(task==='calendar'){view.append(picture('year','application-prop','日期卡'),node('div','page-label','1st · 2nd · 3rd'));}
  else{view.append(picture('mother','mini-mother','妈妈朝右','webp'),picture('jill','mini-jill','Jill朝左','webp'));}
  intro.append(view);content.prepend(intro);
 },answer(value){const sent=value!==null&&task==='key';view.dataset.sent=String(sent);const label=view.querySelector('.key-state');if(label)label.textContent=sent?'已领取':'待领取';const key=view.querySelector('.application-key');if(key)key.alt=sent?'Jill已领取的唯一一枚钥匙':'唯一一枚等待领取的钥匙';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit6566Scene={storyProps,create};
})(globalThis.CanranCore);
