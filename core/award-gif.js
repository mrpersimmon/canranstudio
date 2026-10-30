/* Local-only, bounded animated keepsake export. No student data leaves the device. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./vendor/gifenc.js'));
  else root.CanranAwardGif = factory(root.CanranGif);
})(globalThis, function (codec) {
  'use strict';
  const WIDTH = 984, HEIGHT = 528, FRAMES = 60, DELAY = 80;
  const GOLD = [[0,'#d7962e'],[40,'#edba52'],[58,'#ffe7a1'],[70,'#fffde5'],[81,'#ffe098'],[105,'#dca33b'],[170,'#b97922'],[220,'#eeb94c'],[247,'#fff5cf'],[275,'#e3a33d'],[325,'#b97922'],[360,'#d7962e']];
  const yieldToPage = () => new Promise(resolve => setTimeout(resolve, 0));
  function surface(width, height) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; return canvas;
  }
  function glint(ctx, x, y, size, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#fffce8'; ctx.shadowColor = '#ffda75'; ctx.shadowBlur = 5;
    ctx.beginPath();
    for (const [i, [dx, dy]] of [[0,-1],[.18,-.2],[.75,0],[.18,.2],[0,1],[-.18,.2],[-.75,0],[-.18,-.2]].entries()) {
      ctx[i ? 'lineTo' : 'moveTo'](x + dx * size, y + dy * size);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function starLight(ctx, image, mask, point, index, time) {
    const { x, y, size } = point, phase = (time / 4800 + index / 15) % 1;
    const pulse = .22 + .78 * Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2)), 3);
    ctx.save();
    const halo = ctx.createRadialGradient(x + size/2, y + size/2, size*.15, x + size/2, y + size/2, size*.73);
    halo.addColorStop(0, '#ffd86535'); halo.addColorStop(1, '#ffd86500');
    ctx.fillStyle = halo; ctx.fillRect(x - size*.23, y - size*.23, size*1.46, size*1.46);
    if (phase < .44) {
      const paint = mask.getContext('2d'); paint.clearRect(0, 0, size, size);
      const band = (phase / .44 * 2 - .5) * size;
      const gradient = paint.createLinearGradient(band - size*.38, 0, band + size*.12, size);
      gradient.addColorStop(0, '#fff7c600'); gradient.addColorStop(.38, '#fff7c650');
      gradient.addColorStop(.5, '#fffdf5dd'); gradient.addColorStop(.62, '#ffeaa560'); gradient.addColorStop(1, '#ffeaa500');
      paint.fillStyle = gradient; paint.fillRect(0, 0, size, size);
      paint.globalCompositeOperation = 'destination-in'; paint.drawImage(image, 0, 0, size, size);
      paint.globalCompositeOperation = 'source-over'; ctx.drawImage(mask, x, y);
    }
    glint(ctx, x + size*.74, y + size*.24, size*(.12 + pulse*.05), pulse);
    glint(ctx, x + size*.21, y + size*.8, size*(.07 + pulse*.025), pulse*.82);
    ctx.restore();
  }
  function goldRim(ctx, time) {
    const angle = time / (FRAMES * DELAY) * Math.PI * 2;
    const gradient = ctx.createConicGradient(angle, 820, 440);
    for (const [degrees, color] of GOLD) gradient.addColorStop(degrees / 360, color);
    ctx.save(); ctx.beginPath(); ctx.roundRect(9.5, 9.5, 1621, 861, 24.5);
    ctx.strokeStyle = gradient; ctx.lineWidth = 11; ctx.stroke(); ctx.restore();
  }
  async function encode(canvas, { stars, earnedImage, starX = 85, starY = 593, starSize = 101, starStep = 126, signal } = {}) {
    if (!codec || stars < 1 || stars > 5) throw new Error('Keepsake is not ready');
    const output = surface(WIDTH, HEIGHT), ctx = output.getContext('2d', { willReadFrequently: true });
    const mask = surface(starSize, starSize), scale = WIDTH / 1640;
    const frame = time => {
      // Preserve the card's actual alpha. An opaque matte here permanently
      // bakes pale corners/strips into the downloaded file, regardless of CSS.
      ctx.clearRect(0, 0, WIDTH, HEIGHT); ctx.drawImage(canvas, 0, 0, WIDTH, HEIGHT);
      ctx.save(); ctx.scale(scale, scale);
      for (let i = 0; i < stars; i++) starLight(ctx, earnedImage, mask, { x: starX + i*starStep, y: starY, size: starSize }, i, time);
      if (stars === 5) goldRim(ctx, time);
      ctx.restore();
      return ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
    };
    await yieldToPage(); signal?.throwIfAborted();
    // One fixed palette preserves the text/paper colors between frames.
    const first = frame(0), palette = codec.quantize(first, 224);
    for (const [, hex] of GOLD) palette.push([1,3,5].map(start => parseInt(hex.slice(start, start+2), 16)));
    palette.push([255,252,232], [255,253,245], [255,234,165]);
    // Index 0 also matches the GIF logical-screen background. Opaque black
    // and white remain ordinary palette colors; never use color-key removal.
    const transparentIndex = 0, gifPalette = [[0,0,0], ...palette];
    const gif = codec.GIFEncoder(); let previous, previousSource;
    for (let index = 0; index < FRAMES; index++) {
      signal?.throwIfAborted();
      const rgba = index === 0 ? first : frame(index * DELAY);
      const source = new Uint32Array(rgba.buffer, rgba.byteOffset, rgba.byteLength / 4);
      const pixels = codec.applyPalette(rgba, palette);
      // GIF has one-bit transparency. Threshold the un-matted source alpha
      // so antialiased rounded edges cannot acquire a white fringe.
      for(let i=0;i<pixels.length;i++)pixels[i]=rgba[i*4+3]<128?transparentIndex:pixels[i]+1;
      // The encoder's RGB565 cache uses the first encountered color in each
      // bucket. A moving rim can change that choice for otherwise static text.
      // Keep the prior palette index wherever the actual source pixel is fixed.
      if (previous) for (let i = 0; i < pixels.length; i++) {
        if (source[i] === previousSource[i]) pixels[i] = previous[i];
      }
      const delta = pixels.slice();
      if (previous) for (let i = 0; i < delta.length; i++) if (pixels[i] === previous[i]) delta[i] = transparentIndex;
      gif.writeFrame(delta, WIDTH, HEIGHT, { palette: index === 0 ? gifPalette : undefined, delay: DELAY,
        repeat: 0, dispose: 1, transparent: true, transparentIndex });
      previous = pixels;
      previousSource = source;
      // Encode one frame at a time; neither 60 RGBA frames nor a background
      // server job is retained. Yield so close/back controls remain responsive.
      await yieldToPage();
    }
    gif.finish(); return new Blob([gif.bytesView()], { type: 'image/gif' });
  }
  return { encode };
});
