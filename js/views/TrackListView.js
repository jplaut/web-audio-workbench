var TrackListView = Backbone.View.extend({
  tagName: 'div',
  id: 'tracks',
  initialize: function() {
    _.bindAll(this, 'render', 'appendTrack', 'handleWindowResize', 'changeBeat', 'createStepIndicators', 'renderTopSection', 'setDividerWidth');

    this.template = globals.templateLoader.load('tracklist');

    this.collection.on('add', this.appendTrack);
    app.on('change:patternLength', this.renderTopSection);
    app.on('change:noteType', this.renderTopSection);
    app.on('change:beat', this.changeBeat);
    app.on('clear:beat', this.clearBeat);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    this.$el.html('<div id="top"></div>');

    this.renderTopSection();

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
  setDividerWidth: function() {
    var width = (this.stepsPerBeat * 37) + ((this.stepsPerBeat - 1) * 11);
    $(".divider", this.el).width(width);
  },
  renderTopSection: function() {
    this.stepsPerBeat = app.get('noteType') / 4;
    this.totalBeats = Math.ceil(app.get('patternLength') / this.stepsPerBeat);

    var options = {
      totalBeats: this.totalBeats
    }

    $('#top', this.el).html(this.template(options).replace(/\n|\s{2,}/g, ''));

    this.createStepIndicators();
    this.setDividerWidth();
  },
  createStepIndicators: function() {
    $("#stepIndicatorBar", this.el).empty();
    var out = "";

    for (var i = 0; i < app.get('patternLength'); i++) {
      var first = (i == 0) ? ' first' : '';
      var last = (app.get('patternLength') > 1 && i == app.get('patternLength') - 1) ? ' last' : '';

      out += "<div class=\"step" + first + last + "\" step=\"" + i + "\"></div>";
    }
    $("#stepIndicatorBar", this.el).append(out);
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