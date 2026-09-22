(function () {
  'use strict';
  const core = window.CanranCore;
  const courses = core.courseCatalog.COURSES;
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  const profileState = core.deviceProfile.initializeDeviceProfile({ storage, courses });
  const units = [
    { ...core.unit4950, ...core.learningContext, path: '/unit49-50/', start: 'learn/words', entry: 'unitEntry', label: 'resumeLocation' },
    { ...core.unit12, entry: 'unit12Entry', label: 'unit12Resume' },
    { ...core.unit34, entry: 'unit34Entry', label: 'unit34Resume' },
    { ...core.unit56, entry: 'unit56Entry', label: 'unit56Resume' },
    { ...core.unit78, entry: 'unit78Entry', label: 'unit78Resume' },
    { ...core.unit910, entry: 'unit910Entry', label: 'unit910Resume' },
    { ...core.unit1112, entry: 'unit1112Entry', label: 'unit1112Resume' },
    { ...core.unit1314, entry: 'unit1314Entry', label: 'unit1314Resume' },
    { ...core.unit1516, entry: 'unit1516Entry', label: 'unit1516Resume' },
    { ...core.unit1718, entry: 'unit1718Entry', label: 'unit1718Resume' },
    { ...core.unit1920, entry: 'unit1920Entry', label: 'unit1920Resume' },
    { ...core.unit2122, entry: 'unit2122Entry', label: 'unit2122Resume' }
  ];
  function read(key) {
    try { return JSON.parse(storage?.getItem(key) || 'null'); } catch { return null; }
  }
  const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
  function refreshCourses() {
    for (const card of document.querySelectorAll('[data-course]')) {
      const course = courses.find(item => item.id === card.dataset.course);
      const progress = core.storage.normalizeProgress(read(course.progress.key), course.progress.ids);
      const stars = Object.values(progress.ratings).reduce((sum, value) => sum + value, 0);
      card.querySelector('.course-progress').textContent = stars ? `${stars} / ${course.progress.max} 颗星` : '';
    }
    for (const unit of units) {
      const destinations = new Map(unit.stages.flatMap(stage => [[stage.id, stage.title], ...stage.activities.map(([id, title]) => ['learn/' + id, title])]));
      const saved = read(unit.progress.learningKey);
      const valid = saved?.version === 1 && isRecord(saved.groups) && isRecord(saved.records) && isRecord(saved.activity);
      const route = valid && destinations.has(saved.activity.unitLocation) ? saved.activity.unitLocation : null;
      const entry = document.getElementById(unit.entry);
      entry.textContent = route ? '继续学习' : '开始学习';
      if (entry.hasAttribute('aria-label')) entry.setAttribute('aria-label', entry.textContent + '：' + unit.title);
      entry.href = unit.path + '#' + (route || unit.start);
      const label = document.getElementById(unit.label);
      label.hidden = !route;
      label.textContent = route ? '上次学到 · ' + destinations.get(route) : '';
    }
  }
  refreshCourses();
  window.addEventListener('pageshow', refreshCourses);
  window.addEventListener('storage', refreshCourses);
  // Old course-return URLs remain valid; they select the corresponding card.
  const focusId = new URLSearchParams(location.search).get('focus');
  const focusedCourse = [...document.querySelectorAll('[data-course]')].find(card => card.dataset.course === focusId);
  if (focusedCourse) {
    const details = focusedCourse.closest('details');
    if (details) details.open = true;
    focusedCourse.focus();
  }
  const dialog = document.getElementById('deviceSettingsDialog');
  document.querySelector('[data-open-settings]').hidden = false;
  const panels = ['settingsOverview', 'restartConfirm', 'restartFinalConfirm'].map(id => document.getElementById(id));
  function panel(index, focusId) {
    panels.forEach((element, i) => { element.hidden = i !== index; });
    if (focusId) document.getElementById(focusId).focus();
  }
  document.getElementById('deviceStorageStatus').textContent = profileState.persisted ? '进度会保存在这台设备上。' : '当前浏览器无法永久保存进度。';
  document.querySelector('[data-open-settings]').addEventListener('click', () => dialog.showModal());
  document.querySelector('[data-close-settings]').addEventListener('click', () => dialog.close());
  document.getElementById('beginRestart').addEventListener('click', () => panel(1, 'cancelRestartFirst'));
  document.getElementById('continueRestart').addEventListener('click', () => panel(2, 'cancelRestart'));
  for (const id of ['cancelRestartFirst', 'cancelRestart']) document.getElementById(id).addEventListener('click', () => panel(0, 'beginRestart'));
  document.getElementById('confirmRestart').addEventListener('click', () => {
    const result = core.deviceProfile.restartAdventure({ storage, courses: [...courses, ...units] });
    if (result.cleared) location.assign('/');
    else { panel(0, 'beginRestart'); document.getElementById('deviceStorageStatus').textContent = '部分记录暂时无法清除，请重试。'; }
  });
  dialog.addEventListener('close', () => panel(0));
})();
