#!/usr/bin/env python3
"""Rebuild one deliberately composed theatre. Usage: ... 17-18 (no batch default)."""
from pathlib import Path
import json,re,sys
B='#503729'; SKIN='#FFDDBB'; CREAM='#FFFCF1'
def p(d,fill='none',extra=''):return f'<path d="{d}" fill="{fill}" {extra}/>'
def r(x,y,w,h,fill,rad=5,extra=''):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rad}" fill="{fill}" {extra}/>'
def c(x,y,rad,fill,extra=''):return f'<circle cx="{x}" cy="{y}" r="{rad}" fill="{fill}" {extra}/>'
def g(body,x=0,y=0,s=1,extra=''):return f'<g transform="translate({x} {y}) scale({s})" {extra}>{body}</g>'
def txt(t,x,y,size=18,extra=''):return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Baloo 2,Arial,sans-serif" font-size="{size}" font-weight="600" fill="{B}" stroke="none" {extra}>{t}</text>'
def wrap(body,w=1000,h=480):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" stroke="{B}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round">{body}</svg>'
def character_icon(body):
 # Keep an extended hand, bun or hat inside the exported card/certificate image.
 return wrap(g(body,12,14),204,283)
def head(x,y,hair,shape='round',glasses=False):
 face=(f'<ellipse cx="{x}" cy="{y}" rx="29" ry="33" fill="{SKIN}"/>' if shape=='long' else f'<ellipse cx="{x}" cy="{y}" rx="33" ry="30" fill="{SKIN}"/>')
 face+=g(p('M-33-6q-5-41 29-35 30-8 35 28-21-3-28-16-13 21-36 23z',hair),x,y)
 face+=c(x-11,y+1,2.3,B)+c(x+12,y+1,2.3,B)+p(f'M{x-10} {y+16}q10 8 19-1')
 face+=c(x-19,y+12,4,'#F2B69D','stroke="none"')+c(x+20,y+12,4,'#F2B69D','stroke="none"')
 if glasses:face+=c(x-12,y+2,12,'none')+c(x+13,y+2,12,'none')+p(f'M{x} {y+1}h2')
 return face

def shadow():return '<ellipse cx="90" cy="248" rx="51" ry="8" fill="#503729" opacity=".14" stroke="none"/>'
def feet(x1,x2,y=237):return p(f'M{x1} {y}h-13M{x2} {y}h14',extra='stroke-width="10"')
def hand(x,y):return c(x,y,8,SKIN)
def actor(body,key,x,y,scale=1,start=-1,end=999,label='',focus=''):
 return part(g(body,x,y,scale)+txt(label,x+90*scale,y+275*scale,17,'data-name="true"'),key,start,end,focus,actor=key)
def part(body,key,start=-1,end=999,focus='',actor=''):
 return f'<g data-part="{key}" data-from="{start}" data-to="{end}" data-focus="{focus}" data-actor="{actor}">{body}</g>'
def wall(wall='#EDF2F2',floor='#E6D9BC',w=1000,h=480,y=397):
 return r(0,0,w,h,wall,0,'stroke="none"')+p(f'M0 {y}H{w}V{h}H0z',floor,'stroke="none"')+p(f'M0 {y}H{w}',extra='stroke="#B5B8A5" stroke-width="3"')
