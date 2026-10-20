from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit135-136';d.mkdir(exist_ok=True)
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
for name,unit,source in [('report','133-134','newspaper'),('retire','133-134','retire'),('mind','131-132','mind'),('task-record','133-134','task-record'),('task-checked','133-134','task-checked')]:shutil.copyfile(r/f'assets/unit{unit}/{source}.svg',d/(name+'.svg'))
put('future','<rect x="23" y="29" width="134" height="112" rx="12" fill="#e8e0ed"/><path d="M23 55h134M51 17v24m78-24v24" fill="none"/><path d="M52 98h75m-19-20 22 20-22 20" fill="none" stroke="#89779c" stroke-width="9"/>')
put('married','<circle cx="65" cy="91" r="37" fill="none" stroke="#bb9857" stroke-width="10"/><circle cx="115" cy="91" r="37" fill="none" stroke="#d0af70" stroke-width="10"/><path d="m103 42 12-19 13 19-13 15Z" fill="#b5cfce"/>')
put('hotel','<rect x="29" y="20" width="122" height="126" rx="8" fill="#d8cce0"/>'+label('HOTEL',90,49,23)+'<path d="M77 146V110h27v36" fill="#b1c5c2"/>'+''.join(f'<rect x="{x}" y="67" width="18" height="24" rx="2" fill="#f5e8cc"/>' for x in [47,82,117]))
put('latest','<rect x="38" y="23" width="116" height="114" rx="5" fill="#c7c0d0"/><rect x="21" y="41" width="116" height="107" rx="5" fill="#f0e5ce"/>'+label('NEW',79,84,27)+'<path d="M40 103h77m-77 18h77" fill="none" stroke="#a79581"/>')
put('introduce','<rect x="20" y="35" width="140" height="101" rx="12" fill="#e4d7e8"/><path d="M67 35V20h46v15" fill="none"/>'+label('Hello',90,81,27)+'<path d="M50 106h80" fill="none" stroke="#a48a6f"/>')
put('really','<path d="M25 25h130v82h-47l-31 27v-27H25Z" fill="#e4d7e8"/>'+label('!',90,87,52))
put('let','<path d="M49 63V44a41 41 0 0 1 82-3" fill="none" stroke="#8da79b" stroke-width="10"/><rect x="40" y="65" width="103" height="77" rx="9" fill="#d3dfcd"/><path d="m67 104 16 16 36-39" fill="none" stroke="#748e79" stroke-width="8"/>')
put('husband','<rect x="21" y="30" width="138" height="107" rx="10" fill="#e8dfc8"/>'+label('HUSBAND',90,69,20)+'<circle cx="91" cy="104" r="22" fill="none" stroke="#b79b66" stroke-width="8"/>')
put('sixth','<path d="M28 31h124v111H28Z" fill="#e6d9ec"/>'+label('6th',90,111,61))
put('problem','<rect x="24" y="24" width="132" height="107" rx="8" fill="#b8c8bd"/><path d="M44 131v16m93-16v16" fill="none"/>'+label('?',90,99,55))
put('return','<path d="M90 25h64v120H90Z" fill="#d6c8dd"/><circle cx="137" cy="84" r="3" fill="#624936"/><path d="M130 91H24m23-22L24 91l23 22" fill="none" stroke="#8aa499" stroke-width="10"/>')
put('week-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5ecda"/>'+label('2026  |  Monday–Sunday',180,37,22)+''.join(label(text,180,y,26) for text,y in [('19–25 October',92),('26 October–1 November',162),('2–8 November',232)])+'<path d="M18 54h324m-324 64h324m-324 71h324" fill="none" stroke="#c8bda2"/>',360,270)
put('introduction-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5ecda"/>'+''.join(label(a,82,y,26)+label(b,252,y,24) for a,b,y in [('Mia','introduces',57),('Ben','introduced',137),('Sue','listens',217)])+'<path d="M18 84h324m-324 80h324" fill="none" stroke="#c8bda2"/>',360,270)
put('hotel-room','<rect width="1000" height="850" fill="#f2edf2"/><path d="M0 550h1000v300H0Z" fill="#dcd2cd"/><path d="M0 549h1000" fill="none" stroke="#bcaea7" stroke-width="7"/><path d="M40 530V385q0-95 95-95t95 95v145Z" fill="#d8cbdc"/><path d="M770 530V385q0-95 95-95t95 95v145Z" fill="#d8cbdc"/><path d="M62 530V395q0-73 73-73t73 73v135M792 530V395q0-73 73-73t73 73v135" fill="#edf0e7" stroke="#bcaea7"/>',1000,850,True)
put('street','<rect width="1000" height="850" fill="#f0eee6"/><path d="M0 550h1000v300H0Z" fill="#dfd1ba"/><path d="M0 549h1000" fill="none" stroke="#b8aa91" stroke-width="7"/><path d="M22 360h190v180H22Zm766 0h190v180H788Z" fill="#d3cbdc"/><path d="M22 360v-27h190v27M788 360v-27h190v27" fill="#a898b7"/><path d="M43 392h147v15H43Zm0 42h147v15H43Zm766-42h147v15H809Zm0 42h147v15H809Z" fill="#f4ecdb" stroke="#b4b6a2"/>',1000,850,True)
print('135–136 native icons, independently dated weeks, introduction roles, and two backgrounds built.')
