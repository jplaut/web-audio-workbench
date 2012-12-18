var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      name: ''
    }
  },
  initialize: function() {
    var self = this;
    var details = app.effectsList[self.get('type')];

    this.set({name: details.label});
    this.add = details.add;
    this.params = details.params;

    _(this.params).each(function(param) {
      param['values'] = {};
    });
  },
  addEffect: function(context, source, i) {
    var effectObj; 

    if (this.get('type') == 'panner') {
      var effectObj = context.createPanner();
      effectObj.setPosition(values.position, 0, 0);
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
          effectObj.type = app.effectsList[this.get('type')].type;
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