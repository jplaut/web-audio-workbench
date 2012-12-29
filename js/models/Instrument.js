var Instrument = Backbone.Model.extend({
  defaults: function() {
    return {
      type: ''
    }
  },
  initialize: function() {
    switch (this.get('type')) {
      case "Sequencer":
        this.model = new Sequencer;
        this.view = new SequencerView({
          model: this.model,
          collection: this.model.collection,
          type: this.get('type')
        });
        break;
    }
  }
});