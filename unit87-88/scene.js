(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit87-88/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','garage-world'),location=node('p','garage-location');element.setAttribute('role','group');element.setAttribute('aria-label','Wood与接待员面向彼此，从接待处进入车库看车');
 for(const[key,label,side,other]of [['wood','Mr. Wood','left','接待员'],['attendant','接待员','right','Wood']]){const wrap=node('div','dialogue-actor garage-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'garage-cast',label+'全身完整，面向'+(side==='left'?'右侧':'左侧')+other,'webp'),node('span','actor-label',label));element.append(wrap);}
 const reception=node('figure','story-prop reception-note');reception.append(picture('clipboard','','接待处的维修记录'),node('figcaption','','送修登记'));element.append(reception);
 const car=node('figure','story-prop damaged-car');car.append(picture('crash','','LFZ 312 G，有凹痕，尚未修好'),node('figcaption','','LFZ 312 G'));car.hidden=true;element.append(car);
 element.append(location);

 function update(i){const inside=i>=8;element.dataset.scene=inside?'garage':'reception';location.textContent=inside?'修理厂 · 车库里':'修理厂 · 接待处';car.hidden=!inside;reception.hidden=inside;}
 update(-1);return{element,update,sideFor:(_i,who)=>who==='attendant'?'right':'left'};
}
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('garage-runner');const content=element.querySelector('.practice-content'),intro=node('div','garage-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u8788-v1-a-','');view=node('div','garage-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','维修与完成记录');
 const entries={working:['repair','Car A · still repairing','Current status'],finished:['ready','Car B · repaired','Ready now'],when:['bring','Today: Thursday','Brought in: Monday'], 'no-proof':['yet','Car C · started 09:00','Status: unknown'],followup:['meet','Conversation record','Done yet? / When?'],breakfast:['breakfast','Now: 14:00','Breakfast: 07:30'],news:['news','Heard: today','Yesterday: not heard'],duration:['garage','Sam · still works here','Started in 2020']};const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){const checked=value!==null&&['working','finished'].includes(task);view.dataset.opened=String(checked);if(task==='working')view.querySelector('.record-page strong').textContent=checked?'Car A · 维修中':'Car A · still repairing';if(task==='finished')view.querySelector('.record-page strong').textContent=checked?'Car B · 留言已写好':'Car B · repaired';},finish(){},completion(){return null;},heading(){return element.querySelector('.garage-intro .practice-progress')||heading;}
};}
core.unit8788Scene={storyProps,create};
})(globalThis.CanranCore);
