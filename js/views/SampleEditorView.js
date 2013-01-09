var SampleEditorView = Backbone.View.extend({
  tagName: 'div',
  className: 'sample-editor',
  initialize: function() {
    _.bindAll(this, 'render', 'handleSampleChange', 'analyseSample');

    //this.template = globals.templateLoader.load('sampleeditor');
    this.sampleWaveform = null;
    this.analyser = globals.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;


    this.model.on('change:sample', this.handleSampleChange);
  },
  render: function() {
    //this.$el.append(this.template());

    return this;
  },
  handleSampleChange: function(model, sample) {
    console.log(sample.getChannelData(0));
    //$(".canvas", this.el).html("<img src=img/loading.gif />");

    if (sample) {
      //var source = globals.audioContext.createBufferSource();
      //source.buffer = sample;
      //source.connect(this.analyser);
      //this.sampleWaveform = 

      //this.analyseSample();
      //source.noteOn(0);
    }
  },
  analyseSample: function() {
    //var data = new Uint8Array(2048)
  }
});