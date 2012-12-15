var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      numSteps: 8,
      totalBeats: 32,
      beatsPerStep: '',
      stepTime: ''
    }
  },
  initialize: function() {
    this.audioContext = new webkitAudioContext();
    this.handleChangeNumSteps();
    this.on('change:numSteps', this.handleChangeNumSteps, this);
    this.on('change:tempo', this.handleChangeTempo, this);
  },
  templateLoader: {
    directory: 'tpl/',
    load: function(template) {
      var tpl = '';
      var self = this;

      $.ajax({
        url: self.directory + template + '.html',
        async: false,
        success: function(data) {
          tpl = Handlebars.compile(data);
        }
      });

      return tpl;
    }
  },
  effectsList: {
    gain: {
      type: "gain",
      name: "Gain",
      params: {
        Level: {
          internal: 'gain'
        }
      }
    },
    panner: {
      type: "panner",
      name: "Panner",
      params: {
        Position: {
          interval: 'x'
        }
      }
    },
    compressor: {
      type: "compressor",
      name: "Compressor",
      params: {
        Threshold: {
          internal: 'threshold'
        },
        Knee: {
          internal: 'knee'
        },
        Ratio: {
          internal: 'ratio'
        },
        Reduction: {
          internal: 'reduction'
        },
        Attack: {
          internal: 'attack'
        },
        Release: {
          internal: 'release'
        }
      }
    },
    waveshaper: {
      type: "waveshaper",
      name: "WaveShaper",
      params: {
        Curve: {
          internal: 'curve'
        }
      }
    },
    filters: {
      type: {
        Lowpass: 0,
        Highpass: 1,
        Bandpass: 2,
        Lowshelf: 3,
        Highshelf: 4,
        Peaking: 5,
        Notch: 6,
        Allpass: 7
      },
      name: "Filters",
      params: {
        Frequency: {
          internal: 'frequency'
        },
        Resonance: {
          internal: 'Q'
        }
      }
    }
  },
  handleChangeNumSteps: function() {
    this.set({
      beatsPerStep: this.get('totalBeats') / this.get('numSteps'),
      stepTime: (60 / this.get('tempo')) / (this.get('numSteps') / 4)
    });
  },
  handleChangeTempo: function() {
    this.set({
      stepTime: (60 / this.get('tempo')) / (this.get('numSteps') / 4)
    });
  }
});