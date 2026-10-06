"""Lesson 37–38 native vector workshop. Intent is not painted completion.
George and Dan have distinct silhouettes; clothes are a visual adaptation.
"""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[2];O=R/'assets/unit37-38';O.mkdir(exist_ok=True)
INK='#4A3226';PAPER='#FFF9EF';SKIN='#F2CAA5';WOOD='#C69A67';WALL='#E8F0EE';PINK='#E6A2B4'
def p(d,f='none',a=''):return f'<path d="{d}" fill="{f}" {a}/>'
def rect(x,y,w,h,f,r=5,a=''):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" {a}/>'
def c(x,y,r,f,a=''):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{f}" {a}/>'
def ell(x,y,rx,ry,f,a=''):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{f}" {a}/>'
def at(b,x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})">{b}</g>'
def g(b,a=''):return f'<g {a}>{b}</g>'
def text(t,x,y,size=18,fill=INK):return f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" fill="{fill}" stroke="none" text-anchor="middle">{t}</text>'
def svg(b,w=320,h=230):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">{b}</svg>'
def save(n,b,w=320,h=230):(O/(n+'.svg')).write_text(svg(b,w,h))
def hammer(size=1):return at(rect(25,22,13,74,'#B78552',3)+p('M5 6 L46 4 L64 17 L49 27 L5 26 Z','#869DA0')+p('M49 10 L49 23',a='stroke="#5F797B"'),0,0,size)
def brush(colour=PINK):return rect(16,29,12,53,WOOD,4)+rect(2,9,40,30,colour,3)+p('M5 22 V39 M12 28 V39 M21 24 V39 M30 25 V39 M38 21 V39',a='stroke="#B87684" stroke-width="2"')+rect(2,36,40,9,'#9DACA6',1)
def tin(colour='#D9D6BC'):return rect(5,14,58,57,colour,4)+ell(34,14,29,9,colour)+p('M5 20 Q-8 49 35 50 Q72 49 62 22')+rect(21,33,27,17,PAPER,2)
def bookcase(painted=False,books=False):
 b=rect(6,8,144,209,'#D8B181',3)+rect(18,18,120,188,'#EACDA3',1)
 for y in [72,135,196]:b+=rect(13,y,131,10,WOOD,1)
 b+=rect(4,3,148,14,WOOD,2)+rect(9,213,16,13,WOOD,1)+rect(130,213,16,13,WOOD,1)
 b+=p('M29 27 V63 M126 87 V122 M27 151 V185',a='stroke="#D1AE7F" stroke-width="2"')
 if painted:b+=rect(6,20,11,172,PINK,1)+rect(13,73,64,8,PINK,1)+p('M17 39 Q55 32 74 45 V56 Q52 50 17 59 Z',PINK,a='stroke="none"')
 if books:
  for x,w,h,col in [(27,17,40,'#92B4AF'),(47,17,32,'#D58C7A'),(68,20,41,'#DFC26E'),(94,20,38,'#9CA6BD')]:b+=rect(x,72-h,w,h,col,1)
 return b

