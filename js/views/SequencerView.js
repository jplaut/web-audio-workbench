var SequencerView = Backbone.View.extend({
  el: $('#wrapper'),
  events: {
    'click button#addtrack': 'createTrack',
    'click button#play': 'play',
    'click button#stop': 'stop',
    'change input#tempo': 'changeTempo',
    'change select#steps': 'changeNumSteps'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack','appendTrack', 'play', 'stop', 'changeTempo', 'changeNumSteps', 'removeTrack');
    this.tempo = 120;
    this.numSteps = 8;
    this.startTime = 0;
    this.isPlaying = false;
    this.notesplaying = [];
    this.beatIndex = 0;
    this.audioContext = this.options.audioContext;
    this.collection.on('add', this.appendTrack);
    this.collection.on('remove', this.removeTrack);
    this.template = Handlebars.compile($("#wrapper-template").html());
    this.render();
  },
  render: function() {
    var self = this;

    $(this.el).empty();
    $(this.el).height(30);
    $(this.el).append(this.template({numSteps: this.numSteps}));
    this.collection.each(function(track) {
      self.appendTrack(track);
    });

    return this;
  },
  createTrack: function() {
    var track = new Track({numSteps: this.numSteps});
    this.collection.add(track);
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      collection: this.collection,
      audioContext: this.audioContext
    });

    $('ul', this.el).append(trackView.render().el);
    $(this.el).height($(this.el).height() + 70);
  },
  play: function() {
    var self = this;
    var currentTime = this.audioContext.currentTime;
    this.stepTime = (60 / this.tempo) / (this.numSteps / 4);

    if (!self.collection.any(function(track) {return track.get('sample')})) {
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

    this.numSteps = parseInt($(e.currentTarget).val());

    this.collection.each(function(track) {
      track.convertSteps(self.numSteps);
    });


    $(this.el).height(30);
    this.render();
  },
  removeTrack: function() {
    this.render();
  }
});