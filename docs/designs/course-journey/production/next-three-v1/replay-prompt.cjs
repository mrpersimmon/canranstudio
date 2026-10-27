'use strict';
// Reconstruct a recorded built-in imagegen request in any checkout. This
// validates inputs and writes JSON only; it never invokes a paid API.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const failures=Object.entries(manifest.lockedFiles).filter(([file,expected])=>!fs.existsSync(path.join(root,file))||hash(file)!==expected).map(([file])=>file);
if(failures.length)throw new Error('Frozen next-three inputs changed: '+failures.join(', '));
const id=process.argv[2]||'--verify';
if(id==='--verify'){
  console.log(JSON.stringify({ok:true,version:manifest.version,lockedFiles:Object.keys(manifest.lockedFiles).length,jobs:Object.keys(manifest.jobs)},null,2));
}else{
  const job=manifest.jobs[id];if(!job)throw new Error('Choose a job: '+Object.keys(manifest.jobs).join(', '));
  const original=JSON.parse(fs.readFileSync(path.join(root,job.request),'utf8'));
  const request={prompt:original.prompt,referenced_image_paths:job.references.map(file=>path.join(root,file)),transparent_background:original.transparent_background};
  const output=path.join(root,'output/fronted-opt/next-three-prompts');fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,id+'.request.json'),JSON.stringify(request,null,2)+'\n');
  fs.writeFileSync(path.join(output,id+'.prompt.txt'),request.prompt+'\n');
  console.log(JSON.stringify({job:id,request:path.join(output,id+'.request.json'),prompt:path.join(output,id+'.prompt.txt'),tool:'image_gen.imagegen',mode:'built-in',generated:false},null,2));
}
