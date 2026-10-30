import awardGif from '../core/award-gif.js';
import cardLayout from '../core/award-card-layout.js';
import paper from '../assets/awards/paper.webp';
import star from '../assets/awards/star-earned.webp';
import emptyStar from '../assets/awards/star-empty.webp';
import logo from '../assets/brand/starflower.png';
import scene from '../assets/awards/postoffice/scene-v3.png';
export {logo,scene};
const fixed=new Set([paper,star,emptyStar,logo,scene]),decoded=new Map(),loading=new Map();
function remember(src,image){decoded.delete(src);decoded.set(src,image);for(const key of decoded.keys()){if(decoded.size<=17)break;if(!fixed.has(key))decoded.delete(key);}}
function loadPicture(src){
 if(decoded.has(src)){const image=decoded.get(src);remember(src,image);return Promise.resolve(image);}
 if(loading.has(src))return loading.get(src);
 const promise=new Promise((resolve,reject)=>{
  const image=new Image();let settled=false;
  const fail=()=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=null;image.onerror=null;image.removeAttribute('src');reject(new Error('image'));};
  // End an unresponsive request too, so Retry never reuses a stuck promise.
  const timer=setTimeout(fail,45000);
  image.onload=async()=>{try{await image.decode();if(settled)return;settled=true;clearTimeout(timer);remember(src,image);resolve(image);}catch{fail();}};
  image.onerror=fail;image.src=src;
 }).finally(()=>loading.delete(src));
 loading.set(src,promise);return promise;
}
export async function prepareCards(cards){
 let timer;
 const resources=[...new Set([...fixed,...cards.map(card=>card.scene)])];
 const work=Promise.all([
  ...resources.map(loadPicture),
  ...cards.map(card=>cardLayout.prepareFonts(card.course,card.name,'Award Book','Baloo Book')),
  // Interface typography uses font-display:swap. Only the original card's
  // fonts are required for its display/export; decoration must never gate it.
 ]);
 // Original name fonts retain complete character coverage. Their first
 // transfer can exceed 20 seconds on the deployed 3 Mbps connection.
 try{await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),60000);})]);}
 finally{clearTimeout(timer);}
}
export async function saveCard(card,signal){
 await prepareCards([card]);signal.throwIfAborted();
 const canvas=cardLayout.draw({unitId:card.course,title:card.title,name:card.name,lesson:card.lesson,color:card.color,stars:card.stars,date:card.date,
  images:{scene:decoded.get(card.scene),paper:decoded.get(paper),earned:decoded.get(star),empty:decoded.get(emptyStar)},roundFont:'Award Book',latinFont:'Baloo Book'});
 const blob=await awardGif.encode(canvas,{...cardLayout.starLayout,stars:card.stars,earnedImage:decoded.get(star),signal});signal.throwIfAborted();
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${card.lesson.replace(' ','')}-${card.title}-${card.name}.gif`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
 return {width:canvas.width,height:canvas.height,bytes:blob.size};
}
