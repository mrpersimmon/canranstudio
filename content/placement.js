'use strict';
// Reviewed entry-level prompts supplement the existing written challenges.
// Every answer is an already taught source; no new language is invented by UI.
module.exports = {
  version: 1, questionCount: 20, maxMistakes: 5, skippedShare: 0.7,
  foundation: [
    ['L01-D01','打扰一下。'], ['L01-W07','手提包','word'],
    ['L01-D03','这是你的手提包吗？'], ['L01-D04','请再说一遍？（用一个词）'],
    ['L01-D06','是的，它是。'], ['L01-D07','非常感谢你。'],
    ['NCE-U01-C-Q-WATCH','这是你的手表吗？'],
    ['NCE-U01-C-Q-COAT','这是你的外套吗？'],
    ['NCE-U01-C-Q-CAR','这是你的汽车吗？'],
    ['NCE-U01-C-Q-HOUSE','这是你的房子吗？'],
    ['L02-W01','钢笔','word'], ['L02-W02','铅笔','word'], ['L02-W03','书','word'],
    ['L02-W04','手表','word'], ['L02-W05','外套','word'], ['L02-W06','连衣裙','word'],
    ['L02-W07','短裙','word'], ['L02-W08','衬衫','word'], ['L02-W09','汽车','word'], ['L02-W10','房子','word']
  ],
  // Gap variants keep the earliest placement varied without duplicate prompts.
  gaps: {
    'L01-D01': ['Excuse ', 'me', '!'],
    'L01-D07': ['Thank you ', 'very much', '.'],
    'NCE-U01-C-Q-COAT': ['Is this ', 'your', ' coat?'],
    'NCE-U01-C-Q-HOUSE': ['Is ', 'this', ' your house?']
  }
};
