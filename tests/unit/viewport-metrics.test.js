'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const {createViewportMetrics,normalizeEvent,classifyClient,summarizeCoverage}=require('../../server/viewport-metrics');
const event=(overrides={})=>({v:1,eventId:crypto.randomUUID(),pageKind:'home',reason:'initial',layoutWidth:390,layoutHeight:844,clientWidth:390,visualWidth:390,visualHeight:844,visualScale:1,dpr:3,...overrides});
function temporary(t,dispose=()=>{}){
  const parent=path.resolve(os.tmpdir()),dir=fs.mkdtempSync(path.join(parent,'canran-viewports-'));
  t.after(()=>{dispose();if(!path.resolve(dir).startsWith(parent+path.sep))throw Error('Unexpected cleanup path');fs.rmSync(dir,{recursive:true,force:true});});
  return dir;
}
test('关闭采集不创建统计库，字段白名单拒绝身份和不合理尺寸',t=>{
  const dir=temporary(t),metrics=createViewportMetrics({dataDir:dir});
  assert.equal(metrics.receive(event()).disabled,true);assert.equal(fs.existsSync(path.join(dir,'viewport-metrics.sqlite')),false);
  assert.equal(metrics.report().coverage.percent,null);metrics.close();
  for(const extra of [{name:'不能保存的姓名'},{studentId:'private'},{layoutWidth:0},{dpr:NaN},{clientWidth:500},{visualWidth:null}]){
    assert.throws(()=>normalizeEvent(event(extra)),error=>error.status===400);
  }
  const normalized=normalizeEvent(event({dpr:1.501}));assert.equal(normalized.dprBucket,'1.5');
  assert.equal(classifyClient('Mozilla/5.0 (Macintosh) Version/17 Safari/605').platformGroup,'unknown');
});
test('重复上报只计一次，统计库只保存聚合和短期摘要，90天保留可清理',t=>{
  let metrics;const dir=temporary(t,()=>metrics?.close());let time=Date.parse('2026-10-22T10:00:00Z');
  metrics=createViewportMetrics({dataDir:dir,enabled:true,buildVersion:'test-build',now:()=>time});
  const input=event(),meta={audience:'student',userAgent:'Mozilla/5.0 (Linux; Android 14; Mobile) Chrome/130.0',source:'192.0.2.1:secret-session'};
  assert.equal(metrics.receive(input,meta).accepted,true);assert.equal(metrics.receive(input,meta).duplicate,true);
  let report=metrics.report();assert.equal(report.total,1);assert.equal(report.quality.duplicate,1);
  assert.equal(report.rows[0].platformGroup,'mobile');assert.equal(report.coverage.status,'pending-evidence');
  const db=new DatabaseSync(path.join(dir,'viewport-metrics.sqlite'));
  const stored=JSON.stringify(db.prepare('SELECT * FROM viewport_daily').all())+JSON.stringify(db.prepare('SELECT * FROM viewport_seen').all());
  assert.ok(!stored.includes(input.eventId));assert.ok(!stored.includes('192.0.2.1'));assert.ok(!stored.includes('secret-session'));assert.ok(!stored.includes('Mozilla'));
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM viewport_seen').get().n,1);db.close();
  time+=86400001;assert.equal(metrics.receive(input,meta).duplicate,undefined);assert.equal(metrics.report().total,2);
  time+=91*86400000;assert.equal(metrics.report(90).total,0);
});
test('统计限频与身份登录无关，上限事件不生成伪造尺寸行',t=>{
  let metrics;const dir=temporary(t,()=>metrics?.close());metrics=createViewportMetrics({dataDir:dir,enabled:true});
  for(let n=0;n<120;n++)assert.equal(metrics.receive(event(),{source:'one-source'}).accepted,true);
  assert.equal(metrics.receive(event(),{source:'one-source'}).limited,true);
  assert.equal(metrics.receive({v:1,eventId:crypto.randomUUID(),pageKind:'home',reason:'capped'},{source:'another-source'}).accepted,true);
  const report=metrics.report();assert.equal(report.total,120);assert.equal(report.quality.capped,1);assert.equal(report.quality.limited,1);
});
test('覆盖率保留未知与未测分母，证据须匹配完整环境及构建，缺数据不显示0%',t=>{
  let metrics;const dir=temporary(t,()=>metrics?.close()),now=Date.parse('2026-10-22T10:00:00Z');
  metrics=createViewportMetrics({dataDir:dir,enabled:true,buildVersion:'build-A',now:()=>now});
  metrics.receive(event(),{audience:'student',source:'one',userAgent:'Mozilla/5.0 (Linux; Android 14; Mobile) Chrome/130'});
  metrics.receive(event(),{audience:'student',source:'two',userAgent:'unrecognized'});
  const rows=metrics.report().rows;
  const evidence={version:1,status:'passed',validatedAt:new Date(now).toISOString(),contexts:rows.filter(row=>row.platformGroup==='mobile').map(({count,...context})=>context)};
  assert.equal(summarizeCoverage(rows,evidence,now).percent,50);
  assert.equal(summarizeCoverage(rows,{...evidence,contexts:evidence.contexts.map(c=>({...c,buildVersion:'build-B'}))},now).percent,0);
  assert.equal(summarizeCoverage(rows,null,now).percent,null);
  assert.equal(summarizeCoverage([],evidence,now).percent,null);
  assert.equal(summarizeCoverage(rows,{...evidence,validatedAt:'2025-01-01'},now).status,'invalid-or-expired-evidence');
  fs.writeFileSync(path.join(dir,'viewport-validation.json'),JSON.stringify(evidence));
  assert.equal(metrics.report().coverage.percent,50);
  assert.equal(metrics.report().candidates.length,2);
});
test('不同尺寸的每日基数有上限，不让任意报告无限扩张统计库',t=>{
  let metrics;const dir=temporary(t,()=>metrics?.close());
  metrics=createViewportMetrics({dataDir:dir,enabled:true,contextLimit:2});
  assert.equal(metrics.receive(event({layoutWidth:390})).accepted,true);
  assert.equal(metrics.receive(event({layoutWidth:391})).accepted,true);
  assert.equal(metrics.receive(event({layoutWidth:392})).limited,true);
  assert.equal(metrics.report().total,2);
  assert.equal(metrics.receive(event({layoutWidth:390})).accepted,true);
  assert.equal(metrics.report().total,3);
});
