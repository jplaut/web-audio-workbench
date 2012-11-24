var Track = Backbone.Model.extend({
  defaults: {
    solo: false,
    mute: false,
    trackNum: 0,
    steps: [],
    sample: ''
  }
});

var TrackList = Backbone.Collection.extend({
  model: Track
});