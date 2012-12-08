/*
 * TO DO
 * -fix effects drawer
 * -fix playback (why do we lose context after 1 pass?)
*/

$(function() {
  window.globals = new Globals;
  var sequencerView = new SequencerView();
  $(document.body).append(sequencerView.render().el);
});