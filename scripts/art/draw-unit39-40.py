"""Lesson 39–40: native vector living room; a plan never becomes a completed placement.
Sam and Penny are named in this lesson; their visual identities do not imply kinship.
"""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[2];O=R/'assets/unit39-40';O.mkdir(exist_ok=True)
INK='#4A3226';PAPER='#FFF9EF';SKIN='#F3CBAA';WALL='#F5EBDB';BLUE='#C8DBE0';ROSE='#CF8D87';GREEN='#9DAF91'
def p(d,f='none',a=''):return f'<path d="{d}" fill="{f}" {a}/>'
def rect(x,y,w,h,f,r=5,a=''):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" {a}/>'
def c(x,y,r,f,a=''):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{f}" {a}/>'
def ell(x,y,rx,ry,f,a=''):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{f}" {a}/>'
def at(b,x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})">{b}</g>'
def g(b,a=''):return f'<g {a}>{b}</g>'
def text(t,x,y,size=18,fill=INK):return f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" fill="{fill}" stroke="none" text-anchor="middle">{t}</text>'
def svg(b,w=320,h=230):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">{b}</svg>'
def save(n,b,w=320,h=230):(O/(n+'.svg')).write_text(svg(b,w,h))
def flower(x,y,s=1,col='#E0B06E'):
 b=''
 for dx,dy in [(0,-10),(10,-3),(6,8),(-6,8),(-10,-3)]:b+=c(dx,dy,8,col,a='stroke-width="2.5"')
 return at(b+c(0,0,5,'#B88F51',a='stroke-width="2"'),x,y,s)
def bouquet():
 b=p('M34 72 L9 18 M34 72 L34 7 M34 72 L59 23',a='stroke="#829B73" stroke-width="4"')+p('M28 50 Q4 35 9 58 Q21 65 30 60 M38 46 Q61 31 61 50 Q52 60 37 58',GREEN)
 return b+flower(10,18,.8)+flower(34,8,.92,'#E9C4A4')+flower(58,25,.8,'#E2B2B1')
def vase(flowers=False):
 b=at(bouquet(),9,-41,.9) if flowers else ''
 return b+p('M27 13 H65 Q59 37 70 51 Q84 70 77 91 Q70 107 46 107 Q22 107 15 91 Q8 70 22 51 Q33 37 27 13 Z',ROSE)+ell(46,13,20,5,'#E7BEB0')+p('M22 71 Q46 85 71 71',a='stroke="#F8E6CE" stroke-width="6"')+p('M26 90 Q46 100 66 90',a='stroke="#A96F6C" stroke-width="2"')
def person(kind,pose='idle'):
 sam=kind=='sam'
 if sam:
  b=p('M35 144 L29 201 H50 L63 166 L76 201 H98 L91 144','#796E5F')+p('M29 201 L18 210 H52 M76 201 V210 H110',INK)
  b+=p('M31 73 L96 73 L108 149 Q65 161 23 149 Z','#7E9FAD')+p('M51 75 L64 96 L77 75',PAPER)+p('M64 96 V151',a='stroke="#587582"')+rect(29,117,21,19,'#96B2BA',2)
  head=ell(63,40,29,34,SKIN)+p('M36 35 Q23 13 42 9 Q49 -3 67 5 Q84 0 93 15 L89 30 L81 18 Q58 27 41 20 Z','#D5BE94')+p('M46 6 Q43 19 53 23')
 else:
  b=p('M42 151 L42 199 H54 L60 160 L70 199 H82 L82 151','#E0B193')+p('M41 199 L29 207 H57 M69 199 L68 207 H93',INK)
  b+=p('M33 73 L90 73 L100 113 H26 Z','#D8B77B')+p('M32 113 H91 L113 178 Q65 195 13 178 Z','#AD7773')+p('M38 119 L32 172 M55 121 L53 180 M74 121 L78 181 M88 119 L98 173',a='stroke="#855955" stroke-width="2"')+p('M45 73 L63 88 L80 73 L72 65 H53 Z',PAPER)+p('M62 87 L53 104 L65 101 L73 109 L71 85','#7C9687')
  head=p('M26 31 Q24 1 64 1 Q101 0 102 31 L111 77 L82 85 H37 L19 75 Z','#46332D')+ell(64,39,27,30,SKIN)+p('M34 27 Q53 24 65 10 Q76 23 92 27 L96 19 Q74 -2 51 6 Z','#46332D')
 if pose=='receive':arms=[('M32 82 L22 123 L54 148',(54,148)),('M94 82 L119 124 L90 148',(90,148))]
 elif pose=='hold-left':arms=[('M33 82 L8 105 L-13 108',(-13,108)),('M93 83 L81 111 L19 125',(19,125))]
 elif pose=='hold-right':arms=[('M32 83 L52 112 L110 126',(110,126)),('M95 82 L124 105 L142 108',(142,108))]
 elif pose=='warn':arms=[('M33 82 L8 74 L-6 51',(-6,51)),('M93 82 L110 115',(110,115))]
 elif pose=='hat':arms=[('M32 82 L7 63 L30 -5',(30,-5)),('M95 82 L117 116',(117,116))]
 else:arms=[('M32 83 L12 117',(12,117)),('M94 83 L116 116',(116,116))]
 for d,(x,y) in arms:b+=p(d,a='stroke-width="7"')+c(x,y,6,SKIN)
 b+=head+c(53,41,2,INK)+c(76,41,2,INK)+p('M54 56 Q65 64 77 56')
 if not sam:b+=c(90,54,3,'#D9AC5E')
 return b
