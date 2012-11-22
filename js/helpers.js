Handlebars.registerHelper("for", function(num, options) {
  var out = "";
  for (var i = 0; i < num; i++) {
    var x = {num: i};
    out += options.fn(x);
  }

  return out;
})