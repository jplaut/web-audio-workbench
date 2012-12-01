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
  },
  convertSteps: function(oldNum, newNum) {
    var self = this;
    var newSteps = [];

    if (self.get('numSteps') > newNum) {
      _(self.get('steps')).each(function(step, i) {
        if (i % (self.get('numSteps') / newNum) == 0) {
          newSteps[i / (self.get('numSteps') / newNum)] = step;
        }
      });
    } else {
      _(self.get('steps')).each(function(step, i) {
        newSteps[i * (newNum / self.get('numSteps'))] = step;
      });
    }

    this.set({numSteps: newNum, steps: newSteps});
  }
});