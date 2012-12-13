/*
 * TO DO
 * -fix effects drawer
 * -fix playback (why do we lose context after 1 pass?)
*/

$(function() {
  var sequencerView = new SequencerView();
  $(document.body).append(sequencerView.render().el);
});