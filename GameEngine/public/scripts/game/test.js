//Scene to test engine
var testScene = {

  //Test rotation
  rotY: 0,

  //Load assets and setup scene
  init: function(){

    //Cube model
    modelManager.loadJSONModel("cube", "res/models/cube.json");

    //Cube texture
    textureManager.addTexture("cube", "res/textures/cube.jpg");
  },

  //Render the scene
  render: function(){

    //Increment rotation
    testScene.rotY++;

    //Draw a cube
    renderer.renderModel("cube", "cube", {
      position: {
        x: 0, y: 0, z: -50.0
      },
      rotation: {
        x: 45, y: testScene.rotY, z: 0
      }
    });

    //Draw a cube
    renderer.renderModel("cube", "cube", {
      position: {
        x: -30, y: 0, z: -50.0
      },
      rotation: {
        x: 45, y: -testScene.rotY, z: 0
      }
    });

    //Draw a cube
    renderer.renderModel("cube", "cube", {
      position: {
        x: 30, y: 0, z: -50.0
      },
      rotation: {
        x: 45, y: -testScene.rotY, z: 0
      }
    });
  }
};
