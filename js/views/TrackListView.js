var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack', 'handleWindowResize', 'createStepIndicators');
    this.collection.on('add', this.appendTrack);
    app.on('change:numSteps', this.createStepIndicators);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    var self = this;

    this.$el.prepend("<div id=\"stepIndicatorBar\"></div>");
    this.createStepIndicators();
    this.collection.each(function(track) {
      self.appendTrack(track);
    });

    return this;
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      collection: this.collection
    });

    this.$el.append(trackView.render().el);
  },
  handleWindowResize: function() {
    this.$el.height($(document).height() - 90);
  },
  createStepIndicators: function() {
    this.$el.attr('numSteps', app.get('numSteps'));
    $("#stepIndicatorBar", this.el).empty();

    for (var i = 0; i < app.get('numSteps'); i++) {
      var first = (i == 0) ? ' first' : '';
      var last = (i == app.get('numSteps') - 1) ? ' last' : '';

      $("#stepIndicatorBar", this.el).append("<div class=\"step" + first + last + "\" step=\"" + i + "\"></div>");
    }

    $("stepIndicator").css('margin')
  }
});