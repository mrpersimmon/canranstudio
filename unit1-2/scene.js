(function (root) {
  'use strict';
  const core = root.CanranCore;
  const node = (tag, className = '', text = '') => {
    const element = document.createElement(tag); element.className = className; element.textContent = text; return element;
  };
  const image = (name, alt = '') => {
    const picture = node('img'); picture.src = '/assets/unit1-2/' + (['man', 'woman'].includes(name) ? 'scene/' : '') + name + '.svg' + (name === 'handbag' ? '?v=scene-2' : ''); picture.alt = alt; return picture;
  };
  // Selection, retry, drafts, hints and progress remain owned by the common runner.
  function create({ element }) {
    let question, scene, speech, heading, bag, bench, receivers, targets, found;
    function line([who, text], response = false) {
      const bubble = node('div', 'quest-speech quest-speech-' + who + (response ? ' is-response' : ''));
      bubble.append(node('small', '', who === 'man' ? '男士' : '女士'), node('span', '', text));
      bubble.lastChild.lang = 'en'; return bubble;
    }
    function paintSpeech(correct) {
      speech.replaceChildren(...question.scene.before.map(item => line(item)));
      if (correct) question.scene.after.forEach(item => speech.append(line(item, true)));
      speech.scrollTop = speech.scrollHeight;
    }
    function person(who, label) {
      const actor = node('div', 'quest-actor quest-actor-' + who);
      actor.append(image(who), node('span', 'quest-name', label));
      const slot = node('div', 'quest-bag-slot'); slot.setAttribute('aria-hidden', 'true'); actor.append(slot); receivers.set(label, slot);
      return actor;
    }
    function present(q, progress) {
      question = q; receivers = new Map(); targets = new Map();
      const content = element.querySelector('.practice-content'), options = content.querySelector('.practice-options');
      element.classList.add('handbag-runner'); element.classList.remove('role-runner'); element.dataset.sceneBeat = q.scene.beat;
      const introduction = node('div', 'quest-introduction');
      heading = node('h3', 'quest-prompt', q.prompt); heading.tabIndex = -1;
      introduction.append(progress, heading);
      scene = node('div', 'street-stage'); scene.dataset.beat = q.scene.beat;
      scene.setAttribute('role', 'group'); scene.setAttribute('aria-label', q.scene.beat === 'find' ? '街角的物品' : '手提包归还场景');
      speech = node('div', 'quest-conversation'); speech.setAttribute('aria-label', '当前对白');
      const man = person('man', '男士'), woman = person('woman', '女士');
      scene.append(man, speech, woman);
      bench = node('div', 'quest-bench');
      bag = image('handbag', '等待归还的手提包'); bag.className = 'quest-handbag'; bench.append(bag); scene.append(bench);
      if (q.scene.beat === 'return') {
        options.classList.add('quest-recipients');
        options.setAttribute('aria-label', '选择接收者');
        for (const control of options.querySelectorAll('button')) {
          const label = control.getAttribute('aria-label') || control.textContent;
          control.setAttribute('aria-label', label); control.classList.add('quest-person-target'); control.dataset.person = label === '男士' ? 'man' : 'woman';
          const slot = node('div', 'quest-bag-slot'); slot.setAttribute('aria-hidden', 'true'); control.append(slot);
          receivers.set(label, slot);
        }
        man.remove(); woman.remove(); scene.append(options);
      } else if (q.scene.beat === 'find') {
        options.classList.add('quest-object-targets');
        options.setAttribute('aria-label', '选择物品');
        for (const control of options.querySelectorAll('button')) {
          const label = control.getAttribute('aria-label') || control.textContent;
          control.setAttribute('aria-label', label); targets.set(label, control);
        }
        bench.remove(); scene.append(options);
      }
      found = node('p', 'quest-outcome'); found.setAttribute('aria-live', 'polite');
      content.prepend(introduction, scene); content.append(found);
      paintSpeech(false);
    }
    function answer(value) {
      const correct = value !== null;
      paintSpeech(correct);
      scene.classList.toggle('is-solved', correct);
      scene.classList.toggle('is-returned', question.scene.beat === 'thanks' || (question.scene.beat === 'return' && correct));
      if (question.scene.beat !== 'find') {
        const returned = question.scene.beat === 'thanks' || (question.scene.beat === 'return' && correct);
        (returned ? receivers.get('女士') : bench).append(bag);
        bag.alt = returned ? '已经交到女士手中的手提包' : '等待归还的手提包';
      }
      targets.forEach((target, label) => target.classList.toggle('is-found', correct && label === value));
      found.textContent = correct ? ({ attention: '她停下来了。', repeat: '这次，她听清了。', return: '手提包回到主人手中了。', thanks: '一次有礼貌的帮助，完成了！', find: '找到问到的物品了。' }[question.scene.beat]) : '';
    }
    function completion() {
      const result = node('div', 'handbag-keepsake');
      const pair = node('div', 'keepsake-pair');
      const recipient = node('div', 'keepsake-recipient'); recipient.append(image('woman'), image('handbag', '女士拿回了手提包'));
      pair.append(image('man'), recipient);
      result.append(pair, node('p', 'keepsake-thanks', 'Thank you very much.'), node('p', 'keepsake-caption', '你帮他们完成了一次有礼貌的相遇。'));
      return result;
    }
    return { present, answer, finish() {}, heading: () => heading?.isConnected ? heading : element.querySelector('.practice-finish > p'), completion };
  }
  core.unit12Scene = { create };
})(globalThis);
