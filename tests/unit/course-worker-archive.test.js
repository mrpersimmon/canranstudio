'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../core/course-worker.js'),'utf8');

function worker(base){
  const handlers=new Map(),pack={id:'unit1-2',revision:'current',protocol:1,basePath:base,required:[],audio:[]};
  const pin={id:pack.id,revision:pack.revision,access:{expires:Date.now()+60000}};
  const store={get:async bucket=>bucket==='pins'?pin:pack};
  const self={registration:{scope:'https://example.test'+base},location:{origin:'https://example.test'},courseAccessRequired:true,
    addEventListener:(type,handler)=>handlers.set(type,handler)};
  vm.runInNewContext(source,{self,CanranCourseCache:{open:()=>store},URL,Response,Date,Map,Set,fetch:()=>{throw Error('The archived route must pass to normal server networking');}});
  return async relative=>{
    let response;
    handlers.get('fetch')({request:{method:'GET',url:'https://example.test'+base+relative,mode:'cors',headers:new Headers()},clientId:'existing-pinned-page',respondWith:value=>{response=Promise.resolve(value);}});
    return response?await response:null;
  };
}

for(const base of ['/', '/lesson/'])test(base+' pinned courses let archive assets reach server authorization without allowing other undeclared images',async()=>{
  const fetch=worker(base);
  assert.equal(await fetch('awards/history-assets/unit1-2/assets/awards/original-card.webp'),null);
  assert.equal(await fetch('awards/static/scene.webp'),null);
  for(const path of ['awards/history-assets-other/unit1-2/scene.webp','awards/other/scene.webp','assets/unlisted.webp']){
    const response=await fetch(path);
    assert.equal(response.status,409,path);
    assert.equal(await response.text(),'Resource not declared by this course version');
  }
});
