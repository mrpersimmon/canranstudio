"""Native semantic diagrams; character artwork remains ImageGen output."""
from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[2];d=r/'assets/unit109-110';d.mkdir(exist_ok=True)
def put(name,body):
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def label(text,x=90,y=150,size=18):
 return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{size}" fill="#624936" stroke="none">{text}</text>'
def cup(level=1,x=52):
 return f'<path d="M{x} 44h66v80q-33 27-66 0Z" fill="#fff7e2"/><path d="M{x+66} 57q42-4 24 40h-24" fill="none"/><path d="M{x+8} {124-64*level}h50v24q-25 18-50 0Z" fill="#bda381" stroke="none"/>'
def dots(count):
 return ''.join(f'<circle cx="{35+(i%4)*36}" cy="{42+(i//4)*38}" r="12" fill="#ddbc82"/>' for i in range(count))
def bars(heights,selected):
 return ''.join(f'<rect x="{30+i*48}" y="{132-h}" width="30" height="{h}" rx="5" fill="{("#e3ba72" if i==selected else "#c4d2c0")}"/>' for i,h in enumerate(heights))
put('idea','<path d="M65 104C21 67 60 22 90 22s69 45 25 82l-3 20H68Z" fill="#f1d990"/><path d="M70 134h40M78 145h24M90 9V2M30 32l-9-8M150 32l9-8" fill="none"/>')
put('teaspoonful','<ellipse cx="90" cy="53" rx="32" ry="25" fill="#ecdfbf"/><path d="M82 78v57q8 13 16 0V78" fill="#b9c9c8"/><path d="M65 53q25-33 50 0Z" fill="#fff8df"/>')
put('cup',cup())
put('coffee',cup(.7))
put('milk','<path d="M65 22h50v26l17 20v70H48V68l17-20Z" fill="#fff7e2"/><path d="M65 22v-8h50v8M49 81h82" fill="#b9cbd6"/>')
put('sugar','<path d="M40 64h100l-11 70H51Z" fill="#dfd4bb"/><path d="M33 61h114M78 26h24l8 24H70Z" fill="#fff7e2"/><rect x="65" y="85" width="26" height="26" rx="3" fill="#fff8e9"/><rect x="95" y="85" width="24" height="26" rx="3" fill="#fff8e9"/>')
put('biscuit','<circle cx="90" cy="80" r="54" fill="#e7bd76"/>'+''.join(f'<circle cx="{x}" cy="{y}" r="4" fill="#b99055" stroke="none"/>' for x,y in [(60,62),(86,48),(116,62),(75,89),(108,92),(88,116)]))
put('empty','<path d="m37 66 53-29 53 29v65l-53 22-53-22Z" fill="#d5b48b"/><path d="m37 66 53 23 53-23-53-23Z" fill="#b89065"/><path d="M90 89v64m-53-87-18-21 54-26 17 24m53 23 18-21-54-26-17 24" fill="#ebd4b5"/>')
put('pity','<circle cx="90" cy="80" r="55" fill="#f0d6af"/><path d="M61 67h8m42 0h8M67 110q23-25 46 0" fill="none"/>')
put('advice','<path d="M27 28h126v80h-44l-27 27v-27H27Z" fill="#dae4d2"/><path d="M48 54h84M48 76h57" stroke="#97ab8d"/>')
put('instead','<rect x="23" y="64" width="48" height="63" rx="8" fill="#dec6ac"/><circle cx="130" cy="94" r="29" fill="#c1d3ac"/><path d="M50 38h76m-12-12 12 12-12 12" fill="none"/>')
for name,count in [('a-few',3),('few',2),('many',12),('fewer',2),('fewest',1)]:
 put(name,dots(count))
for name,level in [('a-little',.25),('little',.12),('much',1)]:
 put(name,cup(level))
for name,heights,selected in [('more',[40,90],1),('less',[40,90],0),('most',[30,65,100],2),('least',[30,65,100],0)]:
 put(name,bars(heights,selected))
for name,rank in [('better',2),('best',3),('worse',1),('worst',0)]:
 put(name,'<rect x="34" y="26" width="112" height="110" rx="10" fill="#f5e9ce"/>'+''.join(f'<path d="m{52+i*34} 59 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z" fill="#e5bf71"/>' for i in range(rank))+'<path d="M56 111h68" stroke="#c8ae8c"/>')
put('well','<circle cx="90" cy="80" r="54" fill="#dce7c9"/><path d="m56 81 23 25 47-54" fill="none" stroke="#86a47c" stroke-width="8"/>')
put('ill','<path d="M26 112h130v27H26Z" fill="#d2c7b5"/><path d="M38 67h108v43H38Z" fill="#e4dcce"/><circle cx="56" cy="62" r="21" fill="#eacaaa"/><path d="M82 64h63v48H82Z" fill="#c3d5d8"/><path d="M31 109v37M151 109v37" fill="none"/>')
for name,x in [('far',132),('farther',132),('further',132),('farthest',151),('furthest',151)]:
 put(name,f'<path d="M24 127h132M25 126V83l19-16 19 16v43" fill="#dfc7a4"/><circle cx="{x}" cy="57" r="18" fill="#b5ccb2"/><path d="M{x} 75v44M70 102h{x-78}m-10-10 10 10-10 10" fill="none"/>')
