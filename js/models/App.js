var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      numSteps: 8,
      totalBeats: 32,
      isPlaying: false
    }
  },
  initialize: function() {
    _.bindAll(this, 'play', 'playBeat', 'stop', 'addEffects', 'togglePlayback', 'handleChangeTempo', 'handleChangeNumSteps');
    this.trackList = new TrackList;
    this.notesplaying = [];
    this.beatIndex = 0;
    this.relativeBeatIndex = 0;

    this.handleChangeNumSteps();
    this.on('change:isPlaying', this.togglePlayback);
    this.on('change:numSteps', this.handleChangeNumSteps);
    this.on('change:tempo', this.handleChangeTempo);
  },
  handleChangeNumSteps: function() {
    this.beatsPerStep = this.get('totalBeats') / this.get('numSteps');
    this.stepTime = (60 / this.get('tempo')) / (this.get('numSteps') / 4);

    if (this.get('isPlaying')) {
      this.beatIndex = this.beatIndex + (this.beatIndex % this.beatsPerStep);
      this.relativeBeatIndex = this.beatIndex / this.beatsPerStep;
      this.prevRelativeBeatIndex = this.relativeBeatIndex - 1;
      this.trigger('change:beat', this.relativeBeatIndex, this.prevRelativeBeatIndex);
    }
  },
  handleChangeTempo: function() {
    this.stepTime = (60 / this.get('tempo')) / (this.get('numSteps') / 4);
  },
  togglePlayback: function() {
    if (!this.trackList.any(function(track) {return track.get('sample') && track.get('steps').length >= 1})) {
      return;
    }

    if (!this.get('isPlaying')) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {
    var self = this;

    this.trigger('change:beat', this.relativeBeatIndex, this.prevRelativeBeatIndex);

    if (this.trackList.any(function(track) {return track.get('solo')})) {
      this.trackList.chain()
        .where({solo: true})
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')})
        .each(function(track) {
          self.playBeat(track.get('sample'), track.effects, 0);
        });
    } else {
      this.trackList.chain()
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')})
        .each(function(track) {
          if (!track.get('mute')) {
            self.playBeat(track.get('sample'), track.effects, 0);
          }
        });
      }

      this.prevRelativeBeatIndex = this.relativeBeatIndex;
    if (this.beatIndex == this.get('totalBeats') - this.beatsPerStep) {
      this.relativeBeatIndex = 0;
      this.beatIndex = 0;
    } else {
      this.beatIndex += this.beatsPerStep;
      this.relativeBeatIndex++;
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
    var self = this;

    if (effects.size() > 0 && effects.any(function(effect) {return effect.get('enabled')})) {
      effects.chain()
        .filter(function(effect) {return effect.get('enabled')})
        .each(function(effect) {
          source = effect.addEffect(globals.audioContext, source, self.beatIndex);
        });
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
    this.relativeBeatIndex = 0;
    this.prevRelativeBeatIndex = null;
  }
});