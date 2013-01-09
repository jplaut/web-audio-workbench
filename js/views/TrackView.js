var TrackView = Backbone.View.extend({
  tagName: 'div',
  className: 'track',
  initialize: function() {
    _.bindAll(this, 'render');
    
    this.trackControls = new TrackControlsView({collection: this.collection, model: this.model});
    this.pattern = new PatternView({model: this.model, instrument: this.options.instrument});
    this.effectsPanel = new EffectsPanelView({collection: this.model.effects, instrument: this.options.instrument});
    this.sampleEditor = new SampleEditorView({model: this.model});

    this.trackControls.on('toggle:sampleEditor', this.sampleEditor.toggle, this.sampleEditor);
    this.trackControls.on('toggle:effectsPanel', this.effectsPanel.toggle, this.effectsPanel);
    this.model.on('remove', this.remove, this);
  },
  render: function() {
    this.$el.html(this.trackControls.render().el);
    this.$el.append(this.pattern.render().el);
    this.$el.append("<br />");
    this.$el.append(this.effectsPanel.render().el);
    this.$el.append(this.sampleEditor.render().el);

    return this;
  }
});