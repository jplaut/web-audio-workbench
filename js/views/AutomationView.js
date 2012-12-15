var AutomationView = Backbone.View.extend({
  tagName: 'div',
  className: 'automationContainer',
  initialize: function() {
    _.bindAll(this);
    this.width = 770;
    this.height = 120;
  },
  render: function() {
    this.canvas = canvas = Raphael(this.el, this.width, this.height);
  }
})