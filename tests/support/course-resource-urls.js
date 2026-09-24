'use strict';
// Feedback keeps its independently named files when published at a content address.
function isFeedbackAudio(url) {
  return /\/(?:assets\/feedback\/|resources\/[a-f0-9]{64}\/)duolingo-(?:correct|incorrect|complete)\.mp3$/.test(new URL(url).pathname);
}
module.exports = { isFeedbackAudio };
