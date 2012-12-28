/*
 * TO DO
 * - add save/load option
 * - put in separators for bars/beats
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
*/

$(function() {
  var trackListView = new TrackListView({
    collection: app.trackList
  });

  var transport = new TransportView({
    collection: app.trackList
  });

  $(document.body).append(trackListView.render().el);
  $(document.body).append(transport.render().el);
  trackListView.setDividerWidth();
  trackListView.handleWindowResize();
  transport.handleWindowResize();
});