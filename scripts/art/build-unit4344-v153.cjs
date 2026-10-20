// Native relation diagrams: preserve actual textbook objects and landmarks.
const fs=require('fs'),sharp=require('sharp');const base='assets/unit43-44/';
const svg=body=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280" fill="none" stroke="#513b30" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="3" width="354" height="274" rx="18" fill="#f7f1df" stroke="#bad2cd"/>'+body+'</svg>';
async function art(file,x,y,w,h){const source=fs.readFileSync(file,'utf8'),m=source.match(/<svg([^>]*)>([\s\S]*)<\/svg>/),{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let l=info.width,t=info.height,r=0,b=0;for(let y0=0;y0<info.height;y0++)for(let x0=0;x0<info.width;x0++)if(data[(y0*info.width+x0)*4+3]>0){l=Math.min(l,x0);r=Math.max(r,x0);t=Math.min(t,y0);b=Math.max(b,y0);}
 const attrs=m[1].replace(/xmlns="[^"]*"/,'').replace(/viewBox="[^"]*"/,'').replace(/\s(?:width|height)="[^"]*"/g,'');return`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${l-2} ${t-2} ${r-l+5} ${b-t+5}" preserveAspectRatio="xMidYMax meet" ${attrs}>${m[2]}</svg>`;}
const table='<path d="M45 205V260M315 205V260"/><rect x="25" y="183" width="310" height="24" rx="8" fill="#d9b887"/>';
const cabinet='<rect x="36" y="160" width="288" height="103" rx="8" fill="#a6c9c4"/><path d="M36 180H324M180 180V263"/><circle cx="164" cy="217" r="4"/><circle cx="196" cy="217" r="4"/>';
const a=(name,...p)=>art('assets/'+name+'.svg',...p);
(async()=>{
const scenes={};
scenes[70]=table+await a('unit41-42/bread',70,93,100,89)+await a('unit41-42/bread',192,93,100,89);
scenes[80]=await a('unit37-38/hammer',125,35,75,145)+await a('unit37-38/hammer',213,55,75,145)+'<path d="M43 141 77 110H235L270 141V244H43Z" fill="#bdceab"/><path d="M43 141H270M77 110V143"/>';
scenes[90]='<path d="M69 260V25H287V260" fill="#deceaa"/><path d="M93 260V49H263V260" fill="#a5c1bf"/><circle cx="238" cy="140" r="7" fill="#e7b656"/>'+await a('unit41-42/milk',89,108,78,150)+await a('unit41-42/milk',184,108,78,150);
scenes[100]=cabinet+await a('unit41-42/soap',53,99,75,61)+await a('unit41-42/soap',142,99,75,61)+await a('unit41-42/soap',231,99,75,61);
scenes[200]=table+await a('unit39-40/newspaper',42,79,132,103)+await a('unit39-40/newspaper',188,79,132,103)+await a('unit39-40/vase',139,44,88,160);
scenes[300]=table+'<path d="M74 65H151L143 177H84ZM210 65H287L279 177H220Z" fill="#e0f0ec"/><path d="M79 112H147L143 177H84ZM215 112H283L279 177H220Z" fill="#9fcbd5"/><path d="M96 84V104M232 84V104" stroke="#fff8ea"/>';
scenes[400]=table+await a('unit43-44/cup',52,97,117,89)+await a('unit43-44/cup',194,97,117,89)+'<ellipse cx="108" cy="123" rx="33" ry="6" fill="#bd8d53" stroke="none"/><ellipse cx="250" cy="123" rx="33" ry="6" fill="#bd8d53" stroke="none"/>';
scenes[500]=table+await a('unit43-44/kettle',117,32,138,164)+await a('unit43-44/cups',71,144,224,77);
scenes[600]=table+await a('unit41-42/chocolate',118,83,139,99)+'<path d="M69 65 162 46V199L69 217Z" fill="#8ca78b"/><path d="M69 65 54 55V205L69 217M69 65V217M84 82 145 69M84 101 145 88"/>';
scenes[700]='<rect x="29" y="25" width="302" height="237" rx="9" fill="#a6c9c4"/><rect x="49" y="45" width="262" height="191" fill="#fff6e2"/>'+await a('unit43-44/teapot',63,92,110,132)+await a('unit43-44/teapot',186,92,110,132)+'<path d="M31 240H329"/>';
scenes[800]='<rect x="63" y="24" width="236" height="211" fill="#e8ceb1"/><path d="M165 235V157H200V235" fill="#a6c9c4"/><path d="M89 51H133V97H89ZM227 51H271V97H227ZM89 115H133V157H89ZM227 115H271V157H227Z" fill="#c8dbd1"/><path d="M20 260H340" stroke="#a6b4ac"/>'+await a('unit1-2/car',21,176,151,75)+await a('unit1-2/car',188,176,151,75);
scenes[900]=table+await a('unit41-42/coffee',64,51,108,131)+await a('unit41-42/coffee',192,51,108,131);
for(const[n,s]of Object.entries(scenes))fs.writeFileSync(base+'reference-'+n+'-v153.svg',svg(s));
// Keep original runtime assets frozen for historical-page checks.
fs.writeFileSync(base+'counter-v153.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 180" fill="none" stroke="#513b30" stroke-width="4" stroke-linejoin="round"><path d="M12 43 45 12H375L408 43V60H12Z" fill="#e6c590"/><path d="M12 43H408M35 60H385V168H35Z" fill="#a6c9c4"/><path d="M210 60V168"/><circle cx="191" cy="104" r="4" fill="#e7b656"/><circle cx="229" cy="104" r="4" fill="#e7b656"/></svg>');
console.log('12 complete relation diagrams and an uncropped counter');
})();
