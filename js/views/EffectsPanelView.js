var EffectsPanelView = Backbone.View.extend({
  tagName: 'div',
  className: 'effects-panel',
  events: {
    'change select.createeffect': 'createEffect'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createEffect', 'appendEffect');
    this.collection.on('add', this.appendEffect);
    this.template = globals.templateLoader.load('effectspanel');
    this.toggled = false;
  },
  render: function() {
    this.$el.append(this.template({list: globals.effectsList}));

    this.collection.each(function(effect) {
      this.$el.append(effect.render().el);
    }, this);

    return this;
  },
  toggle: function() {
    this.toggled = !this.toggled;

    this.$el.slideToggle('slow');

    this.trigger('toggle:effectsPanel', this.toggled);
  },
  createEffect: function(e) {
    var effect = new Effect({
      type: $(e.currentTarget).val()
    });

    this.collection.add(effect);
    $(e.currentTarget).val('default');
  },
  appendEffect: function(effect) {
    var effectView = new EffectView({
      model: effect,
      collection: this.collection
    });

    $('.effects', this.el).append(effectView.render().el);
  }
});