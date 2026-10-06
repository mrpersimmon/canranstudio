(function(core){
 'use strict';
 // Composed for this lesson. Scene changes never award progress.
 core.unit2526Scene=core.classroomScene.create({
 "unit": "unit25-26",
 "title": "厨房导览 · 从画面正面看",
 "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 480\" fill=\"none\" stroke=\"#503729\" stroke-width=\"3.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"0\" y=\"0\" width=\"1000\" height=\"480\" rx=\"0\" fill=\"#F4EDDD\" stroke=\"none\"/><path d=\"M0 397H1000V480H0z\" fill=\"#E6D3AE\" stroke=\"none\"/><path d=\"M0 397H1000\" fill=\"none\" stroke=\"#B5B8A5\" stroke-width=\"3\"/><g transform=\"translate(431 140) scale(1)\" ><rect x=\"0\" y=\"0\" width=\"163\" height=\"133\" rx=\"5\" fill=\"#E4EEEE\" stroke=\"#A6BDBA\"/><rect x=\"8\" y=\"8\" width=\"147\" height=\"117\" rx=\"1\" fill=\"#F7F8EB\" stroke=\"none\"/><path d=\"M81.5 8v117M8 66.5h147\" fill=\"none\" stroke=\"#B4CBC6\"/><path d=\"M-5 140h173\" fill=\"none\" stroke=\"#BAC9BE\" stroke-width=\"7\"/></g><path d=\"M0 336H1000m-1000 23h1000\" fill=\"none\" stroke=\"#DDD2B9\" stroke-width=\"2\"/><path d=\"M0 441H1000M254 397l-41 83m530-83 45 83\" fill=\"none\" stroke=\"#D0BF9F\" stroke-width=\"2\"/><g data-part=\"fridge\" data-from=\"-1\" data-to=\"999\" data-focus=\"1 2 3\" data-actor=\"\"><g transform=\"translate(798 224) scale(1)\" ><rect x=\"0\" y=\"0\" width=\"113\" height=\"186\" rx=\"11\" fill=\"#FFFEF4\" /><path d=\"M1 62h111M94 26v20M94 89v51\" fill=\"none\" /><rect x=\"13\" y=\"14\" width=\"64\" height=\"30\" rx=\"4\" fill=\"#F4F5EB\" stroke=\"none\"/><path d=\"M8 186v8m96-8v8\" fill=\"none\" stroke-width=\"7\"/></g></g><g data-part=\"cooker\" data-from=\"-1\" data-to=\"999\" data-focus=\"4 5 6\" data-actor=\"\"><g transform=\"translate(96 288) scale(1)\" ><rect x=\"0\" y=\"0\" width=\"140\" height=\"120\" rx=\"9\" fill=\"#76A6BB\" /><rect x=\"14\" y=\"51\" width=\"112\" height=\"54\" rx=\"6\" fill=\"#B8D9E0\" /><path d=\"M1 38h138\" fill=\"none\" /><circle cx=\"23\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><circle cx=\"61\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><circle cx=\"113\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><path d=\"M14 0q19-21 40 0m29 0q18-21 41 0M28 61h81\" fill=\"none\" /><path d=\"M11 120v9m117-9v9\" fill=\"none\" stroke-width=\"7\"/></g></g><g data-part=\"table\" data-from=\"-1\" data-to=\"999\" data-focus=\"7\" data-actor=\"\"><g transform=\"translate(381 345) scale(1)\" ><path d=\"M15 11v69m232-69v69\" fill=\"none\" stroke=\"#9D8A71\" stroke-width=\"12\"/><rect x=\"0\" y=\"0\" width=\"262\" height=\"16\" rx=\"5\" fill=\"#D9BE91\" stroke=\"#9D8A71\"/></g></g><g data-part=\"bottle\" data-from=\"-1\" data-to=\"999\" data-focus=\"8 9\" data-actor=\"\"><g transform=\"translate(442 274) scale(0.82)\" ><path d=\"M13 0h17v19l11 11v55H2V30l11-11z\" fill=\"#D5E8D4\" /><rect x=\"11\" y=\"-4\" width=\"21\" height=\"8\" rx=\"2\" fill=\"#A9C2A1\" /><path d=\"M11 35v39\" fill=\"none\" stroke=\"#FFFEED\" stroke-width=\"4\"/></g></g><g data-part=\"cup\" data-from=\"-1\" data-to=\"999\" data-focus=\"10 11\" data-actor=\"\"><g transform=\"translate(545 312) scale(0.82)\" ><path d=\"M0 0h37v30q-18 12-37 0z\" fill=\"#FFFCF1\" /><path d=\"M37 5q25-2 19 18-7 8-19 3\" fill=\"none\" /><path d=\"M-4 40h52\" fill=\"none\" stroke=\"#B6AB8E\" stroke-width=\"3\"/></g></g></svg>",
 "frames": [
  "史密斯太太的小厨房",
  "厨房里有一台冰箱",
  "冰箱是白色的",
  "冰箱在画面右边",
  "厨房里还有一台电炉",
  "电炉是蓝色的",
  "电炉在画面左边",
  "桌子在房间中间",
  "瓶子放在桌上",
  "这个瓶子是空的",
  "桌上还有一个杯子",
  "杯子是干净的"
 ],
 "speakers": [],
 "moves": {},
 "narration": true,
 "finish": "厨房导览完成，物品和位置都说清了！",
 "mobileSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 275\" fill=\"none\" stroke=\"#503729\" stroke-width=\"3.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"0\" y=\"0\" width=\"400\" height=\"275\" rx=\"0\" fill=\"#F4EDDD\" stroke=\"none\"/><path d=\"M0 228H400V275H0z\" fill=\"#E6D3AE\" stroke=\"none\"/><path d=\"M0 228H400\" fill=\"none\" stroke=\"#B5B8A5\" stroke-width=\"3\"/><g transform=\"translate(164 10) scale(1)\" ><rect x=\"0\" y=\"0\" width=\"81\" height=\"88\" rx=\"5\" fill=\"#E4EEEE\" stroke=\"#A6BDBA\"/><rect x=\"8\" y=\"8\" width=\"65\" height=\"72\" rx=\"1\" fill=\"#F7F8EB\" stroke=\"none\"/><path d=\"M40.5 8v72M8 44.0h65\" fill=\"none\" stroke=\"#B4CBC6\"/><path d=\"M-5 95h91\" fill=\"none\" stroke=\"#BAC9BE\" stroke-width=\"7\"/></g><path d=\"M0 161H400\" fill=\"none\" stroke=\"#DDD2B9\" stroke-width=\"2\"/><g data-part=\"fridge\" data-from=\"-1\" data-to=\"999\" data-focus=\"1 2 3\" data-actor=\"\"><g transform=\"translate(302 82) scale(0.75)\" ><rect x=\"0\" y=\"0\" width=\"113\" height=\"186\" rx=\"11\" fill=\"#FFFEF4\" /><path d=\"M1 62h111M94 26v20M94 89v51\" fill=\"none\" /><rect x=\"13\" y=\"14\" width=\"64\" height=\"30\" rx=\"4\" fill=\"#F4F5EB\" stroke=\"none\"/><path d=\"M8 186v8m96-8v8\" fill=\"none\" stroke-width=\"7\"/></g></g><g data-part=\"cooker\" data-from=\"-1\" data-to=\"999\" data-focus=\"4 5 6\" data-actor=\"\"><g transform=\"translate(12 128) scale(0.71)\" ><rect x=\"0\" y=\"0\" width=\"140\" height=\"120\" rx=\"9\" fill=\"#76A6BB\" /><rect x=\"14\" y=\"51\" width=\"112\" height=\"54\" rx=\"6\" fill=\"#B8D9E0\" /><path d=\"M1 38h138\" fill=\"none\" /><circle cx=\"23\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><circle cx=\"61\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><circle cx=\"113\" cy=\"24\" r=\"5\" fill=\"#F1D797\" /><path d=\"M14 0q19-21 40 0m29 0q18-21 41 0M28 61h81\" fill=\"none\" /><path d=\"M11 120v9m117-9v9\" fill=\"none\" stroke-width=\"7\"/></g></g><g data-part=\"table\" data-from=\"-1\" data-to=\"999\" data-focus=\"7\" data-actor=\"\"><g transform=\"translate(136 195) scale(0.79)\" ><g transform=\"translate(0 0) scale(1)\" ><path d=\"M15 11v69m157-69v69\" fill=\"none\" stroke=\"#9D8A71\" stroke-width=\"12\"/><rect x=\"0\" y=\"0\" width=\"187\" height=\"16\" rx=\"5\" fill=\"#D9BE91\" stroke=\"#9D8A71\"/></g></g></g><g data-part=\"bottle\" data-from=\"-1\" data-to=\"999\" data-focus=\"8 9\" data-actor=\"\"><g transform=\"translate(168 147) scale(0.55)\" ><path d=\"M13 0h17v19l11 11v55H2V30l11-11z\" fill=\"#D5E8D4\" /><rect x=\"11\" y=\"-4\" width=\"21\" height=\"8\" rx=\"2\" fill=\"#A9C2A1\" /><path d=\"M11 35v39\" fill=\"none\" stroke=\"#FFFEED\" stroke-width=\"4\"/></g></g><g data-part=\"cup\" data-from=\"-1\" data-to=\"999\" data-focus=\"10 11\" data-actor=\"\"><g transform=\"translate(223 172) scale(0.55)\" ><path d=\"M0 0h37v30q-18 12-37 0z\" fill=\"#FFFCF1\" /><path d=\"M37 5q25-2 19 18-7 8-19 3\" fill=\"none\" /><path d=\"M-4 40h52\" fill=\"none\" stroke=\"#B6AB8E\" stroke-width=\"3\"/></g></g></svg>",
 "theatreVersion": 2,
 "wall": "#F4EDDD",
 "mobileMoves": {}
});
})(globalThis.CanranCore);

