//Store user input data
var inputManager = (function(){

  //Keyboard events
  var keysDown = new Array(180);

  //Mouse positions
  var mouseX;
  var mouseY;

  //Mouse pressed
  var mousePressed = false;

  //Key is pressed
  window.onkeydown = function(e){
    inputManager.keysDown[e.keyCode] = true;
  };

  //Key is released
  window.onkeyup = function(e){
    inputManager.keysDown[e.keyCode] = false;
  };

  //When mouse is moved
  window.onmousemove = function(e){
    inputManager.mouseX = e.clientX;
    inputManager.mouseY = e.clientY;
  };

  //Mouse is pressed
  window.onmousedown = function(e){
    inputManager.mouseDown = true;
  };

  //Mouse is released
  window.onmouseup = function(e){
    inputManager.mouseDown = false;
  };

  //Module visibility
  return{
    keysDown: keysDown,
    mouseX: mouseX,
    mouseY: mouseY,
    mousePressed: mousePressed
  };
})();
