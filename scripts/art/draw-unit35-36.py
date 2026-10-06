"""Native vector art for Lesson 35–36. Three photographs, distinct villagers.
Book positions are facts; clothing and unnamed identities are visual adaptations.
"""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[2];O=R/'assets/unit35-36';O.mkdir(exist_ok=True)
INK='#4A3226';PAPER='#FFFDF6';SKIN='#F4CDA8';WATER='#B7D5D8';GREEN='#AAC39A';SKY='#ECF3EC'
def p(d,f='none',a=''):return f'<path d="{d}" fill="{f}" {a}/>'
def rect(x,y,w,h,f,r=5,a=''):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" {a}/>'
def c(x,y,r,f,a=''):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{f}" {a}/>'
def at(b,x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})">{b}</g>'
def g(b,a=''):return f'<g {a}>{b}</g>'
def svg(b,w=320,h=220):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{b}</svg>'
def save(n,b,w=320,h=220):(O/(n+'.svg')).write_text(svg(b,w,h))
def arrow(x,y,x2,y2):
 import math
 ang=math.atan2(y2-y,x2-x);z=11
 return p(f'M{x} {y} L{x2} {y2}',a='stroke="#9B7951" stroke-width="4" stroke-dasharray="7 6"')+p(f'M{x2-z*math.cos(ang-.6)} {y2-z*math.sin(ang-.6)} L{x2} {y2} L{x2-z*math.cos(ang+.6)} {y2-z*math.sin(ang+.6)}',a='stroke="#9B7951" stroke-width="4"')
def person(kind='man',pose='walk'):
 female=kind in ['wife','mother','girl'];child=kind in ['boy','girl','child2','child3'];body=''
 hair={'wife':'#6B432E','mother':'#493D35','girl':'#80563D','boy':'#B5874F','child2':'#4B392E','child3':'#9A643F'}.get(kind,'#574034')
 shirt={'man':'#BA996A','wife':'#BC8277','mother':'#7F9D94','boy':'#D9AD55','girl':'#92AFA1','child2':'#A8A0B7','child3':'#A9B674','police':'#7D99AC'}.get(kind,'#879FA8')
 if pose=='sit':body+=p('M39 129 L19 153 L44 161 L70 150 L96 165 L111 154 L85 127','#718990')+p('M20 153 L9 160 L32 168 M97 164 L114 165',INK)
 elif pose=='jump':body+=p('M40 127 L16 151 L27 168 L43 148 L60 150 L75 174 L92 167 L82 127','#718990')+p('M27 167 L41 170 M74 176 L96 177',INK)
 elif pose=='stand':body+=p('M39 125 L36 183 H53 L60 140 L70 183 H88 L83 125','#718990')+p('M36 182 L24 189 H53 M70 184 L70 190 H96',INK)
 else:body+=p('M38 126 L20 174 L35 181 L62 141 L88 179 L102 169 L80 125','#718990')+p('M20 174 L10 181 L33 188 L38 181 M88 180 L96 183 L112 174 L104 168',INK)
 if kind=='wife':body+=p('M33 74 L88 74 L105 137 Q61 153 19 137 Z',shirt)+p('M49 76 Q62 94 77 75',PAPER)+p('M42 112 L54 112 M77 109 L88 109')
 elif kind=='man':body+=p('M31 76 L91 76 L94 125 H27 Z','#EEE1B9')+p('M39 89 V126 H83 V89 M44 76 V118 M78 76 V118',shirt,a='stroke-width="6"')+rect(49,107,22,15,'#D6B783',3)
 elif kind=='police':body+=p('M29 77 L94 77 L96 136 H26 Z',shirt)+p('M49 78 L62 94 L75 78',PAPER)+p('M62 94 V132 M29 115 H94')+rect(33,91,16,10,'#D9C76C',2)
 elif female:body+=p('M35 77 L86 77 L97 137 H23 Z',shirt)+p('M48 80 Q60 95 74 80',PAPER)
 else:body+=rect(30,76,64,61,shirt,9)+p('M48 77 L60 93 L76 77',PAPER)
 arms=[('M32 87 L17 117',(17,117)),('M92 86 L111 111',(111,111))]
 if pose=='photo':arms=[('M32 87 L21 116 L47 116',(47,116)),('M92 87 L105 115 L82 117',(82,117))]
 if pose=='sit':arms=[('M32 87 L27 112 L45 128',(45,128)),('M92 87 L98 112 L81 127',(81,127))]
 if pose=='read':arms=[('M32 87 L24 108 L44 107',(44,107)),('M92 87 L103 107 L82 108',(82,108))]
 if pose=='jump':arms=[('M32 87 L16 66 L13 52',(13,52)),('M92 87 L109 65 L113 49',(113,49))]
 for d,(x,y) in arms:body+=p(d,a='stroke-width="7"')+c(x,y,5.5,SKIN)
 if female:body+=p('M30 50 Q19 8 59 11 Q98 9 98 56 L85 75 H34 Z',hair)
 body+=f'<ellipse cx="62" cy="43" rx="{23 if kind in ["man","wife"] else 25}" ry="{30 if kind in ["man","wife"] else 26}" fill="{SKIN}"/>'
 body+=p('M38 30 Q46 10 66 15 L87 28 L82 39 L67 26 L57 34 L47 30 Z',hair) if not female else p('M36 33 Q34 6 66 14 Q88 16 88 35 L77 32 L74 23 L66 32 L56 28 L46 34 Z',hair)
 if kind=='man':body+=p('M33 23 Q44 0 74 9 Q91 13 92 25 L31 27 Z','#7F9787')+p('M28 26 L99 26',a='stroke-width="5"')
 if kind=='police':body+=p('M34 22 L39 7 H83 L90 23 Z',shirt)+p('M31 26 H95',a='stroke-width="6"')+c(62,18,5,'#E2C569')
 body+=c(51,43,2,INK)+c(73,43,2,INK)+p('M51 58 Q62 65 73 57')
 if kind=='girl':body+=p('M92 25 Q123 16 111 58 L95 51 Z',hair)+c(94,27,5,'#E5BD62')
 if kind=='child2':body+=rect(39,36,19,14,'none',4)+rect(66,36,19,14,'none',4)+p('M58 41 H66')
 if pose=='photo':body+=rect(39,99,48,34,PAPER,2)+p('M43 125 L55 111 L64 118 L76 107 L83 125 Z',GREEN)+c(75,107,3,'#E8C86E')
 if pose=='read':body+=p('M40 96 Q52 91 62 98 Q72 92 84 97 V126 Q73 121 62 127 Q50 120 40 125 Z',PAPER)+p('M62 98 V126')
 return body
