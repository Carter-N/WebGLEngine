//Utility module
var utils = (function(){

  //Convert degrees to radians
  var degToRad = function(degrees){
    return degrees * Math.PI / 180;
  };

  //Get a shader from the DOM
  var getShader = function(gl, id){

    //Get the shader element from the DOM
    var shaderScript = document.getElementById(id);

    //Element does not exist
    if(!shaderScript){
      return null;
    }

    //String to pass to the GL shader compiler
    var str = "";
    var k = shaderScript.firstChild;
    while(k){

      //Add current line to string
      if(k.nodeType == 3){
        str += k.textContent;
      }

      //Move to next line
      k = k.nextSibling;
    }

    //Shader object
    var shader;

    //Load shader based on type
    if(shaderScript.type == "x-shader/x-fragment"){

      //Load fragment shader
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else if(shaderScript.type == "x-shader/x-vertex"){

      //Load vertex shader
      shader = gl.createShader(gl.VERTEX_SHADER);
    }else{
      return null;
    }

    //Compile the shaders
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    //Check for compiling errors
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      console.log(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  };

  //Push a model view matrix to the model view matrix stack
  var mvPushMatrix = function(){
    var copy = mat4.create();
    mat4.set(renderer.mvMatrix, copy);
    renderer.mvMatrixStack.push(copy);
  };

  //Pop a model view matrix from the model view matrix stack
  var mvPopMatrix = function(){

    //Check that stack is not null
    if(renderer.mvMatrixStack.length === 0){
      console.log("Cannot pop matrix from null stack");
      return;
    }
    renderer.mvMatrix = renderer.mvMatrixStack.pop();
  };

  //Normalize an RGBA value
  var normalizeRGB = function(v){
    return v / 255;
  };

  //Module visibility
  return {
    degToRad: degToRad,
    getShader: getShader,
    mvPushMatrix: mvPushMatrix,
    mvPopMatrix: mvPopMatrix,
    normalizeRGB: normalizeRGB
  };
})();
