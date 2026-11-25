'use strict';
const {FILES,installPriorPresentation}=require('./prior-teaching-presentation');
const beforeReview=page=>installPriorPresentation(page,'unit17-18');
const readLearning=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit17-18:learning:v1')));
module.exports={FILES,beforeReview,readLearning};
