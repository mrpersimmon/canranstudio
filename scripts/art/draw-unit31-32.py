"""Lesson 31–32 artwork: original garden cast, visible action contacts, separate mobile stage.
Run from repository root. All output is SVG; shared course icons retain their established line style.
"""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'assets/unit31-32';OUT.mkdir(exist_ok=True)
INK='#4A3226'; SKIN='#F7D3AE'
def svg(body,w=240,h=200):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'
def save(name,body,w=240,h=200): (OUT/(name+'.svg')).write_text(svg(body,w,h))
def at(body,x,y,s=1):return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
def path(d,fill='none',extra=''):return f'<path d="{d}" fill="{fill}" {extra}/>'
def circle(x,y,r,fill):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def rect(x,y,w,h,c,rx=4):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}"/>'
# Each story character has a different silhouette and facial/hair construction.
def person(name='Jack',pose='stand'):
 girl=name in ['Jean','Sally','Nicola','Emma','Amy','mother','sister','Jones']; child=name in ['Sally','Tim'];jean=name=='Jean';jack=name=='Jack';tim=name=='Tim';sally=name=='Sally'
 hair={'Tim':'#C18A44','Jack':'#574235','Sally':'#743F30','Amy':'#8B5635','Emma':'#3F3836','mother':'#69503F','sister':'#8D5A3C','Jones':'#99958B','Richards':'#A5A297','man':'#63483E'}.get(name,'#4D3B35')
 shirt={'Jean':'#C87571','Jack':'#5F8D99','Tim':'#E9AD4F','Sally':'#85A875','Nicola':'#9A84AE','Amy':'#D59B75','Emma':'#889CBB','mother':'#AC889B','sister':'#85AF9D','Jones':'#B1AD94','Richards':'#849789','man':'#A99575'}.get(name,'#6D9F92')
 b='' if pose=='climb' else '<ellipse cx="60" cy="'+('180' if pose=='sit' else '207')+'" rx="43" ry="7" fill="#4A322619" stroke="none"/>'
 if sally:b+=path('M37 36 Q16 35 24 96 L39 83 M79 36 Q106 33 98 98 L81 81',hair)
 if jean:b+=circle(80,17,14,hair)
 if name=='Amy':b+=path('M78 25 Q105 23 100 60 L112 76 Q87 78 81 55 Z',hair)
 if name=='mother':b+=path('M34 25 Q12 41 24 59 Q15 73 34 86 L88 82 Q106 65 94 51 Q103 29 82 20 Z',hair)
 if name=='Jones':b+=circle(37,22,14,hair)
 if pose=='sit':
  b+=path('M43 142 Q12 137 16 162 Q35 180 70 159 L96 158 Q113 166 102 180 L60 175 Q38 188 25 174','#D6B67C')+path('M23 169 L35 177 L52 176 M85 176 L103 180',INK)
 elif pose=='climb':
  b+=path('M50 145 L20 163 L35 184 M72 145 L91 155 L85 190','#728F93')+path('M30 181 L44 184 M80 190 L97 190',INK)
 else:
  b+=path('M45 145 L42 197 L56 197 L60 153 L66 197 L82 197 L75 145','#6C8585' if jean or jack else '#C8AD7A')+path('M41 198 L33 202 L57 202 M66 199 L69 203 L87 203',INK)
 if jean:b+=path('M39 80 Q57 71 80 80 L88 144 Q61 156 30 144 Z',shirt)+path('M57 85 L57 147 M34 117 L49 117')
 elif jack:b+=path('M33 82 L86 82 L92 137 L69 153 L61 137 L49 151 L29 137 Z',shirt)+path('M48 80 L60 102 L74 80','#FFF5DF')+path('M61 102 L61 136')
 elif sally:b+=path('M39 82 L82 82 L91 151 L30 151 Z',shirt)+path('M46 83 L46 102 L73 102 L73 83','#E9C975')+rect(50,114,19,18,'#E9C975',3)
 elif name=='Amy':b+=path('M35 81 L83 81 L90 148 L29 148 Z',shirt)+path('M45 81 L46 107 L75 107 L76 81 M45 107 L38 141 L83 141 L75 107','#F4D8AD')
 elif name=='Emma':b+=path('M33 83 L85 83 L89 147 L31 147 Z',shirt)+path('M46 80 L59 111 L71 80 M59 112 V147')+rect(35,118,18,15,'#F3E4C9',2)
 elif name=='mother':b+=path('M36 82 Q60 74 84 82 L95 151 H25 Z',shirt)+path('M40 83 Q59 109 80 83','#F4DECD')+path('M36 119 H83')
 elif name=='sister':b+=path('M32 83 L86 83 L86 111 L80 111 L86 146 L32 146 L39 111 L30 111 Z',shirt)+path('M49 80 L60 91 L71 80','#FFF1DB')
 elif name=='Jones':b+=path('M32 82 L86 82 L86 149 H30 Z',shirt)+path('M48 79 Q61 106 75 79','#F6E7CD')+circle(61,112,3,'#7A715D')
 elif name=='Richards':b+=path('M32 82 L87 82 L93 147 H28 Z','#F3E5D0')+path('M40 81 L59 100 L80 81 L82 144 H37 Z',shirt)+path('M57 90 L64 90 L68 125 L60 132 L53 125 Z','#B1735D')
 elif name=='man':b+=path('M32 81 L84 81 L91 148 H29 Z',shirt)+path('M43 84 H75 M34 116 H85',extra='stroke="#F3E7CE"')
 else:b+=path('M35 81 Q60 72 85 81 L87 148 L31 148 Z',shirt)+(path('M34 104 L84 104 M33 124 L85 124','#FFF3D7') if tim else '')
 if pose=='climb': arms=[('M36 89 L46 70 L82 69',(82,69)),('M82 90 L110 63 L106 48',(106,48))]
 elif pose=='action':arms=[]
 elif pose in ['work','hold']:arms=[('M34 89 L27 116 L63 118',(64,118)),('M83 90 L105 112 L112 111',(112,111))]
 elif pose=='sit':arms=[('M34 87 L29 120 L48 133',(48,133)),('M82 86 L94 116 L75 133',(75,133))]
 elif pose=='point':arms=[('M33 90 L18 121',(18,121)),('M82 90 L106 73 L116 76',(116,76))]
 else:arms=[('M34 88 L18 129',(18,129)),('M83 88 L101 128',(101,128))]
 for d,(x,y) in arms:b+=path(d,extra='stroke-width="8"')+circle(x,y,6,SKIN)
 b+=f'<ellipse cx="60" cy="48" rx="{23 if jack else 26}" ry="30" fill="{SKIN}"/>'
 if jack:b+=path('M37 38 L34 17 L52 18 L59 10 L81 23 L84 43 L73 31 L62 35 L48 29 Z',hair)
 elif tim:b+=path('M33 40 Q30 11 58 14 L81 22 L83 39 L72 29 L63 35 L54 28 L45 39 Z',hair)
 elif sally:b+=path('M33 42 Q29 12 57 15 Q86 13 87 39 L71 33 L61 24 L48 36 Z',hair)
 elif jean:b+=path('M34 47 Q21 19 48 15 Q82 2 88 33 L80 47 L74 25 Q49 46 34 47',hair)
 elif name=='Amy':b+=path('M34 41 Q25 15 56 13 Q86 10 89 44 L75 28 Q48 45 34 41',hair)+circle(88,29,4,'#E0B257')
 elif name=='Emma':
  for x,y in [(35,27),(47,15),(65,13),(81,23),(86,36)]:b+=circle(x,y,11,hair)
 elif name=='mother':b+=path('M32 42 Q27 13 57 13 Q88 11 88 43 L77 28 Q66 40 54 26 Q45 38 32 42',hair)
 elif name=='sister':b+=path('M32 50 L29 28 Q49 6 80 21 L89 62 L76 61 L75 29 L41 49 Z',hair)
 elif name=='Jones':b+=path('M33 48 Q24 16 55 14 Q88 13 87 49 L77 28 Q56 41 34 49',hair)
 elif name=='Richards':b+=path('M34 46 L30 25 Q39 17 50 20 L44 32 L38 50 M75 22 Q94 27 86 50 L79 48 L75 33',hair)
 elif name=='man':b+=path('M35 40 L32 22 L52 14 L80 18 L87 39 L75 29 L46 32 Z',hair)
 else:b+=path('M35 57 Q20 42 29 20 Q54 2 83 22 Q100 49 81 61 L77 29 Q61 44 38 36 Z',hair)
 for x in [49,70]:b+=circle(x,49,1.5,INK)
 b+=path('M52 64 Q60 70 69 63')
 if jean:b+=path('M39 44 L57 44 L57 56 L39 56 Z M64 44 L82 44 L82 56 L64 56 Z M57 49 L64 49')
 if name=='Richards':b+=path('M38 44 H58 V55 H38 Z M64 44 H83 V55 H64 Z M58 49 H64')+path('M54 61 Q60 57 67 61',hair)
 if name=='Jones':b+=path('M39 59 L42 57 M78 59 L80 56',extra='stroke-width="1.5"')
 if sally:b+=circle(23,88,5,'#D87B69')+circle(97,88,5,'#D87B69')
 return b
