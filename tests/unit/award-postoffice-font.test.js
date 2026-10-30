'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),hash=data=>crypto.createHash('sha256').update(data).digest('hex');
test('postoffice UI subset is small and pinned without changing the complete original name font',()=>{
 const record=JSON.parse(fs.readFileSync(path.join(root,'assets/awards/postoffice/ui-font-source.json'),'utf8'));
 const source=fs.readFileSync(path.join(root,'assets/awards/fonts/award-gothic-500.woff2'));
 const subset=fs.readFileSync(path.join(root,'assets/awards/postoffice/postoffice-ui-500.woff2'));
 assert.equal(hash(source),record.sourceSha256);assert.equal(source.length,4456656);
 assert.equal(hash(subset),record.sha256);assert.equal(subset.length,record.bytes);assert(subset.length<200000);
 assert.equal(record.glyphOutlinesAndMetricsUnchanged,true);
 for(const [file,expected] of Object.entries(record.inputs))assert.equal(hash(fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,'').replaceAll('\r\n','\n')),expected,'UI text changed; regenerate and verify the same-glyph subset: '+file);
});
