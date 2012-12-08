var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  initialize: function() {
    _.bindAll(this, 'render');

    this.trackControls = new TrackControlsView({collection: this.collection, model: this.model});
    this.pattern = new PatternView({model: this.model});
    this.effectPanel = new EffectPanelView({collection: this.model.effects});

    this.trackControls.on('')
    this.model.on('remove', this.remove, this);
  },
  render: function() {
    this.$el.html(this.trackControls.render().el);
    this.$el.append(this.pattern.render().el);
    this.$el.append(this.effectPanel.render().el);

    return this;
  }
});