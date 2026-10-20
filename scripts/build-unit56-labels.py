"""Keep original flag/car shapes; outline their labels with the lesson fonts."""
from pathlib import Path
import hashlib, json, re, html
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/unit5-6-current'
source=ROOT/'tmp/keepsake-fonts'
provenance=json.loads((ROOT/'assets/awards/fonts/sources.json').read_text(encoding='utf-8'))
for name in ['gothic-medium.ttf','nunito.ttf']:
    assert hashlib.sha256((source/name).read_bytes()).hexdigest()==provenance['sources'][name]['sha256']
fonts={'zh':TTFont(source/'gothic-medium.ttf'),'en':instantiateVariableFont(TTFont(source/'nunito.ttf'),{'wght':600},inplace=False)}
records=[]
for file in sorted((ROOT/'assets/unit5-6').glob('*.svg')):
    svg=file.read_text(encoding='utf-8')
    if '<text' not in svg: continue
    def outline(match):
        attrs=dict(re.findall(r'([\w-]+)="([^"]*)"',match[1]));label=html.unescape(match[2]);lang='zh' if any(ord(c)>127 for c in label) else 'en'
        font=fonts[lang];glyphs=font.getGlyphSet();cmap=font.getBestCmap();scale=float(attrs['font-size'])/font['head'].unitsPerEm
        advance=sum(font['hmtx'][cmap[ord(c)]][0] for c in label)*scale;x=float(attrs['x'])-advance/2;y=float(attrs['y']);paths=[]
        for c in label:
            name=cmap[ord(c)];pen=SVGPathPen(glyphs);glyphs[name].draw(TransformPen(pen,(scale,0,0,-scale,x,y)));paths.append(pen.getCommands());x+=font['hmtx'][name][0]*scale
        records.append({'file':file.name,'label':label,'font':'Gothic Medium 500' if lang=='zh' else 'Nunito SemiBold 600','originalSha256':hashlib.sha256(file.read_bytes()).hexdigest()})
        return '<g aria-label="'+html.escape(label,quote=True)+'" fill="'+attrs.get('fill','#4A3226')+'" stroke="none">'+''.join('<path d="'+p+'"/>' for p in paths)+'</g>'
    svg=re.sub(r'<text\b([^>]*)>(.*?)</text>',outline,svg)
    (OUT/(file.stem+'-v154.svg')).write_text(svg,encoding='utf-8')
(OUT/'label-sources.json').write_text(json.dumps({'generator':'scripts/build-unit56-labels.py','sourceFonts':{k:provenance['sources'][k] for k in ['gothic-medium.ttf','nunito.ttf']},'labels':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'outlinedLabels':len(records),'originalFilesUntouched':True}))
