from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit119-120';d.mkdir(exist_ok=True)
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
book='<path d="M23 35q35-15 67 6 32-21 67-6v95q-35-15-67 5-32-20-67-5Z" fill="#f5e8c9"/><path d="M90 41v94M39 59l34 5m-34 16 34 5m34-21 34-5m-34 26 34-5" fill="none" stroke="#b8a38a"/>'
put('story',book)
put('happen','<circle cx="90" cy="82" r="40" fill="#e3bd78"/><path d="M90 15v15m0 103v15M23 82h15m104 0h15M44 35l10 10m72 72 10 10m-92 0 10-10m72-72 10-10" fill="none" stroke="#b19369"/>'+label('!',90,98,45))
door='<path d="M88 20h64v121H88Z" fill="#cfbba0"/><path d="m89 20-35 18v115l35-12Z" fill="#e1ceb2"/>'
put('enter',door+'<path d="M18 85h80m-17-17 17 17-17 17" fill="none" stroke="#709e9f" stroke-width="7"/>')
put('dark','<rect x="20" y="22" width="140" height="118" rx="14" fill="#5d6d82"/><path d="M105 40q-37 30 3 49-43 12-49-23 0-24 25-28Z" fill="#f0d99e" stroke="none"/>')
torch='<path d="m30 72 73 0v40H30Z" fill="#9cbab8"/><path d="m103 72 28-17v74l-28-17Z" fill="#b9cec1"/><ellipse cx="134" cy="92" rx="10" ry="36" fill="#efe0a7"/><rect x="63" y="79" width="21" height="9" rx="4" fill="#6d9291"/>'
put('torch',torch);put('torch-dropped',torch)
put('voice','<path d="M29 35h96q25 0 25 24v33q0 21-25 21H78l-25 26v-26H29Z" fill="#dce8db"/><path d="M59 66q18 23 36 0m-40 23q24 15 48-1" fill="none"/>')
put('exercise-book','<rect x="41" y="22" width="101" height="122" rx="6" fill="#b3c7cb"/><path d="M56 22v122" fill="none"/><rect x="72" y="46" width="53" height="41" rx="4" fill="#f6eddb"/><path d="M81 61h34m-34 12h25" fill="none" stroke="#b5a991"/>')
put('true','<path d="M35 25h111v115H35Z" fill="#f3e8cd"/><path d="m56 81 22 21 45-49" stroke="#6e9c85" stroke-width="9" fill="none"/>')
put('downstairs','<path d="M20 40h35v30h35v30h35v30h35" fill="none" stroke="#b4a188" stroke-width="9"/><path d="m87 25 50 50m-25-1h26V48" fill="none" stroke="#7fa6ae" stroke-width="7"/>')
put('noise','<path d="m90 23 12 34 35-14-15 33 35 12-35 13 15 33-35-14-12 35-13-35-34 14 15-33-35-13 35-12-15-33 34 14Z" fill="#dfcaa3"/>')
put('light','<path d="M90 15v23M45 39h90l23 55H22Z" fill="#e3c785"/><path d="M44 115v16m46-16v20m46-20v16" fill="none" stroke="#c9a767"/>')
axis='<path d="M27 91h126m-14-12 14 12-14 12" fill="none" stroke="#9cafb7" stroke-width="5"/>'
for name,x in [('before',47),('after',130),('already',47),('just',73)]:
 put(name,axis+f'<circle cx="{x}" cy="91" r="13" fill="#e2bd73"/><path d="M90 44v80" fill="none" stroke="#a37761"/>'+label('then',90,36,21))
