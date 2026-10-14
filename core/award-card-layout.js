/* Shared keepsake typography and export. All artwork and identity remain caller-owned. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CanranAwardCardLayout = factory();
})(globalThis, function () {
  'use strict';
  const WIDTH = 1640, HEIGHT = 880;
  const starLayout = { starX: 90.2, starY: 624.8, starSize: 100, starStep: 123 };
  // Full-width glyph budgets also leave room for Latin names and punctuation.
  const fit = (value, maximum, area) => Math.min(maximum, area / Math.max(1, Array.from(value || '').length));
  // Limit the approved font study to this unit, including its album and exports.
  function fonts(unitId, roundFont = 'Award Round', latinFont = 'Baloo 2') {
    return ['unit45-46','unit47-48','unit49-50','unit51-52','unit53-54','unit55-56','unit57-58','unit59-60','unit61-62','unit63-64','unit65-66','unit67-68','unit69-70','unit71-72','unit73-74','unit75-76','unit77-78','unit79-80','unit81-82','unit83-84','unit85-86','unit87-88','unit89-90'].includes(unitId)
      ? { roundFont:'Award Gothic', latinFont:'Award Nunito', titleWeight:500, nameWeight:500, footWeight:600 }
      : { roundFont, latinFont, titleWeight:400, nameWeight:400, footWeight:500 };
  }
  async function prepareFonts(unitId, name = '', roundFont, latinFont) {
    const faces = fonts(unitId, roundFont, latinFont);
    await Promise.all([
      document.fonts.load(`400 24px "${faces.roundFont}"`, '灿然英语工作室'),
      document.fonts.load(`${faces.nameWeight} 24px "${faces.roundFont}"`, '沟通小能手' + name),
      document.fonts.load(`${faces.footWeight} 24px "${faces.latinFont}"`, 'Lesson 45–46 · 2026.10.12')
    ]);
  }
  function typography(title, name = '', unitId) {
    const faces = fonts(unitId);
    return {
      ...(['unit45-46','unit47-48','unit49-50','unit51-52','unit53-54','unit55-56','unit57-58','unit59-60','unit61-62','unit63-64','unit65-66','unit67-68','unit69-70','unit71-72','unit73-74','unit75-76','unit77-78','unit79-80','unit81-82','unit83-84','unit85-86','unit87-88','unit89-90'].includes(unitId) ? {
        '--award-round':'"Award Gothic","Award Round","Award Book",sans-serif',
        '--award-latin':'"Award Nunito",sans-serif',
        '--award-title-weight':faces.titleWeight,
        '--award-name-weight':faces.nameWeight,
        '--award-foot-weight':faces.footWeight
      } : {}),
      '--title-size': fit(title, 6.8, 37) + 'cqw',
      '--title-size-portrait': fit(title, 10, 86) + 'cqw',
      '--name-size': fit(name, 9.4, 37) + 'cqw',
      '--name-size-portrait': fit(name, 12, 84) + 'cqw'
    };
  }
  function draw({ title, name, lesson, color, stars, date, images, roundFont, latinFont, unitId }) {
    const faces = fonts(unitId, roundFont, latinFont);
    const { scene, paper, earned, empty } = images;
    const canvas = document.createElement('canvas'); canvas.width = WIDTH; canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); ctx.roundRect(8, 8, 1624, 864, 34); ctx.fillStyle = '#fffcf5'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = ctx.createPattern(paper, 'repeat'); ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Same 45–99% illustration region as the horizontal page card; never crop.
    const scale = Math.min(WIDTH * .54 / scene.naturalWidth, HEIGHT * .88 / scene.naturalHeight);
    ctx.drawImage(scene, WIDTH * .99 - scene.naturalWidth * scale, HEIGHT * .96 - scene.naturalHeight * scale, scene.naturalWidth * scale, scene.naturalHeight * scale);
    ctx.restore(); ctx.strokeStyle = '#4a3226'; ctx.lineWidth = 4; ctx.stroke();
    if (stars === 5) {
      ctx.beginPath(); ctx.roundRect(15, 15, 1610, 850, 29); ctx.strokeStyle = '#f4bd55'; ctx.lineWidth = 10; ctx.stroke();
      ctx.beginPath(); ctx.roundRect(23, 23, 1594, 834, 23); ctx.strokeStyle = '#ac741e'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    function text(value, y, size, ink, family = faces.roundFont, maxWidth = WIDTH * .37, weight = 400) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = `${weight} ${size}px "${family}", sans-serif`;
      while (ctx.measureText(value).width > maxWidth && size > 12) ctx.font = `${weight} ${--size}px "${family}", sans-serif`;
      ctx.fillStyle = ink; ctx.fillText(value, WIDTH * .055, y);
    }
    text('灿然英语工作室', HEIGHT * .10 + WIDTH * .022 * .7, WIDTH * .022, '#4a3226');
    const titleSize = fit(title, 6.8, 37) * WIDTH / 100;
    text(title, HEIGHT * .26 + titleSize * .575, titleSize, color || '#0b7399', faces.roundFont, WIDTH * .37, faces.titleWeight);
    text(name, HEIGHT * .585, fit(name, 9.4, 37) * WIDTH / 100, '#4a3226', faces.roundFont, WIDTH * .37, faces.nameWeight);
    for (let i = 0; i < 5; i++) ctx.drawImage(i < stars ? earned : empty, starLayout.starX + i * starLayout.starStep, starLayout.starY, starLayout.starSize, starLayout.starSize);
    text(lesson + (stars === 5 && date ? ' · ' + date : ''), HEIGHT * .94 - WIDTH * .022 * .825, WIDTH * .022, '#795a46', faces.latinFont, WIDTH * .38, faces.footWeight);
    return canvas;
  }
  return { typography, prepareFonts, draw, starLayout };
});
