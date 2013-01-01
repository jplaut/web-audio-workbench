/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
*/

$(function() {
  var appView = new AppView({
    model: app
  });

  $(document.body).append(appView.render().el);
  appView.handleWindowResize();
});