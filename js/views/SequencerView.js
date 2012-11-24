var SequencerView = Backbone.View.extend({
  el: $('#wrapper'),
  events: {
    'click button#addtrack': 'createTrack',
    'click button#play': 'play',
    'click button#stop': 'stop',
    'change input#tempo': 'changeTempo'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack','appendTrack', 'play');
    this.counter = 0;
    this.tempo = 120;
    this.numSteps = 8;
    this.isPlaying = false;
    this.audioContext = new webkitAudioContext();
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
      model: track,
      audioContext: this.audioContext
    });

    $('ul', this.el).append(trackView.render().el);
    $(this.el).height($(this.el).height() + 70);
  },
  play: function() {
    var self = this;
    var startTime = this.audioContext.currentTime + 0.100;
    var stepTime = (60 / this.tempo) / (this.numSteps / 4);

    this.isPlaying = setInterval(function() {
      for (var i = 0; i < self.numSteps; i++) {
        var time = startTime + i * stepTime;

        _(self.collection.filter(function(track) {return track.get('steps')[i] == 1})).each(
          function(track) {
            console.log(time);
            self.playSound(track.get('sample'), time);
          });
      }
    }, stepTime * this.numSteps * 1000
  )},
  playSound: function(buffer, time) {
    var source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.noteOn(time);
  },
  stop: function() {
    clearInterval(this.isPlaying);
    this.isPlaying = false;
  },
  changeTempo: function(e) {
    this.tempo = $(e.currentTarget).val();
  }
});