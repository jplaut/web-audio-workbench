var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack');
    this.collection.on('add', this.appendTrack);
  },
  render: function() {
    var self = this;

    this.collection.each(function(track) {
      self.appendTrack(track);
    });

    return this;
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      collection: this.collection
    });

    this.$el.append(trackView.render().el);
  }
});