Handlebars.registerHelper("each_step", function(num, steps, options) {
  var out = "";

  for (var i = 0; i < num; i++) {
    var on = (steps[i]) ? ' on' : '';
    var x = {on: on, num: i};
    out += options.fn(x);
  }

  return out;
})

Handlebars.registerHelper("effectsOptions", function() {
  var out = "";
  var effects = {
    Gain: 'createGainNode',
    Panner: 'createPanner',
    Compressor: 'createDynamicsCompressor',
    WaveShaper: 'createWaveShaper',
    Filters: {
      Lowpass: 'filter: 0',
      Highpass: 'filter: 1',
      Bandpass: 'filter: 2',
      Lowshelf: 'filter: 3',
      Highshelf: 'filter: 4',
      Peaking: 'filter: 5',
      Notch: 'filter: 6',
      Allpass: 'filter: 7'
    }
  };

  function processEffects(obj) {
    _(obj).each(function(value, name) {
      if (typeof value == "object") {
        out += "<optgroup label=\"" + name + "\">";
        processEffects(value);
        out += "</optgroup>";
      } else {
        out += "<option name =\"" + name + "\" value=\"" + value + "\">" + name + "</option>";
      }
    });
  }

  processEffects(effects);

  return out;
})

Handlebars.registerHelper("effectsParamsOptions", function(type) {
  var options, out = "";

  switch(type) {
    case 'Gain':
      options = {
        Level: 'gain'
      }
      break;
    case 'Panner':
      options = {
        Position: 'x'
      };
      break;
    case 'Compressor':
      options = {
        Threshold: 'threshold',
        Knee: 'knee',
        Ratio: 'ratio',
        Reduction: 'reduction',
        Attack: 'attack',
        Release: 'release'
      };
      break;
    case 'WaveShaper':
      options = {
        Curve: 'curve'
      };
      break;
    default:
      options = {
        Frequency: 'frequency',
        Resonance: 'Q'
      };
      break;
  }

  _(options).each(function(value, key) {
    out += "<option value=\"" + value + "\">" + key + "</option>";
  });

  return out;
});