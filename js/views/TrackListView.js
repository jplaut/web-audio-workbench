var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack', 'handleWindowResize', 'createStepIndicators', 'changeBeat');
    this.collection.on('add', this.appendTrack);
    app.on('change:editingSteps', this.createStepIndicators);
    app.on('change:beat', this.changeBeat);
    app.on('clear:beat', this.clearBeat);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    this.$el.prepend("<div id=\"stepIndicatorBar\"></div>");
    this.createStepIndicators();
    this.collection.each(function(track) {
      this.appendTrack(track);
    }, this);

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
    $("#stepIndicatorBar", this.el).empty();
    var startIndex = app.get('totalBeats') * app.get('editingSteps');

    for (var i = startIndex; i < startIndex + app.get('totalBeats'); i++) {
      var first = (i == startIndex) ? ' first' : '';
      var last = (i == startIndex + 15) ? ' last' : '';

      $("#stepIndicatorBar", this.el).append("<div class=\"step" + first + last + "\" step=\"" + i + "\"></div>");
    }
  },
  changeBeat: function(i, prev) {
    $("#stepIndicatorBar .step[step='" + i + "']").addClass('on');

    if (prev || prev == 0) {
      $("#stepIndicatorBar .step[step='" + prev + "']").removeClass('on');
    }
  },
  clearBeat: function() {
    $("#stepIndicatorBar .step").removeClass('on');
  }
});