from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[2];d=r/'assets/unit113-114';d.mkdir(exist_ok=True)
def put(name,body):
 (d/(name+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160"><g stroke="#624936" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+body+'</g></svg>\n',encoding='utf-8')
def label(value,x=90,y=91,size=22):return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Arial" font-size="{size}" stroke="none" fill="#624936">{value}</text>'
def coins(count,amount=False):
 points=[(46,48),(90,48),(134,48),(68,101),(112,101)]
 return ''.join(f'<circle cx="{x}" cy="{y}" r="19" fill="#e5c57d"/>'+ (label('£2',x,y+6,16) if amount else '') for x,y in points[:count])
put('note','<rect x="18" y="43" width="144" height="77" rx="8" fill="#d0ddbe"/><rect x="29" y="54" width="122" height="55" rx="7" fill="none"/>'+label('£10',90,93,29))
put('coin','<circle cx="90" cy="80" r="49" fill="#e5c57d"/>'+label('£',90,98,48))
put('coins',coins(3));put('some',coins(3))
put('money','<rect x="25" y="31" width="130" height="78" rx="7" fill="#c4d1b2"/>'+label('£',90,85,39)+coins(2))
put('change','<rect x="20" y="19" width="96" height="49" rx="7" fill="#d0ddbe"/>'+label('£',66,53,29)+'<path d="M128 46v65m-11-12 11 12 11-12" fill="none"/><circle cx="45" cy="119" r="19" fill="#e5c57d"/><circle cx="85" cy="119" r="19" fill="#e5c57d"/>')
put('ticket','<path d="M23 39h134v21a17 17 0 0 0 0 34v24H23V94a17 17 0 0 0 0-34Z" fill="#e4d4ad"/><path d="M113 44v69M43 62h48M43 83h37" fill="none" stroke-dasharray="5 6"/>')
put('fare','<path d="M26 42h128v77H26Z" fill="#e7d5ab"/>'+label('£',90,98,43))
put('conductor','<path d="M31 37q59-37 118 0l-10 33H41Z" fill="#5b6d89"/><path d="M41 69q49 31 98 0" fill="#657891"/><circle cx="90" cy="49" r="10" fill="#e3c585"/><rect x="58" y="101" width="64" height="42" rx="8" fill="#a1b38d"/><path d="M68 100V85h44v15" fill="none"/>')
put('passenger','<circle cx="75" cy="42" r="21" fill="#e5c3a4"/><path d="M57 65h42l13 48H43Z" fill="#bfced0"/><path d="M121 39v91H38M58 130v16M119 130v16" fill="none" stroke="#a4937e" stroke-width="8"/>')
put('bus','<rect x="21" y="28" width="138" height="99" rx="18" fill="#c3d1b9"/><path d="M31 46h42v38H31ZM83 46h35v38H83ZM128 46h21v67h-21" fill="#d8e7e5"/><circle cx="52" cy="128" r="16" fill="#9a8b78"/><circle cx="128" cy="128" r="16" fill="#9a8b78"/>')
put('get-off','<rect x="24" y="22" width="71" height="110" rx="8" fill="#c3d1b9"/><rect x="45" y="40" width="34" height="92" fill="#e9deca"/><path d="M75 100h76m-15-15 15 15-15 15" fill="none" stroke="#a29c6f" stroke-width="7"/>')
put('tramp','<path d="M31 44h61v53l20 15v24H29Z" fill="#b89778"/><path d="M43 58h35M43 74h35M43 90h35" fill="none"/><rect x="105" y="42" width="51" height="65" rx="12" fill="#b6c59e"/><path d="M115 41V28h29v13" fill="none"/>')
for name in ['none','no']:
 put(name,'<rect x="29" y="31" width="122" height="99" rx="12" fill="#f5ecda"/>'+label('0',90,105,65))
for name,negative in [('so',False),('too',False),('neither',True),('either',True)]:
 put(name,'<rect x="20" y="32" width="58" height="101" rx="9" fill="#d2dfc4"/><rect x="102" y="32" width="58" height="101" rx="9" fill="#c5d7df"/>'+ ('<path d="m33 60 32 44m0-44-32 44m82-44 32 44m0-44-32 44" stroke="#b98e7d"/>' if negative else '<path d="m31 85 13 16 22-38m47 22 13 16 22-38" fill="none" stroke="#80a17d" stroke-width="6"/>'))
put('except','<circle cx="43" cy="78" r="20" fill="#b8ccb1"/><circle cx="91" cy="78" r="20" fill="#b8ccb1"/><circle cx="141" cy="78" r="20" fill="#e4c58c"/><path d="M115 31v94" stroke-dasharray="4 8"/>')
put('any','<path d="M31 32h118v101H31Z" fill="#e7dfcb"/>'+label('?',90,107,70))
put('square','<path d="M83 32h14v79H83Z" fill="#b5b6a8"/><path d="M70 112h40v13H70M58 126h64v15H58" fill="#c7c6b4"/><circle cx="90" cy="22" r="10" fill="#9c9e91"/><path d="M20 145h140" fill="none"/>')
for name,source in [('pound','assets/unit111-112/pound.svg'),('chocolate','assets/unit109-110/chocolate.svg'),('biscuit','assets/unit109-110/biscuit.svg'),('task-record','assets/unit105-106/task-record.svg'),('task-checked','assets/unit105-106/task-checked.svg')]:shutil.copyfile(r/source,d/(name+'.svg'))
put('envelope','<rect x="22" y="40" width="136" height="86" rx="7" fill="#f5e9cd"/><path d="m23 42 67 49 67-49M23 125l47-43M157 125l-47-43" fill="none"/>')
put('cake','<path d="M31 66h119v67H31Z" fill="#d9b78b"/><path d="M31 66 88 28l62 38Z" fill="#edc5b4"/><path d="M31 92h119M31 111h119" stroke="#f7e6bb"/><circle cx="88" cy="38" r="10" fill="#c89183"/>')
for count in [0,2,4]:
 put('coins-'+str(count),'<rect x="13" y="16" width="154" height="127" rx="11" fill="#faf1d9"/>'+coins(count))
for total,count in [(10,5),(4,2),(6,3)]:
 put('exchange-'+str(total),coins(count,True))
(d/'bus-interior.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" preserveAspectRatio="none"><rect width="1000" height="720" fill="#eef1df"/><g fill="#d8e7df" stroke="#bdc6ac" stroke-width="7"><rect x="35" y="71" width="250" height="300" rx="35"/><rect x="375" y="71" width="250" height="300" rx="35"/><rect x="715" y="71" width="250" height="300" rx="35"/></g><path d="M0 505h1000v215H0Z" fill="#d4c7ad"/><g fill="#bfceba" stroke="#9fad97" stroke-width="5"><path d="M19 404h114v161H19Z"/><path d="M867 404h114v161H867Z"/></g><path d="M310 16v486M690 16v486M15 31h970" stroke="#c6b482" stroke-width="10"/><path d="M0 508h1000" stroke="#b7a888" stroke-width="6"/><ellipse cx="500" cy="647" rx="430" ry="51" fill="#e1d6bd"/></svg>\n',encoding='utf-8')
print('113–114 native vocabulary, zero/some coins and independently labelled £2 exchange candidates built.')
