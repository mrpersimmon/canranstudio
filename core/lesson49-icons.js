(function(root){
  'use strict';
  function create(name,label=''){
    const img=document.createElement('img');img.src='/assets/lesson49/icons/'+name+'.svg';img.alt=label;img.className='shop-icon';
    if(!label)img.setAttribute('aria-hidden','true');return img;
  }
  root.CanranCore=root.CanranCore||{};root.CanranCore.lesson49Icons={create};
})(globalThis);
