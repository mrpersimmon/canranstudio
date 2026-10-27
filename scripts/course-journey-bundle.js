'use strict';
const path=require('node:path');
const {build}=require('esbuild');
const {normalizeBasePath}=require('./public-base-path');
const bundles=new Map();
function createCourseJourney(root,basePath){
  normalizeBasePath(basePath);
  const key=root+':'+basePath;
  if(!bundles.has(key))bundles.set(key,compile(root).catch(error=>{bundles.delete(key);throw error;}));
  return bundles.get(key);
}
async function compile(root){
  const result=await build({absWorkingDir:root,entryPoints:['course-journey/main.jsx'],bundle:true,write:false,
    outdir:path.join(root,'dist-login/journey'),entryNames:'journey',define:{'process.env.NODE_ENV':'"production"'},
    minify:true,target:['es2020'],legalComments:'eof'});
  const files=new Map(result.outputFiles.map(file=>['journey.'+path.extname(file.path).slice(1),{body:Buffer.from(file.contents),type:file.path.endsWith('.css')?'text/css':'text/javascript'}]));
  return {files,bytes:[...files.values()].reduce((sum,file)=>sum+file.body.length,0)};
}
module.exports={createCourseJourney};
