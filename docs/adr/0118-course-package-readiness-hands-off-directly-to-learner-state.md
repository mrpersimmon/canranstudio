---
status: accepted
date: 2026-09-01
partially_supersedes:
  - ADR-0117
---

# Course-package readiness hands off directly to the learner state

When a teaching unit's verified package becomes ready, the entry shell immediately dispatches to the learner's stable state instead of introducing a generic “Start learning” confirmation: a first-time learner enters the first stage with arrival and briefing folded into its non-blocking opening, an in-progress learner resumes the first unfinished stage, and a learner who completed the unit enters the outcome surface. Due-review state may show a non-blocking reminder but never opens the child stage map automatically; that map remains an explicit learner action. Because browsers may reject audio without a user gesture, automatic entry first stabilizes the stage and attempts playback, then degrades in place to a clear listen action without returning to loading or navigation and without bypassing the real audio-ended gate. This accepts autoplay variability to remove a redundant universal click while preserving honest progress, completion, and audio evidence.
