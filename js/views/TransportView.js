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
    _.bindAll(this, 'render', 'play', 'stop', 'createTrack', 'togglePlayback', 'changeTempo', 'changeNumSteps', 'handleWindowResize');
    
    this.template = app.templateLoader.load('transport');
    this.isPlaying = false;
    this.notesplaying = [];
    this.beatIndex = 0;

    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    var self = this;

    this.$el.append(self.template());

    return this;
  },
  handleWindowResize: function() {
    this.$el.css('left', $(document).width() / 2 - this.$el.width() / 2);
  },
  createTrack: function() {
    var track = new Track();
    this.collection.add(track);
  },
  togglePlayback: function() {
    if (!this.collection.any(function(track) {return track.get('sample') && track.get('steps').length >= 1})) {
      return;
    }

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

    if (this.collection.any(function(track) {return track.get('solo')})) {
      this.collection.chain()
        .where({solo: true})
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')})
        .each(function(track) {
          self.playBeat(track.get('sample'), track.effects, 0);
        });
    } else {
      this.collection.chain()
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')})
        .each(function(track) {
          if (!track.get('mute')) {
            self.playBeat(track.get('sample'), track.effects, 0);
          }
        });
      }

    if (this.beatIndex == app.get('totalBeats') - app.get('beatsPerStep')) {
      this.beatIndex = 0;
    } else {
      this.beatIndex += app.get('beatsPerStep');
    }

    this.intervalId = setTimeout(this.play, app.get('stepTime') * 1000);
  },
  playBeat: function(buffer, effects, time) {
    this.notesplaying = _(this.notesplaying).filter(function(note) {return note.playbackState != 3});
    var source = app.audioContext.createBufferSource();
    source.buffer = buffer;
    var effectsChain = this.addEffects(source, effects);
    effectsChain.connect(app.audioContext.destination);
    source.noteOn(time);
    this.notesplaying.push(source);
  },
  addEffects: function(source, effects) {
    var self = this;

    if (effects.size() > 0) {
      effects.each(function(effect) {
        source = effect.addEffect(app.audioContext, source, self.beatIndex);
      })
    }

    return source;
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
    app.set({tempo: $(e.currentTarget).val()});
  },
  changeNumSteps: function(e) {
    app.set({numSteps: parseInt($(e.currentTarget).val())});

    if (this.isPlaying) {
      this.beatIndex = this.beatIndex + (this.beatIndex % app.get('beatsPerStep'));
    }
  }
});