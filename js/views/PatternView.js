var PatternView = Backbone.View.extend({
  tagName: 'div',
  className: 'steps',
  events: {
    'click div.step': 'enableStep'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'enableStep');
    this.template = window.templateLoader.load('pattern');
    window.globals.on('change:numSteps', this.render);
  },
  render: function() {
    this.$el.attr('numSteps', window.globals.get('numSteps'));
    this.$el.html(this.template({numSteps: window.globals.get('numSteps'), steps: this.model.get('steps')}));

    return this;
  },
  enableStep: function(e) {
    var steps = this.model.get('steps');

    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
      steps[$(e.currentTarget).attr('step')] = 1;
    } else {
      $(e.currentTarget).removeClass('on');
      steps[$(e.currentTarget).attr('step')] = 0;
    }
    this.model.set({steps: steps});
  }
});