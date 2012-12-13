var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      numSteps: 8
    }
  },
  initialize: function() {
    this.audioContext = new webkitAudioContext();
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
  }
});