(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CanranCourseDirectory=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  function range(course){return course.id.slice(4).split('-').map(Number);}
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function page(courses,index){
    if(!courses.length)return null;
    const current=Math.max(0,Math.min(courses.length-1,Number.isFinite(index)?Math.trunc(index):0));
    return {index:current,course:courses[current],total:courses.length,previous:current>0,next:current<courses.length-1};
  }
  function matches(course,query){
    const value=String(query).trim().toLowerCase().replace(/^lesson\s*/,'');
    if(!value)return true;
    if(/^\d+$/.test(value)){const [start,end]=range(course);return Number(value)>=start&&Number(value)<=end;}
    const normalize=text=>String(text||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,'');
    return normalize([course.id,course.label,course.title,course.intro].join(' ')).includes(normalize(value));
  }
  function markup({courses,banners,base}){
    if(!courses.length)return '';
    const first=range(courses[0])[0],last=range(courses[courses.length-1])[1];
    const cover=`<span class="course-cover-face"><img src="${base}assets/brand/starflower.png" alt=""><strong>我的课程</strong><span>Lesson ${first}–${last}</span><small>${courses.length} 个教学单元</small><span class="course-cover-action">打开课程书</span></span>`;
    return `<section class="course-library" aria-label="课程书">
      <div class="course-book-search"><label for="courseSearch">查找 Lesson</label><div class="course-search"><input id="courseSearch" type="search" placeholder="例如 Lesson 50，或课程名称" autocomplete="off"><button id="clearCourseSearch" class="compact" hidden>清除搜索</button></div></div>
      <div id="courseBookClosed" class="course-book-closed"><button id="openCourseBook" class="course-closed-cover" aria-label="打开课程书">${cover}</button><p id="courseBookmark" class="course-bookmark"></p></div>
      <section id="courseBookReader" class="course-book-reader" aria-label="课程书页" hidden>
        <div class="course-reader-heading"><button id="closeCourseBook" class="compact">返回封面</button><h2 id="courseBookTitle"></h2></div>
        <div id="courseBookStage" class="course-book-stage" tabindex="0" role="group" aria-label="课程书页，可用左右方向键翻页">
          <div class="course-directory course-book-pages">${banners}</div>
          <button id="courseBookOpening" class="course-opening" aria-label="跳过开书动画" hidden><span class="course-opening-rig"><span class="course-opening-cover">${cover}</span></span></button>
        </div>
        <nav class="course-book-pagination" aria-label="课程翻页"><button id="previousCourse">上一单元</button><p id="courseBookPosition" role="status" aria-live="polite"></p><button id="nextCourse">下一单元</button></nav>
      </section>
      <section id="courseBookSearchResults" class="course-book-results" aria-label="课程搜索结果" hidden><p id="courseResults" role="status" aria-live="polite"></p><div class="course-search-list">${courses.map((course,index)=>`<button class="course-search-result" data-course-result="${index}"><span><small>${escape(course.label)}</small><strong>${escape(course.title)}</strong></span><span class="course-result-action">翻到这一课</span></button>`).join('')}</div><p id="courseSearchEmpty" hidden>没有找到这节课，试试其他课号或课程名称。</p></section>
      <div class="course-book-message"><p id="courseBookStatus" role="status" aria-live="polite"></p><button id="retryCoursePage" class="compact" hidden>重新加载这一页</button></div>
    </section>`;
  }
  function mount(container,courses,owner){
    const get=id=>container.querySelector('#'+id),input=get('courseSearch');
    if(!input)return ()=>{};
    const cards=[...container.querySelectorAll('.featured-course')],results=[...container.querySelectorAll('[data-course-result]')];
    const reader=get('courseBookReader'),closed=get('courseBookClosed'),stage=get('courseBookStage'),opening=get('courseBookOpening'),pages=container.querySelector('.course-book-pages');
    const key='canran:course-book:v1:'+owner,status=get('courseBookStatus'),retry=get('retryCoursePage');
    const compactView=matchMedia('(max-width: 900px)');
    let selected=0,opened=false,busy=false,revision=0,timer=0,disposed=false,failedIndex=0;
    let restoreOpen=false;
    try{const saved=JSON.parse(sessionStorage.getItem(key)||'null'),index=courses.findIndex(course=>course.id===saved?.course);if(index>=0){selected=index;restoreOpen=!!saved.opened;}}catch{}
    const save=()=>{try{sessionStorage.setItem(key,JSON.stringify({course:courses[selected].id,opened}));}catch{}};
    function finishOpening(){
      clearTimeout(timer);opening.hidden=true;opening.removeAttribute('style');
      reader.classList.remove('is-compact-opening');stage.classList.remove('is-opening');
      pages.inert=false;stage.setAttribute('aria-busy','false');
    }
    function render(){
      const query=input.value.trim(),current=page(courses,selected);let count=0;
      closed.hidden=!!query||opened;reader.hidden=!!query||!opened;get('courseBookSearchResults').hidden=!query;get('clearCourseSearch').hidden=!query;
      results.forEach((result,index)=>{result.hidden=!matches(courses[index],query);if(!result.hidden)count++;});
      cards.forEach((card,index)=>{card.hidden=index!==selected;});
      get('courseResults').textContent=`找到 ${count} 个单元`;
      get('courseSearchEmpty').hidden=count!==0;
      get('courseBookTitle').textContent=current.course.label;
      get('courseBookPosition').textContent=`${selected+1} / ${courses.length}`;
      get('courseBookmark').textContent=selected?`上次翻到 ${current.course.label}`:'点击封面，开始翻阅';
      get('openCourseBook').disabled=busy;get('previousCourse').disabled=busy||!current.previous;get('nextCourse').disabled=busy||!current.next;
    }
    async function prepare(index){
      let timeout;
      try{await Promise.race([Promise.all([...cards[index].querySelectorAll('img')].map(async image=>{if(!image.complete||!image.naturalWidth){image.src=image.dataset.bookSrc;await image.decode();}})),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('image timeout')),15000);})]);}
      finally{clearTimeout(timeout);}
    }
    async function openAt(index,{animate=false,focus=true,scroll=false}={}){
      const next=page(courses,index);if(!next)return;
      const ticket=++revision;finishOpening();busy=true;pages.inert=true;stage.setAttribute('aria-busy','true');retry.hidden=true;failedIndex=next.index;status.textContent=`正在准备 ${next.course.label}…`;render();
      try{
        await prepare(next.index);if(disposed||ticket!==revision)return;
        // Keep the small-screen transition at the real cover's position and size.
        // A full-size rotating duplicate caused a jump, clipping and a blank page.
        const compact=compactView.matches,coverRect=!closed.hidden?get('openCourseBook').getBoundingClientRect():null;
        const previous=selected;selected=next.index;opened=true;busy=false;input.value='';status.textContent='';finishOpening();render();save();
        const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
        if(animate&&!reduced){
          const duration=compact?320:800;
          reader.style.setProperty('--course-opening-duration',duration+'ms');
          if(compact){
            reader.classList.add('is-compact-opening');
            if(coverRect){
              const stageRect=stage.getBoundingClientRect();
              Object.assign(opening.style,{left:coverRect.left-stageRect.left+'px',top:coverRect.top-stageRect.top+'px',width:coverRect.width+'px',height:coverRect.height+'px'});
              opening.hidden=false;
            }
          }else opening.hidden=false;
          stage.classList.add('is-opening');stage.setAttribute('aria-busy','true');pages.inert=true;
          timer=setTimeout(finishOpening,duration+120);
        }else if(previous!==selected&&!reduced){cards[selected].animate?.([{opacity:.25,transform:`translateX(${selected>previous?10:-10}px)`},{opacity:1,transform:'translateX(0)'}],{duration:180,easing:'ease-out'});}
        if(focus)stage.focus({preventScroll:true});
        if(scroll)reader.scrollIntoView({block:'start',behavior:'auto'});
      }catch{if(disposed||ticket!==revision)return;busy=false;finishOpening();status.textContent='这一页的插图还没准备好，请重试。';retry.hidden=false;render();}
    }
    function search(){revision++;busy=false;finishOpening();retry.hidden=true;status.textContent='';render();}
    input.addEventListener('input',search);
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){const found=courses.map((course,index)=>matches(course,input.value)?index:-1).filter(index=>index>=0);if(found.length===1){event.preventDefault();openAt(found[0],{scroll:true});}}});
    get('clearCourseSearch').onclick=()=>{input.value='';search();input.focus();};
    results.forEach((result,index)=>result.onclick=()=>openAt(index,{scroll:true}));
    get('openCourseBook').onclick=()=>openAt(selected,{animate:true});
    get('closeCourseBook').onclick=()=>{revision++;busy=false;finishOpening();opened=false;input.value='';status.textContent='';retry.hidden=true;save();render();get('openCourseBook').focus({preventScroll:true});};
    get('previousCourse').onclick=()=>openAt(selected-1);
    get('nextCourse').onclick=()=>openAt(selected+1);
    retry.onclick=()=>openAt(failedIndex,{animate:!opened});
    opening.onclick=finishOpening;
    opening.addEventListener('animationend',event=>{if(['course-cover-open','course-cover-dismiss'].includes(event.animationName))finishOpening();});
    compactView.addEventListener('change',finishOpening);
    stage.addEventListener('keydown',event=>{if(event.target===stage&&!busy&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();openAt(selected+(event.key==='ArrowRight'?1:-1),{focus:false});}});
    render();if(restoreOpen)openAt(selected,{focus:false});
    return()=>{disposed=true;revision++;clearTimeout(timer);compactView.removeEventListener('change',finishOpening);};
  }
  return {matches,page,markup,mount};
});
