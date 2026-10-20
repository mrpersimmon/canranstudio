(function (root) {
  'use strict';
  const node = (tag, className = '', text = '') => {
    const element = document.createElement(tag); element.className = className; element.textContent = text; return element;
  };
  function picture(name, alt = '') {
    const image = node('img'); image.src = '/assets/' + (name === 'coat' ? 'unit1-2/' : 'unit3-4/') + name + '.svg'; image.alt = alt; return image;
  }
  function actor(who, name, context) {
    const person = node('div', 'cloakroom-actor ' + context + '-actor ' + context + '-' + who);
    person.dataset.actor = who; person.append(picture(who), node('span', '', name)); return person;
  }
  function room(className, context, visitorName = '客人') {
    const element = node('div', 'cloakroom-world ' + className);
    const desk = picture('counter'); desk.className = 'cloakroom-desk';
    element.append(actor('visitor', visitorName, context), actor('attendant', '工作人员', context), desk);
    return element;
  }
  function showUmbrella(image, name, description, exchange = false) {
    const source = '/assets/unit3-4/' + name + '.svg';
    image.alt = description;
    // The course loader can rewrite src to a blob URL; compare the artwork
    // identity rather than repeatedly replacing that prepared resource.
    if (image.dataset.umbrellaArtwork === name) return;
    // Pending visual work can never write a later sentence's object back.
    image.getAnimations().forEach(animation => animation.cancel());
    const previous = image.parentElement.querySelector('.umbrella-outgoing');
    if (previous) { previous.getAnimations().forEach(animation => animation.cancel()); previous.remove(); }
    const oldSource = image.currentSrc || image.src;
    image.dataset.umbrellaArtwork = name;
    image.src = source;
    if (!exchange || !image.isConnected || root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Keep the outgoing object separate: taking one back and bringing another
    // forward is not the same event as changing the first umbrella's colour.
    const outgoing = node('span', 'umbrella-outgoing'); outgoing.setAttribute('aria-hidden', 'true');
    outgoing.style.backgroundImage = 'url("' + oldSource + '")'; image.parentElement.append(outgoing);
    const takeBack = outgoing.animate([
      { opacity: 1, transform: 'translate(0, 0)' },
      { opacity: 0, transform: 'translate(28px, 22px) scale(.85)' }
    ], { duration: 130, fill: 'forwards', easing: 'ease-in' });
    const bringOut = image.animate([
      { opacity: 0, transform: 'translate(28px, 22px) scale(.85)' },
      { opacity: 1, transform: 'translate(0, 0)' }
    ], { duration: 170, delay: 130, fill: 'backwards', easing: 'ease-out' });
    Promise.allSettled([takeBack.finished, bringOut.finished]).then(() => outgoing.remove());
  }
  function storyProps() {
    const element = room('cloakroom-props', 'dialogue');
    element.setAttribute('role', 'group'); element.setAttribute('aria-label', '衣帽间人物与物品');
    const ticket = node('div', 'cloakroom-prop ticket-prop'); ticket.append(picture('ticket', '寄存牌'));
    const coat = node('div', 'cloakroom-prop coat-prop'); coat.append(picture('coat', '外套'));
    const umbrella = node('div', 'cloakroom-prop umbrella-prop'); umbrella.append(picture('umbrella-red', '红色纯色雨伞'));
    const status = node('span', 'scene-caption'); element.append(ticket, coat, umbrella, status);
    let previousIndex = -1;
    return { element, update(index) {
      const returned = index >= 10;
      // Each question presents a different object; the following denial keeps
      // that same object. Only the explicit confirmation hands the final one over.
      const imageName = returned ? 'umbrella-held' : index >= 9 ? 'umbrella' : index >= 7 ? 'umbrella-yellow' : 'umbrella-red';
      const description = (returned ? '客人领回的' : '') + (index >= 9 ? '紫色圆点' : index >= 7 ? '黄色条纹' : '红色纯色') + '雨伞';
      showUmbrella(umbrella.firstChild, imageName, description, previousIndex >= 0 && index > previousIndex && [7, 9].includes(index));
      previousIndex = index;
      element.dataset.beat = returned ? 'returned' : index >= 5 ? 'checking' : 'waiting';
      element.dataset.ticket = index >= 2 ? 'counter' : 'visitor';
      ticket.hidden = index < 1;
      status.textContent = returned ? '客人确认：是这把' : index >= 5 ? '继续确认雨伞' : '';
    } };
  }
  const beats = {
    'u34-classroom-v2-counter-request': { name: '提出请求', item: 'coat', before: '', after: 'My coat and my umbrella please.' },
    'u34-classroom-v2-counter-ticket': { name: '出示寄存牌', item: 'ticket', before: '', after: 'Here is my ticket.' },
    'u34-v1-polite-wrong': { name: '核对雨伞', item: 'umbrella', before: "Here's your umbrella and your coat.", after: 'This is not my umbrella.' },
    'u34-v1-polite-yes': { name: '确认领回', item: 'umbrella', before: 'Is this your umbrella?', after: 'Yes, it is.' }
  };
  function create({ element }) {
    let question, scene, speech, prop, status, heading;
    const receipt = storyProps(); receipt.update(10); receipt.element.classList.add('claim-receipt');
    // No unrelated success emblem: the completed scene shows the resolved task.
    receipt.element.querySelector('.ticket-prop').hidden = true;
    function bubble(who, text) {
      const box = node('div', 'counter-bubble counter-bubble-' + who);
      box.append(node('small', '', who === 'visitor' ? '客人（你）' : '工作人员'), node('p', '', text)); box.lastChild.lang = 'en'; return box;
    }
    function answer(correct) {
      const beat = beats[question.id];
      scene.dataset.confirmed = String(Boolean(correct));
      speech.replaceChildren();
      if (beat.before) speech.append(bubble('attendant', beat.before));
      if (correct) speech.append(bubble('visitor', beat.after));
      const returned = correct && question.id === 'u34-v1-polite-yes';
      if (beat.item === 'umbrella') {
        const finalUmbrella = question.id === 'u34-v1-polite-yes';
        showUmbrella(prop.firstChild, returned ? 'umbrella-held' : finalUmbrella ? 'umbrella' : 'umbrella-red',
          (returned ? '客人领回的' : '') + (finalUmbrella ? '紫色圆点' : '红色纯色') + '雨伞');
      }
      prop.classList.toggle('is-returned', Boolean(returned));
      prop.classList.toggle('is-presented', Boolean(correct && beat.item === 'ticket'));
      scene.dataset.returned = String(Boolean(returned));
      status.textContent = returned ? '客人已领回' : correct && beat.item === 'ticket' ? '寄存牌已出示' : correct && question.id === 'u34-v1-polite-wrong' ? '继续找一把' : '';
      speech.scrollTop = speech.scrollHeight;
    }
    function present(q, progress) {
      question = q;
      const content = element.querySelector('.practice-content'), options = content.querySelector('.practice-options');
      element.classList.remove('role-runner'); element.classList.add('counter-runner');
      const intro = node('div', 'counter-introduction'); heading = node('h3', 'counter-prompt', q.prompt); intro.append(progress, heading);
      scene = room('counter-stage', 'counter', '客人（你）');
      scene.setAttribute('role', 'group'); scene.setAttribute('aria-label', '衣帽间认领柜台');
      scene.dataset.beat = beats[q.id].name;
      speech = node('div', 'counter-conversation'); speech.setAttribute('aria-label', '柜台对白');
      prop = node('div', 'counter-item counter-item-' + beats[q.id].item); prop.append(picture(beats[q.id].item));
      if (beats[q.id].item === 'coat') prop.append(picture('umbrella-red', '红色纯色雨伞'));
      status = node('span', 'counter-item-status scene-caption');
      scene.append(speech, prop, status);
      content.insertBefore(intro, options); content.insertBefore(scene, options); answer(false);
    }
    return { present, answer, heading: () => heading, finish() {}, completion: () => receipt.element };
  }
  root.CanranCore.unit34Scene = { create, storyProps };
})(globalThis);
