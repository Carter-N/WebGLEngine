//Global gl context
var gl;

//Global vertex and color buffers
//Triangle
var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;

//Square
var squareVertexPositionBuffer;
var squareVertexColorBuffer;

//Global pprojection matricies
var mvMatrix = mat4.create();

//The matrix stack
var mvMatrixStack = [];
var pMatrix = mat4.create();

//Global shader program
var shaderProgram;

//Global delta time
var lastTime = 0;

//Rotation of square and triangle
var rTri = 0;
var rSquare = 0;

//Initialize webGL
var webGLStart = function(){

  //Canvas element
  var canvas = document.getElementById("canvas");

  //Set canvas width and height
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //Initialze shaders, buffers, and webGL context
  initGL(canvas);
  initShaders();
  initBuffers();

  //Set background color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  //Render the scene
  tick();
};

//Update
var tick = function(){
  requestAnimFrame(tick);
  drawScene();
  animate();
};

//Animate scene
var animate = function(){

  //Get current time
  var timeNow = new Date().getTime();

  //If time has passed since last tick
  if(lastTime !== 0){

    //Get change in time
    var elapsed = timeNow - lastTime;

    //Smoothly animate models
    rTri += (90 * elapsed) / 1000.0;
    rSquare += (75 * elapsed) / 1000.0;
  }

  //Update last time
  lastTime = timeNow;
};

//Initialze the webGL rendering context
var initGL = function(canvas){

  //Attempt to load a webGL context from the canvas
  try{

    //Get canvas context
    gl = canvas.getContext("webgl");

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }catch(e){
    console.log("Error fetching webGL context", e);
  }

  //Error fetching context
  if(!gl){
    console.log("Could not find rendering context");
  }
};

//Create shader program
var initShaders = function(){

  //Get shaders from the DOM
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  //Create the shader program and attach shaders to it
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  //Error initializing shaders
  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
    console.log("Could not initialize shaders");
  }

  gl.useProgram(shaderProgram);

  //Set attributes
  //Position
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  //Color
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  //Set uniforms
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
};

//Helper method to get a shader from the DOM
var getShader = function(gl, id){

  //Get the element by id
  var shaderScript = document.getElementById(id);
  if(!shaderScript){
    return null;
  }

  //Extract shader code
  var str = "";
  var k = shaderScript.firstChild;
  while(k){
    if(k.nodeType == 3){
      str += k.textContent;
      k = k.nextSibling;
    }
  }

  //Construct the shader
  var shader;
  if(shaderScript.type == "x-shader/x-fragment"){
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }else if(shaderScript.type == "x-shader/x-vertex"){
    shader = gl.createShader(gl.VERTEX_SHADER);
  }else{
    return null;
  }

  //Compile the shader
  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  //Error compiling shader
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
};

//Initialize scene buffers
var initBuffers = function(){

  //Setup and bind triagle buffers to VRAM
  triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

  //Triangle verticies
  var vertices = [
    0.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
  ];

  //Add verticies to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //Set buffer properties
  triangleVertexPositionBuffer.itemSize = 3;
  triangleVertexPositionBuffer.numItems = 3;

  //Create color buffer
  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

  //Color buffer data
  var colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  //Color buffer properties
  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numItems = 3;

  //Setup and bind square buffers to VRAM
  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

  //Square verticies
  vertices = [
    1.0,  1.0,  0.0,
    -1.0,  1.0,  0.0,
    1.0, -1.0,  0.0,
    -1.0, -1.0,  0.0
  ];

  //Add verticies to buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //Set buffer properties
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  //Create square color buffer
  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);

  //Bind data to color buffer
  colors = [];
  for(var i=0; i < 4; i++){
    colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  //Square color buffer properties
  squareVertexColorBuffer.itemSize = 4;
  squareVertexColorBuffer.numItems = 4;
};

//Draw the scene
var drawScene = function(){

  //Set viewport
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  //Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Set perspective matrix on viewport
  mat4.perspective(45, 16 / 9, 0.1, 100.0, pMatrix);
  mat4.identity(mvMatrix);

  //Move camera
  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

  //Rotate the triangle
  mvPushMatrix();
  mat4.rotate(mvMatrix, degToRad(rTri), [0, 1, 0]);

  //Bind the triangle buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  //Color buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();

  //Draw triangle
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

  //Pop the translation matrix
  mvPopMatrix();

  //Move perspective
  mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);

  //Rotate the square
  mvPushMatrix();
  mat4.rotate(mvMatrix, degToRad(rSquare), [1, 0, 0]);

  //Bind square buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  //Color buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();

  //Draw the square
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

  //Pop translation matrix
  mvPopMatrix();
};

//Set the shader matrix uniforms
var setMatrixUniforms = function(){
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
};

//Helper method to push a matrix to the stack
var mvPushMatrix = function(){
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
};

//Helper function to remove a matrix from the stack
var mvPopMatrix = function(){
  if(mvMatrixStack.length === 0){
    console.log("Matrix stack is null, cannot execute operation");
    return;
  }
  mvMatrix = mvMatrixStack.pop();
};

//Helper method to convert radians to degrees
var degToRad = function(degrees){
  return degrees * Math.PI / 180;
};
