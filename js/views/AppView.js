var AppView = Backbone.View.extend({
  tagName: 'div',
  id: 'app',
  events: {
    'change #createInstrument': 'createInstrument',
    'click #togglePlayback': 'togglePlayback',
    'change #tempo': 'changeTempo'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createInstrument', 'appendInstrument', 'togglePlayback', 'handleWindowResize', 'changeTempo', 'removeInstrument');

    this.template = globals.templateLoader.load('app');
    this.collection = new Instruments;

    this.collection.on('add', this.appendInstrument);
    this.model.on('remove:instrument', this.removeInstrument);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    this.$el.html(this.template());

    this.collection.each(function(instrument) {
      this.appendInstrument(instrument);
    }, this);

    return this;
  },
  handleWindowResize: function() {
    this.$el.height($(document).height() - 90);
    $("#transport", this.el).css('left', $(document).width() / 2 - $("#transport", this.el).width() / 2);
    $(".instrument").css('max-height', this.$el.height());
  },
  createInstrument: function(e) {
    var instrument;

    switch ($(e.currentTarget).val()) {
      case "Sequencer":
        instrument = new Sequencer;
    }
    
    this.collection.add(instrument);
    $(e.currentTarget).val('default');
  },
  appendInstrument: function(instrument) {
    $("#instruments", this.el).append(instrument.view.render().el);
    instrument.view.$el.css('max-height', this.$el.height() - 50);
  },
  togglePlayback: function() {
    if (this.collection.size() > 0) {
      this.model.set({isPlaying: !this.model.get('isPlaying')});

      if (this.model.get('isPlaying')) {
        $("#togglePlayback img").attr("src", "img/stop.png");
      } else {
        $("#togglePlayback img").attr("src", "img/play.png");
      }
    }
  },
  changeTempo: function(e) {
    this.model.set({tempo: $(e.currentTarget).val()});
  },
  removeInstrument: function(model) {
    var instrument = this.collection.find(function(instrument) {return instrument.model === model});
    instrument.view.remove();
    this.collection.remove(instrument);
  }
});