for n in ['Jean','Jack','Sally','Tim','Nicola','Emma','Amy','mother','sister','Jones','Richards','man']:
 save(n,person(n,'sit' if n=='Sally' else 'climb' if n=='Tim' else 'point' if n=='Jean' else 'stand'),120,216)
def tree():return path('M89 203 L85 93 L58 63 L67 55 L91 78 L103 57 L115 65 L103 94 L108 203','#BE956B')+path('M62 91 Q17 101 20 63 Q-1 35 37 24 Q42 -1 80 12 Q112 -7 132 19 Q173 16 168 50 Q190 75 145 95 Z','#9DB987')+path('M53 47 Q78 65 99 46 M116 27 Q115 43 134 45',extra='stroke="#739C69"')
def dog(run=False,bone=False):
 b=path('M51 50 Q78 24 103 46 L101 68 L52 71 Z','#C69455')+path('M99 46 Q123 31 124 18',extra='stroke-width="8"')
 b+=path('M55 66 L41 85 M73 68 L86 86 M88 68 L107 80' if run else 'M54 68 L54 88 M87 68 L87 88',extra='stroke-width="7"')
 b+=path('M20 39 Q21 13 50 20 Q75 21 64 48 L48 63 L18 54 Z','#E6C58C')+path('M47 23 Q68 8 72 30 L57 55 Z','#8D613E')+circle(32,35,2,INK)+circle(18,45,5,INK)+path('M22 53 Q36 60 40 51')
 if bone:b+=path('M14 63 Q-2 52 0 69 Q-2 83 13 74 L38 75 Q50 87 53 72 Q53 56 39 64 Z','#FFF3DA')
 return '<g transform="translate(136 0) scale(-1 1)">'+b+'</g>' if run else b
