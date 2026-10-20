from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit129-130';d.mkdir(exist_ok=True)
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
put('wave','<path d="M54 133 28 84q-3-11 8-12l19 17V36q1-12 12-6v39-45q6-10 14-1v44-41q7-9 14 0v43-31q9-7 15 3v42q22-18 29-3 2 6-15 27-8 31-34 31Z" fill="#e5c295"/><path d="m125 25 17-9m-8 33 19-1M34 28l-14-9" fill="none" stroke="#b99967"/>')
put('track','<ellipse cx="90" cy="82" rx="73" ry="48" fill="#bd9185"/><ellipse cx="90" cy="82" rx="46" ry="23" fill="#bfd1ad"/><path d="M90 35v23M90 106v24" fill="none" stroke="#f7ebd6" stroke-width="6"/>')
for name,text in [('mile','1 mile'),('yesterday','Yesterday'),('next-time','Next time')]:put(name,'<rect x="12" y="35" width="156" height="91" rx="13" fill="#dce6e5"/>'+label(text,90,91,23))
put('overtake','<path d="M29 114h113m-17-16 17 16-17 16M29 65h51q20 0 20-24V24" fill="none" stroke="#8ca6ab" stroke-width="12"/><path d="m83 42 17-18 17 18" fill="none" stroke="#8ca6ab" stroke-width="12"/>')
put('speed-limit','<circle cx="90" cy="81" r="61" fill="#fff8e9" stroke="#b87868" stroke-width="12"/>'+label('40',90,102,60))
put('dream','<path d="M43 95q-29-1-25-25 2-20 25-22 9-35 37-21 22-20 43 4 35-1 37 31 1 30-31 33Z" fill="#d9e2e6"/><circle cx="65" cy="118" r="9" fill="#d9e2e6"/><circle cx="49" cy="137" r="5" fill="#d9e2e6"/>'+label('?',93,78,38))
put('sign','<path d="M87 72v71M25 32h104l29 29-29 29H25Z" fill="#ead7b2"/><path d="M50 61h63m-12-12 12 12-12 12" fill="none" stroke="#809da8" stroke-width="6"/>')
put('licence','<rect x="15" y="38" width="150" height="93" rx="10" fill="#e9e0c9"/><circle cx="53" cy="70" r="12" fill="#a9beb5"/><path d="M32 109q21-43 43 0Z" fill="#a9beb5"/><path d="M94 61h51m-51 22h51m-51 22h33" fill="none" stroke="#96a8a1"/>')
put('charge','<rect x="20" y="21" width="93" height="117" rx="9" fill="#f3e9cf"/><path d="M39 46h54M39 65h44M39 84h54" fill="none"/><circle cx="127" cy="108" r="32" fill="#dec38b"/>'+label('£',127,121,35))
put('darling','<path d="M90 133 30 80q-28-38 6-52 31-11 54 23 23-34 54-23 34 14 6 52Z" fill="#c99085"/>')
put('advice','<path d="M22 27h136v86h-56l-28 27v-27H22Z" fill="#dce5e2"/>'+label('!',90,91,53))
put('careful','<circle cx="77" cy="64" r="38" fill="#ded9bb"/><path d="m107 95 41 43" stroke="#8ca6ab" stroke-width="14"/>'+label('!',77,82,43))
put('slowly','<path d="M31 97q0-61 58-61t58 61Z" fill="#a8b99c"/><circle cx="155" cy="93" r="14" fill="#c6d4b8"/><path d="M47 99v18m60-18v18M51 82l19-35m0 35 21-45m4 45 21-35" fill="none"/>')
put('stop','<path d="m55 20 70 0 35 35v55l-35 35H55l-35-35V55Z" fill="#c38a7d"/><path d="M47 81h85" stroke="#fff4db" stroke-width="17"/>')
put('again','<path d="M138 69q-4-47-53-45-49 2-49 55 0 51 48 53 39 0 51-30M115 61l23 9 14-22" fill="none" stroke="#829da4" stroke-width="12"/>')
put('officer','<path d="M44 99q-3-70 46-75 49 5 46 75l20 21q-66 20-132 0Z" fill="#8293aa"/><path d="M44 99h92" stroke="#f1e8cc" stroke-width="9"/><path d="m90 44 8 10 14 3-4 14-18 14-18-14-4-14 14-3Z" fill="#ebe4d3"/>')
for name in ['hat','swedish','dentist','age','group','task-record','task-checked']:shutil.copyfile(r/'assets/unit127-128'/(name+'.svg'),d/(name+'.svg'))
put('walk-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f6edd9"/>'+label('YESTERDAY',180,40,25)+'<path d="M42 127h276" fill="none" stroke="#86a499" stroke-width="13"/><path d="M50 111v32m130-32v32m130-32v32" fill="none"/>'+label('09:00',58,92,24)+label('09:30',180,175,24)+label('10:00',302,92,24)+label('WALKING',180,222,26)+label('No break',180,249,18),360,270)
put('date-record','<rect x="28" y="10" width="304" height="250" rx="14" fill="#f6edd9"/>'+label('TODAY',180,55,29)+label('MAY 21',180,119,47)+'<path d="M53 148h254" fill="none"/>'+label('YESTERDAY',180,189,28)+label('?',180,239,40),360,270)
put('parked-car','<path d="m30 95 39-56h148l53 56 54 13v53H20v-48Z" fill="#a1b19c"/><path d="m85 49-31 46h197l-43-46ZM143 49v46" fill="#d9e3df"/><circle cx="77" cy="160" r="29" fill="#777c79"/><circle cx="266" cy="160" r="29" fill="#777c79"/><circle cx="77" cy="160" r="13" fill="#d9d9cd"/><circle cx="266" cy="160" r="13" fill="#d9d9cd"/>',360,200)
put('roadside','<rect width="1000" height="850" fill="#e3ece7"/><path d="M0 410h1000v55H0Z" fill="#bcc9ae"/><path d="M0 440h1000v410H0Z" fill="#d9cbb3"/><path d="M0 680h1000v170H0Z" fill="#c5c7bf"/><path d="M0 679h1000" fill="none" stroke="#ece5d4" stroke-width="10"/>',1000,850)
p=d/'roadside.svg';p.write_text(p.read_text(encoding='utf-8').replace(' viewBox=',' preserveAspectRatio="none" viewBox=',1),encoding='utf-8')
print('129–130 symbols, current-versus-past records and separate car built.')