for k in ['man','wife','boy','girl','child2','child3']:
 save(k,person(k,'photo' if k=='man' else 'walk'),126,199)
def tree():return p('M65 180 L61 78 H77 L84 180','#B19870')+p('M22 78 Q-1 53 20 35 Q18 8 50 16 Q70 -2 88 17 Q119 8 124 38 Q147 63 124 85 Q80 100 22 78 Z',GREEN,a='stroke="#7F9C7C"')
def house():return rect(12,44,83,61,'#F6E8CB')+p('M1 47 L55 6 L109 47 Z','#C68465')+rect(44,71,22,34,'#9CA78C',2)+rect(22,60,16,18,'#B7D5D8',2)+rect(72,60,15,18,'#B7D5D8',2)
def school():
 b=rect(7,47,226,152,'#F4E5C6',3)+p('M-3 48 L35 16 H204 L244 48 Z','#BA896E')+rect(77,15,85,184,'#E8D1A8',3)+p('M68 17 L119 0 L171 17 Z','#BA896E')+c(120,48,17,PAPER)+p('M120 38 V49 L129 53')
 b+=rect(100,143,40,56,'#667F79',2)+rect(145,143,28,56,'#F8EDD2',2)
 for x,y in [(22,73),(56,73),(183,73),(215,73),(22,123),(56,123),(183,123),(215,123),(99,90),(139,90)]:b+=rect(x,y,17,22,'#BED9DD',2)
 return b