def win(x,y,w=110,h=110):return g(r(0,0,w,h,'#E4EEEE',5,'stroke="#A6BDBA"')+r(8,8,w-16,h-16,'#F7F8EB',1,'stroke="none"')+p(f'M{w/2} 8v{h-16}M8 {h/2}h{w-16}',extra='stroke="#B4CBC6"')+p(f'M-5 {h+7}h{w+10}',extra='stroke="#BAC9BE" stroke-width="7"'),x,y)
def desk(x,y,w=210):return g(p(f'M15 11v69m{w-30}-69v69',extra='stroke="#9D8A71" stroke-width="12"')+r(0,0,w,16,'#D9BE91',5,'stroke="#9D8A71"'),x,y)
def book(x,y,fill,w=36,h=49):return g(r(0,0,w,h,fill,4)+p(f'M7 3v{h-6}M10 {h-9}h{w-15}',extra='stroke="#FFF4D5" stroke-width="3"'),x,y)
def note(x,y):return g(r(0,0,40,32,CREAM,2)+p('M7 9h23M7 16h18M7 23h22',extra='stroke="#A6AAA1" stroke-width="2"'),x,y)
# Seven separately drawn bodies. Shared ink/face primitives keep the illustration language consistent.
JACKSON=shadow()+p('M66 176l-7 57m50-58 8 58',extra='stroke="#546A73" stroke-width="17"')+feet(58,117)+p('M53 108 34 157m87-44 25 23 22-16',extra='stroke="#547E8B" stroke-width="13"')+hand(31,162)+hand(172,116)+p('M55 89 87 83l31 14 17 92-44 12-45-15z','#638B98')+p('m65 89 21 26-5 58-15-65m42-16-22 21 11 49 17-61','#426778')+p('M82 97l11 1 1 25-8 11-8-14z','#E9B950')+p('M89 139v51M55 158l24 3m23-3 22-4')+head(89,55,'#543B2E','long',True)
RICHARDS=shadow()+p('M62 184v49m49-49 6 49',extra='stroke="#776557" stroke-width="19"')+feet(62,117)+p('M49 112 34 165m91-52 13 51',extra='stroke="#B99A71" stroke-width="14"')+hand(34,171)+hand(138,170)+p('M55 91q35-17 68 6l11 85q-50 20-91-4z','#C3A27F')+p('M63 92 88 112l22-19-5 80H70z','#FFF5DF')+p('M83 118v65m-24-37h18m17 0h21')+c(85,158,3,B)+g(p('M54 37q-7-25 18-30 23-10 39 8l9 37','#CAB18D')+f'<ellipse cx="87" cy="57" rx="35" ry="32" fill="{SKIN}"/>'+p('M53 50q-13-26 7-28m58 27q14-25-3-27','#B8ADA0')+c(74,57,12,'none')+c(101,57,12,'none')+p('M86 54h3')+c(74,57,2,B)+c(101,57,2,B)+p('M76 76q13 7 24-1'))
NICOLA=shadow()+p('M67 195 60 236m47-40 4 40',extra='stroke="#654C40" stroke-width="12"')+feet(59,112)+p('M58 101 36 143 46 165m68-64 21 32-10 24',extra='stroke="#B98164" stroke-width="11"')+hand(48,168)+hand(122,160)+p('M64 88q24-9 43 4l27 104q-46 19-90-4z','#C99677')+p('m67 89 19 21 18-20-5 36-12-15-13 10z',CREAM)+p('M86 123l-2 66M60 159l19 1')+c(88,8,16,'#624437')+head(87,57,'#624437','long')
CLAIRE=shadow()+p('M63 173l-7 63m44-65 15 66',extra='stroke="#51636C" stroke-width="19"')+feet(55,115)+p('M57 101 37 152m77-47 19 19 17-24',extra='stroke="#79A79E" stroke-width="12"')+hand(35,159)+hand(154,96)+p('M57 89h51l16 89-76 2z','#83AAA2')+p('m68 89 17 24 15-23-5 34-12-11-14 12z',CREAM)+p('M82 119v53M53 149h20m18 0h22')+g(p('M48 54q-4-39 36-46 42-6 43 48l-11 43H51z','#A76C47'))+head(87,56,'#A76C47')
MICHAEL=shadow()+p('M61 183 54 235m47-52 14 54',extra='stroke="#7B695C" stroke-width="17"')+feet(54,116)+p('M53 105 30 144 57 156m60-51 26 46-26 8',extra='stroke="#D8B596" stroke-width="13"')+hand(61,157)+hand(111,160)+p('M58 89h48l17 97H43z','#FFF5E2')+p('m58 90 28 23-6 66H45zm48 0-20 23 8 66h30z','#B17F69')+p('M56 152h18m22 0h17')+head(84,56,'#7A543D','long')
JEREMY=shadow()+p('M60 174 57 235m49-61 8 61',extra='stroke="#4E6474" stroke-width="15"')+feet(57,113)+p('M56 100 36 153m81-51 20 40-14 21',extra='stroke="#8199AA" stroke-width="12"')+hand(34,161)+hand(119,167)+p('M59 83h45l17 106-73 0z','#8CA5B2')+p('m61 87 21 24 19-25-10 44-10-18-13 18z',CREAM)+p('M82 123v57M52 153h20m19 0h20')+head(82,46,'#493F38','long',True)
JIM=shadow()+p('M66 171 60 235m41-66 5 66',extra='stroke="#697B72" stroke-width="17"')+feet(60,106)+p('M56 99 36 140 64 161m51-61 23 50-22 6',extra='stroke="#D9CBB6" stroke-width="12"')+hand(66,163)+hand(111,158)+p('M57 87h52l13 95H44z','#F4E9D0')+p('M57 123h18m20 0h17M87 97v75')+p('M58 88 86 105l21-17-10 34-11-16-13 17z','#B8C6AB')+head(86,52,'#6F4E34')+g(p('M58 26q-13-20 5-25l19 9Q107-2 117 21l-28 9z','#6F4E34'))
CAST={'17-18':{'jackson':JACKSON,'richards':RICHARDS,'nicola':NICOLA,'claire':CLAIRE,'michael':MICHAEL,'jeremy':JEREMY,'jim':JIM}}

def office(mobile=False):
 if not mobile:
  b=wall('#EAF1F3','#E7DCC6')+win(45,122,119,132)+win(824,123,128,132)+r(802,280,161,113,'#D5DEDA',4,'stroke="#AFBEB7"')+p('M804 322h156m-156 33h156',extra='stroke="#AFBEB7"')
  b+=actor(JACKSON,'jackson',15,233,.72,label='Jackson')+actor(RICHARDS,'richards',842,243,.69,label='Richards')
  pos=[('nicola',357,.73,2,6,'Nicola'),('claire',506,.73,2,6,'Claire'),('michael',357,.73,7,12,'Michael'),('jeremy',506,.73,7,12,'Jeremy'),('jim',432,.73,13,999,'Jim')]
  for key,x,s,a,z,label in pos:b+=actor(CAST['17-18'][key],key,x,237,s,a,z,label)
  b+=desk(318,369,355)
  b+=part(r(351,350,90,16,'#9DBBBE')+r(546,350,90,16,'#9DBBBE')+p('M361 356h69m-69 6h69m125-6h70m-70 6h70',extra='stroke="#EFF4E9" stroke-width="2"'),'keyboards',6,6,'6')
  b+=part(note(353,337)+note(586,337),'jim-files',15,999,'15')
 else:
  b=wall('#EAF1F3','#E7DCC6',400,275,224)+win(6,12,65,80)+win(330,12,62,80)
  b+=actor(JACKSON,'jackson',-9,97,.46,label='Jackson')+actor(RICHARDS,'richards',321,104,.44,label='Richards')
  for key,x,a,z,label in [('nicola',107,2,6,'Nicola'),('claire',201,2,6,'Claire'),('michael',107,7,12,'Michael'),('jeremy',201,7,12,'Jeremy'),('jim',157,13,999,'Jim')]:b+=actor(CAST['17-18'][key],key,x,78,.51,a,z,label)
  b+=desk(99,174,202)
  b+=part(r(109,164,60,10,'#9DBBBE')+r(231,164,60,10,'#9DBBBE'),'keyboards',6,6,'6')+part(note(114,147)+note(250,147),'jim-files',15,999,'15')
 return b


