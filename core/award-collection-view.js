'use strict';
// Group the presentation only. Each edition keeps its own stars and dates.
function split(cards) {
  const groups=new Map();
  for(const card of cards){if(!groups.has(card.course))groups.set(card.course,[]);groups.get(card.course).push(card);}
  const primary=[],history=[];
  for(const versions of groups.values()){
    const chosen=versions.find(card=>card.current)||[...versions].sort((a,b)=>String(b.firstFullStarAt||'').localeCompare(String(a.firstFullStarAt||''))||a.id.localeCompare(b.id))[0];
    primary.push(chosen);history.push(...versions.filter(card=>card!==chosen));
  }
  return {primary,history};
}
module.exports={split};