def cat(run=False):
 b=path('M46 51 Q74 26 106 48 L98 71 L49 68 Z','#D88467')+path('M100 49 Q125 33 112 12',extra='stroke-width="7"')
 b+=path('M55 68 L39 83 M83 67 L99 82' if run else 'M53 68 L53 86 M90 65 L91 86',extra='stroke-width="6"')
 b+=path('M16 37 L14 12 L33 25 L52 14 L55 44 Q41 66 19 52 Z','#E9A486')+circle(25,36,2,INK)+circle(44,35,2,INK)+path('M31 46 L37 44 L35 49 Z',INK)+path('M19 45 L3 42 M19 50 L2 53 M46 43 L64 39 M49 50 L65 54')
 return '<g transform="translate(136 0) scale(-1 1)">'+b+'</g>' if run else b
save('cat',at(cat(),50,42,1.1));save('dog',at(dog(),48,45,1.1));save('tree',at(tree(),40,-3,.93));save('grass',path('M18 162 Q120 119 221 162 L205 184 L38 184 Z','#A5BF80')+path('M47 158 L41 137 M47 158 L54 135 M108 149 L99 124 M108 149 L114 126 M168 153 L176 131',extra='stroke="#719456"'))
def garden(w=1000,h=480,mobile=False,actors=True):
 b=rect(0,0,w,h,'#EAF4F2',0).replace('rx="0"','rx="0" stroke="none"')+path(f'M0 {h-107} Q{w*.4} {h-150} {w} {h-98} V{h} H0 Z','#D4DFB4',extra='stroke="none"')
 b+=path(f'M0 {h-110} H{w}',extra='stroke="#B5C49D" stroke-width="2"')
 # Distant flower beds stay quiet; the active figures are outlined in brown.
 for x in range(18,w,57):b+=path(f'M{x} {h-95} v-31',extra='stroke="#B9C8A8" stroke-width="3"')
 if mobile:
  b+=at(tree(),223,58,1.05)+at(person('Sally','sit'),236,175,.6)+at(person('Tim','climb'),280,69,.68)+at(dog(True),65,213,.61)+at(cat(True),155,214,.61)
  if actors:b+=at(person('Jean','point'),2,62,.62)+at(person('Jack','point'),398,62,.62)
 else:
  b+=at(tree(),580,214,1.25)+at(person('Sally','sit'),558,329,.72)+at(person('Tim','climb'),628,243,.8)+at(dog(True),325,396,.6)+at(cat(True),427,396,.6)
  if actors:b+=at(person('Jean','point'),31,230,1.03)+at(person('Jack','point'),846,229,1.04)
 for x in ([22,49,431,455] if mobile else [202,229,813,826]):
  b+=path(f'M{x} {h-17} v-16',extra='stroke="#8EA775" stroke-width="2"')+circle(x,h-35,4,'#E8C788')
 return b