# Mum is a separate identity from Mrs. Smith: cropped curls, a broad face,
# a short walking jacket and loose trousers. Her posture follows the children.
def mother(pose='care'):
 b=shadow()+p('M52 154h64l13 73-31 3-16-54-10 54-31-3z','#667980')+p('M46 220h26m26 0h28',extra='stroke="#96A6A5" stroke-width="5"')+feet(56,113)
 arms={
  'care':('M53 109 32 146 62 159M118 110 139 139 158 126',(65,160),(163,121)),
  'invite':('M53 111 35 154 55 167M117 110 140 132 167 148',(60,168),(174,149)),
  'request':('M53 111 35 153 61 162M119 110 137 135 155 121',(65,163),(160,116)),
  'hold':('M53 109 92 151 189 119M119 110 135 135 154 119',(194,116),(159,116)),
  'rest':('M53 110 36 151 61 162M117 110 137 151 111 162',(66,163),(106,164)),
 }
 path,left,right=arms[pose]
 b+=p(path,extra='stroke="#AD684F" stroke-width="15"')
 b+=p('M54 91q30-12 62 0l9 78-45 4-37-7z','#C17F5E')+p('M65 90 85 110l22-20-5 54-17-6-20 6z','#F2D7A4')+p('M85 111v57M49 143l24 2m25-1 23-2')+c(88,151,2.6,B)
 b+=hand(*left)+hand(*right)
 b+=p('M48 56q-13-10-4-25-1-16 16-18 6-16 23-10 18-9 28 6 20-2 23 16 15 10 4 28l-9 27H51z','#483B35')
 b+=c(48,59,8,SKIN)+c(126,59,8,SKIN)+p('M51 44q34 13 68-1l4 21q-1 29-36 32-34-1-37-30z',SKIN)
 b+=p('M52 45q-10-12 2-19 12-13 23 0 12-14 24-1 17-9 24 5l-4 17q-11 4-17-7-12 10-23 0-11 12-29 5z','#483B35')
 b+=p('M66 61q5-3 10 0m23 0q5-3 10 0M85 66l-3 8h7',extra='stroke-width="2.7"')
 b+=c(62,73,4.5,'#EDA991','stroke="none"')+c(112,73,4.5,'#EDA991','stroke="none"')+p('M78 82q10 7 21-1')
 return b
MOTHER=mother()
def mother_story():
 return ''.join(part(mother(pose),'mum-'+pose,a,z) for pose,a,z in [('care',-1,2),('invite',3,5),('request',6,6),('hold',7,7),('rest',8,999)])
def girl(seated=False):
 legs=p('M62 171 52 191 57 222m48-51 19 20-6 31',extra='stroke="#AC8263" stroke-width="12"') if seated else p('M65 171 62 223m38-52 5 52',extra='stroke="#AC8263" stroke-width="12"')
 b=shadow()+legs+feet(57 if seated else 62,118 if seated else 106,226)+p('M53 101 31 145m79-41 21 41',extra='stroke="#D8A146" stroke-width="12"')+hand(28,150)+hand(135,150)+p('M57 90h50l22 82q-43 14-86 0z','#E8B95D')+p('M66 93q18 21 32 0',CREAM)+p('M58 144h20')
 b+=p('M54 35q-39-27-38 8l30 19m60-27q37-25 42 8l-34 18','#9F6844')+head(82,57,'#9F6844')
 return b
def boy(seated=False):
 legs=p('M65 171 51 192 59 222m39-50 27 20-6 32',extra='stroke="#617989" stroke-width="14"') if seated else p('M66 173 62 224m35-51 8 51',extra='stroke="#617989" stroke-width="14"')
 return shadow()+legs+feet(59 if seated else 62,119 if seated else 105,228)+p('M53 103 33 146m77-43 21 39',extra='stroke="#729F9C" stroke-width="12"')+hand(30,152)+hand(134,149)+p('M56 90h52l10 82H47z','#83AFAD')+p('M52 119h60m-61 19h62',extra='stroke="#E5EFE1" stroke-width="8"')+p('M46 161h72v30H90l-7-12-7 12H48z','#70889A')+head(82,57,'#5A4436')+p('M51 28q-15-22 10-23l15 9q12-22 29-8 14-7 16 16z','#5A4436')
VENDOR=shadow()+p('M65 178v56m43-56v56',extra='stroke="#859B9A" stroke-width="18"')+feet(65,109)+p('M53 104 26 138m90-35 23 34',extra='stroke="#EFE4CF" stroke-width="15"')+hand(21,143)+hand(143,143)+p('M52 87q36-14 65 3l17 100H39z','#F4EEDB')+p('M64 95h40l18 90H51z','#ECD19E')+r(66,142,34,28,'#C0D4CA')+head(85,54,'#635047')+p('M48 27q-16-22 7-26 9-22 29-9 19-15 31 7 26 6 12 28z',CREAM)+r(48,23,78,17,CREAM)
def bench(x,y,w):return g(r(0,0,w,13,'#CDB38B',3,'stroke="#A38F72"')+r(0,23,w,13,'#CDB38B',3,'stroke="#A38F72"')+r(-6,45,w+12,13,'#DDC299',3,'stroke="#A38F72"')+p(f'M14 58v44m{w-28}-44v44',extra='stroke="#A38F72" stroke-width="10"'),x,y)
def cone(x,y,s=1):return g(p('M1 21h32L17 70z','#E7B971')+p('m6 30 18 14M8 43l13 9',extra='stroke="#B78B54" stroke-width="2"')+c(9,15,13,'#F0B1A0')+c(24,15,13,'#FAE4AD')+p('M0 26h34',extra='stroke-width="3"'),x,y,s)
def cart(x,y,s=1):return g(p('M8 27h174l-15-42H26z','#D99883')+p('M40-12v32m31-32v32m31-32v32m31-32v32',extra='stroke="#FFF5D9" stroke-width="12"')+p('M26 27v82m140-82v82',extra='stroke="#9C846B" stroke-width="5"')+r(9,89,176,67,'#AACDCC')+c(35,166,15,CREAM)+c(156,166,15,CREAM)+g(cone(0,0),74,105,.48),x,y,s)
def tired(body):
 return body.replace('M72 73q10 8 19-1','M73 76q8-4 17 0').replace(c(71,58,2.3,B),p('M66 58q5 3 10 0')).replace(c(94,58,2.3,B),p('M89 58q5 3 10 0'))
