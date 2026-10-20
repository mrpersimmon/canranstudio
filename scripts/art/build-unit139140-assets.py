from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit139-140';d.mkdir(exist_ok=True)
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
for name in ['task-record','task-checked']:shutil.copyfile(r/f'assets/unit137-138/{name}.svg',d/(name+'.svg'))
put('extra','<rect x="27" y="27" width="81" height="111" rx="6" fill="#d4e0e5"/><path d="M44 49h46m-46 22h46m-46 22h30" fill="none" stroke="#9b9c8a"/><circle cx="133" cy="109" r="30" fill="#ead9b9"/><path d="M117 109h32m-16-16v32" fill="none" stroke-width="7"/>')
put('overseas','<circle cx="88" cy="83" r="55" fill="#c8dcdf"/><ellipse cx="88" cy="83" rx="28" ry="55" fill="none" stroke="#98b4b5"/><path d="M35 68h107m-107 32h107M88 28v110" fill="none" stroke="#98b4b5"/><path d="m110 25 45 25-46 9 10-14Z" fill="#c6ae85"/><path d="M22 132q41 27 109-3" fill="none" stroke-dasharray="5 9"/>')
put('engineering','<rect x="21" y="26" width="139" height="111" rx="6" fill="#c5d9df"/><path d="M34 115h113M45 115V58m91 57V58M45 64q44 66 91 0m-73 32v19m25-10v10m25-20v20" fill="none" stroke="#f8f2e6" stroke-width="6"/>')
put('company','<rect x="30" y="23" width="122" height="123" rx="5" fill="#bdcfd7"/>'+label('COMPANY',91,49,20)+''.join(f'<rect x="{x}" y="{y}" width="17" height="22" fill="#f6e9cb"/>' for x in [49,82,115] for y in [65,99])+'<path d="M79 146v-25h24v25" fill="#e3d0aa"/>')
put('line','<rect x="19" y="39" width="30" height="72" rx="8" fill="#a9becb"/><rect x="131" y="39" width="30" height="72" rx="8" fill="#a9becb"/><path d="M49 75c17-55 65 55 82 0" fill="none" stroke="#718f96" stroke-width="8"/>')
put('engineer','<path d="M34 85q0-52 55-52t55 52Z" fill="#d6b577"/><path d="M22 85h135v18H22ZM77 32v49m23-49v49" fill="#e3c790"/><path d="m64 136 17-17 17 17-17 16Z" fill="#bed0d4"/><path d="m113 114 25 25" fill="none" stroke-width="9"/>')
put('repair','<path d="m42 25 29 8 4 23 65 65-19 19-65-65-23-4-8-29 21 17 13-13Z" fill="#b9cbd2"/><path d="m40 138 64-64" fill="none" stroke="#b59b7b" stroke-width="12"/>')
put('invite','<rect x="21" y="39" width="140" height="102" rx="7" fill="#e9d6b6"/><path d="m22 42 68 51 70-51m-137 95 47-45m89 45-47-45" fill="none"/>'+label('TO',90,29,21))
put('by-way','<path d="M19 24h142v86h-55l-29 27v-27H19Z" fill="#d5e0e6"/><path d="M49 73h44q29 0 29-27m-12 9 12-9 10 14" fill="none" stroke="#9e987c" stroke-width="7"/>')
put('finish','<path d="M39 145V20m0 6h107l-22 29 22 29H39" fill="#c3d5be" stroke-width="6"/><path d="m63 54 15 15 34-31" fill="none" stroke="#69866b" stroke-width="7"/>')
put('late','<rect x="28" y="29" width="124" height="110" rx="9" fill="#dfd5c0"/>'+label('later',90,94,33)+'<path d="M51 116h77m-16-12 16 12-16 12" fill="none" stroke="#8b9da6" stroke-width="6"/>')
put('telephone','<path d="M34 60q56-41 112 0l-8 20-28-8-4-18H74l-4 18-28 8Z" fill="#8ca7ba"/><path d="m48 81-18 61h120l-18-61Z" fill="#adc0c9"/>'+''.join(f'<rect x="{x}" y="{y}" width="13" height="10" rx="2" fill="#f4ead8" stroke-width="2"/>' for x in [61,84,107] for y in [96,116]))
put('tired','<circle cx="89" cy="85" r="51" fill="#f0d3af"/><path d="M55 71h21m26 0h21" fill="none"/><ellipse cx="90" cy="103" rx="12" ry="17" fill="#bd967f"/>')
put('question','<path d="M23 20h134v100h-45l-31 24v-24H23Z" fill="#d5e1e5"/>'+label('?',90,96,68))
put('reading','<path d="M19 36q35-15 70 5 35-20 72-5v106q-37-18-72 0-35-18-70 0Z" fill="#e9dbc0"/><path d="M89 41v101M34 66h35m-35 24h35m39-24h35m-35 24h35" fill="none" stroke="#b09c7e"/>')
put('homework','<rect x="30" y="20" width="111" height="126" rx="5" fill="#efe5cf"/><path d="M49 48h72m-72 24h59m-59 24h44m-44 24h53" fill="none" stroke="#aaa68e"/><path d="m112 122 28-65 13 6-28 65-18 12Z" fill="#d8b57e"/>')
put('identity-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5eddb"/>'+label('Alex Lee · engineer',180,39,25)+label('Card A',75,111,22)+label('Green Engineering',239,111,20)+label('Card B',75,207,22)+label('River Telephones',241,207,20)+'<path d="M17 59h326m-326 88h326" fill="none" stroke="#c6bba2"/>',360,270)
put('finish-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5eddb"/>'+label('16 October 2026',180,37,25)+label('arrival plan',103,107,24)+label('18:00',270,107,27)+label('work ends',103,203,24)+label('?',270,207,40)+'<path d="M17 57h326m-326 88h326" fill="none" stroke="#c6bba2"/>',360,270)
put('phone-world','<rect width="494" height="850" fill="#eee9df"/><rect x="506" width="494" height="850" fill="#e4eef0"/><path d="M0 550h494v300H0Z" fill="#d9c9b3"/><path d="M506 550h494v300H506Z" fill="#cedbc6"/><rect x="494" width="12" height="850" fill="#fff8e8"/><path d="M0 550h494m12 0h494" fill="none" stroke="#b9b6a0" stroke-width="7"/><path d="M25 365h176v160H25Z" fill="#d1d9da"/><path d="M43 383h140v123H43Z" fill="#efeade"/><path d="M760 520q31-97 66-17 38-123 75-14 36-59 71 31Z" fill="#ccddc4" stroke="none"/>',1000,850,True)
print('139–140 native icons, two independently specified information records and split phone background built.')
