'use strict';
const { defineConfig, devices } = require('@playwright/test');
const login = require('./playwright.login.config');

// Exercise Safari's engine with a phone viewport and touch input. This is not
// a substitute for physical iPhone / WeChat acceptance on the deployed build.
module.exports = defineConfig({
  ...login,
  testMatch: ['course-ending.spec.js', 'course-loading-recovery.spec.js', 'course-update-choice.spec.js', 'course-update-performance.spec.js', 'course-worker-upgrade.spec.js', 'journey-touch.spec.js', 'student-navigation.spec.js', 'student-transition.spec.js', 'award-gif-edges.spec.js', 'unit56-word-cards.spec.js', 'award-card-aspect.spec.js', 'practice-screen.spec.js', 'learning-flow.spec.js', 'learning-expansion.spec.js', 'learning-layout-audit.spec.js', 'learning-choice-label.spec.js', 'learning-bank-layout.spec.js', 'unit34-journey-visual.spec.js', 'lesson-review.spec.js', 'practice-references.spec.js', 'story-layout.spec.js', 'accepted-ux.spec.js', 'learning-transitions.spec.js', 'learning-polish.spec.js', 'course-picture-guard.spec.js'],
  outputDir: './output/test-recovery-webkit',
  use: { ...login.use, ...devices['iPhone 13'], browserName: 'webkit' }
});