def park(mobile=False):
 if not mobile:
  b=wall('#EBF1DC','#E5DABD')+p('M0 397Q120 370 210 408t170 0 280 10T1000 392V480H0z','#DDD7B0','stroke="none"')+p('M67 370V193m867 177V173',extra='stroke="#B4BA91" stroke-width="18"')+c(65,166,89,'#C4D6AD','stroke="none"')+c(953,166,88,'#CADBB7','stroke="none"')+bench(687,345,244)
  b+=actor(mother_story(),'mother',30,241,.78,label='Mum')
  for who,x in [('girl',691),('boy',819)]:
   body=girl() if who=='girl' else boy();sit=girl(True) if who=='girl' else boy(True)
   happy=10 if who=='girl' else 12
   b+=actor(tired(body),who,x,263,.66,-1,2,who.title())+part(g(tired(sit),x,277,.66)+txt(who.title(),x+59,465,17,'data-name="true"'),who+'-resting',3,happy-1,actor=who)+part(g(sit,x,277,.66)+txt(who.title(),x+59,465,17,'data-name="true"'),who+'-seated',happy,999,actor=who)
  b+=part(g(VENDOR,551,250,.55)+cart(354,282,.8),'vendor-cart',6,999,'6 7',actor='vendor')
  b+=part(cone(145,290,.66),'cone-girl',7,999,'8')+part(cone(175,290,.66),'cone-boy',7,999,'8')
  moves={'cone-girl':[[8,'translate(547px, 43px)']],'cone-boy':[[8,'translate(645px, 43px)']]}
 else:
  b=wall('#EBF1DC','#E5DABD',400,275,228)+c(16,47,56,'#C4D6AD','stroke="none"')+c(381,48,52,'#CADBB7','stroke="none"')+bench(222,178,165)
  b+=actor(mother_story(),'mother',-6,79,.58,label='Mum')
  for who,x in [('girl',223),('boy',310)]:
   body=girl() if who=='girl' else boy();sit=girl(True) if who=='girl' else boy(True)
   happy=10 if who=='girl' else 12
   b+=actor(tired(body),who,x,126,.43,-1,2,who.title())+part(g(tired(sit),x,149,.43)+txt(who.title(),x+38,266,14,'data-name="true"'),who+'-resting',3,happy-1,actor=who)+part(g(sit,x,149,.43)+txt(who.title(),x+38,266,14,'data-name="true"'),who+'-seated',happy,999,actor=who)
  b+=part(g(VENDOR,133,82,.43)+g(r(9,89,176,67,'#AACDCC')+c(35,166,15,CREAM)+c(156,166,15,CREAM)+g(cone(0,0),74,105,.48),103,133,.54),'vendor-cart',6,999,'6 7',actor='vendor')
  b+=part(cone(79,125,.5),'cone-girl',7,999,'8')+part(cone(96,125,.5),'cone-boy',7,999,'8')
  moves={'cone-girl':[[8,'translate(147px, 53px)']],'cone-boy':[[8,'translate(217px, 53px)']]}
 return b,moves


# Jane is a deliberate continuous visual identity across the two exchanges.
# The unnamed man's continuity is an illustration choice, not a textbook fact.
# Stable identity features are shared; book and tray actions are drawn separately.
MAN_HEAD=head(87,56,'#A99E87',glasses=True)+p('M71 73q8-10 16-2 9-8 17 2-8 8-17 2-7 7-16-2z','#9F8B72')
JANE_HEAD=p('M111 29q52-32 43 26l-21 52-24-41z','#805841')+head(86,55,'#805841','long')
def man(pose='book'):
 tray=pose in ('tray','point-tray','wait-tray')
 b=shadow()+p('M62 181 51 237m58-56 13 56' if tray else 'M62 181 57 237m52-56 9 56',extra='stroke="#63766B" stroke-width="19"')+feet(51 if tray else 57,122 if tray else 118)
 b+=p('M57 90q36-17 58 6l17 93H44z','#F5E8CE')+p('m60 94 27 17-7 68H45zm55 0-28 17 10 68h35z','#A4B08A')+p('M55 147h20m26 0h19')
 arms={
  'book':('M52 105 28 152M121 106 144 142 170 134',(26,159),(175,131)),
  'portrait-book':('M52 105 28 152M121 106 145 140 116 161',(26,159),(110,164)),
  'point-book':('M52 105 28 152M121 106 145 126 170 107',(26,159),(175,103)),
  'tray':('M52 105 81 171 130 157M121 106 145 174 172 158',(134,155),(176,155)),
  'point-tray':('M52 106 70 141 103 149M121 106 144 113 158 78',(108,150),(160,73)),
  'wait-tray':('M52 106 64 144 96 157M121 106 142 149 114 162',(102,159),(109,163)),
 }
 path,left,right=arms[pose]
 return b+p(path,extra='stroke="#A08F69" stroke-width="13"')+hand(*left)+hand(*right)+MAN_HEAD

