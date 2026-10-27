'use strict';
// Browser presentation readiness only. Generation identity distinguishes a new
// mount of the same chapter from its previous ready images / late callbacks.
function recordArtReady(state,currentGeneration,eventGeneration,id,ready){
 if(eventGeneration!==currentGeneration)return state;
 const current=state?.generation===currentGeneration?state:{generation:currentGeneration,ids:[]};
 const has=current.ids.includes(id);
 if(has===ready)return current;
 return {generation:currentGeneration,ids:ready?[...current.ids,id]:current.ids.filter(value=>value!==id)};
}
function completionCandidates({pending,chapter,modular,legacyReady,readiness,generation}){
 const localReady=readiness?.generation===generation?readiness.ids:[];
 return pending.filter(id=>chapter.includes(id)&&(modular?localReady.includes(id):legacyReady));
}
module.exports={recordArtReady,completionCandidates};
