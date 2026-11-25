/* Lesson-specific scene adaptation; shared behavior lives in core/learning-flow. */
(function(core){
 core.learningFlowOptions={storySelector:'#unit12-dialogue',prepareStory(scene){
  const bag=scene.querySelector('.dialogue-handbag');
  const parent=scene.classList.contains('has-returned-bag')?scene.querySelector('[data-actor="woman"]'):scene;
  if(bag&&bag.parentElement!==parent)parent.append(bag);
 }};
})(globalThis.CanranCore);
