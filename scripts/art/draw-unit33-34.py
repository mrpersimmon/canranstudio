"""Lesson 33–34 original vector drawings; same ink language, a new river composition.
Sally and Tim's braid/stripe identity is a design continuation, not a claimed
textbook family relationship with Lesson 31's unnamed household.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/unit33-34';OUT.mkdir(exist_ok=True)
INK='#4A3226';SKIN='#F7D3AE';WATER='#BFDDE2';PAPER='#FFFDF6'
def path(d,fill='none',extra=''):return f'<path d="{d}" fill="{fill}" {extra}/>'
def rect(x,y,w,h,fill,rx=4):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'
def circle(x,y,r,fill):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def at(b,x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})">{b}</g>'
def svg(b,w=240,h=200):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{b}</svg>'
def save(name,b,w=240,h=200): (OUT/(name+'.svg')).write_text(svg(b,w,h))
def group(b,attrs):return f'<g {attrs}>{b}</g>'
def sun():
 b=circle(46,46,25,'#F2C567')
 for d in ['M46 3 V12','M46 80 V90','M3 46 H12','M80 46 H90','M15 15 L22 22','M71 71 L78 78','M15 78 L22 71','M71 22 L78 15']:b+=path(d,extra='stroke="#CDA34A" stroke-width="4"')
 return b
def cloud():return path('M18 63 Q-2 46 13 32 Q23 21 40 28 Q43 0 69 5 Q92 7 97 28 Q119 20 129 41 Q142 64 116 68 H25 Z',PAPER,extra='stroke="#B6C9CB"')
def plane():
 b=path('M7 61 L62 53 L86 11 L106 11 L98 52 L157 51 L175 35 L188 35 L181 58 Q206 57 217 68 Q207 80 176 81 L110 83 L121 119 L99 119 L71 83 L22 84 Z','#F7F2D9')
 b+=path('M167 54 L179 60 L166 64 Z','#88B3BF')
 for x in [63,83,103,123,143]:b+=circle(x,67,3,'#88B3BF')
 b+=path('M19 70 H48',extra='stroke="#C77658" stroke-width="5"')
 return b
def ship():
 b=path('M8 98 L226 98 L199 147 L52 147 Z','#C67D5A')+path('M49 93 V55 H179 V96','#FFF6DF')+rect(86,20,72,35,'#F3DCAD')+rect(99,3,22,17,'#BB6855')
 b+=path('M64 57 V88 H172 V57',extra='stroke="#829E9C"')
 for x in [70,99,128,157]:b+=circle(x,117,6,'#C2E1E3')
 for x in [64,96,128,158]:b+=rect(x,62,18,17,'#AECFD7',2)
 b+=path('M98 35 H143 M167 51 L196 27',extra='stroke="#8B9C97"')
 return b
def boat():return path('M8 45 H151 L128 83 H40 Z','#D8B784')+path('M36 43 L123 43 M71 41 L100 11',extra='stroke="#9C7958" stroke-width="5"')+path('M91 19 L112 10',extra='stroke-width="6"')
def bird():return path('M15 58 Q35 8 65 48 Q79 20 112 36 L81 60 Q88 90 64 94 Q41 102 32 80 L7 88 L15 72 L3 60 Z','#E3B46F')+circle(70,68,3,INK)+path('M89 69 L106 76 L86 78 Z','#D88458')+path('M31 65 Q47 52 55 74')
def person(name='MrJones',pose='stand'):
 man=name in ['MrJones','man','cook'];wife=name=='MrsJones';sally=name=='Sally';tim=name=='Tim';child=sally or tim
 hair={'MrJones':'#9C998E','MrsJones':'#403935','Sally':'#743F30','Tim':'#C18A44','cook':'#65503F','woman':'#915E43','man':'#4C3C31'}.get(name,'#745545')
 coat={'MrJones':'#72948D','MrsJones':'#D1977F','Sally':'#85A875','Tim':'#E9AD4F','cook':'#E6CF99','woman':'#9F93B9','man':'#819CB5'}.get(name,'#B99771')
 b='<ellipse cx="64" cy="205" rx="48" ry="7" fill="#4A322616" stroke="none"/>'
 if sally:b+=path('M35 34 Q13 38 24 97 L40 79 M78 33 Q101 34 101 97 L79 82',hair)
 if wife:
  for x,y in [(38,28),(53,18),(71,18),(87,29),(92,44),(30,44)]:b+=circle(x,y,12,hair)
 if pose=='walk':legs=path('M41 139 L28 186 L41 194 L64 151 L88 190 L103 181 L76 137','#84949C')+path('M25 185 L18 190 L40 200 L47 193 M87 192 L96 195 L114 187 L104 180',INK)
 elif pose=='jump':legs=path('M41 139 L20 155 L26 180 L42 178 L42 162 L62 155 L84 179 L100 172 L77 139','#A5AE99')+path('M25 177 H44 M84 179 L104 175',INK)
 else:legs=path('M39 135 L36 195 H56 L64 151 L70 195 H91 L86 135','#B8B19B' if wife else '#7C9298')+path('M33 193 L26 201 H57 L57 193 M71 194 L72 201 H99 L89 193',INK)
 b+=legs
 if man and name=='MrJones':
  b+=path('M28 83 Q59 69 93 83 L99 148 H24 Z',coat)+path('M48 77 L61 95 L76 77 M62 95 L62 148')+path('M50 77 L77 80 L75 100 L59 99 L61 133 L48 130 Z','#E8C575')+rect(28,122,20,18,'#ADC2B4')
 elif wife:
  b+=path('M32 79 Q63 74 89 81 L95 133 L71 142 L63 128 L51 141 L26 133 Z',coat)+path('M47 79 L64 97 L78 80','#FFF0DC')+path('M38 83 L92 145',extra='stroke="#76533C" stroke-width="5"')+rect(77,126,31,29,'#B98A55',7)+circle(92,137,3,'#E3C075')
 elif sally:
  b+=path('M35 83 L86 83 L95 150 H26 Z',coat)+path('M46 83 V102 H74 V83','#E9C975')+rect(51,113,20,18,'#E9C975')
 else:
  b+=path('M29 84 Q63 72 93 84 L93 145 H29 Z',coat)
  if tim:b+=path('M30 105 H91 M30 125 H91',extra='stroke="#FFF4D8" stroke-width="7"')
  if name=='cook':b+=path('M44 82 V97 H78 V82 L85 139 H37 L44 97','#FFF9EA')
  if name=='man':b+=path('M51 82 L64 96 L76 81','#F5E7CD')
  if name=='woman':b+=path('M41 82 L64 98 L84 82 M60 102 V142')
 arms=[('M30 89 L16 126',(16,126)),('M91 89 L109 127',(109,127))]
 if pose=='look-down':arms=[('M31 89 L22 121',(22,121)),('M91 89 L114 106 L121 122',(121,122))]
 if pose=='look-up':arms=[('M31 89 L19 124',(19,124)),('M91 89 L111 66 L117 38',(117,38))]
 if pose=='no-arms':arms=[]
 if pose=='work':arms=[('M31 89 L22 111 L64 119',(64,119)),('M91 89 L109 110 L122 114',(122,114))]
 if pose=='shave':arms=[('M31 89 L22 117',(22,117)),('M91 89 L103 75 L82 58',(82,58))]
 if pose=='cry':arms=[('M31 89 L21 78 L41 48',(41,48)),('M91 89 L104 77 L84 48',(84,48))]
 if pose=='jump':arms=[('M31 89 L14 70 L8 55',(8,55)),('M91 89 L111 62 L115 48',(115,48))]
 for d,(x,y)in arms:b+=path(d,extra='stroke-width="7"')+circle(x,y,5.5,SKIN)
 b+=f'<rect x="35" y="22" width="53" height="55" rx="{18 if name=="MrJones" else 26}" fill="{SKIN}"/>'
 if name=='MrJones':b+=path('M36 42 L29 37 Q26 15 49 22 L45 34 L39 46 M79 23 Q101 27 88 52 L83 41',hair)
 elif wife:b+=path('M36 40 Q32 18 53 24 Q66 12 79 26 Q91 25 87 47 L75 34 Q63 48 52 34 Z',hair)
 elif sally:b+=path('M34 40 Q32 13 60 16 Q91 14 88 40 L72 31 L61 24 L47 36 Z',hair)+circle(23,90,5,'#D77D6A')+circle(100,90,5,'#D77D6A')
 elif tim:b+=path('M35 40 Q28 10 58 14 L82 23 L86 40 L74 29 L64 35 L54 28 L44 38 Z',hair)
 elif name=='woman':b+=path('M32 50 L27 25 Q53 5 81 24 L94 61 H80 L76 29 L43 50 Z',hair)
 else:b+=path('M34 42 L29 26 L51 16 L84 23 L90 43 L74 29 L49 36 Z',hair)
 if name=='cook':b+=path('M33 28 V12 Q20 -1 39 -5 Q43 -24 60 -10 Q80 -24 88 -4 Q107 2 90 13 V28 Z','#FFFBED')+path('M33 18 H90')
 if pose=='sleep':b+=path('M45 49 Q51 54 57 49 M69 49 Q75 54 81 49')
 else:b+=circle(52,49,2,INK)+circle(74,49,2,INK)
 if name=='MrJones':b+=path('M47 64 Q55 53 63 61 Q71 53 79 64 Q72 72 64 65 Q55 72 47 64',INK)
 elif pose=='cry':b+=path('M54 67 Q64 57 73 67')+path('M42 58 Q32 68 40 72 Q48 69 42 58 Z','#99C4D2')+path('M84 58 Q76 68 84 72 Q92 68 84 58 Z','#99C4D2')
 else:b+=path('M53 63 Q64 72 74 62')
 if pose=='shave':b+=path('M45 61 Q62 87 82 61 Q75 54 70 63 Q58 55 54 64 Q46 54 45 61','#FFFDF6')+path('M84 44 L85 75',extra='stroke="#8CADA9" stroke-width="6"')+path('M78 47 H90',extra='stroke-width="5"')
 return b
for n,p in [('MrJones','look-down'),('MrsJones','look-down'),('Sally','look-down'),('Tim','look-up')]:save(n,person(n,p),128,214)
def bridge(w=1000,h=600,deck=426):
 # The negative space of the central arch remains river, rather than a painted door.
 return path(f'M0 {deck} Q{w/2} {deck-20} {w} {deck} V{h} H{w*.77} Q{w*.7} {deck+20} {w*.5} {deck+25} Q{w*.3} {deck+20} {w*.23} {h} H0 Z','#D5BB91',extra='stroke="#A98E6D"')
def river_scene(mobile=False):
 w,h=(480,360) if mobile else (1000,620);deck=208 if mobile else 426
 b=group(rect(0,0,w,h,'#E8F4F3',0),'stroke="none"')+path(f'M0 {deck-15} Q{w*.2} {deck-44} {w*.36} {deck-18} L{w} {deck-26} V{h} H0 Z','#D4DABD',extra='stroke="none"')+rect(0,deck+16,w,h-deck,WATER,0)
 for x,y in ([(18,301),(152,339),(394,279)] if mobile else [(35,565),(231,601),(863,581)]):b+=path(f'M{x} {y} q22 8 44 0 m10 0 q22 8 44 0',extra='stroke="#8DB8C4" stroke-width="2"')
 if mobile:
  b+=group(at(sun(),385,6,.72)+at(cloud(),30,23,.58)+at(cloud(),320,46,.6),'data-focus="0 1"')
  b+=group(at(plane(),175,0,.65),'data-focus="8 9" data-part="plane"')
  people=[('MrJones',95,70,.66),('MrsJones',173,70,.66),('Sally',254,97,.52),('Tim',318,97,.52)]
  for n,x,y,s in people:b+=group(at(person(n,'look-up' if n=='Tim' else 'walk' if n=='MrJones' else 'look-down'),x,y,s),f'data-focus="2 3 5 {6 if n=="Sally" else 8 if n=="Tim" else 5}"')
  b+=bridge(w,h,deck)+group(rect(0,305 if mobile else 555,w,55 if mobile else 65,WATER,0),'stroke="none"')
  b+=group(at(ship(),165,254,.65),'data-part="ship" data-focus="6 7"')
  b+=group(at(boat(),15,278,.6)+at(boat(),362,281,.65),'data-focus="4 5"')
 else:
  b+=group(at(sun(),849,237,.9)+at(cloud(),92,219,.65)+at(cloud(),757,336,.65),'data-focus="0 1"')
  b+=group(at(plane(),30,285,.87),'data-focus="8 9" data-part="plane"')
  people=[('MrJones',255,228,.93),('MrsJones',376,228,.93),('Sally',515,271,.72),('Tim',614,271,.72)]
  for n,x,y,s in people:b+=group(at(person(n,'look-up' if n=='Tim' else 'walk' if n=='MrJones' else 'look-down'),x,y,s),f'data-focus="2 3 5 {6 if n=="Sally" else 8 if n=="Tim" else 5}"')
  b+=bridge(w,h,deck)+group(rect(0,305 if mobile else 555,w,55 if mobile else 65,WATER,0),'stroke="none"')
  b+=group(at(ship(),390,477,.8),'data-part="ship" data-focus="6 7"')
  b+=group(at(boat(),89,527,.88)+at(boat(),798,526,.82),'data-focus="4 5"')
 # A low rail in front of the walkers; feet rest on deck, no floating figures.
 b+=path(f'M0 {deck-13} Q{w/2} {deck-34} {w} {deck-13}',extra='stroke="#AE9576" stroke-width="9"')
 for x in range(14,w,45):b+=path(f'M{x} {deck-13} V{deck+4}',extra='stroke="#AE9576" stroke-width="5"')
 return b,w,h
for mobile in [False,True]:
 b,w,h=river_scene(mobile);save('stage-mobile' if mobile else 'stage',b,w,h)
b,w,h=river_scene(True);save('cover-scene',b,w,h);save('keepsake',b,w,h)
save('sun',at(sun(),47,15,1.6));save('cloud',at(cloud(),12,38,1.6));save('sky',rect(10,13,220,174,'#DDEFF3',20)+at(cloud(),35,76,.8)+at(cloud(),128,43,.65))
save('fine',at(sun(),111,15,1.1)+at(cloud(),9,97,.9));save('shine',at(sun(),54,8,1.45)+path('M38 172 H199 M81 150 L73 169 M159 149 L168 169',extra='stroke="#DAC780"'))
save('day',rect(28,24,184,151,PAPER,16)+rect(28,24,184,35,'#BAD2CE',12)+path('M62 12 V35 M176 12 V35')+at(sun(),88,79,.76))
save('boat',at(boat(),10,25,1.45));save('ship',at(ship(),3,17,1));save('aeroplane',at(plane(),2,30,1.04));save('fly',at(bird(),35,42,1.3))
save('river',path('M147 6 Q55 43 154 85 Q226 135 36 196 H151 Q281 131 208 81 Q99 42 204 6 Z',WATER,extra='stroke="#88B3BD"')+path('M162 37 q19 5 32 0 M164 97 q18 6 35 0 M100 168 q28 8 61 0',extra='stroke="#8DB8C4"'))
mini_water=rect(0,135,240,65,WATER,0)
mini_bridge=path('M0 90 Q120 64 240 90 V193 H194 Q171 111 120 109 Q68 111 46 193 H0 Z','#D5BB91',extra='stroke="#9D8160"')+path('M0 77 Q120 53 240 77 M12 78 V96 M225 78 V96 M55 65 V86 M184 65 V86',extra='stroke="#9D8160" stroke-width="5"')
save('bridge',mini_water+mini_bridge)
save('ship-under',mini_water+mini_bridge+at(ship(),66,124,.47));save('boats-on',mini_water+at(boat(),24,85,1.22));save('plane-over',rect(0,135,240,65,WATER)+at(plane(),5,0,.96)+path('M19 177 q20 6 43 0 M156 165 q20 6 43 0',extra='stroke="#8CB1BD"'))
save('over',mini_water+at(person('MrJones','walk'),73,6,.52)+path('M0 128 Q120 98 240 128 V200 H197 Q176 138 120 138 Q65 138 43 200 H0 Z','#D5BB91',extra='stroke="#9D8160"')+path('M0 113 Q120 86 240 113 M16 113 V126 M61 104 V117 M186 104 V117 M224 113 V126',extra='stroke="#9D8160" stroke-width="4"'))
save('family',at(person('MrJones'),4,18,.8)+at(person('MrsJones'),124,18,.8)+at(person('Sally'),79,78,.53),240,210)
save('with',at(person('MrJones','walk'),4,18,.8)+at(person('MrsJones','walk'),125,18,.8),240,210)
save('walk',at(person('MrJones','walk'),55,-8,.93))
for name in ['sleep','shave','cry','wash','wait','jump']:
 # Word cards use the same action images as the reading gallery below.
 pass
for weather in ['fine','rain','night']:
 bg='#EAF3F3' if weather=='fine' else '#D2DADC' if weather=='rain' else '#586B7E'
 b=rect(6,6,228,188,bg,20)
 if weather=='fine':b+=at(sun(),120,13,1)+at(cloud(),8,103,.7)+at(cloud(),120,125,.75)
 elif weather=='rain':
  b+=at(cloud().replace(PAPER,'#A4AFB6'),20,25,1.4)
  for x in [45,90,140,186]:b+=path(f'M{x} 140 l-9 23',extra='stroke="#668BA7" stroke-width="5"')
 else:b+=path('M150 28 Q109 84 183 99 Q118 136 103 77 Q97 42 150 28 Z','#F0D795')+circle(53,53,4,'#FFF5D7')+circle(195,148,4,'#FFF5D7')+circle(55,149,4,'#FFF5D7')
 save('weather-'+weather,b)
def dog(x=0):
 return at(path('M31 40 Q80 17 108 47 L110 84 H36 Z','#D4AD76')+path('M101 48 Q133 42 128 20',extra='stroke-width="7"')+path('M41 79 V103 M95 79 V103',extra='stroke-width="8"')+path('M10 44 Q15 12 40 29 L54 65 Q27 83 10 60 Z','#E6C998')+path('M34 29 Q59 25 55 61 L46 72 Z','#8F6442')+circle(21,45,2,INK)+circle(11,60,5,INK)+path('M18 78 Q0 61 4 81 Q-1 99 19 89 H64 Q81 103 84 87 Q86 71 65 78 Z',PAPER),x,0)
def action(name):
 b=rect(0,0,360,250,'#F8F6EB',18);floor=path('M10 232 H350',extra='stroke="#CCCFB6" stroke-width="2"')
 if name=='flying':return rect(0,0,360,250,'#EAF3F3',18)+path('M0 176 Q150 109 360 185 V250 H0 Z',WATER)+at(bird(),42,39,1)+at(bird(),206,39,1)
 if name=='eating':return b+at(dog(),14,89,1.25)+at(dog(),198,89,1.2)+floor
 if name=='sleeping':
  for x,n in [(15,'woman'),(198,'man')]:b+=rect(x,97,145,133,'#C3CBBB',14)+at(person(n,'sleep'),x+27,46,.64)+rect(x+4,134,137,90,'#B7C4D3',12)+path(f'M{x+8} 150 H{x+134}',extra='stroke="#F6EDD8" stroke-width="7"')
  return b+floor
 if name=='walking':return rect(0,0,360,250,'#EAF3F3',18)+rect(0,176,360,74,WATER)+at(person('MrJones','walk'),52,18,.91)+at(person('MrsJones','walk'),201,18,.91)+path('M0 217 Q180 180 360 217 V250 H300 Q180 215 60 250 H0 Z','#D5BB91')+path('M0 197 Q180 166 360 197',extra='stroke="#A98E6D" stroke-width="8"')
 if name=='waiting':
  return b+at(person('man'),23,39,.88)+at(person('woman'),140,39,.88)+path('M293 69 V231',extra='stroke="#819997" stroke-width="6"')+rect(254,12,79,64,'#C6DAD8',13)+rect(269,27,49,27,'#FFF8E5',6)+rect(274,32,14,10,'#A6C8CE',2)+rect(293,32,15,10,'#A6C8CE',2)+circle(279,57,4,INK)+circle(308,57,4,INK)+floor
 names=['man','MrJones'] if name=='shaving' else ['Sally','Tim'] if name in ['crying','doing','jumping'] else ['woman','MrsJones'] if name in ['typing','washing'] else ['cook','man']
 pose='shave' if name=='shaving' else 'cry' if name=='crying' else 'jump' if name=='jumping' else 'no-arms'
 for x,n in zip([13,191],names):b+=at(person(n,pose),x,39 if name!='jumping' else 4,.88)
 if name=='shaving':
  b+=rect(24,14,106,31,'#D7E6E4',8)+rect(204,14,105,31,'#D7E6E4',8)
 if name=='cooking':
  b+=rect(111,151,133,82,'#AABCB0')+rect(124,123,108,39,'#E3BC79',8)+path('M132 122 H224 M143 105 Q130 88 147 72 M183 105 Q170 88 188 72 M215 105 Q230 88 216 72',extra='stroke="#9DA99B"')+path('M40 117 L26 145 L70 151 M94 117 L142 139 M218 117 L221 139 M271 117 L303 151',extra='stroke-width="7"')+circle(70,151,5,SKIN)+circle(142,139,5,SKIN)+circle(221,139,5,SKIN)+circle(303,151,5,SKIN)
 if name=='typing':
  for x in [27,205]:
   b+=path(f'M{x+13} 117 L{x+4} 151 L{x+32} 175 M{x+67} 117 L{x+103} 151 L{x+80} 175',extra='stroke-width="6"')
   b+=rect(x,181,119,45,'#D6BFA0')+rect(x+7,139,103,38,'#A0BBC0',8)+rect(x+27,108,63,39,PAPER)+path(f'M{x+35} 119 h47 M{x+35} 130 h39',extra='stroke="#A0AAA0"')+path(f'M{x+8} 177 H{x+108}',extra='stroke="#FFF8E3" stroke-width="10"')
   for k in range(8):b+=rect(x+14+k*12,169,6,5,'#657E86',1)
   b+=circle(x+32,175,4,SKIN)+circle(x+80,175,4,SKIN)
 if name=='doing':
  b+=rect(22,167,310,60,'#D8C29E')
  for x in [34,203]:b+=path(f'M{x} 159 Q{x+45} 144 {x+99} 159 V190 Q{x+50} 177 {x} 190 Z',PAPER)+path(f'M{x+48} 154 V183 M{x+12} 170 h25 M{x+61} 171 h25',extra='stroke="#B6AC90"')+path(f'M{x+43} 154 L{x+67} 173',extra='stroke="#D8AF58" stroke-width="6"')+circle(x+44,155,5,SKIN)
  b+=path('M40 117 L26 144 L61 169 M94 117 L78 155 M218 117 L207 145 L238 172 M271 117 L247 155',extra='stroke-width="6"')+circle(61,169,4,SKIN)+circle(78,155,4,SKIN)+circle(238,172,4,SKIN)+circle(247,155,4,SKIN)
 if name=='washing':
  b+=rect(39,167,287,60,'#C7DDE0',16)+path('M120 169 V147 H157 V171',extra='stroke="#98BAC4" stroke-width="10"')+circle(75,178,22,PAPER)+circle(259,180,22,PAPER)+path('M40 117 L35 145 L58 166 M94 117 L92 149 L78 167 M218 117 L222 145 L243 167 M271 117 L288 145 L273 166',extra='stroke-width="7"')+circle(58,166,5,SKIN)+circle(78,167,5,SKIN)+circle(243,167,5,SKIN)+circle(273,166,5,SKIN)
 if name=='jumping':b+=rect(6,207,152,25,'#D5BB91')+rect(169,207,184,25,'#D5BB91')+path('M37 207 V232 M90 207 V232 M221 207 V232 M283 207 V232',extra='stroke="#AF9270"')
 return b+floor
for name in ['cooking','sleeping','shaving','crying','eating','typing','doing','washing','flying','walking','waiting','jumping']:
 save(name,action(name),360,250)
for a,b in [('sleep','sleeping'),('shave','shaving'),('cry','crying'),('wash','washing'),('wait','waiting'),('jump','jumping')]:save(a,action(b),360,250)
# Task scene: same ship shape twice, no spotlight or answer-carrying arrow.
for mobile in [False,True]:
 w,h=(360,370) if mobile else (780,390)
 b=rect(0,0,w,h,'#EAF3F3',12)+rect(0,h*.39,w,h*.61,WATER)
 if mobile:
  b+=path('M0 105 H296 V236 H250 Q235 144 149 143 Q61 144 44 236 H0 Z','#D5BB91')+path('M0 94 H296',extra='stroke="#A98E6D" stroke-width="8"')
  b+=at(ship(),58,158,.69)+at(ship(),158,250,.7)+at(boat(),1,293,.76)
 else:
  b+=path('M0 136 H487 V310 H426 Q393 184 294 184 Q196 184 168 310 H0 Z','#D5BB91')+path('M0 123 H487',extra='stroke="#A98E6D" stroke-width="9"')
  b+=at(ship(),211,185,.95)+at(ship(),512,224,.95)+at(boat(),15,303,.85)
 save('find-ships-mobile' if mobile else 'find-ships',b,w,h)
spec={'unit':'unit33-34','theatreVersion':2,'narration':True,'wall':'#E8F4F3','title':'晴天，桥上与河边有什么发现？','svg':(OUT/'stage.svg').read_text(),'mobileSvg':(OUT/'stage-mobile.svg').read_text(),'speakers':['']*10,'frames':['今天天气晴好。','白云与阳光同时在天空中。','琼斯先生与家人同行。','一家人从桥上走过。','小船在河面上。','夫妻正看着河面的小船。','Sally正在看大船。','大船正从桥下驶过。','Tim正在看飞机。','飞机从河流上空飞过。'],'moves':{'ship':[[7,'translate(-16px, 0)']],'plane':[[9,'translate(15px, 0)']]},'mobileMoves':{'ship':[[7,'translate(-8px, 0)']],'plane':[[9,'translate(8px, 0)']]},'finish':'河畔发现收集完成：你读懂了大家的动作与经过的位置。','completionArt':'/assets/unit33-34/keepsake.svg'}
(ROOT/'unit33-34/scene.js').write_text('(function(root){root.CanranCore.unit3334Scene=root.CanranCore.classroomScene.create('+json.dumps(spec,ensure_ascii=False)+');})(globalThis);\n')
print('Wrote',len(list(OUT.glob('*.svg'))),'river illustrations')
