var SequencerView = Backbone.View.extend({
  el: $('#wrapper'),
  events: {
    'click button#addtrack': 'createTrack'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack', 'appendTrack');

    this.collection = new TrackList();
    this.collection.bind('add', this.appendTrack);
    this.counter = 0;
    this.template = Handlebars.compile($("#wrapper-template").html());
    this.render();
  },
  render: function() {
    $(this.el).append("<div id=\"tracks\"><ul></ul></div>");

    var self = this;

    _(this.collection.models).each(function(track) {
      self.appendTrack(track);
    }, this);

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
  }
});