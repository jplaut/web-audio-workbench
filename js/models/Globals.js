var Globals = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      numSteps: 8
    }
  },
  initialize: function() {
    this.audioContext = new webkitAudioContext();
  }
});