# Theatre includes actor attribution, never answer-coloured spotlights.
for mobile in [False,True]:
 w,h=(480,300) if mobile else (1000,480)
 b=garden(w,h,mobile,False)
 positions=[('Jean',2,62,.62),('Jack',398,62,.62)] if mobile else [('Jean',31,230,1.03),('Jack',846,229,1.04)]
 for name,x,y,s in positions:b+=f'<g data-actor="{name}">'+at(person(name,'point'),x,y,s)+f'<text data-name="true" x="{x+60*s}" y="{y+228*s}" text-anchor="middle" fill="{INK}" stroke="none" font-family="sans-serif" font-size="{12 if mobile else 16}">{name}</text></g>'
 save('stage-mobile' if mobile else 'stage',b,w,h)
save('cover-scene',garden(480,300,True),480,300);save('keepsake',garden(480,300,True),480,300);save('garden',garden(480,300,True),480,300)
save('under',at(tree(),50,0,.9)+at(person('Sally','sit'),88,103,.43));save('sit',at(person('Sally','sit'),66,-6,.93));save('climb',at(tree(),85,0,.9)+at(person('Tim','climb'),102,18,.76))
save('run',at(dog(True),34,37,1.3));save('after',at(dog(True),9,91,.9)+at(cat(True),123,50,.85)+path('M64 51 H133 M122 41 L135 51 L122 61',extra='stroke="#829571"'))
save('across',rect(20,45,200,122,'#DCE8C8',22)+path('M30 145 Q100 165 208 97 M195 92 L209 96 L203 110',extra='stroke="#76965E"')+at(dog(True),45,51,1))
save('who',at(person('Jean','point'),2,6,.86)+f'<text x="153" y="118" fill="#C18A44" stroke="none" font-family="sans-serif" font-size="95">?</text>')
save('Tim',at(tree(),54,10,1.0)+at(person('Tim','climb'),68,41,.78),230,230)
# Familiar standalone objects may reuse previous lesson drawings; actions below are newly composed.
for name,src in [('letter','assets/unit21-22/letter.svg'),('basket','assets/unit19-20/box.svg'),('clean','assets/unit29-30/clean.svg'),('tap','assets/unit29-30/tap.svg')]:
 p=ROOT/src
 if p.exists() and name!='basket':(OUT/(name+'.svg')).write_text(p.read_text())
