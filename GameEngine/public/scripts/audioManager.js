//Manage audio to play in game
var audioManager = (function(){

  //Audio dictionary
  var audio = {};

  //Load an audio track
  var loadAudio = function(key, src){

    //Load the audio track
    var track = new Audio();
    track.src = src;

    track.onload = function(){
      audioManager.audio[key] = track;
      audioManager.audio[key].play();
    };
  };

  //Play a loaded audio track
  var playAudio = function(key){
    audioManager.audio[key].play();
  };

  //Module visibility
  return {
    audio: audio,
    loadAudio: loadAudio,
    playAudio: playAudio
  };
})();
