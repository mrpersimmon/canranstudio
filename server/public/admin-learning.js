(function(){
'use strict';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const states={'not-started':'未开始','in-progress':'学习中',completed:'已完成'};
const sorts={'stars-asc':'星星从少到多','stars-desc':'星星从多到少'};
const icons={
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 filter:'<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
 sort:'<path class="sort-up" d="m8 9 4-4 4 4"/><path class="sort-down" d="m8 15 4 4 4-4"/>',
 close:'<path d="m7 7 10 10M17 7 7 17"/>'
};
const icon=name=>`<svg class="learning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const stateBadge=status=>Object.hasOwn(states,status)?`<span class="learning-state learning-state--${status}">${states[status]}</span>`:'<span class="muted">暂无开放课程</span>';
const starCount=stars=>`<span class="learning-stars" aria-label="已获得 ${stars} 颗星"><span aria-hidden="true">★</span> ${stars}</span>`;
const rewards=rows=>rows.length?rows.map(row=>starCount(row.stars)+(rows.length>1?`<small>每课 ${row.maxStarsPerCourse} 星的课程</small>`:'')).join(''):'—';
const syncNote=()=>'<p class="learning-sync">最近学习按学习记录同步时间显示（北京时间），离线学习联网后更新。</p>';
const dateFormatter=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const dateParts=time=>Object.fromEntries(dateFormatter.formatToParts(time).map(p=>[p.type,p.value]));
function learnedTime(value,status){
 if(!Number.isFinite(value)||value<=0)return `<span class="learning-time-empty">${status&&status!=='not-started'?'未记录':'暂无学习记录'}</span>`;
 const d=dateParts(value),today=dateParts(Date.now()),day=`${d.year}-${d.month}-${d.day}`,todayKey=`${today.year}-${today.month}-${today.day}`;
 const label=day===todayKey?'今天':`${d.year===today.year?'':d.year+'-'}${d.month}-${d.day}`;
 const clock=`${d.hour}:${d.minute}`,full=`${day} ${clock}（北京时间；学习记录同步时间）`;
 return `<time class="learning-time" datetime="${new Date(value).toISOString()}" title="${full}" aria-label="${full}"><span>${label}</span><span>${clock}</span></time>`;
}
let config,route={},serial=0,active=false;
function cleanRoute(input){
 const result={};
 for(const key of ['classId','course','q','sort','page','student'])if(input[key])result[key]=input[key];
 const selected=String(input.status||'').split(',');
 const status=Object.keys(states).filter(value=>selected.includes(value)).join(',');
 if(status)result.status=status;
 if(!Object.hasOwn(sorts,result.sort))delete result.sort;
 return result;
}
const readRoute=()=>{
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 return cleanRoute({...Object.fromEntries(params),status:params.getAll('status').join(',')});
};
function address(){return '#learning?'+new URLSearchParams(Object.entries(route).filter(([,v])=>v!==''&&v!==undefined));}
function navigate(changes,focusId){route=cleanRoute({...route,...changes});history.pushState(null,'',address());return render(focusId);}
function button(id,action){document.getElementById(id)?.addEventListener('click',action);}
function top(title,subtitle=''){
 return `<div class="toolbar learning-toolbar"><div><h1 tabindex="-1">${e(title)}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div><div class="actions"><button id="learningBack" class="compact">${route.student?'返回列表':'返回班级管理'}</button><button id="learningRefresh" class="compact">刷新记录</button></div></div>`;
}
function bindTop(){
 button('learningBack',()=>{if(route.student)navigate({student:''});else{active=false;serial++;config.back();}});
 button('learningRefresh',()=>render('learningRefresh'));
}
function option(value,label,selected){return `<option value="${e(value)}" ${String(selected||'')===String(value)?'selected':''}>${e(label)}</option>`;}
function scopeFilters(data){
 return `<div class="learning-scope">
 <label for="learningClass">班级<select id="learningClass" name="classId">${option('',config.role==='teacher'?'我负责的班级':'所有班级',route.classId)}${data.classes.map(c=>option(c.id,c.name,route.classId)).join('')}</select></label>
 <label for="learningCourse">课程<select id="learningCourse" name="course">${option('','全部开放课程',route.course)}${data.courses.map(c=>option(c.id,c.label+' '+c.title,route.course)).join('')}</select></label></div>`;
}
function filterTrigger(id,label,kind,selected){
 return `<button type="button" class="learning-column-action ${selected?'is-filtered':''}" id="${id}" popovertarget="${id}Panel" aria-expanded="false" aria-controls="${id}Panel" aria-label="${label}筛选${selected?'，已启用':''}" title="${label==='学生'?'按姓名或学号筛选':'选择一种或多种学习情况'}"><span>${label}</span>${icon(kind)}</button>`;
}
function filterPopovers(){
 return `<div id="learningStudentFilterPanel" class="learning-filter-popover" popover="auto" role="dialog" aria-labelledby="learningStudentFilterTitle">
 <form id="learningStudentForm"><h2 id="learningStudentFilterTitle">查找学生</h2><label for="learningStudentQuery">姓名或学号</label><input type="search" id="learningStudentQuery" name="q" maxlength="100" placeholder="输入姓名或学号" value="${e(route.q)}" autocomplete="off" autofocus>
 <div class="learning-filter-actions"><button type="button" data-clear="q">重置</button><button type="submit" class="primary">应用</button></div></form></div>
 <div id="learningStatusFilterPanel" class="learning-filter-popover" popover="auto" role="dialog" aria-labelledby="learningStatusFilterTitle">
 <form id="learningStatusForm"><h2 id="learningStatusFilterTitle">学习情况</h2><p id="learningStatusHint">可多选，不选时显示全部</p><div class="learning-status-options" role="group" aria-describedby="learningStatusHint">${Object.entries(states).map(([value,label])=>`<label><input type="checkbox" name="status" value="${value}" ${(route.status||'').split(',').includes(value)?'checked':''}>${stateBadge(value)}</label>`).join('')}</div>
 <div class="learning-filter-actions"><button type="button" data-clear="status">重置</button><button type="submit" class="primary">应用</button></div></form></div>`;
}
function appliedFilters(){
 const chips=[route.q&&['q','学生：'+route.q],route.status&&['status',route.status.split(',').map(s=>states[s]).join('、')],route.sort&&['sort',sorts[route.sort]]].filter(Boolean);
 return chips.length?`<div class="learning-applied" aria-label="当前查询条件">${chips.map(([key,label])=>`<button type="button" class="learning-filter-chip" data-clear="${key}" aria-label="清除${key==='q'?'学生':key==='status'?'学习情况':'星星排序'}筛选"><span>${e(label)}</span>${icon('close')}</button>`).join('')}<button type="button" class="learning-clear" id="learningClearAll">清除筛选</button></div>`:'';
}
function positionPopover(panel){
 const trigger=document.getElementById(panel.id.replace('Panel',''));if(!trigger)return;
 const anchor=trigger.getBoundingClientRect(),width=panel.offsetWidth||280,height=panel.offsetHeight||260,gap=8,edge=12;
 const left=Math.max(edge,Math.min(anchor.left,innerWidth-width-edge));
 const top=anchor.bottom+gap+height<=innerHeight-edge?anchor.bottom+gap:Math.max(edge,anchor.top-height-gap);
 panel.style.left=left+'px';panel.style.top=top+'px';
}
function bindFilters(){
 for(const id of ['learningClass','learningCourse'])document.getElementById(id).onchange=event=>navigate({[event.target.name]:event.target.value,page:'1'},id);
 for(const id of ['learningStudentFilter','learningStatusFilter']){
  const trigger=document.getElementById(id),panel=document.getElementById(id+'Panel');
  panel.addEventListener('beforetoggle',event=>{
   if(event.newState!=='open')return;
   if(id==='learningStudentFilter')panel.querySelector('input').value=route.q||'';
   else panel.querySelectorAll('input').forEach(input=>input.checked=(route.status||'').split(',').includes(input.value));
   positionPopover(panel);
  });
  panel.addEventListener('toggle',event=>{
   trigger.setAttribute('aria-expanded',String(event.newState==='open'));
   if(event.newState==='open'){positionPopover(panel);panel.querySelector('input').focus();}
  });
 }
 document.getElementById('learningStudentForm').onsubmit=event=>{event.preventDefault();navigate({q:new FormData(event.target).get('q').trim(),page:'1'},'learningStudentFilter');};
 document.getElementById('learningStatusForm').onsubmit=event=>{event.preventDefault();navigate({status:new FormData(event.target).getAll('status').join(','),page:'1'},'learningStatusFilter');};
 config.app.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>navigate({[b.dataset.clear]:'',page:'1'},b.dataset.clear==='q'?'learningStudentFilter':b.dataset.clear==='status'?'learningStatusFilter':'learningSort'));
 button('learningClearAll',()=>navigate({q:'',status:'',sort:'',page:'1'},'learningStudentFilter'));
 button('learningSort',()=>navigate({sort:route.sort==='stars-desc'?'stars-asc':route.sort==='stars-asc'?'':'stars-desc',page:'1'},'learningSort'));
}
function overview(data){
 const rows=data.rows.map(row=>`<tr data-learning-student="${e(row.student.id)}">
 <td data-label="学生"><button class="learning-student-link" data-open-student="${e(row.student.id)}" aria-label="查看${e(row.student.name)}的学习情况，学号 ${e(row.student.studentNumber)}">${e(row.student.name)}</button><span class="student-number">${e(row.student.studentNumber)}</span>${route.classId&&row.student.active?'':`<small>${[!route.classId&&row.student.className,!row.student.active&&'已停用'].filter(Boolean).map(e).join(' · ')}</small>`}</td>
 <td data-label="学习情况">${stateBadge(row.summary.status)}</td><td data-label="星星">${rewards(row.summary.rewards)}</td><td class="learning-time-cell" data-label="最近学习">${learnedTime(row.summary.lastLearnedAt,row.summary.status)}</td></tr>`).join('');
 const current=route.sort?sorts[route.sort]:'按学号',next=route.sort==='stars-desc'?'从少到多':route.sort==='stars-asc'?'按学号':'从多到少';
 config.app.innerHTML=top('学习进度')+scopeFilters(data)+`<div class="learning-list-heading"><h2>学生名单 <span>${data.total} 人</span></h2><span class="learning-result-note" role="status">${route.q||route.status?'已筛选':''}</span></div>`+appliedFilters()+
 `<section class="panel learning-table-wrap"><table class="learning-table"><thead><tr>
 <th scope="col">${filterTrigger('learningStudentFilter','学生','search',route.q)}</th><th scope="col">${filterTrigger('learningStatusFilter','学习情况','filter',route.status)}</th>
 <th scope="col" aria-sort="${route.sort==='stars-asc'?'ascending':route.sort==='stars-desc'?'descending':'none'}"><button type="button" id="learningSort" class="learning-column-action learning-sort ${route.sort||''}" aria-label="星星，当前${current}，点击改为${next}" title="点击切换：从多到少、从少到多、按学号"><span>星星</span>${icon('sort')}</button></th><th scope="col" class="learning-time-heading">最近学习</th></tr></thead><tbody>${rows}</tbody></table>${rows?'':'<div class="empty"><h3>没有符合条件的学生</h3><p>可以更换班级、课程或清除筛选。</p></div>'}</section>`+filterPopovers()+
 `${data.total>data.pageSize?`<nav class="learning-pagination" aria-label="学生列表翻页"><button class="compact" id="learningPrev" ${data.page===1?'disabled':''}>上一页</button><span>第 ${data.page} / ${Math.ceil(data.total/data.pageSize)} 页</span><button class="compact" id="learningNext" ${data.page*data.pageSize>=data.total?'disabled':''}>下一页</button></nav>`:''}`+syncNote();
 bindTop();bindFilters();
 button('learningPrev',()=>navigate({page:String(data.page-1)},'learningPrev'));button('learningNext',()=>navigate({page:String(data.page+1)},'learningNext'));
 config.app.querySelectorAll('[data-open-student]').forEach(b=>b.onclick=()=>navigate({student:b.dataset.openStudent}));
}
function courseTable(courses){
 return `<div class="panel learning-table-wrap"><table class="learning-table learning-course-table"><thead><tr><th scope="col">课程</th><th scope="col">学习情况</th><th scope="col">星星</th><th scope="col" class="learning-time-heading">最近学习</th></tr></thead><tbody>${courses.map(c=>`<tr data-learning-course="${e(c.id)}"><td><small>${e(c.label)}</small><strong>${e(c.title)}</strong></td><td>${stateBadge(c.status)}</td><td>${starCount(c.stars)}</td><td class="learning-time-cell" data-label="最近学习">${learnedTime(c.lastLearnedAt,c.status)}</td></tr>`).join('')}</tbody></table></div>`;
}
function student(view){
 const s=view.student,open=view.courses.filter(c=>c.open),history=view.courses.filter(c=>!c.open);
 config.app.innerHTML=top(s.name+'的学习情况',`${e(s.className)} · <span class="student-number">${e(s.studentNumber)}</span>${s.active?'':' · 已停用'}`)+
 `<h2 class="learning-section-title">当前开放课程</h2>${open.length?courseTable(open):'<section class="panel empty"><p>这个班级暂未开放课程。</p></section>'}`+
 (history.length?`<details class="learning-closed"><summary>历史课程（${history.length} 门）</summary>${courseTable(history)}</details>`:'')+syncNote();
 bindTop();
}
async function render(focusId){
 const ticket=++serial;active=true;
 config.app.setAttribute('aria-busy','true');
 history.replaceState(null,'',address());
 const refresh=document.getElementById('learningRefresh');if(refresh)refresh.disabled=true;
 try{
  const endpoint=route.student?'admin/students/'+encodeURIComponent(route.student)+'/learning':'admin/learning?'+new URLSearchParams({...route,active:'all'});
  const result=await config.api(endpoint);if(ticket!==serial||!active)return;
  if(route.student)student(result);else{route.page=String(result.page);history.replaceState(null,'',address());overview(result);}
  if(typeof focusId==='string')document.getElementById(focusId)?.focus();
 }catch(error){
  if(ticket!==serial||!active)return;
  config.app.innerHTML=top('暂时无法读取学习记录')+'<section class="panel"><p id="learningError" role="alert"></p><button id="learningRetry">重试</button></section>';
  document.getElementById('learningError').textContent=error.message||'请检查网络后重试';bindTop();button('learningRetry',()=>render());
 }finally{if(ticket===serial){config.app.removeAttribute('aria-busy');const refresh=document.getElementById('learningRefresh');if(refresh)refresh.disabled=false;}}
}
function repositionFilters(){document.querySelectorAll('.learning-filter-popover:popover-open').forEach(positionPopover);}
window.addEventListener('resize',repositionFilters);window.addEventListener('scroll',repositionFilters,true);
window.addEventListener('popstate',()=>{if(!config)return;if(location.hash.startsWith('#learning')){route=readRoute();render();}else if(active){active=false;serial++;config.back();}});
window.CanranAdminLearning={async open(options){
 config=options;
 const existing=location.hash.startsWith('#learning');
 route=existing?readRoute():cleanRoute({classId:options.classId,page:'1'});
 if(options.studentId)route.student=options.studentId;
 history[existing?'replaceState':'pushState'](null,'',address());await render();
}};
})();
