'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{kind,summarize}=require('../support/first-course-network');
test('measure real received bodies, not just clean finishes, declared sizes or worker cache replays',()=>{
 const path='/resources/'+'a'.repeat(64)+'/font.woff2',row={...kind('https://example.invalid/lesson'+path+'?private=value'),at:5,done:14,status:200,bodyBytes:100,transferred:null,failed:true};
 assert.equal(row.path,path);assert.equal(kind('https://example.invalid/api/admin/students/a'),null);
 const partial={...row,bodyBytes:40},hit={...row,worker:true,hit:'hit'},httpHit={...row,httpCache:true};
 const text={...row,path:path+'2',format:'js',encoding:'gzip',bodyBytes:60,encodedBodyBytes:22};
 const optional={...row,path:path+'.mp3',bodyBytes:50};
 const value=summarize([row,partial,hit,httpHit,text,optional],[],{[path]:100,[text.path]:60});
 assert.equal(value.objects,3);assert.equal(value.objectBodyBytes,200);assert.equal(value.encodedObjectBodyBytes,162);
 assert.equal(value.fullReceipts,2);assert.equal(value.workerHits,1);assert.equal(value.otherObjectBodyBytes,50);assert.equal(value.objectTransferBytes,null);
 assert.equal(summarize([{...text,encodedBodyBytes:undefined}],[],{[text.path]:60}).encodedObjectBodyBytes,null);
});

test('a resumed font counts the suffix actually transferred and not the complete font length',()=>{
 const f={...kind('https://example.invalid/resources/'+'b'.repeat(64)+'/font.woff2'),status:206,contentRange:'bytes 60-99/100',bodyBytes:40,at:0,done:12};
 const v=summarize([f],[],{[f.path]:100});assert.equal(v.objectBodyBytes,40);assert.equal(v.fullReceipts,0);assert.equal(v.rangeReceipts,1);
 assert.equal(summarize([{...f,contentRange:'bytes 50-99/100'}],[],{[f.path]:100}).rangeReceipts,0);
});
