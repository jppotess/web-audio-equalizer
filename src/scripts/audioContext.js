// audio Context

// audio context w/ fallbacks
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var source;
var analyser = audioContext.createAnalyser();
var canvasEQ = document.querySelector("canvas#eq");
var canvas = canvasEQ.getContext("2d");
var play = document.querySelector("button.play");
var stop = document.querySelector("button.stop");

// request animation fallbacks
window.requestAnimationFrame = (function(){
return window.requestAnimationFrame  ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function(callback){
  window.setTimeout(callback, 1000 / 60);
};
})();

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

      source.connect(analyser);

      // get data
      // var freqDomain = new Float32Array(analyser.frequencyBinCount);
      // analyser.getFloatFrequencyData(freqDomain);

      //  frequency domain
      var delay = 5;
      var delayCount = 0;


      // objectname.canvas.width= this.WIDTH *** replace
      // ovjectname.canvas.height = this.HEIGHT *** replace
      var times = new Uint8Array(analyser.frequencyBinCount);



        if(delayCount == 0 || delayCount == delay) {
          analyser.getByteFrequencyData(times);

          for (var i = 0; i < times.length; i++) {
            console.log("tl " + times.length);
            console.log("times " + times[i]);
            var value = times[i];
            var percent = value / 256;
            var height = 400 * percent;
            var offset = 400 - height - 1;
            var barWidth = 600/analyser.frequencyBinCount;
            var hue = i/analyser.frequencyBinCount * 360;
            canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
            canvas.fillRect(i * barWidth, offset, barWidth, height);
          }
          delayCount = 1;
        } else {
          delayCount++;
        }

      // // time domain
      // var timeDomain = new Uint8Array(analyser.frequencyBinCount);
      // analyser.getByteTimeDomainData(freqDomain);
      // for (var i = 0; i < analyser.frequencyBinCount; i++) {
      //   var value = timeDomain[i];
      //   var percent = value / 256;
      //   var height = 400 * percent;
      //   var offset = 400 - height - 1;
      //   var barWidth = 600/analyser.frequencyBinCount;
      //   canvas.fillStyle = 'black';
      //   canvas.fillRect(i * barWidth, offset, 1, 1);
      // }

      function getFrequencyValue(frequency) {
        var nyquist = context.sampleRate/2;
        let index = Math.round(frequency/nyquist * freqDomain.length);
      }




      analyser.connect(audioContext.destination);
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

