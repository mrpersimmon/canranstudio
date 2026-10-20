(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit83-84/'+name+'.'+ext;e.alt=alt;return e;}
const pairFor=i=>[1,2,8,9].includes(i)?['tom','sam']:i===5?['carol','tom']:['carol','sam'];
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location');element.setAttribute('role','group');element.setAttribute('aria-label','Carol和Tom收拾行李，与Sam聊起已经吃过的午餐和假期');
 const actors={};for(const[key,label]of [['carol','Carol'],['tom','Tom'],['sam','Sam']]){const wrap=node('div','dialogue-actor visit-actor');wrap.dataset.actor=key;const img=picture(key,'visit-cast','','webp');wrap.append(img,node('span','actor-label',label));element.append(wrap);actors[key]={wrap,img};}
 const suitcase=picture('pack','story-suitcase','打开的行李箱里放着折好的衣服');element.append(suitcase);
 element.append(location);

 function update(i){const[left,right]=pairFor(i);for(const[key,{wrap,img}]of Object.entries(actors)){wrap.hidden=key!==left&&key!==right;wrap.classList.toggle('at-left',key===left);wrap.classList.toggle('at-right',key===right);wrap.classList.toggle('face-flipped',key===left&&key!=='carol');img.alt=`${key}全身完整，面向${key===left?'右侧的'+right:'左侧的'+left}`;}element.dataset.scene=i>=8?'holiday':i>=6?'packing':i>=5?'living-room':'welcome';location.textContent=i>=5?'Carol和Tom的家 · 客厅':'Carol和Tom的家 · 午餐时分';suitcase.hidden=i<5;}
 update(-1);return{element,update,sideFor:(i,who)=>pairFor(i)[1]===who?'right':'left'};
}
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u8384-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','行前清单与完成记录');
 const entries={case:['suitcase','Suitcase ✓','ready'],lunch:['already','Lunch ✓ 12:30','Now: 13:00'],milk:['milk','Milk ✓','just had'],contrast:['beans','Peas ✗ / Beans ✓','not eaten / just eaten'],one:['peaches','A peach ✓','already had'],check:['suitcase','Ben’s suitcase ✗','not packed'],time:['already','Lunch / Suitcase','Have…? / When did…?'],stay:['room','Five years → now','still lives here']};const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','diary-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null&&['case','milk'].includes(task);view.dataset.opened=String(checked);if(task==='case'){view.querySelector('.diary-page strong').textContent=checked?'Packing recorded':'Suitcase ✓';view.querySelector('.diary-page span').textContent=checked?'已确认行李收好':'ready';}if(task==='milk'){view.querySelector('.diary-page strong').textContent=checked?'Milk recorded':'Milk ✓';view.querySelector('.diary-page span').textContent=checked?'已记下刚喝过牛奶':'just had';}},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit8384Scene={storyProps,create};
})(globalThis.CanranCore);
