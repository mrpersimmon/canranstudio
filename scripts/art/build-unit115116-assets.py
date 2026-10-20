from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[2];d=r/'assets/unit115-116';d.mkdir(exist_ok=True)
def put(name,body,box='0 0 180 160'):
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+box+'"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def text(value,x=90,y=91,size=22):return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{size}" stroke="none" fill="#624936">{value}</text>'
def head(x,y,color='#dbc8b0'):
 return f'<circle cx="{x}" cy="{y}" r="15" fill="{color}"/><path d="M{x-22} {y+48}q0-27 22-27t22 27" fill="{color}"/>'
def question():return text('?',135,61,35)
put('someone',head(72,52)+question())
put('anyone',head(90,50,'#d9d1e1')+text('?',145,75,40))
put('everyone',head(43,45,'#c6d6b5')+head(90,45,'#d4bdd7')+head(137,45,'#dfca9f'))
put('nobody','<rect x="33" y="22" width="114" height="119" rx="13" fill="#f8eedb"/>'+text('0',90,110,64))
put('something','<path d="M44 44h92v81H44Z" fill="#c9d6b6"/>'+text('?',90,103,48))
put('anything','<path d="M44 44h92v81H44Z" fill="#d8cbe2"/>'+text('?',90,103,48))
put('everything','<circle cx="43" cy="66" r="22" fill="#d4a594"/><rect x="79" y="43" width="38" height="44" rx="5" fill="#b7cbc6"/><path d="m126 106 20-42 20 42Z" fill="#ddc88d"/><path d="m30 122 12 10 19-23m17 13 12 10 19-23m17 13 12 10 19-23" fill="none" stroke="#7b9871"/>')
put('nothing','<rect x="28" y="32" width="124" height="101" rx="10" fill="#f8eedb"/>'+text('0',90,109,60))
for name,mark in [('somewhere','?'),('anywhere','?'),('everywhere','✓'),('nowhere','0')]:
 put(name,'<path d="m20 43 45-17 50 18 45-17v96l-45 17-50-17-45 17Z" fill="#d8e1c5"/><path d="M65 26v97M115 44v96" fill="none" stroke="#adbb9a"/>'+text(mark,90,106,52))
