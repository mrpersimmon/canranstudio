'use strict';
// Import built-in image receipts without accepting them as reviewed artwork.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),directory=path.join(root,'docs/designs/learning-flow/whole-book-generations');
(async()=>{const imported=[],needsRepair=[],rejected=[];
 for(const file of fs.readdirSync(directory).filter(n=>n.endsWith('.json'))){
  const item=JSON.parse(fs.readFileSync(path.join(directory,file),'utf8'));
  for(const target of [item.raw,item.adopted])if(!/^assets\/(?:learning-whole-book-v1\/|word-art-v2\/whole-book\/)/.test(target))throw Error('Unexpected asset target '+target);
  const raw=path.join(root,item.raw),adopted=path.join(root,item.adopted);fs.mkdirSync(path.dirname(raw),{recursive:true});fs.mkdirSync(path.dirname(adopted),{recursive:true});
  if(!fs.existsSync(raw))fs.copyFileSync(item.generatedPath,raw);
  if(item.status==='rejected'){rejected.push({id:item.id,reason:item.reason});continue;}
  const meta=await sharp(raw).metadata();
  if(item.kind==='world'&&Math.abs(meta.width/meta.height-1.5)>.03){needsRepair.push({id:item.id,reason:'world-aspect',width:meta.width,height:meta.height});continue;}
  if(item.transparent&&!meta.hasAlpha){needsRepair.push({id:item.id,reason:'missing-alpha'});continue;}
  if(!fs.existsSync(adopted)){const padding=item.padding||0;let pipeline=sharp(raw).resize(item.kind==='world'?1200:512-padding*2,item.kind==='world'?800:512-padding*2,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}});if(padding)pipeline=pipeline.extend({top:padding,bottom:padding,left:padding,right:padding,background:{r:0,g:0,b:0,alpha:0}});await pipeline.webp({quality:90}).toFile(adopted);}
  if(item.transparent){const {data,info}=await sharp(adopted).ensureAlpha().raw().toBuffer({resolveWithObject:true}),indices=[3,(info.width-1)*4+3,info.width*(info.height-1)*4+3,info.width*info.height*4-1];if(indices.some(i=>data[i]!==0))needsRepair.push({id:item.id,reason:'opaque-corners',alpha:indices.map(i=>data[i])});}
  imported.push({id:item.id,path:item.adopted});
 }
 const report={imported,needsRepair,rejected};fs.mkdirSync(path.join(root,'output/whole-book-design'),{recursive:true});fs.writeFileSync(path.join(root,'output/whole-book-design/image-import.json'),JSON.stringify(report,null,2));console.log({imported:imported.length,needsRepair});
})().catch(error=>{console.error(error);process.exitCode=1;});
