//Store user input data
var inputManager = (function(){

  //Keyboard events
  var keysDown = new Array(180);

  //Key is pressed
  window.onkeydown = function(e){
    inputManager.keysDown[e.keyCode] = true;
  };

  //Key is released
  window.onkeyup = function(e){
    inputManager.keysDown[e.keyCode] = false;
  };

  //Module visibility
  return{
    keysDown: keysDown
  };
})();