put('half','<circle cx="90" cy="80" r="55" fill="#fff5db"/><path d="M90 25a55 55 0 0 1 0 110Z" fill="#ddbd81"/><path d="M90 25v110" stroke-dasharray="5 7"/>')
put('enough','<rect x="28" y="28" width="124" height="108" rx="12" fill="#e4ecd8"/><path d="m53 85 23 21 48-53" fill="none" stroke="#83a176" stroke-width="8"/>')
for name in ['task-record','task-checked']:
 shutil.copyfile(r/('assets/unit105-106/'+name+'.svg'),d/(name+'.svg'))
# Two identical outline spoons; fill fraction changes while the utensil size stays fixed.
def spoon(x,fraction):
 clip=f'clip{x}'
 return f'<defs><clipPath id="{clip}"><ellipse cx="{x}" cy="45" rx="23" ry="27"/></clipPath></defs><ellipse cx="{x}" cy="45" rx="23" ry="27" fill="#fbf7e9"/><rect x="{x-23}" y="{72-54*fraction}" width="46" height="{54*fraction}" fill="#d8b46f" stroke="none" clip-path="url(#{clip})"/><ellipse cx="{x}" cy="45" rx="23" ry="27" fill="none"/><path d="M{x-6} 72v48q6 13 12 0V72" fill="#bcccca"/>'
put('spoons-one',spoon(90,1)+label('1',90,153,21))
put('spoons-one-half',spoon(49,1)+spoon(131,.5)+label('1',49,153,21)+label('+',90,96,20)+label('½',131,153,21))
put('spoons-two',spoon(49,1)+spoon(131,1)+label('1',49,153,21)+label('+',90,96,20)+label('1',131,153,21))
for amount in [100,200,300]:
 h=amount/300*90
 put('milk-'+str(amount),f'<path d="M48 20h84v112H48Z" fill="#f1f6f0"/><rect x="50" y="{130-h}" width="80" height="{h}" fill="#eee0bc" stroke="none"/><path d="M48 20h84v112H48ZM132 41h20v62h-20M50 40h15M50 70h15M50 100h15" fill="none"/>'+label(str(amount)+' ml'))
choc='<rect x="37" y="28" width="106" height="100" rx="6" fill="#a78367"/><path d="M72 29v98M108 29v98M38 61h104M38 94h104" stroke="#7e624c"/>'
put('chocolate',choc)
for name,heights,selected in [('more',[35,90],1),('most',[25,55,95],2),('less',[35,90],0),('least',[25,55,95],0)]:
 put('chocolate-'+name,bars(heights,selected))
put('mistakes','<rect x="39" y="22" width="102" height="118" rx="7" fill="#faf2df"/><path d="M58 48h60M58 76h60M58 104h60" stroke="#b9c7b1"/><path d="m117 42 12 12m0-12-12 12m0 44 12 12m0-12-12 12" stroke="#bd8b78"/>')
for name,count in [('more',6),('most',9),('fewer',2),('fewest',1)]:
 put('mistakes-'+name,'<rect x="25" y="19" width="130" height="124" rx="7" fill="#faf2df"/>'+''.join(f'<path d="m{40+i%3*38} {39+i//3*37} 17 17m0-17-17 17" stroke="#bd8b78"/>' for i in range(count)))
put('car','<path d="m27 91 17-44h85l22 44v34H27Z" fill="#bad1d7"/><path d="M51 57h69l14 31H39Z" fill="#f4ebd8"/><circle cx="53" cy="128" r="15" fill="#9a8d7e"/><circle cx="126" cy="128" r="15" fill="#9a8d7e"/>')
put('restaurant','<path d="M31 55h118v85H31Z" fill="#e8d6b7"/><path d="m21 55 17-29h104l17 29Z" fill="#bacaac"/><path d="M71 83h38v57M43 78h18v28H43M119 78h18v28h-18" fill="#c8dbe0"/>')
(d/'coffee-room.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#f5ebdc"/><path d="M0 545h1000v175H0Z" fill="#dcd0b5"/><path d="M0 545h1000" stroke="#c7af8e" stroke-width="5"/><rect x="50" y="70" width="200" height="335" rx="70" fill="#d9e5df" stroke="#d4bca0" stroke-width="8"/><path d="M150 74v326M53 225h195" stroke="#eee3ce" stroke-width="8"/><path d="m827 134-54 121h122l-42-121Z" fill="#e4d4a9"/><path d="M834 255v263M795 521h80" stroke="#c1aa89" stroke-width="6"/><ellipse cx="500" cy="637" rx="206" ry="52" fill="#e9dec5"/><path d="M442 577h116l-8 71h-100Z" fill="#c5ab85"/><ellipse cx="500" cy="575" rx="92" ry="21" fill="#d6bd96"/></svg>\n',encoding='utf-8')
print('109–110 word icons, identical-scale measurement diagrams and neutral sitting room built.')
