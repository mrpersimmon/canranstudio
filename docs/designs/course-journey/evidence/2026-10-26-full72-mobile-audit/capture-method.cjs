'use strict';
// Called only with handles supplied by the active CUA session. No browser is
// launched or connected from this file.
const sharp=require('sharp');
const hash=b=>require('node:crypto').createHash('sha256').update(b).digest('hex');
async function state(ctx){
 const r=await ctx.cdp.send('Runtime.evaluate',{expression:'('+function(){
  const rect=e=>e?.getBoundingClientRect().toJSON();const h=document.querySelector('.journey-panorama-switch'),w=document.querySelector('[data-staging="false"] [data-route-world]'),i=document.querySelector('.journey-dock-art');
  return{width:innerWidth,height:innerHeight,switching:h?.dataset.switching,chapter:w?.dataset.routeWorld,world:rect(w),dock:rect(document.querySelector('.journey-dock')),selected:document.querySelector('.journey-dock')?.dataset.selectedCourse,thumbnail:i?{src:i.getAttribute('src'),complete:i.complete,naturalWidth:i.naturalWidth,box:rect(i)}:null};
 }.toString()+')()',returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;
}
async function select(ctx,chapter){
 await ctx.tab.playwright.getByLabel('旅程地图范围',{exact:true}).selectOption(chapter);
 await ctx.tab.playwright.locator('.journey-panorama-switch[data-switching="false"] [data-route-world="'+chapter+'"][data-world-state="ready"]').waitFor({state:'visible',timeoutMs:10000});
 await ctx.tab.getAXState({emit:false});
}
async function record(ctx,{from,to,name,duration=650,trigger}){
 await select(ctx,from);await ctx.cdp.send('Runtime.evaluate',{expression:'window.scrollTo({top:0,behavior:"instant"})'});await ctx.tab.getAXState({emit:false});
 const before=await state(ctx),folder=ctx.evidence+'/switches/'+name;await ctx.fs.mkdir(folder,{recursive:true});
 let cursor=(await ctx.cdp.readEvents({methods:['Page.screencastFrame']})).cursor;const frames=[],states=[];let truncated=false;
 async function collect(timeoutMs){
  const batch=await ctx.cdp.readEvents({afterSequence:cursor,methods:['Page.screencastFrame'],limit:100,timeoutMs});cursor=batch.cursor;truncated||=batch.truncated;
  for(const e of batch.events){const p=e.params;await ctx.cdp.send('Page.screencastFrameAck',{sessionId:p.sessionId});const bytes=Buffer.from(p.data,'base64'),index=frames.length,file=String(index).padStart(3,'0')+'.jpg';await ctx.fs.writeFile(folder+'/'+file,bytes);frames.push({index,file,bytes:bytes.length,sha256:hash(bytes),metadata:p.metadata});}
  if(batch.events.length)states.push(await state(ctx));
 }
 await ctx.cdp.send('Page.startScreencast',{format:'jpeg',quality:80,maxWidth:before.width,maxHeight:before.height,everyNthFrame:1});
 try{
  await collect(1000);if(!frames.length)throw Error('Missing outgoing picture');
  const action=trigger?trigger():ctx.tab.playwright.getByLabel('旅程地图范围',{exact:true}).selectOption(to);
  const until=Date.now()+duration;while(Date.now()<until)await collect(80);
  await action;
  await ctx.tab.playwright.locator('.journey-panorama-switch[data-switching="false"] [data-route-world="'+to+'"][data-world-state="ready"]').waitFor({state:'visible',timeoutMs:10000});
  await collect(100);await ctx.tab.getAXState({emit:false});
 }finally{await ctx.cdp.send('Page.stopScreencast',{});}
 const after=await state(ctx),left=Math.ceil(Math.max(before.world.left,after.world.left))+8,right=Math.floor(Math.min(before.world.right,after.world.right))-8;
 // The expected loading hint occupies the top of the map. Test the painted
 // near-field below that UI band; keep the pixel-difference threshold unchanged.
 const top=Math.ceil(Math.max(before.world.top,after.world.top))+80,bottom=Math.floor(Math.min(before.dock.top,after.dock.top,before.world.top+300,after.world.top+300))-12;
 const strips=[[left,top,left+28,bottom],[right-28,top,right,bottom]];
 const read=async f=>sharp(await ctx.fs.readFile(folder+'/'+f.file)).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const old=await read(frames[0]),fresh=await read(frames.at(-1));
 const errors=[];if(truncated)errors.push('Screencast event buffer truncated');if(after.chapter!==to||after.switching!=='false')errors.push('Wrong final chapter');if(frames.length<2)errors.push('Insufficient actual frames');
 if(old.info.width!==before.width||old.info.height!==before.height)errors.push('Frame dimensions do not match viewport');
 function delta(a,b){let sum=0,n=0;for(const[x0,y0,x1,y1]of strips)for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)for(let c=0;c<3;c++){const i=(y*old.info.width+x)*3+c;sum+=Math.abs(a[i]-b[i]);n++;}return n?sum/n:NaN;}
 const pixels=[];for(const frame of frames){const raw=await read(frame),a=delta(raw.data,old.data),b=delta(raw.data,fresh.data),minimum=Math.min(a,b);pixels.push({index:frame.index,toOld:a,toNew:b,minimum});if(!Number.isFinite(minimum)||minimum>3)errors.push('Unexpected near-field pixels frame '+frame.index+' deviation '+minimum);}
 const result={signature:ctx.signature,from,to,before,after,frames,states,strips,pixels,errors,method:'Actual browser screencast JPEG80 frames; two near-field edge strips below the expected loading-hint UI band compared with outgoing and settled incoming frames, threshold3 mean RGB levels. This detects blank/intermediate terrain in sampled frames, not every pixel or every physical refresh.'};
 await ctx.fs.writeFile(folder+'/record.json',JSON.stringify(result,null,2)+'\n');
 return{name,from,to,frames:frames.length,span:frames.at(-1).metadata.timestamp-frames[0].metadata.timestamp,errors};
}
module.exports={record,state,select};
