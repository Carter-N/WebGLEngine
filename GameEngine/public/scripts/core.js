//The core game module
var core = (function(){

  //Initialize engine
  var init = function(){

    //Setup renderer
    renderer.init("canvas");

    //Start updating loop
    core.start();
  };

  //Start the rendering loop
  var start = function(){
    core.update();
  };

  //Game update
  var update = function(){

    //Update loop
    requestAnimFrame(core.update);
    renderer.render();
  };

  //Module visibility
  return {
    init: init,
    start: start,
    update: update
  };
})();
