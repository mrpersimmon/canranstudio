(function attach(root, factory) {
  'use strict';
  (root.CanranCore ||= {}).learningMedia = factory(root);
})(globalThis, function (global) {
  'use strict';
  function createPreparation(unit) {
    const players = new Map(), images = new Map();
    function audio(src) {
      if (players.has(src)) return players.get(src).ready;
      const player = global.__coursePackage?.takePreparedAudio(src) || new global.Audio(src);
      player.preload = 'auto';
      const entry = { player, ready: null, cancel: null, done: false }; players.set(src, entry);
      entry.ready = new Promise((resolve, reject) => {
        let settled = false;
        const done = error => {
          if (settled) return; settled = true;
          global.clearTimeout(timer);
          player.removeEventListener('canplay', loaded); player.removeEventListener('error', failed);
          if (error) { players.delete(src); reject(error); } else { entry.done = true; resolve(player); }
        };
        const loaded = () => done(), failed = () => done(new Error('Recording is not playable'));
        entry.cancel = failed;
        const timer = global.setTimeout(failed, 15000);
        player.addEventListener('canplay', loaded); player.addEventListener('error', failed);
        try { if (player.readyState >= 3) loaded(); else player.load(); } catch { failed(); }
      });
      return entry.ready;
    }
    function takeAudio(src) {
      const player = players.get(src)?.player || new global.Audio(src);
      player.currentTime = 0;
      return player;
    }
    function windowResources(view, count = 2) {
      const story = unit.activities[view.storyActivityId];
      const resources = resourcesFor(view, true, count);
      return story ? [...resources.filter(src => !src.endsWith('.mp3')), ...story.beats.slice(view.storyIndex).filter(beat => beat.ref).slice(0, count).map(beat => unit.sources[beat.ref].audioSrc)] : resources;
    }
    function ready(view) {
      return windowResources(view, 1).every(src => src.endsWith('.mp3')
        ? players.get(src)?.done && players.get(src).player.readyState >= 3 : images.get(src)?.done);
    }
    async function warm(view) {
      const resources = windowResources(view), imageUrls = resources.filter(src => !src.endsWith('.mp3')), urls = resources.filter(src => src.endsWith('.mp3'));
      const keep = new Set(urls);
      for (const [src, entry] of players) if (!keep.has(src)) {
        entry.cancel(); players.delete(src); entry.player.pause(); entry.player.removeAttribute('src'); entry.player.load();
      }
      for (const src of images.keys()) if (!imageUrls.includes(src)) images.delete(src);
      await Promise.all([...urls.map(audio), ...imageUrls.map(src => {
        if (!images.has(src)) {
          const image = new global.Image(); image.src = src;
          const entry = { image, ready: null, done: false };
          entry.ready = image.decode().then(() => { entry.done = true; }).catch(error => { if (images.get(src) === entry) images.delete(src); throw error; });
          images.set(src, entry);
        }
        return images.get(src).ready;
      })]);
    }
    function resourcesFor(view, currentAndNext = false, count = 2) {
      const urls = new Set(), visited = new Set();
      function collect(value) {
        if (typeof value === 'string') {
          if (unit.entities[value]) urls.add(unit.entities[value].assetSrc);
          if (unit.sources[value]?.audioSrc) urls.add(unit.sources[value].audioSrc);
          if (unit.activities[value] && !visited.has(value)) {
            visited.add(value); collect(unit.activities[value]);
          }
        } else if (value && typeof value === 'object') Object.values(value).forEach(collect);
      }
      if (view.screen === 'references') {
        const refs = unit.referenceGroups.find(group => group.id === view.referenceGroupId)?.sourceRefs || [];
        const index = Math.max(0, refs.indexOf(view.audio?.sequence[view.audio.index]?.ref));
        collect(currentAndNext ? refs.slice(index, index + count) : refs);
      } else if (view.mode === 'review') {
        const ids = currentAndNext ? view.mediaActivityIds.slice(view.mediaActivityIndex, view.mediaActivityIndex + count) : view.mediaActivityIds;
        for (const id of ids) collect(id.startsWith('retrieval:')
          ? global.CanranCore.learningChallenges.reviewQuestion(unit, view.record.retrievalReviews[id.slice(10)]) : id);
      } else if (view.screen === 'placement') {
        const ids = currentAndNext ? view.placementAttempt.questionIds.slice(view.placementIndex, view.placementIndex + count) : view.placementAttempt.questionIds;
        for (const id of ids) collect(unit.placement.questions.find(q => q.id === id));
      } else if (view.screen === 'challenge') {
        const questions = unit.challenges.find(challenge => challenge.id === view.challengeId)?.questions || [];
        collect(currentAndNext ? questions.slice(view.challengeIndex, view.challengeIndex + count) : questions);
      } else {
        const ids = unit.nodes.find(node => node.id === view.nodeId)?.activityIds || [view.activityId];
        const index = Math.max(0, ids.indexOf(view.activityId));
        collect(currentAndNext ? ids.slice(index, index + count) : ids);
      }
      return [...urls];
    }
    async function prepare(view, onProgress, signal, { background = false } = {}) {
      const urls = resourcesFor(view);
      const optional = new Set([
        ...Object.values(unit.feedbackSounds || {}).map(sound => sound.src),
        unit.settlement?.celebrationAsset, ...Object.values(unit.settlement?.metricAssets || {})
      ].filter(src => src && !urls.includes(src)));
      urls.push(...optional);
      let completed = 0;
      const total = urls.length + (background ? 0 : 1);
      onProgress({ completed, total });
      const pending = [...urls];
      await Promise.all(Array.from({ length: Math.min(background ? 1 : 3, urls.length) }, async () => {
        while (pending.length) {
          signal?.throwIfAborted();
          const src = pending.shift();
          const optionalController = optional.has(src) ? new global.AbortController() : null;
          const cancelOptional = () => optionalController?.abort();
          if (optionalController) signal?.addEventListener('abort', cancelOptional, {once:true});
          const timer = optionalController ? global.setTimeout(cancelOptional, 3000) : null;
          try {
            // The controlling course service worker validates the full media file
            // against this release's index before returning or caching it.
            const response = await global.fetch(src, { signal: optionalController?.signal || signal, priority: background ? 'low' : 'high' });
            if (!response.ok) throw new Error('Required learning media unavailable');
            await response.arrayBuffer();
          } catch (error) { if (signal?.aborted || !optional.has(src)) throw error; }
          finally { global.clearTimeout(timer); signal?.removeEventListener('abort', cancelOptional); }
          signal?.throwIfAborted();
          onProgress({ completed: ++completed, total });
        }
      }));
      signal?.throwIfAborted();
      if (!background) { await warm(view); onProgress({ completed: ++completed, total }); }
    }
    function clear() {
      for (const entry of players.values()) { entry.cancel(); entry.player.pause(); entry.player.removeAttribute('src'); entry.player.load(); }
      players.clear();
      images.clear();
    }
    return { prepare, warm, ready, takeAudio, clear };
  }
  return { createPreparation };
});
