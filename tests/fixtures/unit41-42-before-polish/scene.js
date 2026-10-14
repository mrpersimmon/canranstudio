(function(core){
  'use strict';
  const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
  const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit41-42/'+name+'.svg';el.alt=alt;return el;};
  function world(){
    const element=node('div','pantry-world');element.setAttribute('role','group');element.setAttribute('aria-label','Sam、Penny 与购物袋');
    for(const who of ['sam','penny']){const actor=node('div','pantry-actor dialogue-actor actor-'+who);actor.dataset.actor=who;actor.append(image(who),node('span','',who==='sam'?'Sam':'Penny'));element.append(actor);}
    element.append(image('chair','pantry-chair'),image('table','pantry-table'),image('bag','pantry-bag','Penny 的购物袋'));
    const item=node('div','pantry-item');element.append(item);
    return {element,item};
  }
  const revealed=['cheese','bread','soap','chocolate','milk','sugar','coffee','tea','tobacco'];
  const names=['一块乳酪','一条面包','一块肥皂','一块巧克力','一瓶牛奶','一磅糖','半磅咖啡','四分之一磅茶','一罐烟丝'];
  function storyProps(){
    const {element,item}=world();let previous='';
    return {element,update(index){
      element.dataset.bag=index<3?'carried':'chair';
      const selected=index<5?'':revealed[Math.min(8,index-5)];
      if(previous!==selected){item.replaceChildren();if(selected)item.append(image(selected,'',names[Math.min(8,index-5)]));previous=selected;}
      element.dataset.beat=index<5?'arriving':index>=14?'ending':'unpacking';
    }};
  }
  function create({element}){
    let scene,heading,receipt;
    return {
      present(question,progress){
        element.classList.remove('role-runner');element.classList.add('pantry-runner');
        const content=element.querySelector('.practice-content');
        const intro=node('div','pantry-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);
        const display=world();scene=display.element;scene.classList.add('pantry-application');scene.dataset.bag='chair';scene.dataset.confirmed='false';
        const beat=question.id.split('-').slice(-1)[0];scene.dataset.task=beat;
        if(beat==='place')display.item.append(image('milk','','桌上的牛奶瓶'));
        if(beat==='note')display.item.append(image('cheese','','桌上的一块乳酪'));
        receipt=node('p','bag-inventory',beat==='bread'?'袋子里：空':beat==='bottles'?'袋子里：一条面包':'袋子里：一条面包、两瓶牛奶');
        scene.append(receipt);intro.append(scene);content.prepend(intro);
        scene.dataset.response=beat;
      },
      answer(value){
        const success=value!==null;
        scene.dataset.confirmed=String(success);
        if(!success)return;
        const beat=scene.dataset.response;
        if(beat==='bread')receipt.textContent='袋子里：一条面包';
        if(beat==='bottles')receipt.textContent='袋子里：一条面包、两瓶牛奶';
        if(beat==='check')receipt.textContent='No, there isn’t.';
        if(['bread','bottles'].includes(beat)){
          const item=scene.querySelector('.pantry-item');item.replaceChildren(image(beat==='bread'?'bread':'two-bottles','','已核对的物品'));item.classList.add('packed-item');
        }
      },
      finish(){},completion(){return null;},heading(){return heading;}
    };
  }
  core.unit4142Scene={storyProps,create};
})(globalThis.CanranCore);
