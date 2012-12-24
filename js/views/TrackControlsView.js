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
    'dblclick .trackLabelText': 'startEditingTrackName',
    'keypress .trackLabelText': 'endEditingTrackName'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'handleSolo', 'handleMute', 'setSample', 'removeSample', 'removeTrack', 'toggleEffects', 'startEditingTrackName', 'endEditingTrackName');

    this.template = globals.templateLoader.load('trackcontrols');
    this.isEditingTrackName = false;

    this.model.on('change:name', this.render);
    this.model.on('change:effectsExpanded', this.toggleEffects);
    this.collection.on('remove', this.render);
    $(window).on('click', this.endEditingTrackName);
  },
  render: function() {
    var options = this.model.toJSON();
    options.name = options.name || 'Track ' + (this.collection.indexOf(this.model) + 1);
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
  startEditingTrackName: function() {
    if (!this.isEditingTrackName) {
      this.isEditingTrackName = true;
      $(".trackLabelText", this.el).html('<input type="text" maxlength=13 value = "' + $(".trackLabelText", this.el).text() + '" />');
      $(".trackLabelText input", this.el).select();
    }
  },
  endEditingTrackName: function(e) {
    if (this.isEditingTrackName) {
      if (
        (e.type == 'click' && e.target != $(".trackLabelText input", this.el)[0]) || 
        (e.type == 'keypress' && e.target == $(".trackLabelText input", this.el)[0] && e.keyCode == 13)
      ) {
        this.model.set({name: $(".trackLabelText input", this.el).val()});
        this.isEditingTrackName = false;
      }
    }
  },
  setSample: function(e) {
    var supportedTypes = [".wav", ".mp3", ".aac", ".ogg"];
    if (!e.currentTarget.files[0].name.match(new RegExp("\\" + supportedTypes.join("|\\") + "$"))) {
      alert("File must be one of the following formats: \n" + supportedTypes.join("\n"));
      $(e.currentTarget).html($(e.currentTarget).html());
    } else if (e.currentTarget.files.length > 0) {
      $(e.currentTarget).replaceWith("<img src=img/loading.gif />");
      //var self = this;

      this.model.setSample(
        e.currentTarget.files[0],
        function() {this.render();},
        this
      );
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