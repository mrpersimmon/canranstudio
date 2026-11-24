'use strict';
// Import built-in ImageGen receipts without altering source art or keepsakes.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),receipts=path.join(root,'docs/designs/learning-flow/sample-13-24-generations');
(async()=>{
 let count=0;
 for(const name of fs.readdirSync(receipts).filter(n=>n.endsWith('.json'))){
  const item=JSON.parse(fs.readFileSync(path.join(receipts,name),'utf8')),raw=path.join(root,item.raw),target=path.join(root,item.adopted);
  fs.mkdirSync(path.dirname(raw),{recursive:true});fs.mkdirSync(path.dirname(target),{recursive:true});
  if(!fs.existsSync(raw))fs.copyFileSync(item.generatedPath,raw);
  const metadata=await sharp(raw).metadata();
  if(item.transparent&&!metadata.hasAlpha)throw Error('Transparent output required: '+item.id);
  if(!fs.existsSync(target))await sharp(raw).resize(item.kind==='world'?1200:512,item.kind==='world'?800:512,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90}).toFile(target);
  count++;
 }
 console.log('Imported '+count+' image receipts.');
})().catch(error=>{console.error(error);process.exitCode=1;});
