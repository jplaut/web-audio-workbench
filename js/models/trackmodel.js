var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      solo: false,
      mute: false,
      numSteps: 8,
      steps: [],
      sampleName: '',
      sample: '',
      effects: new Effects(),
      effectsExpanded: false
    };
  },
  convertSteps: function(newNum) {
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

var TrackList = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    var track = new Track;
    track.set({ numSteps: 8, trackNum: 1 });
    this.add(track);
  }
});