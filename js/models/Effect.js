var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      name: '',
      enabled: true
    }
  },
  initialize: function() {
    var self = this;
    var details = globals.effectsList[self.get('type')];

    if (this.get('type').match(/convolver_/)) {
      globals.bufferLoader.load('audio/impulse_response/' + details.sampleName, globals.audioContext, function(data) {
        self.buffer = data;
      });
    }

    this.set({name: details.label});
    this.params = details.params;

    _(this.params).each(function(param) {
      param['values'] = {};
    });
  },
  addEffect: function(context, source, i) {
    var effectObj; 

    if (this.get('type') == 'panner') {
      var effectObj = context.createPanner();
      effectObj.setPosition(this.params.position.values[i], 0, -0.5);
    } else if (this.get('type').match(/convolver_/)) {
      var dry_source = context.createGainNode();
      dry_source.gain.value = 1 - this.params.wet_dry.values[i];
      source.connect(dry_source);
      var convolver = context.createConvolver();
      convolver.buffer = this.buffer;
      source.connect(convolver);
      var wet_source = context.createGainNode();
      wet_source.gain.value = this.params.wet_dry.values[i];
      convolver.connect(wet_source);
      var effectObj = context.createGainNode();
      wet_source.connect(effectObj);
      dry_source.connect(effectObj);
    } else {
      switch(this.get('type')) {
        case 'compressor':
          effectObj = context.createDynamicsCompressor();
          break;
        case 'gain':
          effectObj = context.createGainNode();
          break;
        default:
          effectObj = context.createBiquadFilter();
          effectObj.type = globals.effectsList[this.get('type')].type;
          break;
      }
      _(this.params).each(function(val, key) {
        effectObj[key].value = val.values[i];
      });
    }

    source.connect(effectObj);
    return effectObj;
  }
});