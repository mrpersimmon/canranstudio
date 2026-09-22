(function (root) {
  'use strict';
  const core = root.CanranCore;
  const content = (core.learningContext || core.courseCatalog.requirePublishedCourse('lesson49')).learning.SUBJECTS;
  const learning = core.lesson49Practice;
  const questions = content.questions;
  const id = () => root.crypto.randomUUID();
  let run;
  const node = (tag, copy, className = '') => {
    const element = document.createElement(tag);
    element.className = className;
    if (copy) element.textContent = copy;
    return element;
  };
  function button(copy, action, className = 'btn btn-green') {
    const element = node('button', copy, className);
    element.type = 'button';
    element.addEventListener('click', event => { if (event.detail <= 1) action(); });
    return element;
  }
  function results(submissions) {
    const pending = new Set(), last = new Map();
    submissions.forEach((answer, index) => {
      if (answer.correct) pending.delete(answer.questionId); else pending.add(answer.questionId);
      last.set(answer.questionId, index);
    });
    return { pending, last };
  }
  function upcoming(submissions, retryFrom = run?.retryFrom ?? 0) {
    const immediate = submissions.length >= retryFrom;
    const previous = submissions.at(-1);
    if (immediate && previous && !previous.correct) {
      return { q: questions.find(question => question.id === previous.questionId), phase: 'retry' };
    }
    const baseCount = immediate ? submissions.filter(answer => answer.phase === 'base').length : submissions.length;
    if (baseCount < questions.length) return { q: questions[baseCount], phase: 'base' };
    const { pending, last } = results(submissions);
    if (!pending.size) return null;
    if (content.reviewMode === 'mistakes-only') {
      const q = questions.filter(question => pending.has(question.id)).sort((a, b) => last.get(a.id) - last.get(b.id))[0];
      return { q, phase: 'review' };
    }
    // A repeated question is eligible only after two different OTHER questions
    // have been submitted. Correct interval questions can become pending again.
    const eligible = question => new Set(submissions.slice(last.get(question.id) + 1)
      .map(answer => answer.questionId).filter(other => other !== question.id)).size >= 2;
    const oldest = questions.filter(eligible).sort((a, b) => last.get(a.id) - last.get(b.id));
    const q = oldest.find(question => pending.has(question.id)) || oldest[0];
    return { q, phase: pending.has(q.id) ? 'review' : 'spacer' };
  }
  function freshAppearance(next, runId) {
    return { runId, questionId: next.q.id, appearanceId: id(), phase: next.phase,
      selection: null, checked: false, hintUsed: false, ruleUsed: false };
  }
  function freshRun() {
    const runId = id();
    return { version: content.version, runId, retryFrom: 0, submissions: [], usage: [], done: false,
      current: freshAppearance(upcoming([]), runId) };
  }
  function archive(draft, reason) {
    if (!draft) return;
    const history = learning.activity('subjectHistory');
    learning.activity('subjectHistory', [...(Array.isArray(history) ? history : []),
      { reason, savedAt: new Date().toISOString(), draft }]);
  }
  function restore(draft) {
    if (!draft) return freshRun();
    function incompatible() { archive(draft, 'incompatible-subject-draft'); return freshRun(); }
    if (draft.version !== content.version || typeof draft.runId !== 'string' || !draft.runId ||
        !Array.isArray(draft.submissions) || !Array.isArray(draft.usage) || typeof draft.done !== 'boolean') return incompatible();
    const retryFrom = draft.retryFrom === undefined ? Infinity : draft.retryFrom;
    if (retryFrom !== Infinity && (!Number.isInteger(retryFrom) || retryFrom < 0 || retryFrom > draft.submissions.length + 1)) return incompatible();
    const ids = new Set(), verified = [];
    const owns = (answer, expected) => answer && expected && answer.runId === draft.runId &&
      answer.questionId === expected.q.id && answer.phase === expected.phase &&
      typeof answer.appearanceId === 'string' && answer.appearanceId &&
      typeof answer.hintUsed === 'boolean' && typeof answer.ruleUsed === 'boolean';
    // Rebuild progress from submissions in this version and run. Neither a
    // stored score nor a done flag can manufacture unanswered future questions.
    for (const answer of draft.submissions) {
      const expected = upcoming(verified, retryFrom);
      if (!owns(answer, expected) || ids.has(answer.appearanceId) || answer.checked !== true ||
          !content.categories.includes(answer.selection) || answer.correct !== (answer.selection === expected.q.answer)) return incompatible();
      ids.add(answer.appearanceId); verified.push(answer);
    }
    const current = draft.current;
    if (typeof current?.checked !== 'boolean') return incompatible();
    if (current?.checked) {
      const last = verified.at(-1);
      if (!last || ['runId','questionId','appearanceId','phase','selection','hintUsed','ruleUsed'].some(key => current[key] !== last[key])) return incompatible();
    } else if (current?.checked !== false || !owns(current, upcoming(verified, retryFrom)) || ids.has(current.appearanceId) ||
        (current.selection !== null && !content.categories.includes(current.selection))) return incompatible();
    if (draft.done && (!current.checked || upcoming(verified, retryFrom))) return incompatible();
    // Validate the old spaced-review history under its original contract before
    // adopting immediate retries. An in-progress unanswered question stays put.
    if (draft.retryFrom === undefined) draft.retryFrom = verified.length + (current.checked ? 0 : 1);
    return draft;
  }
  const save = () => learning.activity('subjectRound', run);
  function markRuleUsed() {
    if (!run || run.done) return;
    run.usage.push({ appearanceId: run.current.appearanceId, type: 'rule', beforeSubmission: !run.current.checked });
    if (!run.current.checked) run.current.ruleUsed = true;
    save();
  }
  function mount({ element, onComplete }) {
    run = restore(learning.activity('subjectRound')); save();
    function render() {
      element.replaceChildren(); element.className = 'practice-runner subject-runner';
      if (run.done) {
        const finish = node('div', '', 'practice-finish');
        const stamp = core.lesson49Icons.create('check'); stamp.classList.add('finish-icon');
        const score = run.submissions.filter(answer => answer.phase === 'base' && answer.correct).length;
        const actions = node('div', '', 'practice-finish-actions');
        actions.setAttribute('role', 'group'); actions.setAttribute('aria-label', '完成后的操作');
        actions.append(button('再练一轮', () => {
          archive(run, 'completed-run'); run = freshRun(); save(); render(); learning.revealQuestion(element);
        }, 'btn btn-yellow'));
        finish.append(stamp, node('p', '分拣完成！'), node('p', `基础题首次答对 ${score} / ${questions.length}`), actions);
        element.append(finish); onComplete(); return;
      }
      const current = run.current;
      const q = questions.find(question => question.id === current.questionId);
      const ownsAppearance = () => run.current?.appearanceId === current.appearanceId && !run.done;
      const body = node('div', '', 'practice-content');
      const { pending, last } = results(run.submissions);
      // One progress marker per question, using its latest verified answer in this run.
      // Repeated interval questions retain their green fill until answered wrong.
      const solved = questions.map(question => last.has(question.id) && !pending.has(question.id));
      const progress = learning.progressLabel(current.phase === 'base' || current.phase === 'retry'
        ? `第 ${questions.indexOf(q) + 1} / ${questions.length} 题`
        : `${current.phase === 'review' ? '回练' : '再练一题'} · 还有 ${pending.size} 道待练`, solved,
        current.checked && current.selection === q.answer ? -1 : questions.indexOf(q));
      progress.id = 'tpProg';
      const subject = node('h3', q.subject); subject.id = 'tpItemText'; subject.tabIndex = -1;
      const scene = node('div', '', 'subject-scene');
      const picture = node('img'); picture.src = q.image; picture.alt = q.imageAlt;
      scene.append(picture);
      const context = node('p', q.context, 'subject-context');
      const choices = node('div', '', 'subject-options');
      choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', '选择主语类别');
      const status = node('div', '', 'subject-feedback'); status.setAttribute('role', 'status');
      status.id = 'subject-feedback';
      status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
      const check = button('检查答案', () => {
        if (!ownsAppearance() || current.checked || !current.selection) return;
        current.checked = true;
        run.submissions.push({ ...current, correct: current.selection === q.answer });
        save();
        const attempts = run.submissions.filter(answer => answer.questionId === q.id);
        learning.record({ id: 'subject-' + q.id, target: '主语人称分类', prompt: q.subject }, {
          contentVersion: content.version, runId: run.runId, firstCorrect: attempts[0].correct,
          firstHintUsed: attempts[0].hintUsed, firstRuleUsed: attempts[0].ruleUsed,
          correct: current.selection === q.answer, hintUsed: attempts.some(answer => answer.hintUsed),
          ruleUsed: attempts.some(answer => answer.ruleUsed), attempts: attempts.length,
          reviewAttempts: attempts.filter(answer => answer.phase !== 'base').length
        });
        render(); core.lesson49Feedback.play(current.selection === q.answer ? 'correct' : 'incorrect');
        element.querySelector('.subject-next')?.focus({ preventScroll: true });
      });
      const nextQuestion = current.checked ? upcoming(run.submissions) : null;
      const next = button(current.checked && current.selection !== q.answer ? '再试一次' : current.checked && !nextQuestion ? '完成' : '继续', () => {
        if (!ownsAppearance() || !current.checked) return;
        if (nextQuestion) run.current = freshAppearance(nextQuestion, run.runId); else run.done = true;
        save(); render();
        if (run.done) core.lesson49Feedback.play('complete');
        if (!nextQuestion || nextQuestion.q.id !== q.id) learning.revealQuestion(element);
      });
      next.classList.add('subject-next'); next.setAttribute('aria-describedby', status.id);
      content.categories.forEach(category => {
        const option = button(category, () => {
          if (!ownsAppearance() || current.checked) return;
          current.selection = category; save(); update();
        }, 'opt-btn');
        choices.append(option);
      });
      function update() {
        [...choices.children].forEach((option, index) => {
          const selected = current.selection === content.categories[index];
          option.setAttribute('aria-pressed', String(selected));
          option.classList.toggle('selected', selected); option.disabled = current.checked;
        });
        check.disabled = !current.selection; check.hidden = current.checked; next.hidden = !current.checked;
      }
      if (current.checked) {
        const correct = current.selection === q.answer;
        status.append(node('strong', correct ? '答对了！' : '再看看，试一次。'));
      }
      body.append(progress, scene, subject, context, node('p', content.prompt, 'subject-prompt'), choices);
      const actions = node('div', '', 'practice-actions');
      const note = node('div', '', 'practice-answer-note'); note.append(status);
      const hintCopy = node('p', q.hint, 'practice-hint'); hintCopy.id = 'subject-hint';
      hintCopy.hidden = !current.hintUsed || current.checked; note.append(hintCopy);
      const hint = button('', () => {
        if (!ownsAppearance() || current.checked) return;
        if (!current.hintUsed) run.usage.push({ appearanceId: current.appearanceId, type: 'hint', beforeSubmission: true });
        current.hintUsed = true; hintCopy.hidden = false; hint.setAttribute('aria-expanded', 'true'); save();
      }, 'btn btn-yellow practice-hint-button');
      hint.append(core.lesson49Icons.create('hint')); hint.setAttribute('aria-label', '给点线索'); hint.title = '给点线索';
      hint.setAttribute('aria-controls', hintCopy.id); hint.setAttribute('aria-expanded', String(!hintCopy.hidden));
      hint.disabled = current.checked;
      const controls = node('div', '', 'practice-submit-row');
      controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', '作答操作');
      controls.append(hint, check, next);
      actions.append(note, controls); element.append(body, actions); update();
    }
    render();
  }
  core.lesson49Subjects = { mount, markRuleUsed, isComplete: () => run?.done === true };
})(globalThis);
