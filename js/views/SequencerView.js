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
    this.loop = false;
    this.isStopped = true;
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
    this.isStopped = false;
    var bar = 0;
    var stepTime = (60 / this.tempo) / (this.numSteps / 4);

    this.playPattern(stepTime, bar);
    bar++;

    this.loop = setInterval(function() {
      self.playPattern(stepTime, bar);
      bar++;
    }, stepTime * this.numSteps * 1000
  )},
  playPattern: function(stepTime, bar) {
    var self = this;
    var startTime = this.audioContext.currentTime + 0.100;

    for (var i = 0; i < self.numSteps; i++) {
      if (self.isStopped) {
        if (self.loop) {
          clearInterval(self.loop);
          self.loop = false;
        }
        break;
      } else {
        _(self.collection.filter(function(track) {return track.get('steps')[i] == 1})).each(
          function(track) {
            console.log(i);
            var time = startTime + stepTime * i + bar * stepTime * self.numSteps;
            var source = self.audioContext.createBufferSource();
            source.buffer = track.get('sample');
            source.connect(self.audioContext.destination);
            source.noteOn(time);
        });
      }
    }
  },
  stop: function() {
    this.isStopped = true;
  },
  changeTempo: function(e) {
    this.tempo = $(e.currentTarget).val();
  }
});