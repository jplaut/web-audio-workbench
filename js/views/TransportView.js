var TransportView = Backbone.View.extend({
  tagName: 'div',
  id: 'transport',
  events: {
    'click button#addtrack': 'createTrack',
    'click span#togglePlayback': 'togglePlayback',
    'click button#stop': 'stop',
    'change input#tempo': 'changeTempo',
    'change select#steps': 'changeNumSteps'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'createTrack', 'togglePlayback', 'changeTempo', 'changeNumSteps');
    
    this.template = window.templateLoader.load('transport');
    this.isPlaying = false;
    this.notesplaying = [];
    this.beatIndex = 0;
    this.calculateStepTime();

    window.globals.on('change:tempo change:numSteps', this.calculateStepTime)
  },
  render: function() {
    var self = this;

    this.$el.append(self.template());

    return this;
  },
  createTrack: function() {
    var track = new Track();
    this.collection.add(track);
  },
  togglePlayback: function() {
    if (this.isPlaying) {
      $("span#togglePlayback img").attr("src", "img/play.png");
      this.isPlaying = false;
      this.stop();
    } else {
      $("span#togglePlayback img").attr("src", "img/stop.png");
      this.isPlaying = true;
      this.play();
    }
  },
  play: function() {
    var self = this;

    var currentTime = window.globals.audioContext.currentTime + 0.005;

    if (!self.collection.any(function(track) {return track.get('sample') && track.get('steps').length >= 1})) {
      return;
    }

    if (self.collection.any(function(track) {return track.get('solo')})) {
      _(self.collection
        .where({solo: true})
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')}))
        .each(function(track) {
          self.playBeat(track.get('sample'), 0);
        });
    } else {
      _(self.collection
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')}))
        .each(function(track) {
          if (!track.get('mute')) {
            self.playBeat(track.get('sample'), 0);
          }
        });
      }

    if (this.beatIndex == window.globals.get('numSteps') - 1) {
      this.beatIndex = 0;
    } else {
      this.beatIndex++;
    }

   this.intervalId = setTimeout(self.play, self.stepTime * 1000);
  },
  playBeat: function(buffer, time) {
    this.notesplaying = _(this.notesplaying).filter(function(note) {return note.playbackState != 3});
    var source = window.globals.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(window.globals.audioContext.destination);
    source.noteOn(time);
    this.notesplaying.push(source);
  },
  stop: function() {
    clearTimeout(this.intervalId);
    _(this.notesplaying).each(function(note){
        note.noteOff(0);
    });

    this.notesplaying = [];
    this.beatIndex = 0;
  },
  changeTempo: function(e) {
    window.globals.set({tempo: $(e.currentTarget).val()});
  },
  changeNumSteps: function(e) {
    window.globals.set({numSteps: parseInt($(e.currentTarget).val())});
  },
  calculateStepTime: function() {
    this.stepTime = (60 / window.globals.get('tempo')) / (window.globals.get('numSteps') / 4);
  }
});