put('knock','<rect x="86" y="17" width="68" height="127" rx="5" fill="#cdb797"/><circle cx="140" cy="88" r="5" fill="#a28964"/><path d="M23 93h31V69q0-15 11-14 11 0 10 13v16q12 4 10 15l-12 20H23Z" fill="#e5c1a2"/><path d="m57 32 7 11m24-15-7 13m17 0-9 9" fill="none" stroke="#c79d56"/>')
put('quiet','<path d="M33 66h27l33-27v85l-33-26H33Z" fill="#c7d7c0"/><path d="M116 66v32m18-40v48" stroke="#a8bba2"/><path d="m33 132 118-104" stroke="#9e8b86"/>')
put('impossible','<path d="M30 43h120v81H30Z" fill="#e7d4bf"/><path d="m62 57 56 56m0-56-56 56" stroke="#b4796b" stroke-width="8"/>')
put('invite','<rect x="24" y="40" width="132" height="92" rx="9" fill="#e5d4ec"/><path d="m24 43 66 49 66-49" fill="none"/><path d="m78 23 12-13 12 13-12 17Z" fill="#e4be78"/>')
put('joke','<path d="M29 27h122v85H90l-27 23v-23H29Z" fill="#eadcc0"/><path d="M57 61q10-12 20 0m27 0q10-12 20 0M65 79q27 28 52-1" fill="none"/>')
put('lemonade','<path d="M52 23h57l9 24v86H44V47Z" fill="#fae7a0"/><path d="M119 55h12q26 0 23 26t-34 26" fill="none"/><path d="M49 59h66" stroke="#d1b576"/><circle cx="75" cy="93" r="19" fill="#fff6c9"/><path d="M75 74v38M56 93h38m-32-13 26 26m0-26-26 26" stroke="#dec470" stroke-width="2"/>')
put('asleep','<path d="M24 90h131v39H24Z" fill="#bea9d0"/><rect x="24" y="83" width="48" height="25" rx="10" fill="#f5ebd9"/><path d="M23 73v72m132-49v49" stroke="#9e8b77"/>'+text('Z',121,52,37)+text('z',91,68,25))
put('glasses','<rect x="23" y="60" width="55" height="43" rx="17" fill="#d7e7e3"/><rect x="103" y="60" width="55" height="43" rx="17" fill="#d7e7e3"/><path d="M78 74q13-10 25 0M23 72l-6-29m141 29 6-29" fill="none"/>')
put('glass','<path d="M51 32h78l-10 102H61Z" fill="#d7e7e3"/><path d="M56 79h68" stroke="#b8cfd0"/>')
put('garden','<path d="M18 135q15-47 39-19 28-46 54-6 30-43 51 25" fill="#bacfa4"/><path d="M49 116V64m82 51V57" stroke="#8caa79"/><g fill="#e8c5d1"><circle cx="49" cy="51" r="19"/><circle cx="131" cy="48" r="19"/></g><g fill="#e3c479"><circle cx="49" cy="51" r="7"/><circle cx="131" cy="48" r="7"/></g>')
put('window','<rect x="28" y="24" width="124" height="112" rx="8" fill="#c4dce0"/><path d="M90 24v112M28 80h124" stroke="#b6a07f" stroke-width="7"/>')
put('door','<rect x="48" y="18" width="84" height="127" rx="7" fill="#cbb393"/><rect x="59" y="30" width="62" height="46" fill="#cbded4"/><circle cx="115" cy="104" r="5" fill="#9d8260"/>')
put('left','<path d="M38 24h104l-9 112H47Z" fill="#ecede2"/><path d="M46 109h89l-2 27H47Z" fill="#d8c58b"/>')
for name,source in [('none','assets/unit113-114/none.svg'),('at-all','assets/unit113-114/no.svg'),('beer','assets/unit83-84/beer.svg'),('milk','assets/unit83-84/milk.svg'),('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
tray='<path d="m19 49 22-24h99l21 24v88H19Z" fill="#e2c9a4"/><path d="M19 49h142v60H19Z" fill="#fff4df"/><path d="M19 109h142v28H19Z" fill="#d1b38b"/>'
put('box-empty',tray)
put('box-ball',tray+'<circle cx="90" cy="80" r="23" fill="#d39d8f"/><path d="M69 72q23 21 43 1" fill="none"/>')
put('box-books',tray+'<rect x="38" y="54" width="46" height="48" rx="3" fill="#bacdba"/><rect x="99" y="54" width="43" height="48" rx="3" fill="#c7bbd5"/><path d="M45 61v34M106 61v34" stroke="#f5ecd7"/>')
put('search-map','<rect x="9" y="9" width="342" height="162" rx="14" fill="#f8f0df"/><g fill="#e3e6d5"><rect x="22" y="30" width="92" height="91" rx="7"/><rect x="134" y="30" width="92" height="91" rx="7"/><rect x="246" y="30" width="92" height="91" rx="7"/></g>'+''.join(text(label,x,65,20)+f'<path d="m{x-20} 92 14 12 25-29" stroke="#65885c" stroke-width="6" fill="none"/>' for label,x in [('Desk',68),('Chair',180),('Shelf',292)]),'0 0 360 180')
(d/'garden-house.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#f4ead8"/><path d="M0 533h1000v187H0Z" fill="#dfd3bb"/><g stroke="#d5c5ac" stroke-width="3"><path d="M0 62h1000M0 150h1000M0 238h1000M0 326h1000M0 414h1000M0 502h1000M90 62v88m220 0v88m220-176v88m220 0v88M90 238v88m220 0v88m220-176v88m220 0v88"/></g><rect x="750" y="350" width="195" height="276" rx="12" fill="#c5d1af" stroke="#acb58f" stroke-width="8"/><rect x="782" y="378" width="130" height="78" rx="5" fill="#e5eadb"/><circle cx="913" cy="514" r="8" fill="#9e8a62"/><rect x="551" y="370" width="145" height="150" rx="8" fill="#d1e2df" stroke="#baaa8e" stroke-width="8"/><path d="M622 370v150M551 444h145" stroke="#baaa8e" stroke-width="7"/><ellipse cx="440" cy="655" rx="390" ry="34" fill="#d4c7af"/></svg>\n',encoding='utf-8')
(d/'garden-view.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#eff3df"/><path d="M0 505q80-100 160-18 130-146 240-10 100-100 210 10 120-150 230-30 91-69 160 12v251H0Z" fill="#d0ddbb"/><path d="M0 620q280-70 500 0t500 0v100H0Z" fill="#e6d9bc"/><g fill="none" stroke="#c2cda9" stroke-width="8"><path d="M31 521V360h185v161M783 521V360h185v161M31 412h185m567 0h185"/></g><g fill="#d5bdd7"><circle cx="103" cy="526" r="13"/><circle cx="899" cy="530" r="15"/><circle cx="173" cy="569" r="11"/></g></svg>\n',encoding='utf-8')
(d/'house-window.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#f4ead8"/><path d="M0 533h1000v187H0Z" fill="#dfd3bb"/><g fill="none" stroke="#d5c5ac" stroke-width="3"><path d="M0 62h1000M0 150h1000M0 238h1000M0 326h1000M0 414h1000M0 502h1000"/></g><rect x="45" y="350" width="180" height="276" rx="12" fill="#c5d1af" stroke="#acb58f" stroke-width="8"/><circle cx="196" cy="514" r="8" fill="#9e8a62"/><rect x="762" y="355" width="200" height="187" rx="8" fill="#d1e2df" stroke="#baaa8e" stroke-width="8"/><path d="M862 355v187M762 448h200" stroke="#baaa8e" stroke-width="7" fill="none"/><ellipse cx="440" cy="655" rx="390" ry="34" fill="#d4c7af"/></svg>\n',encoding='utf-8')
print('115–116 word icons, three open boxes, three-spot search map and story camera backgrounds built.')
