var TrackView = Backbone.View.extend({
  tagName: 'li',
  className: 'track',
  events: {
    'click div.step': 'enableStep',
    'click span.solo': 'handleSolo',
    'click span.mute': 'handleMute'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'enableStep', 'handleSolo', 'handleMute');
    this.template = Handlebars.compile($("#track-template").html())
  },
  render: function() {
    var options = {trackNum: this.model.get('trackNum')};
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  enableStep: function(e) {
    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
    } else {
      $(e.currentTarget).removeClass('on');
    }
  },
  handleSolo: function() {
    this.model.set({solo: !this.model.get('solo')});
  },
  handleMute: function() {
    this.model.set({mute: !this.model.get('mute')});
  }
});