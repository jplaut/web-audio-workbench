var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack', 'handleWindowResize', 'changeBeat');

    this.template = globals.templateLoader.load('tracklist');

    this.collection.on('add', this.appendTrack);
    app.on('change:patternLength', this.render);
    app.on('change:beat', this.changeBeat);
    app.on('clear:beat', this.clearBeat);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    var startIndex = app.get('totalBeats') * app.get('editingSteps');

    var options = {
      endIndex: app.get('patternLength'),
      steps: null
    }

    this.$el.html(this.template(options));
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