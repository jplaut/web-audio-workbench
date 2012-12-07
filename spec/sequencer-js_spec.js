describe("Effect", function() {
  var effect;

  beforeEach(function() {
    effect = new Effect();
  });

  it("should have correct default values", function() {
    expect(effect.get('type'))
      .toEqual('');

    expect(effect.get('values'))
      .toEqual([]);
  });
});


describe("SequencerView", function() {
  beforeEach(function() {
    setFixtures("<div id=\"wrapper\"></div>");

    var trackList = new TrackList;
    var audioContext = new webkitAudioContext();
    this.sequencerView = new SequencerView({collection: trackList, audioContext: audioContext});
    $("#wrapper").append(this.sequencerView.render().el);
  });

  it("should be defined without error", function() {
    expect(this.sequencerView).toBeDefined();
  });

  it("should have one track initially", function() {
    expect($("#wrapper").find("li.track").length).toBe(1);
  });

  it("should create new tracks", function() {
    $("button#addtrack").click();
    $("button#addtrack").click();
    expect($("#wrapper").find("li.track").length).toBe(3);
  });

  it("should delete tracks", function() {
    $("button#addtrack").click();
    $("button#addtrack").click();
    $("li.track:eq(1) .removeTrack").click();
    expect($("#wrapper").find("li.track").length).toBe(2);
    expect($("li.track:eq(1) .trackLabelText").text()).toBe("Track 2");
  });

  it("should change the tempo", function() {
    $("input#tempo").val("50");
    $("input#tempo").trigger("change");
    expect(this.sequencerView.tempo).toBe("50");
  });

  it("should change number of steps", function() {
    $("select#steps").val("32");
    $("select#steps").trigger("change");
    expect($("#wrapper .track:first").find(".step").length).toBe(32);
  });
});

describe("TrackView", function() {
  beforeEach(function () {
    setFixtures("<div id=\"wrapper\"></div>");

    var audioContext = new webkitAudioContext();
    var trackList = new TrackList;
    this.sequencerView = new SequencerView({collection: trackList, audioContext: audioContext});
    this.sequencerView.createTrack();
    this.sequencerView.createTrack();
    this.track = trackList.at(1);
  });

  it("should remove track", function() {
    spyOn(this.track, 'removeTrack');
    $(".removeTrack", this.track.el).click();
    expect(this.track.removeTrack).toHaveBeenCalled();
  });
})