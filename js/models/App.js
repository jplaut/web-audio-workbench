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
  bufferLoader: {
    load: function(url, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        app.audioContext.decodeAudioData(request.response, callback);
      }
      
      request.send();
    }
  },
  effectsList: {
    gain: {
      label: "Gain",
      params: {
        gain: {
          label: "Gain",
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
          min: -4,
          max: 4,
          default: 0
        }
      }
    },
    compressor: {
      label: "Compressor",
      params: {
        threshold: {
          label: 'Threshold',
          min: -100,
          max: 0,
          default: -24
        },
        knee: {
          label: 'Knee',
          min: 0,
          max: 40,
          default: 30
        },
        ratio: {
          label: 'Ratio',
          min: 1,
          max: 20,
          minDisplay: "1:1",
          maxDisplay: "20:1",
          default: 12
        },
        attack: {
          label: 'Attack',
          min: 0,
          max: 1,
          default: 0.003
        },
        release: {
          label: 'Release',
          min: 0,
          max: 1,
          default: 0.250
        }
      }
    },
    lowpass: {
      label: "Lowpass",
      type: 0,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    highpass: {
      label: "Highpass",
      type: 1,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    bandpass: {
      label: "Bandpass",
      type: 2,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    lowshelf: {
      label: "Lowshelf",
      type: 3,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        }
      }
    },
    highshelf: {
      label: "Highshelf",
      type: 4,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350,
        }
      }
    },
    peaking: {
      label: "Peaking",
      type: 5,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    notch: {
      label: "Notch",
      type: 6,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    allpass: {
      label: "Allpass",
      type: 7,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    addEffect: function(effect, context, source, values) {
      var effectObj; 

      if (effect == 'panner') {
        var effectObj = context.createPanner();
        effectObj.setPosition(values.position, 0, 0);
      } else {
        switch(effect) {
          case 'compressor':
            effectObj = context.createDynamicsCompressor();
            break;
          case 'gain':
            effectObj = context.createGainNode();
            break;
          default:
            effectObj = context.createBiquadFilter();
            effectObj.type = this[effect].type;
            break;
        }
        _(this[effect].params).each(function(val, key) {
          effectObj[key].value = values[key];
        });
      }

      source.connect(effectObj);
      return effectObj;
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