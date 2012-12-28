/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
 * - allow for separate instances of sequencer "widget"
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