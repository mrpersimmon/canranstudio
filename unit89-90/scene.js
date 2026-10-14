(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit89-90/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','house-world'),location=node('p','house-location');element.setAttribute('role','group');element.setAttribute('aria-label','Nigel与Ian面向彼此，从门前进入屋内看房');
 for(const[key,label,side,other]of [['nigel','Nigel','left','Ian'],['ian','Ian','right','Nigel']]){const wrap=node('div','dialogue-actor house-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'house-cast',label+'全身完整，面向'+(side==='left'?'右侧':'左侧')+other,'webp'),node('span','actor-label',label));element.append(wrap);}
 const sign=node('figure','story-prop sale-sign');sign.append(picture('sale','','待售房屋，未显示成交'),node('figcaption','','For sale'));element.append(sign);
 const note=node('figure','story-prop viewing-note');note.append(picture('book','','看房笔记，尚未决定购买'),node('figcaption','','Viewing notes'));note.hidden=true;element.append(note);
 const timeline=node('aside','story-timeline');timeline.setAttribute('aria-label','故事进展');const title=node('strong'),detail=node('span');timeline.append(title,detail);element.append(location,timeline);
 const entries=[['Nigel来看看房子','房子正在待售'],['Ian确认正在出售','还没有成交'],['Nigel请求进屋看看','May I have a look?'],['Ian邀请Nigel进屋','Come in.'],['两人来到客厅','询问居住多久'],['已经住了二十年','for twenty years'],['Nigel感叹时间很长','二十年'],['从1976年起住在这里','since 1976'],['Nigel询问出售原因','Why…?'],['Ian刚退休','想在乡下买小房子'],['Nigel询问房价','How much…?'],['原文报价','£68,500'],['Nigel觉得价格很高','That’s a lot of money!'],['Ian认为值这个价','这是他的看法'],['Nigel仍未决定','妻子必须先来看'],['故事到这里结束','没有说房子已售出']];
 function update(i){const entry=i<0?['来看看待售房子','住了多久，从何时起？']:entries[i],inside=i>=4;title.textContent=entry[0];detail.textContent=entry[1];element.dataset.scene=inside?'living':'outside';location.textContent=inside?'Ian的家 · 客厅':'Ian的家 · 门前';sign.hidden=inside;note.hidden=!inside;}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='ian'?'right':'left'};
}
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('house-runner');const content=element.querySelector('.practice-content'),intro=node('div','house-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u8990-v1-a-','');view=node('div','house-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','看房与生活记录');
 const entries={permission:['sale','House for sale','Outside · would like to look'],timeline:['duration','Now: 2024 · Mia still lives here','Started living here: 2020'],ask:['house','Still living here','Question: how long?'],reason:['retire','Just retired','Wants a smaller home'],visit:['start','Now: 11:00 · arrived 10:00','Still here · has not left'],'price':['price','Viewing notebook','Time / reason / price'],'two-people':['homework','I: finished last night','Tom: not finished yet'],decision:['decide','Likes the house','Not decided yet']};const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null&&['timeline','decision'].includes(task);view.dataset.recorded=String(checked);if(task==='timeline')view.querySelector('.record-page strong').textContent=checked?'Mia · for four years / since 2020':'Now: 2024 · Mia still lives here';if(task==='decision')view.querySelector('.record-page strong').textContent=checked?'Viewing notes · 已记录':'Likes the house';},finish(){},completion(){return null;},heading(){return element.querySelector('.house-intro .practice-progress')||heading;}
};}
core.unit8990Scene={storyProps,create};
})(globalThis.CanranCore);
