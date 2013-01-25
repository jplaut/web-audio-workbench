var Sequencer = Backbone.Model.extend({
  defaults: function() {
    return {
      patternLength: 16,
      noteType: 16
    }
  },
  initialize: function() {
    _.bindAll(this);

    this.tracks = new Tracks;
    this.view = new SequencerView({model: this, collection: this.tracks});
    this.relativeBeatIndex = Math.ceil(app.beatIndex / (64 / this.get('noteType')));

    this.on('change:patternLength', this.handleChangePatternLength);
    app.on('change:isPlaying', this.togglePlayback);
    app.on('beat', this.play);
  },
  handleChangePatternLength: function(model, patternLength) {
    if (this.relativeBeatIndex >= patternLength) {
      this.relativeBeatIndex = 0;
    }
  },
  togglePlayback: function(app, isPlaying) {
    if (!isPlaying) {
      this.trigger('clear:beat');
      this.relativeBeatIndex = 0;
    }
  },
  play: function(beatIndex) {
    if (beatIndex % (64 / this.get('noteType')) == 0) {
      this.trigger('change:beat', this.relativeBeatIndex);

      if (this.tracks.any(function(track) {return track.get('solo')})) {
        this.tracks.where({solo: true})[0].playBeat(this.relativeBeatIndex);
      } else {
        this.tracks.each(function(track) {
          track.playBeat(this.relativeBeatIndex);
        }, this);
      }

      this.relativeBeatIndex = (this.relativeBeatIndex == this.get('patternLength') - 1) ? 0 : this.relativeBeatIndex + 1;
    }
  }
});