(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit69-70/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','1995 · 观赛相册');element.setAttribute('role','group');element.setAttribute('aria-label','叙述者与妻子的观赛相册场景');
 for(const[key,label,side]of [['narrator','叙述者','left'],['wife','妻子','right']]){const wrap=node('div','dialogue-actor visit-actor actor-'+key+' at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+(side==='left'?'面向右侧的妻子':'面向左侧的丈夫')+'，头发、手指、衣服、鞋子完整','webp'),node('span','actor-label',label));element.append(wrap);}
 const timeline=node('aside','story-timeline');timeline.setAttribute('aria-label','相册中的事实');const time=node('strong'),detail=node('span');timeline.append(time,detail);
 const car=picture('car15','story-race-car','Billy Stewart驾驶的15号赛车');car.hidden=true;
 element.append(location,timeline,car);
 function update(i){const beat=i<0?'intro':['town','crowd','cars','finish','home'][i];element.dataset.beat=beat;const entry=i<0?['翻开相册','找一找：谁是冠军？']:[['每年一次','1995年的那一场'],['观众席','hundreds of people'],['参赛车','20 cars · 6 countries'],['精彩结尾','Billy · car 15 · 另5辆紧随'],['回家途中','妻子提醒：别开太快']][i];time.textContent=entry[0];detail.textContent=entry[1];location.textContent=i===4?'On the way home · 不是赛道':'1995 · 观赛相册';car.hidden=i!==3;}
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u6970-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.stamped='false';view.setAttribute('role','group');view.setAttribute('aria-label','根据时间资料完成记录');
  const entries={record:['denmark','October','Ben + Amy · Denmark'],stamp:['ticket','April 24th','3 p.m.'],we:['australia','July','You + Penny'],they:['stationers','Monday','Sam + Penny'],when:['denmark','Denmark','When?'],repair:['park','Tom + Sue','park · not race'],specific:['morning','Sunday morning','相册标签'],'date-order':['june','2017 / 6 / 26','日期标签']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop',detail));const page=node('div','diary-page');page.append(node('strong','',title),node('span','',detail));if(task==='stamp'){const stamp=node('span','diary-stamp','待核对');stamp.setAttribute('role','status');page.append(stamp);}view.append(page);intro.append(view);content.prepend(intro);
 },answer(value){const stamped=value!==null&&task==='stamp';view.dataset.stamped=String(stamped);const label=view.querySelector('.diary-stamp');if(label)label.textContent=stamped?'已核对 ✓':'待核对';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit6970Scene={storyProps,create};
})(globalThis.CanranCore);
