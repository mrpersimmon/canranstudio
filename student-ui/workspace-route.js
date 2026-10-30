'use strict';
function destination(href,base,origin){
 const url=new URL(href,origin);
 if(url.origin!==origin||url.hash||url.searchParams.has('preview')||url.searchParams.has('account'))return null;
 if(url.pathname===base||url.pathname===base+'index.html')return {page:'courses',url:base,history:false};
 if(url.pathname===base+'awards/'||url.pathname===base+'awards')return {page:'awards',url:base+'awards/',history:url.searchParams.get('view')==='history'};
 return null;
}
function plainLink(event,link){return !event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&!link.hasAttribute('download')&&(!link.target||link.target==='_self');}
function sameOwner(left,right){return !!left?.student?.id&&left.student.id===right?.student?.id&&(left?.systemUpgrade?.epoch||null)===(right?.systemUpgrade?.epoch||null);}
module.exports={destination,plainLink,sameOwner};
