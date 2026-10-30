'use strict';
const path=require('node:path');
const {build}=require('esbuild');
const {normalizeBasePath}=require('./public-base-path');
const bundles=new Map();
function createCourseJourney(root,basePath){
  normalizeBasePath(basePath);
  const key=root+':'+basePath;
  if(!bundles.has(key))bundles.set(key,compile(root,basePath).catch(error=>{bundles.delete(key);throw error;}));
  return bundles.get(key);
}
async function compile(root,basePath){
  const result=await build({absWorkingDir:root,entryPoints:['course-journey/main.jsx'],bundle:true,write:false,
    outdir:path.join(root,'dist-login/journey'),entryNames:'journey',define:{'process.env.NODE_ENV':'"production"'},
    minify:true,target:['es2020'],legalComments:'eof',assetNames:'[name]-[hash]',publicPath:basePath+'awards/static',loader:{'.webp':'file','.png':'file','.woff2':'file'}});
  const types={'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
  const files=new Map(result.outputFiles.map(file=>{const extension=path.extname(file.path),name=path.basename(file.path);return [extension==='.js'||extension==='.css'?name:'awards/static/'+name,{body:Buffer.from(file.contents),type:types[extension]}];}));
  return {files,bytes:[...files.values()].reduce((sum,file)=>sum+file.body.length,0)};
}
module.exports={createCourseJourney};
