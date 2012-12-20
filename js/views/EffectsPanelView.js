var EffectsPanelView = Backbone.View.extend({
  tagName: 'div',
  className: 'effects-panel',
  events: {
    'change select.createeffect': 'createEffect'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createEffect', 'appendEffect');
    this.collection.on('add', this.appendEffect);
    this.template = app.templateLoader.load('effectspanel');
    this.toggled = false;
    this.height = 26;
  },
  render: function() {
    var self = this;

    this.$el.append(this.template({list: app.effectsList}));

    this.collection.each(function(effect) {
      self.$el.append(effect.render().el);
    });

    return this;
  },
  toggle: function() {
    this.toggled = !this.toggled;

    var height = (this.toggled == true) ? this.height : 0;

    this.$el.animate({
      height: height
      }, 
      1000
    );
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

    $('.effects ul:first', this.el).append(effectView.render().el);

    this.height += effectView.height;
    this.$el.height(this.height);
  }
});