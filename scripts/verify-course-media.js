'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),PROOF='test-results/media-proof.json';
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
function fingerprint(prepared){return digest([...prepared.files].filter(([name])=>name.endsWith('.mp3')).sort(([a],[b])=>a.localeCompare(b)).map(([name,bytes])=>name+':'+digest(bytes)).join('\n'));}
function decode(bytes){return new Promise((resolve,reject)=>{
  const child=spawn('ffmpeg',['-v','error','-i','pipe:0','-ar','24000','-ac','1','-f','f32le','pipe:1']);
  const chunks=[],errors=[];child.stdout.on('data',c=>chunks.push(c));child.stderr.on('data',c=>errors.push(c));child.on('error',reject);
  child.on('close',code=>code===0?resolve(Buffer.concat(chunks)):reject(Error(Buffer.concat(errors).toString()||'Audio decode failed')));child.stdin.on('error',reject);child.stdin.end(bytes);
});}
function assertMediaProof(prepared){
  let proof;try{proof=JSON.parse(fs.readFileSync(path.join(ROOT,PROOF)));}catch{throw Error('No decoded audio proof. Run npm run test:media.');}
  const files=[...prepared.files.keys()].filter(name=>name.endsWith('.mp3'));
  if(proof.status!=='passed'||proof.fingerprint!==fingerprint(prepared)||proof.entries?.length!==files.length||files.some(name=>!proof.entries.some(e=>e.path===name&&e.duration>=.18&&e.rmsDb>-55)))throw Error('Audio proof is incomplete or stale. Run npm run test:media.');
  return proof;
}
async function main(){
  const prepared=require('./build-learning-path-release').prepare(),files=[...prepared.files].filter(([name])=>name.endsWith('.mp3'));
  const report={schema:1,fingerprint:fingerprint(prepared),status:'running',scope:'Decoder, non-silent waveform and duration; not a claim of human listening acceptance.',entries:[],errors:[]};
  let index=0;
  await Promise.all(Array.from({length:4},async()=>{
    for(let i;(i=index++)<files.length;){
      const [name,bytes]=files[i];
      try{
        const pcm=await decode(bytes);let peak=0,sum=0;
        for(let offset=0;offset<pcm.length;offset+=4){const x=pcm.readFloatLE(offset);if(!Number.isFinite(x))throw Error('Non-finite audio');peak=Math.max(peak,Math.abs(x));sum+=x*x;}
        const samples=pcm.length/4,duration=samples/24000,rmsDb=20*Math.log10(Math.sqrt(sum/samples));
        if(duration<.18||duration>90||rmsDb<=-55)throw Error('Empty, truncated or implausible recording');
        report.entries.push({path:name,sha256:digest(bytes),bytes:bytes.length,duration,rmsDb,peak});
      }catch(error){report.errors.push({path:name,message:String(error)});}
    }
  }));
  report.status=report.errors.length?'failed':'passed';report.finishedAt=new Date().toISOString();report.entries.sort((a,b)=>a.path.localeCompare(b.path));
  fs.mkdirSync(path.join(ROOT,'test-results'),{recursive:true});fs.writeFileSync(path.join(ROOT,PROOF),JSON.stringify(report,null,2)+'\n');
  if(report.errors.length)throw Error(JSON.stringify(report.errors));
  console.log('Decoded and checked '+report.entries.length+' course recordings');
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={fingerprint,assertMediaProof};
