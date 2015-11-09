//Module to manage lighting in scenes
var lightingManager = (function(){

  //Light dictionary
  var lights = {
    ambientLight: null,
    directionalLights: [],
    pointLights: []
  };

  //Set ambient light color
  var addAmbientLight = function(color){
    lightingManager.lights.ambientLight = color;
  };

  //Add a directional light to the scene
  var addDirectionalLight = function(direction, color){
    lightingManager.lights.directionalLights.push({
      direction: direction,
      color: color
    });
  };

  //Add a point light to the scene
  var addPointLight = function(position, color){

  };

  //Module visibility
  return {
    lights: lights,
    addAmbientLight: addAmbientLight,
    addDirectionalLight: addDirectionalLight,
    addPointLight: addPointLight
  };
})();
