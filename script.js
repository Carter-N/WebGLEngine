var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var graphOffset = 0;

//Circles to draw
var circles = [
  {
    frequency: 1,
    radius: 200,
    theta: 0
  }
];

var buffer;
var lastPosition = {
  x: 0,
  y: 0
};

function setup(){
  noFill();
  graph = createGraphics();
  createCanvas(windowWidth, windowHeight / 2);
  buffer = createGraphics(windowWidth, windowHeight / 2);
  buffer.stroke(255, 0, 100);
  angleMode(DEGREES);
}

function draw(){
  background(255);
  drawCircles();
  image(buffer, 0, 0);
}

function drawCircles(){

  var drawCircle = function(index, x, y){

    //Base case
    if(index == circles.length){

      if(lastPosition.x === 0 && lastPosition.y === 0){
        lastPosition.x = x;
        lastPosition.y = y;
        return;
      }

      //Draw point and connector
      strokeWeight(5);
      point((windowWidth / 3) + frameCount % 360, y);

      strokeWeight(1);
      line(x, y, (windowWidth / 3) + frameCount % 360, y);

      //Draw graph
      buffer.line((windowWidth / 3) + frameCount - 1, lastPosition.y, (windowWidth / 3) + frameCount, y);

      //Draw red line of path
      buffer.strokeWeight(2);
      buffer.line(x, y, lastPosition.x, lastPosition.y);

      //Push new positions
      lastPosition.x = x;
      lastPosition.y = y;
      return;
    }

    //The current circle to draw
    var circle = circles[index];

    //Increment theta by frequency
    circle.theta += circle.frequency;

    //Draw the circle
    strokeWeight(1);
    ellipse(x, y, circle.radius * 2, circle.radius * 2);

    //Draw the point
    var pointX = x + cos(circle.theta) * circle.radius;
    var pointY = y + sin(circle.theta) * circle.radius;

    strokeWeight(5);
    point(pointX, pointY);

    //Draw line
    strokeWeight(1);
    line(x, y, pointX, pointY);

    //Draw the next circle
    index += 1;
    drawCircle(index, pointX, pointY);
  };

  //Recursivley draw circles to the canvas
  drawCircle(0, (windowWidth / 3) / 2, (windowHeight / 2) / 2);
}
