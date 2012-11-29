var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  events: {
    'click div.step': 'enableStep',
    'click span.solo': 'handleSolo',
    'click span.mute': 'handleMute',
    'change .trackControls input:file': 'setSample',
    'click span.removeSample': 'removeSample',
    'click span.removeTrack': 'removeTrack',
    'click span.toggleEffects': 'handleEffectsToggle'
  },
  initialize: function(options) {
    _.bindAll(this, 'render', 'enableStep', 'handleSolo', 'handleMute', 'setSample', 'removeSample', 'removeTrack', 'handleEffectsToggle', 'toggleEffects');
    this.model.on('change:effectsExpanded', this.toggleEffects);
    this.audioContext = this.options.audioContext;
    this.effectPanel = new EffectPanelView({collection: this.model.get('effects')});
    this.template = Handlebars.compile($("#track-template").html())
  },
  render: function() {
    var options = this.model.toJSON();
    options.trackNum = this.collection.indexOf(this.model) + 1;
    this.$el.html(this.template(options));
    this.$el.append(this.effectPanel.render().el);

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
    this.model.set({steps: steps});
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
  setSample: function(e) {
    var supportedTypes = [".wav", ".mp3", ".aac", ".ogg"];
    if (!e.currentTarget.files[0].name.match(new RegExp("\\" + supportedTypes.join("|\\") + "$"))) {
      alert("File must be one of the following formats: \n" + supportedTypes.join("\n"));
      $(e.currentTarget).html($(e.currentTarget).html());
    } else {
      $(e.currentTarget).replaceWith("<img src=img/loading.gif />");
      var objectURL = window.URL.createObjectURL(e.currentTarget.files[0]);
      var self = this;
      var request = new XMLHttpRequest();
      request.open('GET', objectURL, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        self.audioContext.decodeAudioData(request.response, function(buffer) {
          var sampleName = e.currentTarget.files[0].name;
          if (sampleName.length > 11) {
            sampleName = sampleName.slice(0, 7) + ".." + sampleName.slice(sampleName.length - 3, sampleName.length);
          }

          self.model.set({sampleName: sampleName, sample: buffer});
          self.render();
        });
      }
      request.send();
    }
  },
  removeSample: function() {
    this.model.set({sampleName: '', sample: ''});
    this.render();
  },
  removeTrack: function() {
    if (this.collection.size() > 1) {
      this.collection.remove(this.model);
      this.$el.remove();
    }
  },
  handleEffectsToggle: function() {
    if (!this.model.get('effectsExpanded')) {
      if (this.collection.any(function(track) {return track.get('effectsExpanded')})) {
        _(this.collection.where({effectsExpanded: true})).each(function(track) {
          track.set({effectsExpanded: false});
        });
      };

      this.model.set({effectsExpanded: true});
    } else {
      this.model.set({effectsExpanded: false});
    }
  },
  toggleEffects: function() {
    var self = this;

    this.effectPanel.$el.animate({
      height: (this.effectPanel.$el.height() == 0) ? 21 + this.model.get('effects').size() * 20 : '0px'
    }, 1000, function() {
      if (self.model.get('effectsExpanded')) {
        self.effectPanel.$el.attr('src', 'img/close_effects.png');
      } else {
        self.effectPanel.$el.attr('src', 'img/open_effects.png');
      }
    });
  }
});