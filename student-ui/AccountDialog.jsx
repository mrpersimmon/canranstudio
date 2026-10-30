import React,{useMemo,useState} from 'react';
import {Key,SignOut,Archive,BookOpen,ArrowRight,ArrowLeft} from '@phosphor-icons/react';
import shell from '../server/public/student-shell';
import legacy from './legacy-records';
import {StudentDialog} from './Dialog';
import {useKeepsakeMotion} from './keepsake-motion';

export function AccountDialog({student,base,view='profile',onViewChange,onClose,onHistory}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),motion=useKeepsakeMotion();
 const rows=useMemo(()=>{if(view!=='legacy')return [];try{return legacy.readLegacyRecords(window.localStorage);}catch{return [];}},[view]);
 return <StudentDialog label={view==='legacy'?'本机旧记录':'我的'} onClose={onClose}>
  {view==='legacy'?<>
   <button type="button" className="student-account-back" onClick={()=>onViewChange('profile')}><ArrowLeft size={20} aria-hidden="true"/>返回我的</button>
   <p className="student-account-note">这些记录来自使用学生账号之前，仅供查看，不计入当前学生的成绩。</p>
   <ul className="student-legacy-records" id="legacy">{rows.map(row=><li key={row.key}><strong>{row.label}</strong><span>{row.summary}</span></li>)}</ul>
   {!rows.length&&<p className="student-account-note">这台设备没有旧记录。</p>}
  </>:<>
   <p className="student-account-name">{student.name}</p><p className="student-account-number">{student.studentNumber}</p>
   <a className="student-account-row" href={base+'?account=password'}><Key size={23} aria-hidden="true"/><span>修改密码</span><ArrowRight size={20} aria-hidden="true"/></a>
   <button type="button" className="student-account-row" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await shell.signOut(base);}catch{setBusy(false);setError('暂时无法退出，请再试一次。');}}}><SignOut size={23} aria-hidden="true"/><span>退出登录</span></button>
   {error&&<p className="student-account-note" role="alert">{error}</p>}
   <button type="button" className="student-account-row" onClick={onHistory||(()=>location.assign(base+'awards/?view=history'))}><Archive size={23} aria-hidden="true"/><span>历史收藏</span><ArrowRight size={20} aria-hidden="true"/></button>
   <button type="button" className="student-account-row" onClick={()=>onViewChange('legacy')}><BookOpen size={23} aria-hidden="true"/><span>本机旧记录</span><ArrowRight size={20} aria-hidden="true"/></button>
   <div className="student-account-motion"><span>纪念册动效</span><button type="button" role="switch" className="student-account-switch" aria-label="纪念册动效" aria-checked={motion.enabled} onClick={motion.toggle}>{motion.enabled?'已开启':'已关闭'}</button></div>
  </>}
 </StudentDialog>;
}
