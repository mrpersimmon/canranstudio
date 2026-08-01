(function attachLessonStory(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.lessonStory = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function lessonStoryFactory() {
  'use strict';

  const FOOD_BASKET_ID = 'food-basket';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  const STANDALONE_OPENING = deepFreeze({
    variant: 'standalone',
    eyebrow: '一封来自城堡的求助信',
    title: '挑食小王子需要你的帮助',
    body: '皇家御厨遇到了难题：小王子总说 “I don’t like…”。不用准备任何道具，从蔬果图鉴开始，就能帮他学会好好吃饭。',
    startLabel: '🚀 开始冒险！',
    skipLabel: null,
    souvenir: null
  });

  const BASKET_OPENING = deepFreeze({
    variant: 'basket',
    eyebrow: '从暖灯集市来到城堡',
    title: '篮子里的香味，飘进了城堡',
    body: '你带着在肉店冒险中获得的食物篮子来到城堡。挑食小王子探出头来：这次，我们一起看看他喜欢什么吧！',
    startLabel: '🧺 带着篮子开始',
    skipLabel: '跳过小故事，直接开始',
    souvenir: {
      id: FOOD_BASKET_ID,
      title: '食物篮子',
      asset: '/assets/adventure-map/lesson49/food-basket.png'
    }
  });

  function lesson50Opening(profile) {
    const ownsBasket = Array.isArray(profile?.souvenirs) &&
      profile.souvenirs.includes(FOOD_BASKET_ID);
    return ownsBasket ? BASKET_OPENING : STANDALONE_OPENING;
  }

  return Object.freeze({ FOOD_BASKET_ID, lesson50Opening });
});
