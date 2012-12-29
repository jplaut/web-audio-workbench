var Sequencer = Backbone.Model.extend({
  defaults: function() {
    return {
      totalBeats: 16,
      patternLength: 16,
      noteType: 16
    }
  },
  initialize: function() {
    _.bindAll(this, 'play', 'playBeat', 'stop', 'addEffects', 'togglePlayback', 'setStepLength', 'handleChangePatternLength');
    this.notesplaying = [];
    this.beatIndex = null;
    this.collection = new Tracks;

    this.setStepLength();
    this.on('change:noteType', this.setStepLength);
    this.on('change:patternLength', this.handleChangePatternLength);
    app.on('change:isPlaying', this.togglePlayback);
    app.on('change:tempo', this.setStepLength);
  },
  setStepLength: function() {
    this.stepTime = (60 / app.get('tempo')) / (this.get('noteType') / 4);
  },
  handleChangePatternLength: function() {
    if (this.beatIndex >= this.get('patternLength')) {
      this.beatIndex = 0;
    }
  },
  togglePlayback: function() {
    if (!app.get('isPlaying')) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {
    if (this.beatIndex == null) this.beatIndex = app.beatClock;

    this.trigger('change:beat', this.beatIndex);

    if (this.collection.any(function(track) {return track.get('solo')})) {
      _(this.collection.where({solo: true})).chain()
        .filter(function(track) {return track.steps[this.beatIndex] == 1 && track.get('sample')}, this)
        .each(function(track) {
          this.playBeat(track.get('sample'), track.effects, 0.01);
        }, this);
    } else {
      this.collection.chain()
        .filter(function(track) {return track.steps[this.beatIndex] == 1 && track.get('sample')}, this)
        .each(function(track) {
          if (!track.get('mute')) {
            this.playBeat(track.get('sample'), track.effects, 0.01);
          }
        }, this);
      }

    this.beatIndex = (this.beatIndex == this.get('patternLength') - 1) ? 0 : this.beatIndex + 1;

    this.intervalId = setTimeout(this.play, this.stepTime * 1000);
  },
  playBeat: function(buffer, effects, time) {
    this.notesplaying = _(this.notesplaying).filter(function(note) {return note.playbackState != 3});
    var source = globals.audioContext.createBufferSource();
    source.buffer = buffer;
    var effectsChain = this.addEffects(source, effects);
    effectsChain.connect(globals.audioContext.destination);
    source.noteOn(time);
    this.notesplaying.push(source);
  },
  addEffects: function(source, effects) {
    if (effects.size() > 0 && effects.any(function(effect) {return effect.get('enabled')})) {
      effects.chain()
        .filter(function(effect) {return effect.get('enabled')})
        .each(function(effect) {
          source = effect.addEffect(globals.audioContext, source, this.beatIndex);
        }, this);
    }

    return source;
  },
  stop: function() {
    this.trigger('clear:beat');
    clearTimeout(this.intervalId);
    _(this.notesplaying).each(function(note){
        note.noteOff(0);
    });

    this.notesplaying = [];
    this.beatIndex = 0;
  }
});