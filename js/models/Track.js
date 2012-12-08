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

    window.globals.on('change:numSteps', this.convertSteps);
  },
  convertSteps: function(oldNum, newNum) {
    var self = this;
    var newSteps = [];
    var oldNum = window.globals.previous("numSteps");
    var newNum = window.globals.get("numSteps");

    if (oldNum > newNum) {
      _(self.get('steps')).each(function(step, i) {
        if (i % (oldNum / newNum) == 0) {
          newSteps[i / (oldNum / newNum)] = step;
        }
      });
    } else {
      _(self.get('steps')).each(function(step, i) {
        newSteps[i * (newNum / oldNum)] = step;
      });
    }

    this.set({steps: newSteps});
  }
});