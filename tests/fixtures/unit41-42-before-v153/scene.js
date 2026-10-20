(function(core){
  'use strict';
  const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
  const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit41-42/'+name+'.svg';el.alt=alt;return el;};
  function world(){
    const element=node('div','pantry-world');element.setAttribute('role','group');element.setAttribute('aria-label','Sam、Penny 与购物袋');
    const actors={};
    for(const who of ['sam','penny']){const actor=node('div','pantry-actor dialogue-actor actor-'+who);actor.dataset.actor=who;const picture=image(who);actors[who]=picture;actor.append(picture,node('span','',who==='sam'?'Sam':'Penny'));element.append(actor);}
    element.append(image('chair','pantry-chair'),image('table','pantry-table'));
    const pack=node('div','pantry-pack'),contents=node('div','bag-contents');pack.append(contents,image('bag','pantry-bag','Penny 的购物袋'));element.append(pack);
    const item=node('div','pantry-item');element.append(item);
    function pose(who,name){if(actors[who].dataset.pose===name)return;actors[who].dataset.pose=name;actors[who].src='/assets/unit41-42/'+name+'.svg';}
    function inventory({bread=0,bagMilk=0,tableMilk=0}){
      contents.replaceChildren();item.replaceChildren();
      if(bread)contents.append(image('bread','packed-bread','袋里的一条面包'));
      for(let i=0;i<bagMilk;i++)contents.append(image('milk','packed-milk','袋里的第'+(i+1)+'瓶牛奶'));
      if(tableMilk)item.append(image('milk','','桌上的一瓶牛奶'));
      element.dataset.bagMilk=String(bagMilk);element.dataset.tableMilk=String(tableMilk);
    }
    return {element,item,pose,inventory};
  }
  const revealed=['cheese','bread','soap','chocolate','milk','sugar','coffee','tea','tobacco'];
  const names=['一块乳酪','一条面包','一块肥皂','一块巧克力','一瓶牛奶','一磅糖','半磅咖啡','四分之一磅茶','一罐烟丝'];
  function storyProps(){
    const {element,item,pose}=world();let previous='';
    return {element,update(index){
      element.dataset.bag=index<3?'carried':'chair';
      const beat=index<2?'arriving':index<4?'placing':index===4?'looking':index<14?'unpacking':'ending';element.dataset.beat=beat;
      pose('sam',beat==='placing'?'sam-point':beat==='looking'||beat==='unpacking'?'sam-look':'sam');
      pose('penny',beat==='placing'?'penny-place':beat==='unpacking'?'penny-show':'penny');
      const selected=index<5?'':revealed[Math.min(8,index-5)];
      if(previous!==selected){item.replaceChildren();if(selected)item.append(image(selected,'',names[Math.min(8,index-5)]));previous=selected;}
    }};
  }
  function create({element}){
    let scene,heading,receipt,display,beat;
    const before={bread:{bread:0,bagMilk:0,tableMilk:0},bottles:{bread:1,bagMilk:0,tableMilk:0},check:{bread:1,bagMilk:2,tableMilk:0},place:{bread:1,bagMilk:2,tableMilk:0},note:{bread:1,bagMilk:1,tableMilk:1}};
    function update(state){
      display.inventory(state);
      const parts=[];if(state.bread)parts.push('一条面包');if(state.bagMilk)parts.push(state.bagMilk===2?'两瓶牛奶':'一瓶牛奶');
      receipt.textContent='袋子里：'+(parts.join('、')||'空');
      const table=node('span','table-inventory','桌上：'+(state.tableMilk?'一瓶牛奶':'空'));receipt.append(table);
    }
    return {
      present(question,progress){
        element.classList.remove('role-runner');element.classList.add('pantry-runner');
        const content=element.querySelector('.practice-content'),intro=node('div','pantry-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);
        const material=content.querySelector('.practice-context');if(material)intro.append(material);
        display=world();scene=display.element;scene.classList.add('pantry-application');scene.dataset.bag='chair';scene.dataset.confirmed='false';
        beat=question.id.match(/-a-(bread|bottles|check|place|note)/)[1];scene.dataset.task=beat;
        display.pose('sam',beat==='place'?'sam-point':'sam-look');display.pose('penny',beat==='place'?'penny-place':'penny');
        receipt=node('p','bag-inventory');scene.append(receipt);update(before[beat]);intro.append(scene);content.prepend(intro);
      },
      answer(value){
        const success=value!==null;scene.dataset.confirmed=String(success);
        // Presenting a draft, selecting or failing never moves any object.
        if(!success)return;
        const after=beat==='bread'?before.bottles:beat==='bottles'?before.check:beat==='place'?before.note:before[beat];
        update(after);
        if(beat==='place'){scene.dataset.moved='true';display.pose('penny','penny-show');}
      },
      finish(){},completion(){return null;},heading(){return heading;}
    };
  }
  core.unit4142Scene={storyProps,create};
})(globalThis.CanranCore);
