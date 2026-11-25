'use strict';

const vm=require('node:vm'),catalog=require('../core/course-catalog');
// Evaluate the project's own authored teaching definition in the same context
// for package discovery and server-side progress validation.
function teachingDefinition(source,course){
  const sandbox={CanranCore:{courseCatalog:catalog},document:{documentElement:{dataset:{unit:course}}}};
  vm.runInNewContext(source,sandbox,{filename:course+'/content.js'});
  return sandbox.CanranCore['unit'+course.slice(4).replace('-','')];
}

module.exports = { PUBLISHED_COURSES:catalog.PUBLISHED_COURSES,teachingDefinition };
