var EffectView = Backbone.View.extend({
  tagName: 'li',
  className: 'effect',
  events: {
  },
  initialize: function() {
    _.bindAll(this, 'render');
    this.automationView = new AutomationView({model: this.model})
    this.template = app.templateLoader.load('effect');
    this.height = 120;
  },
  render: function() {
    var self = this;
    var options = {};

    _(this.model.params).each(function(value, key) {
      options[key] = value.internal;
    });

    this.$el.append(self.template({name: this.model.get('name'), args: options}));
    this.$el.height(this.height);
    this.canvas = Raphael($(".automationCanvas", this.el)[0], 770, 80);
    var background = this.canvas.rect(0, 0, 770, 80);
    background.attr('fill', '#fff');
    var middleLine = this.canvas.path("M0 40L770 40");
    middleLine.attr('stroke-width', '0.25');
    middleLine.attr('stroke', '#000');

    return this;
  }
});