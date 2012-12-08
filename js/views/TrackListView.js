var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack');

    this.collection.on('add', this.appendTrack);
  },
  render: function() {
    var self = this;

    this.$el.html("<ul></ul>");

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

    $("ul:first", this.el).append(trackView.render().el);
  }
});