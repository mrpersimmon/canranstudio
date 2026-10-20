'use strict';
// Code-native diagrams extend the existing SVG language. Scored clocks use
// explicit hand geometry; test expectations are reviewed separately.
const fs=require('node:fs'),path=require('node:path');
const dir=path.resolve(__dirname,'../../assets/unit95-96');fs.mkdirSync(dir,{recursive:true});
const B='#50382b',T='#729b91',C='#fff8e8',G='#e9b969';
const svg=(body,box='0 0 160 160')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" fill="none" stroke="${B}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const save=(name,body)=>fs.writeFileSync(path.join(dir,name+'.svg'),svg(body));
const txt=(x,y,t,s=22)=>`<text x="${x}" y="${y}" stroke="none" fill="${B}" font-family="Arial,sans-serif" font-size="${s}" text-anchor="middle">${t}</text>`;
const clock=(h,m)=>{const p=(a,l)=>[80+Math.sin(a*Math.PI/180)*l,80-Math.cos(a*Math.PI/180)*l].map(n=>n.toFixed(2));return `<circle cx="80" cy="80" r="66" fill="${C}"/>${Array.from({length:60},(_,i)=>{const a=p(i*6,i%5?60:56),b=p(i*6,63);return `<path d="M${a.join(' ')}L${b.join(' ')}" stroke-width="${i%5?1:2}"/>`;}).join('')}${[12,3,6,9].map((n,i)=>{const a=p(i*90,47);return txt(a[0],Number(a[1])+5,n,15);}).join('')}<path class="hour-hand" d="M80 80L${p(h%12*30+m*.5,33).join(' ')}" stroke-width="7"/><path class="minute-hand" d="M80 80L${p(m*6,52).join(' ')}" stroke="${T}" stroke-width="4"/><circle cx="80" cy="80" r="4" fill="${B}"/>`;};
for(const[name,h,m]of [['time-0757',7,57],['time-0815',8,15],['time-1017',10,17],['clock',10,0]])save(name,clock(h,m));
const ticket=(x,y)=>`<path d="M${x} ${y}h102v18q-13 9 0 18v18H${x}V${y+36}q13-9 0-18z" fill="${G}"/><path d="M${x+19} ${y+19}h60m-9-8 9 8-9 8M${x+79} ${y+40}H${x+19}m9-8-9 8 9 8" stroke="${T}" stroke-width="4"/>`;
save('tickets',ticket(21,23)+ticket(35,88));
save('train',`<rect x="34" y="21" width="92" height="113" rx="22" fill="${T}"/><rect x="46" y="42" width="68" height="41" rx="7" fill="${C}"/><path d="M80 44v38M49 137l-15 16m77-16 15 16M44 145h72"/><circle cx="54" cy="111" r="9" fill="${G}"/><circle cx="106" cy="111" r="9" fill="${G}"/>`);
save('platform',`<path d="M18 110h126v21H18z" fill="${C}"/><path d="M22 143h120M35 18v92m88-92v92M14 18h135"/><rect x="58" y="28" width="43" height="43" rx="7" fill="${T}"/>${txt(80,59,'2',26)}`);
save('station',`<path d="M15 60l65-40 65 40v82H15z" fill="${C}"/><path d="M11 62h139" stroke-width="6"/><path d="M59 142V95q21-26 42 0v47" fill="${T}"/><path d="M29 80h18v23H29zm84 0h18v23h-18z" fill="#c5dedb"/>`);
save('bridge',`<path d="M11 127l38-60h62l38 60M12 103l29-57h78l29 57M49 66v58m62-58v58"/><path d="M40 48h81v19H40z" fill="${T}"/><path d="M52 48v18m17-18v18m18-18v18m17-18v18"/>`);
save('plenty',`<path d="M20 51h95v85H20z" fill="${C}"/><path d="M35 64h18v15H35zm33 0h18v15H68zM35 97h18v15H35zm33 0h18v15H68z" fill="${G}"/><circle cx="112" cy="49" r="30" fill="${T}"/><path d="M112 29v21l15 8"/>`);
save('bar',`<path d="M28 46h104v99H28z" fill="${C}"/><path d="M18 46l15-25h94l15 25z" fill="#b8897d"/><path d="M59 143V88h42v55M40 64h80"/>`);
save('advice',`<path d="M20 25h120v83H70l-30 28v-28H20z" fill="${C}"/><path d="M80 44v28" stroke="${T}" stroke-width="9"/><circle cx="80" cy="88" r="4" fill="${B}"/>`);
for(const[name,dirx]of [['ago',-1],['future',1]])save(name,`<circle cx="80" cy="59" r="38" fill="${C}"/><path d="M80 32v28l19 12"/><path d="M${dirx>0?24:136} 126H${dirx>0?136:24}m${dirx>0?-19:19}-16 ${dirx>0?19:-19} 16 ${dirx>0?-19:19} 16" stroke="${T}" stroke-width="7"/>`);
for(const[name,label]of [['catch','✓'],['miss','×'],['slow','−'],['fast','+']])save(name,`<circle cx="67" cy="70" r="46" fill="${C}"/><path d="M67 40v32l23 11"/><circle cx="118" cy="115" r="29" fill="${name==='miss'?'#e8a891':G}"/>${txt(118,127,label,38)}`);
for(const city of ['athens','beijing','berlin','mumbai','geneva','london','madrid','moscow','new-york','paris','rome','seoul','stockholm','sydney','tokyo'])fs.copyFileSync(path.join(dir,'../unit93-94/'+city+'.svg'),path.join(dir,city+'.svg'));
const bg=(theme)=>`<rect width="1000" height="720" fill="${theme==='bar'?'#f3e8d6':'#ecf2ed'}" stroke="none"/><path d="M0 540h1000v180H0z" fill="#e2d7c2" stroke="none"/><path d="M0 540h1000" stroke="#c5b79f"/><path d="M0 86h1000M56 86v440m888-440v440" stroke="#83a39a" stroke-width="14"/>${theme==='ticket'?'<rect x="356" y="390" width="288" height="173" rx="12" fill="#bfd4ce" stroke="#7e9f94"/><path d="M330 558h340v30H330z" fill="#cba982"/>':theme==='bar'?'<path d="M340 553h320v34H340zM378 587v110m244-110v110" fill="#cba982"/>':'<path d="M84 476l112-67h607l112 67M200 410v108m600-108v108" stroke="#b5c9c3" stroke-width="10"/><path d="M0 678h1000M0 702h1000" stroke="#b7aba0" stroke-width="8"/>'}<path d="M80 584h82m676 0h82" stroke="#d0c3ad" stroke-width="7"/>`;
for(const theme of ['ticket','station','bar','gate'])fs.writeFileSync(path.join(dir,theme+'-scene.svg'),svg(bg(theme),'0 0 1000 720').replace('<svg ','<svg preserveAspectRatio="none" '));
console.log('Lesson95–96 code-native assets built.');
