var Instruments = Backbone.Collection.extend({
  model: Instrument,
  initialize: function() {
    var instrument = new Instrument({type: "Sequencer"});
    this.add(instrument);
  }
});