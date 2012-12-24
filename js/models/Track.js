var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      solo: false,
      mute: false,
      steps: [],
      sampleName: '',
      sample: '',
      effectsExpanded: false,
      name: ''
    }
  },
  initialize: function() {
    this.effects = new Effects;
  },
  setSample: function(file, callback, context) {
    var self = this;
    var sampleName = file.name;

    if (sampleName.length > 16) {
      sampleName = sampleName.slice(0, 11) + ".." + sampleName.slice(sampleName.length - 3, sampleName.length);
    }

    var sampleURL = window.URL.createObjectURL(file);

    globals.bufferLoader.load(sampleURL, globals.audioContext, function(buffer) {
      self.set({sampleName: sampleName, sample: buffer});
      callback.call(context || this);
    });
  }
});