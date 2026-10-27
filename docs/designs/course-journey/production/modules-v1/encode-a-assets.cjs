const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../../../../');
const items = [
 {id:'unit1-2',source:"C:/Users/duanxiaodong/.codex/generated_images/01a1693a-2b1d-7312-82e7-5ba94390b7f4/exec-2a41fdd0-e47f-4c12-a87f-37daeb251c99.png",request:'unit1-2-request-v2.json',originalRequest:'unit1-2-request.json',rejectedSource:"C:/Users/duanxiaodong/.codex/generated_images/01a1693a-2b1d-7312-82e7-5ba94390b7f4/exec-da96dd06-de28-4d23-8421-2cecd9f271c3.png",safeGround:[.23,.57,.77,.74],foot:[.5,.71],refs:[['opening-mobile-v2.webp','approved environment style'],['handbag-couple.webp','identity, palette, eventual overlay footprint only; no rendered people']]},
 {id:'unit3-4',source:"C:/Users/duanxiaodong/.codex/generated_images/01a1693a-2b1d-7312-82e7-5ba94390b7f4/exec-6c439099-d451-41a2-8d88-e586d52d3326.png",request:'unit3-4-request.json',safeGround:[.23,.56,.77,.75],foot:[.5,.71],refs:[['opening-mobile-v2.webp','approved environment style'],['umbrella-counter-v1.webp','identity, palette, eventual overlay footprint only; no rendered people']]}
];
function digest(file) { const b=fs.readFileSync(file);return {path:path.relative(root,file).replaceAll('\\','/'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};}
async function inspect(file) {
 const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let min=255,max=0,zero=0,partial=0,b=[info.width,info.height,-1,-1];
 for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
 const a=data[(y*info.width+x)*4+3];min=Math.min(min,a);max=Math.max(max,a);if(a===0)zero++;if(a>0&&a<255)partial++;
 if(a>16)b=[Math.min(b[0],x),Math.min(b[1],y),Math.max(b[2],x),Math.max(b[3],y)];
 }
 return {width:info.width,height:info.height,channels:4,alpha:{min,max,zero,partial,boundsAbove16:b,normalizedBoundsAbove16:b.map((v,i)=>v/(i%2?info.height:info.width))}};
}
(async()=>{
 const dir=path.join(root,'assets/course-journey/modules-v1');fs.mkdirSync(dir,{recursive:true});
 for(const item of items){
 const png=path.join(dir,item.id+'-ground.png'),webp=path.join(dir,item.id+'-ground.webp');
 if(fs.existsSync(png)||fs.existsSync(webp))throw new Error('Refusing overwrite '+item.id);
 fs.copyFileSync(item.source,png);await sharp(png).webp({lossless:true,effort:6}).toFile(webp);
 let rejected;
 if(item.rejectedSource){const p=path.join(__dirname,item.id+'-ground-first-generation.png');fs.copyFileSync(item.rejectedSource,p);rejected={...digest(p),source:item.rejectedSource,reason:'Cream floor ended too high; revised front wall depth to make shoe contact y=.71 viable.'};}
 const receipt={assetType:'environment-ground-only; characters remain original and are composited by runtime',generationTool:'built-in image_gen.imagegen',generatedAt:'2026-10-23',request:item.request,originalRequest:item.originalRequest,source:item.source,requestedDimensions:[1536,1024],requestedTransparentBackground:true,actual:await inspect(png),approvedFloorSafeRange:item.safeGround,recommendedFoot:item.foot,limitations:['8 percent transparent edge request was not met exactly; actual alpha bounds are recorded. Keep transparent padding in the layout container.','Flat safe range is visually assessed; verify the original character shoes and furniture contact in the composed page.','No crop, masking, repaint, resize or compositing was performed; original PNG copied byte-for-byte, WebP is format encoding only.'],references:item.refs.map(([name,role])=>({...digest(path.join(root,'assets/course-journey',name)),role})),outputs:[digest(png),digest(webp)],rejected};
 fs.writeFileSync(path.join(__dirname,item.id+'-receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
 }
})().catch(e=>{console.error(e);process.exitCode=1;});