put('never','<rect x="25" y="29" width="131" height="111" rx="8" fill="#ece0c9"/><path d="M45 58h91M45 82h91M45 106h91" fill="none" stroke="#c5b28f"/><circle cx="89" cy="82" r="41" fill="#fff7e6"/>'+label('0',89,100,50))
put('correct','<rect x="32" y="21" width="102" height="124" rx="8" fill="#f1e5cb"/><path d="M47 46h53m-53 24h64m-64 25h43" fill="none" stroke="#c4b59a"/><path d="m83 113 15 13 41-46" fill="none" stroke="#789c81" stroke-width="8"/>')
put('examination','<rect x="31" y="20" width="111" height="125" rx="6" fill="#f4e9cf"/>'+''.join(f'<rect x="47" y="{y}" width="13" height="13" fill="#e0d0af"/><path d="M74 {y+7}h45" fill="none" stroke="#bbaa8b"/>' for y in [47,79,111]))
car='<path d="m23 80 21-34h64l29 34h18v44H21V80Z" fill="#afc1cb"/><path d="m53 55-13 26h76L98 55Z" fill="#ecedda"/><circle cx="49" cy="126" r="16" fill="#8c8a83"/><circle cx="128" cy="126" r="16" fill="#8c8a83"/>'
put('sell',car+'<path d="M118 18h36v35h-36Z" fill="#e2c68d"/>'+label('$',136,44,24))
put('arrive','<path d="M101 27h49v111h-49Z" fill="#e1caa4"/><path d="M20 88h91m-20-19 20 19-20 19" fill="none" stroke="#7eaaab" stroke-width="7"/>')
put('smile','<circle cx="90" cy="79" r="57" fill="#e9cba4"/><path d="M57 65q8-15 16 0m34 0q8-15 16 0M61 93q28 31 57 0" fill="none"/>')
put('train','<rect x="39" y="18" width="103" height="109" rx="21" fill="#adc1c9"/><rect x="52" y="38" width="78" height="42" rx="7" fill="#e7eddf"/><circle cx="61" cy="103" r="8" fill="#e3cb8f"/><circle cx="120" cy="103" r="8" fill="#e3cb8f"/><path d="m50 128-14 24m93-24 14 24" fill="none" stroke="#b9aa91"/>')
for name,source in [('housework','assets/unit117-118/housework.svg'),('dinner','assets/unit117-118/dining-room-icon.svg'),('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
# The two event coordinates are exact; no duration or causal relationship is encoded.
for name,first,second,t1,t2 in [('timeline-train','Train left','I arrived','09:00','09:10'),('timeline-work','Work finished','May went out','17:00','17:20')]:
 put(name,'<rect x="7" y="7" width="346" height="190" rx="13" fill="#fff4e3"/>'+label('Yesterday',180,35,20)+'<path d="M55 113h252m-13-10 13 10-13 10" fill="none" stroke="#9ab0b7" stroke-width="5"/>'+''.join(f'<path d="M{x} 96v38" fill="none" stroke="#846953"/><circle cx="{x}" cy="113" r="9" fill="#dab878"/>'+label(text,x,77,19)+label(time,x,164,22) for x,text,time in [(88,first,t1),(272,second,t2)]),'0 0 360 204')
for name,wall,floor,lit in [('room-night','#c1cbd5','#aab4bd',False),('room-light','#f3ecda','#dbc8a9',True),('bedroom','#c7d1d9','#b6bdc4',False)]:
 body=f'<rect width="1000" height="740" fill="{wall}"/><path d="M0 530h1000v210H0Z" fill="{floor}"/>'
 body+='<rect x="55" y="365" width="170" height="158" rx="8" fill="#7e92a7" stroke="#87919a" stroke-width="7"/><path d="M140 365v158M55 444h170" fill="none" stroke="#a9b6bc" stroke-width="5"/><path d="M187 383q-30 24 3 43-31 3-33-20 0-16 17-23Z" fill="#e5d3a0"/>'
 if name!='bedroom':body+='<path d="M788 350h160v264H788Z" fill="#aea895" stroke="#b1a38c" stroke-width="7"/><path d="M329 542h335v23H329ZM352 565v75m290-75v75" fill="#c0aa8b" stroke="#a89478" stroke-width="5"/>'
 body+='<path d="M500 350v41m-52 0h104l28 65H420Z" fill="'+('#e8c87d' if lit else '#a5aaa6')+'" stroke="#a89f8c" stroke-width="5"/>'
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 740" preserveAspectRatio="none">'+body+'</svg>\n',encoding='utf-8')
print('119–120 icons, two event timelines and independent story backgrounds built.')
