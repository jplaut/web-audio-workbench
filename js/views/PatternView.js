var PatternView = Backbone.View.extend({
  tagName: 'div',
  className: 'steps',
  events: {
    'click div.step': 'enableStep'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'enableStep');
    this.template = globals.templateLoader.load('pattern');
    app.on('change:numSteps', this.render);
  },
  render: function() {
    var options = {
      numSteps: app.get('numSteps'),
      steps: this.model.get('steps'),
      beatsPerStep: app.beatsPerStep
    }
    this.$el.html(this.template(options));

    return this;
  },
  enableStep: function(e) {
    var steps = this.model.get('steps');
    var stepIndex = $(e.currentTarget).attr('step') * app.beatsPerStep;

    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
      steps[stepIndex] = 1;
    } else {
      $(e.currentTarget).removeClass('on');
      steps[stepIndex] = 0;
    }
    this.model.set({steps: steps});
  }
});