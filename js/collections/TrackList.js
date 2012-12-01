var TrackList = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    var track = new Track;
    track.set({ numSteps: 8, trackNum: 1 });
    this.add(track);
  }
});