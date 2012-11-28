var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      solo: false,
      mute: false,
      trackNum: 0,
      numSteps: 8,
      steps: [],
      sampleName: '',
      sample: ''
    };
  },
  convertSteps: function(newNum) {
    var self = this;
    var newSteps = [];

    if (self.get('numSteps') > newNum) {
      _(self.get('steps')).each(function(step, i) {
        if (i % (self.get('numSteps') / newNum) == 0) {
          newSteps.push(step);
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

var TrackList = Backbone.Collection.extend({
  model: Track
});