if not (OUT/'letter.svg').exists():save('letter',rect(25,52,190,112,'#FFF4D5')+path('M29 58 L119 120 L210 58'))
basket=path('M26 75 Q60 57 94 75 L83 128 L39 128 Z','#D9AB68')+path('M35 70 Q31 21 62 24 Q97 23 87 72')+path('M34 89 H91 M38 106 H87 M47 77 L48 127 M67 76 L68 127')
save('basket',at(basket,22,-1,1.55))
bone=path('M46 84 Q22 54 18 83 Q0 108 35 112 L168 113 Q203 135 207 107 Q222 80 186 78 L48 87 Z','#F8EBD6')
save('bone',at(bone,5,0));save('milk',rect(75,22,88,151,'#FFFDF7')+path('M75 47 L93 22 H143 L163 47 Z','#B7DCE0')+rect(92,72,53,71,'#C5E0E1')+path('M106 96 Q120 68 134 96 Q140 117 120 122 Q100 118 106 96','#FFFDF7'))
save('tooth',path('M85 26 Q59 18 45 46 Q32 71 59 111 L72 172 Q83 190 95 146 Q118 93 133 146 Q145 190 157 172 L171 111 Q199 61 174 35 Q159 13 133 26 Q110 38 85 26 Z','#FFFDF7')+path('M83 53 Q110 64 139 53',extra='stroke="#CABCA4"'))
plate='<ellipse cx="120" cy="113" rx="96" ry="61" fill="#FFFDF7"/><ellipse cx="120" cy="113" rx="72" ry="42" stroke="#B9CED0"/>'+path('M65 107 Q113 40 165 103 Q135 128 65 107','#E2AF6B')+circle(153,128,13,'#91B070')+circle(173,112,10,'#91B070')
save('meal',plate)
def action(name):
 # Actors are connected to task objects, with no literal translation embedded in artwork.
 p='Jack';pose='action';body='';over=''
 if name=='typing':
  p='Nicola';body=rect(116,117,112,63,'#D3B7A2')+rect(147,26,61,84,'#FFFCF1')+rect(123,84,98,42,'#88A5AB')+path('M122 126 L104 154 H231 L220 126 Z','#A7BDC0');over=path('M153 46 H197 M153 60 H194 M153 72 H180',extra='stroke="#B0B4A4"')
  for x in range(126,214,14):over+=rect(x,136,7,4,'#FFF8E5',1)+rect(x-3,146,7,4,'#FFF8E5',1)
 elif name=='emptying':
  p='Amy';body=path('M144 64 L202 94 L187 121 L129 90 Z','#D9AB68')+path('M149 62 Q190 20 207 91 M144 79 L193 107 M146 73 L141 95 M161 81 L157 104 M178 91 L173 113')+rect(153,163,76,17,'#E7D4B7',8)+path('M184 128 L182 142 M202 139 L206 149',extra='stroke="#A9B89A"')+circle(195,157,6,'#C37C5B')
 elif name=='opening':
  p='Richards';body=rect(138,24,88,141,'#D6E8E6')+path('M138 25 L204 42 L204 147 L138 165 Z','#FFFAED')+path('M149 44 L190 55 L190 127 L149 139 Z','#A8D3DA')+circle(197,95,3,INK)
 elif name=='making':
  p='mother';body=rect(105,111,126,62,'#C49E77')+path('M109 112 L145 77 L230 93 L231 150 L112 137 Z','#B7CBC2')+rect(177,79,47,25,'#FFFCED',10)
 elif name=='shutting':
  p='Sally';body=rect(150,19,74,165,'#D8B896')+rect(159,30,57,147,'#AECDD0')+circle(205,107,4,'#DDB361')
 elif name=='eating':return at(dog(False,True),45,60,1.25)
 elif name=='looking':
  p='sister';body=rect(141,31,86,117,'#D2B077')+rect(151,43,66,92,'#E7F1E2')+path('M154 116 L172 71 L195 111 L215 88 V134 H152 Z','#A0B88A')+circle(200,62,9,'#EDC66F')
 elif name=='reading':
  p='Jack';over=path('M67 90 Q110 69 143 91 V145 Q106 128 67 148 Z','#E8CF99')+path('M104 84 V137 M78 103 L94 100 M78 117 L94 113 M115 101 L134 104 M115 115 L134 119',extra='stroke="#91755A"')
 elif name=='cleaning':
  p='man';over=path('M58 56 L77 52',extra='stroke="#B69550" stroke-width="5"')+path('M48 53 H57',extra='stroke="#FFFDF7" stroke-width="6"')+rect(144,130,80,40,'#BFD7D9',16)
 elif name=='dusting':
  p='Emma';body=rect(130,120,99,59,'#D4B094')+rect(160,24,60,87,'#BDDCE0',23)+path('M107 108 L166 110',extra='stroke="#A58D68" stroke-width="6"');over=path('M159 100 Q188 87 199 106 Q190 123 160 115 Z','#D9C79E')
 elif name=='cooking':
  p='Emma';body=rect(134,120,98,64,'#B5CEBF')+rect(145,91,75,42,'#E2B76C')+path('M156 90 Q165 75 185 87 M177 73 Q166 60 180 48 M201 76 Q214 63 204 51',extra='stroke="#9EA997"')+path('M112 109 L167 105',extra='stroke="#9B7451" stroke-width="7"')
 elif name=='drinking':return at(cat(),71,87,1.08)+path('M54 139 H104 L94 164 H62 Z','#A9C8CF')+path('M59 143 H99',extra='stroke="#FFFDF7" stroke-width="5"')
 elif name=='sweeping':
  p='Amy';body=path('M116 83 L158 174',extra='stroke="#9B7451" stroke-width="6"')+path('M144 162 L174 162 L190 190 H145 Z','#E9C27D')+path('M151 176 L155 189 M161 174 L169 189')
 elif name=='sharpening':
  p='Tim';over=path('M85 115 L153 99',extra='stroke="#D8AD50" stroke-width="8"')+path('M80 116 L86 110 L89 119 Z','#F4DEC2')+rect(124,93,22,19,'#93B8BC',3)+path('M129 128 Q143 119 150 132 Q137 142 133 139','#E9CE93')
 elif name=='turning-on':
  p='man';body=path('M178 84 V177 M150 179 H207',extra='stroke-width="5"')+path('M154 34 H202 L221 86 H137 Z','#F4D388')+path('M179 86 V116')+path('M150 95 L140 105 M208 95 L219 104',extra='stroke="#DEB452"');over=''
 elif name=='turning-off':
  p='Sally';body=path('M153 96 V74 H193 V113',extra='stroke="#A5C4CA" stroke-width="12"')+path('M158 57 H189 M174 57 V73',extra='stroke-width="5"')+rect(134,137,97,35,'#D0E4E2',14);over=''
 elif name=='putting-on':
  p='Tim';over=path('M43 83 L67 93 L91 81 L103 131 L80 153 L53 142 Z','#E3ECE7')+path('M67 94 L70 145 M58 104 L84 106')+path('M55 123 L81 126',extra='stroke-width="7"')
 elif name=='taking-off':
  p='Jones';over=path('M34 86 L60 97 L74 119 L102 99 L120 125 L93 153 L61 144 L39 124 Z','#C49471')+path('M42 97 L76 145 M72 121 L101 119')
 targets={'typing':[(135,139),(162,137)],'emptying':[(138,82),(179,63)],'opening':[(144,91),(204,108)],'making':[(116,114),(164,113)],'shutting':[(159,103),(206,108)],'looking':[(37,116),(135,90)],'reading':[(74,133),(135,131)],'cleaning':[(55,110),(76,53)],'dusting':[(121,109),(152,110)],'cooking':[(117,109),(153,103)],'sweeping':[(123,99),(140,134)],'sharpening':[(93,113),(145,104)],'turning-on':[(42,121),(178,115)],'turning-off':[(40,119),(172,57)],'putting-on':[(57,126),(98,124)],'taking-off':[(58,123),(106,125)]}
 # Place working bodies within arm's reach. Reading, clothing and brushing use
 # their own close-up props aligned to the original shoulder/mouth coordinates.
 px=38 if name in ['typing','emptying','opening','making','shutting','dusting','cooking','turning-on','turning-off'] else 6
 if name=='opening':targets[name]=[(143,91),(197,95)]
 arms=''
 for shoulder,target in zip([(px+28,79),(px+68,80)],targets.get(name,[])):
  x,y=target;sx,sy=shoulder;arms+=path(f'M{sx} {sy} L{(sx+x)/2} {max(sy+20,y)} L{x} {y}',extra='stroke-width="6"')+circle(x,y,4.5,SKIN)
 b='<ellipse cx="127" cy="188" rx="111" ry="7" fill="#E0DAC7" stroke="none"/>'+body+at(person(p,pose),px,6,.82)+over+arms
 return b
