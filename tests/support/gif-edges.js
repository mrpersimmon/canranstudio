'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),crypto=require('node:crypto'),sharp=require('sharp');

// Decode the saved GIF, including compositing its delta frames. A transparent
// flag alone says nothing about an opaque matte already painted in frame 0.
async function inspectGifEdges(file,{full=false}={}){
 const bytes=await fs.readFile(file),metadata=await sharp(bytes,{animated:true}).metadata();
 assert.equal(metadata.width,984);assert.equal(metadata.pageHeight,528);assert.equal(metadata.pages,60);assert.equal(metadata.loop,0);assert.ok(metadata.delay.every(delay=>delay===80));
 const {data,info}=await sharp(bytes,{animated:true}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const width=metadata.width,height=metadata.pageHeight,stride=width*height*info.channels,frames=[];
 let expectedMask;const rimColors=Array.from({length:4},()=>new Set());
 for(let frame=0;frame<metadata.pages;frame++){
  const offset=frame*stride,pixel=(x,y)=>offset+(y*width+x)*info.channels;
  for(const [x,y]of [[0,0],[4,4],[width-1,0],[width-5,4],[0,height-1],[4,height-5],[width-1,height-1],[width-5,height-5]])assert.equal(data[pixel(x,y)+3],0,`frame ${frame}: outside corner (${x},${y}) must be transparent`);
  let whiteBoundary=0,interiorHoles=0;const mask=Buffer.alloc(width*height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const p=pixel(x,y),alpha=data[p+3];mask[y*width+x]=alpha;
   const inside=x>=32&&x<width-32&&y>=32&&y<height-32;
   if(inside&&alpha!==255)interiorHoles++;
   if(alpha===255&&!inside){
    const boundary=x===0||y===0||x===width-1||y===height-1||data[p-1]===0||data[p+7]===0||data[p-width*4+3]===0||data[p+width*4+3]===0;
    if(boundary&&Math.min(data[p],data[p+1],data[p+2])>200)whiteBoundary++;
   }
  }
  assert.equal(interiorHoles,0,`frame ${frame}: white paper, lettering and clothing must stay opaque`);
  assert.equal(whiteBoundary,0,`frame ${frame}: no opaque pale fringe around the contour`);
  // All four straight edges touch the canvas; transparent padding is not a
  // substitute for removing the old four-pixel export margin.
  const edge=(x,y)=>{const p=pixel(x,y);assert.equal(data[p+3],255,`frame ${frame}: no outer padding`);assert.ok(Math.max(data[p],data[p+1],data[p+2])<180,`frame ${frame}: edge is the dark card outline, not white matte`);};
  for(let x=32;x<width-32;x++){edge(x,0);edge(x,height-1);}for(let y=32;y<height-32;y++){edge(0,y);edge(width-1,y);}
  if(full)for(const [index,[x,y]]of [[width/2,4],[width/2,height-5],[4,height/2],[width-5,height/2]].entries())rimColors[index].add(data.subarray(pixel(x,y),pixel(x,y)+3).join(','));
  const alphaHash=crypto.createHash('sha256').update(mask).digest('hex');if(expectedMask)assert.equal(alphaHash,expectedMask,'the transparent contour must not change across delta frames');else expectedMask=alphaHash;
  frames.push({frame,whiteBoundary,alphaHash});
 }
 if(full)for(const colors of rimColors)assert.ok(colors.size>=4,'full-star gold must directly follow the outline, not sit behind a static pale gap');
 return {width,height,frames:metadata.pages,delay:80,bytes:bytes.length,alphaHash:expectedMask,checkedFrames:frames.length,whiteBoundaryPixels:0,...(full?{rimColors:rimColors.map(set=>set.size)}:{})};
}
module.exports={inspectGifEdges};