def person(kind='george',pose='idle'):
 # Distinct face, hair, shoulder width, clothing construction, height and feet.
 dan=kind=='dan';girl=kind=='susan';boy=kind=='boy';child=girl or boy
 if dan:
  b=p('M42 141 L38 207 H52 L63 161 L76 207 H91 L86 141','#697E88')+p('M38 207 L27 212 H54 M76 208 L75 213 H101',INK)
  b+=p('M37 72 L91 72 L100 141 L31 141 Z','#F1E4CF')+p('M41 73 L63 92 L58 146 L30 146 Z','#96A5A0')+p('M88 73 L65 92 L72 146 H100 Z','#96A5A0')+p('M56 79 L64 96 L72 79',PAPER)
  head=ell(64,41,24,32,SKIN)+p('M42 32 Q36 2 64 6 Q80 3 92 16 L83 25 Q60 18 43 36 Z','#A3A49A')+p('M83 20 L86 40 L91 37', '#A3A49A')
 elif child:
  b=p('M43 136 L41 184 H55 L64 150 L76 184 H90 L85 136','#7C94A0')+p('M42 184 L32 189 H57 M77 184 V189 H99',INK)
  b+=p('M36 72 L90 72 L101 139 H27 Z','#C3AE6C' if girl else '#94B2AC')
  head=p('M32 35 Q28 1 64 5 Q98 4 97 36 V72 H32 Z','#75563A')+ell(64,41,25,29,SKIN)+p('M38 31 Q43 8 66 12 Q88 12 90 30 L71 23 L57 33 L47 24 Z','#75563A')
  if girl:head+=p('M94 23 Q120 12 115 55 L97 50 Z','#75563A')+c(94,26,5,'#BB7A82')
 else:
  b=p('M33 145 L30 195 H54 L65 159 L77 195 H102 L98 145','#718899')+p('M30 195 L16 201 H57 M78 195 L77 202 H113',INK)
  b+=p('M25 73 L108 73 L113 136 H19 Z','#B97965')+p('M43 78 L91 78 L99 153 H32 Z','#DEC797')+p('M46 78 L42 67 M86 78 L90 67')+rect(48,110,37,23,'#CBB078',3)+p('M66 112 V131')
  head=p('M35 20 Q63 0 96 21 L94 55 Q89 74 65 74 Q42 74 36 57 Z',SKIN)+p('M33 39 Q24 15 41 12 Q38 0 54 3 Q69 -8 86 8 Q101 9 97 34 L83 24 L69 28 L57 20 L48 34 Z','#44312A')
 # Hands remain in known positions for shared handoff assets and stage props.
 if pose=='receive':arms=[('M29 82 L14 116 L25 133',(25,133)),('M100 82 L114 108 L113 126',(113,126))]
 elif pose=='work':arms=[('M29 82 L18 105 L41 109',(41,109)),('M100 82 L117 107 L132 108',(132,108))]
 elif pose=='offer':arms=[('M37 82 L15 110 L-2 112',(-2,112)),('M91 82 L111 107 L111 127',(111,127))]
 elif pose=='paint':arms=[('M29 82 L15 116',(15,116)),('M100 82 L135 95 L162 110',(162,110))]
 elif pose=='wash':arms=[('M30 82 L15 116',(15,116)),('M99 82 L125 112 L165 137',(165,137))]
 elif pose=='shave':arms=[('M30 82 L18 65 L43 59',(43,59)),('M99 82 L117 115',(117,115))]
 elif pose=='write':arms=[('M30 82 L15 116',(15,116)),('M91 82 L80 112 L70 144',(70,144))]
 elif pose=='listen':arms=[('M30 82 L19 63 L35 50',(35,50)),('M100 82 L111 114',(111,114))]
 else:arms=[('M30 82 L15 116',(15,116)),('M99 82 L117 115',(117,115))]
 for d,(x,y) in arms:b+=p(d,a='stroke-width="7"')+c(x,y,6,SKIN)
 b+=head+c(53,42,2,INK)+c(76,42,2,INK)+p('M54 58 Q65 65 77 57')
 if dan:b+=p('M49 29 L56 27 M72 27 L80 29',a='stroke="#806D60" stroke-width="2"')
 return b
for n in ['george','dan','susan']:
 save(n,at(person(n),10,8),150,232)
 save(n+'-receive',at(person(n,'receive'),10,8),150,232)

