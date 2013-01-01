var Sequencer = Backbone.Model.extend({
  defaults: function() {
    return {
      totalBeats: 16,
      patternLength: 16,
      noteType: 16
    }
  },
  initialize: function() {
    _.bindAll(this, 'play', 'playBeat', 'addEffects', 'togglePlayback', 'handleChangePatternLength');
    this.notesplaying = [];
    this.collection = new Tracks;

    this.relativeBeatIndex = Math.ceil(app.beatIndex / (64 / this.get('noteType')));

    this.on('change:patternLength', this.handleChangePatternLength);
    app.on('change:isPlaying', this.togglePlayback);
    app.on('beat', this.play);
  },
  handleChangePatternLength: function() {
    if (this.relativeBeatIndex >= this.get('patternLength')) {
      this.relativeBeatIndex = 0;
    }
  },
  togglePlayback: function() {
    if (!app.get('isPlaying')) {
      this.trigger('clear:beat');
      this.relativeBeatIndex = 0;
      this.notesplaying = [];
    }
  },
  play: function(beatIndex) {
    if (beatIndex % (64 / this.get('noteType')) == 0) {
      this.trigger('change:beat', this.relativeBeatIndex);

      if (this.collection.any(function(track) {return track.get('solo')})) {
        _(this.collection.where({solo: true})).chain()
          .filter(function(track) {return track.steps[this.relativeBeatIndex] == 1 && track.get('sample')}, this)
          .each(function(track) {
            this.playBeat(track.get('sample'), track.effects, 0);
          }, this);
      } else {
        this.collection.chain()
          .filter(function(track) {return track.steps[this.relativeBeatIndex] == 1 && track.get('sample')}, this)
          .each(function(track) {
            if (!track.get('mute')) {
              this.playBeat(track.get('sample'), track.effects, 0);
            }
          }, this);
        }

      this.relativeBeatIndex = (this.relativeBeatIndex == this.get('patternLength') - 1) ? 0 : this.relativeBeatIndex + 1;
    }
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
          source = effect.addEffect(globals.audioContext, source, this.relativeBeatIndex);
        }, this);
    }

    return source;
  }
});