def swimmer():return p('M16 48 Q58 21 102 44 L137 57 L131 71 L90 61 L46 63 Z',SKIN)+p('M68 41 L78 26 L108 20 L112 27 L86 35 L91 49',SKIN)+c(26,35,21,SKIN)+p('M5 30 Q2 0 29 9 Q50 12 45 29 Z','#C88B68')+rect(6,29,16,10,'#A4C5D2',4)+p('M6 28 L41 28')+p('M12 70 Q33 78 55 69 M64 75 Q91 81 115 71 M124 75 H151',a='stroke="#7CA7B3" stroke-width="3"')
def photo(kind,mobile=False):
 w,h=(480,330) if mobile else (1000,620);top=0 if mobile else 250
 b=rect(0,0,w,h,SKY,0,a='stroke="none"')
 if kind==1:
  # Village sits between hills and beside the river, never in the water.
  b+=p(f'M0 {h*.76} Q{w*.16} {top-25} {w*.42} {h*.68} Q{w*.5} {h*.84} {w*.61} {h*.63} Q{w*.81} {top-40} {w} {h*.7} V{h} H0 Z','#B7C8A5',a='stroke="#8EA887"')
  b+=p(f'M0 {h*.90} Q{w*.4} {h*.55} {w*.68} {h*.7} Q{w*.83} {h*.65} {w} {h*.67} V{h} H0 Z','#D6DDBB',a='stroke="none"')
  s=.62 if mobile else 1.12;y=155 if mobile else 390
  for x,yy,ss in [(w*.24,y,s),(w*.43,y-24,s*1.15),(w*.65,y+7,s*.8)]:b+=at(house(),x,yy,ss)
  b+=p(f'M0 {h*.93} Q{w*.32} {h*.91} {w*.48} {h*.83} Q{w*.79} {h*.78} {w} {h*.91} L{w} {h} Q{w*.73} {h*.88} {w*.52} {h*.94} Q{w*.32} {h} 0 {h} Z',WATER,a='stroke="#8FABB0"')
 elif kind==2:
  b+=p(f'M0 {top+30} Q{w*.2} {top-35} {w*.4} {top+75} L{w} {top+10} V{h} H0 Z','#CDD8B7',a='stroke="none"')
  b+=p(f'M{w*.54} {top} Q{w*.26} {top+125} {w*.72} {h*.72} L{w} {h} H{w*.58} Q{w*.13} {top+160} {w*.39} {top} Z',WATER,a='stroke="#8FABB0"')
  b+=p(f'M{w*.26} {top+15} Q{w*.1} {top+143} {w*.35} {h-30}',a='stroke="#EBDDAD" stroke-width="30"')
  s=.67 if mobile else 1.13;y=116 if mobile else 367
  b+=at(person('man'),w*.07,y,s)+at(person('wife'),w*.07+83*s,y,s)
  b+=at(swimmer(),w*.57,top+145 if mobile else 441,.71 if mobile else 1.15)
  b+=arrow(w*.90,235,w*.29,235) if mobile else arrow(910,535,380,535)
  b+=at(tree(),w*.76,top+5,.63 if mobile else .96)
 else:
  ground=208 if mobile else 487
  b+=rect(0,ground-15,w,h-ground+15,'#E4DEC4',0,a='stroke="none"')
  b+=rect(w*.52,top+58,w*.48,h-top-58,'#D6E1C6',0,a='stroke="none"')
  b+=at(tree(),w*.68,top+25,.95 if mobile else 1.6)
  b+=at(school(),15,top+24,.88 if mobile else 1.13)
  gate=w*.60 if mobile else w*.55
  # The park boundary is crossed horizontally: before = outside, after = inside.
  b=b.replace(f'x="{w*.52}"',f'x="{gate}"').replace(f'width="{w*.48}"',f'width="{w-gate}"')
  b+=p(f'M{gate} {top+62} V{ground+15} M{gate} {ground+112} V{h}',a='stroke="#91A383" stroke-width="6"')
  for yy in range(top+65,ground+13,25):b+=p(f'M{gate-12} {yy} H{gate+12}',a='stroke="#91A383" stroke-width="4"')
  size=.39 if mobile else .64;y=ground-65 if mobile else ground-95
  kids=''
  for k,x in [('girl',w*.20),('boy',w*.34)]:kids+=at(person(k),x,y,size)
  b+=g(kids,'data-part="school-children" data-from="13" data-to="99"')
  before=[gate-105,gate-55] if mobile else [gate-168,gate-84]
  b+=g(at(person('child2'),before[0],ground-4,size)+at(person('child3'),before[1],ground-4,size),'data-part="park-children" data-from="13" data-to="99"')
  b+=g(arrow(w*.24,ground+26,w*.40,ground+26),'data-from="13" data-to="99"')+g(arrow(gate-40,ground+98,gate+82,ground+98),'data-from="14" data-to="99"')
 return b
