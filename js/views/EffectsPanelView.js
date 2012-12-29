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
      this.appendEffect(effect);
    }, this);

    return this;
  },
  toggle: function() {
    this.toggled = !this.toggled;

    this.$el.slideToggle('slow');
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
      collection: this.collection,
      automationWidth: this.$el.siblings('.steps').width(),
      instrument: this.options.instrument
    });

    $('.effects', this.el).append(effectView.render().el);
  }
});