for n in ['sam','penny']:
 save(n,at(person(n),18,12),165,235);save(n+'-receive',at(person(n,'receive'),18,12),165,235)

def room(m=False):
 w,h=(480,340) if m else(1000,640);f=290 if m else 576
 b=rect(0,0,w,h,WALL,0,a='stroke="none"')+rect(0,f,w,h-f,'#E0CCB0',0,a='stroke="none"')+p(f'M0 {f} H{w}',a='stroke="#BBA787" stroke-width="2"')
 wx,wy,ws=(163,35,.70) if m else(332,276,1.0)
 window=rect(0,0,132,164,BLUE,55,a='stroke="#A1B8B8" stroke-width="3"')+p('M66 0 V164 M0 81 H132',a='stroke="#A1B8B8" stroke-width="3"')+p('M9 111 Q47 99 63 123 Q102 99 123 113',a='stroke="#B0C5AF" stroke-width="13"')
 b+=at(window,wx,wy,ws)
 tx,ty,tw=(138,254,110) if m else(306,530,176)
 b+=ell(tx+tw/2,ty,tw/2,12,'#BC9B73')+p(f'M{tx+16} {ty+8} V{f+23} M{tx+tw-16} {ty+8} V{f+23}',a='stroke="#9D7D59" stroke-width="9"')
 sx,sy,sw=(261,184,86) if m else(557,464,141)
 b+=rect(sx,sy,sw,11,'#BD9E77',2)+p(f'M{sx+15} {sy+12} L{sx+15} {sy+32} L{sx+41} {sy+12} M{sx+sw-13} {sy+12} V{sy+32} L{sx+sw-40} {sy+12}',a='stroke="#B2A082" stroke-width="5"')
 ax,ay,asc=(5,117,.81) if m else(68,340,1.1);px,py,psc=(361,117,.81) if m else(782,340,1.1)
 # Early Sam has empty hands; on Give it to me the same vase transfers once.
 b+=g(at(person('sam','idle'),ax,ay,asc),'data-actor="sam" data-from="-1" data-to="2"')
 b+=g(at(person('sam','hold-right'),ax,ay,asc),'data-actor="sam" data-from="3" data-to="9"')
 b+=g(at(person('sam','idle'),ax,ay,asc),'data-actor="sam" data-from="10" data-to="99"')
 b+=g(at(person('penny','hold-left'),px,py,psc),'data-actor="penny" data-from="-1" data-to="2"')
 b+=g(at(person('penny','idle'),px,py,psc),'data-actor="penny" data-from="3" data-to="5"')
 b+=g(at(person('penny','warn'),px,py,psc),'data-actor="penny" data-from="6" data-to="9"')
 b+=g(at(person('penny','idle'),px,py,psc),'data-actor="penny" data-from="10" data-to="99"')
 vs=.66 if m else .90
 b+=g(at(vase(True),px-24*psc-46*vs,py+108*psc-68*vs,vs),'data-prop="penny-vase" data-from="-1" data-to="2"')
 b+=g(at(vase(True),ax+137*asc-46*vs,ay+108*asc-68*vs,vs),'data-prop="sam-vase" data-from="3" data-to="9"')
 b+=g(at(vase(True),sx+sw/2-46*vs,sy-107*vs,vs),'data-prop="shelf-vase" data-from="10" data-to="99"')
 for nm,x,y in [('Sam',ax+64*asc,ay+231*asc),('Penny',px+64*psc,py+231*psc)]:b+=text(nm,x,y,17 if m else 20)
 return b
