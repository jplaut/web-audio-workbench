/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
 * - cache loaded templates/buffers so they don't need to be loaded again
*/

$(function() {
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    $("#overlay").css("display", "none");
    var appView = new AppView({
      model: app
    });

    $(document.body).append(appView.render().el);
    appView.handleWindowResize();
  }
});