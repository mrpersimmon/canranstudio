'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../../../..');
const output = path.join(root, 'assets/course-journey/modules-v1');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceDir = 'C:/Users/duanxiaodong/.codex/generated_images/01a1693d-c894-79a1-b00e-54d20ab1cd07';
const definitions = [
 {name:'unit9-10-ground',file:'exec-97979e9d-d2b4-4083-90b2-c92cbc9903d1.png',requests:['unit9-10-request.json','unit9-10-request-v2.json'],safeFloor:{x:[.20,.80],y:[.56,.78],feetY:.72},notes:['Complete island, no people. Main floor empty.','Requested 8% transparent margins not fully achieved horizontally; use measured alpha bounds and external module gutters.'],prior:'exec-9a2fa3a1-cc00-4c89-8f0f-e910d7ec5a3d.png'},
 {name:'unit11-12-ground',file:'exec-b0fd777a-8c27-4820-b36f-39d124f3b5eb.png',requests:['unit11-12-request.json'],safeFloor:{x:[.22,.78],y:[.56,.78],feetY:.72},notes:['School house and steps behind safe floor; no people or duplicated shirt props.','Requested 8% margins require verification against measured bounds; external layout gutters remain necessary.']},
 {name:'ambient-water-v1',file:'exec-d8423973-1758-4214-b198-c1cd0bdcfab5.png',requests:['ambient-water-v1-request.json'],notes:['Opaque portrait ambient background, central low-obstruction water, architecture and vegetation peripheral.','No route platform, stairs or required foot-contact objects.']}
];
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 for(const def of definitions){
  const source=path.join(sourceDir,def.file);
  const png=path.join(output,def.name+'.png'),webp=path.join(output,def.name+'.webp');
  if(fs.existsSync(png)||fs.existsSync(webp)) throw new Error('Refuse overwrite: '+def.name);
  fs.copyFileSync(source,png);
  await sharp(png).webp({quality:90,alphaQuality:100,effort:6}).toFile(webp);
  const meta=await sharp(png).metadata();
  const {data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let minX=info.width,minY=info.height,maxX=-1,maxY=-1,zero=0,partial=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
   const a=data[(y*info.width+x)*4+3]; if(a===0)zero++; else if(a<255)partial++;
   if(a>16){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  }
  const files=[png,webp];
  const requests=def.requests.map(f=>{
   const p=path.join(__dirname,f),r=JSON.parse(fs.readFileSync(p,'utf8'));
   return {file:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p),references:r.referenced_image_paths.map((ref,i)=>({path:ref,sha256:hash(ref),role:r.referenceRoles?.[i]||'edit target; preserve scene design'}))};
  });
  const receipt={asset:def.name,tool:'built-in image_gen',source,sourceSha256:hash(source),actualSize:[meta.width,meta.height],hasAlpha:meta.hasAlpha,alpha:{fullyTransparent:zero,partiallyTransparent:partial,boundsAt16:[minX,minY,maxX,maxY],normalizedBoundsAt16:[minX/info.width,minY/info.height,(maxX+1)/info.width,(maxY+1)/info.height]},safeFloor:def.safeFloor,inspectionNotes:def.notes,requests,outputs:files.map(p=>({file:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p),bytes:fs.statSync(p).size})),processing:'Native PNG copied byte-for-byte; WebP re-encoding only. No crop, resize, recolor or generated content changes.'};
  if(def.prior){const prior=path.join(sourceDir,def.prior),dest=path.join(__dirname,'unit9-10-ground-first-generation.png');fs.copyFileSync(prior,dest);receipt.priorVariant={source:prior,file:path.relative(root,dest).replaceAll('\\','/'),sha256:hash(dest),reason:'Horizontal transparent gutter too small; retained for provenance.'};}
  fs.writeFileSync(path.join(__dirname,def.name+'-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  process.stdout.write(JSON.stringify({asset:def.name,size:receipt.actualSize,alpha:receipt.alpha,outputs:receipt.outputs})+'\n');
 }
})().catch(e=>{process.stderr.write(e.stack);process.exitCode=1;});

