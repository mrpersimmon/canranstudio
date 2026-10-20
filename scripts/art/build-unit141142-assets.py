from pathlib import Path
import shutil
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
r=Path(__file__).resolve().parents[2];d=r/'assets/unit141-142';d.mkdir(exist_ok=True)
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
for name in ['task-record','task-checked','repair','handbag']:
 source=r/f'assets/unit139-140/{name}.svg'
 if source.exists():shutil.copyfile(source,d/(name+'.svg'))
def face(name,mouth,extra=''):
 put(name,'<circle cx="90" cy="85" r="52" fill="#f0d2ae"/><ellipse cx="71" cy="74" rx="4" ry="7" fill="#624936"/><ellipse cx="109" cy="74" rx="4" ry="7" fill="#624936"/>'+mouth+extra)
face('excited','<path d="M64 97q26 42 52 0Z" fill="#b76f59"/>','<path d="m28 30 5-16m114 16 5-16" fill="none" stroke="#c7a46c"/>')
face('amused','<path d="M67 103q23 23 46 0" fill="none"/>')
face('embarrassed','<path d="M72 108q18-9 36 0" fill="none"/>','<path d="m51 91 4 12m9-14 4 12m45-10 4 12m9-14 4 12" stroke="#cf8c7c" stroke-width="3"/>')
face('worried','<path d="M69 114q21-25 42 0M59 55l19-8m24 0 19 8" fill="none"/>')
face('smile','<path d="M65 101q25 26 50 0" fill="none"/>')
face('kindly','<path d="M69 103q21 19 42 0" fill="none"/>','<path d="m140 22 9-8 9 8-9 12Z" fill="#dbac94" stroke-width="2"/>')
face('curiously','<path d="M73 108q17-9 34 0" fill="none"/>',label('?',147,34,33))
face('middle-aged','<path d="M73 107q17 13 34 0" fill="none"/>','<path d="M43 62q-4-44 47-44 47 0 47 44-13-12-21-28-20 26-73 28" fill="#8b6854"/>')
put('train','<rect x="35" y="19" width="111" height="112" rx="22" fill="#a0b7c6"/><rect x="48" y="37" width="85" height="38" rx="5" fill="#e9f2ef"/><circle cx="59" cy="105" r="9" fill="#e7c382"/><circle cx="121" cy="105" r="9" fill="#e7c382"/><path d="m56 132-19 20m87-20 19 20M47 143h86" fill="none"/>')
put('get-on','<rect x="100" y="18" width="53" height="115" rx="6" fill="#bdd0d8"/><rect x="112" y="32" width="29" height="70" fill="#efe6d4"/><path d="M99 112H75v19H51v18H28M21 78h61m-17-17 17 17-17 17" fill="none" stroke="#9d8b65" stroke-width="7"/>')
put('opposite','<path d="M20 48h36v60h32v25H20Zm140 0h-36v60H92v25h68Z" fill="#bb9e83"/><path d="M66 70h48m-38-10L66 70l10 10m28-20 10 10-10 10" fill="none" stroke="#8196a8" stroke-width="5"/>')
put('funny','<ellipse cx="90" cy="112" rx="72" ry="20" fill="#e7c98d"/><path d="M48 108 62 36l28 23 23-30 19 79Z" fill="#b3c8d1"/><path d="M48 98h84" stroke="#b8907c" stroke-width="9"/><circle cx="114" cy="28" r="9" fill="#d6a499"/>')
put('powder','<ellipse cx="87" cy="105" rx="59" ry="27" fill="#d1b57d"/><ellipse cx="87" cy="97" rx="49" ry="19" fill="#f5e2c6"/><path d="m58 80 7-14m21 12 4-17m22 21 9-13" stroke="#d1bb95" stroke-width="4"/>')
put('compact','<ellipse cx="89" cy="63" rx="49" ry="39" fill="#ddbf84"/><ellipse cx="89" cy="63" rx="39" ry="30" fill="#cee1e9"/><path d="m69 45 31 24" stroke="#f7f5ed" stroke-width="6"/><ellipse cx="89" cy="120" rx="61" ry="25" fill="#ddbf84"/><ellipse cx="89" cy="116" rx="48" ry="17" fill="#f3dfc0"/>')
put('ugly','<path d="m35 33 30 6 21-13 33 19 29-4-14 41 13 24-22 34-35-13-25 15-24-31 8-34Z" fill="#c1b4a3"/><path d="m57 60 59 38-54 15 63-43-35 56" fill="none" stroke="#8d826d"/><path d="M145 20h17v17" fill="none"/>')
put('regularly','<rect x="26" y="31" width="130" height="115" rx="9" fill="#efe5cc"/><path d="M26 59h130m-98-38v24m66-24v24" fill="none"/>'+''.join(f'<circle cx="{x}" cy="{y}" r="8" fill="#9cb5a6" stroke="none"/>' for x in [55,90,125] for y in [83,118]))
put('handbag','<path d="M57 54V43q0-30 33-30t33 30v11" fill="none" stroke-width="9"/><path d="M29 53h122l10 90H19Z" fill="#b58d65"/><path d="M30 56q60 51 120 0" fill="#c49a70"/><rect x="80" y="82" width="22" height="18" rx="2" fill="#e8cc86"/>')
put('make-up','<ellipse cx="82" cy="96" rx="53" ry="42" fill="#e6c692"/><ellipse cx="82" cy="92" rx="40" ry="29" fill="#d9e8ec"/><circle cx="143" cy="44" r="21" fill="#f3dfc8"/><path d="m133 62-15 26" stroke="#b99a75" stroke-width="9"/>')
put('put-away','<path d="M30 80h121v62H30Z" fill="#c2a680"/><path d="m30 80 30-20h62l29 20" fill="#dfcaae"/><circle cx="91" cy="47" r="21" fill="#d8b97e"/><path d="M90 76v40m-14-14 14 14 14-14" fill="none" stroke="#879eaa" stroke-width="6"/>')
put('exercise-books','<path d="M35 25h100v115H35Z" fill="#c5d5d2"/><path d="M25 36v113h100M50 27v109m18-84h47m-47 19h47m-47 19h32" fill="none"/><path d="m91 120 10 10 27-33" fill="none" stroke="#7a966d" stroke-width="6"/>')
put('station','<path d="M20 69 90 19l70 50Z" fill="#ad8a6a"/><rect x="34" y="70" width="112" height="76" fill="#e3d3b6"/><rect x="77" y="95" width="29" height="51" fill="#abc3cb"/><circle cx="90" cy="59" r="15" fill="#fff4dc"/><path d="M90 49v11h9" fill="none"/>')
put('work-record','<rect x="5" y="5" width="350" height="290" rx="13" fill="#f6efdf"/>'+label('16 Oct 2026 · 10:00',180,35,24)+'<path d="M15 48h330m-330 80h330m-330 80h330" fill="none" stroke="#cbbda5"/>'+label('Room A',65,85,23)+label('cleaned · 15 Oct',239,78,22)+label('finished',239,109,23)+label('Room B',65,165,23)+label('painting · now',239,158,22)+label('in progress',239,189,23)+label('letter',65,245,23)+label('send · 17 Oct',239,238,22)+label('planned',239,269,23),360,300)
put('invitation-record','<rect x="5" y="5" width="350" height="260" rx="13" fill="#f6efdf"/>'+label('15 October 2026',180,38,24)+label('Mia',75,110,32)+label('Sam',285,110,32)+label('inviter',75,151,24)+label('receiver',285,151,24)+'<path d="M117 177h125m-17-15 17 15-17 15" fill="none" stroke="#8198ac" stroke-width="7"/>'+label('invited',180,232,26),360,270)
put('train-carriage','<rect width="1000" height="850" fill="#e8e1d4"/><path d="M0 560h1000v290H0Z" fill="#d5c3a7"/><path d="M0 560h1000M0 810h1000" stroke="#b7a17f" stroke-width="7"/><rect x="260" y="410" width="480" height="190" rx="27" fill="#b2c6cc"/><path d="M280 565q115-100 230-20 100-95 210 20v15H280Z" fill="#b8c6a2"/><path d="M500 412v188" stroke="#b59b76" stroke-width="10"/>',1000,850,True)
print('141–142 icons, independent work/invitation records and train background built.')