def jane(pose='book'):
 tray=pose in ('tray','ready-tray','empty-tray')
 b=shadow()+p('M61 195 48 236m58-41 14 41' if tray else 'M61 195 55 236m51-41 7 41',extra='stroke="#644B3E" stroke-width="12"')+feet(48 if tray else 54,120 if tray else 113)
 b+=p('M61 88q23-9 48 5l26 105q-45 15-94-2z','#CB9A88')+p('m63 90 22 19 22-18-7 36-15-13-17 12z',CREAM)+p('M84 125v61M49 160h25')
 arms={
  'book':('M59 100 32 133 5 129M109 104 135 144 119 163',(0,129),(114,167)),
  'think':('M59 102 34 135 64 146M109 104 123 121 100 83',(69,148),(96,78)),
  'empty':('M59 102 39 146 67 161M109 104 126 143 99 161',(73,164),(94,164)),
  'tray':('M59 103 26 169 4 158M109 104 91 177 44 158',(0,155),(40,155)),
  'ready-tray':('M59 103 38 142 64 159M109 104 119 147 89 160',(69,161),(83,162)),
  'empty-tray':('M59 103 39 151M109 104 134 151',(37,158),(139,157)),
 }
 path,left,right=arms[pose]
 return b+p(path,extra='stroke="#BA8676" stroke-width="12"')+hand(*left)+hand(*right)+JANE_HEAD

def exchange_person(key,cups):
 if key=='jane':
  states=[('ready-tray',-1,3),('tray',4,5),('empty-tray',6,999)] if cups else [('think',-1,1),('book',2,2),('think',3,3),('book',4,5),('empty',6,999)]
  draw=jane
 else:
  states=[('point-tray',-1,3),('wait-tray',4,5),('tray',6,999)] if cups else [('point-book',-1,5),('book',6,999)]
  draw=man
 return ''.join(part(draw(pose),key+'-'+pose+'-'+str(a),a,z) for pose,a,z in states)
def shelves(x,y,w=200):return g(r(0,0,w,130,'#E5D8C1',6,'stroke="#C1B59D"')+p(f'M0 64h{w}',extra='stroke="#C1B59D" stroke-width="8"'),x,y)
def glass(x,y,s=1):return g(p('M0 0h23l-3 36H4z','#E4F3EF')+p('M6 7h11M7 14v13',extra='stroke="#FFFFFF" stroke-width="3"'),x,y,s)
def glasses(x,y,s=1):return g(glass(0,0)+glass(31,0)+glass(62,0)+p('M-5 36h96l-7 8H2z','#FFF7DD'),x,y,s)
def exchange_portrait(key,cups):
 # Portraits show the completed exchange: only the receiver holds the target.
 # Jane relaxes her hands after handing it over; no second copy of the object.
 if key=='jane':return jane('empty-tray' if cups else 'empty')
 if cups:return man('tray')+glasses(128,126,.65)
 return man('portrait-book')+book(66,125,'#D98170',44,60)+hand(110,163)
def exchange(pair,mobile=False):
 cups=pair=='23-24';tone='#EDF2E8' if cups else '#F1E9E4'
 if not mobile:
  b=wall(tone,'#E5D9C2')+win(42,132,115,122)
  b+=actor(exchange_person('man',cups),'man',14,239,.76,label='Man')+actor(exchange_person('jane',cups),'jane',840,239,.76,label='Jane')
  if cups:
   b+=desk(334,390,255)+g(p('M0 0h206v13H0z','#CCB78F','stroke="#AF9979"')+p('M20 13v26l28-26m137 0v26l-27-26','#CCB78F','stroke="#AF9979"'),598,317)
   b+=part(glasses(389,346,1),'table-glasses',-1,999,'2')+part(glasses(634,273,1),'shelf-glasses',-1,999,'3 4 5 6')
   moves={'table-glasses':[[2,'translate(0px, 0px)']],'shelf-glasses':[[4,'translate(191px, 40px)'],[6,'translate(-521px, 40px)']]}
  else:
   b+=shelves(688,271,131)+g(book(0,0,'#B9C9C3')+book(43,0,'#D8C997'),705,284,.64)+desk(321,391,346)
   b+=part(book(408,331,'#C1C4B5',43,60),'first-book',-1,999,'2')+part(book(514,331,'#D98170',43,60),'red-book',-1,999,'3 4 5 6')
   moves={'first-book':[[2,'translate(390px, 0px)'],[3,'translate(0px, 0px)']],'red-book':[[4,'translate(284px, 0px)'],[6,'translate(-368px, 0px)']]}
 else:
  b=wall(tone,'#E5D9C2',400,275,228)+win(9,7,68,83)
  b+=actor(exchange_person('man',cups),'man',-10,109,.52,label='Man')+actor(exchange_person('jane',cups),'jane',304,107,.53,label='Jane')
  if cups:
   b+=desk(96,214,116)+g(r(0,0,95,9,'#CCB78F',2,'stroke="#AF9979"')+p('M13 9v13l12-13m55 0v13L68 9',extra='stroke="#AF9979"'),224,121)
   b+=part(glasses(111,187,.62),'table-glasses',-1,999,'2')+part(glasses(239,94,.62),'shelf-glasses',-1,999,'3 4 5 6')
   moves={'table-glasses':[[2,'translate(0px, 0px)']],'shelf-glasses':[[4,'translate(53px, 68px)'],[6,'translate(-177px, 68px)']]}
  else:
   b+=shelves(120,28,147)+g(book(0,0,'#B9C9C3')+book(48,0,'#D8C997'),140,48,.58)+desk(121,213,151)
   b+=part(book(142,169,'#C1C4B5',29,43),'first-book',-1,999,'2')+part(book(218,169,'#D98170',29,43),'red-book',-1,999,'3 4 5 6')
   moves={'first-book':[[2,'translate(133px, -8px)'],[3,'translate(0px, 0px)']],'red-book':[[4,'translate(57px, -8px)'],[6,'translate(-137px, -8px)']]}
 return b,moves,tone


