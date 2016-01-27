// audio Context

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var source;
var play = document.querySelector("button.play");
var stop = document.querySelector("button.stop");

// Load the audio data
function getData() {
  source = audioContext.createBufferSource();

  var request = new XMLHttpRequest();

  request.open('GET', '../vendor/music/home.m4a', true)
  request.responseType = 'arraybuffer';

  request.onload = function() {

    var audioData = request.response;

    audioContext.decodeAudioData(audioData, function(buffer) {
      source.buffer = buffer;

      source.connect(audioContext.destination);
      source.loop = true;
    },function(e){"Error with decoding audio data: " + e.err});

  }
  request.send();
}

// Set Play and Pause(Stop) buttons

play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
}

stop.onclick = function() {
  source.stop(0);
  play.removeAttribute('disabled');
}

