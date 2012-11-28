Handlebars.registerHelper("each_step", function(num, steps, options) {
  var out = "";

  for (var i = 0; i < num; i++) {
    var on = (steps[i]) ? ' on' : '';
    var x = {on: on, num: i};
    out += options.fn(x);
  }

  return out;
})

Handlebars.registerHelper("numSteps", function(numSteps) {
  var out = "";
  var steps = [4, 8, 16, 32]

  for (var i = 0; i < steps.length; i++) {
    out += "<option value=" + steps[i];
    out += (numSteps == steps[i]) ? " selected=\"selected\"" : "";
    out += ">" + steps[i] + "</option>"
  }
  
  return out;
})