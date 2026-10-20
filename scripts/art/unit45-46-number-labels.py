"""Outline the two vocabulary number labels in local Nunito; retain old SVGs."""
from pathlib import Path
import re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont
root=Path(__file__).resolve().parents[2]
font=TTFont(root/'tmp/keepsake-fonts/nunito.ttf')
if 'fvar' in font: font=instantiateVariableFont(font,{'wght':400})
glyphs,cmap=font.getGlyphSet(),font.getBestCmap()
for name,size in [('thousand',32),('million',28)]:
    source=(root/f'assets/unit45-46/{name}.svg').read_text(encoding='utf-8')
    def outline(match):
        attrs,text=match.groups();values=dict(re.findall(r'([\w-]+)="([^"]*)"',attrs));scale=size/font['head'].unitsPerEm
        advance=sum(glyphs[cmap[ord(c)]].width for c in text);x=float(values['x'])-advance*scale/2;y=float(values['y']);parts=[];cursor=0
        for c in text:
            glyph=glyphs[cmap[ord(c)]];pen=SVGPathPen(glyphs);glyph.draw(pen);parts.append(f'<path transform="translate({cursor} 0)" d="{pen.getCommands()}"/>');cursor+=glyph.width
        return f'<g fill="#513b30" stroke="none" transform="translate({x} {y}) scale({scale} {-scale})">'+''.join(parts)+'</g>'
    (root/f'assets/unit45-46/{name}-v153.svg').write_text(re.sub(r'<text([^>]*)>([^<]*)</text>',outline,source),encoding='utf-8')
