from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit133-134';d.mkdir(exist_ok=True)
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
paper='<rect x="23" y="21" width="134" height="120" rx="7" fill="#f3e9d3"/><path d="M39 42h102M39 60h102M39 80h47m13 0h42m-102 20h47m13 0h42m-102 20h102" fill="none" stroke="#a7977c"/>'
put('newspaper',paper)
put('reporter','<rect x="29" y="31" width="88" height="112" rx="7" fill="#e5dac0"/><path d="M43 27v18m18-18v18m18-18v18m18-18v18M48 63h48m-48 21h48m-48 21h30" fill="none"/><path d="m112 118 31-85 15 6-31 85-20 17Z" fill="#d3b27c"/>')
put('sensational','<path d="m90 15 14 29 32-13-5 32 32 12-27 21 14 30-33-4-16 26-20-25-32 9 9-32-28-18 30-17-2-33 30 13Z" fill="#e8c49a"/>'+label('!',96,108,61))
put('wonder','<path d="M22 27h136v83h-50l-30 28v-28H22Z" fill="#d8e3e7"/>'+label('?',90,89,49))
put('coat','<path d="m62 24-29 21-18 54 26 10 15-30-5 66h78l-5-66 15 30 26-10-18-54-29-21Z" fill="#b99472"/><path d="m62 24 28 27-17 24 17 18v52m28-121L90 51l17 24-17 18" fill="none" stroke="#80664f"/>')
put('dress','<path d="m58 21 32 13 32-13 15 30-25 13 30 82H38l30-82-25-13Z" fill="#83adce"/><path d="M68 64h44" fill="none"/>')
put('film','<rect x="22" y="30" width="136" height="109" rx="7" fill="#abc1c9"/><path d="M22 54h136M23 30l21 24m11-24 21 24m11-24 21 24m11-24 21 24" fill="none"/><path d="m75 76 34 20-34 21Z" fill="#f6e9ce"/>')
put('retire','<path d="M41 62v78m98-78v78M31 53h118v55H31Z" fill="#b8c7b8"/><path d="M44 31h91v63H44Z" fill="#d8dfcb"/><path d="M18 112h145" fill="none"/><circle cx="139" cy="26" r="14" fill="#e8cd8e"/>')
put('another','<rect x="20" y="54" width="56" height="70" rx="4" fill="#e6d1a9"/><rect x="103" y="54" width="56" height="70" rx="4" fill="#bfd3db"/><path d="M79 33h24m-12-12v24" fill="none"/>')
put('tired','<circle cx="90" cy="78" r="56" fill="#e8caa6"/><path d="m54 65 21 5m30 0 21-5M78 105h25" fill="none" stroke-width="6"/>')
put('long-time','<path d="M20 88h137m-132-17-15 17 15 17m122-34 15 17-15 17" fill="none" stroke="#8da7b2" stroke-width="9"/><path d="M54 64v47m35-47v47m35-47v47" fill="none" stroke="#c2ae8c"/>')
for name,source in [('airport-icon','air'),('reading','reading'),('task-record','task-record'),('task-checked','task-checked')]:shutil.copyfile(r/'assets/unit131-132'/(source+'.svg'),d/(name+'.svg'))
put('dinner','<ellipse cx="90" cy="87" rx="51" ry="40" fill="#eee4ca"/><ellipse cx="90" cy="87" rx="33" ry="25" fill="#c7d8be"/><path d="M18 36v99m-8-99v32h16V36m136 0v99m0-99q-20 30 0 43" fill="none"/>')
put('finished',paper+'<path d="m94 97 14 14 29-34" fill="none" stroke="#789d87" stroke-width="9"/>')
put('source-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5ecda"/>'+''.join(label(a,94,y,23)+label(b,260,y,21) for a,b,y in [('Karen Marsh','speaks',44),('Alan Jones','writes',106),('Kate','reads aloud',168),('Liz','listens',230)])+'<path d="M18 64h324m-324 62h324m-324 62h324" fill="none" stroke="#c8bda2"/>',360,270)
put('date-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f5ecda"/>'+label('10 May',83,48,27)+label('Alan writes',248,48,24)+label('Karen arrived today.',180,99,26)+'<path d="M18 126h324" fill="none" stroke="#c8bda2"/>'+label('12 May',83,174,27)+label('Kate reads',248,174,24)+label('the same article',180,227,25),360,270)
put('airport','<rect width="1000" height="850" fill="#edf1ee"/><path d="M0 550h1000v300H0Z" fill="#d6d9d2"/><path d="M0 549h1000" fill="none" stroke="#a9b5b0" stroke-width="7"/><rect x="40" y="355" width="220" height="160" rx="12" fill="#c4d9e1"/><rect x="740" y="355" width="220" height="160" rx="12" fill="#c4d9e1"/><path d="M150 355v160m700-160v160" fill="none" stroke="#a2b5b6" stroke-width="8"/>',1000,850,True)
put('street','<rect width="1000" height="850" fill="#eff0e6"/><path d="M0 550h1000v300H0Z" fill="#ded2b9"/><path d="M0 549h1000" fill="none" stroke="#b8aa91" stroke-width="7"/><path d="M22 360h190v180H22Zm766 0h190v180H788Z" fill="#d0dece"/><path d="M22 360v-27h190v27M788 360v-27h190v27" fill="#98b6aa"/><path d="M43 392h147v15H43Zm0 42h147v15H43Zm766-42h147v15H809Zm0 42h147v15H809Z" fill="#f4ecdb" stroke="#b4b6a2"/>',1000,850,True)
print('133–134 native symbols, source/date records and two independent backgrounds built.')
