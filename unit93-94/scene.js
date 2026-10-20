(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit93-94/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','travel-world');element.setAttribute('role','group');element.setAttribute('aria-label','飞行故事插图：按课文段落切换人物与城市');
 for(const[key,label]of [['nigel','Nigel'],['wife','Nigel的妻子']]){const actor=node('div','dialogue-actor travel-actor at-left');actor.dataset.actor=key;actor.append(picture(key,'travel-cast',label+'全身完整，手持书本','webp'),node('span','actor-label',label));element.append(actor);}
 element.append(node('p','travel-location','新邻居的飞行手记'));
 const illustration=node('figure','travel-illustration');const image=picture('plane','','飞机示意图');illustration.append(image);element.append(illustration);
 const frames=[['plane','飞机示意图'],['wings','飞行徽章示意图'],['new-york','纽约城市示意图'],['tokyo','东京城市示意图'],['madrid','马德里城市示意图'],['london','伦敦城市示意图'],['globe','地球仪示意图'],['home','家中窗户示意图']];
 function update(i){const index=Math.max(0,i),[art,alt]=frames[index],atHome=index===7;element.dataset.scene=atHome?'home':'travel';element.dataset.paragraph=String(i);element.querySelector('[data-actor="nigel"]').hidden=atHome;element.querySelector('[data-actor="wife"]').hidden=!atHome;image.src='/assets/unit93-94/'+art+'.svg';image.alt=alt;}
 update(-1);return{element,update,sideFor:()=> 'narrator'};
}
const tasks={
itinerary:['plane','A week ago · at the moment · next month','Read each record carefully.','行程记录配好了'],
calendar:['calendar','This month: December 2026','Tokyo: the month after next','Tokyo · February 2027'],
return:['return','Return to London','Ask about the future time.','返回时间问清楚了'],
book:['book','Borrowed: Monday · now: Wednesday','Still has the book; not returned.','持续持有的记录写好了'],
club:['club','Joined: 2019','Still a member; never left the club.','成员状态写好了'],
companion:['people','Tom and Lily · next Friday · Rome','Who will go with Tom?','同行者已确认'],
correction:['london','Plan: London next week, not Tokyo','Will you fly to Tokyo next week?','目的地已更正'],
proof:['bag','Bought: 2020 · sold: 2021','Now: 2026','后续变化已核对']
};
function create({element}){let view,heading,task;return{
 present(question,progress){element.classList.remove('role-runner');element.classList.add('travel-runner');const content=element.querySelector('.practice-content'),intro=node('div','travel-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);task=question.id.replace('u9394-v1-a-','');const[art,title,detail]=tasks[task];view=node('div','travel-application');view.dataset.task=task;view.dataset.recorded='false';view.setAttribute('role','group');view.setAttribute('aria-label','旅行记录');view.append(picture(art,'application-prop',title));const card=node('div','record-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);},
 answer(value){const checked=value!==null;view.dataset.recorded=String(checked);view.querySelector('.record-page strong').textContent=tasks[task][checked?3:1];},finish(){},completion(){return null;},heading(){return element.querySelector('.travel-intro .practice-progress')||heading;}
};}
core.unit9394Scene={storyProps,create};
})(globalThis.CanranCore);
