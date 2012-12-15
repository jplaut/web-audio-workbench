var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      name: ''
    }
  },
  initialize: function() {
    var self = this;

    if (this.get('type').match(/^[0-9]?$/)) {
      var details = app.effectsList.filters;
      var name = _(details.type).find(function(value, key) {return value == this.get('type')}, this);
    } else {
      var details = app.effectsList[this.get('type')];
      var name = details.name;
    }
    this.set({name: name});
    this.params = details.params;

    _(this.params).each(function(param) {
      param['values'] = {};
    });
  }
});