/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
 * - fix timing between different widgets (create beat time in App and let widgets get time from there)
*/

$(function() {
  var appView = new AppView({
    model: app
  });

  $(document.body).append(appView.render().el);
  appView.handleWindowResize();
});