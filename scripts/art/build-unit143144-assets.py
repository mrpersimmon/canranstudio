from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit143-144';d.mkdir(exist_ok=True)
font=TTFont(r/'assets/awards/fonts/award-nunito.woff2');glyphs=font.getGlyphSet(location={'wght':400});cmap=font.getBestCmap();units=font['head'].unitsPerEm
def label(value,x=90,y=90,size=25):
 advance=0;paths=[]
 for char in value:
  glyph=glyphs[cmap[ord(char)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
  advance+=glyph.width
 scale=size/units
 return f'<g transform="translate({x-advance*scale/2} {y}) scale({scale} {-scale})" stroke="none" fill="#624936">{"".join(paths)}</g>'
def put(name,body,w=180,h=160,stretch=False):
 (d/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"'+(' preserveAspectRatio="none"' if stretch else '')+f'><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>\n',encoding='utf-8')
for name in ['task-record','task-checked','repair','exercise-books']:
 shutil.copyfile(r/f'assets/unit141-142/{name}.svg',d/(name+'.svg'))
def tree(x,y,scale=1):
 return f'<g transform="translate({x} {y}) scale({scale})"><path d="M35 65v58h17V65" fill="#ac8b67"/><path d="M12 71q-25-29 8-45-3-35 29-23 33-8 29 27 29 21 4 44Z" fill="#a3b28c"/></g>'
def basket(x,y,scale=1):
 return f'<g transform="translate({x} {y}) scale({scale})"><path d="m7 22 10 89h62l10-89" fill="#e4e3d0"/><path d="m17 40 62 52m-62-27 37 34m-15-66 40 36m-4-36-56 56m33-56-35 35m62-13-29 44" stroke="#99a18f" stroke-width="3"/><ellipse cx="48" cy="22" rx="41" ry="12" fill="#b6bbaa"/><ellipse cx="48" cy="20" rx="32" ry="7" fill="#f5efdd"/></g>'
def car(x,y,scale=1):
 return f'<g data-kind="car" transform="translate({x} {y}) scale({scale})"><path d="m3 20 10-3 9-15h30l12 15 12 4v21H3Z" fill="#a9b6ad"/><path d="M27 7h22l8 12H20Z" fill="#d3e1de"/><circle cx="19" cy="40" r="8" fill="#8d8575"/><circle cx="60" cy="40" r="8" fill="#8d8575"/><path d="M34 30h12" stroke="#c7ae87"/></g>'
def fridge(x,y,scale=1):
 return f'<g data-kind="refrigerator" transform="translate({x} {y}) scale({scale})"><rect x="0" y="0" width="43" height="80" rx="4" fill="#d6d6c4"/><path d="M0 28h43M8 10v9m0 20v17" fill="none"/><path d="m29 62 6 5m-21 5 7 2" stroke="#b29b7f" stroke-width="3"/></g>'
def scraps():
 return '<path d="m18 210 20-7 15 16-29 4Z" fill="#f0e6d1"/><path d="m306 212 20-8 20 15-28 9Z" fill="#ece2cf"/><ellipse cx="270" cy="206" rx="21" ry="13" fill="#8f8a7e"/><ellipse cx="270" cy="206" rx="10" ry="5" fill="#d4c9a8"/><path d="m91 205 7-29 13 3-4 31Z" fill="#c2d2c3"/><path d="m106 177 3-7" fill="none"/><path d="M162 192h30v26h-30Z" fill="#af8c68"/><path d="m168 201 15 9" stroke="#c2784c"/><path d="m217 222 20-6" stroke="#b5a17d" stroke-width="6"/><path d="m217 222 5-2" stroke="#8b6d4e" stroke-width="6"/>'
put('wood',tree(7,22,.75)+tree(67,7,.93)+tree(111,45,.65))
put('surround','<path d="m62 79 30-24 30 24v49H62Z" fill="#ddc7a1"/>'+''.join(tree(x,y,.32) for x,y in [(6,7),(68,-5),(130,7),(6,90),(130,90)])+'<path d="M57 42q33-20 66 0M56 145q33 16 67 0" fill="none" stroke="#9cab88"/>')
put('beauty-spot','<path d="m13 118 49-66 36 38 30-31 40 59Z" fill="#a8b797"/><path d="M13 120h155l-36 27H49Z" fill="#b9d0cf"/><circle cx="124" cy="30" r="17" fill="#e4c78c"/>')
put('hundred','<rect x="18" y="37" width="146" height="92" rx="12" fill="#e9ddbe"/>'+label('100',90,102,48))
put('city','<path d="M15 145V56h40v89m9 0V24h50v121m10 0V69h39v76" fill="#b4c4c1"/>'+''.join(f'<rect x="{x}" y="{y}" width="9" height="11" fill="#f3e4bd" stroke-width="2"/>' for x,y in [(27,72),(27,99),(76,44),(96,44),(76,72),(96,72),(76,100),(96,100),(137,88),(137,114)]))
put('through',tree(7,13,.7)+tree(112,12,.7)+'<path d="M45 146q28-36 45-65 17-29 19-59m-11 10 11-10 7 14" fill="none" stroke="#b89468" stroke-width="8"/>')
put('visitor','<circle cx="77" cy="40" r="21" fill="#e9c9a6"/><path d="M50 70h53l13 53H37Z" fill="#b5c3a0"/><path d="m59 124-7 28m42-28 10 28M50 76l-22 32m76-30 27 21" fill="none" stroke-width="8"/><rect x="119" y="96" width="31" height="40" rx="4" fill="#d3b98d"/>')
put('tidy','<path d="M25 24v122h135V24M25 85h135" fill="none"/><rect x="39" y="36" width="27" height="48" fill="#aebfa4"/><rect x="70" y="36" width="27" height="48" fill="#c5b797"/><rect x="101" y="36" width="27" height="48" fill="#afc5cc"/><rect x="45" y="101" width="88" height="31" fill="#dfc9a6"/>')
put('litter','<path d="m24 72 41-23 28 26-20 42-43-10Z" fill="#e5dcc7"/><path d="m107 58 30-12 20 60-32 13Z" fill="#bbcbb7"/><path d="m73 130 34-15 29 24-43 10Z" fill="#d8c2a2"/>')
put('litter-basket',basket(40,20,1.1))
put('place','<path d="M30 136h120" fill="none" stroke-width="7"/><rect x="60" y="87" width="60" height="43" rx="3" fill="#ccb08a"/><path d="M90 18v50m-16-15 16 15 16-15" fill="none" stroke="#91a6a5" stroke-width="7"/>')
put('throw','<circle cx="41" cy="36" r="17" fill="#e5c8a7"/><path d="M40 60v47m0-38 36-19m-36 25-19 21m20 11-20 42m20-42 27 42" fill="none" stroke="#8d9e8b" stroke-width="10"/><circle cx="97" cy="36" r="12" fill="#d5b27f"/><path d="M114 37q34 10 40 55m-12-12 12 12 7-17" fill="none" stroke-dasharray="5 8"/>')
put('rubbish','<path d="m29 59 35-20 28 28-15 38-49-9Z" fill="#e4d6bd"/><path d="M101 65h39v56h-39Z" fill="#b49b79"/><ellipse cx="121" cy="64" rx="20" ry="7" fill="#dfcbad"/><path d="m47 134 30-13 54 21H41Z" fill="#bec6ad"/>')
put('count','<circle cx="39" cy="55" r="18" fill="#b4c4a4"/><circle cx="90" cy="55" r="18" fill="#b4c4a4"/><circle cx="141" cy="55" r="18" fill="#b4c4a4"/>'+label('1  2  3',90,123,32))
put('cover','<rect x="37" y="77" width="110" height="61" fill="#b9ac91"/><path d="m24 49 129-6 7 75-38-18-25 12-38-16-33 12Z" fill="#b5c7cb"/>')
put('piece','<path d="M29 27h117v110H29Z" fill="#e7ddc6"/><path d="m109 27-5 18 14 9-13 19 19 14-11 22 33 28V27Z" fill="#faf3e2"/><path d="m109 27-5 18 14 9-13 19 19 14-11 22" fill="none" stroke-dasharray="4 7"/>')
put('tyre','<ellipse cx="90" cy="84" rx="65" ry="55" fill="#898678"/><ellipse cx="90" cy="84" rx="34" ry="29" fill="#e8e2cc"/><path d="m49 38 9 12m64-12-9 12m-78 36 17 1m74-1 17-1m-92 46 8-12m63 12-8-12" fill="none" stroke="#b5ad97" stroke-width="5"/>')
put('rusty','<path d="M38 40h106v86H38Z" fill="#a8977e"/><ellipse cx="91" cy="40" rx="53" ry="16" fill="#d1bea1"/><ellipse cx="91" cy="126" rx="53" ry="16" fill="#9d8b6d"/><path d="m55 62 29-4 10 20-24 12-18-13m49 25 24-13 12 28-26 12" fill="#bd7f50" stroke="none"/>')
put('among','<circle cx="38" cy="45" r="20" fill="#b2c49c"/><circle cx="140" cy="44" r="20" fill="#b2c49c"/><circle cx="42" cy="126" r="20" fill="#b2c49c"/><circle cx="141" cy="125" r="20" fill="#b2c49c"/><path d="m90 59 23 25-23 25-23-25Z" fill="#c6a67b"/>')
put('prosecute','<rect x="37" y="23" width="106" height="124" rx="6" fill="#e5d7bb"/>'+label('CASE',90,54,23)+'<path d="M90 65v57m-33-41h66M66 81l-16 25h32Zm48 0-16 25h32ZM66 128h48" fill="none" stroke="#8a9e9b" stroke-width="5"/>')
put('refrigerator',fridge(53,11,1.7))
put('sign','<path d="M85 98v52h15V98" fill="#b29672"/><rect x="20" y="25" width="140" height="77" rx="5" fill="#e6d2ac"/><path d="M39 48h102M39 73h77" fill="none" stroke="#b3a07e"/>')
put('tin','<path d="M44 42h93v83H44Z" fill="#b7c1af"/><ellipse cx="90" cy="42" rx="46" ry="15" fill="#d4d8c6"/><ellipse cx="90" cy="125" rx="46" ry="15" fill="#a7b19c"/><path d="M44 65h93m-93 36h93" fill="none" stroke="#dce0cb"/>')
put('serve','<path d="M20 111h140" fill="none" stroke-width="7"/><path d="M34 105a56 56 0 0 1 112 0Z" fill="#b4c3bb"/><path d="M82 40h17m-9 0v10M62 134h63" fill="none" stroke-width="7"/>')
for name,n in [('thief',1),('thieves',2)]:
 body=''
 for x in ([65] if n==1 else [25,105]):body+=f'<circle cx="{x+20}" cy="49" r="18" fill="#d4bd9b"/><path d="M{x} 79h40v45H{x}Z" fill="#a9b7a3"/><path d="M{x+4} 44h32" stroke="#8a806e" stroke-width="9"/>'
 put(name,body)
put('town-view',tree(15,49,1)+tree(252,42,1)+tree(112,0,.7)+'<path d="m127 133 55-41 54 41v81H127Z" fill="#d9c4a0"/><path d="m115 133 67-53 67 53" fill="none" stroke="#a38969" stroke-width="7"/><rect x="163" y="166" width="34" height="48" fill="#abc4c4"/>',360,230)
put('baskets-view',tree(8,0,1.35)+tree(233,0,1.35)+basket(37,118,.8)+basket(244,118,.8),360,230)
put('litter-view',tree(15,0,.9)+tree(254,0,.9)+basket(45,99,.85)+basket(244,99,.85)+scraps(),360,240)
put('inventory-view',''.join(car(x,y,.87) for x,y in [(16,12),(102,12),(188,12),(274,12),(59,71),(145,71),(231,71)])+''.join(fridge(x,139,.95) for x in [92,162,232]),360,230)
board='<path d="M169 160v63h22v-63" fill="#b09671"/><rect x="9" y="10" width="342" height="159" rx="8" fill="#ead8b2"/>'
put('notice-front',board+label('Anyone who leaves',180,52,25)+label('litter in these woods',180,96,25)+label('will be prosecuted!',180,140,25),360,230)
put('notice-back',board+'<path d="M22 62h316M22 115h316M56 18v144m249-144v144" fill="none" stroke="#bca179"/>',360,230)
put('ground-litter','<path d="m12 54 28-9 16 23-36 6Z" fill="#ede2ca"/><path d="m74 63 9-32 13 3-4 34Z" fill="#b6c8b2"/><path d="m85 31 2-9" fill="none"/><ellipse cx="276" cy="63" rx="25" ry="17" fill="#8e8a78"/><ellipse cx="276" cy="63" rx="12" ry="7" fill="#c5c5aa"/><path d="M316 33h28v34h-28Z" fill="#b38d69"/><path d="m320 40 17 16" stroke="#c67d4d"/><path d="m113 76 20-4" stroke="#b99a76" stroke-width="5"/>',360,90)
put('placement-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5eedb"/>'+label('16 Oct 2026 · 10:00',180,36,24)+'<path d="M16 52h328m-328 103h328" fill="none" stroke="#c4baa1"/>'+label('Area A',66,105,25)+label('placed · 09:00',241,96,23)+label('done today',241,130,23)+label('Area B',66,211,25)+label('not yet · 17 Oct',239,201,22)+label('planned',241,236,23),360,270)
put('inspection-record','<rect x="5" y="5" width="350" height="295" rx="14" fill="#f5eedb"/>'+label('15 October 2026',180,35,24)+'<path d="M16 51h328m-328 92h328m-328 91h328" fill="none" stroke="#c4baa1"/>'+label('gate repair',180,87,24)+label('08:30 — 09:30',180,122,27)+label('room cleaning finished',180,179,22)+label('08:00',180,213,27)+label('inspection · 09:00',180,270,26),360,305)
put('woods-world','<rect width="1000" height="1000" fill="#edf0df"/><path d="M0 510q240-110 500 0t500 0v490H0Z" fill="#c9d2b8"/><path d="M0 880q270-115 500-12t500 0v132H0Z" fill="#c5bda1"/>'+tree(-22,327,2.3)+tree(813,320,2.3)+'<path d="M0 956h1000" stroke="#b1ab8c" stroke-width="6"/>',1000,1000,True)
print('143–144 icons, seven-car/three-fridge illustration, notice and independent records built.')
