(function(){
'use strict';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const states={'not-started':'未开始','in-progress':'学习中',completed:'已完成'};
const stateBadge=status=>Object.hasOwn(states,status)?`<span class="learning-state learning-state--${status}">${states[status]}</span>`:'<span class="muted">暂无开放课程</span>';
const starCount=stars=>`<span class="learning-stars" aria-label="已获得 ${stars} 颗星"><span aria-hidden="true">★</span> ${stars}</span>`;
const rewards=rows=>rows.length?rows.map(row=>starCount(row.stars)+(rows.length>1?`<small>每课 ${row.maxStarsPerCourse} 星的课程</small>`:'')).join(''):'—';
const syncNote=()=>'<p class="learning-sync">以已同步的学习记录为准，离线学习联网后更新。</p>';
let config,route={},serial=0,active=false;
function cleanRoute(input){
 const result={};
 for(const key of ['classId','course','q','status','page','student'])if(input[key])result[key]=input[key];
 if(!Object.hasOwn(states,result.status))delete result.status;
 return result;
}
const readRoute=()=>cleanRoute(Object.fromEntries(new URLSearchParams(location.hash.split('?')[1]||'')));
function address(){return '#learning?'+new URLSearchParams(Object.entries(route).filter(([,v])=>v!==''&&v!==undefined));}
function navigate(changes){route=cleanRoute({...route,...changes});history.pushState(null,'',address());return render();}
function button(id,action){document.getElementById(id)?.addEventListener('click',action);}
function top(title,subtitle=''){
 return `<div class="toolbar learning-toolbar"><div><h1 tabindex="-1">${e(title)}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div><div class="actions"><button id="learningBack" class="compact">${route.student?'返回列表':'返回班级管理'}</button><button id="learningRefresh" class="compact">刷新记录</button></div></div>`;
}
function bindTop(){
 button('learningBack',()=>{if(route.student)navigate({student:''});else{active=false;serial++;config.back();}});
 button('learningRefresh',render);
}
function option(value,label,selected){return `<option value="${e(value)}" ${String(selected||'')===String(value)?'selected':''}>${e(label)}</option>`;}
function listFilters(data){
 return `<form id="learningFilters" class="learning-filters">
 <label>班级<select name="classId">${option('','所有班级',route.classId)}${data.classes.map(c=>option(c.id,c.name,route.classId)).join('')}</select></label>
 <label>课程<select name="course">${option('','全部开放课程',route.course)}${data.courses.map(c=>option(c.id,c.label+' '+c.title,route.course)).join('')}</select></label>
 <label>姓名或学号<input type="search" name="q" maxlength="100" value="${e(route.q)}" placeholder="查找学生"></label>
 <label>学习情况<select name="status">${option('','全部情况',route.status)}${Object.entries(states).map(([value,label])=>option(value,label,route.status)).join('')}</select></label>
 <button class="primary" type="submit">查询</button></form>`;
}
function overview(data){
 const rows=data.rows.map(row=>`<tr data-learning-student="${e(row.student.id)}">
 <td data-label="学生"><button class="learning-student-link" data-open-student="${e(row.student.id)}" aria-label="查看${e(row.student.name)}的学习情况，学号 ${e(row.student.studentNumber)}">${e(row.student.name)}</button><span class="student-number">${e(row.student.studentNumber)}</span>${route.classId&&row.student.active?'':`<small>${[!route.classId&&row.student.className,!row.student.active&&'已停用'].filter(Boolean).map(e).join(' · ')}</small>`}</td>
 <td data-label="学习情况">${stateBadge(row.summary.status)}</td><td data-label="星星">${rewards(row.summary.rewards)}</td></tr>`).join('');
 config.app.innerHTML=top('学习进度')+listFilters(data)+`<div class="learning-list-heading"><h2>学生</h2><p>共 ${data.total} 人</p></div>
 <section class="panel learning-table-wrap"><table class="learning-table"><thead><tr><th scope="col">学生</th><th scope="col">学习情况</th><th scope="col">星星</th></tr></thead><tbody>${rows}</tbody></table>${rows?'':'<div class="empty"><h3>没有符合条件的学生</h3><p>可以更换班级、课程或筛选条件。</p></div>'}</section>
 ${data.total>data.pageSize?`<nav class="learning-pagination" aria-label="学生列表翻页"><button class="compact" id="learningPrev" ${data.page===1?'disabled':''}>上一页</button><span>第 ${data.page} / ${Math.ceil(data.total/data.pageSize)} 页</span><button class="compact" id="learningNext" ${data.page*data.pageSize>=data.total?'disabled':''}>下一页</button></nav>`:''}`+syncNote();
 bindTop();
 document.getElementById('learningFilters').onsubmit=event=>{event.preventDefault();navigate({...Object.fromEntries(new FormData(event.target)),page:'1'});};
 button('learningPrev',()=>navigate({page:String(data.page-1)}));button('learningNext',()=>navigate({page:String(data.page+1)}));
 config.app.querySelectorAll('[data-open-student]').forEach(b=>b.onclick=()=>navigate({student:b.dataset.openStudent}));
}
function courseTable(courses){
 return `<div class="panel learning-table-wrap"><table class="learning-table learning-course-table"><thead><tr><th scope="col">课程</th><th scope="col">学习情况</th><th scope="col">星星</th></tr></thead><tbody>${courses.map(c=>`<tr data-learning-course="${e(c.id)}"><td><small>${e(c.label)}</small><strong>${e(c.title)}</strong></td><td>${stateBadge(c.status)}</td><td>${starCount(c.stars)}</td></tr>`).join('')}</tbody></table></div>`;
}
function student(view){
 const s=view.student,open=view.courses.filter(c=>c.open),history=view.courses.filter(c=>!c.open);
 config.app.innerHTML=top(s.name+'的学习情况',`${e(s.className)} · <span class="student-number">${e(s.studentNumber)}</span>${s.active?'':' · 已停用'}`)+
 `<h2 class="learning-section-title">当前开放课程</h2>${open.length?courseTable(open):'<section class="panel empty"><p>这个班级暂未开放课程。</p></section>'}`+
 (history.length?`<details class="learning-closed"><summary>历史课程（${history.length} 门）</summary>${courseTable(history)}</details>`:'')+syncNote();
 bindTop();
}
async function render(){
 const ticket=++serial;active=true;
 config.app.setAttribute('aria-busy','true');
 history.replaceState(null,'',address());
 const refresh=document.getElementById('learningRefresh');if(refresh)refresh.disabled=true;
 try{
  const endpoint=route.student?'admin/students/'+encodeURIComponent(route.student)+'/learning':'admin/learning?'+new URLSearchParams({...route,active:'all'});
  const result=await config.api(endpoint);if(ticket!==serial||!active)return;
  if(route.student)student(result);else{route.page=String(result.page);history.replaceState(null,'',address());overview(result);}
 }catch(error){
  if(ticket!==serial||!active)return;
  config.app.innerHTML=top('暂时无法读取学习记录')+'<section class="panel"><p id="learningError" role="alert"></p><button id="learningRetry">重试</button></section>';
  document.getElementById('learningError').textContent=error.message||'请检查网络后重试';bindTop();button('learningRetry',render);
 }finally{if(ticket===serial){config.app.removeAttribute('aria-busy');const refresh=document.getElementById('learningRefresh');if(refresh)refresh.disabled=false;}}
}
window.addEventListener('popstate',()=>{if(!config)return;if(location.hash.startsWith('#learning')){route=readRoute();render();}else if(active){active=false;serial++;config.back();}});
window.CanranAdminLearning={async open(options){
 config=options;
 const existing=location.hash.startsWith('#learning');
 route=existing?readRoute():cleanRoute({classId:options.classId,page:'1'});
 if(options.studentId)route.student=options.studentId;
 history[existing?'replaceState':'pushState'](null,'',address());await render();
}};
})();