def workshop(mobile=False):
 w,h=(480,340) if mobile else(1000,640);top=12 if mobile else 263;floor=310 if mobile else 593
 b=rect(0,0,w,h,WALL,0,a='stroke="none"')+rect(0,floor-23,w,h-floor+23,'#EADCC7',0,a='stroke="none"')
 # Quiet structural wall boards and window; no busy marks behind dialogue.
 b+=rect(12,top+12,90 if mobile else 150,99,'#F6F2DF',4,a='stroke="#B8C6B9" stroke-width="2"')+p(f'M{52 if mobile else 87} {top+12} V{top+111} M12 {top+60} H{102 if mobile else 162}',a='stroke="#B8C6B9" stroke-width="2"')
 gx,gy,gs=(12,129,.81) if mobile else(100,352,1.10);dx,dy,ds=(357,115,.91) if mobile else(770,335,1.16)
 bx,by,bs=(184,124,.78) if mobile else(433,310,1.20)
 b+=at(bookcase(),bx,by,bs)
 # Workbench with restrained woodgrain, below faces.
 b+=rect(80 if mobile else 217,floor-57,116 if mobile else 198,13,WOOD,2)+p(f'M{92 if mobile else 233} {floor-44} V{floor+12} M{179 if mobile else 396} {floor-44} V{floor+12}',a='stroke="#9E754E" stroke-width="10"')
 b+=g(at(person('george','work'),gx,gy,gs),'data-actor="george"')+g(at(person('dan','offer'),dx,dy,ds),'data-actor="dan"')
 # The same physical small hammer is on its hook OR in Dan's hand.
 hx,hy,hs=(319,45,.42) if mobile else(667,292,.70);smallx= hx+34 if mobile else hx+60
 b+=rect(hx-8,hy-10,88 if mobile else 140,64 if mobile else 105,'#D9E2D5',3,a='stroke="#ABBDAF" stroke-width="2"')
 b+=g(at(hammer(),hx,hy,hs),'data-prop="big-hook" data-from="-1" data-to="7"')
 b+=g(at(hammer(.65),smallx,hy+12,hs),'data-prop="small-hook-first" data-from="-1" data-to="4"')
 b+=g(at(hammer(.65),smallx,hy+12,hs),'data-prop="small-hook-return" data-from="6" data-to="99"')
 shx=dx-2*ds-31*.65*hs; shy=dy+112*ds-76*.65*hs
 b+=g(at(hammer(.65),shx,shy,hs),'data-prop="small-offered" data-from="5" data-to="5"')
 bighs=.78 if mobile else 1.16;hx2=gx+132*gs-31*bighs;hy2=gy+108*gs-76*bighs
 b+=g(at(hammer(),hx2,hy2,bighs),'data-prop="big-delivered" data-from="8" data-to="99"')
 # Plan stays on a separate card, never changes the furniture's paint.
 plan=rect(0,0,100,63,PAPER,5,a='stroke="#B7A185" stroke-width="2"')+rect(9,9,33,42,PINK,4)+p('M52 17 H89 M52 29 H82 M52 42 H89',a='stroke="#B7A185" stroke-width="3"')
 b+=g(at(plan,275 if mobile else 620,244 if mobile else 510,.7 if mobile else 1),'data-prop="pink-plan" data-from="13" data-to="99"')
 for name,x,y in [('George',gx+65*gs,gy+220*gs),('Dan',dx+64*ds,dy+226*ds)]:b+=g(text(name,x,y,17 if mobile else 20),'data-name="'+name+'"')
 return b
