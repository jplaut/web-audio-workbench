var SequencerView = Backbone.View.extend({
  el: $('#wrapper'),
  events: {
    'click button#addtrack': 'createTrack',
    'click button#play': 'play',
    'click button#stop': 'stop'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack','appendTrack', 'play');
    this.counter = 0;
    this.tempo = 120;
    this.numSteps = 8;
    this.isPlaying = false;
    this.collection.bind('add', this.appendTrack);
    this.template = Handlebars.compile($("#wrapper-template").html());
    this.render();
  },
  render: function() {
    $(this.el).append("<div id=\"tracks\"><ul></ul></div>");
    $(this.el).append(this.template());
    this.createTrack();

    return this;
  },
  createTrack: function() {
    this.counter++;
    var track = new Track();
    track.set({ trackNum: this.counter });
    this.collection.add(track);
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track
    });

    $('ul', this.el).append(trackView.render().el);
    $(this.el).height($(this.el).height() + 70);
  },
  play: function() {
    var self = this;
    this.isPlaying = setInterval(function() {
      _(self.collection.filter(function(track) {return track.get('steps')[0] == 1})).each(function(track) {
        track.get('sample').play();
        console.log("first");
      })

      var i = 1;
      var interval = setInterval(function() {
        console.log(i);
        _(self.collection.filter(function(track) {return track.get('steps')[i] == 1})).each(
          function(track) {
            console.log("play");
            track.get('sample').currentTime = 0;
            track.get('sample').play();
          })
          i++;
          if (i == 8) {
            clearInterval(interval);
          }
        }, (60/self.tempo) * 1000
      )
    }, (this.tempo/60) * 2000);
  },
  stop: function() {
    clearInterval(this.isPlaying);
    this.isPlaying = false;
  }
});