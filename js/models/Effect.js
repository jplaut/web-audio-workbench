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
    var details = globals.effectsList[this.get('type')];

    if (this.get('type').match(/convolver_/)) {
      globals.bufferLoader.load('audio/impulse_response/' + details.sampleName, globals.audioContext, function(data) {
        self.buffer = data;
      });
    }

    this.set({name: details.label});
    this.params = details.params;

    _(this.params).each(function(param) {
      param.values = [];
      param.points = [];
    });
  },
  addEffect: function(context, source, i) {
    var effectObj; 

    if (this.get('type') == 'panner') {
      var effectObj = context.createPanner();
      effectObj.setPosition(this.params.position.values[i], 0, -0.5);
    } else if (this.get('type').match(/convolver_/)) {
      var dry_source = context.createGainNode(),
          wet_source = context.createGainNode(),
          effectObj = context.createGainNode(),
          convolver = context.createConvolver();

      convolver.buffer = this.buffer;
      dry_source.gain.value = 1 - this.params.wet_dry.values[i];
      wet_source.gain.value = this.params.wet_dry.values[i];
      
      source.connect(convolver);
      convolver.connect(wet_source);
      source.connect(dry_source);
      dry_source.connect(effectObj);
      wet_source.connect(effectObj);
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