var EffectView = Backbone.View.extend({
  tagName: 'li',
  className: 'effect',
  initialize: function() {
    _.bindAll(this, 'render');
    this.template = window.templateLoader.load('effect');
  },
  render: function() {
    var self = this;

    this.$el.append(self.template(self.model.toJSON()));

    return this;
  }
});