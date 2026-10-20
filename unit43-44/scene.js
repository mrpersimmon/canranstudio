(function(core){
  'use strict';
  const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
  const image=(name,cls='',alt='')=>{const el=node('img',cls);el.src='/assets/unit43-44/'+name+'.svg';el.alt=alt;return el;};
  function world(){
    const element=node('div','tea-world');element.setAttribute('role','group');element.setAttribute('aria-label','Sam、Penny 的茶桌');
    const visual=node('div','tea-visual');element.append(visual);
    const actors={};
    for(const who of ['sam','penny']){
      const actor=node('div','tea-actor dialogue-actor actor-'+who);actor.dataset.actor=who;
      actors[who]=image(who);actors[who].src=who==='sam'?'/assets/unit41-42/cast-sam-v153.webp':'/assets/unit43-44/cast-penny-point-v153.webp';actor.append(actors[who],node('span','',who==='sam'?'Sam':'Penny'));visual.append(actor);
    }
    const table=node('div','tea-table-unit'),cabinet=node('div','tea-cabinet-unit');
    table.append(image('counter-v153','tea-counter'));cabinet.append(image('cabinet-empty','tea-cabinet','杯柜'));visual.append(table,cabinet);
    const tea=image('tea','tea-tin','茶壶后面的茶叶'),pot=image('teapot','tea-pot','茶壶'),kettle=image('kettle','tea-kettle','水壶');
    const cups=image('cups','tea-cups','橱柜里的两只杯子'),steam=image('steam','tea-steam','水壶里的水开了');
    table.append(tea,pot,kettle,steam);cabinet.append(cups);
    function pose(who,name){if(actors[who].dataset.pose===name)return;actors[who].dataset.pose=name;actors[who].src=who==='penny'?'/assets/unit43-44/cast-penny-point-v153.webp':name==='sam-point'?'/assets/unit43-44/cast-sam-search-v153.webp':'/assets/unit41-42/cast-sam-v153.webp';}
    function show({found=false,cupsFound=false,moved=false,boiling=false}={}){
      element.dataset.found=String(found);element.dataset.cupsFound=String(cupsFound);element.dataset.cups=moved?'counter':'cupboard';
      element.dataset.boiling=String(boiling);steam.hidden=!boiling;
      const destination=moved?table:cabinet;if(cups.parentNode!==destination)destination.append(cups);
      cups.alt=moved?'已从橱柜移到水壶前面的两只杯子':'橱柜里的两只杯子';
      element.dataset.cupboardCount=moved?'0':'2';element.dataset.counterCount=moved?'2':'0';
    }
    show();return {element,pose,show};
  }
  function storyProps(){
    const view=world();
    return {element:view.element,update(index){
      const beat=index<4?'asking':index<9?'searching':index<11?'found-tea':index<14?'found-cups':'boiling';
      view.element.dataset.beat=beat;
      view.pose('penny',index>=5?'penny-point':'penny');view.pose('sam',index>=4&&index<9?'sam-point':'sam');
      // The original text only locates the cups. It never says they were moved.
      view.show({found:index>=9,cupsFound:index>=13,boiling:index>=14});
    }};
  }
  function create({element}){
    let view,heading,beat,receipt;
    const states={ready:{},find:{},cups:{found:true},place:{found:true,cupsFound:true},note:{found:true,cupsFound:true,moved:true}};
    function update(state){
      view.show(state);receipt.textContent=state.moved?'杯子：柜里 0 只 · 水壶前 2 只':'杯子：柜里 2 只 · 水壶前 0 只';
    }
    return {
      present(question,progress){
        element.classList.remove('role-runner');element.classList.add('tea-runner');
        const content=element.querySelector('.practice-content'),intro=node('div','tea-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);
        const material=content.querySelector('.practice-context');if(material)intro.append(material);
        view=world();view.element.classList.add('tea-application');beat=question.id.match(/-a-(ready|find|cups|place|note)/)[1];
        view.element.dataset.task=beat;view.element.dataset.confirmed='false';view.pose('penny','penny-point');view.pose('sam','sam-point');
        receipt=node('p','tea-inventory');view.element.append(receipt);update(states[beat]);intro.append(view.element);content.prepend(intro);
      },
      answer(value){
        const success=value!==null;view.element.dataset.confirmed=String(success);if(!success)return;
        const next=beat==='find'?states.cups:beat==='cups'?states.place:beat==='place'?states.note:states[beat];update(next);
      },
      finish(){},completion(){return null;},heading(){return heading;}
    };
  }
  core.unit4344Scene={storyProps,create};
})(globalThis.CanranCore);
