//Store model dictionary
var modelManager = (function(){

  //The model dictionary
  var models = {};

  //Add a model to the model dictionary
  var addModel = function(key, vertices, normals, textureCoords, indices){

    //Bind vertex positions
    var modelVertexPositionBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelVertexPositionBuffer);
    renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(vertices), renderer.gl.STATIC_DRAW);
    modelVertexPositionBuffer.itemSize = 3;
    modelVertexPositionBuffer.numItems = vertices.length / 3;

    //Bind model normals
    var modelVertexNormalBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelVertexNormalBuffer);
    renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(normals), renderer.gl.STATIC_DRAW);
    modelVertexNormalBuffer.itemSize = 3;
    modelVertexNormalBuffer.numItems = normals.length / 3;

    //Bind UV coordinates
    var modelVertexTextureCoordBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
    renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(textureCoords), renderer.gl.STATIC_DRAW);
    modelVertexTextureCoordBuffer.itemSize = 2;
    modelVertexTextureCoordBuffer.numItems = textureCoords.length / 2;

    //Bind vertex index list
    var modelVertexIndexBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, modelVertexIndexBuffer);
    renderer.gl.bufferData(renderer.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), renderer.gl.STATIC_DRAW);
    modelVertexIndexBuffer.itemSize = 1;
    modelVertexIndexBuffer.numItems = indices.length;

    //Add model data to dictionary
    modelManager.models[key] = {
      modelVertexPositionBuffer: modelVertexPositionBuffer,
      modelVertexTextureCoordBuffer: modelVertexTextureCoordBuffer,
      modelVertexIndexBuffer: modelVertexIndexBuffer,
      modelVertexNormalBuffer: modelVertexNormalBuffer
    };
  };

  //Load a JSON model to render
  var loadJSONModel = function(key, src){

    //HTTP request
    var request = new XMLHttpRequest();
    request.open("GET", src);

    //When loaded
    request.onreadystatechange = function(){
      if(request.readyState == 4){

        //Get JSON data
        var data = JSON.parse(request.responseText);
        modelManager.addModel(key, data.vertices, data.normals, data.uvs, data.indices);
      }
    }
    request.send();
  };

  //Module visibility
  return {
    models: models,
    addModel: addModel,
    loadJSONModel: loadJSONModel
  };
})();
