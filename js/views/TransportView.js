var TransportView = Backbone.View.extend({
  tagName: 'div',
  id: 'transport',
  events: {
    'click #addtrack': 'createTrack',
    'click #togglePlayback': 'togglePlayback',
    'change #tempo': 'changeTempo',
    'change #patternlength': 'changePatternLength',
    'change #notetype': 'changeNoteType'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack', 'togglePlayback', 'handleWindowResize');
    
    this.template = globals.templateLoader.load('transport');

    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    this.$el.append(this.template());

    return this;
  },
  handleWindowResize: function() {
    this.$el.css('left', $(document).width() / 2 - this.$el.width() / 2);
  },
  createTrack: function() {
    var track = new Track();
    this.collection.add(track);
  },
  togglePlayback: function() {
    app.set({isPlaying: !app.get('isPlaying')});

    if (app.get('isPlaying')) {
      $("span#togglePlayback img").attr("src", "img/stop.png");
    } else {
      $("span#togglePlayback img").attr("src", "img/play.png");
    }
  },
  changeTempo: function(e) {
    app.set({tempo: $(e.currentTarget).val()});
  },
  changePatternLength: function(e) {
    app.set({patternLength: $(e.currentTarget).val()});
  },
  changeNoteType: function(e) {
    app.set({noteType: $(e.currentTarget).val()});
  }
});