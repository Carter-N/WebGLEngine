//The core game module
var core = (function(){

  //Test cube rotation
  var rotX = 0;
  var rotY = 0;
  var rotZ = 0;

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

    //Rotate model
    core.rotX += 1;
    core.rotY -= 1;
  };

  //Module visibility
  return {
    init: init,
    start: start,
    update: update,

    //Test cube rotation
    rotX: rotX,
    rotY: rotY,
    rotZ: rotZ
  };
})();
