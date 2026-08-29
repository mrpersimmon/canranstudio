'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

test('Lesson 1–2 V2 styles implement four semantic scene constructions and outcome rests', async () => {
  const styles = await fs.readFile(path.join(
    ROOT,
    'poc/lesson1-2-experience/experience.css'
  ), 'utf8');

  for (const mode of [
    'dialogue-stage',
    'object-workbench',
    'grammar-lab',
    'story-journey',
    'outcome-rest'
  ]) {
    assert.match(styles, new RegExp(`data-scene-mode=['"]${mode}['"]`), mode);
  }

  assert.match(styles, /data-scene-mode=['"]dialogue-stage['"][\s\S]*?\.scene-character/);
  assert.match(styles, /data-scene-mode=['"]object-workbench['"][\s\S]*?\.scene-props/);
  assert.match(styles, /data-scene-mode=['"]grammar-lab['"][\s\S]*?\.block-builder__track/);
  assert.match(styles, /data-scene-mode=['"]story-journey['"][\s\S]*?\.scene-props/);
  assert.match(styles, /data-scene-mode=['"]outcome-rest['"][\s\S]*?\.milestone-card/);

  for (const motion of [
    'speaker-shift',
    'settle-item',
    'counter-transform',
    'relation-link',
    'owner-boards-car',
    'car-arrives-home',
    'single-handoff',
    'save-readback'
  ]) {
    assert.match(styles, new RegExp(`data-primary-motion=['"]${motion}['"]`), motion);
  }

  assert.match(styles, /\.is-moment-focus/);
  assert.match(
    styles,
    /data-primary-motion=['"]line-follow['"][\s\S]*?\.scene-character\.is-active-speaker[\s\S]*?animation:\s*moment-active-speaker-turn/
  );
  assert.match(
    styles,
    /:is\(\s*\.station-world\[data-primary-motion=['"]line-follow['"]\][\s\S]{0,220}\)\s+\.mission-console\s*\{\s*animation:\s*none;\s*\}/
  );
  assert.match(styles, /@keyframes\s+moment-active-speaker-turn/);
  assert.match(styles, /@media\s*\(max-width:\s*680px\)[\s\S]*data-scene-mode=['"]dialogue-stage['"]/);
  assert.match(styles, /@media\s*\(max-height:\s*690px\)\s+and\s+\(max-width:\s*680px\)[\s\S]*data-scene-mode=['"]story-journey['"]/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*data-primary-motion/);
  assert.match(
    styles,
    /\.scene-prop\.is-choice-candidate\s+\.scene-prop__name\s*\{\s*display:\s*none/
  );
  assert.doesNotMatch(styles, /L01-M\d+|L02-M\d+/);
  assert.doesNotMatch(styles, /overflow-x:\s*(?:auto|scroll)/);
});

test('Lesson 1–2 V2 variants and authored end states remain visually distinct', async () => {
  const styles = await fs.readFile(path.join(
    ROOT,
    'poc/lesson1-2-experience/experience.css'
  ), 'utf8');

  for (const variant of [
    'personal-items-audio-tray',
    'personal-items-word-labels',
    'coatroom-audio-rack',
    'coatroom-word-labels',
    'coatroom-word-labels-and-return',
    'homeward-scene-identify',
    'homeward-label-journey'
  ]) {
    assert.match(styles, new RegExp(`data-scene-variant=['"]${variant}['"]`), variant);
  }

  assert.match(styles, /data-moment-state\*=['"]with-owner['"][\s\S]*?translateX/);
  assert.match(styles, /data-moment-state\*=['"]returned['"][\s\S]*?translateX/);
  assert.match(styles, /data-moment-state\*=['"]owner-boarded-car['"]/);
  assert.match(styles, /data-moment-state\*=['"]owner-arrived-home['"]/);
  assert.match(styles, /data-end-state\*=['"]single-handoff['"]/);
  assert.match(styles, /@media\s*\(min-width:\s*360px\)\s+and\s+\(max-width:\s*430px\)[\s\S]*?\.scene-people\s*\{[\s\S]*?z-index:\s*6/);
  assert.doesNotMatch(styles, /data-runtime-microtask|L01-M\d+|L02-M\d+/);
});

test('Lesson 1–2 R2 scene geometry stays catalog-authored instead of panel-measured', async () => {
  const [styles, scene] = await Promise.all([
    fs.readFile(path.join(ROOT, 'poc/lesson1-2-experience/experience.css'), 'utf8'),
    fs.readFile(path.join(ROOT, 'core/learning-microtask-scene.js'), 'utf8')
  ]);

  assert.match(styles, /height:\s*var\(--scene-actor-height-wide,\s*70%\)\s*!important/);
  assert.match(styles, /height:\s*var\(--scene-actor-height-portrait,\s*38%\)\s*!important/);
  assert.match(styles, /bottom:\s*calc\(100%\s*-\s*var\(--scene-surface-y-wide,\s*75%\)\)/);
  assert.match(styles, /bottom:\s*calc\(100%\s*-\s*var\(--scene-surface-y-portrait,\s*65%\)\)/);
  assert.doesNotMatch(styles, /--scene-prop-shift-y/);
  assert.doesNotMatch(styles, /height:\s*min\(71%,\s*680px\)/);
  assert.doesNotMatch(scene, /setProperty\(['"]--scene-prop-shift-y/);
  assert.doesNotMatch(scene, /getBoundingClientRect\(\)/);
});
