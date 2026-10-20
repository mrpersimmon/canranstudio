from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit125-126';d.mkdir(exist_ok=True)
font=TTFont(r/'assets/awards/fonts/award-nunito.woff2');glyphs=font.getGlyphSet(location={'wght':400});cmap=font.getBestCmap();units=font['head'].unitsPerEm
def put(name,body,box='0 0 180 160'):
 dims=box.split()[2:];(d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="'+dims[0]+'" height="'+dims[1]+'" viewBox="'+box+'"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def label(value,x=90,y=91,size=22):
 advance=0;paths=[]
 for char in value:
  glyph=glyphs[cmap[ord(char)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
  advance+=glyph.width
 scale=size/units;return f'<g transform="translate({x-advance*scale/2} {y}) scale({scale} {-scale})" stroke="none" fill="#624936">{"".join(paths)}</g>'
def cloud():return '<path d="M43 78q-28-4-22-26 5-16 24-15 9-27 35-16 22-20 42 8 30-1 31 24 2 25-27 25Z" fill="#c4d5d4"/>'
def flower(x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})"><path d="M0 41V0m0 23-16-13m16 5 16-12" fill="none" stroke="#88a578" stroke-width="5"/><circle cx="0" cy="-7" r="14" fill="#d6b472"/><circle cx="0" cy="-7" r="5" fill="#eddbac"/></g>'
can='<path d="M47 57h63l-7 69H52Z" fill="#a7bea0"/><path d="M47 70Q6 42 18 92l32 17M110 77l37-19 8 16-48 33M61 57V37h38v20" fill="none"/><path d="m154 87 3 9m4-10 4 10m-16 1 3 8" stroke="#91b9c1" stroke-width="5"/>'
put('water',can+flower(142,127,.45));put('dry','<path d="M21 100h138v37H21Z" fill="#d8bd91"/><path d="m26 117 34-8 28 20 31-20 33 11m-64 9-5 10m-21-29 12-11" fill="none" stroke="#a98a64"/>')
put('rain',cloud()+'<path d="m40 96-9 23m40-23-9 23m40-23-9 23m40-23-9 23" fill="none" stroke="#83a9b5" stroke-width="7"/>')
put('garden','<path d="M18 117h144v26H18Z" fill="#cbb28a"/>'+flower(48,85)+flower(92,77)+flower(132,88))
put('terribly','<rect x="22" y="38" width="136" height="86" rx="12" fill="#ecdfbb"/>'+label('very',90,94,42))
put('nuisance','<path d="M38 43q37-27 67 3t-6 47q-51 24-40-17t69 9q25 29-31 46" fill="none" stroke="#b29b88" stroke-width="10"/>'+label('!',147,55,32))
put('mean','<path d="M21 36h63v58H21Zm79 28h60v58h-60Z" fill="#dce4d4"/><path d="M54 109h37m-10-10 10 10-10 10" fill="none" stroke="#88a578"/>'+label('A',52,75,34)+label('B',131,104,34))
put('surprise','<path d="M29 37h120v83h-47l-25 22v-22H29Z" fill="#e8d4a9"/>'+label('!',89,98,58))
put('immediately','<path d="m30 46 44 33-44 34m50-67 44 33-44 34m58-67v67" fill="none" stroke="#98b095" stroke-width="14"/>')
cup='<path d="M38 55h88v51q-1 32-44 32-42 0-44-32Zm88 9q47-5 38 32-8 19-38 12" fill="#ede0c0"/><ellipse cx="82" cy="55" rx="44" ry="10" fill="#b78d58"/>'
put('tea',cup);put('alone',cup);put('pleasant','<circle cx="90" cy="83" r="53" fill="#e8d3a7"/><path d="M62 89q28 32 56 0M60 63h1m57 0h1" fill="none" stroke-width="7"/>')
put('instead','<path d="M21 57h106l-17-17m17 17-17 17M159 109H53l17-17m-17 17 17 17" fill="none" stroke="#92afa3" stroke-width="11"/>')
for name,text in [('have-to','!'),('need-to','!')]:put(name,'<rect x="38" y="23" width="105" height="117" rx="10" fill="#e8ddc3"/><path d="M65 24v-8h52v8" fill="none"/>'+label(text,90,112,66))
put('summer','<circle cx="89" cy="80" r="34" fill="#e8c272"/>'+''.join(f'<path transform="rotate({a} 89 80)" d="M89 22v-9" stroke="#d7ae62" stroke-width="7"/>' for a in range(0,360,45)))
put('every-day','<rect x="22" y="27" width="136" height="116" rx="10" fill="#f5e8ca"/><path d="M22 54h136M49 17v20m81-20v20" fill="none"/>'+''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="#96af90"/>' for x in [48,89,130] for y in [80,113]))
put('get-up','<path d="M25 87h124v46H25Zm0-43v94m124-48v48" fill="#d8c39e"/><rect x="35" y="66" width="39" height="21" rx="8" fill="#f4e9ce"/><path d="M110 64V23m-13 15 13-15 13 15" fill="none" stroke="#88a578" stroke-width="7"/>')
put('early','<path d="M20 112h140M48 112a42 42 0 0 1 84 0" fill="#e7c575"/><path d="M90 45V29m-45 30-11-11m101 11 11-11M31 87l-17-5m135 5 17-5" fill="none" stroke="#d2b16d" stroke-width="6"/>')
put('wait','<path d="M54 24h73M54 136h73M61 24q0 42 29 56-29 15-29 56m59-112q0 42-30 56 30 15 30 56" fill="#f0e1bc"/><path d="m71 48 19 29 19-29Zm-3 75h48L90 98Z" fill="#c9ad79" stroke="none"/>')
put('taxi','<path d="M27 77 47 47h86l22 30v44H27Z" fill="#dfbf7d"/><path d="M63 47v30m46-30v30M27 77h128" fill="none"/><rect x="72" y="31" width="37" height="16" rx="3" fill="#f4ead0"/><circle cx="52" cy="123" r="14" fill="#8d8a7e"/><circle cx="131" cy="123" r="14" fill="#8d8a7e"/>')
put('bus','<rect x="18" y="39" width="144" height="88" rx="15" fill="#a4bdaf"/>'+''.join(f'<rect x="{x}" y="53" width="29" height="28" rx="3" fill="#d5e4de"/>' for x in [30,74,118])+'<circle cx="49" cy="128" r="14" fill="#8d8a7e"/><circle cx="133" cy="128" r="14" fill="#8d8a7e"/>')
put('station','<path d="M24 69h133v69H24Z" fill="#d9c9a6"/><path d="m14 69 77-48 75 48Z" fill="#a5b9a1"/><path d="M68 138V88h44v50" fill="#efdfb9"/>'+label('STATION',91,82,19))
put('window','<rect x="22" y="21" width="136" height="123" rx="6" fill="#c5d9d7"/><path d="M90 22v121M23 82h134" fill="none" stroke="#bca681" stroke-width="8"/>')
for name in ['task-record','task-checked']:shutil.copyfile(r/'assets/unit123-124'/(name+'.svg'),d/(name+'.svg'))
# Independently authored assessment data. The labels supply status, not a guessed soil colour.
put('bed-record','<rect x="6" y="6" width="348" height="258" rx="12" fill="#f7eedc"/>'+''.join(f'<rect x="16" y="{y}" width="328" height="72" rx="9" fill="{color}"/>'+label(letter,39,y+45,30)+label(place,157,y+29,22)+label(state,271,y+46,29)+f'<path d="M83 {y+56}h135" stroke="#bda27e" stroke-width="8"/>' for letter,place,state,y,color in [('A','Outside','Wet',15,'#d6e5df'),('B','Under roof','Dry',99,'#eadcbf'),('C','Outside','Wet',183,'#d6e5df')]),'0 0 360 270')
put('wait-record','<rect x="6" y="6" width="348" height="258" rx="12" fill="#f7eedc"/>'+label('Same day',180,42,26)+'<path d="M51 139h258m-10-10 10 10-10 10M60 127v24m240-24v24" fill="none" stroke="#84a89e" stroke-width="6"/>'+label('09:00',60,107,26)+label('11:00',240,107,26)+label('Start',60,185,24)+label('Now',240,185,24)+label('Still waiting',180,234,24),'0 0 360 270')
# The window is a separate scene prop so its rain remains readable on a phone.
rainlines=''.join(f'<path d="m{x} {y}-8 20"/>' for x in range(32,282,38) for y in [24,69,113])
put('rain-window','<rect x="6" y="6" width="288" height="168" rx="6" fill="#bfcfcd"/><path d="M12 125q45-31 89 0t89 0t96 0v43H12Z" fill="#98b399"/><g stroke="#e8f0ec" stroke-width="3">'+rainlines+'</g><path d="M150 6v168M6 92h288" fill="none" stroke="#baa88a" stroke-width="8"/>','0 0 300 180')
put('garden-door','<path d="M8 8h164v264H8Z" fill="#e9dfc6"/><path d="M27 29h126v243H27Z" fill="#baa88a"/><path d="M38 40h104v232H38Z" fill="#f6ead5"/><circle cx="128" cy="165" r="5" fill="#b69f77"/>','0 0 180 280')
put('planter','<path d="M6 84h168v30H6Z" fill="#c4aa7f"/>'+flower(39,59,.62)+flower(88,50,.68)+flower(138,61,.58),'0 0 180 120')
outside='<rect width="1000" height="850" fill="#e9f0e0"/><path d="M0 630h1000v220H0Z" fill="#d5c19d"/><path d="M0 571h645M0 600h645" stroke="#b7bea0" stroke-width="15" fill="none"/>'
outside+=''.join(f'<path d="M{x} 538v104" stroke="#b7bea0" stroke-width="15"/>' for x in range(25,660,70))
put('garden-outside',outside,'0 0 1000 850')
put('garden-room','<rect width="1000" height="850" fill="#f0ecdf"/><path d="M0 650h1000v200H0Z" fill="#d9c8ad"/><path d="M0 649h1000" stroke="#c9b79b" stroke-width="8" fill="none"/><ellipse cx="500" cy="790" rx="340" ry="30" fill="#cbbba0" stroke="none"/>','0 0 1000 850')
for name in ['garden-room','garden-outside']:
 p=d/(name+'.svg');p.write_text(p.read_text(encoding='utf-8').replace(' viewBox=', ' preserveAspectRatio="none" viewBox=',1),encoding='utf-8')
print('125–126 symbols, exact bed record, continuous waiting diagram and separate scene assets built.')
