var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      values: []
    }
  }
});

var Effects = Backbone.Collection.extend({
  model: Effect
})