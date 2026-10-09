from pathlib import Path
from fontTools import subset
root = Path(__file__).resolve().parents[1]
repo = root.parents[1]
text = ''.join(p.read_text() for p in (root/'src').glob('*') if p.suffix in ['.jsx','.css'])
options=subset.Options()
options.flavor='woff2'
options.layout_features=['*']
font=subset.load_font(str(repo/'assets/awards/award-round.woff2'), options)
subsetter=subset.Subsetter(options=options)
subsetter.populate(text=text + ''.join(chr(i) for i in range(32,127)) + '–·')
subsetter.subset(font)
# A demo-only subset, not a replacement for fonts covering real student names.
subset.save_font(font,str(root/'src/assets/award-book-subset.woff2'),options)
print((root/'src/assets/award-book-subset.woff2').stat().st_size)