# Shared renderer switches whole photographs by the reader's actual sentence.
for i in [1,2,3]:
 save(f'photo-{i}',photo(i),1000,620);save(f'photo-{i}-mobile',photo(i,True),480,330)
parts=''.join(g(photo(i),f'data-from="{[-1,4,9][i-1]}" data-to="{[3,8,99][i-1]}"') for i in [1,2,3])
small=''.join(g(photo(i,True),f'data-from="{[-1,4,9][i-1]}" data-to="{[3,8,99][i-1]}"') for i in [1,2,3])
spec={'unit':'unit35-36','theatreVersion':2,'narration':True,'wall':SKY,'title':'翻开三张村庄照片。','svg':svg(parts,1000,620),'mobileSvg':svg(small,480,330),'speakers':['']*15,'frames':['村庄照片：房屋在两座小山之间，靠近河岸。']*4+['河岸照片：夫妻在左岸散步，男孩在水里横游小河。']*5+['学校照片：学校在左，紧邻的公园在右。']*4+['学校照片：孩子从左边的校舍出来，仍在公园边界外。','学校照片：两位孩子留在楼前，另两位孩子已经走进右侧公园。'],'moves':{'school-children':[[13,'translate(20px,0)']],'park-children':[[14,'translate(180px,0)']]},'mobileMoves':{'school-children':[[13,'translate(9px,0)']],'park-children':[[14,'translate(113px,0)']]},'finish':'三张照片串起来了：你读懂了村庄的位置与大家的去向。','completionArt':'/assets/unit35-36/keepsake.svg'}
(R/'unit35-36/scene.js').write_text('(function(root){root.CanranCore.unit3536Scene=root.CanranCore.classroomScene.create('+json.dumps(spec,ensure_ascii=False)+');})(globalThis);\n')
# Cover and reward: an open photo album; no invented named narrator.
def album(finished=False):
 b=p('M15 30 Q151 8 288 29 Q429 9 566 29 V325 Q433 303 288 324 Q151 304 15 325 Z','#D9D8BB')+p('M32 43 Q155 22 288 43 Q422 23 548 43 V306 Q419 286 288 307 Q158 286 32 306 Z',PAPER)+p('M288 43 V307',a='stroke="#B1AD96" stroke-width="2"')
 b+=at(g(photo(1,True)),47,76,.46)+at(g(photo(3,True).replace('data-part="park-children"','data-part="park-children" transform="translate(113 0)"') if finished else photo(3,True)),310,76,.46)
 return b
cover=album()+at(person('man','photo'),-7,215,.83)+at(person('wife','stand'),493,215,.83)
save('cover-scene',cover,600,395);save('keepsake',album(True)+at(person('man','photo'),-7,215,.83)+at(person('wife','stand'),493,215,.83),600,395)
# Remaining cards and reference scenes are added below after representative review.

def ground():return rect(0,166,320,54,'#E2E7CE',0,a='stroke="none"')
def cat():return p('M38 56 Q54 36 92 56 L90 77 H40 Z','#C59B6B')+p('M91 58 Q124 42 112 22',a='stroke-width="7"')+p('M47 74 L30 91 M72 75 L91 91',a='stroke-width="7"')+p('M9 46 V17 L28 29 L47 17 L50 51 Q32 75 9 53 Z','#DCB887')+c(20,44,2,INK)+c(37,44,2,INK)+p('M24 54 H33 M12 52 L0 49 M44 52 L57 48')
def plane():
 return p('M8 67 L62 59 L84 13 H104 L97 58 H164 L179 42 H193 L183 64 Q209 64 218 75 Q207 87 177 86 H111 L124 121 H100 L71 86 H19 Z',PAPER)+p('M170 59 L182 66 L167 70 Z',WATER)+''.join(c(x,73,3,'#9BBEC4') for x in [63,84,105,126,147])
