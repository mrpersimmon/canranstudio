from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit137-138';d.mkdir(exist_ok=True)
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
for name,unit,source in [('task-record','135-136','task-record'),('task-checked','135-136','task-checked'),('train','95-96','train'),('car','65-66','car')]:
 source_path=r/f'assets/unit{unit}/{source}.svg'
 if source_path.exists():shutil.copyfile(source_path,d/(name+'.svg'))
put('football','<circle cx="90" cy="80" r="61" fill="#f6efdf"/><path d="m90 47 31 22-12 36H71L59 69Z" fill="#799180"/><path d="m90 47-4-27M59 69 31 57m40 48-17 24m55-24 19 25m-7-61 28-13" fill="none"/>')
put('pool','<path d="M38 67q-7 72 52 77 59-5 52-77Z" fill="#dce6d3"/>'+''.join(f'<ellipse cx="{x}" cy="{y}" rx="17" ry="8" fill="#ddbd77"/>' for x,y in [(54,43),(91,28),(125,45)])+'<path d="M90 47v22m-8-8 8 8 8-8" fill="none"/>')
put('win','<path d="M52 23h76v44q0 35-38 42-38-7-38-42Z" fill="#d8b774"/><path d="M52 32H28v22q0 28 33 28m67-50h24v22q0 28-33 28M90 109v24m-29 9h58" fill="none" stroke-width="8"/>')
put('world','<circle cx="90" cy="80" r="61" fill="#c2d8dd"/><ellipse cx="90" cy="80" rx="31" ry="61" fill="none" stroke="#a1b9b8"/><path d="M31 62h118M31 99h118M90 19v122" fill="none" stroke="#a1b9b8"/><path d="m53 38 18 8 2 20-20 16-16-20Zm53 34 22 2 15 29-25 21-18-18Z" fill="#87a37f" stroke-width="2"/>')
put('poor','<path d="M25 41h130v97H25Z" fill="#d5c6b4"/><path d="M25 41q65-35 130 0v31q-65 34-130 0Z" fill="#f4eadd"/><ellipse cx="88" cy="114" rx="18" ry="8" fill="#cfb179"/>')
put('depend','<path d="M31 30v115m118-115v115M31 94q59 52 118 0M31 60q59 52 118 0" fill="none" stroke="#799780" stroke-width="8"/><path d="M28 145h32m60 0h32" fill="none"/>'+label('on',90,53,24))
put('pools','<rect x="23" y="17" width="135" height="128" rx="5" fill="#f6efdf"/><path d="M39 62h103m-103 24h103m-103 24h103M64 62v66m27-66v66m26-66v66" fill="none" stroke="#b6ba9c"/>'+label('FOOTBALL',90,46,19))
put('pleasant','<circle cx="90" cy="83" r="52" fill="#f0d498"/><path d="M61 70q8-13 16 0m26 0q8-13 16 0M61 96q29 32 58 0" fill="none" stroke-width="6"/>')
put('dream','<path d="M44 107C2 108 15 54 46 53 50 10 107 13 119 47c45-12 62 57 18 60Z" fill="#dce6d7"/><circle cx="52" cy="126" r="9" fill="#dce6d7"/><circle cx="34" cy="145" r="5" fill="#dce6d7"/><path d="M70 88V64l22-17 23 17v24Z" fill="#e9cca4"/>')
put('nearly','<rect x="17" y="54" width="146" height="47" rx="15" fill="#f5eddb"/><path d="M32 67h107v21H32Z" fill="#8ba57f" stroke="none"/>'+label('nearly',90,134,25))
put('spend','<path d="M50 43h87l11 104H39Z" fill="#c7d8bf"/><path d="M70 44V29q23-23 45 0v15" fill="none"/><ellipse cx="25" cy="94" rx="15" ry="8" fill="#d8b87a"/><path d="M12 116h40m-10-9 10 9-10 9" fill="none"/>')
put('country','<path d="M10 129q35-65 84-13 31-61 76 10v24H10Z" fill="#a5bb91"/><path d="M52 61h71v76H52Z" fill="#eed7b0"/><path d="m39 65 49-39 48 39Z" fill="#bb8e77"/><path d="M81 137v-40h21v40" fill="#f3ecda"/><circle cx="144" cy="37" r="16" fill="#efd39c"/>')
put('window','<rect x="35" y="19" width="110" height="121" rx="5" fill="#c7dcdd"/><path d="M90 19v121M35 80h110" fill="none" stroke-width="8"/>')
put('train','<rect x="38" y="24" width="104" height="112" rx="20" fill="#b6cbbd"/><rect x="53" y="41" width="74" height="44" rx="5" fill="#f6eedf"/><circle cx="60" cy="111" r="8" fill="#f6d584"/><circle cx="121" cy="111" r="8" fill="#f6d584"/><path d="m54 137-15 16m86-16 15 16" fill="none"/>')
put('fall','<path d="M57 25v124m65-124v124M57 48h65M57 77h65M57 107h65M57 136h65" fill="none" stroke="#a78667" stroke-width="7"/><path d="M145 39v62m-11-13 11 13 11-13" fill="none" stroke="#b18a70" stroke-width="6"/>')
put('rain','<path d="M42 84C7 80 17 40 45 43 52 11 106 10 119 42c40-7 53 44 17 47Z" fill="#c2d0d1"/><path d="m53 109-10 22m46-22-10 22m46-22-10 22" fill="none" stroke="#87aeb7" stroke-width="7"/>')
put('bed','<path d="M23 65h133v65H23Z" fill="#c1cdb4"/><path d="M23 35v110m133-71v71M23 103h133" fill="none" stroke-width="7"/><rect x="34" y="49" width="46" height="29" rx="8" fill="#f5eada"/>')
put('car','<path d="M30 83 49 43h73l25 40 13 15v31H20V98Z" fill="#c8d9bf"/><path d="M57 54h55l15 28H45Z" fill="#eaf0e5"/><circle cx="48" cy="127" r="16" fill="#716350"/><circle cx="132" cy="127" r="16" fill="#716350"/>')
put('weather-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f7eedc"/>'+label('16 October 2026',180,39,26)+label('09:00',80,111,27)+label('RAIN',247,111,27)+label('10:00',80,207,27)+label('?',247,210,39)+'<path d="M17 58h326m-326 88h326" fill="none" stroke="#c1b79d"/>',360,270)
put('check-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f7eedc"/>'+label('Mia',180,39,26)+label('work',81,106,25)+label('finished',251,106,25)+label('teacher check',107,202,23)+label('not yet',270,202,24)+'<path d="M17 58h326m-326 88h326" fill="none" stroke="#c1b79d"/>',360,270)
put('living-room','<rect width="1000" height="850" fill="#edf0e4"/><path d="M0 550h1000v300H0Z" fill="#d9cfb8"/><path d="M0 550h1000" fill="none" stroke="#b5a88e" stroke-width="7"/><path d="M31 350h185v183H31Zm753 0h185v183H784Z" fill="#e6dcc7"/><path d="M50 370h147v145H50Zm753 0h147v145H803Z" fill="#c8d8ce"/><path d="M122 370v145m-72-73h147m679-72v145m-73-73h147" fill="none" stroke="#e6dcc7" stroke-width="10"/>',1000,850,True)
print('137–138 native icons, independent condition records and room background built.')