frames=['Penny拿着完整花瓶，Sam询问她的打算。','Penny计划放到桌子上，仍拿着花瓶。','Sam阻止放桌子的打算，花瓶还在Penny手里。','Sam接过同一只花瓶。','Penny询问新的打算，Sam拿着花瓶。','Sam计划放在窗前，花瓶仍在手里。','Penny提醒Sam小心，花瓶保持完整。','Penny提醒别摔落；没有发生破碎。','Penny否定窗前的位置，Sam仍拿着花瓶。','Penny要求改放架子上，尚未完成安放。','Sam将同一只花瓶安稳放到架子上。','花瓶已安放好，Sam称赞它。','Penny也称赞花，花瓶仍在架子上。']
spec={'unit':'unit39-40','theatreVersion':2,'wall':WALL,'title':'Sam、Penny和同一只花瓶；房间里有桌子、窗户与架子。','svg':svg(room(),1000,640),'mobileSvg':svg(room(True),480,340),'speakers':['sam','penny','sam','sam','penny','sam','penny','penny','penny','penny','sam','sam','penny'],'frames':frames,'finish':'读懂摆放的位置和接收者，把本课发现收进纪念。','completionArt':'/assets/unit39-40/keepsake.svg'}
(R/'unit39-40/scene.js').write_text('(function(root){root.CanranCore.unit3940Scene=root.CanranCore.classroomScene.create('+json.dumps(spec,ensure_ascii=False)+');})(globalThis);\n')
cover=rect(0,0,640,370,WALL,18,a='stroke="#CDBDA5"')+rect(0,312,640,58,'#E0CCB0',0,a='stroke="none"')+rect(224,37,150,206,BLUE,70,a='stroke="#A1B8B8"')+p('M299 39 V243 M225 139 H373',a='stroke="#A1B8B8"')+rect(325,252,108,12,'#BD9E77',2)+at(person('sam'),60,91,1.05)+at(person('penny','hold-left'),484,91,1.05)+at(vase(True),423,156,.87)
save('cover-scene',cover,640,370)
# Assessment scene: empty destinations, equal neutral hit areas, no answer encoded in prop placement.
for mobile in [False,True]:
 w,h=(480,440) if mobile else(720,340)
 b=rect(0,0,w,h,WALL,15,a='stroke="#CDBDA5"')+rect(0,h*.83,w,h*.17,'#E0CCB0',0,a='stroke="none"')
 b+=rect(w*.37,h*.16,w*.23,h*.45,BLUE,36,a='stroke="#A1B8B8"')+p(f'M{w*.485} {h*.16} V{h*.61} M{w*.37} {h*.385} H{w*.6}',a='stroke="#A1B8B8"')
 b+=ell(w*.18,h*.70,w*.105,h*.045,'#BC9B73')+p(f'M{w*.10} {h*.72} V{h*.93} M{w*.26} {h*.72} V{h*.93}',a='stroke="#9D7D59" stroke-width="8"')
 b+=rect(w*.71,h*.48,w*.23,h*.025,'#BD9E77',2)+p(f'M{w*.75} {h*.505} V{h*.56} L{w*.79} {h*.505} M{w*.90} {h*.505} V{h*.56} L{w*.86} {h*.505}',a='stroke="#AE9574" stroke-width="6"')
 save('placement-room'+('-mobile' if mobile else ''),b,w,h)
