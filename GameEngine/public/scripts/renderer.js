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
    renderer.initBuffers();
    renderer.initTextures();

    //Set background color
    renderer.gl.clearColor(utils.normalizeRGB(44), utils.normalizeRGB(62), utils.normalizeRGB(80), 1.0);
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

    //Texture coordinate attribute
    renderer.shaderProgram.textureCoordAttribute = renderer.gl.getAttribLocation(renderer.shaderProgram, "aTextureCoord");
    renderer.gl.enableVertexAttribArray(renderer.shaderProgram.textureCoordAttribute);

    //Locate uniforms
    renderer.shaderProgram.pMatrixUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uPMatrix");
    renderer.shaderProgram.mvMatrixUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uMVMatrix");
    renderer.shaderProgram.samplerUniform = renderer.gl.getUniformLocation(renderer.shaderProgram, "uSampler");
  };

  //Setup buffers
  var initBuffers = function(){

    //Vertex positions
    var cubeVertices = [
      -1.0, -1.0,  1.0, 1.0, -1.0,  1.0, 1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0, 1.0,  1.0, -1.0, 1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      1.0, -1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0,  1.0, 1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,
    ];

    //UV coordinates
    var cubeTextureCoords = [
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    //Indices
    var cubeIndices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
    ];

    //Plane
    var planeVertices = [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, 0.0];
    var planeTextureCoords = [0, 0, 1, 0, 0, 1, 1, 1];
    var planeIndices = [0, 1, 2, 1, 2, 3];

    //Add the cube model
    modelManager.addModel("cube", cubeVertices, cubeTextureCoords, cubeIndices);

    //Add the plane model
    modelManager.addModel("plane", planeVertices, planeTextureCoords, planeIndices);
  };

  //Load textures
  var initTextures = function(){

    //Cube texture
    textureManager.addTexture("cube", "image.png");
  };

  //Load texture to VRAM
  var loadTextureToVRAM = function(texture){

    //Flip pixel data
    renderer.gl.pixelStorei(renderer.gl.UNPACK_FLIP_Y_WEBGL, true);

    //Bind the texture to a 2d texture
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, texture);
    renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, texture.image);

    //Texture parameters
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);

    //Unbind texture
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);
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

    //Bind texture coordinate buffer to renderer
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelManager.models[key].modelVertexTextureCoordBuffer);
    renderer.gl.vertexAttribPointer(renderer.shaderProgram.textureCoordAttribute, modelManager.models[key].modelVertexTextureCoordBuffer.itemSize, renderer.gl.FLOAT, false, 0, 0);

    //Set the active texture
    renderer.gl.activeTexture(renderer.gl.TEXTURE0);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, textureManager.textures[textureKey]);
    renderer.gl.uniform1i(renderer.shaderProgram.samplerUniform, 0);

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

    //Draw ground
    renderer.renderModel("plane", "cube", {
      position: {
        x: 0.0, y: -3.0, z: -10.0
      },
      rotation: {
        x: 90, y: 0, z: 0
      }
    });

    //Draw ground
    renderer.renderModel("cube", "cube", {
      position: {
        x: 0.0, y: 0.0, z: -10.0
      },
      rotation: {
        x: core.rotX, y: core.rotY, z: 0.0
      }
    });
  };

  //Set shader matrix uniforms
  var setMatrixUniforms = function(){
    renderer.gl.uniformMatrix4fv(renderer.shaderProgram.pMatrixUniform, false, renderer.pMatrix);
    renderer.gl.uniformMatrix4fv(renderer.shaderProgram.mvMatrixUniform, false, renderer.mvMatrix);
  };

  //Module visibility
  return {
    gl: gl,
    canvas: canvas,
    init: init,
    initGL: initGL,
    initShaders: initShaders,
    initBuffers: initBuffers,
    initTextures: initTextures,
    render: render,
    mvMatrix: mvMatrix,
    mvMatrixStack: mvMatrixStack,
    pMatrix: pMatrix,
    shaderProgram: shaderProgram,
    setMatrixUniforms: setMatrixUniforms,
    renderModel: renderModel
  };
})();
