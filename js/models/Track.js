var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      solo: false,
      mute: false,
      steps: [],
      sampleName: '',
      sample: '',
      effectsExpanded: false
    }
  },
  initialize: function() {
    this.effects = new Effects;
  }
});