//Scene to test engine
var testScene = {

  //Test rotation
  rotX: 0,
  rotY: 0,
  velX: 0,
  velY: 0,

  //Load assets and setup scene
  init: function(){

    //Cube model
    modelManager.loadJSONModel("teapot", "res/models/teapot.json");
    modelManager.loadJSONModel("laptop", "res/models/laptop.json");

    //Cube texture
    textureManager.addTexture("cube", "res/textures/cube.jpg");
    textureManager.addTexture("grad", "res/textures/grad.png");
  },

  //Render the scene
  render: function(){

    //Increment rotation
    testScene.rotY += testScene.velY;
    testScene.rotX += testScene.velX;

    //Check input
    if(inputManager.keysDown[87]){
      testScene.velX += 0.01;
    }

    if(inputManager.keysDown[83]){
      testScene.velX -= 0.01;
    }

    if(inputManager.keysDown[65]){
      testScene.velY += 0.01;
    }

    if(inputManager.keysDown[68]){
      testScene.velY -= 0.01;
    }

    //Generate a quad plane with random noise
    var generateTerrain = function(){

    };

    //Draw a cube
    renderer.renderModel("laptop", "grad", {
      position: {x: 2, y: 0, z: -5.0},
      rotation: {x: testScene.rotX, y: testScene.rotY, z: 0}
    });

    renderer.renderModel("teapot", "cube", {
      position: {x: -2, y: 0, z: -5.0},
      rotation: {x: testScene.rotX, y: testScene.rotY, z: 0}
    });
  }
};
