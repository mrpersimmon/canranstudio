'use strict';
// Private release history: immutable resources retain their course ownership.
// Nothing in this directory is served by a static-file fallback.
const fs=require('node:fs/promises'),path=require('node:path');
const {UNITS}=require('./catalog');
async function retainPackages(packages,directory,basePath='/lesson/'){
 const root=path.join(directory,basePath==='/'?'course-bundles-root':'course-bundles'),objects=path.join(root,'objects');await fs.mkdir(objects,{recursive:true,mode:0o700});
 for(const descriptor of Object.values(packages.index.courses)){
  const pack=JSON.parse(packages.generated.get(descriptor.manifest.slice(basePath.length)).body);
  for(const item of [...pack.required,...pack.audio]){const file=path.join(objects,item.sha256);try{await fs.writeFile(file,packages.generated.get(item.url.slice(basePath.length)).body,{flag:'wx',mode:0o600});}catch(error){if(error.code!=='EEXIST')throw error;}}
  await fs.writeFile(path.join(root,pack.id+'-'+pack.revision+'.json'),JSON.stringify(pack),{mode:0o600});
 }
 const history=[],retained=new Set();
 for(const name of await fs.readdir(root)){
  if(!/^unit\d+-\d+-[a-f0-9]{64}\.json$/.test(name))continue;
  const file=path.join(root,name),stat=await fs.stat(file);
  if(Date.now()-stat.mtimeMs>7*86400000){await fs.unlink(file);continue;}
  const pack=JSON.parse(await fs.readFile(file,'utf8'));
  if(pack.accessPolicy!=='class-v1'||pack.basePath!==basePath||!UNITS.includes(pack.id))continue;
  for(const item of [...pack.required,...pack.audio]){
   if(!/^[a-f0-9]{64}$/.test(item.sha256)||!item.url.startsWith(basePath+'resources/'+item.sha256+'/'))throw Error('Invalid private course history');
   retained.add(item.sha256);const key=item.url.slice(basePath.length);if(!packages.generated.has(key))packages.generated.set(key,{body:await fs.readFile(path.join(objects,item.sha256)),type:item.type});
  }
  const key='course-packages/'+pack.id+'/'+pack.revision+'.json';if(!packages.generated.has(key))packages.generated.set(key,{body:Buffer.from(JSON.stringify(pack)),type:'application/json'});
  history.push(pack);
 }
 for(const name of await fs.readdir(objects))if(/^[a-f0-9]{64}$/.test(name)&&!retained.has(name))await fs.unlink(path.join(objects,name));
 return history;
}
module.exports={retainPackages};
