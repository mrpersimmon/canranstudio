"""Outline current diagram labels with the project's licensed local fonts.

Run after regenerating the listed diagrams. Existing paths, values, viewBoxes
and non-text artwork stay intact, so presentation changes do not alter saved
question signatures. Historical certificate art is outside this manifest.
"""
from pathlib import Path
import argparse, copy, hashlib, json, re
from lxml import etree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parents[2]
NS = 'http://www.w3.org/2000/svg'
FONT_PATHS = {
    'nunito': ROOT / 'assets/awards/fonts/award-nunito.woff2',
    'gothic400': ROOT / 'assets/awards/fonts/lesson-gothic-body-400.woff2',
    'gothic500': ROOT / 'assets/awards/fonts/award-gothic-500.woff2',
}
# Keep clear insets inside the original calendar/sign frames. These limits
# only fit long labels; the frame, anchor, value and baseline do not move.
WIDTH_LIMITS = {
    ('assets/unit67-68/weekend.svg','Sat · Sun'): 88,
    ('assets/unit67-68/last-week.svg','−1 week'): 88,
    ('assets/unit67-68/were.svg','we · you'): 88,
    ('assets/unit89-90/sale.svg','FOR SALE'): 58,
}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def inherited(element):
    result = {}
    for node in [*reversed(list(element.iterancestors())), element]:
        result.update(node.attrib)
        result.update(dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)', node.get('style', ''))))
    return result

def artwork_hash(tree):
    plain=copy.deepcopy(tree)
    for node in list(plain.iter()):
        if node.tag=='{'+NS+'}text' or node.get('data-label') is not None:
            node.getparent().remove(node)
    for node in plain.iter():
        for key in ['font-family','font-size','font-weight','text-anchor']:
            node.attrib.pop(key,None)
    return digest(ET.tostring(plain,method='c14n'))

def outline_file(file, fonts, glyph_cache, apply):
    original = file.read_bytes()
    tree = ET.fromstring(original)
    entries = []
    original_artwork=artwork_hash(tree)
    for element in list(tree.iter('{'+NS+'}text')):
        if len(element):
            raise ValueError(f'Nested SVG text needs explicit review: {file}')
        text = element.text or ''
        style = inherited(element)
        size = float(style.get('font-size', '16').removesuffix('px'))
        weight = 600 if style.get('font-weight','400') in ['bold','600','700','800','900'] else 400
        x, y = float(element.get('x','0')), float(element.get('y','0'))
        glyph_runs, advance, bounds = [], 0.0, []
        for char in text:
            cjk = bool(re.match(r'[\u2e80-\u9fff\uff00-\uffef]', char))
            key = ('gothic500' if weight == 600 else 'gothic400') if cjk else 'nunito'
            font = fonts[key]
            cmap = font.getBestCmap()
            if ord(char) not in cmap:
                raise ValueError(f'Missing {char!r} in {key}: {file}')
            glyphs = glyph_cache[(key,weight)]
            glyph = glyphs[cmap[ord(char)]]
            scale = size / font['head'].unitsPerEm
            pen, box = SVGPathPen(glyphs), BoundsPen(glyphs)
            glyph.draw(pen); glyph.draw(box)
            glyph_runs.append((advance, scale, pen.getCommands(), key))
            if box.bounds:
                a,b,c,d = box.bounds
                bounds.append((advance+a*scale, -d*scale, advance+c*scale, -b*scale))
            advance += glyph.width * scale
        limit=WIDTH_LIMITS.get((file.relative_to(ROOT).as_posix(),text))
        fit=min(1,limit/advance) if limit and advance else 1
        if fit<1:
            glyph_runs=[(offset*fit,scale*fit,d,key) for offset,scale,d,key in glyph_runs]
            bounds=[tuple(value*fit for value in box) for box in bounds]
            advance*=fit
        anchor = style.get('text-anchor','start')
        left = x - (advance/2 if anchor == 'middle' else advance if anchor == 'end' else 0)
        group = ET.Element('{'+NS+'}g')
        for k,v in element.attrib.items():
            if k not in ['x','y','font-family','font-size','font-weight','text-anchor']:
                group.set(k,v)
        group.set('data-label',text)
        group.set('aria-label',text)
        for offset,scale,d,key in glyph_runs:
            if not d:
                continue
            glyph_node = ET.SubElement(group,'{'+NS+'}path')
            glyph_node.set('d',d)
            glyph_node.set('transform',f'translate({left+offset:.6f} {y:g}) scale({scale:.8f} {-scale:.8f})')
            glyph_node.set('data-font',('Nunito '+str(weight)) if key=='nunito' else ('Chill Round Gothic '+('500' if key.endswith('500') else '400')))
        group.tail = element.tail
        element.getparent().replace(element,group)
        entries.append({'text':text,'size':size*fit,'originalSize':size,'widthLimit':limit,'fonts':sorted(set(key for _,_,_,key in glyph_runs)), 'bounds': [min(b[0] for b in bounds)+left,min(b[1] for b in bounds)+y,max(b[2] for b in bounds)+left,max(b[3] for b in bounds)+y] if bounds else None})
    if entries:
        for node in tree.iter():
            for key in ['font-family','font-size','font-weight','text-anchor']:
                node.attrib.pop(key,None)
    if artwork_hash(tree)!=original_artwork:
        raise ValueError(f'Non-text drawing changed: {file}')
    output = ET.tostring(tree,encoding='utf-8')+b'\n' if entries else original
    if apply and entries:
        file.write_bytes(output)
    return {'path':file.relative_to(ROOT).as_posix(),'before':digest(original),'after':digest(output),'artworkHash':original_artwork,'labels':entries}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--apply',action='store_true')
    parser.add_argument('--report',type=Path)
    args=parser.parse_args()
    files=json.loads((Path(__file__).with_name('course-diagram-fonts.json')).read_text('utf-8'))
    fonts={key:TTFont(file) for key,file in FONT_PATHS.items()}
    glyph_cache={(key,weight):font.getGlyphSet(location={'wght':weight}) if 'fvar' in font else font.getGlyphSet() for key,font in fonts.items() for weight in [400,600]}
    records=[outline_file(ROOT/file,fonts,glyph_cache,args.apply) for file in files]
    report={'applied':args.apply,'fonts':{key:{'path':file.relative_to(ROOT).as_posix(),'sha256':digest(file.read_bytes())} for key,file in FONT_PATHS.items()},'files':records}
    if args.report:
        args.report.parent.mkdir(parents=True,exist_ok=True)
        args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
    print(json.dumps({'files':len(records),'changed':sum(bool(r['labels']) for r in records),'labels':sum(len(r['labels']) for r in records),'applied':args.apply}))

if __name__=='__main__':
    main()