(function(core){
 'use strict';
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 core.unit2526Scene.inquiry=({element})=>{
  let question,heading,reply,reveal,answer;
  return{
   supports:q=>q.scene?.kind==='inquiry',
   present(q,progress){
    question=q;element.classList.remove('role-runner');
    const content=element.querySelector('.practice-content');heading=node('h3',q.prompt);heading.tabIndex=-1;
    const intro=node('div','','inquiry-intro');intro.append(progress,heading);
    const scene=node('div','','inquiry-scene');scene.setAttribute('role','group');scene.setAttribute('aria-label','厨房里问位置');
    const friend=node('div','','inquiry-friend'),portrait=node('img');portrait.src='/assets/unit25-26/Mrs.svg';portrait.alt='朋友';friend.append(portrait);
    const dialogue=node('div','','inquiry-dialogue'),request=node('p',q.scene.before,'inquiry-bubble');request.lang='en';
    answer=node('p','','inquiry-bubble is-you');answer.lang='en';reply=node('p','','inquiry-bubble');reply.lang='en';
    dialogue.append(request,answer,reply);friend.append(dialogue);
    reveal=node('div','','inquiry-discovery');scene.append(friend,reveal);content.prepend(intro,scene);
   },
   answer(value){
    const solved=value!==null;answer.textContent=solved?value:'';reply.textContent=solved?question.scene.after:'';
    answer.hidden=reply.hidden=!solved;reveal.replaceChildren();reveal.classList.toggle('is-discovered',solved);
    if(solved){const pic=node('img');pic.src=question.scene.image;pic.alt='找到位置：勺子在杯子里面';reveal.append(pic,node('p','知道勺子在哪里了！'));}
    else{reveal.append(node('span','?','inquiry-question'),node('p','勺子在哪里？'));}
   },
   heading:()=>heading?.isConnected?heading:element.querySelector('.practice-finish>p'),finish(){}
  };
 };
})(globalThis.CanranCore);