# Words and recurring objects.
save('vase',at(vase(),75,4,1.85));save('vase-flowers',at(vase(True),93,70,1.45));save('flowers',at(bouquet(),65,41,2.5));save('flower',p('M160 94 V211',a='stroke="#829B73" stroke-width="8"')+p('M159 165 Q92 121 108 165 Q128 187 159 178',GREEN)+flower(160,76,2.7))
front=rect(70,15,180,158,BLUE,8,a='stroke="#A1B8B8"')+p('M160 15 V173 M70 94 H250',a='stroke="#A1B8B8"')+at(vase(),114,116,1)
save('front',front);save('in-front-of',front)
save('careful',at(person('penny','warn'),106,8,1)+at(vase(True),36,138,.56))
save('drop',at(vase(),111,12,1.08)+p('M94 159 V191 M83 180 L94 193 L105 180',a='stroke="#977F66" stroke-width="6"')+p('M102 219 H227',a='stroke="#BEAA8A" stroke-width="4"'))
def envelope():return rect(0,0,126,78,PAPER,6)+p('M3 3 L63 45 L123 3 M2 75 L43 35 M124 75 L83 35',a='stroke="#B5A18A"')+rect(102,8,15,17,'#B4C8C3',2)
def picture():return rect(0,0,130,93,'#BA9A70',3)+rect(10,10,110,73,'#D5E6E5',1)+p('M12 76 L41 41 L66 65 L87 34 L119 81 Z','#A4B499')+c(47,29,9,'#E6C67C')
def paper():return rect(0,0,104,118,PAPER,3)+rect(12,22,37,43,'#BCCBC4',1)+p('M61 23 H92 M61 39 H92 M61 55 H92 M13 78 H91 M13 94 H91',a='stroke="#B9B1A4" stroke-width="4"')
def coat():return p('M52 4 L33 18 L0 62 L23 83 L34 57 L28 146 H110 L103 57 L116 83 L139 63 L109 18 L89 4 L69 22 Z','#B1BDB4')+p('M52 5 L50 32 L67 46 V145 M90 5 L86 31 L72 46',a='stroke="#758D83"')
def hat():return ell(63,64,60,11,'#C6A26B')+p('M20 62 L30 22 Q62 9 95 24 L107 63 Z','#D8B87D')+p('M23 50 Q65 63 104 51',a='stroke="#8D7161" stroke-width="10"')
def television(on=False):return rect(0,0,155,100,'#BAA990',8)+rect(10,12,109,73,'#B6CED3' if on else '#8B9B9A',5)+c(136,28,7,'#DDD0AF')+p('M136 52 V75 M18 101 L13 119 M132 101 L138 119',a='stroke-width="6"')
def stereo(on=False):
 b=rect(0,0,154,87,'#A7B7B0',6)+c(26,48,18,'#6F8787')+c(128,48,18,'#6F8787')+rect(51,17,53,19,'#DAD4AD',2)+rect(59,48,36,25,PAPER,1)+p('M30 0 V-15 H124 V0',a='stroke-width="6"')
 if on:b+=p('M173 3 V28 Q159 32 160 24 Q161 19 173 21 M174 3 L190 -3 V23 Q178 28 178 20 Q181 13 190 16',a='stroke="#84988E"')
 return b
def dress():return p('M35 9 L2 50 L26 64 L41 48 L26 126 H113 L97 48 L112 64 L137 49 L105 9 L87 9 Q68 29 50 9 Z',ROSE)+p('M39 63 H100 M54 71 L48 118 M82 71 L89 118',a='stroke="#A46C6A"')
def icecream():return p('M7 35 L33 101 L60 35 Z','#D2AD77')+c(22,26,19,'#F2DAC0')+c(45,26,19,'#D6A29B')+p('M20 45 L44 75 M15 57 L37 85 M44 46 L24 73',a='stroke="#BA986B" stroke-width="2"')
objects={'coat':coat(),'hat':hat(),'television':television(),'stereo':stereo(True),'dress':dress(),'flowers':bouquet(),'newspaper':paper(),'picture':picture(),'ice-creams':icecream()+at(icecream(),92,0),'letter':envelope(),'photographs':rect(0,0,112,89,PAPER,2)+rect(8,8,96,61,'#C9DEE0',1)+p('M9 66 L33 37 L52 54 L77 25 L102 67 Z','#8CA393')+c(35,24,7,'#DEBB75')+at(rect(0,0,112,89,PAPER,2)+rect(8,8,96,61,'#D5DCD0',1)+p('M9 66 L33 47 L55 61 L76 33 L102 67 Z','#9CA882')+c(35,24,7,'#E0C596'),67,48,.72)}
for n,obj in objects.items():
 if n=='flowers':continue
 save(n,at(obj,65,45,1.4))
