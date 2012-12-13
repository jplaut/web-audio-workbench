var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  initialize: function() {
    _.bindAll(this, 'render');

    this.trackControls = new TrackControlsView({collection: this.collection, model: this.model});
    this.pattern = new PatternView({model: this.model});
    this.effectsPanel = new EffectsPanelView({collection: this.model.effects});

    this.effectsPanel.on('add:effect', this.handleEffectAdded, this);
    this.trackControls.on('toggle:effectsPanel', this.handleEffectsPanelToggled, this);
    this.model.on('remove', this.remove, this);
  },
  render: function() {
    this.$el.html(this.trackControls.render().el);
    this.$el.append(this.pattern.render().el);
    this.$el.append(this.effectsPanel.render().el);

    return this;
  },
  handleEffectsPanelToggled: function() {
    this.effectsPanel.toggle();
    var height = (this.effectsPanel.toggled) ? this.effectsPanel.height : this.effectsPanel.height * -1;

    this.$el.animate({
      height: this.$el.height() + height
      }, 
      1000
    );
  },
  handleEffectAdded: function(height) {
    this.$el.height(this.$el.height() + height);
  }
});