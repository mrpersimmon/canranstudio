from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit127-128';d.mkdir(exist_ok=True)
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
def cup(x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0h26v20q0 14-13 14T0 20Z" fill="#f3ead0"/><path d="M26 5q18-1 14 13-3 7-14 6" fill="none"/></g>'
theatre='<path d="M22 26h136v111H22Z" fill="#f4e4bf"/><path d="M22 26h38v62L22 110Zm136 0h-38v62l38 22Z" fill="#c88e84"/><path d="M22 26q67 37 136 0M15 139h150" fill="none"/>'
star='<path d="m90 50 10 20 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3Z" fill="#d8b879"/>'
put('famous',theatre+star)
for name,text in [('actress','actress'),('actor','actor')]:put(name,theatre+label(text,90,96,25))
put('read','<path d="M19 38q36-14 71 4 35-18 71-4v93q-36-14-71 3-35-17-71-3Z" fill="#e5d7b7"/><path d="M90 43v91M33 60l41 5m-41 16 41 5m-41 16 41 5m32-42 41-5m-41 26 41-5m-41 26 41-5" fill="none" stroke="#849e97"/>')
for name,text in [('at-least','4+'),('at-most','0–4'),('age','40 / 50'),('date','20 / 21'),('sure','sure'),('probably','probably')]:put(name,'<rect x="12" y="38" width="156" height="88" rx="18" fill="#dde9df"/>'+label(text,90,93,30 if name!='probably' else 26))
put('recognize','<circle cx="78" cy="66" r="39" fill="#d9e8df"/><path d="m108 97 45 43" fill="none" stroke-width="17"/>'+label('?',77,82,43))
put('look','<path d="M22 83q67-68 136 0-69 68-136 0Z" fill="#f7ecd4"/><circle cx="90" cy="83" r="23" fill="#739b99"/><circle cx="90" cy="83" r="8" fill="#624936"/>')
put('beside','<rect x="29" y="39" width="55" height="91" rx="11" fill="#d9ae92"/><rect x="96" y="39" width="55" height="91" rx="11" fill="#91b0a6"/>'+label('A',56,95,32)+label('B',124,95,32))
put('husband','<circle cx="70" cy="85" r="36" fill="none" stroke="#d1ae68" stroke-width="12"/><circle cx="113" cy="85" r="36" fill="none" stroke="#d1ae68" stroke-width="12"/>')
put('tired','<path d="M46 115q-24-48 23-74-10 40 43 53-26 33-66 21Z" fill="#e5c98e"/>'+label('rest',111,136,22))
put('sleeping','<path d="M24 92h132v42H24Zm0-45v90m132-38v38" fill="#8faaa0"/><rect x="34" y="67" width="38" height="25" rx="9" fill="#f6ead3"/>'+label('Z',105,51,34)+label('z',142,29,20))
for name,bg,cross in [('danish','#b8766d','#fff6df'),('swedish','#789bab','#e5c884')]:put(name,f'<rect x="25" y="33" width="132" height="88" rx="3" fill="{bg}"/><path d="M72 34v86M26 77h130" stroke="{cross}" stroke-width="14"/><path d="M24 28v112" fill="none"/>')
put('dentist','<path d="M56 36q-27 8-14 48 15 54 25 46l20-37q4-6 8 0l18 37q12 8 26-46 13-40-14-48-19-8-34 2-15-10-35-2Z" fill="#f5ecd7"/>')
put('engineer','<path d="M20 129h140M35 125V78m110 47V78M27 80h126M41 80l25 45m0-45 25 45m0-45 25 45m0-45 25 45M47 50h86l-13-24H60Z" fill="none" stroke="#769a95" stroke-width="7"/>')
put('group','<path d="M25 132V98h35v34m13 0V73h35v59m13 0V46h35v86" fill="#a7b7a2"/>'+label('1',42,88,23)+label('2',90,64,23)+label('3',138,37,23))
def hat(x,y,color,mark=False,s=1):return f'<g transform="translate({x} {y}) scale({s})"><path d="M8 52h104q-3-34-17-43H33Q15 19 8 52Z" fill="{color}"/><ellipse cx="60" cy="56" rx="59" ry="13" fill="{color}"/>'+('<path d="M66 38q-3-23 20-21 3 23-20 21Z" fill="#a8c28d"/><path d="m66 38 15-15" fill="none"/>' if mark else '')+'</g>'
put('hat',hat(24,46,'#b89976'))
for name in ['task-record','task-checked']:shutil.copyfile(r/'assets/unit125-126'/(name+'.svg'),d/(name+'.svg'))
put('hat-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f8eedb"/>'+label('NEW',90,39,24)+label('OLD',266,39,24)+hat(35,55,'#7fadb9',False,.88)+hat(211,55,'#b89976',True,.88)+label('FOUND',90,216,25)+hat(211,169,'#b89976',True,.88),360,270)
put('cup-record','<rect x="5" y="5" width="350" height="260" rx="14" fill="#f8eedb"/>'+''.join(label(letter,32,y+27,25)+''.join(cup(76+i*50,y,.8) for i in range(count)) for letter,count,y in [('A',3,32),('B',4,116),('C',5,200)]),360,270)
put('cafe-table','<ellipse cx="110" cy="38" rx="103" ry="27" fill="#d9bd92"/><path d="M100 64v88h20V64M65 157h90" fill="#b9a181"/>'+cup(54,7,.65)+cup(126,7,.65),220,170)
put('cafe-room','<rect width="1000" height="850" fill="#eee8d8"/><path d="M0 480h1000v370H0Z" fill="#d7c4a4"/><path d="M0 478h1000" fill="none" stroke="#bfa989" stroke-width="8"/><path d="M30 280h160v200H30Zm780 0h160v200H810Z" fill="#c6dbd5"/><path d="M110 280v200m780-200v200M30 380h160m620 0h160" fill="none" stroke="#b9a484" stroke-width="9"/>',1000,850)
p=d/'cafe-room.svg';p.write_text(p.read_text(encoding='utf-8').replace(' viewBox=',' preserveAspectRatio="none" viewBox=',1),encoding='utf-8')
print('127–128 native symbols, exact records, table and cafe background built.')
