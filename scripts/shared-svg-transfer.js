'use strict';
const {createHash}=require('node:crypto');
const digest=b=>createHash('sha256').update(b).digest('hex');
const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);
// A transport recipe only: old clients and old print/export paths can still
// request the original standalone SVG. Never rewrite its viewport or pixels.
function shareIllustrations(id,required,generated,base){
 if(id==='unit1-2'){
  // Most of these button and legacy word icons are only a few hundred bytes.
  // A literal recipe retains the individual cache key and original URL while
  // avoiding a separate network round trip for each on the first lesson.
  const prefix=base+'assets/lesson49/icons/';
  let remaining=32*1024;
  return required.map(item=>{
   if(item.type!=='image/svg+xml'||!item.key.startsWith(prefix)||item.bytes>2048||item.bytes>remaining)return item;
   const body=generated.get(item.url.slice(base.length)).body;
   const source=body.toString('utf8');
   if(!Buffer.from(source,'utf8').equals(body))return item;
   remaining-=item.bytes;
   return {...item,svgParts:[source]};
  });
 }
 if(id!=='unit45-46'&&id!=='unit47-48')return required;
 const prefix=base+'assets/'+id+'/',seenFiles=new Set(),recipes=new Map(),layers=new Map();
 for(const item of required){
  if(item.type!=='image/svg+xml'||!item.key.startsWith(prefix)||seenFiles.has(item.sha256))continue;
  seenFiles.add(item.sha256);
  const original=generated.get(item.url.slice(base.length)).body,src=original.toString('utf8'),parts=[];let pos=0,literalBytes=0;
  if(!Buffer.from(src,'utf8').equals(original))continue;
  for(const hit of src.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g)){
   const encoded=hit[1];if(encoded.length<65536)continue;
   const png=Buffer.from(encoded,'base64');if(!png.subarray(0,8).equals(pngSignature)||png.toString('base64')!==encoded)continue;
   const sha256=digest(png),start=hit.index+hit[0].length-encoded.length,text=src.slice(pos,start);
   if(!layers.has(sha256))layers.set(sha256,{sha256,png,uses:0});
   parts.push(text,layers.get(sha256));literalBytes+=Buffer.byteLength(text);pos=start+encoded.length;
  }
  if(!parts.length)continue;
  const tail=src.slice(pos);parts.push(tail);
  if(literalBytes+Buffer.byteLength(tail)>32768||parts.length>17)continue;
  for(const v of parts)if(typeof v!=='string')v.uses++;
  recipes.set(item.sha256,parts);
 }
 return required.map(item=>{
  const parts=recipes.get(item.sha256);if(!parts||parts.some(p=>typeof p!=='string'&&p.uses<2))return item;
  const svgParts=parts.map(v=>{
   if(typeof v==='string')return v;
   const address='resources/'+v.sha256+'/shared-art.png';
   if(!generated.has(address))generated.set(address,{body:v.png,type:'image/png',immutable:true});
   return {url:base+address,sha256:v.sha256,bytes:v.png.length,type:'image/png'};
  });
  return {...item,svgParts};
 });
}
function sharedArtObjects(pack){
 const parts=new Map();for(const item of pack.required)for(const p of item.svgParts||[])if(typeof p!=='string')parts.set(p.url,p);
 return [...parts.values()];
}
module.exports={shareIllustrations,sharedArtObjects};
