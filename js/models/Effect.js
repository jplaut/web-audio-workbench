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
    this.params = details.params;

    _(this.params).each(function(param) {
      param['values'] = {};
    });
  }
});