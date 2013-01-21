var PatternView = Backbone.View.extend({
  tagName: 'div',
  className: 'steps',
  events: {
    'click div.step': 'enableStep'
  },
  initialize: function(options) {
    _.bindAll(this);
    this.template = globals.templateLoader.load('pattern');
    this.instrument = this.options.instrument;

    this.instrument.on('change:patternLength', this.render);
  },
  render: function() {
    var options = {
      endIndex: this.instrument.get('patternLength'),
      steps: this.model.get('steps')
    }
    this.$el.html(this.template(options).replace(/\n|\s{2,}/g, ''));

    return this;
  },
  enableStep: function(e) {
    var steps, stepIndex = $(e.currentTarget).attr('step');

    if (!$(e.currentTarget).hasClass('on')) {
      steps = _(this.model.get('steps')).clone();
      steps[stepIndex] = 1;
      $(e.currentTarget).addClass('on');
    } else {
      steps = _(this.model.get('steps')).clone();
      steps[stepIndex] = 0;
      $(e.currentTarget).removeClass('on');
    }

    this.model.set('steps', steps);
  }
});