frames=['Dan在工坊里和正在做木色书架的George交谈。']*5+['Dan拿起小锤询问；大锤仍在工具墙上。','George否认小锤；小锤已经放回，大锤仍未递出。','George指出要大锤；大锤仍在工具墙上。','Dan把大锤递给George；墙上只剩小锤。','George拿着大锤向Dan道谢。']+['两人在讨论下一步；书架仍未涂漆。']*3+['George计划涂粉色：独立色样出现，实际书架仍是木色。']*5
spec={'unit':'unit37-38','theatreVersion':2,'wall':WALL,'title':'George与Dan在工坊里，一座木色书架和两把锤子等待故事展开。','svg':svg(workshop(),1000,640),'mobileSvg':svg(workshop(True),480,340),'speakers':['dan','dan','george','george','dan','dan','george','george','dan','george','dan','george','dan','george','dan','george','george','george'],'frames':frames,'finish':'读懂工具的选择，也分清了打算与正在做的事。','completionArt':'/assets/unit37-38/keepsake.svg'}
(R/'unit37-38/scene.js').write_text('(function(root){root.CanranCore.unit3738Scene=root.CanranCore.classroomScene.create('+json.dumps(spec,ensure_ascii=False)+');})(globalThis);\n')
# Cover: stage without time-gated props. It shows a workshop, not the answer or future outcome.
cover=rect(0,0,640,370,WALL,18,a='stroke="#BAC5B6"')+rect(0,310,640,60,'#E8D7BF',2,a='stroke="none"')+at(bookcase(),248,75,1.03)+at(person('george','work'),65,112,1.05)+at(person('dan'),453,97,1.11)+at(hammer(),432,50,.55)
save('cover-scene',cover,640,370)
# Actual-world action pairs: tools prepared versus visible contact / changed action.
def pairscene(kind,now=False):
 b=rect(0,0,360,245,WALL,10,a='stroke="#B8C6B9"')+rect(0,210,360,35,'#E9DDC8',0,a='stroke="none"')
 if kind=='paint':
  b+=at(bookcase(now),200,22,.86)+at(person('george','paint' if now else 'idle'),87,30,.83)+at(tin(PINK),43,164,.62)
  if now:b+=at(brush(),210,75,.69)+c(222,121,5,SKIN)
  else:b+=at(brush(),33,145,.62)
 elif kind=='shave':
  b+=rect(15,17,123,165,'#CADDE0',9,a='stroke="#9FB6B6"')+at(person('dan','shave' if now else 'idle'),178,18,.91)+rect(12,185,131,18,'#B9CBCD',4)
  if now:b+=ell(236,77,25,13,PAPER)+p('M214 69 L220 77',a='stroke-width="4"')+rect(214,62,17,7,'#9AADA7',2)
  else:b+=rect(52,144,5,36,WOOD,2)+rect(40,142,28,7,'#A0B7B4',2)+at(brush(PAPER),85,127,.64)
 elif kind=='bus':
  b+=p('M0 206 H360',a='stroke="#BDA886"')+rect(274,29,70,46,'#F3EAD4',5)+text('BUS',309,58,20)+p('M309 76 V213',a='stroke="#9CAEA5" stroke-width="7"')
  b+=at(person('dan'),198 if now else 32,19,.89)
  if not now:b+=p('M125 187 H194 M181 176 L195 187 L181 198',a='stroke="#98ABA1" stroke-dasharray="6 5"')
 elif kind=='homework':
  b+=at(person('susan','write' if now else 'idle'),32,21,.79)+at(person('boy','write' if now else 'idle'),215,21,.79)+rect(30,151,293,17,WOOD,3)+p('M49 168 V223 M303 168 V223',a='stroke="#A6835D" stroke-width="11"')
  for x in [84,267]:
   b+=rect(x-19,138,54,13,PAPER,2)
   if now:b+=p(f'M{x-3} 146 L{x+10} 128',a='stroke="#6F889A" stroke-width="4"')+c(x+3,135,4,SKIN)+p(f'M{x-7} 143 H{x+21}',a='stroke="#B5B4A3" stroke-width="1"')
   else:b+=p(f'M{x-10} 126 H{x+30}',a='stroke="#6F889A" stroke-width="5"')
 elif kind=='stereo':
  b+=at(person('dan','listen' if now else 'idle'),42,18,.91)+at(person('susan','listen' if now else 'idle'),236,39,.81)+rect(140,143,84,52,'#B8C8BC',5)+c(158,166,12,'#788F89')+c(206,166,12,'#788F89')+rect(175,156,15,15,'#DDD1A3',2)
  if now:b+=p('M162 99 V126 Q149 130 150 120 Q151 114 162 117 M163 100 L185 96 V122 Q172 128 173 118 Q175 112 185 114',a='stroke="#6B8982" stroke-width="4"')
 elif kind=='dishes':
  b+=rect(159,123,183,93,'#CAD8D1',4)+ell(244,137,60,15,'#94B4B6')+p('M285 109 V82 Q303 66 319 86',a='stroke="#8EAAA9" stroke-width="8"')+at(person('dan','wash' if now else 'idle'),80,15,.92)
  if now:
   b+=ell(243,137,20,27,PAPER)+c(230,141,5,SKIN)
   for x,y,r in [(240,157,6),(260,144,8),(278,140,5),(218,149,6)]:b+=c(x,y,r,'#EDF6F1',a='stroke="#A5C6C4" stroke-width="2"')
   b+=p('M319 98 V119',a='stroke="#95B5C7" stroke-dasharray="3 4"')
  else:
   for y in [114,107,100]:b+=ell(191,y,29,8,PAPER)
 return b
