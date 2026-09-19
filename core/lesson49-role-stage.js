(function (root) {
  'use strict';
  function create({ bar, playAudio }) {
    const node = (tag, className, text = '') => {
      const item = document.createElement(tag); item.className = className; item.textContent = text; return item;
    };
    const stage = node('div', 'role-theatre');
    const scene = node('div', 'role-scene');
    scene.setAttribute('role', 'region'); scene.setAttribute('aria-label', '当前情境');
    const welcome = node('div', 'role-welcome');
    welcome.append(bar.querySelector('#roleInfo'), bar.querySelector('#roleListenBtn'));
    const story = node('div', 'role-story');
    scene.append(welcome, story);
    for (const [role, name] of [['butcher', '老板'], ['bird', '伯德夫人']]) {
      const actor = node('div', 'role-actor role-' + role);
      actor.setAttribute('role', 'group'); actor.setAttribute('aria-label', name);
      const tag = node('div', 'role-name', name);
      actor.append(root.CanranCore.lesson49Icons.create(role), tag);
      stage.append(actor);
    }
    stage.append(scene); bar.append(stage);
    let question = null;
    let response = null;
    let scrollPane = null;
    let generation = 0;
    let playback = null;
    let playing = null;
    const audioStatus = node('p', 'role-audio-status'); audioStatus.setAttribute('aria-live','polite');
    function stop() {
      ++generation;
      playback?.cancel(); playback = null;
      if (playing) playing.setAttribute('aria-busy','false');
      playing = null; audioStatus.textContent = '';
    }
    function line(text, imageSource) {
      const item = node('button', 'role-line'); item.type = 'button';
      item.setAttribute('aria-busy','false');
      if (imageSource) {
        const image = node('img', 'role-food'); image.src = imageSource; image.alt = ''; item.append(image);
      }
      item.append(node('span','',text), root.CanranCore.lesson49Icons.create('audio'));
      item.addEventListener('click', () => {
        stop(); const token = generation;
        playing = item; item.setAttribute('aria-busy','true');
        playback = playAudio(text, result => {
          if (token !== generation) return;
          item.setAttribute('aria-busy','false'); playing = null; playback = null;
          if (result.reason !== 'ended' && result.reason !== 'cancelled') audioStatus.textContent = '没听清？再点一次。';
        });
      });
      return item;
    }
    function setReady(ready) {
      stop();
      scene.hidden = false;
      welcome.hidden = ready; story.hidden = !ready;
      if (!ready) story.replaceChildren();
    }
    function present(q, progress) {
      stop();
      scene.hidden = false;
      question = q;
      const need = node('h3', 'role-need', q.prompt); need.tabIndex = -1;
      const cue = node('div', 'role-cue role-from-' + q.scene?.who);
      if (q.scene?.text) cue.append(line(q.scene.text));
      response = node('div', 'role-response role-from-' + q.scene.replyWho);
      response.hidden = true;
      const header = node('div', 'role-question'); header.append(progress, need);
      scrollPane = node('div', 'role-scroll role-support');
      scrollPane.append(cue, response, audioStatus);
      story.replaceChildren(header, scrollPane);
    }
    function answer(value) {
      stop();
      response.hidden = !value;
      response.replaceChildren();
      if (!value) return;
      response.append(line(value, question.optionImages?.[value]));
      // Follow only this scene, never move the page or the answer controls.
      scrollPane.scrollTop = Math.max(0, response.offsetTop + response.offsetHeight - scrollPane.clientHeight + 12);
    }
    function finish() { stop(); story.replaceChildren(); scene.hidden = true; }
    root.addEventListener('lesson49:leave-activity', stop);
    root.addEventListener('pagehide', stop);
    setReady(false);
    return { setReady, present, answer, finish, heading: () => story.querySelector('h3,.role-line') };
  }
  root.CanranCore.lesson49RoleStage = { create };
})(globalThis);
