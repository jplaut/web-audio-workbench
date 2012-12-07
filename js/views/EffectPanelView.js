var EffectPanelView = Backbone.View.extend({
  tagName: 'div',
  className: 'effects-panel',
  events: {
    'change select.createeffect': 'createEffect'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createEffect', 'appendEffect');
    this.collection.on('add', this.appendEffect);
    this.template = window.loadTemplate('effectspanel');
  },
  render: function() {
    var self = this;
    this.$el.append(this.template());

    this.collection.each(function(effect) {
      self.$el.append(effect.render().el);
    });

    return this;
  },
  createEffect: function(e) {
    var effect = new Effect({type: $(e.currentTarget).val()});
    this.collection.add(effect);
  },
  appendEffect: function(effect) {
    var effectView = new EffectView({
      model: effect,
      collection: this.collection
    });

    $('div.effects ul', this.el).append(effectView.render().el);
    this.$el.height(this.$el.height() + 20);
  }
});