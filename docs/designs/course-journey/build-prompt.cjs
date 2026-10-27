'use strict';
// Assemble a reviewed generation request only; this script never calls an image API.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const pack=__dirname;
const repo=path.resolve(pack,'../../..');
const manifest=JSON.parse(fs.readFileSync(path.join(pack,'manifest.json'),'utf8'));
const digest=data=>crypto.createHash('sha256').update(data).digest('hex');
function inside(relative){
  const absolute=path.resolve(pack,relative),back=path.relative(pack,absolute);
  if(!back||back.startsWith('..')||path.isAbsolute(back))throw Error('Path must be a file inside the design pack: '+relative);
  return absolute;
}
function text(relative){return fs.readFileSync(inside(relative),'utf8');}
function verify(){
  for(const [id,ref] of Object.entries(manifest.references)){
    if(digest(fs.readFileSync(inside(ref.path)))!==ref.sha256)throw Error('Reference changed; create a new reviewed version: '+id);
  }
  for(const [file,expected] of Object.entries(manifest.lockedFiles)){
    if(digest(fs.readFileSync(inside(file)))!==expected)throw Error('Locked generation file changed: '+file);
  }
  const provenance=JSON.parse(text('provenance/generation.json'));
  if(digest(fs.readFileSync(inside('provenance/original-request.txt')))!==provenance.promptSha256)throw Error('Historical prompt changed');
  if(!Object.keys(manifest.lockedFiles).length)throw Error('Design pack has not been finalized');
}
function compile(id){
  if(!/^[a-z0-9-]+$/.test(id)||!manifest.jobs[id])throw Error('Unknown recipe: '+id);
  const recipe=JSON.parse(text(manifest.jobs[id]));
  if(recipe.id!==id)throw Error('Recipe ID mismatch');
  if(recipe.referenceIds[0]!==manifest.visualMaster)throw Error('The approved master must be reference 1');
  if(recipe.referenceIds.length>manifest.generationEngine.maxReferenceImages)throw Error('Too many reference images');
  if(new Set(recipe.referenceIds).size!==recipe.referenceIds.length)throw Error('Duplicate reference images');
  if(typeof recipe.transparentBackground!=='boolean')throw Error('Transparency must be explicit');
  const source=text(recipe.template),keys=[...new Set([...source.matchAll(/\{\{([a-z_]+)\}\}/g)].map(match=>match[1]))];
  const variables=recipe.variables||{};
  for(const key of keys)if(!Object.hasOwn(variables,key)||String(variables[key]).trim()==='')throw Error('Missing value: '+key);
  for(const key of Object.keys(variables))if(!keys.includes(key))throw Error('Unexpected variable: '+key);
  const body=source.replace(/\{\{([a-z_]+)\}\}/g,(_,key)=>String(variables[key]));
  if(/\{\{|\}\}/.test(body))throw Error('Unresolved template variable');
  if(Object.hasOwn(variables,'stars')&&(!Number.isInteger(variables.stars)||variables.stars<0||variables.stars>5))throw Error('Invalid demo star count');
  const refs=recipe.referenceIds.map(refId=>{const ref=manifest.references[refId];if(!ref)throw Error('Unknown reference: '+refId);return {id:refId,...ref};});
  const binding=refs.map((ref,index)=>`Image ${index+1}: ${ref.id}. ${ref.role}`).join('\n');
  const prompt=[`Frozen design pack: ${manifest.designId} v${manifest.version}. Date anchor: ${manifest.date}, Asia/Shanghai; no visible dates unless the job explicitly requires them.`,text('prompts/style-lock.txt').trimEnd(),'ACTUAL ATTACHED REFERENCE ORDER\n'+binding,body.trimEnd(),text('prompts/negative.txt').trimEnd()].join('\n\n');
  return {request:{prompt,referenced_image_paths:refs.map(ref=>inside(ref.path)),transparent_background:recipe.transparentBackground},receipt:{designId:manifest.designId,version:manifest.version,job:id,promptSha256:digest(prompt),referenceIds:recipe.referenceIds,references:refs.map(({id,path,sha256})=>({id,path,sha256})),seed:null,modelRevision:null}};
}
try{
  verify();
  const id=process.argv[2];
  if(id==='--verify'){
    const jobs=Object.keys(manifest.jobs).map(job=>compile(job).receipt);
    console.log(JSON.stringify({ok:true,version:manifest.version,references:Object.keys(manifest.references).length,lockedFiles:Object.keys(manifest.lockedFiles).length,jobs:jobs.map(({job,promptSha256})=>({job,promptSha256}))},null,2));
  }else{
    if(!id)throw Error('Usage: node build-prompt.cjs <recipe-id> | --verify');
    const {request,receipt}=compile(id),output=path.join(repo,'output/fronted-opt/journey-prompts');
    fs.mkdirSync(output,{recursive:true});
    const stem=path.join(output,id+'-v'+manifest.version);
    fs.writeFileSync(stem+'.txt',request.prompt,'utf8');
    fs.writeFileSync(stem+'.request.json',JSON.stringify(request,null,2)+'\n');
    fs.writeFileSync(stem+'.receipt.json',JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify({request:stem+'.request.json',prompt:stem+'.txt',receipt:stem+'.receipt.json',sha256:receipt.promptSha256},null,2));
  }
}catch(error){console.error(error.message);process.exitCode=1;}
