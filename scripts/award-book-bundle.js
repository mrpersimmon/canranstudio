'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const { createHash } = require('node:crypto');
const { build } = require('esbuild');
const catalog = require('../server/award-catalog');
const { normalizeBasePath } = require('./public-base-path');
const bundles = new Map();
function createAwardBook(root, basePath) {
  normalizeBasePath(basePath);
  const key = root + ':' + basePath;
  if (!bundles.has(key)) bundles.set(key, compile(root, basePath).catch(error => { bundles.delete(key); throw error; }));
  return bundles.get(key);
}
async function compile(root, basePath) {
  const outdir = path.join(root, 'dist-login/award-book');
  const result = await build({ absWorkingDir:root, entryPoints:['award-book/main.jsx'], bundle:true, write:false,
    outdir, entryNames:'album-[hash]', assetNames:'[name]-[hash]', publicPath:basePath+'awards/static',
    define:{ 'process.env.NODE_ENV':'"production"' }, minify:true, target:['es2020'],
    loader:{'.webp':'file','.png':'file','.woff2':'file'}, legalComments:'eof' });
  const files = new Map(), types = {'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
  for (const file of result.outputFiles) files.set('awards/static/'+path.basename(file.path), {body:Buffer.from(file.contents), type:types[path.extname(file.path)]});
  const editions = {};
  for (const [course, versions] of Object.entries(catalog)) {
    editions[course] = {};
    for (const [edition, meta] of Object.entries(versions)) {
      const body = await fs.readFile(path.join(root, meta.scene));
      const address = 'awards/static/'+path.basename(meta.scene,'.webp')+'-'+createHash('sha256').update(body).digest('hex').slice(0,16)+'.webp';
      files.set(address, {body,type:'image/webp'});
      editions[course][edition] = {...meta,scene:basePath+address};
    }
  }
  const js = [...files.keys()].find(key=>key.endsWith('.js')), css = [...files.keys()].find(key=>key.endsWith('.css'));
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="award-base" content="${basePath}"><title>我的纪念册 · 灿然英语工作室</title><link rel="icon" href="${basePath}assets/brand/starflower-favicon.png"><link rel="stylesheet" href="${basePath+css}"><script defer src="${basePath+js}"></script></head><body><div id="root"></div><noscript>请允许 JavaScript 以打开纪念册。</noscript></body></html>`;
  return {files,editions,html,bytes:[...files.values()].reduce((sum,file)=>sum+file.body.length,0)};
}
module.exports = { createAwardBook };
