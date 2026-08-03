# Lesson 51 landmark assets

This folder contains the approved layered landmark set for Lesson 51「希腊四季之旅」. The catalog and map renderer use the base plus independent completed-stage layers; Lesson 49 continues to use its cumulative snapshot contract.

## Rendering order

Render every file on the same fixed `1024 × 1024` canvas without per-file cropping or automatic fitting:

1. `landmark-base.png` — quiet Greek coastal climate garden with an ivory temple and blue-domed pavilion;
2. `growth-01-weather.png` — weather instrument for「单词行囊」;
3. `growth-02-theatre.png` — semicircular dialogue theatre for「课文剧场」;
4. `growth-03-seasons.png` — four Mediterranean seasonal planting clusters for「月份归队」;
5. `growth-04-sundial.png` — twelve-part month sundial and three-step frequency marker for「频率阶梯」;
6. `growth-05-celebration.png` — blue-and-white bunting, fountain, and warm lanterns for「导游考核」.

`four-seasons-guide-compass.png` is the permanent story souvenir. It appears only after all five stages are complete and is intentionally absent from `growth-05-celebration.png`.

`mobile-preview.png` is the fixed-size cumulative preview used by the map recommendation card. It is composited from the base and all five approved layers, and is not used as a growth state.

## ImageGen prompt set

All images were generated with the built-in ImageGen path. The approved visual anchor is `docs/designs/adventure-map/lesson51-dual-state-anchor.png`; its complete prompt is recorded in `docs/designs/adventure-map/lesson51-dual-state-anchor-prompt-v1.md`. The Lesson 49 production set supplied the shared asset contract and watercolor treatment.

Shared prompt contract:

- children's storybook watercolor and gouache with restrained brown ink contours;
- Aegean blue, sun-warmed ivory limestone, olive green, muted terracotta, and antique gold;
- slightly elevated three-quarter view with consistent warm Mediterranean daylight;
- one requested asset group only on a perfectly uniform `#ff00ff` background;
- no text, letters, numbers, people, characters, UI, logos, watermarks, cast shadows, or unrelated growth milestones;
- the base keeps the cream die-cut outer silhouette; incremental layers do not keep independent cream sticker borders.

Asset-specific requests:

- Base: recreate only the unstarted left climate garden from the approved anchor.
- Layer 1: isolate an antique-brass sun, wind, cloud, and moon weather instrument above the blue dome.
- Layer 2: isolate one low semicircular limestone theatre with restrained blue tile accents.
- Layer 3: isolate four separated spring, summer, autumn, and mild-winter Mediterranean planting clusters.
- Layer 4: isolate a twelve-part blue-and-ivory sundial mosaic with a compact three-step frequency marker.
- Layer 5: isolate blue-and-white bunting, a modest fountain, and four warm lantern posts; do not include the souvenir.
- Souvenir: isolate one gold and Aegean-blue guide compass with four seasonal emblems, olive branches, and a blue-and-white ribbon.

## Post-processing and checks

The generated chroma-key sources were converted with the installed ImageGen `remove_chroma_key.py` helper using border auto-key sampling, soft matte, and despill. The isolated components were proportionally scaled and positioned on identical canvases. Independent cream component borders were removed locally so the layers integrate with the base instead of appearing as separate stickers.

Validation confirmed:

- every runtime file is `1024 × 1024` RGBA;
- all four corners are fully transparent;
- no visible magenta-like pixels remain;
- every visible bounding box remains inside the fixed canvas;
- the six cumulative states stay coherent and readable at contact-sheet/mobile-thumbnail scale;
- the guide compass remains a separate asset and is not baked into any growth layer.

The visual QA sheet is `docs/designs/adventure-map/lesson51-growth-contact-sheet.png`, ordered left-to-right as states 0–2 on the first row and states 3–5 on the second row.
