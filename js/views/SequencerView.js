var SequencerView = Backbone.View.extend({
  tagName: 'div',
  id: 'wrapper',
  initialize: function() {
    _.bindAll(this, 'render');
    this.collection = new TrackList;
    this.height = 30;

    this.trackList = new TrackListView({
      collection: this.collection
    });

    this.transport = new TransportView({
      collection: this.collection
    });

    app.on('change:wrapperHeight', this.handleHeightChange, this);
    app.on('toggle:effectsPanel', this.handleEffectsPanelToggled, this);
  },
  render: function() {
    var self = this;

    this.$el.append(this.trackList.render().el);
    this.$el.append(this.transport.render().el);

    return this;
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
    this.height += height;
    this.$el.height(this.height);
  }
});