'use strict';
const matrix=require('./journey-viewports.json');
const key=([width,height])=>width+'x'+height;
function allViewports(){
  const found=new Map();
  for(const sizes of Object.values(matrix.groups))for(const pair of sizes){
    if(!Array.isArray(pair)||pair.length!==2||!pair.every(n=>Number.isSafeInteger(n)&&n>0))throw new Error('Invalid viewport: '+JSON.stringify(pair));
    found.set(key(pair),pair);
  }
  return found;
}
function viewports(suite='map',tier=process.env.JOURNEY_VIEWPORT_TIER||'full'){
  if(!['full','smoke'].includes(tier))throw new Error('Unknown JOURNEY_VIEWPORT_TIER: '+tier);
  const all=allViewports();
  let ids;
  if(suite==='map')ids=tier==='smoke'?matrix.smoke:[...new Set(matrix.suites.map.flatMap(group=>matrix.groups[group].map(key)))];
  else{ids=matrix.suites[suite];if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'))throw new Error('Unknown viewport suite: '+suite);}
  return ids.map(id=>{const pair=all.get(id);if(!pair)throw new Error('Unknown viewport: '+id);return [...pair];});
}
function summary(){
  const map=viewports('map','full'),smoke=viewports('map','smoke'),directory=viewports('directoryCompact','full');
  const fullKeys=new Set(map.map(key));
  if(smoke.some(pair=>!fullKeys.has(key(pair))))throw new Error('Smoke profile must be part of full matrix');
  return{version:matrix.version,unit:matrix.unit,uniqueViewports:allViewports().size,map:map.length,smoke:smoke.length,directory:directory.length,coverageTarget:matrix.coverageTarget.percent,measuredTrafficCoverage:null,coverageStatus:matrix.coverageTarget.status};
}
module.exports={matrix,viewports,summary};
if(require.main===module)console.log(JSON.stringify(summary(),null,2));
