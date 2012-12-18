Handlebars.registerHelper("each_step", function(num, per, steps, options) {
  var out = "";

  for (var i = 0; i < num; i++) {
    var on = (steps[i * per]) ? ' on' : '';
    var x = {on: on, num: i};
    out += options.fn(x);
  }

  return out;
})

Handlebars.registerHelper("createSelect", function(options) {
  var out = "";

  _(options).each(function(value, key) {
    out += "<option value=\"" + key + "\">" + value.label + "</option>";
  });

  return out;
});