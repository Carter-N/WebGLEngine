//Scene manager to determine which scenes to be rendered and updated
var sceneManager = (function(){

  //Scene object list
  var scenes = {};

  //The current scene
  var currentScene;

  //Add a scene to the scene list
  var addScene = function(key, scene){
    sceneManager.scenes[key] = scene;
  };

  //Set the scene
  var setScene = function(key){
    sceneManager.currentScene = sceneManager.scenes[key];
    sceneManager.currentScene.init();
  };

  return {
    scenes: scenes,
    addScene: addScene,
    setScene: setScene,
    currentScene: currentScene
  };
})();
