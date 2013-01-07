var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      solo: false,
      mute: false,
      sampleName: '',
      sample: '',
      name: ''
    }
  },
  initialize: function() {
    this.effects = new Effects;
    this.steps = [];
  },
  setSample: function(file, callback, context) {
    var self = this;
    var sampleName = file.name;

    if (sampleName.length > 15) {
      sampleName = sampleName.slice(0, 10) + ".." + sampleName.slice(sampleName.length - 3, sampleName.length);
    }

    var sampleURL = window.URL.createObjectURL(file);

    globals.bufferLoader.load(sampleURL, globals.audioContext, function(buffer) {
      self.set({sampleName: sampleName, sample: buffer});
      callback.call(context || this);
    });
  },
  playBeat: function(i) {
    this.notesplaying = _(this.notesplaying).filter(function(note) {return note.playbackState != 3});
    if (!this.get('mute') && this.steps[i]) {
      var source = globals.audioContext.createBufferSource();
      source.buffer = this.get('sample');
      var effectsChain = this.effects.addEffects(source, i);
      effectsChain.connect(app.audioOut);
      source.noteOn(0.005);
      this.notesplaying.push(source);
    }
  }
});