# Mrs. Smith remains recognisable in both rooms; the outfit and gesture fit the setting.
# Her portrait is for the word card/keepsake, not an invented speaker in these narrated texts.
SMITH_HEAD=p('M46 52q-6-50 35-47 46-6 47 48l-10 33H48z','#7B5640')+head(88,53,'#7B5640')
def smith(kitchen=True):
 b=shadow()
 if kitchen:
  b+=p('M64 196 59 237m50-41 3 41',extra='stroke="#796150" stroke-width="13"')+feet(59,112)
  b+=p('M58 89q31-14 55 3l29 108q-54 20-103-2z','#7AA9A5')+p('M66 94h40l6 42 17 59H51l11-60z','#F1E3BC')+r(68,151,39,29,'#9FBBB0')
  b+=p('M56 101 36 147 65 158M119 101 133 139 163 150',extra='stroke="#6A9999" stroke-width="12"')+hand(169,151)
  b+=p('M48 156h23l10 36-24 4z','#FAF1D6')+p('M56 163 67 187m-1-26 8 25',extra='stroke="#C4D3BC" stroke-width="3"')+hand(67,158)
 else:
  b+=p('M61 194 52 237m59-42 13 42',extra='stroke="#796150" stroke-width="13"')+feet(52,125)
  b+=p('M57 140h61l28 61q-46 18-109-1z','#B89D7D')+p('M63 153 56 197m29-43-1 49m22-47 13 45',extra='stroke="#E8D9C0" stroke-width="3"')
  b+=p('M57 91q33-15 59 2l12 74-41-9-44 10z','#79A6A0')+p('M68 90q17 23 39 0l-7 64H76z','#F5E7CC')+p('M70 96 64 146m38-46 9 47M53 145h15m41 0h13')
  b+=p('M55 104 31 134 4 120M119 103 143 147 119 169',extra='stroke="#699690" stroke-width="12"')+hand(0,118)+hand(113,171)
 return b+SMITH_HEAD
def fridge(x,y,s=1):return g(r(0,0,113,186,'#FFFEF4',11)+p('M1 62h111M94 26v20M94 89v51')+r(13,14,64,30,'#F4F5EB',4,'stroke="none"')+p('M8 186v8m96-8v8',extra='stroke-width="7"'),x,y,s)
def cooker(x,y,s=1):return g(r(0,0,140,120,'#76A6BB',9)+r(14,51,112,54,'#B8D9E0',6)+p('M1 38h138')+c(23,24,5,'#F1D797')+c(61,24,5,'#F1D797')+c(113,24,5,'#F1D797')+p('M14 0q19-21 40 0m29 0q18-21 41 0M28 61h81')+p('M11 120v9m117-9v9',extra='stroke-width="7"'),x,y,s)
def bottle(x,y,s=1):return g(p('M13 0h17v19l11 11v55H2V30l11-11z','#D5E8D4')+r(11,-4,21,8,'#A9C2A1',2)+p('M11 35v39',extra='stroke="#FFFEED" stroke-width="4"'),x,y,s)
def cup(x,y,s=1):return g(p('M0 0h37v30q-18 12-37 0z',CREAM)+p('M37 5q25-2 19 18-7 8-19 3')+p('M-4 40h52',extra='stroke="#B6AB8E" stroke-width="3"'),x,y,s)
def kitchen(mobile=False):
 if not mobile:
  b=wall('#F4EDDD','#E6D3AE')+win(431,140,163,133)+p('M0 336H1000m-1000 23h1000',extra='stroke="#DDD2B9" stroke-width="2"')+p('M0 441H1000M254 397l-41 83m530-83 45 83',extra='stroke="#D0BF9F" stroke-width="2"')
  b+=part(fridge(798,224),'fridge',focus='1 2 3')+part(cooker(96,288),'cooker',focus='4 5 6')+part(desk(381,345,262),'table',focus='7')+part(bottle(442,274,.82),'bottle',focus='8 9')+part(cup(545,312,.82),'cup',focus='10 11')
 else:
  b=wall('#F4EDDD','#E6D3AE',400,275,228)+win(164,10,81,88)+p('M0 161H400',extra='stroke="#DDD2B9" stroke-width="2"')
  b+=part(fridge(302,82,.75),'fridge',focus='1 2 3')+part(cooker(12,128,.71),'cooker',focus='4 5 6')+part(g(desk(0,0,187),136,195,.79),'table',focus='7')+part(bottle(168,147,.55),'bottle',focus='8 9')+part(cup(223,172,.55),'cup',focus='10 11')
 return b

