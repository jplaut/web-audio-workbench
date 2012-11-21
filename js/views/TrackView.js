var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  events: {
    'click div.step': 'handleStep',
    'click span.solo': 'handleSolo',
    'click span.mute': 'handleMute'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'handleStep', 'handleSolo', 'handleMute');
    this.model.bind('change:solo', function() {console.log(model.get('solo'))});
    this.template = Handlebars.compile($("#track-template").html())
  },
  render: function() {
    var options = {trackNum: this.model.get('trackNum')};
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  handleStep: function(e) {
    if ($(e.currentTarget).attr('on') == 'true') {
      $(e.currentTarget).attr('on', 'false')
    } else {
      $(e.currentTarget).attr('on', 'true')
    }
  },
  handleSolo: function() {
    this.model.set('solo', !(this.model.get('solo'))); //NOT RIGHT
  },
  handleMute: function() {
    this.model.set('mute', !(this.model.get('mute'))); //NOT RIGHT
  }
});