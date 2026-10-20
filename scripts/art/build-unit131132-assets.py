from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit131-132';d.mkdir(exist_ok=True)
font=TTFont(r/'assets/awards/fonts/award-nunito.woff2');glyphs=font.getGlyphSet(location={'wght':400});cmap=font.getBestCmap();units=font['head'].unitsPerEm
def label(value,x=90,y=90,size=25):
 advance=0;paths=[]
 for char in value:
  glyph=glyphs[cmap[ord(char)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
  advance+=glyph.width
 scale=size/units;return f'<g transform="translate({x-advance*scale/2} {y}) scale({scale} {-scale})" stroke="none" fill="#624936">{"".join(paths)}</g>'
def put(name,body,w=180,h=160):
 (d/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>\n',encoding='utf-8')
put('egypt','<path d="m15 128 63-94 61 94Z" fill="#d5b47c"/><path d="m78 34 5 94h56Z" fill="#b89d71"/><path d="m107 128 31-58 28 58Z" fill="#e2c28b"/><circle cx="143" cy="29" r="15" fill="#e7d398"/>')
put('abroad','<circle cx="90" cy="79" r="59" fill="#bfd8d9"/><path d="M33 60h114M31 96h118M90 20q-51 59 0 118m0-118q51 59 0 118" fill="none" stroke="#87a79b"/><path d="m28 131 110-98-12 42-18-22-30-3Z" fill="#f5e6c9"/>')
for name in ['may','might','maybe','worry']:put(name,'<path d="M22 27h136v83h-50l-30 28v-28H22Z" fill="#e4dfc6"/>'+label('?',90,89,49))
put('mind','<path d="M90 134V85M90 85 40 39m50 46 50-46M24 39h25v25m82 0V39h25" fill="none" stroke="#96ad9b" stroke-width="10"/>')
put('care','<path d="M20 108h40l33-25q15-8 20 5l-20 17h42l24-17q13 2 7 14l-35 31H58l-38 8Z" fill="#e2c49d"/><path d="M92 77V35m0 21q-33-8-30-29 29-1 30 29m0 0q31-2 33-25-31-6-33 25" fill="#a9bd9b"/>')
put('end','<path d="M49 142V21h98v67H49" fill="#c4d4b1"/><path d="m68 53 14 14 38-35" fill="none" stroke="#7d9a8e" stroke-width="8"/>')
put('sea','<path d="M19 100h143l-30 32H49Z" fill="#99b3bd"/><path d="M47 99V62h87v37M64 62V39h51v23" fill="#ece5cf"/><path d="M16 141q20-11 40 0t40 0t40 0t28 0" fill="none" stroke="#8baebd"/>')
put('air','<path d="m24 88 43-15 29-52 16 1-11 43 46-14q18-3 19 10-2 8-19 13l-45 13-18 49-16 3 5-43-26 6-15 19-14-2 12-27Z" fill="#c2d5d7"/>')
for name,source in [('sure','sure'),('reading','read'),('task-record','task-record'),('task-checked','task-checked')]:shutil.copyfile(r/'assets/unit127-128'/(source+'.svg'),d/(name+'.svg'))
shutil.copyfile(r/'assets/unit125-126/garden.svg',d/'garden.svg')
put('house','<path d="m16 72 74-51 74 51M31 62v79h118V62" fill="#dbc69d"/><path d="M78 141V94h31v47" fill="#a6bdb1"/><rect x="45" y="87" width="20" height="23" fill="#e8eee1"/>')
put('holiday','<rect x="26" y="28" width="128" height="115" rx="12" fill="#efe3c5"/><path d="M26 54h128M52 18v22m77-22v22" fill="none"/><circle cx="90" cy="97" r="26" fill="#dec789"/>')
put('enjoy','<circle cx="90" cy="81" r="56" fill="#e5c896"/><path d="M61 88q29 36 58 0M58 63h2m59 0h2" fill="none" stroke-width="7"/>')
put('dog','<path d="M45 59q6-35 45-35t45 35l-9 64q-37 33-72 0Z" fill="#d4b18b"/><path d="M47 48Q7 30 21 105l26-8m87-49q39-18 25 57l-25-8" fill="#91735e"/><circle cx="69" cy="77" r="4" fill="#624936"/><circle cx="111" cy="77" r="4" fill="#624936"/><path d="M78 103h24l-12 11Z" fill="#624936"/><path d="M90 114v10m-15 0q15 14 30 0" fill="none"/>')
put('year','<rect x="27" y="27" width="126" height="116" rx="12" fill="#eee1c4"/><path d="M27 54h126M52 17v22m77-22v22" fill="none"/>'+label('YEAR',90,100,28))
put('cinema','<path d="M20 52h140v84H20Z" fill="#c4d1c2"/><path d="M32 52V25h116v27M66 136V91h48v45" fill="#e6d4ad"/>'+label('CINEMA',90,78,23))
put('busy','<rect x="31" y="23" width="117" height="119" rx="10" fill="#e9dec2"/>'+''.join(f'<path d="M50 {y}h75m-75 8h48" fill="none"/>' for y in [49,80,111]))
put('yesterday','<rect x="19" y="31" width="142" height="107" rx="12" fill="#e8e2ca"/>'+label('Yesterday',90,93,23))
put('travel-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f8efdc"/>'+''.join(label(text,x,43,21) for text,x in [('OPTION',67),('COST',182),('TIME',292)])+'<path d="M17 61h326m-326 76h326M17 216h326" fill="none" stroke="#c8bda2"/>'+''.join(label(text,x,y,25) for text,x,y in [('SEA',67,108),('£120',182,108),('20 h',292,108),('AIR',67,184),('£180',182,184),('3 h',292,184)])+label('Not booked',180,246,22),360,270)
put('care-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f8efdc"/>'+''.join(label(name,78,y+28,24)+label(status,245,y+23,24)+(label(extra,245,y+49,19) if extra else '') for name,status,extra,y in [('DOG','Asked','No reply',24),('HOUSE','Agreed','',108),('GARDEN','Not asked','',192)])+'<path d="M17 92h326m-326 84h326" fill="none" stroke="#c8bda2"/>',360,270)
put('living-room','<rect width="1000" height="850" fill="#f0eadb"/><path d="M0 550h1000v300H0Z" fill="#d8c6a6"/><path d="M0 549h1000" fill="none" stroke="#bda889" stroke-width="7"/><path d="M25 355h150v184H25Zm800 0h150v184H825Z" fill="#e3d8b9"/><path d="M25 416h150m-150 60h150m650-60h150m-150 60h150" fill="none" stroke="#bda889" stroke-width="8"/>',1000,850)
p=d/'living-room.svg';p.write_text(p.read_text(encoding='utf-8').replace(' viewBox=',' preserveAspectRatio="none" viewBox=',1),encoding='utf-8')
print('131–132 native symbols, bounded travel comparison and care-state record built.')
