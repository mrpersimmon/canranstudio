from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit123-124';d.mkdir(exist_ok=True)
font=TTFont(r/'assets/awards/fonts/award-nunito.woff2');glyphs=font.getGlyphSet(location={'wght':400});cmap=font.getBestCmap();units=font['head'].unitsPerEm
def put(name,body,box='0 0 180 160'):
 # Give teaching diagrams exact intrinsic dimensions. Without these, browsers
 # round different fallback natural sizes despite using the same viewBox ratio.
 dimensions='' if box=='0 0 180 160' else ' width="'+box.split()[2]+'" height="'+box.split()[3]+'"'
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg"'+dimensions+' viewBox="'+box+'"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def label(value,x=90,y=91,size=22):
 advance=0;paths=[]
 for char in value:
  glyph=glyphs[cmap[ord(char)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
  advance+=glyph.width
 scale=size/units
 return f'<g transform="translate({x-advance*scale/2} {y}) scale({scale} {-scale})" stroke="none" fill="#624936">{"".join(paths)}</g>'
def ship(x=0,y=0,s=1):
 return f'<g transform="translate({x} {y}) scale({s})"><path d="M19 91h146l-26 42H47Z" fill="#9fbfc2"/><path d="M42 54h92v37H42Z" fill="#f3e9d4"/><path d="M69 33h38v21H69Z" fill="#d4ba8e"/>'+''.join(f'<circle cx="{xx}" cy="72" r="7" fill="#b2c8cc"/>' for xx in [57,83,109])+ '<path d="M13 143q17-10 34 0t34 0t34 0t34 0" fill="none" stroke="#87aaa9" stroke-width="5"/></g>'
put('ship',ship())
put('ship-photo','<rect width="360" height="240" fill="#d4e7e8"/><path d="M0 158h360v82H0Z" fill="#9ebec4"/>'+ship(36,12,1.6),'0 0 360 240')
put('during','<rect x="22" y="44" width="137" height="74" rx="12" fill="#e2ccb0"/><path d="M33 80h116" stroke="#a4c0bd" stroke-width="18"/><circle cx="88" cy="80" r="15" fill="#dfb568"/>')
suitcase='<rect x="30" y="50" width="122" height="85" rx="12" fill="#ceaf80"/><path d="M65 50V32h52v18M51 52v81m81-81v81" fill="none" stroke="#9b8466" stroke-width="7"/>'
put('trip',suitcase)
put('travel',suitcase+'<path d="M27 18h112m-14-11 14 11-14 11" fill="none" stroke="#80a8a8" stroke-width="5"/>')
put('offer','<path d="M19 116q28-23 57-9h55v24H19Z" fill="#e3c2a0"/><rect x="62" y="34" width="77" height="68" rx="8" fill="#afc6bf"/><path d="M81 48h40m-40 17h29m-29 17h36" fill="none" stroke="#7c9b93"/>')
put('job','<rect x="24" y="52" width="132" height="88" rx="11" fill="#b8b39b"/><path d="M62 52V30h57v22M24 82h132" fill="none"/><rect x="76" y="72" width="26" height="24" rx="3" fill="#e7cd8e"/>')
put('guess','<path d="M24 27h132v91H90l-31 23v-23H24Z" fill="#e1d2b6"/>'+label('?',90,95,57))
put('grow','<path d="M24 135h132M90 135V71" fill="none" stroke="#a48b68" stroke-width="8"/><path d="M88 96Q34 98 36 54q47 1 52 42ZM93 74q-5-42 49-49 4 43-49 49Z" fill="#a8c1a0"/>')
kitten='<path d="M55 76q-19-25-17-52l29 12q24-10 47 0l26-13q5 27-14 54" fill="#d4b39a"/><ellipse cx="91" cy="72" rx="54" ry="41" fill="#dfc3a8"/><path d="M55 106q37-15 73 0v37H55Z" fill="#c7ad99"/><path d="M129 134q37-8 25-35" fill="none" stroke="#c7ad99" stroke-width="11"/><circle cx="70" cy="69" r="5" fill="#634d3d"/><circle cx="109" cy="69" r="5" fill="#634d3d"/><path d="m85 83 7 6 7-6m-7 6v8m-36-12-25-4m26 14-25 6m93-16 25-4m-25 14 25 6" fill="none" stroke-width="3"/>'
put('kitten',kitten)
put('photograph','<rect x="18" y="27" width="144" height="116" rx="6" fill="#fbf0d8"/><rect x="30" y="39" width="120" height="82" rx="3" fill="#b9d3d0"/><circle cx="123" cy="59" r="12" fill="#e7c782"/><path d="m30 111 35-34 29 22 21-13 35 35H30Z" fill="#97b39b"/>')
put('australia','<rect x="18" y="31" width="145" height="107" rx="7" fill="#f2e5c7"/><circle cx="131" cy="52" r="11" fill="#e4be78"/><path d="M28 105q20-12 40 0t40 0t40 0M28 122q20-12 40 0t40 0t40 0" fill="none" stroke="#8eafb5" stroke-width="5"/>'+label('Australia',90,82,25))
for name,source in [('shave-off','assets/unit117-118/shave.svg'),('remember','assets/unit121-122/remember.svg'),('counter','assets/unit121-122/counter.svg'),('road','assets/unit121-122/road.svg'),('hat','assets/unit121-122/hat.svg'),('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
put('come-home','<path d="m19 77 70-53 72 53-16 0v65H40V77Z" fill="#d8bd95"/><rect x="75" y="91" width="30" height="51" fill="#b0c4bb"/><path d="M15 117h57m-13-12 13 12-13 12" fill="none" stroke="#779a99" stroke-width="6"/>')
put('beautiful','<circle cx="90" cy="75" r="25" fill="#e1bf7d"/>'+''.join(f'<ellipse cx="90" cy="37" rx="20" ry="30" fill="#c7b0c0" transform="rotate({a} 90 75)"/>' for a in [0,72,144,216,288])+'<circle cx="90" cy="75" r="22" fill="#e6c585"/>')
put('people',''.join(f'<circle cx="{x}" cy="55" r="20" fill="{c}"/><path d="M{x-25} 132v-39q25-22 50 0v39Z" fill="{c}"/>' for x,c in [(39,'#c6b29a'),(90,'#a8bfc2'),(141,'#c2b6c9')]))
put('on','<rect x="26" y="91" width="130" height="20" rx="5" fill="#c4b091"/><path d="M42 111v35m98-35v35" fill="none" stroke="#b09b7b"/><rect x="60" y="48" width="61" height="42" rx="5" fill="#a7c1c1"/>')
put('about','<path d="M25 29h132v90h-52l-30 24v-24H25Z" fill="#d7dec8"/><circle cx="89" cy="72" r="24" fill="#dfbd83"/>'+label('i',89,84,35))
put('decide','<path d="M90 141V87L45 41m45 46 45-46m-91 23V40h24m42 0h25v25" fill="none" stroke="#97b4b1" stroke-width="8"/><circle cx="90" cy="137" r="14" fill="#d9b77f"/>')
put('test','<rect x="33" y="22" width="114" height="123" rx="7" fill="#f0e6cf"/>'+''.join(f'<rect x="48" y="{y}" width="13" height="13" fill="#b7c8bd"/><path d="M76 {y+7}h51" fill="none" stroke="#b9aa91"/>' for y in [45,77,109]))
put('village','<path d="m12 81 33-28 33 28H12Zm80-23 34-29 36 29H92Z" fill="#ba9c81"/><path d="M23 83h46v55H23Zm80-23h47v78h-47Z" fill="#e2cfab"/><path d="M42 138v-31h15v31m64 0v-39h16v39" fill="#a9bfc2"/>')
put('umbrella','<path d="M17 79q73-112 146 0H17Z" fill="#b8b1c9"/><path d="M90 27v109q-2 25-22 8M90 27Q59 54 58 79m32-52q31 27 32 52" fill="none" stroke-width="5"/>')
put('medicine','<rect x="54" y="39" width="77" height="105" rx="13" fill="#d0d9c0"/><rect x="57" y="21" width="71" height="27" rx="6" fill="#acb7a6"/><rect x="68" y="70" width="49" height="44" rx="5" fill="#f4e9d4"/><circle cx="92" cy="92" r="11" fill="#a2b9ad"/>')
put('book','<rect x="37" y="22" width="107" height="121" rx="7" fill="#a9bfb3"/><path d="M56 22v121M77 49h45m-45 22h35" fill="none" stroke="#7c978b"/>')
put('books','<rect x="27" y="55" width="107" height="92" rx="7" fill="#bcaac0"/><rect x="45" y="22" width="107" height="106" rx="7" fill="#aac0b2"/><path d="M64 22v106" fill="none" stroke="#82988d"/>')
# Each independent record preserves both fields needed to identify the photo.
put('photo-record','<rect x="7" y="7" width="346" height="256" rx="13" fill="#f7eedc"/>'+''.join(f'<rect x="20" y="{y}" width="320" height="67" rx="10" fill="{color}"/>'+label(letter,47,y+44,31)+f'<rect x="80" y="{y+13}" width="48" height="39" rx="3" fill="#f9f0d9"/><path d="m85 {y+45} 14-14 12 8 12-13" fill="none" stroke="#93aca5" stroke-width="3"/>'+label(name,187,y+43,24)+label(day,283,y+43,23) for letter,name,day,y,color in [('A','Maya','Monday',21,'#dbe6db'),('B','Leo','Monday',102,'#e9dcc7'),('C','Maya','Tuesday',183,'#d5e3e7')]),'0 0 360 270')
# Exactly two complete ships. No decorative distant ships or written answer.
put('two-ships','<rect x="7" y="7" width="346" height="256" rx="13" fill="#d6e7e8"/>'+ship(88,-8,1.02)+ship(88,119,1.02),'0 0 360 270')
(d/'photo-room.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="900" viewBox="0 0 1000 900" preserveAspectRatio="none"><rect width="1000" height="900" fill="#edf1e9"/><path d="M0 655h1000v245H0Z" fill="#dbcdb5"/><rect x="35" y="438" width="166" height="185" rx="8" fill="#c0d6d3" stroke="#c1b39a" stroke-width="7"/><path d="M118 438v185M35 529h166" fill="none" stroke="#c1b39a" stroke-width="6"/><rect x="806" y="445" width="150" height="176" rx="8" fill="#d4c3a3" stroke="#b9a688" stroke-width="6"/><path d="M817 501h129m-129 59h129" fill="none" stroke="#b9a688" stroke-width="6"/><g stroke="#a4b6a5" stroke-width="15">'+''.join(f'<path d="M{x} {y}v-36"/>' for x in [831,855,881,907,932] for y in [495,554,610])+'</g><ellipse cx="500" cy="840" rx="390" ry="27" fill="#cfc2aa"/></svg>\n',encoding='utf-8')
print('123–124 word symbols, exact photo record, two-ship postcard and independent background built.')
