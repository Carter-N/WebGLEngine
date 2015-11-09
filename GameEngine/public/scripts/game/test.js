//Scene to test engine
var testScene = {

  //Test rotation
  rotX: 0,
  rotY: 0,
  velX: 0,
  velY: 0,

  //Load assets and setup scene
  init: function(){

    //Load models
    modelManager.loadJSONModel("teapot", "res/models/teapot.json");
    modelManager.loadJSONModel("laptop", "res/models/laptop.json");

    //Load textures
    textureManager.addTexture("cube", "res/textures/cube.jpg");
    textureManager.addTexture("grad", "res/textures/grad.png");

    //Load audio
    audioManager.loadAudio("test", "res/audio/test.wav");

    //Setup lighting
    lightingManager.addAmbientLight([0.2, 0.2, 0.2]);
    lightingManager.addDirectionalLight([-0.25, -0.25, -1.0], [0.8, 0.8, 0.8]);
  },

  //Render the scene
  render: function(){

    //Increment rotation
    testScene.rotY += testScene.velY;
    testScene.rotX += testScene.velX;

    //Check input
    if(inputManager.keysDown[87]){
      testScene.velX -= 0.01;
    }

    if(inputManager.keysDown[83]){
      testScene.velX += 0.01;
    }

    if(inputManager.keysDown[65]){
      testScene.velY -= 0.01;
    }

    if(inputManager.keysDown[68]){
      testScene.velY += 0.01;
    }

    //Draw models
    renderer.renderModel("laptop", "grad", {position: [2, 0, -5.0], rotation: [testScene.rotX,testScene.rotY, 0]});
    renderer.renderModel("teapot", "cube", {position: [-5, 0, -50.0], rotation: [testScene.rotX,testScene.rotY, 0]});
  }
};