def door(out=False,actor=None):
 b=rect(14,15,187,170,'#F1E3C9',3)+rect(111,42,72,143,'#92A1A0',3)+rect(24,47,70,56,'#CADDE0',3)+p('M24 14 H202 V40 H24 Z','#C68465')+p('M0 185 H320',a='stroke="#C2B69E"')
 b+=at(person(actor or ('wife' if out else 'man')),97,55,.64)
 # same building and arrow styling; direction itself is the meaningful difference.
 b+=arrow(228,150,112,150) if not out else arrow(112,150,270,150)
 return b

def scene(kind):
 b=rect(0,0,320,220,SKY,9,a='stroke="none"')+ground()
 if kind in ['into','out','man-out','woman-into']:return b+door(kind in ['out','man-out'],{'man-out':'man','woman-into':'wife'}.get(kind))
 if kind=='beside':
  b+=p('M28 159 H285 M34 168 V204 M277 168 V204',a='stroke="#AA9571" stroke-width="9"')+at(person('boy','sit'),61,58,.72)+at(person('mother','sit'),157,33,.91)
 if kind=='across':
  b=rect(0,0,320,220,'#E2E7CE',0,a='stroke="none"')+rect(0,69,320,91,'#D3D3C4',0,a='stroke="none"')+p('M0 69 H320 M0 160 H320',a='stroke="#A8AAA0"')+p('M0 114 H320',a='stroke="#FFFDF6" stroke-dasharray="15 16"')
  b+=at(person('man'),135,25,.7)+at(person('wife'),212,26,.7)+arrow(70,192,70,32)
 if kind=='along':
  b+=rect(0,116,320,85,'#D4BC98',0)+p('M0 144 H320 M0 172 H320 M35 117 V143 M107 117 V143 M177 117 V143 M247 117 V143 M72 144 V172 M141 144 V172 M213 144 V172 M286 144 V172',a='stroke="#AC9272" stroke-width="2"')
  b+=at(cat(),35,24,.87)+at(cat(),175,24,.87)+arrow(27,208,298,208)
 if kind=='off':
  b+=at(tree(),207,-17,1.38)+p('M280 72 H75',a='stroke="#AD8C61" stroke-width="15"')+at(person('boy','jump'),56,59,.62)+at(person('girl','jump'),129,80,.57)+arrow(29,76,29,186)
 if kind=='between':
  b+=at(person('police'),7,24,.84)+at(person('man'),111,29,.84)+at(person('police'),213,25,.84)
 if kind=='near':b+=at(tree(),181,10,1)+at(person('girl','sit'),43,73,.76)
 if kind in ['under','over']:
  b=rect(0,0,320,220,SKY,0,a='stroke="none"')+rect(0,122,320,98,WATER,0,a='stroke="none"')
  b+=p('M0 103 H320 V202 H273 Q259 112 159 112 Q59 112 47 202 H0 Z','#D4BC98',a='stroke="#AA9272"')+p('M0 90 H320',a='stroke="#AA9272" stroke-width="7"')
  b+=at(plane(),80,132 if kind=='under' else 5,.67)
 if kind=='on':
  b+=at(person('man','sit'),11,53,.82)+at(person('wife','sit'),92,52,.83)+at(person('boy','sit'),179,95,.59)+at(person('girl','sit'),240,95,.57)
  b+=p('M28 209 l7-11 l7 11 M122 204 l6-9 l7 9 M279 209 l7-11 l7 11',a='stroke="#99AA79"')
 if kind=='in':
  b=rect(0,0,320,220,'#F4E8CF',0,a='stroke="#B6A68C"')+rect(0,175,320,45,'#D7C5A3',0,a='stroke="none"')+rect(122,26,76,57,'#C8DEE1')+p('M159 26 V83 M122 54 H198',a='stroke="#A6B7B5"')
  b+=rect(9,97,95,100,'#BFC8AD',14)+rect(214,97,95,100,'#BFC8AD',14)+at(person('man','read'),13,40,.84)+at(person('wife','read'),205,40,.84)
 return b
