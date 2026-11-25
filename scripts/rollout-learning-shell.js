'use strict';
const fs=require('node:fs'),path=require('node:path');
const {UNITS}=require('../server/catalog');
const root=path.resolve(__dirname,'..');
const changes=[];
function update(file,transform){
  const original=fs.readFileSync(path.join(root,file),'utf8'),next=transform(original);
  if(next!==original)changes.push({file,original,next});
}
for(const id of UNITS.slice(3)){
  update(id+'/index.html',html=>{
    if(html.includes('/core/learning-flow.js'))return html;
    const css=['practice-screen','learning-flow','learning-scenes'].map(name=>'<link rel="stylesheet" href="/core/'+name+'.css">').join('\n');
    const js=['learning-scenes','learning-flow','practice-screen'].map(name=>'<script src="/core/'+name+'.js"></script>').join('\n');
    // Match the real unit script once without rewriting historical dependency order.
    const marker=new RegExp('(<script src="/'+id+'/unit\\.js[^\"]*"><\\/script>)');
    if((html.match(new RegExp(marker.source,'g'))||[]).length!==1)throw Error(id+' unit entry is ambiguous');
    return html.replace('</head>',css+'\n</head>').replace(marker,js+'\n$1');
  });
  update(id+'/unit.js',source=>{
    // A shell migration includes readonly round history, not just new CSS.
    if(!source.includes('allowReview:true'))source=source.replace('roundPolicy:unit.reward.edition,','roundPolicy:unit.reward.edition,allowReview:true,finalLabel:\'完成练习\',onResumeResult:updateProgress,');
    // The shared shell owns reading-position restoration on resize. Advancing
    // a line still scrolls to that line in the original story controller.
    source=source.replace("if(active==='learn/text'||active==='l2')requestAnimationFrame(revealSavedLine)","if(!document.body.hasAttribute('data-learning-shell')&&(active==='learn/text'||active==='l2'))requestAnimationFrame(revealSavedLine)");
    source=source.replace('function alignReader(){const b=',"function alignReader(){if(document.body.hasAttribute('data-learning-shell'))return;const b=");
    if(/core\.learningProgress\s*=/.test(source))return source;
    for(const text of ['const passed','runners','let awardState'])if(!source.includes(text))throw Error(id+' missing presentation state '+text);
    const marker=/certificateView\s*=\s*core\.storyCertificate\.mount/;
    if((source.match(new RegExp(marker.source,'g'))||[]).length!==1)throw Error(id+' certificate bridge is ambiguous');
    const bridge='core.learningProgress = () => unit.reward.zones.map(zone => ({id:zone.id,completed:passed(zone.id)||Boolean(runners.get(zone.id)?.progress().completed),earned:Boolean(awardState.zones[zone.id])}));\n  ';
    return source.replace(marker,bridge+'$&');
  });
}
if(process.argv.includes('--write'))for(const change of changes)fs.writeFileSync(path.join(root,change.file),change.next);
console.log(JSON.stringify({mode:process.argv.includes('--write')?'written':'dry-run',files:changes.map(c=>c.file)},null,2));
