'use strict';
// Read measured, unchanged image outputs; no image processing happens here.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../../..'),pack=path.join(root,'docs/designs/course-journey/production/complete-journey-v1');
const brief=JSON.parse(fs.readFileSync(path.join(pack,'story-briefs.json'),'utf8'));
const read=id=>{const file=path.join(pack,id+'-receipt.json');return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;};
const selected=JSON.parse(fs.readFileSync(path.join(pack,'selected-variants.json'),'utf8'));
const characters={},chapters={},descriptors=[];
for(const t of brief.themes){
 const sprites=t.courses.map(id=>read(selected[id]||id)),backgrounds=['mobile','desktop'].map(mode=>read(selected[t.id+'-'+mode]||t.id+'-'+mode));
 if([...sprites,...backgrounds].some(value=>!value))throw Error('Missing production receipts for '+t.id);
 for(let i=0;i<3;i++){
  const r=sprites[i],png=r.outputs[0],webp=r.outputs.find(o=>o.path.endsWith('.webp')),b=r.alpha.bounds.find(b=>b.thresholdExclusive===16).normalized;
  characters[t.courses[i]]={file:path.basename(webp.path),width:png.width,height:png.height,anchor:[(b[0]+b[2])/2,b[3]],bounds:b};
 }
 chapters[t.id]={};
 for(const [index,mode] of ['portrait','landscape'].entries()){
  const portrait=mode==='portrait',r=backgrounds[index],bg=r.outputs.find(o=>o.path.endsWith('.webp'));
  const heights=portrait?[.33,.2805,.238425]:[.25,.2125,.180625],limits=portrait?[.38,.36,.42]:[.22,.27,.27];
  const aspect=t.courses.map(id=>{const c=characters[id],b=c.bounds;return(b[2]-b[0])/((b[3]-b[1])*c.height/c.width);});
  // Scale a chapter as a group so each accepted sprite keeps its native ratio,
  // all soles remain on the broad landing, and rear depth stays 85% per step.
  const scale=Math.min(1,...aspect.map((ratio,i)=>limits[i]/(heights[i]*ratio)));
  const nodes={};
  for(let i=0;i<3;i++){
   const id=t.courses[i],c=characters[id],b=c.bounds;
   const feet=(portrait?[[.34,.797],[.35,.46],[.73,.24]]:[[.314,.768],[.50,.52],[.75,.31]])[i];
   const info=portrait?[{x:.56,offsetY:-68,after:t.courses[1]},{x:.56,offsetY:-12,after:t.courses[2]},{x:.56,offsetY:8}][i]:[{x:.314,offsetY:4,center:true},{x:.64,offsetY:-20,after:t.courses[2]},{x:.78,offsetY:8,center:true}][i];
   const title=brief.entries.find(e=>e.id===id).title;
   const textWidth=font=>[...title].reduce((total,char)=>total+font*(char.charCodeAt(0)>255?1:/\s/.test(char)?.3:.55),0);
   const caption={compact:{width:132,height:textWidth(16)>116?98:76},mobile:{width:160,height:textWidth(16)>144?80:56},desktop:{width:208,height:textWidth(22)>178?108:80}};
   nodes[id]={feet,width:heights[i]*scale/((b[3]-b[1])*c.height/c.width),label:[info.x,portrait?[.86,.568,.316][i]:[.86,.575,.375][i]],info,caption};
  }
  chapters[t.id][mode]={file:path.basename(bg.path),width:bg.width,height:bg.height,nodes};
 }
 descriptors.push({id:t.id,label:`Lesson ${t.first}–${t.last}`,courses:t.courses,alt:`${t.title}：奶油色石路与珊瑚拱墙连接${t.courses.map(id=>brief.entries.find(e=>e.id===id).title).join('、')}`});
}
const outputs={'course-journey/complete-journey-layout.json':{characters,chapters},'course-journey/complete-journey-chapters.json':descriptors};
for(const [file,value]of Object.entries(outputs)){const content=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check')){if(fs.readFileSync(path.join(root,file),'utf8')!==content)throw Error('Placement differs: '+file);}else fs.writeFileSync(path.join(root,file),content);}
console.log(JSON.stringify({chapters:descriptors.length,characters:Object.keys(characters).length,checked:process.argv.includes('--check')}));