for n in ['into','out','man-out','woman-into','beside','across','along','off','between','near','under','over','on','in']:save(n+'-scene',scene(n))
# Two-row comparisons retain full scenes and neutral numeric labels.
for name,ns in [('routes-compare',['across','along']),('positions-compare',['beside','between']),('flights-compare',['under','over']),('rest-compare',['on','in'])]:
 body=''
 for i,n in enumerate(ns):body+=at(scene(n),0,i*242)+c(20,i*242+20,15,PAPER)+f'<text x="20" y="{i*242+26}" font-size="19" text-anchor="middle" fill="{INK}" stroke="none" font-family="sans-serif">{i+1}</text>'
 save(name,body,320,462)
# Small school/park plans have equal-size buildings and share all colors.
def school_plan(kind):
 b=rect(0,0,320,220,SKY,4,a='stroke="none"')+ground()
 left=kind=='left';schoolx=165 if left else 5;parkx=0 if left else 179
 b+=at(school(),schoolx,36,.61)+at(tree(),parkx+10,30,.77)+p(f'M{parkx} 169 H{parkx+133}',a='stroke="#8DA07E" stroke-width="8"')
 if kind=='across':b+=p('M149 0 Q128 69 165 124 Q195 178 153 220 H186 Q220 170 194 115 Q167 60 181 0 Z',WATER,a='stroke="#8FABB0"')
 return b
for n in ['left','right','across']:save('school-'+n+'-park',school_plan(n))
for kind in ['between','beside','top']:
 b=rect(0,0,320,220,SKY,4,a='stroke="none"')+ground()
 if kind=='between':b+=p('M0 185 Q40 8 103 151 Q141 217 191 148 Q273 0 320 183',GREEN,a='stroke="#88A180"')+at(house(),113,106,.79)
 if kind=='beside':b+=p('M0 185 Q92 8 186 185',GREEN,a='stroke="#88A180"')+at(house(),202,104,.78)
 if kind=='top':b+=p('M0 218 Q155 15 320 218',GREEN,a='stroke="#88A180"')+at(house(),114,53,.79)
 save('village-'+kind,b)
# Word illustrations: exact object or clearly contextual relationship.
for name in ['village','photograph']:
 b=photo(1,True)
 if name=='photograph':b=rect(0,0,500,370,PAPER,7)+at(b,10,10,1)
 save(name,b,500 if name=='photograph' else 480,370 if name=='photograph' else 330)
b=p('M4 191 Q52 20 107 147 Q158 220 206 140 Q271 13 315 191',GREEN,a='stroke="#8CA784"')+c(160,172,8,'#DAAF6B')+arrow(160,70,160,149)
save('valley',b);save('hill',p('M8 196 Q150 5 307 196 Z',GREEN,a='stroke="#8CA784"'))
save('between',scene('between'));save('beside',scene('beside'));save('off',scene('off'));save('into',scene('into'));save('along',scene('along'))
save('wife',at(person('man'),17,18,.91)+at(person('wife'),167,18,.91))
save('wife-portrait',person('wife','stand'),126,199)
save('water',rect(12,53,295,135,WATER,22,a='stroke="#8AAAB3"')+''.join(p(f'M{x} {y} q20 10 40 0 q20 10 40 0',a='stroke="#7FA5B0"') for x,y in [(48,96),(111,133),(37,162)]))
save('bank',p('M0 10 H175 L121 210 H0 Z','#D3DFBE',a='stroke="none"')+p('M175 10 H320 V210 H121 Z',WATER,a='stroke="#8AAAB3"')+p('M152 25 L105 192',a='stroke="#DEC698" stroke-width="15"')+arrow(41,94,148,102))
save('swim',rect(0,55,320,155,WATER,5,a='stroke="none"')+at(swimmer(),77,77,1.35)+arrow(240,190,46,190))
save('building',at(school(),33,15,1.08));save('park',ground()+at(tree(),168,14,.99)+p('M24 148 H153 M28 163 H157 M43 164 V197 M144 164 V197',a='stroke="#B79B73" stroke-width="9"'))
save('another',rect(20,39,147,139,PAPER)+at(house(),38,55,1)+rect(141,18,157,141,PAPER)+at(tree(),162,32,.65))
save('photo-school',photo(3,True).replace('data-part="park-children"','data-part="park-children" transform="translate(113 0)"'),480,330)
