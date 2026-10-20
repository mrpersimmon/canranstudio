from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[2];d=r/'assets/unit107-108';d.mkdir(exist_ok=True)
def put(name,body):
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def dress(color):
 return f'<path d="m67 25-25 18-15 35 25 12 8-18-15 68h90l-15-68 8 18 25-12-15-35-25-18q-23 18-46 0Z" fill="{color}"/><path d="M61 78h58M78 78l12 7 12-7-12-7Z" fill="#fff7e1"/><path d="M89 84v37" fill="none"/>'
put('dress-blue',dress('#8bbbd8'));put('dress-green',dress('#a5c9ad'))
put('shirt','<path d="m65 25-30 15-20 36 27 17 12-18v64h72V75l12 18 27-17-20-36-30-15-25 19Z" fill="#f3e7c5"/><path d="m65 25 25 19-15 15-10-34m50 0-25 19 15 15 10-34M90 44v94" fill="none"/>')
put('skirt','<path d="M61 25h58l25 113H36Z" fill="#cbb4ce"/><path d="M59 36h62M72 48l-8 76M90 48v76M108 48l8 76" fill="none"/>')
put('colour','<circle cx="55" cy="60" r="27" fill="#8bbbd8"/><circle cx="124" cy="60" r="27" fill="#a5c9ad"/><circle cx="90" cy="115" r="27" fill="#e7b29e"/>')
put('size','<path d="M42 27h84l20 50-20 50H42Z" fill="#fff4dc"/><circle cx="127" cy="77" r="6" fill="#d7bc9b"/><path d="M56 54v46M67 54v15M78 54v24M89 54v15M100 54v24M111 54v15" fill="none"/>')
put('madam','<path d="M28 26h124v77h-52l-29 26v-26H28Z" fill="#fff6df"/><path d="M48 50h84M48 69h56" stroke="#bb927f"/><path d="m126 112 6-13 6 13 14 3-11 9 1 14-10-8-11 8 1-14-11-9Z" fill="#e7c277"/>')
put('smart',dress('#c9b7d2')+'<path d="m145 17 4 12 12 4-12 4-4 12-4-12-12-4 12-4Z" fill="#f4d99e"/>')
put('pretty','<path d="M90 95v45M90 122q-29 0-31-22 31-2 31 22" fill="#b9d0ae"/><circle cx="90" cy="65" r="19" fill="#f2d184"/>'+''.join(f'<ellipse cx="{x}" cy="{y}" rx="18" ry="22" fill="#eac0bf"/>' for x,y in [(68,46),(112,46),(63,78),(117,78),(90,98)]))
put('suit',dress('#8bbbd8')+'<path d="m123 112 12 12 24-28" fill="none" stroke="#729b80" stroke-width="7"/>')
put('fashion','<path d="M90 17q20-3 17 12c-1 6-12 9-17 10v8L28 83h124L90 47" fill="none"/><path d="M48 87v53h84V87" fill="#e6c4b6"/>')
put('not-at-all','<circle cx="90" cy="79" r="55" fill="#fff3de"/><path d="m55 44 70 70" stroke="#bc7c73" stroke-width="8"/>')
for name,negative in [('as-well',False),('either',True)]:
 put(name,'<rect x="20" y="35" width="54" height="75" rx="10" fill="#bed8cc"/><rect x="106" y="35" width="54" height="75" rx="10" fill="#c5d9e4"/>'+('<path d="m34 55 26 35m0-35-26 35m86-35 26 35m0-35-26 35" stroke="#b2756b"/>' if negative else '<path d="m34 70 9 11 18-25m60 14 9 11 18-25" fill="none"/>'))
put('another','<rect x="23" y="48" width="55" height="75" rx="8" fill="#bdd5df"/><rect x="102" y="48" width="55" height="75" rx="8" fill="#e5c7b5"/><path d="M60 27h65m-12-11 12 11-12 11" fill="none" stroke="#8eaa8a"/>')
for name,w,h in [('small',45,45),('large',100,100),('tall',44,105),('short',44,55),('thin',100,16)]:
 put(name,f'<rect x="{90-w/2}" y="{135-h}" width="{w}" height="{h}" rx="6" fill="#bbd0d6"/><path d="M22 140h136" stroke="#bda68f"/>')
for name,selected in [('more',1),('most',2),('less',1),('least',0)]:
 heights=[35,65,100];fillcolors=['#c8d6c4','#c8d6c4','#c8d6c4'];fillcolors[selected]='#e6c178'
 put(name,''.join(f'<rect x="{26+i*48}" y="{135-h}" width="32" height="{h}" rx="5" fill="{fillcolors[i]}"/>' for i,h in enumerate(heights))+f'<path d="M{42+selected*48} 16v12m-6-6 6 6 6-6" fill="none"/>')
