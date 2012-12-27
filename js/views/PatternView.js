var PatternView = Backbone.View.extend({
  tagName: 'div',
  className: 'steps',
  events: {
    'click div.step': 'enableStep'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'enableStep');
    this.template = globals.templateLoader.load('pattern');
    app.on('change:patternLength', this.render);
  },
  render: function() {
    var startIndex = app.get('totalBeats') * app.get('editingSteps');

    var options = {
      endIndex: app.get('patternLength'),
      steps: this.model.steps
    }
    this.$el.html(this.template(options));

    return this;
  },
  enableStep: function(e) {
    var stepIndex = $(e.currentTarget).attr('step');

    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
      this.model.steps[stepIndex] = 1;
    } else {
      $(e.currentTarget).removeClass('on');
      this.model.steps[stepIndex] = 0;
    }
  }
});