def tv(x,y,s=1):return g(r(0,0,130,96,'#BD9673',13)+r(9,10,92,72,'#C3DDDC',12)+c(115,29,4,CREAM)+c(115,55,4,CREAM)+p('M16 96l-6 15m101-15 6 15',extra='stroke-width="6"'),x,y,s)
def papers(x,y,fill,s=1):return g(p('M0 9 36 0l51 10-5 24-38-6-45 5z',fill)+p('M37 4l-3 20M7 14l19-6M7 23l17-5m20-9 32 8m-33-1 31 8',extra='stroke="#9D9782" stroke-width="2"'),x,y,s)
def stereo(x,y,s=1):return g(r(0,0,160,79,'#CFA47E',7)+c(27,40,17,'#748C8C')+c(133,40,17,'#748C8C')+r(56,14,49,21,'#DCE6D8',3)+p('M62 52h37M11 79v6m138-6v6'),x,y,s)
def chair(x,y,s=1,reverse=False):return g(r(14,0,85,79,'#CDA396',23)+r(0,39,23,76,'#CDA396',10)+r(89,39,23,76,'#CDA396',10)+r(24,63,65,48,'#E9C8AF',10)+p('M12 115v16m88-16v16',extra='stroke-width="8"'),x,y,s)
def frame(x,y,fill):return g(r(0,0,72,51,'#C9B793',3,'stroke="#A69B82"')+r(7,7,58,37,'#F8F4E6',1,'stroke="none"')+c(48,18,6,'#E9CC80','stroke="none"')+p('M9 39 23 20l17 17 12-12 11 15',fill,'stroke="none"'),x,y)
def living(mobile=False):
 if not mobile:
  b=wall('#F0E9E9','#DFCEB6')+r(27,178,129,220,'#CEB994',10,'stroke="#BBA985"')+r(37,190,109,193,'#E4D5B7',6,'stroke="#C0B498"')+c(126,298,5,'#B09978','stroke="none"')+win(825,136,136,133)
  b+=part(tv(794,315),'television',focus='1 2')+part(papers(812,286,'#DFC3B0',.88),'magazines',focus='3')+part(desk(422,351,181),'table',focus='4')+part(papers(459,323,'#FFF8E3',.78),'newspapers',focus='5')
  b+=part(chair(326,307,.78)+chair(644,307,.82),'armchairs',focus='6 7')+part(stereo(159,346),'stereo',focus='8 9')+part(book(178,297,'#AEC4BF')+book(220,297,'#E1B69D')+book(262,297,'#E6D09C'),'books',focus='10')+part(frame(331,249,'#ADBFAD')+frame(621,246,'#B5C2AD'),'pictures',focus='11 12')
 else:
  b=wall('#F0E9E9','#DFCEB6',400,275,223)+r(5,49,61,170,'#E3D1B1',7,'stroke="#BBA985"')+c(52,149,3,'#B09978','stroke="none"')+win(309,24,81,80)
  b+=part(tv(310,146,.61),'television',focus='1 2')+part(papers(320,132,'#DFC3B0',.48),'magazines',focus='3')+part(g(desk(0,0,162),154,188,.61),'table',focus='4')+part(papers(177,170,'#FFF8E3',.5),'newspapers',focus='5')
  b+=part(chair(95,172,.47)+chair(258,172,.47),'armchairs',focus='6 7')+part(stereo(15,167,.56),'stereo',focus='8 9')+part(book(25,134,'#AEC4BF',17,32)+book(45,134,'#E1B69D',17,32)+book(65,134,'#E6D09C',17,32),'books',focus='10')+part(g(frame(0,0,'#ADBFAD'),112,51,.65)+g(frame(0,0,'#B5C2AD'),228,49,.65),'pictures',focus='11 12')
 return b


# Bedroom: commands focus the target; only correctly submitted tasks change the room.
JONES=shadow()+p('M64 195 60 237m51-42 5 42',extra='stroke="#64564C" stroke-width="13"')+feet(60,117)+p('M55 102 36 137 57 158m58-57 29 20 14-12',extra='stroke="#A58B9C" stroke-width="13"')+hand(62,162)+hand(162,105)+p('M58 91q26-15 51-2l27 109q-46 18-95-2z','#B09AA8')+p('M60 91 85 114l26-25-13 53-15-24-19 24z','#E4D2B9')+p('M85 145v41')+c(85,11,17,'#A69B8C')+head(87,55,'#A69B8C',glasses=True)
AMY=shadow()+p('M68 196 60 237m42-41 9 41',extra='stroke="#5A6B74" stroke-width="12"')+feet(60,111)+p('M56 98 33 134 8 124m105-24 22 43-14 16',extra='stroke="#749AA7" stroke-width="12"')+hand(2,122)+hand(115,163)+p('M58 89h53l20 112H43z','#82A7B1')+p('M65 93h37l5 44 16 60H51l11-60z','#F6EACF')+p('M63 108 85 122l21-16M70 147h29v23H70z','#A7C3C7')+p('M59 41q-28 16-23 49l21 14m58-64q28 28 17 58l-17 12','#72523C')+head(87,54,'#72523C','long')
def bed(x,y,s=1,tidy=False):
 b=r(0,12,49,130,'#CFA87B',9)+r(11,25,28,100,'#F2DEB8',5)+r(45,63,235,79,'#D8B38C',8)+p('M12 142v13m251-13v13',extra='stroke="#8E755A" stroke-width="9"')
 b+=p('M48 70H277v57H48z','#9BBCCA') if tidy else p('M48 84q27-37 53-11l47-18 48 27 39-9 42 35v20H48z','#9BBCCA')
 b+=r(54,61,54,25,CREAM,9)
 if tidy:b+=p('M119 73v49',extra='stroke="#D4E6E3" stroke-width="5"')
 return g(b,x,y,s)
