var TrackList = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    var track = new Track;
    track.set({ trackNum: 1 });
    this.add(track);
  }
});