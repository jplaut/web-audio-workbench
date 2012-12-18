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
      label: "Gain",
      params: {
        level: {
          label: "Gain",
          internal: "gain",
          min: 0,
          max: 1,
          default: 1
        }
      }
    },
    panner: {
      label: "Panner",
      params: {
        position: {
          label: 'Position',
          internal: 'position',
          min: -1,
          max: 1,
          default: 0
        }
      }
    },
    compressor: {
      label: "Compressor",
      params: {
        threshold: {
          label: 'Threshold',
          internal: 'threshold',
          min: -100,
          max: 0,
          default: -24
        },
        knee: {
          label: 'Knee',
          internal: 'knee',
          min: 0,
          max: 40,
          default: 30
        },
        ratio: {
          label: 'Ratio',
          internal: 'ratio',
          min: 1,
          max: 20,
          minDisplay: "1:1",
          maxDisplay: "20:1",
          default: 12
        },
        attack: {
          label: 'Attack',
          internal: 'attack',
          min: 0,
          max: 1,
          default: 0.003
        },
        release: {
          label: 'Release',
          internal: 'release',
          min: 0,
          max: 1,
          default: 0.250
        }
      }
    },
    lowpass: {
      label: "Lowpass",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Resonanace',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    highpass: {
      label: "Highpass",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Resonanace',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    bandpass: {
      label: "Bandpass",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Q',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    lowshelf: {
      label: "Lowshelf",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        }
      }
    },
    highshelf: {
      label: "Highshelf",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350,
        }
      }
    },
    peaking: {
      label: "Peaking",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Q',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    notch: {
      label: "Notch",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Q',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    allpass: {
      label: "Allpass",
      params: {
        frequency: {
          label: 'Frequency',
          internal: 'frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        q: {
          label: 'Q',
          internal: 'Q',
          min: 0,
          max: 1000,
          default: 1
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