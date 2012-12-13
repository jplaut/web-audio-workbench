var SequencerView = Backbone.View.extend({
  tagName: 'div',
  id: 'wrapper',
  initialize: function() {
    _.bindAll(this, 'render', 'handleCreateTrack', 'handleRemoveTrack');
    this.collection = new TrackList;

    this.trackList = new TrackListView({
      collection: this.collection
    });

    this.transport = new TransportView({
      collection: this.collection
    });

    app.on('change:wrapperHeight', this.handleHeightChange, this);
    app.on('toggle:effectsPanel', this.handleEffectsPanelToggled, this);
    this.collection.on('add', this.handleCreateTrack);
    this.collection.on('remove', this.handleRemoveTrack);
  },
  render: function() {
    var self = this;

    this.$el.append(this.trackList.render().el);
    this.$el.append(this.transport.render().el);

    return this;
  },
  handleCreateTrack: function() {
    this.$el.height(this.$el.height() + 70);
  },
  handleRemoveTrack: function() {
    this.$el.height(this.$el.height() - 70);
  },
  handleEffectsPanelToggled: function(toggled, height) {
    var height = (toggled) ? height : height * -1;
    this.$el.animate({
      height: this.$el.height() + height
      }, 
      1000
    );
  },
  handleHeightChange: function(height) {
    this.$el.height(this.$el.height() + height);
  }
});