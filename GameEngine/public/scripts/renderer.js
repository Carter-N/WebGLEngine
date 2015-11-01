//The renderer game module
var renderer = (function(){

  //Canvas element
  var canvas;

  //GL context
  var gl;

  //Shader program
  var shaderProgram;

  //Model view matrix
  var mvMatrix = mat4.create();

  //Model view matrix stack
  var mvMatrixStack = [];

  //Perspective matrix
  var pMatrix = mat4.create();

  //Initialize the renderer
  var init = function(id){

    //Get the canvas element
    renderer.canvas = document.getElementById(id);

    //Set size
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;

    //Initialize renderer attributes
    renderer.initGL();
    renderer.initShaders();

    //Set background color
    renderer.gl.clearColor(0, 0, 0, 1.0);
    renderer.gl.enable(renderer.gl.DEPTH_TEST);
  };

  //Setup the WebGL rendering context
  var initGL = function(){
    try{
      renderer.gl = renderer.canvas.getContext("webgl");
      renderer.gl.viewportWidth = renderer.canvas.width;
      renderer.gl.viewportHeight = renderer.canvas.height;
    }catch(e){
      console.log("Error getting webGL rendering context", e);
    }
  };

  //Setup shader program
  var initShaders = function(){

    //Fragment and vertex shaders
    var fragmentShader = utils.getShader(renderer.gl, "shader-fs");
    var vertexShader = utils.getShader(renderer.gl, "shader-vs");

    //Create the shader program
    renderer.shaderProgram = renderer.gl.createProgram();
    renderer.gl.attachShader(renderer.shaderProgram, vertexShader);
    renderer.gl.attachShader(renderer.shaderProgram, fragmentShader);
    renderer.gl.linkProgram(renderer.shaderProgram);

    //Error building shader program
    if(!renderer.gl.getProgramParameter(renderer.shaderProgram, renderer.gl.LINK_STATUS)){
      console.log("Error building shader program");
    }

    //Set the shader program as the current program
    renderer.gl.useProgram(renderer.shaderProgram);

    //Locate attributes
    //Vertex position attribute
    renderer.shaderProgram.vertexPositionAttribute = renderer.gl.getAttribLocation(renderer.shaderProgram, "aVertexPosition");
    renderer.gl.enableVertexAttribArray(renderer.shaderProgram.vertexPositionAttribute);

    //Vertex normal attribute
    renderer.shaderProgram.vertexNormalAttribute = renderer.gl.getAttribLocation(renderer.shaderProgram, "aVertexNormal");
    renderer.gl.enableVertexAttribArray(renderer.shaderProgram.vertexNormalAttribute);

    //Texture coordinate attribute
    renderer.shaderProgram.textureCoordAttribute = renderer.gl.getAttribLocation(renderer.shaderProgram, "aTextureCoord");
    renderer.gl.enableVertexAttribArray(renderer.shaderProgram.textureCoordAttribute);

    //Locate uniforms
    renderer.shaderProgram.pMatrixUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uPMatrix");
    renderer.shaderProgram.mvMatrixUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uMVMatrix");
    renderer.shaderProgram.samplerUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uSampler");
    renderer.shaderProgram.ambientColorUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uAmbientColor");
    renderer.shaderProgram.lightingDirectionUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uLightingDirection");
    renderer.shaderProgram.directionalColorUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uDirectionalColor");
  };

  //Render a model at a position and rotation
  var renderModel = function(key, textureKey, transform){

    //Set model view to identity
    mat4.identity(renderer.mvMatrix);

    //Translate model view matrix 5 units back along z axis
    mat4.translate(renderer.mvMatrix, [transform.position.x, transform.position.y, transform.position.z]);

    //Rotate the model view matrix
    mat4.rotate(renderer.mvMatrix, utils.degToRad(transform.rotation.x), [1, 0, 0]);
    mat4.rotate(renderer.mvMatrix, utils.degToRad(transform.rotation.y), [0, 1, 0]);
    mat4.rotate(renderer.mvMatrix, utils.degToRad(transform.rotation.z), [0, 0, 1]);

    //Bind vertex position buffer to renderer
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelManager.models[key].modelVertexPositionBuffer);
    renderer.gl.vertexAttribPointer(renderer.shaderProgram.vertexPositionAttribute, modelManager.models[key].modelVertexPositionBuffer.itemSize, renderer.gl.FLOAT, false, 0, 0);

    //Bind vertex normal buffer to renderer
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelManager.models[key].modelVertexNormalBuffer);
    renderer.gl.vertexAttribPointer(renderer.shaderProgram.vertexNormalAttribute, modelManager.models[key].modelVertexNormalBuffer.itemSize, renderer.gl.FLOAT, false, 0, 0);

    //Bind texture coordinate buffer to renderer
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelManager.models[key].modelVertexTextureCoordBuffer);
    renderer.gl.vertexAttribPointer(renderer.shaderProgram.textureCoordAttribute, modelManager.models[key].modelVertexTextureCoordBuffer.itemSize, renderer.gl.FLOAT, false, 0, 0);

    //Set the active texture
    renderer.gl.activeTexture(renderer.gl.TEXTURE0);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, textureManager.textures[textureKey]);
    renderer.gl.uniform1i(renderer.shaderProgram.samplerUniform, 0);

    //Setup lighting for the model
    renderer.gl.uniform3f(renderer.shaderProgram.ambientColorUniform, 0.8, 0.8, 0.8);

    //Directional light
    var lightingDirection = [45, 45, -1.0];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);
    renderer.gl.uniform3fv(renderer.shaderProgram.lightingDirectionUniform, adjustedLD);
    renderer.gl.uniform3f(renderer.shaderProgram.directionalColorUniform, 20, 20, 20);

    //Bind index buffer to renderer
    renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, modelManager.models[key].modelVertexIndexBuffer);

    //Set shader uniforms
    renderer.setMatrixUniforms();

    //Draw the model
    renderer.gl.drawElements(renderer.gl.TRIANGLES, modelManager.models[key].modelVertexIndexBuffer.numItems, renderer.gl.UNSIGNED_SHORT, 0);
  };

  //Render the scene
  var render = function(){

    //Set viewport bounds
    renderer.gl.viewport(0, 0, renderer.gl.viewportWidth, renderer.gl.viewportHeight);

    //Clear buffer
    renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);

    //Set perspective matrix
    mat4.perspective(45, 1.85 / 1, 0.1, 100.0, renderer.pMatrix);

    //Render the current scene
    if(sceneManager.currentScene){
      sceneManager.currentScene.render();
    }
  };

  //Set shader matrix uniforms
  var setMatrixUniforms = function(){

    //Perspective matrix and model view matrix
    renderer.gl.uniformMatrix4fv(renderer.shaderProgram.pMatrixUniform, false, renderer.pMatrix);
    renderer.gl.uniformMatrix4fv(renderer.shaderProgram.mvMatrixUniform, false, renderer.mvMatrix);

    //Normal matrix
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(renderer.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    renderer.gl.uniformMatrix3fv(renderer.shaderProgram.nMatrixUniform, false, normalMatrix);
  };

  //Module visibility
  return {
    gl: gl,
    canvas: canvas,
    init: init,
    initGL: initGL,
    initShaders: initShaders,
    render: render,
    mvMatrix: mvMatrix,
    mvMatrixStack: mvMatrixStack,
    pMatrix: pMatrix,
    shaderProgram: shaderProgram,
    setMatrixUniforms: setMatrixUniforms,
    renderModel: renderModel
  };
})();
