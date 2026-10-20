from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit121-122';d.mkdir(exist_ok=True)
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
def book(x,y,w=70,h=26,color='#a4bb9c'):
 return f'<path d="M{x} {y}h{w}v{h}h-{w}Z" fill="{color}"/><path d="M{x+6} {y+7}h{w-12}v{h-13}H{x+6}Z" fill="#f2e5ca" stroke-width="2"/>'
dictionary=book(30,55,122,55)+'<path d="M30 55v55" stroke="#6d8a73" stroke-width="9"/>'
put('dictionary',dictionary)
put('two-dictionaries',book(26,90,129,36,'#bf8972')+book(26,49,129,36,'#92a68a'))
put('counter','<path d="M17 55h146v18H17ZM29 73h123v67H29Z" fill="#ceb18c"/><path d="M39 93h101" fill="none" stroke="#b19876"/>')
put('open-counter','<path d="M4 7h352v16H4Z" fill="#d1b38d"/><path d="M23 23v170m314-170v170" stroke="#b19572" stroke-width="10" fill="none"/>','0 0 360 200')
put('counter-with-books','<path d="M4 60h352v16H4Z" fill="#d1b38d"/><path d="M23 76v119m314-119v119" stroke="#b19572" stroke-width="10" fill="none"/>'+book(32,38,108,22,'#bf8972')+book(32,16,108,22,'#92a68a'),'0 0 360 200')
put('serve','<path d="M28 112q28-29 62-6h54v20H28Z" fill="#e4c5a5"/><path d="M36 88h111" fill="none" stroke="#ad9374" stroke-width="7"/><path d="M61 79V48h57v31" fill="#b3cbd0"/><path d="M118 52q26-1 18 21h-18" fill="none"/>')
put('forget','<path d="M28 28h124v118H28Z" fill="#f0e4c8"/><path d="M43 52h92m-92 21h47m-47 21h52" fill="none" stroke="#c5b494"/>'+label('?',121,119,50))
put('recognize','<path d="M17 81q73-69 146 0-73 69-146 0Z" fill="#f7edd7"/><circle cx="90" cy="81" r="27" fill="#a9c4c5"/><circle cx="90" cy="81" r="10" fill="#644d3e"/>')
put('remember','<rect x="27" y="23" width="126" height="123" rx="13" fill="#e7d1ad"/><rect x="44" y="42" width="93" height="73" rx="7" fill="#b7ccbc"/><path d="m62 78 19 19 34-36" fill="none" stroke="#6d8d72" stroke-width="7"/>')
put('road','<path d="M60 18h60l48 130H12Z" fill="#a6b7bd"/><path d="M90 25v19m0 19v25m0 24v25" fill="none" stroke="#f5e9ce" stroke-width="7"/>')
put('expensive',dictionary+'<path d="M96 21h64v36H96Z" fill="#e3c689"/>'+label('$$$',128,46,21))
hat='<ellipse cx="90" cy="112" rx="70" ry="23" fill="#d1ae73"/><path d="m42 100 15-63q32 11 65-4l17 67Z" fill="#deb97f"/><path d="M46 86q44 16 89-1l4 15q-51 21-97 0Z" fill="#795d47"/>'
put('hat',hat)
put('put-on',hat+'<path d="M27 15v44m-11-13 11 13 11-13" fill="none" stroke="#7b9ea2" stroke-width="5"/>')
put('wear',hat+'<path d="M60 135q30 15 60 0" fill="none" stroke="#b7a78f" stroke-width="8"/>')
put('behind','<rect x="61" y="31" width="69" height="75" rx="7" fill="#a9c4c5"/><path d="M26 84h130v60H26Z" fill="#dfbd8c"/>')
put('repair','<path d="M105 25q-29-12-34 20l12 19-51 64 16 14 52-68q31 1 33-29l-19 13-15-14Z" fill="#aabdc0"/>')
put('carry','<path d="M35 65h110v76H35Z" fill="#d6b284"/><path d="M57 65V44q33-21 66 0v21" fill="none" stroke="#af9272" stroke-width="8"/><path d="M63 93h52" stroke="#bd9d75"/>')
basket='<path d="M25 71h130l-15 66H40Z" fill="#d8bb8c"/><path d="M49 69V47q41-45 82 0v22M52 85l7 40m25-40v40m27-40-4 40m26-40-7 40" fill="none" stroke="#b89a71"/>'
put('basket',basket)
put('buy',dictionary+'<circle cx="133" cy="126" r="24" fill="#e5ca87"/>'+label('$',133,135,27))
put('half-hour','<circle cx="90" cy="80" r="61" fill="#f3ead5"/><path d="M90 22a58 58 0 0 1 0 116Z" fill="#b8cece" stroke="none"/>'+label('30 min',90,88,25))
put('straight-away','<path d="M23 80h127m-23-23 23 23-23 23" fill="none" stroke="#829e9e" stroke-width="10"/><path d="M24 45h37M14 115h47" fill="none" stroke="#c1b08f" stroke-width="6"/>')
for name,source in [('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
# Independently placed scene objects, with A on, B under and C on a separate shelf.
put('book-map','<rect x="7" y="7" width="346" height="256" rx="14" fill="#f9f0df"/><path d="M28 125h161v15H28ZM42 140v95m133-95v95" fill="#c5ab87" stroke="#a68b6b"/>'+book(62,94,89,29,'#97b39a')+label('A',108,77,28)+book(71,217,83,27,'#98b7c7')+label('B',112,199,28)+'<path d="M222 128h110v11H222Z" fill="#c7ad86"/>'+book(236,94,84,32,'#c78e7b')+label('C',278,77,28)+label('counter',109,160,19)+label('shelf',278,163,19),'0 0 360 270')
put('service-record','<rect x="7" y="7" width="346" height="256" rx="14" fill="#f9f0df"/>'+label('Service record',180,39,23)+''.join(f'<rect x="22" y="{y}" width="86" height="53" rx="10" fill="#c2d7d1"/><rect x="252" y="{y}" width="86" height="53" rx="10" fill="#e2c6a0"/>'+label(a,65,y+35,27)+label(b,295,y+35,27)+f'<path d="M123 {y+29}h112m-12-10 12 10-12 10" fill="none" stroke="#829d9e" stroke-width="5"/>'+label('served',180,y+10,20) for a,b,y in [('Pat','Lee',77),('Mia','Tom',177)]),'0 0 360 270')
(d/'bookshop-room.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="740" viewBox="0 0 1000 740" preserveAspectRatio="none"><rect width="1000" height="740" fill="#f1ead9"/><path d="M0 530h1000v210H0Z" fill="#dfcdb0"/><g fill="#c7b492" stroke="#b6a07f" stroke-width="6"><path d="M35 350h205v190H35ZM760 350h205v190H760Z"/></g><g fill="none" stroke="#a99474" stroke-width="8"><path d="M35 410h205M35 475h205M760 410h205M760 475h205"/></g><g stroke="#8d8e7c" stroke-width="15">'+''.join(f'<path d="M{x} {y}v-46"/>' for x in [57,84,112,142,172,202,781,811,842,875,908,938] for y in [407,472,535])+'</g><path d="M300 710h400" stroke="#c8b496" stroke-width="5" fill="none"/></svg>\n',encoding='utf-8')
print('121–122 word symbols, book-position map, directed service record and bookshop background built.')