def shirt(x,y,s=1):return g(p('M23 0 37 10l17 3-7 21-12-6v44H0V28l-12 7-8-20L0 10 11 0z','#D5977D')+p('M11 0q6 19 12 0'),x,y,s)
def wardrobe(x,y,s=1):return g(r(0,0,112,195,'#DCC29A',8)+p('M55 4v185M44 89v17M67 89v17M10 195v9m92-9v9'),x,y,s)
def dressing(x,y,s=1):return g(r(0,0,149,20,'#D5B08A',5)+p('M10 20v64m129-64v64',extra='stroke="#AA8D70" stroke-width="9"')+r(34,-94,83,91,'#DBEAE6',36,'stroke="#AA8D70"')+p('M53-70q22-14 37-6',extra='stroke="#FAFCF0" stroke-width="5"'),x,y,s)
def bedroom(mobile=False):
 if not mobile:
  b=wall('#F2EBDE','#E5D4B6')+r(12,154,136,244,'#E3D6BE',9,'stroke="#BEAD92"')+c(126,301,5,'#B49B79','stroke="none"')+wardrobe(196,218)
  b+=part(win(725,178,140,113),'window-shut',-1,19,'4')+part(g(r(0,0,140,113,'#DBEADA',4,'stroke="#A2B7A4"')+p('M0 0 41 16v83L0 113zm140 0-41 16v83l41 14z','#F4F7E8','stroke="#A2B7A4"')+p('M-6 139q29-12 68 0t82 0',extra='stroke="#96B4B0"'),725,178),'window-open',20)
  b+=part(bed(333,282),'bed-untidy',-1,21,'6')+part(bed(333,282,tidy=True),'bed-tidy',22,999,'22')+part(shirt(500,318,.82),'clothes',-1,20,'5')+part(r(202,224,99,179,'#F5E7CE',3,'stroke="none"')+p('M209 247h84',extra='stroke="#AA8D70"')+shirt(228,259,.62),'clothes-put',21)
  b+=dressing(669,368,.85)+part(p('M683 363l7-3m21 4 7-2m21 3 7-3m20 4 5-2',extra='stroke="#AA9275" stroke-width="3"'),'dust',-1,22,'7')+part(p('M361 448l7-5 7 6-5 5zm153-4 7-4 5 5-8 4zm111 3 7-4 5 6-8 3z','#B79C76','stroke="none"'),'floor-dust',-1,23,'8')
  b+=actor(JONES,'Jones',8,252,.70,label='Mrs. Jones')+actor(AMY,'Amy',842,246,.72,label='Amy')
 else:
  b=wall('#F2EBDE','#E5D4B6',400,275,233)+r(2,53,56,180,'#E3D6BE',6,'stroke="#BEAD92"')+wardrobe(100,120,.53)
  b+=part(win(303,4,84,69),'window-shut',-1,19,'4')+part(g(r(0,0,84,69,'#DBEADA',3,'stroke="#A2B7A4"')+p('M0 0 23 10v48L0 69zm84 0L61 10v48l23 11z','#F4F7E8','stroke="#A2B7A4"'),303,4),'window-open',20)
  b+=part(bed(142,147,.53),'bed-untidy',-1,21,'6')+part(bed(142,147,.53,True),'bed-tidy',22,999,'22')+part(shirt(230,168,.43),'clothes',-1,20,'5')+part(r(104,124,52,95,'#F5E7CE',3,'stroke="none"')+p('M108 135h44',extra='stroke="#AA8D70" stroke-width="2"')+shirt(118,140,.32),'clothes-put',21)
  b+=dressing(249,201,.47)+part(p('M256 197l4-1m13 1 4-1m10 2 4-2',extra='stroke="#AA9275" stroke-width="2"'),'dust',-1,22,'7')+part(p('M146 248l5-4 5 4-3 4zm74-1 5-3 4 4-5 3zm55 0 5-2 4 3-5 3z','#B79C76','stroke="none"'),'floor-dust',-1,23,'8')
  b+=actor(JONES,'Jones',-6,98,.55,label='Mrs. Jones')+actor(AMY,'Amy',307,103,.52,label='Amy')
 return b

def read_spec(pair):
 s=Path(f'unit{pair}/scene.js').read_text();return json.JSONDecoder().raw_decode(s[s.index('create(')+7:])[0]
def snapshot(svg,index,moves):
 def visible(m):
  attrs=m.group(1);a=int(re.search(r'data-from="(-?\d+)"',attrs).group(1));z=int(re.search(r'data-to="(\d+)"',attrs).group(1))
  return '<g'+attrs+(' style="display:none"' if not a<=index<=z else '')+'>'
 svg=re.sub(r'<g([^>]*data-from[^>]*)>',visible,svg)
 for key,steps in moves.items():
  steps=[t for at,t in steps if at<=index]
  if steps:svg=svg.replace(f'data-part="{key}"',f'data-part="{key}" style="transform:{steps[-1]}"')
 return svg

def publish(pair,desktop,mobile,cast,wallcolour,moves=None,mobile_moves=None):
 spec=read_spec(pair);spec.update(svg=wrap(desktop),mobileSvg=wrap(mobile,400,275),theatreVersion=2,wall=wallcolour,moves=moves or {},mobileMoves=mobile_moves or {})
 if pair=='29-30':spec['completionArt']='/assets/unit29-30/completed-scene.svg'
 assets=Path('assets')/('unit'+pair)
 for key,body in cast.items():(assets/(key+'.svg')).write_text(character_icon(body))
 (assets/'scene.svg').write_text(spec['svg'])
 (assets/'cover-scene.svg').write_text(snapshot(spec['svg'],-1,{}))
 (assets/'keepsake.svg').write_text(snapshot(spec['svg'],len(spec['frames'])-1,spec['moves']))
 Path(f'unit{pair}/scene.js').write_text('(function(core){\n \'use strict\';\n // Composed for this lesson. Scene changes never award progress.\n core.unit'+pair.replace('-','')+'Scene=core.classroomScene.create('+json.dumps(spec,ensure_ascii=False,indent=1)+');\n})(globalThis.CanranCore);\n')

if __name__=='__main__':
 pair=sys.argv[1] if len(sys.argv)==2 else ''
 if pair=='17-18':publish(pair,office(),office(True),CAST[pair],'#EAF1F3')
 elif pair=='19-20':
  d,m=park();sm,mm=park(True);publish(pair,d,sm,{'mother':MOTHER,'girl':girl(),'boy':boy(),'vendor':VENDOR},'#EBF1DC',m,mm)
  base=Path('assets/unit19-20');(base/'mum.svg').write_text(character_icon(MOTHER));(base/'child.svg').write_text(character_icon(boy()));(base/'children.svg').write_text(wrap(g(girl(),0,0,.8)+g(boy(),150,0,.8),300,220))
 elif pair in ['21-22','23-24']:
  d,m,tone=exchange(pair);sm,mm,_=exchange(pair,True);publish(pair,d,sm,{key:exchange_portrait(key,pair=='23-24') for key in ['man','jane']},tone,m,mm)
 elif pair in ['25-26','27-28']:
  draw=kitchen if pair=='25-26' else living;publish(pair,draw(),draw(True),{'Mrs':smith(pair=='25-26')},'#F4EDDD' if pair=='25-26' else '#F0E9E9')
 elif pair=='29-30':
  publish(pair,bedroom(),bedroom(True),{'Jones':JONES,'Amy':AMY},'#F2EBDE')
  spec=read_spec(pair);Path('assets/unit29-30/completed-scene.svg').write_text(snapshot(spec['svg'],24,{}))
 else:raise SystemExit('Choose exactly one paired unit from 17-18 through 29-30')
