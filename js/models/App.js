var App = Backbone.Model.extend({
  defaults: function() {
    return {
      totalBeats: 16,
      tempo: 120,
      patternLength: 16,
      noteType: 16,
      editingSteps: 0,
      isPlaying: false
    }
  },
  initialize: function() {
    _.bindAll(this, 'play', 'playBeat', 'stop', 'addEffects', 'togglePlayback', 'setStepLength', 'handleChangePatternLength');
    this.trackList = new TrackList;
    this.notesplaying = [];
    this.beatIndex = 0;

    this.setStepLength();
    this.on('change:isPlaying', this.togglePlayback);
    this.on('change:noteType change:tempo', this.setStepLength);
    this.on('change:patternLength', this.handleChangePatternLength);
  },
  setStepLength: function() {
    this.stepTime = (60 / this.get('tempo')) / (this.get('noteType') / 4);
  },
  handleChangePatternLength: function() {
    if (this.beatIndex >= this.get('patternLength')) {
      this.beatIndex = 0;
    }
  },
  togglePlayback: function() {
    if (!this.trackList.any(function(track) {return track.get('sample') && track.steps.length >= 1})) {
      return;
    }

    if (!this.get('isPlaying')) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {
    this.trigger('change:beat', this.beatIndex, this.prevBeatIndex);

    _(this.trackList.where({mute: true})).each(function(track) {console.log(track)});

    if (this.trackList.any(function(track) {return track.get('solo')})) {
      _(this.trackList.where({solo: true})).chain()
        .filter(function(track) {return track.steps[this.beatIndex] == 1 && track.get('sample')}, this)
        .each(function(track) {
          this.playBeat(track.get('sample'), track.effects, 0.005);
        }, this);
    } else {
      this.trackList.chain()
        .filter(function(track) {return track.steps[this.beatIndex] == 1 && track.get('sample')}, this)
        .each(function(track) {
          if (!track.get('mute')) {
            this.playBeat(track.get('sample'), track.effects, 0.005);
          }
        }, this);
      }

    this.prevBeatIndex = (this.get('patternLength') == 1) ? null : this.beatIndex;

    if (this.beatIndex == this.get('patternLength') - 1) {
      this.beatIndex = 0;
    } else {
      this.beatIndex ++;
    }

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
    this.prevBeatIndex = null;
  }
});