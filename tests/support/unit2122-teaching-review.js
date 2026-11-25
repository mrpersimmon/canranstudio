'use strict';
const {FILES,installPriorPresentation}=require('./prior-teaching-presentation');
const beforeReview=page=>installPriorPresentation(page,'unit21-22');
const readLearning=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit21-22:learning:v1')));
module.exports={FILES,beforeReview,readLearning};
