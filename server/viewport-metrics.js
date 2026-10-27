'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const DAY=86400000;
const dayFormat=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'});
const dayOf=now=>dayFormat.format(new Date(now));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const pageKinds=['login','home','album','lesson','admin','other'];
const reasons=['initial','layout-change','visual-change','capped'];
const fields=['v','eventId','pageKind','reason','layoutWidth','layoutHeight','clientWidth','visualWidth','visualHeight','visualScale','dpr'];
const contextFields=['pageKind','audience','buildVersion','browserFamily','engineHint','platformGroup','reason','layoutWidth','layoutHeight','clientWidth','visualWidth','visualHeight','visualScale','dprBucket','orientation'];
const bad=()=>Object.assign(Error('尺寸报告格式不正确'),{status:400});
function normalizeEvent(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(key=>!fields.includes(key)))throw bad();
  if(input.v!==1||typeof input.eventId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.eventId)||!pageKinds.includes(input.pageKind)||!reasons.includes(input.reason))throw bad();
  const result={eventId:input.eventId.toLowerCase(),pageKind:input.pageKind,reason:input.reason};
  if(input.reason==='capped')return result;
  for(const key of ['layoutWidth','layoutHeight','clientWidth']){
    if(!Number.isSafeInteger(input[key])||input[key]<1||input[key]>16384)throw bad();
    result[key]=input[key];
  }
  if(result.clientWidth>result.layoutWidth)throw bad();
  const absent=input.visualWidth===null&&input.visualHeight===null&&input.visualScale===null;
  if(!absent){
    for(const key of ['visualWidth','visualHeight'])if(!Number.isSafeInteger(input[key])||input[key]<1||input[key]>16384)throw bad();
    if(!Number.isFinite(input.visualScale)||input.visualScale<.1||input.visualScale>10)throw bad();
  }
  if(!Number.isFinite(input.dpr)||input.dpr<.25||input.dpr>10)throw bad();
  result.visualWidth=input.visualWidth;result.visualHeight=input.visualHeight;
  result.visualScale=absent?null:Math.round(input.visualScale*100)/100;
  const bucket=[1,1.25,1.5,2,3,4].find(value=>Math.abs(value-input.dpr)<.05);
  result.dprBucket=bucket===undefined?'other':String(bucket);
  result.orientation=result.layoutWidth>=result.layoutHeight?'landscape':'portrait';
  return result;
}
function classifyClient(userAgent=''){
  const ua=String(userAgent).slice(0,1024);
  const ios=/iPhone|iPad|iPod/.test(ua),android=/Android/.test(ua);
  const browserFamily=/MicroMessenger\//.test(ua)?'wechat':/Edg(?:A|iOS)?\//.test(ua)?'edge':/CriOS\//.test(ua)?'chrome-ios':/Chrome\//.test(ua)?'chrome':/FxiOS\//.test(ua)?'firefox-ios':/Firefox\//.test(ua)?'firefox':/Version\/.*Safari\//.test(ua)?'safari':'unknown';
  const engineHint=ios?'webkit-inferred':/Chrome\/|Edg\//.test(ua)?'blink-inferred':/Firefox\//.test(ua)?'gecko-inferred':browserFamily==='safari'?'webkit-inferred':'unknown';
  // A desktop-style iPad UA cannot reliably be separated from a Mac here.
  const platformGroup=/iPad/.test(ua)?'tablet':/iPhone|iPod/.test(ua)?'mobile':android?(/Mobile/.test(ua)?'mobile':'tablet'):/Windows NT|X11/.test(ua)?'desktop':'unknown';
  return{browserFamily,engineHint,platformGroup};
}
function contextKey(context){return JSON.stringify(contextFields.map(key=>context[key]));}
function summarizeCoverage(rows,evidence,now=Date.now()){
  const visits=rows.reduce((sum,row)=>sum+row.count,0);
  if(!visits)return{status:'pending-data',percent:null,target:95,visits:0,covered:0};
  if(!evidence)return{status:'pending-evidence',percent:null,target:95,visits,covered:null};
  if(evidence.version!==1||evidence.status!=='passed'||!Array.isArray(evidence.contexts)||!Number.isFinite(Date.parse(evidence.validatedAt))||Date.parse(evidence.validatedAt)>now||now-Date.parse(evidence.validatedAt)>30*DAY){
    return{status:'invalid-or-expired-evidence',percent:null,target:95,visits,covered:null};
  }
  // Exact browser family, dimensions, page scope and build must match.
  // An engine hint or a width interval alone is never verification evidence.
  const verified=new Set(evidence.contexts.filter(c=>contextFields.every(key=>Object.hasOwn(c,key))&&c.browserFamily!=='unknown'&&c.platformGroup!=='unknown'&&c.buildVersion!=='unversioned').map(contextKey));
  const covered=rows.reduce((sum,row)=>sum+(verified.has(contextKey(row))?row.count:0),0);
  return{status:'measured-sample',percent:Math.round(covered/visits*10000)/100,target:95,visits,covered,validatedAt:evidence.validatedAt};
}
function createViewportMetrics({dataDir,enabled=false,buildVersion='unversioned',now=Date.now,contextLimit=5000}={}){
  if(typeof enabled!=='boolean'||typeof buildVersion!=='string'||!/^[\w.-]{1,80}$/.test(buildVersion))throw Error('Invalid viewport metrics configuration');
  if(!Number.isSafeInteger(contextLimit)||contextLimit<1||contextLimit>100000)throw Error('Invalid viewport context limit');
  let db=null,lastClean='',closed=false,dropped=0,pendingLimited=0,dailyKeys=new Set(),globalBudget={start:now(),count:0};
  const limits=new Map(),secret=crypto.randomBytes(32);
  if(enabled){
    fs.mkdirSync(dataDir,{recursive:true});
    db=new DatabaseSync(path.join(dataDir,'viewport-metrics.sqlite'));
    db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5; CREATE TABLE IF NOT EXISTS viewport_daily(day TEXT NOT NULL, key TEXT NOT NULL, context TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(day,key)); CREATE TABLE IF NOT EXISTS viewport_quality(day TEXT NOT NULL, kind TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(day,kind)); CREATE TABLE IF NOT EXISTS viewport_seen(token TEXT PRIMARY KEY, expires INTEGER NOT NULL); CREATE INDEX IF NOT EXISTS viewport_seen_expires ON viewport_seen(expires);');
  }
  const quality=(kind,count=1)=>{if(db)db.prepare('INSERT INTO viewport_quality VALUES(?,?,?) ON CONFLICT(day,kind) DO UPDATE SET count=count+excluded.count').run(dayOf(now()),kind,count);};
  function flushLimited(){if(pendingLimited&&db){const count=pendingLimited;quality('received',count);quality('limited',count);pendingLimited=0;}}
  function clean(){
    if(!db)return;
    db.prepare('DELETE FROM viewport_seen WHERE expires<=?').run(now());
    if(lastClean===dayOf(now()))return;
    db.prepare('DELETE FROM viewport_daily WHERE day<?').run(dayOf(now()-89*DAY));
    db.prepare('DELETE FROM viewport_quality WHERE day<?').run(dayOf(now()-89*DAY));
    lastClean=dayOf(now());
    dailyKeys=new Set(db.prepare('SELECT key FROM viewport_daily WHERE day=?').all(lastClean).map(row=>row.key));
  }
  function limited(source){
    const time=now(),key=crypto.createHmac('sha256',secret).update(String(source)).digest('hex');
    if(time-globalBudget.start>=60000)globalBudget={start:time,count:0};
    if(++globalBudget.count>1200)return true;
    for(const [id,value] of limits)if(time-value.start>=60000)limits.delete(id);
    if(!limits.has(key)&&limits.size>=5000)return true;
    const entry=limits.get(key)||{start:time,count:0};entry.count++;limits.set(key,entry);
    return entry.count>120;
  }
  function receive(input,{userAgent='',audience='anonymous',source='unknown'}={}){
    if(!enabled||closed)return{accepted:false,disabled:true};
    try{
      if(limited(source)){pendingLimited++;return{accepted:false,limited:true};}
      clean();quality('received');
      let value;try{value=normalizeEvent(input);}catch(error){quality('invalid');throw error;}
      if(!['student','staff','anonymous'].includes(audience))throw bad();
      const token=hash(value.eventId);
      db.exec('BEGIN IMMEDIATE');
      try{
        const seen=db.prepare('INSERT INTO viewport_seen VALUES(?,?) ON CONFLICT(token) DO NOTHING').run(token,now()+DAY);
        if(!seen.changes){quality('duplicate');db.exec('COMMIT');return{accepted:true,duplicate:true};}
        if(value.reason==='capped'){quality('capped');db.exec('COMMIT');return{accepted:true};}
        const {eventId,...dimensions}=value;
        const context={...dimensions,audience,buildVersion,...classifyClient(userAgent)};
        const serialized=JSON.stringify(context);
        const key=hash(contextKey(context));
        if(!dailyKeys.has(key)&&dailyKeys.size>=contextLimit){db.prepare('DELETE FROM viewport_seen WHERE token=?').run(token);quality('limited');db.exec('COMMIT');return{accepted:false,limited:true};}
        db.prepare('INSERT INTO viewport_daily VALUES(?,?,?,1) ON CONFLICT(day,key) DO UPDATE SET count=count+1').run(dayOf(now()),key,serialized);
        quality('accepted');db.exec('COMMIT');dailyKeys.add(key);return{accepted:true};
      }catch(error){try{db.exec('ROLLBACK');}catch{}throw error;}
    }catch(error){
      if(error.status)throw error;
      dropped++;return{accepted:false,dropped:true};
    }
  }
  function report(days=30){
    if(![7,30,90].includes(days))throw Object.assign(Error('请选择 7、30 或 90 天'),{status:400});
    const window={from:dayOf(now()-(days-1)*DAY),to:dayOf(now()),days,timeZone:'Asia/Shanghai'};
    if(!db)return{enabled:false,buildVersion,window,total:0,rows:[],quality:{},coverage:summarizeCoverage([],null,now()),devices:[],candidates:[]};
    flushLimited();clean();
    const rows=db.prepare('SELECT context,SUM(count) AS count FROM viewport_daily WHERE day>=? GROUP BY key ORDER BY count DESC').all(window.from).map(row=>({...JSON.parse(row.context),count:Number(row.count)}));
    const counts=Object.fromEntries(db.prepare('SELECT kind,SUM(count) AS count FROM viewport_quality WHERE day>=? GROUP BY kind').all(window.from).map(row=>[row.kind,Number(row.count)]));
    let evidence=null;try{evidence=JSON.parse(fs.readFileSync(path.join(dataDir,'viewport-validation.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')evidence={};}
    const home=rows.filter(row=>row.audience==='student'&&row.pageKind==='home'&&row.reason!=='visual-change');
    const candidates=home.map(({count,...context})=>({context,count,needsVerification:true}));
    return{enabled:true,buildVersion,window,total:rows.reduce((n,r)=>n+r.count,0),rows,quality:{...counts,droppedSinceStart:dropped},
      coverage:summarizeCoverage(home,evidence,now()),
      initialCoverage:summarizeCoverage(home.filter(row=>row.reason==='initial'),evidence,now()),
      visualCoverage:summarizeCoverage(rows.filter(row=>row.audience==='student'&&row.pageKind==='home'&&row.reason==='visual-change'),evidence,now()),
      devices:['mobile','tablet','desktop','unknown'].map(platform=>({platform,...summarizeCoverage(home.filter(row=>row.platformGroup===platform),evidence,now())})),candidates};
  }
  const cleanup=enabled?setInterval(()=>{try{flushLimited();clean();}catch{dropped++;}},60000):null;cleanup?.unref();
  return{enabled,buildVersion,receive,report,reject(kind){try{quality(kind);}catch{dropped++;}},close(){closed=true;clearInterval(cleanup);limits.clear();try{flushLimited();}catch{}db?.close();db=null;}};
}
module.exports={createViewportMetrics,normalizeEvent,classifyClient,summarizeCoverage,contextFields};
