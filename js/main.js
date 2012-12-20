/*
 * TO DO
 * - add save/load option
 * - allow for disabling/removing effects
 * - allow for expanding/contracting effects
*/

$(function() {
  var trackList = new TrackList;

  var trackListView = new TrackListView({
    collection: trackList
  });

  var transport = new TransportView({
    collection: trackList
  });

  $(document.body).append(trackListView.render().el);
  $(document.body).append(transport.render().el);
  transport.handleWindowResize();
});