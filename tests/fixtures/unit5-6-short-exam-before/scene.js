(function (root) {
  'use strict';
  const node = (tag, className = '', text = '') => {
    const element = document.createElement(tag); element.className = className; element.textContent = text; return element;
  };
  function picture(name, label = '') {
    const image = node('img'); image.src = '/assets/unit5-6/' + name + '.svg'; image.alt = label; return image;
  }
  function actor(id, people) {
    const element = node('div', 'classroom-person'); element.dataset.person = id;
    element.append(picture(id, people[id].name), node('span', '', people[id].name)); return element;
  }
  function storyProps(content) {
    const element = node('div', 'classroom-cast');
    element.setAttribute('role', 'group'); element.setAttribute('aria-label', '教室里的新朋友');
    const hosts = node('div', 'classroom-hosts'), teacher = actor('blake', content.PEOPLE), sophie = actor('sophie', content.PEOPLE);
    const classmates = node('div', 'classroom-classmate');
    hosts.append(teacher, sophie); element.append(hosts, classmates);
    let shown;
    return { element, update(index) {
      const line = content.DIALOGUE[index], focus = line?.focus;
      const next = !focus || focus === 'sophie' ? 'students' : focus;
      if (shown !== next) {
        shown = next; classmates.replaceChildren(actor(next, content.PEOPLE));
      }
      element.querySelectorAll('[data-person]').forEach(person => {
        person.classList.toggle('is-speaking', person.dataset.person === line?.person);
        person.classList.toggle('is-introduced', person.dataset.person === focus && focus !== 'students');
      });
      element.dataset.focus = focus || 'students';
    } };
  }
  function classPhoto() {
    const figure = node('figure', 'classroom-photo');
    figure.append(picture('class-photo', 'Mr. Blake 和 Sophie、Hans、Naoko、Chang-woo、Luming、Xiaohui 的教室合影'), node('figcaption', '', 'Nice to meet you!'));
    return figure;
  }
  root.CanranCore.unit56Scene = { storyProps, classPhoto };
})(globalThis);
