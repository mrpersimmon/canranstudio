"""Build the Lesson 45–90 fonts from pinned, OFL-licensed sources.

Run: uv run --with 'fonttools[woff]==4.66.1' python scripts/vendor-keepsake-fonts.py
Static brand/body text is subset. The name font retains the source cmap.
"""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
from fontTools.ttLib import TTFont
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
TEMP = ROOT / "tmp/keepsake-fonts"
OUT = ROOT / "assets/awards/fonts"
CHILL = "53505f0818983d2fcdda00dc66e051ad13e81ffb"
GOOGLE = "bd8f81ddb5c74d5c8897b36ad88b440266245103"
SOURCES = {
    "gothic-regular.ttf": f"https://raw.githubusercontent.com/Warren2060/ChillRoundGothic/{CHILL}/ttf/ChillRoundGothic_Regular.ttf",
    "gothic-medium.ttf": f"https://raw.githubusercontent.com/Warren2060/ChillRoundGothic/{CHILL}/ttf/ChillRoundGothic_Medium.ttf",
    "nunito.ttf": f"https://raw.githubusercontent.com/google/fonts/{GOOGLE}/ofl/nunito/Nunito%5Bwght%5D.ttf",
    "LICENSE-ChillRoundGothic.txt": f"https://raw.githubusercontent.com/Warren2060/ChillRoundGothic/{CHILL}/License.txt",
    "LICENSE-Nunito.txt": f"https://raw.githubusercontent.com/google/fonts/{GOOGLE}/ofl/nunito/OFL.txt",
}
LESSON_TEXT = [
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit45-46").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit47-48").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit49-50").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit51-52").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit53-54").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit55-56").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit57-58").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit59-60").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit61-62").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit63-64").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit65-66").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit67-68").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit69-70").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit71-72").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit73-74").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit75-76").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit77-78").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit79-80").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit81-82").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit83-84").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit85-86").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit87-88").glob("*.js")),
    *sorted(str(file.relative_to(ROOT)) for file in (ROOT / "unit89-90").glob("*.js")),
    "unit89-90/index.html", "unit87-88/index.html", "unit85-86/index.html", "unit83-84/index.html", "unit81-82/index.html", "unit79-80/index.html", "unit77-78/index.html", "unit75-76/index.html", "unit73-74/index.html", "unit71-72/index.html", "unit69-70/index.html", "unit67-68/index.html", "unit65-66/index.html", "unit63-64/index.html", "unit61-62/index.html", "unit59-60/index.html", "unit57-58/index.html", "unit55-56/index.html", "unit53-54/index.html", "unit51-52/index.html", "unit49-50/index.html", "unit47-48/index.html", "unit45-46/index.html", "core/lesson49-practice.js",
    "core/lesson49-task-inputs.js", "core/lesson49-feedback.js",
    "core/award-reveal.js", "core/story-certificate.js", "core/course-loader.js",
    "unit1-2/grammar.js", "unit1-2/completion.js", "server/public/access-client.js",
]


def rename(font, family, style):
    # Distinguish the locally packaged derivative from upstream releases.
    for record in font["name"].names:
        names = {1: family, 2: style, 3: family + "-" + style,
                 4: family + " " + style, 6: family.replace(" ", "") + "-" + style,
                 16: family, 17: style}
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())


def align_line_metrics(font):
    # Chill's hhea metrics include extra vertical space (1160/-288), while
    # its intended typographic line is 880/-120. Browsers otherwise measure
    # a 1.448em text box inside a 1.1em name row. Use the font's own typo
    # metrics consistently; retain all outlines and Windows clipping bounds.
    typo, horizontal = font["OS/2"], font["hhea"]
    horizontal.ascent = typo.sTypoAscender
    horizontal.descent = typo.sTypoDescender
    horizontal.lineGap = typo.sTypoLineGap
    typo.fsSelection |= 1 << 7  # USE_TYPO_METRICS


def main():
    TEMP.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    source_records, outputs = {}, {}
    prior = json.loads((OUT / "sources.json").read_text()) if (OUT / "sources.json").exists() else {}
    for name, url in SOURCES.items():
        file = TEMP / name
        data = file.read_bytes() if file.exists() else b""
        cached = prior.get("sources", {}).get(name, {})
        if cached.get("url") != url or hashlib.sha256(data).hexdigest() != cached.get("sha256"):
            data = urlopen(url, timeout=90).read()
        file.write_bytes(data)
        source_records[name] = {"url": url, "sha256": hashlib.sha256(data).hexdigest()}
        if name.startswith("LICENSE-"):
            (OUT / name).write_bytes(data)
    for source, target, family, style, label in [
        ("gothic-regular.ttf", "award-gothic-brand-400.woff2", "Canran Award Gothic", "Regular", "灿然英语工作室"),
        ("gothic-medium.ttf", "award-gothic-500.woff2", "Canran Award Gothic", "Medium", None),
        ("nunito.ttf", "award-nunito.woff2", "Canran Award Nunito", "Regular", None),
        ("gothic-regular.ttf", "lesson-gothic-body-400.woff2", "Canran Lesson Gothic", "Regular",
         "".join((ROOT / file).read_text() for file in LESSON_TEXT)),
    ]:
        font = TTFont(TEMP / source, recalcTimestamp=False)
        original_cmap = set(font.getBestCmap())
        if label:
            options = subset.Options()
            worker = subset.Subsetter(options=options)
            worker.populate(text=label)
            worker.subset(font)
        else:
            assert set(font.getBestCmap()) == original_cmap
        if source.startswith("gothic-"):
            align_line_metrics(font)
        rename(font, family, style)
        font.flavor = "woff2"
        output = OUT / target
        font.save(output)
        verified = TTFont(output)
        if not label:
            assert set(verified.getBestCmap()) == original_cmap
        outputs[target] = {"source": source, "bytes": output.stat().st_size,
                           "characters": len(verified.getBestCmap()),
                           "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
        print(target, outputs[target])
    text_inputs = {file: hashlib.sha256((ROOT / file).read_bytes()).hexdigest() for file in LESSON_TEXT}
    (OUT / "sources.json").write_text(json.dumps({"sources": source_records, "outputs": outputs,
                                               "body_text_inputs": text_inputs}, indent=2) + "\n")


if __name__ == "__main__":
    main()
