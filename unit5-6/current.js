(function(core){
 'use strict';
 const portraits={blake:'/assets/unit5-6-current/blake-v154.webp',sophie:'/assets/unit5-6-current/sophie-v154.webp',hans:'/assets/unit5-6-current/hans-v154.webp',naoko:'/assets/unit5-6-current/naoko-v154.webp',chang:'/assets/unit5-6-current/chang-v154.webp',luming:'/assets/unit5-6-current/luming-v154.webp',xiaohui:'/assets/unit5-6-current/xiaohui-v154.webp'};
 const icons={french:'/assets/unit5-6-current/french-v154.svg',german:'/assets/unit5-6-current/german-v154.svg',japanese:'/assets/unit5-6-current/japanese-v154.svg','south-korean':'/assets/unit5-6-current/south-korean-v154.svg',chinese:'/assets/unit5-6-current/chinese-v154.svg',swedish:'/assets/unit5-6-current/swedish-v154.svg',english:'/assets/unit5-6-current/english-v154.svg',american:'/assets/unit5-6-current/american-v154.svg',volvo:'/assets/unit5-6-current/volvo-v154.svg',peugeot:'/assets/unit5-6-current/peugeot-v154.svg',mercedes:'/assets/unit5-6-current/mercedes-v154.svg',toyota:'/assets/unit5-6-current/toyota-v154.svg',mini:'/assets/unit5-6-current/mini-v154.svg',ford:'/assets/unit5-6-current/ford-v154.svg'};
 const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
 const named={ 'Mr.':'blake',Miss:'sophie',student:'sophie','Mr. Blake':'blake',Sophie:'sophie',Hans:'hans',Naoko:'naoko','Chang-woo':'chang',Luming:'luming',Xiaohui:'xiaohui'};
 function image(name){return portraits[named[name]||name]||icons[String(name).toLowerCase().replaceAll(' ','-')];}
 function picture(name,label=''){
  if(name==='students'){const group=node('div','','students-group');for(const who of ['hans','naoko','chang','luming','xiaohui'])group.append(picture(who));group.setAttribute('aria-label','同学们');return group;}
  const im=node('img');im.src=image(name)||'/assets/unit5-6/'+name+'.svg';im.alt=label;return im;
 }
 function photo(){const figure=node('figure','','classroom-photo current-photo'),group=node('div','','photo-people');for(const who of ['blake','sophie','hans','naoko','chang','luming','xiaohui']){const person=node('figure');person.append(picture(who),node('figcaption',core.unit56.learning.PEOPLE[who].name));group.append(person);}figure.append(group,node('figcaption','Nice to meet you!'));return figure;}
 const models={
  'u56-v154-wh-meaning':[['What make is it?','它是什么牌子的？'],["It's a Mini.",'说出具体品牌，不只说Yes或No。']],
  'u56-v154-wh-order':[['Who is she?','她是谁？who是“谁”；疑问部分放在前面。'],['She is Sophie.','她是Sophie。']],
  'u56-v154-who-answer':[['Who is she? — She is Sophie.','问她是谁，可以用名字回答。']],
  'u56-v154-who-subject':[['Sophie is French. → Who is French?','不知道是谁，用Who替换人物；这里不再把is放到Who前面。']],
  'u56-v1-refer-she':[['Hans is a student. He is German.','继续说课文中的Hans，用He；说本题的女同学时换相应代词。']],
  'u56-v1-refer-he':[['Sophie is a student. She is French.','继续说同一位人物；she说她，he说他。']],
  'u56-tasks-v4-refer-it':[['This is his book. It is new.','his说明书的主人；接着说书用It。new表示新的。']],
  'u56-tasks-v4-article-a':[["He's a Japanese student.",'a后面的Japanese以辅音/dʒ/开头；冠词看紧接的发音。']],
  'u56-v1-article-an':[["It's an American car.",'American /əˈmerɪkən/以元音开头，前面用an。']],
  'u56-v1-article-none':[['He is German. / He is a German student.','国籍形容词直接作表语不加a；带单数student时构成名词短语。']],
  'u56-v1-build-question':[['Is it a French car or a German car?', 'or把两种选择连起来；题目要求说清是哪一种。']],
  'u56-v1-build-correction':[["She isn't German. She's French.",'资料已知她是法国人：先否定不符的情况，再说明实际情况。']]
 };
 function view({element,art,zone}){
  const base=core.unit12Grammar.create({element,art});
  return{present(q,progress){
   const model=models[q.id];base.present({...q,workshop:model?{model:{lines:model}}:{}},progress);
   for(const b of element.querySelectorAll('.picture-option')){const im=b.querySelector('img'),path=image(b.textContent.trim());if(im&&path)im.src=path;}
   if(zone==='cars'){element.querySelector('.practice-scene')?.remove();const topic=q.id.includes('make')?'volvo':q.id.includes('question')?'naoko':q.id.includes('correction')?'mini':'toyota';const figure=node('figure','','application-figure');figure.append(picture(topic),node('figcaption',topic==='naoko'?'Naoko':topic[0].toUpperCase()+topic.slice(1)));element.querySelector('.grammar-intro').append(figure);}
  },answer:base.answer,finish:base.finish,heading:base.heading,hasVisibleModel(){return Boolean(element.querySelector('.grammar-model:not([hidden])'));}};
 }
 function completion(){const div=node('div','','completion-art current-completion'),im=node('img');im.src='/assets/awards/unit5-6-friends.webp';im.alt='';div.setAttribute('aria-hidden','true');div.append(im);return div;}
 core.unit56Current={image,picture,photo,view,completion};
})(globalThis.CanranCore);
