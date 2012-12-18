/*
 * TO DO
 * - add save/load option
 * - add convolver effects
 * - allow for disabling/removing effects
 * - allow for expanding/contracting effects
*/

$(function() {
  var sequencerView = new SequencerView();
  $(document.body).append(sequencerView.render().el);
});