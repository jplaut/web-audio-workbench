var Track = Backbone.Model.extend({
  defaults: {
    solo: false,
    mute: false,
    trackNum: 0
  }
});

var TrackList = Backbone.Collection.extend({
  model: Track
});

var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  events: {
    'click div.step': 'handleStep',
    'click span.solo': 'handleSolo',
    'click span.mute': 'handleMute'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'handleStep', 'handleSolo', 'handleMute');
    this.model.bind('change:solo', function() {console.log(model.get('solo'))});
  },
  render: function() {
    var track = 
      "<div class=\"trackControls\">"
      + "<span class=\"tracklabel\">Track " + this.model.get('trackNum') + "</span>"
      + "<span class=\"solo\">S</span>"
      + "<span class=\"mute\">M</span>"
      + "</div>"
      + "<div class=\"steps\">";
      for (var i=1; i <= 8; i++) {
        track += "<div class=\"step\" step=\"" + i + "\" on=false></div>";
      }
      track += "</div></li>";

    $(this.el).html(track);
    return this;
  },
  handleStep: function(e) {
    if ($(e.currentTarget).attr('on') == 'true') {
      $(e.currentTarget).attr('on', 'false')
    } else {
      $(e.currentTarget).attr('on', 'true')
    }
  },
  handleSolo: function() {
    this.model.set('solo', !(this.model.get('solo'))); //NOT RIGHT
  },
  handleMute: function() {
    this.model.set('mute', !(this.model.get('mute'))); //NOT RIGHT
  }
});

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
    this.render();
  },
  render: function() {
    $(this.el).append("<div id=\"tracks\"><ul></ul></div>");

    var self = this;

    _(this.collection.models).each(function(track) {
      self.appendTrack(track);
    }, this);
    

    $(this.el).append(
      "<div id=\"transport\">"
        + "<button id=\"addtrack\">Add Track</button>"
        + "<button id=\"play\">Play</button>"
        + "<button id=\"stop\">Stop</button>"
        + "<label for=\"tempo\">Tempo: </label>"
        + "<input id=\"tempo\" type=\"number\" max=\"300\" min=\"1\" value=\"120\" style=\"width: 40px;\" />"
        + "<label for=\"numSteps\">Steps: </label>"
        + "<input id=\"steps\" type=\"number\" step=\"4\" max=\"64\" min=\"4\" value=\"8\" style=\"width: 40px;\" />"
      + "</div>"
    );

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

var view = new SequencerView();