var SequencerView = Backbone.View.extend({
  tagName: 'div',
  id: 'wrapper',
  events: {
    'click button#addtrack': 'createTrack',
    'click button#togglePlayback': 'togglePlayback',
    'click button#stop': 'stop',
    'change input#tempo': 'changeTempo',
    'change select#steps': 'changeNumSteps'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack','appendTrack', 'togglePlayback', 'play', 'stop', 'changeTempo', 'changeNumSteps', 'removeTrack');
    this.tempo = 120;
    this.numSteps = 8;
    this.startTime = 0;
    this.isPlaying = false;
    this.notesplaying = [];
    this.beatIndex = 0;
    this.audioContext = this.options.audioContext;
    this.collection.on('add', this.appendTrack);
    this.collection.on('remove', this.removeTrack);
    this.template = window.loadTemplate('wrapper');
  },
  render: function() {
    var self = this;

    this.$el.height(30);
    this.$el.html(this.template({numSteps: this.numSteps}));
    this.collection.each(function(track) {
      self.appendTrack(track);
    });

    return this;
  },
  createTrack: function() {
    var track = new Track();
    this.collection.add(track);
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      collection: this.collection,
      audioContext: this.audioContext,
      numSteps: this.numSteps
    });

    $('ul:first', this.el).append(trackView.render().el);
    this.$el.height(this.$el.height() + 70);
  },
  togglePlayback: function() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {
    var self = this;
    var currentTime = this.audioContext.currentTime;
    this.stepTime = (60 / this.tempo) / (this.numSteps / 4);

    if (!self.collection.any(function(track) {return track.get('sample') && track.get('steps').length > 1})) {
      return;
    }

    $("button#togglePlayback").text("Stop");

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

    if (this.beatIndex == this.numSteps - 1) {
      this.beatIndex = 0;
    } else {
      this.beatIndex++;
    }

   this.isPlaying = setTimeout(self.play, this.stepTime * 1000);
  },
  playBeat: function(buffer, time) {
    var source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.noteOn(time);
    this.notesplaying.push(source);
  },
  stop: function() {
    $("button#togglePlayback").text("Play");
    clearTimeout(this.isPlaying);
    _(this.notesplaying).each(function(note){
      note.noteOff(0);
    });

    this.notesplaying = [];
    this.isPlaying = false;
    this.beatIndex = 0;
  },
  changeTempo: function(e) {
    this.tempo = $(e.currentTarget).val();
  },
  changeNumSteps: function(e) {
    var self = this;

    var newNum = parseInt($(e.currentTarget).val());

    this.collection.each(function(track) {
      track.convertSteps(self.numSteps, newNum);
    });

    this.numSteps = newNum;
    this.render();
  },
  removeTrack: function() {
    this.render();
  }
});