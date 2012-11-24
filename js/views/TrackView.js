var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  events: {
    'click div.step': 'enableStep',
    'click span.solo': 'handleSolo',
    'click span.mute': 'handleMute',
    'change .trackControls input[type=file]': 'setSample'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'enableStep', 'handleSolo', 'handleMute', 'setSample');
    this.template = Handlebars.compile($("#track-template").html())
  },
  render: function() {
    var options = {trackNum: this.model.get('trackNum')};
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  enableStep: function(e) {
    var steps = this.model.get('steps');
    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
      steps[$(e.currentTarget).attr('step')] = 1;
    } else {
      $(e.currentTarget).removeClass('on');
      steps[$(e.currentTarget).attr('step')] = 0;
    }
    this.model.set({steps: steps})
  },
  handleSolo: function() {
    this.model.set({solo: !this.model.get('solo')});
  },
  handleMute: function() {
    this.model.set({mute: !this.model.get('mute')});
  },
  setSample: function(e) {
    var supportedTypes = [".wav", ".mp3", ".aac", ".ogg"];
    if (!e.currentTarget.files[0].name.match(new RegExp("\\" + supportedTypes.join("|\\") + "$"))) {
      alert("File must be one of the following formats: \n" + supportedTypes.join("\n"));
      $(e.currentTarget).html($(e.currentTarget).html());
    } else {
      var objectURL = window.URL.createObjectURL(e.currentTarget.files[0]);
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', objectURL);
      audioElement.load();
      this.model.set({sample: audioElement});
    }
  }
});