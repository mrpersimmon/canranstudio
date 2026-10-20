(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit89-90/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','house-world'),location=node('p','house-location');element.setAttribute('role','group');element.setAttribute('aria-label','Nigel与Ian面向彼此，从门前进入屋内看房');
 for(const[key,label,side,other]of [['nigel','Nigel','left','Ian'],['ian','Ian','right','Nigel']]){const wrap=node('div','dialogue-actor house-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'house-cast',label+'全身完整，面向'+(side==='left'?'右侧':'左侧')+other,'webp'),node('span','actor-label',label));element.append(wrap);}
 const sign=node('figure','story-prop sale-sign');sign.append(picture('sale','','房屋前的待售牌'),node('figcaption','','For sale'));element.append(sign);
 const note=node('figure','story-prop viewing-note');note.append(picture('book','','打开的看房笔记'),node('figcaption','','Viewing notes'));note.hidden=true;element.append(note);
 element.append(location);

 function update(i){const inside=i>=4;element.dataset.scene=inside?'living':'outside';location.textContent=inside?'Ian的家 · 客厅':'Ian的家 · 门前';sign.hidden=inside;note.hidden=!inside;}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='ian'?'right':'left'};
}
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('house-runner');const content=element.querySelector('.practice-content'),intro=node('div','house-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u8990-v1-a-','');view=node('div','house-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','看房与生活记录');
 const entries={permission:['sale','House for sale','Outside · would like to look'],timeline:['duration','Now: 2024 · Mia still lives here','Started living here: 2020'],ask:['house','Still living here','Question: how long?'],reason:['retire','Just retired','Wants a smaller home'],visit:['start','Now: 11:00 · arrived 10:00','Still here · has not left'],'price':['price','Viewing notebook','Time / reason / price'],'two-people':['homework','I: finished last night','Tom: not finished yet'],decision:['decide','Likes the house','Not decided yet']};const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null&&['timeline','decision'].includes(task);view.dataset.recorded=String(checked);if(task==='timeline')view.querySelector('.record-page strong').textContent=checked?'Mia · for four years / since 2020':'Now: 2024 · Mia still lives here';if(task==='decision')view.querySelector('.record-page strong').textContent=checked?'Viewing notes · 已记录':'Likes the house';},finish(){},completion(){return null;},heading(){return element.querySelector('.house-intro .practice-progress')||heading;}
};}
core.unit8990Scene={storyProps,create};
})(globalThis.CanranCore);
