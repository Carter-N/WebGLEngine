


var xRot = 0;
var xSpeed = 0;

var yRot = 0;
var ySpeed = 0;

var z = -5.0;

var filter = 0;


var currentlyPressedKeys = {};

function handleKeyDown(event){
currentlyPressedKeys[event.keyCode] = true;

if (String.fromCharCode(event.keyCode) == "F"){
filter += 1;
if (filter == 3){
filter = 0;
}
}
}


function handleKeyUp(event){
currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys(){
if (currentlyPressedKeys[33]){
// Page Up
z -= 0.05;
}
if (currentlyPressedKeys[34]){
// Page Down
z += 0.05;
}
if (currentlyPressedKeys[37]){
// Left cursor key
ySpeed -= 1;
}
if (currentlyPressedKeys[39]){
// Right cursor key
ySpeed += 1;
}
if (currentlyPressedKeys[38]){
// Up cursor key
xSpeed -= 1;
}
if (currentlyPressedKeys[40]){
// Down cursor key
xSpeed += 1;
}
}


var lastTime = 0;

function animate(){
var timeNow = new Date().getTime();
if (lastTime != 0){
var elapsed = timeNow - lastTime;

xRot += (xSpeed * elapsed) / 1000.0;
yRot += (ySpeed * elapsed) / 1000.0;
}
lastTime = timeNow;
}


function tick(){
requestAnimFrame(tick);
handleKeys();
drawScene();
animate();
}



function webGLStart(){
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initGL(canvas);
initShaders();
initBuffers();
initTexture();

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

tick();
}
