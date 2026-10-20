from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit117-118';d.mkdir(exist_ok=True)
font=TTFont(r/'assets/awards/fonts/award-nunito.woff2')
glyphs=font.getGlyphSet(location={'wght':400})
cmap=font.getBestCmap();units=font['head'].unitsPerEm
def put(name,body,box='0 0 180 160'):
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+box+'"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def label(value,x=90,y=91,size=22):
 # Outline the repository's real Nunito 400 in standalone SVG images.
 # This preserves the shared English face without external font requests.
 if not all(ord(c)<128 for c in value):
  return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{size}" stroke="none" fill="#624936">{value}</text>'
 advance=0;paths=[]
 for char in value:
  glyph=glyphs[cmap[ord(char)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
  advance+=glyph.width
 scale=size/units
 return f'<g transform="translate({x-advance*scale/2} {y}) scale({scale} {-scale})" stroke="none" fill="#624936">{"".join(paths)}</g>'
def coin(x,y,rx=19,ry=19):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#e3c57e"/><ellipse cx="{x}" cy="{y}" rx="{rx-5}" ry="{max(ry-4,2)}" fill="none" stroke="#bd9a56" stroke-width="2"/>'
put('coin',coin(90,80,49,49))
put('two-coins',coin(50,85,28,13)+coin(124,85,28,13))
put('coins-scattered',coin(24,105,18,8)+coin(73,48,18,8)+coin(119,112,18,8)+coin(158,65,18,8))
put('dining-room-icon','<path d="M38 76h104v18H38ZM48 94v42M132 94v42" fill="#ccb28d"/><path d="M16 61v61h28M164 61v61h-28" fill="none"/><ellipse cx="91" cy="72" rx="28" ry="8" fill="#f5eddc"/><path d="M77 49h27v21H77Z" fill="#b9ceca"/><path d="M104 52q16 0 12 13h-12" fill="none"/>')
put('mouth','<path d="M31 75q58-40 118 0-57 58-118 0Z" fill="#dba49b"/><path d="M31 75h118" fill="none"/><path d="M58 75q32 24 65 0" fill="#fff5e4"/>')
put('swallow','<path d="M37 40h44v39H37Z" fill="#dfbd86"/><path d="M49 49h21" stroke="#f9e3b4"/><path d="M117 37v72m-17-16 17 16 17-16" fill="none" stroke="#91ad96" stroke-width="7"/><path d="M27 130h126" stroke="#c8b7a0"/>')
put('toilet','<rect x="39" y="20" width="103" height="124" rx="9" fill="#d1dedc"/><rect x="57" y="40" width="66" height="47" rx="5" fill="#f7f0df"/>'+label('WC',90,72,24)+'<circle cx="124" cy="110" r="5" fill="#b29b77"/>')
put('later','<path d="M23 92h133m-17-16 17 16-17 16" fill="none" stroke="#98ae99" stroke-width="7"/><circle cx="42" cy="92" r="15" fill="#d6c6ac"/><circle cx="124" cy="92" r="15" fill="#e3bf7d"/>')
phone='<path d="M38 59q52-44 104 0l-14 27-22-13 5-16q-21-10-42 0l5 16-23 13Z" fill="#9bb7b0"/><path d="M52 85h76l24 49H28Z" fill="#bdcfc4"/><circle cx="90" cy="112" r="18" fill="#f4ead5"/><circle cx="90" cy="112" r="8" fill="#d6c29c"/>'
put('phone',phone);put('ring',phone+'<path d="m31 24 10 15m-22 5 16 5m112-25-10 15m22 5-16 5" fill="none" stroke="#ccaa61" stroke-width="6"/>')
put('breakfast','<ellipse cx="69" cy="111" rx="51" ry="21" fill="#f6eedc"/><path d="M35 100V66q-9-23 15-24h36q26 1 15 24v34Z" fill="#e2bc81"/><path d="M125 58h29v52h-29Z" fill="#adc5c7"/><path d="M155 64q22 0 16 23h-17" fill="none"/>')
for name,mark in [('look-for','?'),('find','✓')]:
 put(name,'<circle cx="76" cy="65" r="41" fill="#d5e4da"/><path d="m106 96 39 40" stroke="#ab9273" stroke-width="13"/>'+label(mark,76,82,44))
put('both','<rect x="22" y="35" width="58" height="89" rx="8" fill="#bcd1bf"/><rect x="100" y="35" width="58" height="89" rx="8" fill="#e0c69b"/><path d="m33 79 14 14 22-28m42 14 14 14 22-28" stroke="#77936f" fill="none"/>')
put('all','<rect x="18" y="27" width="144" height="111" rx="12" fill="#f5ecd7"/>'+''.join(f'<rect x="{x}" y="{y}" width="42" height="30" rx="5" fill="#b7cbb9"/>' for x,y in [(38,45),(100,45),(38,95),(100,95)]))
put('change',coin(36,75,20,20)+coin(57,103,16,16)+'<path d="M82 75h49m-12-10 12 10-12 10" fill="none"/><circle cx="145" cy="39" r="12" fill="#b5ccc8"/><path d="M132 105h27v27h-27Z" fill="#d3bdd8"/>')
put('floor','<path d="m28 37 124 0 18 101H10Z" fill="#dfcfb6"/><path d="M67 37 60 138m54-101 9 101M20 80h140" fill="none" stroke="#bfa88b"/>')
put('office','<rect x="22" y="73" width="137" height="18" rx="3" fill="#c2ad8e"/><path d="M33 91v51m116-51v51" fill="none"/><rect x="46" y="28" width="72" height="42" rx="6" fill="#c3d9d8"/><path d="M81 70v-7M126 48h17v24" fill="none"/>')
for name,two,point in [('when',False,True),('while',True,False),('just-as',True,True)]:
 put(name,'<path d="M25 47h132" stroke="#9bbdb5" stroke-width="18"/>'+('<path d="M51 94h92" stroke="#ceb6d1" stroke-width="18"/>' if two else '')+('<path d="M92 25v104" stroke="#b47f6d"/><circle cx="92" cy="47" r="9" fill="#bf8874"/>' if point else ''))
put('drop','<path d="M26 30h60v24H56v20H26Z" fill="#e1c3a6"/>'+coin(99,81,15,15)+'<path d="M126 62v51m-10-10 10 10 10-10" fill="none"/><path d="M34 139h118" stroke="#b8a486"/>')
put('slip','<path d="m37 61 49-10 12 26 36 14 2 25-88 11Z" fill="#b8a087"/><path d="M26 138h127M18 106l12-7m-5-18 11 2" fill="none" stroke="#a0b7b5"/><path d="M138 49q18 24 0 26-18-2 0-26Z" fill="#c6dedb"/>')
put('hurt','<rect x="29" y="51" width="122" height="59" rx="25" fill="#ead5b6" transform="rotate(-30 90 80)"/><rect x="68" y="53" width="44" height="54" rx="7" fill="#fbefda" transform="rotate(-30 90 80)"/><path d="M45 102h1m88-48h1" stroke="#b8a083" stroke-width="7"/>')
put('shave','<rect x="42" y="28" width="95" height="31" rx="7" fill="#b9c4c4"/><path d="M76 59h25v81H76Z" fill="#91b8b6"/><path d="M51 39h76M51 49h76" fill="none" stroke="#879a9c" stroke-width="2"/>')
put('boil','<path d="M39 71h103v59H39Z" fill="#c1d3c9"/><path d="M39 86H21v26h18m103-26h18v26h-18" fill="none"/><path d="M66 52q-13-13 0-25m28 25q-13-13 0-25m28 25q-13-13 0-25" fill="none" stroke="#b0bab0"/><path d="M29 136h123" stroke="#a68f75"/>')
put('dust','<path d="m77 79-33 65" stroke="#b39a78" stroke-width="12"/><path d="M60 80q-29-31 7-40 5-33 30-16 31-12 38 17 29 22-8 43Z" fill="#d4c6da"/><path d="m68 69 36-27m-25 34 43-19" stroke="#b9a5c1" fill="none"/>')
shutil.copyfile(d/'dust.svg',d/'housework.svg')
put('sit','<path d="M54 34v68h88M65 102v41m67-41v41" fill="none" stroke="#b4a083" stroke-width="10"/><path d="M68 48h32v43h31v34" fill="none" stroke="#a4bdba" stroke-width="14"/><circle cx="84" cy="27" r="14" fill="#dfc8ab"/>')
put('lie','<path d="M23 81v64m134-43v43M23 117h134" fill="none" stroke="#b5a185" stroke-width="8"/><rect x="31" y="87" width="119" height="28" rx="10" fill="#c2ced5"/><rect x="31" y="79" width="37" height="23" rx="9" fill="#f4e9d6"/>')
put('postman','<rect x="27" y="69" width="129" height="66" rx="10" fill="#c7b086"/><path d="M49 69V48q41-27 85 0v21" fill="none"/><rect x="62" y="27" width="60" height="45" rx="4" fill="#eee3cc"/><path d="m62 27 30 24 30-24" fill="none"/>')
put('parallel','<path d="M23 49h133M23 109h133" stroke="#b8cbbb" stroke-width="18"/><circle cx="66" cy="49" r="18" fill="#e2c794"/><circle cx="117" cy="109" r="18" fill="#d3bdd7"/>')
for name,source in [('note','assets/unit113-114/note.svg'),('ticket','assets/unit113-114/ticket.svg'),('knock','assets/unit115-116/knock.svg'),('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
# The independently reviewed diagrams use fixed coordinates: 18:00=54,
# 18:05=117, 18:10=180, 18:15=243, 18:20=306.
axis='<path d="M54 142h252" fill="none" stroke="#b8aa94" stroke-width="3"/>'+''.join(f'<path d="M{x} 137v10" fill="none" stroke="#b8aa94" stroke-width="2"/>'+label(t,x,170,20) for x,t in [(54,'18:00'),(180,'18:10'),(306,'18:20')])
put('timeline-reading','<rect x="8" y="8" width="344" height="177" rx="13" fill="#fff6e6"/>'+label('May: reading',180,38,21)+'<rect x="54" y="75" width="252" height="20" rx="9" fill="#8eb6bd" stroke="none"/><path d="M180 52v90" stroke="#b87562" stroke-width="3" fill="none"/><circle cx="180" cy="85" r="8" fill="#b87562"/>'+label('phone',227,62,17)+axis,'0 0 360 194')
put('timeline-parallel','<rect x="8" y="8" width="344" height="236" rx="13" fill="#fff6e6"/>'+label('May: cooking',180,35,21)+'<rect x="54" y="54" width="252" height="17" rx="8" fill="#8eb6bd" stroke="none"/>'+label('Ben: washing dishes',180,100,21)+'<rect x="117" y="117" width="126" height="17" rx="8" fill="#b1a0bf" stroke="none"/><path d="M180 44v30m0 36v44" stroke="#b87562" stroke-width="3" fill="none"/>'+''.join(label(t,x,198,20) for x,t in [(54,'18:00'),(180,'18:10'),(306,'18:20')])+label('18:05',117,155,20)+label('18:15',243,155,20)+'<path d="M54 175h252" stroke="#b8aa94" stroke-width="3" fill="none"/>','0 0 360 252')
(d/'dining-room.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 740" preserveAspectRatio="none"><rect width="1000" height="740" fill="#f3ecdc"/><path d="M0 530h1000v210H0Z" fill="#ddccb2"/><rect x="33" y="345" width="186" height="264" rx="13" fill="#dac5a3" stroke="#c4ae89" stroke-width="7"/><rect x="781" y="350" width="172" height="156" rx="12" fill="#d2e1d7" stroke="#bdaf95" stroke-width="7"/><path d="M866 350v156M781 429h172" stroke="#bdaf95" stroke-width="6" fill="none"/><path d="M300 525h400v28H300ZM325 553v74m350-74v74" fill="#c6b08e" stroke="#b39b79" stroke-width="6"/><ellipse cx="495" cy="520" rx="75" ry="15" fill="#f9eddb" stroke="#d8c8af" stroke-width="4"/><path d="M466 492h56v24h-56Z" fill="#d6b77c"/><ellipse cx="493" cy="680" rx="400" ry="28" fill="#d0bea2"/></svg>\n',encoding='utf-8')
(d/'phone-rooms.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 740" preserveAspectRatio="none"><rect width="500" height="740" fill="#f4edda"/><rect x="500" width="500" height="740" fill="#e4eaf0"/><path d="M0 540h500v200H0Z" fill="#dfd0b5"/><path d="M500 540h500v200H500Z" fill="#ccd5dc"/><path d="M500 340v390" fill="none" stroke="#acb0b3" stroke-width="5" stroke-dasharray="12 13"/><rect x="46" y="364" width="148" height="143" rx="9" fill="#d3e1d4" stroke="#c5b795" stroke-width="6"/><rect x="786" y="374" width="160" height="121" rx="8" fill="#f0efde" stroke="#bec7ce" stroke-width="6"/><path d="M797 511h153v20H797ZM809 531v103m130-103v103" fill="#bac5cd" stroke="#a8b4be" stroke-width="5"/></svg>\n',encoding='utf-8')
print('117–118 word icons, exact-time diagrams, coin props and story backgrounds built.')
