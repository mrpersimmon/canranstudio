import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
const root=fileURLToPath(new URL('../dist/client/',import.meta.url));
const port=Number(process.env.PORT||4264);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.svg':'image/svg+xml'};
const cache=new Map();
const requestLog=process.env.PREVIEW_REQUEST_LOG;
function record(data){if(requestLog)fs.appendFile(requestLog,JSON.stringify({time:new Date().toISOString(),...data})+'\n').catch(()=>{});}
async function asset(file){const modified=(await fs.stat(file)).mtimeMs;if(cache.get(file)?.modified===modified)return cache.get(file);const bytes=await fs.readFile(file);const type=mime[path.extname(file)]||'application/octet-stream';const compressed=/text\/|javascript/.test(type)?gzipSync(bytes):null;const data={bytes,type,compressed,modified};cache.set(file,data);return data;}
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  try{const url=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);if(pathname.includes('\0')||pathname.includes('..'))throw Error('path');
    if(process.env.PREVIEW_FAIL_ASSET&&pathname.includes(process.env.PREVIEW_FAIL_ASSET)){record({method:req.method,path:pathname,status:503,bodyBytes:0});res.writeHead(503,{'Cache-Control':'no-store'});res.end();return;}
    const relative=pathname==='/'?'index.html':pathname.slice(1);const file=path.resolve(root,relative);if(!file.startsWith(root))throw Error('path');
    const data=await asset(file);const gzip=data.compressed&&/\bgzip\b/.test(req.headers['accept-encoding']||'');const bytes=gzip?data.compressed:data.bytes;
    res.setHeader('Content-Type',data.type);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Cache-Control',relative.startsWith('assets/')?'public, max-age=31536000, immutable':'no-cache');res.setHeader('Vary','Accept-Encoding');if(gzip)res.setHeader('Content-Encoding','gzip');res.setHeader('Content-Length',bytes.length);
    res.writeHead(200);res.end(req.method==='HEAD'?undefined:bytes);
    record({method:req.method,path:pathname,status:200,bodyBytes:req.method==='HEAD'?0:bytes.length,encoding:gzip?'gzip':'identity'});
  }catch{record({method:req.method,path:new URL(req.url,'http://localhost').pathname,status:404,bodyBytes:9});res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Award book preview http://127.0.0.1:${port}/`));
