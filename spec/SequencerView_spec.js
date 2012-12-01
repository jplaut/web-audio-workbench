describe("SequencerView", function() {
  beforeEach(function() {
    var trackList = new TrackList;
    var audioContext = new webkitAudioContext();
    this.sequencerView = new SequencerView({collection: trackList, audioContext: audioContext});
  });

  it("should have a template", function() {
    expect(this.sequencerView).toBeDefined();
  });
})