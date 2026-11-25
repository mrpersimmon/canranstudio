(()=>{'use strict';let busy=false;
async function check(){if(busy)return;busy=true;try{const r=await fetch('/_preview/session',{cache:'no-store',credentials:'same-origin'});if(r.status===401)location.replace('/_preview/login');}catch{}finally{busy=false;}}
addEventListener('pageshow',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});setInterval(check,60000);
const start=document.getElementById('preview-focus'),back=document.getElementById('preview-unfocus'),bar=document.getElementById('preview-focus-bar');
function focusMode(active){document.body.classList.toggle('private-focus',active);bar.hidden=!active;requestAnimationFrame(()=>{dispatchEvent(new Event('resize'));(active?back:start).focus({preventScroll:true});});}
if(start&&back&&bar){start.addEventListener('click',()=>focusMode(true));back.addEventListener('click',()=>focusMode(false));}
})();
