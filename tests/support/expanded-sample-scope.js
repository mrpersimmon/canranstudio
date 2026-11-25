'use strict';
// Node preload used by the focused workflow tasks; no production code loads it.
const units=['unit13-14','unit15-16','unit17-18','unit19-20','unit21-22','unit23-24'];
for(const key of ['SAMPLE_UNITS','ROLLOUT_UNITS','WORD_DECK_UNITS'])process.env[key]=units.join(',');
