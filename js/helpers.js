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

  function processOptions(obj) {
    _(obj).each(function(value, key) {
      if (typeof value == "object") {
        out += "<optgroup label=\"" + key + "\">";
        processOptions(value);
        out += "</optgroup>";
      } else {
        out += "<option value=\"" + value + "\">" + key + "</option>";
      }
    });
  }

  processOptions(options);

  return out;
});