from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlsplit,unquote
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import json, hashlib
R=Path(__file__).resolve().parent.parent
rd=lambda f:json.loads((R/f).read_text())
old=rd('evidence-assets.json')+rd('root-english-assets.json');lookup={x['url']:x for x in old if x.get('url')}
requested={}
def add(url,source='',**m):
 if not url or '.pdf' in url:return
 requested.setdefault(url,dict(url=url,sourcePage=source,**m))
c=rd('english-core.json');s={x['id']:x['url'] for x in c['sources']}
for x in c['media']:add(x['url'],s[x['source_ids'][0]],label=x['description'],courseDirection=x['course_direction'],interfaceLanguage=x['interface_language'],framing=x['coverage'],visualReview='agent-reviewed',note=x['limitations'])
l=rd('english-sounds-and-scope.json');s={x['id']:x['url'] for x in l['sources']}
for x in l['assets']:add(x['url'],s[x['source_ids'][0]],label=x['label'],courseDirection='target-English',interfaceLanguage=x['interface_language'],framing=x['framing'],visualReview=x['verification'],note=x['notes'],local_file=x.get('local_file'))
for x in rd('root-english-assets.json'):requested[x['url']]=x
if (R/'english-advanced.json').exists():
 a=rd('english-advanced.json')
 for x in a['image_evidence']:
  add(x['original_image_url'],x['source_url'],label=x['description_zh'],courseDirection=x['course_native_language']+'→English',interfaceLanguage=x['ui_language'],framing=x['framing'],visualReview='agent-reviewed',note=x['visible_top_controls_zh']+' '+x['visible_bottom_controls_zh']+' '+x['target_language_basis_zh'])
def fetch(a):
 u=a['url']; prior=lookup.get(u,{})
 f=a.get('local_file') or a.get('file') or prior.get('file')
 if not f:
  ext=Path(unquote(urlsplit(u).path)).suffix.lower()
  if ext not in ['.png','.jpg','.jpeg','.gif','.webp']:ext='.png'
  f='assets/english-'+hashlib.sha256(u.encode()).hexdigest()[:12]+ext
 if not (R/f).exists(): (R/f).write_bytes(urlopen(u).read())
 b=(R/f).read_bytes(); im=Image.open(R/f)
 return dict(**a,file=f,width=im.width,height=im.height,sha256=hashlib.sha256(b).hexdigest(),retrievedOn='2026-09-27',bytes=len(b)) if 'file' not in a and 'sha256' not in a else dict(a,file=f,width=im.width,height=im.height,sha256=hashlib.sha256(b).hexdigest(),retrievedOn='2026-09-27',bytes=len(b))
rows=list(ThreadPoolExecutor(8).map(fetch,requested.values()))
(R/'english-assets.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('Collected',len(rows),'English evidence assets')
