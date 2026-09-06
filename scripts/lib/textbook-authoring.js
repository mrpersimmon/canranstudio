'use strict';
function testedSpan(text,span){
  const escaped=span.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const match=new RegExp('(^|[^A-Za-z0-9])('+escaped+')(?=$|[^A-Za-z0-9])').exec(text);
  if(!match)throw Error('Tested word or phrase is absent: '+span+' / '+text);
  const start=match.index+match[1].length;
  return{prefix:text.slice(0,start),suffix:text.slice(start+span.length)};
}
module.exports={testedSpan};
