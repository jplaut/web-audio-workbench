var TransportView = Backbone.View.extend({
  tagName: 'div',
  id: 'transport',
  events: {
    'click button#addtrack': 'createTrack',
    'click span#togglePlayback': 'togglePlayback',
    'change input#tempo': 'changeTempo',
    'change select#steps': 'changeNumSteps'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'createTrack', 'togglePlayback', 'changeTempo', 'changeNumSteps', 'handleWindowResize');
    
    this.template = globals.templateLoader.load('transport');

    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    var self = this;

    this.$el.append(self.template());

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
  changeNumSteps: function(e) {
    app.set({numSteps: parseInt($(e.currentTarget).val())});
  }
});