put('heavy','<path d="M53 63h74l17 73H36Z" fill="#a3b4bb"/><path d="M75 62V40q15-20 30 0v22" fill="none"/>')
put('hot','<path d="M78 26a12 12 0 0 1 24 0v77a23 23 0 1 1-24 0Z" fill="#fff4dd"/><path d="M90 50v67" stroke="#cb8870" stroke-width="10"/><circle cx="90" cy="121" r="13" fill="#cb8870" stroke="none"/>')
put('wet','<path d="M90 17C68 53 40 77 40 103a50 50 0 0 0 100 0c0-26-28-50-50-86Z" fill="#a5c8de"/><path d="M61 100q-1 20 14 26" stroke="#f5f5e8"/>')
put('easy','<rect x="40" y="24" width="100" height="110" rx="8" fill="#fff6e3"/><path d="m61 78 18 17 41-45" fill="none" stroke="#7da17f" stroke-width="7"/>')
put('nice','<path d="m90 22 19 37 41 6-30 29 8 41-38-20-38 20 8-41-30-29 41-6Z" fill="#f1d59c"/>')
put('good','<rect x="37" y="31" width="106" height="100" rx="10" fill="#e3edd9"/><path d="m57 80 24 23 44-53" fill="none" stroke="#7b9c7c" stroke-width="7"/>')
put('bad','<rect x="37" y="31" width="106" height="100" rx="10" fill="#f0e2da"/><path d="m57 61 25 14-20 15 38-4-18 28 43-12" fill="none" stroke="#ae8578"/>')
for name in ['try','task-record','task-checked']:
 shutil.copyfile(r/('assets/unit105-106/'+name+'.svg'),d/(name+'.svg'))
def case(color,label=''):
 return f'<rect x="42" y="49" width="96" height="86" rx="12" fill="{color}"/><path d="M69 49V31h42v18M56 64v55M124 64v55" fill="none"/>'+ (f'<rect x="57" y="73" width="66" height="37" rx="5" fill="#fff7e2"/><text x="90" y="99" text-anchor="middle" font-family="Arial" font-size="22" fill="#624936" stroke="none">{label}</text>' if label else '')
for name,color,weight in [('brown','#c4a188',4),('blue','#91b9d4',6),('green','#a3c4a1',9)]:
 put('case-'+name,case(color));put(f'case-{name}-{weight}',case(color,f'{weight} kg'))
for kind,count in [('a',1),('b',2),('c',4)]:
 values=[('S',63),('P',83),('H',105),('…',50)][:count]
 put('height-'+kind,''.join(f'<rect x="{20+i*38}" y="{125-h}" width="25" height="{h}" rx="5" fill="{["#d5b8c4","#b9ccd2","#ced6aa","#dac5aa"][i]}"/><text x="{32+i*38}" y="150" text-anchor="middle" font-size="17" font-family="Arial" stroke="none" fill="#624936">{name}</text>' for i,(name,h) in enumerate(values)))
for kind,height in [('a',35),('b',60),('c',85)]:
 put('heat-'+kind,f'<rect x="66" y="18" width="48" height="120" rx="20" fill="#fff6df"/><rect x="78" y="{130-height}" width="24" height="{height}" rx="10" fill="#d18e74" stroke="none"/><path d="M115 35h16M115 60h16M115 85h16M115 110h16" stroke="#c2b59d"/>')
for kind,count in [('a',4),('b',7),('c',10)]:
 put('crowd-'+kind,''.join(f'<circle cx="{26+(i%5)*32}" cy="{40+(i//5)*60}" r="11" fill="#e6c5a3"/><path d="M{13+(i%5)*32} {76+(i//5)*60}q0-24 13-24t13 24" fill="#c1cfbb"/>' for i in range(count)))
(d/'dress-shop.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#f4e9e1"/><path d="M0 539h1000v181H0Z" fill="#e7d7bd"/><path d="M0 541h1000" stroke="#c4ab92" stroke-width="5"/><g stroke="#d2b9a8" stroke-width="5"><rect x="30" y="69" width="180" height="394" rx="75" fill="#e0e5dd"/><path d="M785 128h180M802 128v357M947 128v357" fill="none"/></g><g stroke="#d0b8a7" stroke-width="3" fill="none"><path d="m822 171 35 24h-70l35-24m0-13v13M910 171l35 24h-70l35-24m0-13v13"/></g><path d="M801 199h43l15 112h-73Z" fill="#dac4b4"/><path d="M889 199h43l15 112h-73Z" fill="#d4d3bc"/><path d="M0 692h1000" stroke="#d9c5a9" stroke-width="4"/></svg>''',encoding='utf-8')
print('107–108 native vocabulary, reference diagrams and independent numeric case illustrations built.')
