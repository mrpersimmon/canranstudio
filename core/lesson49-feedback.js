(function (root) {
  'use strict';
  const sounds = (root.CanranCore.learningContext || root.CanranCore.courseCatalog.requirePublishedCourse('lesson49')).learning.FEEDBACK;
  let active = null;

  function stop() {
    const audio = active;
    active = null;
    if (audio) {
      try { audio.pause(); } catch {}
    }
  }

  function play(kind) {
    const sound = sounds[kind];
    if (!sound) return;
    stop();
    try {
      const audio = new root.Audio(root.CanranCore.courseCatalog.publicAssetUrl(sound.src));
      active = audio;
      audio.volume = sound.volume;
      const release = () => { if (active === audio) active = null; };
      audio.addEventListener('ended', release, { once: true });
      audio.addEventListener('error', release, { once: true });
      Promise.resolve(audio.play()).catch(release);
    } catch { stop(); }
  }

  root.addEventListener('pagehide', stop);
  root.addEventListener('lesson49:leave-activity', stop);
  root.CanranCore.lesson49Feedback = { play };
})(globalThis);
