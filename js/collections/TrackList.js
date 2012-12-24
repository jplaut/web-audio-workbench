var TrackList = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    var track = new Track;
    this.add(track);
  }
});