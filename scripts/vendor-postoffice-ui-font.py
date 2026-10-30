"""Subset only the postal UI font; keep every original keepsake font intact.

Run with fonttools[woff]==4.66.1. All input font bytes are already pinned locally.
"""
from pathlib import Path
import hashlib
import json
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/awards/fonts/award-gothic-500.woff2'
OUT = ROOT / 'assets/awards/postoffice'
digest = lambda data: hashlib.sha256(data).hexdigest()

def main():
    pinned = json.loads((ROOT / 'assets/awards/fonts/sources.json').read_text(encoding='utf-8'))['outputs']['award-gothic-500.woff2']
    assert digest(SOURCE.read_bytes()) == pinned['sha256']
    files = sorted([*ROOT.glob('award-book/*.jsx'), *ROOT.glob('award-book/*.js'), *ROOT.glob('award-book/*.css'), ROOT / 'server/award-catalog.js'])
    inputs = {f.relative_to(ROOT).as_posix(): digest(f.read_text(encoding='utf-8-sig').replace('\r\n', '\n').encode()) for f in files}
    text = ''.join(f.read_text(encoding='utf-8-sig') for f in files) + ''.join(map(chr, range(32,127)))
    original = TTFont(SOURCE, recalcTimestamp=False)
    original_map = original.getBestCmap()
    needed = set(map(ord,text)) & set(original_map)
    font = TTFont(SOURCE, recalcTimestamp=False)
    worker = subset.Subsetter(options=subset.Options())
    worker.populate(unicodes=needed)
    worker.subset(font)
    family, style = 'Canran Postoffice UI', 'Medium'
    for record in font['name'].names:
        values = {1:family, 2:style, 3:family+'-'+style, 4:family+' '+style, 6:family.replace(' ','')+'-'+style, 16:family, 17:style}
        if record.nameID in values:
            record.string = values[record.nameID].encode(record.getEncoding())
    OUT.mkdir(exist_ok=True)
    target = OUT / 'postoffice-ui-500.woff2'
    font.flavor = 'woff2'
    font.save(target)
    result = TTFont(target)
    cmap = result.getBestCmap()
    assert needed <= set(cmap)
    old_shapes, new_shapes = original.getGlyphSet(), result.getGlyphSet()
    for cp in needed:
        old, new = original_map[cp], cmap[cp]
        left, right = DecomposingRecordingPen(old_shapes), DecomposingRecordingPen(new_shapes)
        old_shapes[old].draw(left); new_shapes[new].draw(right)
        assert left.value == right.value, cp
        assert original['hmtx'][old] == result['hmtx'][new], cp
    for prop in ['ascent','descent','lineGap']:
        assert getattr(original['hhea'], prop) == getattr(result['hhea'], prop)
    record = {'source':'../fonts/award-gothic-500.woff2','sourceSha256':pinned['sha256'],'license':'../fonts/LICENSE-ChillRoundGothic.txt','inputs':inputs,'characters':len(needed),'glyphOutlinesAndMetricsUnchanged':True,'bytes':target.stat().st_size,'sha256':digest(target.read_bytes()),'scope':'UI headings and catalog labels only; original personalized keepsake fonts remain complete.'}
    (OUT / 'ui-font-source.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({key:record[key] for key in ['characters','bytes','sha256','glyphOutlinesAndMetricsUnchanged']}))

if __name__ == '__main__':
    main()
