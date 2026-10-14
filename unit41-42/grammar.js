(function(core){
  'use strict';
  // Visual examples are presentation, not question data: refreshing old rounds
  // keeps their exact assessment signature and does not reset earned stars.
  const pictures={
    is:[['/assets/lesson49/icons/book.svg'],['/assets/unit41-42/coffee.svg']],
    bottles:[['/assets/unit41-42/cup.svg','/assets/unit41-42/cup.svg','/assets/unit41-42/cup.svg']],
    loaves:[['/assets/unit41-42/soap.svg','/assets/unit41-42/three-bars.svg'],['/assets/unit41-42/bread.svg','/assets/unit41-42/two-loaves.svg']],
    fraction:[['/assets/unit41-42/pound.svg'],['/assets/unit41-42/half.svg'],['/assets/unit41-42/quarter.svg']],
    'some-a':[['/assets/unit41-42/sugar.svg'],['/assets/unit41-42/tin.svg']],
    'ask-any':[['/assets/unit41-42/milk.svg']],
    'one-some':[['/assets/unit39-40/vase.svg'],['/assets/unit41-42/milk.svg']]
  };
  function create({element,art}){
    const base=core.unit12Grammar.create({element,art});
    return {...base,present(question,progress){
      base.present(question,progress);
      const key=question.id.replace('u4142-v1-g-',''),demo=element.querySelector('.grammar-model');
      if(!demo)return;
      demo.classList.add('pantry-model');
      const visual=pictures[key];if(!visual)return;
      const rows=demo.querySelectorAll('.grammar-model-line');
      demo.dataset.columns=String(rows.length);
      rows.forEach((row,i)=>{
        if(!visual[i])return;
        const group=document.createElement('div');group.className='grammar-example-art';group.setAttribute('aria-hidden','true');
        visual[i].forEach((src,index)=>{
          if(key==='loaves'&&index===1){const arrow=document.createElement('span');arrow.textContent='→';group.append(arrow);}
          const picture=document.createElement('img');picture.src=src;picture.alt='';group.append(picture);
        });row.prepend(group);
      });
    }};
  }
  core.unit4142Grammar={create};
})(globalThis.CanranCore);