save('show',at(picture(),70,46,1.2)+p('M99 177 Q119 149 156 168 L209 151 L229 165 Q211 199 166 203 L117 206 Z',SKIN))
save('send',at(envelope(),26,24,1)+rect(215,76,67,124,'#A0B1A6',16)+rect(227,96,44,9,'#667D77',2)+p('M139 136 H191 M176 122 L191 136 L176 150',a='stroke="#947E63" stroke-width="6"'))
save('take',at(person('sam','hold-right'),30,6,1)+at(bouquet(),167,88,.95)+p('M205 185 H278 M263 170 L279 185 L263 200',a='stroke="#947E63" stroke-width="6"'))
save('give',at(vase(),99,21,1.24)+p('M50 194 Q75 159 115 175 L158 164 L185 179 Q155 212 95 211 Z',SKIN))
save('put-take',at(coat(),1,20,1)+at(hat(),178,96,.90))
# Twelve textbook picture prompts, with numbers kept in HTML rather than baked into art.
for number,n in [(13,'coat'),(14,'hat'),(15,'television'),(16,'stereo'),(17,'dress'),(18,'flowers'),(19,'newspaper'),(20,'picture'),(30,'ice-creams'),(40,'flowers'),(50,'letter'),(60,'photographs')]:
 b=rect(0,0,360,245,WALL,12,a='stroke="#CDBDA5"')+ell(180,224,137,10,'#DFCFB6',a='stroke="none"')
 if number==13:
  # One arm is already in the coat; the other sleeve is waiting. No floating spare coat.
  actor=person('sam').replace(p('M32 83 L12 117',a='stroke-width="7"')+c(12,117,6,SKIN),'')
  b+=at(actor,115,19,.91)+at(p('M40 77 L25 83 L-1 119 L14 137 L30 115 L22 171 L60 178 L63 96 L52 77 Z','#B1BDB4')+p('M96 75 L118 86 L132 132 L109 146 L95 116 L89 171 L68 177 L65 95 L76 76 Z','#B1BDB4')+p('M61 101 L51 163 M69 101 L77 165',a='stroke="#758D83"')+c(9,139,6,SKIN),115,19,.91)
 elif number==14:b+=at(person('sam','hat'),131,29,.91)+at(hat(),110,0,.57)
 elif number==15:b+=at(television(),96,61,1.16)+p('M282 98 L271 92 L257 93',a='stroke-width="10" stroke="#F3CBAA"')
 elif number==16:b+=at(stereo(True),66,83,1.18)
 else:
  obj=objects[n];scale=1.75 if n=='flowers' else 1.26
  x,y=(120,71) if n=='flowers' else(96,59)
  b+=at(obj,x,y,scale)
 save('gallery-'+str(number),b,360,245)
reward=rect(6,8,488,284,WALL,16,a='stroke="#CDBDA5"')+rect(80,197,342,15,'#BC9B73',3)+p('M122 214 V244 L163 214 M380 214 V244 L338 214',a='stroke="#B59D7B" stroke-width="9"')+at(vase(True),196,71,1.18)+at(person('sam'),21,131,.55)+at(person('penny'),392,131,.55)
save('keepsake',reward,500,305)

save('sam-certificate',at(person('sam'),1,10,.95)+rect(142,185,73,10,'#BD9E77',2)+p('M152 195 V215 L172 195 M205 195 V215 L185 195',a='stroke="#AE9574" stroke-width="5"')+at(vase(True),151,121,.58),228,235)
