Handlebars.registerHelper("each_step", function(num, steps, options) {
  var out = "";

  for (var i = 0; i < num; i++) {
    var on = (steps[i]) ? ' on' : '';
    var x = {on: on, num: i};
    out += options.fn(x);
  }

  return out;
})