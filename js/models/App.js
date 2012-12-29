var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      isPlaying: false
    }
  },
  initialize:function() {
    _.bindAll(this, 'toggleBeatClock');

    this.beatClock = -1;
    this.on('change:isPlaying', this.toggleBeatClock);
  },
  toggleBeatClock: function(stepTime) {
    if (this.get('isPlaying')) {
      stepTime = (typeof stepTime != "number") ? 60 / this.get('tempo') / 4 : stepTime;
      this.beatClock = (this.beatClock == 15) ? 0 : this.beatClock + 1;
      this.interval = setTimeout(this.toggleBeatClock, stepTime * 1000, stepTime);
    } else {
      clearTimeout(this.interval);
      this.beatClock = -1;
    }
  }
});