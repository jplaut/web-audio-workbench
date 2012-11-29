Handlebars.registerHelper("each_step", function(num, steps, options) {
  var out = "";

  for (var i = 0; i < num; i++) {
    var on = (steps[i]) ? ' on' : '';
    var x = {on: on, num: i};
    out += options.fn(x);
  }

  return out;
})

Handlebars.registerHelper("numStepsOptions", function(numSteps) {
  var out = "";
  var steps = [4, 8, 16, 32];

  for (var i = 0; i < steps.length; i++) {
    out += "<option value=" + steps[i];
    out += (numSteps == steps[i]) ? " selected=\"selected\"" : "";
    out += ">" + steps[i] + "</option>";
  }
  
  return out;
})

Handlebars.registerHelper("effectsOptions", function() {
  var out = "";
  var effects = {
    Compressor: 'compressor',
    Panner: 'panner',
    Delay: 'delay',
    WaveShaper: 'waveshaper',
    Filters: {
      Lowpass: 'filter: 0',
      Highpass: 'filter: 1',
      Bandpass: 'filter: 2',
      Lowshelf: 'filter: 3',
      Highshelf: 'filter: 4',
      Peaking: 'filter: 5',
      Notch: 'filter: 6',
      Allpass: 'filter : 7'
    }
  };

  function processEffects(obj) {
    _(obj).each(function(value, name) {
      if (typeof value == "object") {
        out += "<optgroup label=\"" + name + "\">";
        processEffects(value);
        out += "</optgroup>";
      } else {
        out += "<option value=\"" + value + "\">" + name + "</option>";
      }
    });
  }

  processEffects(effects);

  return out;
})