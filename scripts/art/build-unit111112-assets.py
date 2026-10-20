from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[2];d=r/'assets/unit111-112';d.mkdir(exist_ok=True)
def put(name,body,box='0 0 180 160'):
 (d/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def text(value,x=90,y=147,size=21):
 return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{size}" stroke="none" fill="#624936">{value}</text>'
def tv(color='#b38a63',x=22,y=26,w=136,h=99):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{color}"/><rect x="{x+10}" y="{y+12}" width="{w*.65}" height="{h-24}" rx="15" fill="#b9c6c7"/><circle cx="{x+w-16}" cy="{y+30}" r="8" fill="#dcc39e"/><circle cx="{x+w-16}" cy="{y+65}" r="8" fill="#dcc39e"/><path d="M{x+20} {y+h}v8M{x+w-20} {y+h}v8" fill="none"/>'
put('television',tv());put('model',tv('#b38a63',12,29,99,80)+tv('#d8c9a6',77,66,90,68))
for amount in [30,40,60]:put('model-'+str(amount),tv()+text('£'+str(amount)))
tag='<path d="M28 37h99l31 43-31 43H28Z" fill="#f1dfb8"/><circle cx="132" cy="80" r="5" fill="#c7b792"/>'
put('price',tag+text('£',80,99,43));put('cost',tag+text('£',80,99,43))
for name,count in [('cheap',1),('expensive',4),('afford',3),('deposit',1)]:
 body=''.join(f'<circle cx="{37+i*34}" cy="80" r="21" fill="#e8ca83"/>' for i in range(count))
 if name=='afford':body+='<path d="m60 119 16 15 41-37" fill="none" stroke="#83a17e" stroke-width="7"/>'
 if name=='deposit':body+='<path d="M78 80h55m-12-11 12 11-12 11" fill="none"/><rect x="119" y="48" width="39" height="65" rx="7" fill="none" stroke-dasharray="4 7"/>'
 put(name,body)
put('instalment',''.join(f'<rect x="{21+i*49}" y="42" width="40" height="77" rx="6" fill="#e5d9be"/><circle cx="{41+i*49}" cy="79" r="12" fill="#e9ca8b"/>' for i in range(3)))
put('millionaire','<rect x="18" y="35" width="144" height="87" rx="13" fill="#d5b998"/>'+text('1,000,000',90,88,23))
put('worth','<path d="M28 30h124v99H28Z" fill="#e6dcbf"/><path d="m51 78 22 20 48-49" fill="none" stroke="#86a180" stroke-width="7"/>')
put('pound','<circle cx="90" cy="80" r="57" fill="#e8ca83"/>'+text('£',90,102,65))
for name,label in [('month','1 month'),('year','1 year')]:
 put(name,'<rect x="30" y="29" width="120" height="100" rx="10" fill="#f9eed6"/><path d="M30 58h120M57 20v23M123 20v23" fill="none"/>'+text(label,90,100,24))
put('equal','<rect x="28" y="52" width="124" height="16" rx="5" fill="#b8cdbb"/><rect x="28" y="92" width="124" height="16" rx="5" fill="#b8cdbb"/>')
put('unequal','<path d="m126 31-74 49 74 49" fill="none" stroke="#a89ab4" stroke-width="14"/>')
put('difficult','<path d="M28 129V97h32V72h32V46h32V22h32" fill="none" stroke="#a6b8bd" stroke-width="14"/><path d="m24 52 19-21 19 21" fill="none"/>')
put('interesting','<path d="M19 34q35-13 71 8 36-21 71-8v101q-35-13-71 8-36-21-71-8Z" fill="#e4d1a8"/><path d="M90 42v101" fill="none"/><path d="m125 57 7 14 15 2-11 11 2 15-13-7-13 7 2-15-11-11 15-2Z" fill="#f0d290"/>')
put('comfortable','<rect x="45" y="20" width="90" height="92" rx="25" fill="#c5d3b5"/><rect x="25" y="69" width="28" height="66" rx="12" fill="#b5c4a5"/><rect x="127" y="69" width="28" height="66" rx="12" fill="#b5c4a5"/><path d="M53 96h74v39H53Z" fill="#d1dec0"/><path d="M43 136v12M137 136v12" fill="none"/>')
put('important','<path d="m90 19 20 39 43 6-32 30 8 43-39-20-39 20 8-43-32-30 43-6Z" fill="#e2c889"/><path d="M90 52v37" stroke-width="8"/><circle cx="90" cy="108" r="5" fill="#624936" stroke="none"/>')
put('intelligent','<path d="M29 34h122v106H29Z" fill="#f2e4c8"/><path d="M49 61h82M49 85h41" stroke="#b5c4b3"/><path d="m90 111 13 12 25-28" fill="none" stroke="#84a17c" stroke-width="6"/>')
put('sweet','<path d="M88 47C57 19 24 46 31 84c11 62 44 58 59 49 17 9 51 13 61-49 7-38-27-65-59-37Z" fill="#d9a79b"/><path d="M90 46V19q20-13 32-4-7 20-32 17" fill="#b6c59b"/>')
for name,h in [('tall',112),('short',61)]:
 put(name,f'<rect x="65" y="{137-h}" width="50" height="{h}" rx="5" fill="#bdc9d1"/><path d="M28 139h124" fill="none"/>')
put('old','<rect x="42" y="26" width="96" height="112" rx="8" fill="#d7c7aa"/><path d="M53 48h70M53 70h70M53 92h70" stroke="#b1a185"/><path d="m42 121 16-8 12 25" fill="#eee2c8"/>')
put('blunt','<path d="M74 25h32v94H74Z" fill="#d9b575"/><path d="m74 119 7 25h18l7-25Z" fill="#f3d7ac"/><path d="M81 144h18" stroke-width="6"/>')
put('sharp','<path d="M28 73h58v25H28Z" fill="#b69b82"/><path d="M86 73h74q-13 27-74 25Z" fill="#c3d0cf"/><circle cx="42" cy="85" r="3" fill="#ead6b3" stroke="none"/>')
put('clean','<path d="M33 39h105v99H33Z" fill="#d7e3d2"/><path d="m127 18 7 19 19 7-19 7-7 19-7-19-19-7 19-7Z" fill="#ecd190"/>')
put('fat','<circle cx="90" cy="33" r="18" fill="#e2c2a0"/><path d="M67 58h46q39 25 34 67H33q-5-42 34-67Z" fill="#bfcbd4"/><path d="M66 126v20M114 126v20" fill="none"/>')
put('smart','<path d="m66 28-29 20-13 30 26 14 9-22-10 69h82l-10-69 9 22 26-14-13-30-29-20-24 19Z" fill="#b9c9c7"/><path d="m66 28 24 19 24-19M90 47v92" fill="none"/>')
put('light','<path d="M44 119q20-60 77-96c28 49-13 83-57 88Z" fill="#e7d8bc"/><path d="M40 140 111 38M70 98l33-4M83 79l34-6" fill="none"/>')
put('new','<path d="M37 35h104v105H37Z" fill="#d0dcc6"/><path d="m118 12 6 17 17 6-17 6-6 17-6-17-17-6 17-6Z" fill="#ebcd88"/><path d="M57 71h62M57 94h62" stroke="#a5b49b"/>')
for n in [2,5,8]:
 put('case-'+str(n),'<rect x="41" y="46" width="98" height="86" rx="12" fill="#b9ccd2"/><path d="M69 45V28h42v17" fill="none"/><rect x="54" y="68" width="72" height="44" rx="5" fill="#f8efd9"/>'+text(str(n)+' kg',90,98,23))
for name in ['task-record','task-checked']:shutil.copyfile(r/f'assets/unit105-106/{name}.svg',d/(name+'.svg'))
put('display-models',tv('#b38a63',12,12,136,99)+tv('#d8c9a6',174,12,136,99)+'<path d="M6 126h310" stroke="#a58a6a" stroke-width="9"/>','0 0 322 140')
(d/'television-shop.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 790" preserveAspectRatio="none"><rect width="1000" height="790" fill="#f0eaf1"/><rect x="43" y="71" width="190" height="320" rx="72" fill="#d4dfdd" stroke="#c8b8ba" stroke-width="7"/><path d="M138 73v314M45 231h187" stroke="#eee4d8" stroke-width="8"/><rect x="786" y="85" width="160" height="170" rx="12" fill="#e7dcc3" stroke="#d1c2aa" stroke-width="6"/><path d="M819 223V119h92v104" fill="#d6cfbb"/><path d="M0 490h1000v300H0Z" fill="#ddcfb7"/><path d="M0 490h1000" stroke="#bdad94" stroke-width="5"/><ellipse cx="500" cy="698" rx="438" ry="58" fill="#e9ddc6"/></svg>\n',encoding='utf-8')
print('111–112 icons, independent price/weight candidates and shop assets built.')
