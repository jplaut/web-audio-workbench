var TrackControlsView = Backbone.View.extend({
  tagName: 'div',
  className: 'trackControls',
  events: {
    'click .solo': 'handleSolo',
    'click .mute': 'handleMute',
    'change input:file': 'setSample',
    'click .removeSample': 'removeSample',
    'click .removeTrack': 'removeTrack',
    'click .toggleEffects': 'toggleEffects',
    'dblclk .trackLabelText': 'setTrackName'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'handleSolo', 'handleMute', 'setSample', 'removeSample', 'removeTrack', 'toggleEffects');

    this.template = globals.templateLoader.load('trackcontrols');

    this.model.on('change:effectsExpanded', this.toggleEffects);
    this.collection.on('remove', this.render);
  },
  render: function() {
    var options = this.model.toJSON();
    options.trackNum = this.collection.indexOf(this.model) + 1;
    this.$el.html(this.template(options));

    return this;
  },
  handleSolo: function() {
    this.model.set({solo: !this.model.get('solo')});

    if (this.model.get('mute')) {
      this.model.set({mute: false});
    }
  },
  handleMute: function() {
    this.model.set({mute: !this.model.get('mute')});

    if (this.model.get('solo')) {
      this.model.set({solo: false});
    }
  },
  setTrackName: function() {

  },
  setSample: function(e) {
    var supportedTypes = [".wav", ".mp3", ".aac", ".ogg"];
    if (!e.currentTarget.files[0].name.match(new RegExp("\\" + supportedTypes.join("|\\") + "$"))) {
      alert("File must be one of the following formats: \n" + supportedTypes.join("\n"));
      $(e.currentTarget).html($(e.currentTarget).html());
    } else {
      $(e.currentTarget).replaceWith("<img src=img/loading.gif />");

      var sampleName = e.currentTarget.files[0].name
      if (sampleName.length > 11) {
        sampleName = sampleName.slice(0, 7) + ".." + sampleName.slice(sampleName.length - 3, sampleName.length);
      }

      var sampleURL = window.URL.createObjectURL(e.currentTarget.files[0]);

      var self = this;

      globals.bufferLoader.load(sampleURL, globals.audioContext, function(buffer) {
        self.model.set({sampleName: sampleName, sample: buffer});
        self.render();
      });
    }
  },
  removeSample: function() {
    this.model.set({sampleName: '', sample: ''});
    this.render();
  },
  removeTrack: function() {
    if (this.collection.size() > 1) {
      this.collection.remove(this.model);
    }
  },
  toggleEffects: function() {
    var img = ($(".toggleEffects img", this.el).attr('src') == 'img/close_effects.png') ? 'img/open_effects.png' : 'img/close_effects.png';
    $(".toggleEffects img", this.el).attr('src', img);

    this.trigger('toggle:effectsPanel');
  }
});