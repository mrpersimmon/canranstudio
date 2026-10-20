"""Build the scoped Lesson5–6 Regular supplement from the pinned local source.

Run after vendor-keepsake-fonts.py or on its own with the cached pinned font.
No change to shared font bytes. New names still use the complete name font.
"""
from pathlib import Path
import hashlib
import json
import runpy
from fontTools.ttLib import TTFont
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/unit5-6-current'

def main():
    helpers = runpy.run_path(str(ROOT / 'scripts/vendor-keepsake-fonts.py'))
    provenance = json.loads((ROOT / 'assets/awards/fonts/sources.json').read_text(encoding='utf-8'))
    source = ROOT / 'tmp/keepsake-fonts/gothic-regular.ttf'
    assert hashlib.sha256(source.read_bytes()).hexdigest() == provenance['sources']['gothic-regular.ttf']['sha256']
    files = [*sorted((ROOT / 'unit5-6').glob('*.js')), ROOT / 'unit5-6/index.html']
    inputs = {f.relative_to(ROOT).as_posix(): hashlib.sha256(f.read_bytes()).hexdigest() for f in files}
    required = set(''.join(f.read_text(encoding='utf-8') for f in files))
    font = TTFont(source, recalcTimestamp=False)
    cmap = set(font.getBestCmap())
    shared = set(TTFont(ROOT / 'assets/awards/fonts/lesson-gothic-body-400.woff2').getBestCmap())
    needed = (set(map(ord, required)) & cmap) - shared
    target = OUT / 'gothic-body-supplement.woff2'
    if target.exists():
        needed |= set(TTFont(target).getBestCmap())
    if not needed:
        return
    worker = subset.Subsetter(options=subset.Options()); worker.populate(unicodes=needed); worker.subset(font)
    helpers['align_line_metrics'](font); helpers['rename'](font, 'Canran Lesson56 Gothic', 'Regular')
    font.flavor = 'woff2'; OUT.mkdir(parents=True, exist_ok=True); font.save(target)
    covered = set(TTFont(target).getBestCmap()); assert needed <= covered
    css = "@font-face{font-family:'Lesson Gothic';src:url('gothic-body-supplement.woff2') format('woff2');font-style:normal;font-weight:400;font-display:block;unicode-range:" + ','.join('U+'+format(c,'04X') for c in sorted(covered)) + '}\n'
    (OUT / 'gothic-body-supplement.css').write_text(css, encoding='utf-8')
    result = {'source': provenance['sources']['gothic-regular.ttf'], 'license': '../awards/fonts/LICENSE-ChillRoundGothic.txt', 'inputs': inputs, 'characters': ''.join(map(chr,sorted(covered))), 'missingCharacters': len((set(map(ord,required)) & cmap) - shared - covered), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'bytes': target.stat().st_size}
    (OUT / 'font-source.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'supplementCharacters':len(covered),'missingCharacters':result['missingCharacters'],'bytes':result['bytes']}))

if __name__ == '__main__':
    main()
