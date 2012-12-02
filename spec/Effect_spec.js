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