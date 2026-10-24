'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),archive=path.join(root,'tests/fixtures/classroom-before-fivezones');
async function mirror(source,target){const stat=await fs.stat(source);if(stat.isDirectory())await fs.symlink(source,target,process.platform==='win32'?'junction':'dir');else await fs.copyFile(source,target);}
// Every course directory and source file is independent. Directory junctions
// are only for unchanged assets/dependencies, never files that a fixture edits.
async function createSite(destination,{classroom=false,overlays={}}={}){
 if(classroom)require('./classroom-history').installHistoricalRewardAdapter();
 await fs.mkdir(destination);
 for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(entry.name.startsWith('.')||['output','docs'].includes(entry.name))continue;
  const source=path.join(root,entry.name),target=path.join(destination,entry.name);
  if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){
   await fs.mkdir(target);for(const name of await fs.readdir(source))await mirror(path.join(source,name),path.join(target,name));
  }else await mirror(source,target);
 }
 if(classroom)for(const entry of await fs.readdir(archive,{withFileTypes:true}))if(/^unit\d+-\d+$/.test(entry.name))overlays={...overlays,[entry.name]:[path.join(archive,entry.name),...(overlays[entry.name]?[overlays[entry.name]].flat():[])]};
 for(const[unit,sources]of Object.entries(overlays)){
  assert(/^unit\d+-\d+$/.test(unit));
  for(const source of [sources].flat())for(const name of await fs.readdir(source)){
   if(!/\.(?:html|js|css)$/.test(name)||name==='flow.js')continue;
   await fs.copyFile(path.join(source,name),path.join(destination,unit,name));
  }
 }
 if(classroom){
  // These historical courses precede the raster home banners. Use their real
  // archived sections so the modern auth server never grants unrelated assets.
  const homeFile=path.join(destination,'index.html');let home=await fs.readFile(homeFile,'utf8');
  for(const unit of ['unit3-4','unit5-6']){
   const section=await fs.readFile(path.join(root,'tests/fixtures',unit+'-before-v154/home-section.html'),'utf8');
   home=home.replace(new RegExp('<section[^>]+data-unit="'+unit+'"[\\s\\S]*?</section>'),section);
  }
  await fs.writeFile(homeFile,home);
 }
 return destination;
}
async function removeTemporaryDirectory(directory){
 const parent=await fs.realpath(os.tmpdir()),target=await fs.realpath(directory),relative=path.relative(parent,target);
 assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative),'Temporary cleanup must stay below the real temp directory');
 await fs.rm(target,{recursive:true,force:true});
}
module.exports={createSite,removeTemporaryDirectory};
