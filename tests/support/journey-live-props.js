'use strict';
const path=require('node:path');
const {build}=require('esbuild');

// Test-only host for a real App whose props refresh WITHOUT remounting it.
// Production portal navigation remounts the home, so a plain reload would miss
// a stale in-memory selection/chapter regression. All data comes through the
// real read-only /api/me request; the caller may filter that response in transit.
async function mountLiveJourneyProps(page,base){
 const root=path.resolve(__dirname,'../..'),prefix=base+'__journey-live-props/';
 const entry=[
  "import React,{useState} from 'react';",
  "import {createRoot} from 'react-dom/client';",
  "import {App} from './course-journey/App';",
  "import './course-journey/styles.css';",
  "window.CanranStudentShell={signOut:async()=>{throw Error('UI test only');}};",
  "function Harness(){",
  " const [who,setWho]=useState(null),[reads,setReads]=useState(0),[error,setError]=useState('');",
  " async function refresh(){try{const response=await fetch("+JSON.stringify(base+'api/me')+");if(!response.ok)throw Error('api/me failed');setWho(await response.json());setReads(n=>n+1);}catch(e){setError(e.message);}}",
  " React.useEffect(()=>{refresh();},[]);",
  " return <><button className='props-refresh' onClick={refresh}>重新读取课程</button><output aria-label='读取次数'>{reads}</output>{error&&<p role='alert'>{error}</p>}{who&&<App who={who} base="+JSON.stringify(base)+" onRefresh={refresh}/>}</>;",
  "}",
  "createRoot(document.getElementById('app')).render(<Harness/>);"
 ].join('\n');
 const bundle=await build({absWorkingDir:root,stdin:{contents:entry,resolveDir:root,sourcefile:'journey-live-props.jsx',loader:'jsx'},bundle:true,write:false,outdir:path.join(root,'.data/journey-live-props-virtual'),entryNames:'app',define:{'process.env.NODE_ENV':'"production"'},minify:true,target:['es2020']});
 const outputs=new Map(bundle.outputFiles.map(file=>[path.extname(file.path),Buffer.from(file.contents)]));
 const html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="'+base+'portal.css"><link rel="stylesheet" href="'+base+'student-shell.css"><link rel="stylesheet" href="'+prefix+'app.css"><style>.props-refresh{position:fixed;top:0;right:0;z-index:99999}output[aria-label]{position:fixed;top:45px;right:0;z-index:99999;background:white}</style></head><body class="journey-page student-portal"><main id="app"></main><script src="'+prefix+'app.js"></script></body></html>';
 await page.route('**'+prefix+'**',route=>{
  const pathname=new URL(route.request().url()).pathname;
  if(pathname===prefix)return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
  const extension=path.extname(pathname),body=outputs.get(extension);
  if(body&&pathname===prefix+'app'+extension)return route.fulfill({status:200,contentType:extension==='.css'?'text/css':'text/javascript',body});
  return route.fulfill({status:404,body:'Not a fixture resource'});
 });
 await page.goto(prefix);
 return async()=>page.unroute('**'+prefix+'**');
}
module.exports={mountLiveJourneyProps};
