var Sequencer = Backbone.Model.extend({
  defaults: function() {
    return {
      patternLength: 16,
      noteType: 16
    }
  },
  initialize: function() {
    _.bindAll(this, 'play', 'togglePlayback', 'handleChangePatternLength');
    this.collection = new Tracks;
    this.view = new SequencerView({model: this, collection: this.collection});

    this.notesplaying = [];
    this.relativeBeatIndex = Math.ceil(app.beatIndex / (64 / this.get('noteType')));

    this.on('change:patternLength', this.handleChangePatternLength);
    app.on('change:isPlaying', this.togglePlayback);
    app.on('beat', this.play);
  },
  handleChangePatternLength: function() {
    if (this.relativeBeatIndex >= this.get('patternLength')) {
      this.relativeBeatIndex = 0;
    }
  },
  togglePlayback: function() {
    if (!app.get('isPlaying')) {
      this.trigger('clear:beat');
      this.relativeBeatIndex = 0;
      for (var i = 0; i < this.notesplaying.length; i++) {
        var note = this.notesplaying.pop();
        note.noteOff(0);
      }
    }
  },
  play: function(beatIndex) {
    if (beatIndex % (64 / this.get('noteType')) == 0) {
      this.trigger('change:beat', this.relativeBeatIndex);

      if (this.collection.any(function(track) {return track.get('solo')})) {
        this.collection.where({solo: true})[0].playBeat(this.relativeBeatIndex);
      } else {
        this.collection.each(function(track) {
          track.playBeat(this.relativeBeatIndex);
        }, this);
      }

      this.relativeBeatIndex = (this.relativeBeatIndex == this.get('patternLength') - 1) ? 0 : this.relativeBeatIndex + 1;
    }
  }
});