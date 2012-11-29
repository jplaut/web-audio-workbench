var EffectView = Backbone.View.extend({
  tagName: 'li',
  className: 'effect',
  initialize: function() {
    _.bindAll(this, 'render');
    this.template = Handlebars.compile($("#effects-template").html());
  },
  render: function() {
    var self = this;

    this.$el.append(self.template(self.model.toJSON()));

    return this;
  }
});