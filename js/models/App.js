var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      isPlaying: false
    }
  },
  initialize:function() {
    _.bindAll(this, 'togglePlayback', 'toggleBeatClock', 'setStepTime');

    this.beatIndex = 0;
    this.noteTime = 0;
    this.audioOut = globals.audioContext.createGainNode();
    this.audioOut.connect(globals.audioContext.destination);
    this.setStepTime();

    this.on('change:isPlaying', this.togglePlayback);
    this.on('change:tempo', this.changeStepTime);
  },
  setStepTime: function() {
    this.stepTime = 60 / this.get('tempo') / 16;
  },
  togglePlayback: function() {
    if (this.get('isPlaying')) {
      this.startTime = globals.audioContext.currentTime;
      this.toggleBeatClock();
    } else {
      clearTimeout(this.interval);
      this.beatIndex = 0;
      this.noteTime = 0;
    }
  },
  toggleBeatClock: function() {
    var elapsedTime = globals.audioContext.currentTime - this.startTime;

    if (this.noteTime < elapsedTime) {
      this.trigger('beat', this.beatIndex);
      this.beatIndex = (this.beatIndex == 63) ? 0: this.beatIndex + 1;
      this.noteTime += this.stepTime;
    }

    this.interval = setTimeout(this.toggleBeatClock, 0);
  },
  exportAudio: function() {
    var rec = new Recorder(this.audioOut, {workerPath: "lib/recorderWorker.js"});
  }
});