import React from 'react';
const BASE = document.querySelector('meta[name="award-base"]').content;
const dateLabel = value => value ? new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value)).replaceAll('/','.') : null;
export const legacyPapers = (archives = []) => archives.filter(archive=>archive.kind==='legacy-paper');
export function HistoricalCertificates({archives=[]}){
  const papers=legacyPapers(archives);
  if(!papers.length)return null;
  return <section className="historical-certificates" id="historicalCertificates" aria-labelledby="historicalCertificateTitle"><h2 id="historicalCertificateTitle">已获得的原证书</h2><p>保留15星体系的原证书，原姓名、内容与领取日期不变。</p><ul>{papers.map(archive=><li key={archive.id}><div><strong>{archive.meta?.lesson||'Lesson '+archive.course.slice(4).replace('-','–')}</strong><span>15星原版通关证书</span><small>{archive.name||'原领证姓名'} · {dateLabel(archive.issuedAt)}</small></div><a className="button" href={BASE+'awards/history/'+encodeURIComponent(archive.id)+'/'}>查看原证书</a></li>)}</ul></section>;
}
export function LocalCertificateCopies({copies=[],available=[]}){
  if(!copies.length)return null;
  return <section className="historical-certificates" aria-labelledby="localCertificateTitle"><h2 id="localCertificateTitle">这台设备保留的旧证资料</h2><p>这些资料尚未确认入册。只读查看或下载保留副本，不增加新版星数。</p><ul>{copies.map(copy=><li key={copy.id}><div><strong>{'Lesson '+copy.course.slice(4).replace('-','–')}</strong><span>{copy.kind==='legacy-paper'?'原版证书资料':'五星纪念卡资料'}</span><small>{copy.name||'原领证姓名'} · {dateLabel(copy.issuedAt)}</small>{!available.includes(copy.course)&&<small>本课当前未开放在线查看，资料仍保留在本机，可下载副本请老师协助恢复。</small>}</div><div className="local-certificate-actions">{available.includes(copy.course)&&<a className="button" href={BASE+'awards/local-history/'+copy.course+'/'+copy.kind+'/'+copy.id+'/'}>查看本机原证</a>}<button className="button" onClick={()=>window.CanranLocalCertificates.download(copy)}>下载保留副本</button></div></li>)}</ul></section>;
}