for kind in ['shave','bus','homework','paint','stereo','dishes']:
 for state in ['plan','now']:save(kind+'-'+state,pairscene(kind,state=='now'),360,245)
# Compact vocabulary symbols; all remain meaningful when reduced to 110px.
save('bookcase',at(bookcase(False,True),79,0,.94))
save('hammer',at(hammer(),103,16,1.95))
# same canvas: relative size is the feature children must read, not a different icon style.
save('hammer-big',at(hammer(),33,25,1.7),180,220);save('hammer-small',at(hammer(),58,96,.85),180,220)
save('paint',at(bookcase(True),42,8,.88)+at(brush(),225,62,1.4))
save('make',at(bookcase(),126,23,.85)+at(person('george','work'),22,45,.78))
save('work',at(person('george','work'),31,27,.90)+rect(147,147,139,15,WOOD,2)+p('M160 163 V218 M267 164 V218',a='stroke-width="9"')+at(hammer(),173,74,.7))
save('hard',at(person('george','work'),31,27,.90)+rect(147,147,139,15,WOOD,2)+at(hammer(),173,74,.7)+p('M168 30 L176 17 M192 42 L208 35 M151 18 L154 6',a='stroke="#AF9259"'))
save('pink',rect(77,29,166,166,PINK,25))
save('favourite',rect(36,70,68,88,'#C6D1DC',7)+rect(126,70,68,88,PINK,7)+rect(216,70,68,88,'#E1C879',7)+p('M158 57 C111 33 133 0 158 22 C185 -2 207 33 158 57 Z','#C58186'))
save('homework',p('M38 65 Q91 47 152 71 Q220 46 280 65 V192 Q213 178 152 202 Q91 178 38 192 Z',PAPER)+p('M152 72 V202 M61 87 H126 M61 113 H126 M61 139 H126 M179 87 H254 M179 113 H254',a='stroke="#A4B7B0"')+p('M218 174 L257 107 L267 114 L228 181 L214 187 Z','#DAB062'))
save('listen',at(person('dan','listen'),108,3,1)+p('M41 60 Q60 86 42 107 M65 66 Q80 86 64 101',a='stroke="#88A6A2" stroke-width="6"'))
save('dish',ell(159,126,114,77,PAPER)+ell(159,126,83,52,'#D6E6E3'))
save('plan-icon',rect(82,34,153,164,PAPER,11)+p('M112 78 H202 M112 109 H202 M112 140 H183',a='stroke="#9AB6B1" stroke-width="8"')+p('M175 181 L229 181 L215 167 M229 181 L215 194',a='stroke="#B58B64" stroke-width="7"'))
save('now-icon',c(160,116,84,PAPER)+p('M160 57 V116 L202 139',a='stroke="#789F99" stroke-width="10"')+c(160,116,6,INK))
# Reward is a learning board / plan, not a claim the bookcase has been finished.
reward=rect(12,10,476,280,'#EADBC2',15,a='stroke="#B79773"')+rect(46,28,197,233,PAPER,5)+at(bookcase(),82,61,.77)+rect(278,36,174,120,PAPER,5)+rect(294,52,49,62,PINK,4)+p('M360 61 H431 M360 80 H421 M295 135 H423',a='stroke="#B7A68C" stroke-width="4"')+at(hammer(),286,180,.83)+at(brush(),375,176,.9)
save('keepsake',reward,500,310)
