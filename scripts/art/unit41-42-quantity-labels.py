"""Preserve the original fraction drawings; outline their labels in local Nunito."""
from pathlib import Path
import re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[2]
for name, weight in [('pound', 600), ('half', 400), ('quarter', 400)]:
    font = TTFont(root / 'tmp/keepsake-fonts/nunito.ttf')
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': weight})
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    source = (root / f'assets/unit41-42/{name}.svg').read_text(encoding='utf-8')
    def outline(match):
        attrs, text = match.groups()
        values = dict(re.findall(r'([\w-]+)="([^"]*)"', attrs))
        # Numeric labels stay legible in 80–96px classroom diagrams.
        scale = {'pound': 30, 'half': 28, 'quarter': 28}[name] / font['head'].unitsPerEm
        advance = sum(glyphs[cmap[ord(char)]].width for char in text)
        x, y = float(values['x']), float(values['y'])
        if values.get('text-anchor') == 'middle':
            x -= advance * scale / 2
        parts, cursor = [], 0
        for char in text:
            glyph = glyphs[cmap[ord(char)]]
            pen = SVGPathPen(glyphs)
            glyph.draw(pen)
            parts.append(f'<path transform="translate({cursor} 0)" d="{pen.getCommands()}"/>')
            cursor += glyph.width
        return f'<g fill="#4a3226" stroke="none" transform="translate({x} {y}) scale({scale} {-scale})">'+''.join(parts)+'</g>'
    output = re.sub(r'<text([^>]*)>([^<]*)</text>', outline, source)
    (root / f'assets/unit41-42/{name}-v153.svg').write_text(output, encoding='utf-8')