for name in ['typing','emptying','opening','making','shutting','eating','looking','reading','cleaning','dusting','cooking','drinking','sweeping','sharpening','turning-on','turning-off','putting-on','taking-off']:save(name,action(name))
for base,act in [('type','typing'),('eat','eating'),('clean','cleaning'),('cook','cooking'),('drink','drinking')]:save(base,action(act))
# Scenario choice keeps equal neutral button bounds, with a different mobile composition.
for mobile in [False,True]:
 w,h=(360,260) if mobile else (720,330)
 b=rect(0,0,w,h,'#EEF4E7',12)+path(f'M0 {h-42} H{w} V{h} H0 Z','#C8D7AB',extra='stroke="none"')
 if mobile:b+=at(tree(),172,25,1.02)+at(person('Jack'),0,54,.83)+at(person('Sally','sit'),176,144,.5)+at(person('Tim','climb'),230,28,.84)
 else:b+=at(tree(),459,37,1.32)+at(person('Jack'),20,76,1.14)+at(person('Sally','sit'),451,167,.74)+at(person('Tim','climb'),514,44,1.12)
 save('garden-find-mobile' if mobile else 'garden-find',b,w,h)
# Bind the original artwork as the shared, stable theatre presentation.
spec={'unit':'unit31-32','theatreVersion':2,'wall':'#EAF4F2','title':'花园里，大家正在做什么？','svg':(OUT/'stage.svg').read_text(),'mobileSvg':(OUT/'stage-mobile.svg').read_text(),'speakers':['Jean','Jack','Jean','Jack','Jean','Jack','Jack','Jean','Jean','Jack','Jean','Jack','Jack','Jack'],'frames':['Jean向Jack问起Sally。','Jack指出花园。','Jean询问Sally正在做什么。','Sally正坐在树下。','Jean问起Tim。','Jack确认Tim也在花园里。','Tim正攀着树干。','Jean请求Jack再说一次。','Jean问谁正在爬树。','Jack说明是Tim。','Jean接着问狗。','狗也在花园里。','狗正跑过草地。','狗正在追一只猫。'],'finish':'花园观察完成：你分清了谁在哪里、正在做什么。','completionArt':'/assets/unit31-32/keepsake.svg'}
(ROOT/'unit31-32/scene.js').write_text('(function(root){root.CanranCore.unit3132Scene=root.CanranCore.classroomScene.create('+json.dumps(spec,ensure_ascii=False)+');})(globalThis);\n')
print('Wrote',len(list(OUT.glob('*.svg'))),'garden assets')
