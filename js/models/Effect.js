var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      name: ''
    }
  },
  initialize: function() {
    var self = this;

    var params;
    this.params = {};

    switch(this.get('name')) {
      case 'Gain':
        params = ['gain'];
        break;
      case 'Panner':
        params = ['position'];
        break;
      case 'Compressor':
        params = ['threshold', 'knee', 'ratio', 'reduction', 'attack', 'release'];
        break;
      case 'Waveshaper':
        params = ['curve'];
        break;
      default:
        params = ['frequency', 'q'];
        break;
    }

    _(params).each(function(param) {
      self.params[param] = {};
    });
  }
});