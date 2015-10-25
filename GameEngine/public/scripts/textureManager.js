//Store dictionary of textures
var textureManager = (function(){

  //Texture dictionary
  var textures = {};

  //Add a texture to the dictionary and load it
  var addTexture = function(key, src){

    //Create the texture object
    var texture = renderer.gl.createTexture();

    //Load the image that will be bound to the texture
    texture.image = new Image();
    texture.image.onload = function(){
      textureManager.bindTextureToVRAM(texture);
    };
    texture.image.src = src;

    //Add texture to texture dictionary
    textureManager.textures[key] = texture;
  };

  //Bind the loaded image to a texture in VRAM
  var bindTextureToVRAM = function(texture){

    //Bind the image to a texture 2d object
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, texture);

    //Flip Y axis
    renderer.gl.pixelStorei(renderer.gl.UNPACK_FLIP_Y_WEBGL, true);

    //Apply filters and other parameters
    renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, texture.image);
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);
  };

  //Module visibility
  return {
    textures: textures,
    addTexture: addTexture,
    bindTextureToVRAM: bindTextureToVRAM
  };
})();
