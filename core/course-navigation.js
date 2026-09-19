(function () {
  'use strict';
  const core = window.CanranCore;
  const courses = core.courseCatalog.COURSES;
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  const profileState = core.deviceProfile.initializeDeviceProfile({ storage, courses });
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
    const unit = core.unit4950;
    const destinations = new Map(unit.stages.flatMap(stage => [[stage.id, stage.title], ...stage.activities.map(([id, title]) => ['learn/' + id, title])]));
    const saved = read(core.learningContext.progress.learningKey);
    const valid = saved?.version === 1 && isRecord(saved.groups) && isRecord(saved.records) && isRecord(saved.activity);
    const route = valid && destinations.has(saved.activity.unitLocation) ? saved.activity.unitLocation : null;
    const entry = document.getElementById('unitEntry');
    entry.textContent = route ? '继续学习' : '开始学习';
    entry.href = '/unit49-50/#' + (route || 'learn/words');
    const label = document.getElementById('resumeLocation');
    label.hidden = !route;
    label.textContent = route ? '上次学到 · ' + destinations.get(route) : '';
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
    const result = core.deviceProfile.restartAdventure({ storage, courses: [...courses, core.learningContext] });
    if (result.cleared) location.assign('/');
    else { panel(0, 'beginRestart'); document.getElementById('deviceStorageStatus').textContent = '部分记录暂时无法清除，请重试。'; }
  });
  dialog.addEventListener('close', () => panel(0));
})();
