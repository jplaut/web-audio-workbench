var AutomationView = Backbone.View.extend({
  tagName: 'div',
  className: 'automationContainer',
  events: {
    'click .canvas': 'handleClick'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'handleClick', 'drawPathFromPoints', 'handleDrag', 'setValues', 'getPathPoints', 'toggleDisplay', 'changeEditingSteps', 'changePatternLength');
    this.param = this.model.params[this.options.param];
    this.points = this.param.points;
    this.width = 758;
    this.totalWidth = this.width * 4;
    this.height = 120;
    this.multiplier = this.height / (this.param.max - this.param.min);
    this.automationPathStr = "";

    this.template = globals.templateLoader.load('automation');
    app.on('change:editingSteps', this.changeEditingSteps);
    app.on('change:patternLength', this.changePatternLength);
    this.on('drag', this.handleDrag);
  },
  render: function() {
    this.$el.html(this.template({options: this.param}));

    this.canvas = Raphael($('.canvas', this.el)[0], this.totalWidth, this.height);
    $(".canvas", this.el).css('left', 0);

    this.automationPath = this.canvas.path("M0, " + (this.multiplier * (this.param.max - this.param.default)) + "H" + this.totalWidth);

    return this;
  },
  toggleDisplay: function() {
    var display = (this.$el.css('display') == 'block') ? 'none' : 'block';

    this.$el.css('display', display);
  },
  changeEditingSteps: function() {
    $(".canvas svg", this.el).css('left', -1 * this.width * app.get('editingSteps'));
  },
  changePatternLength: function() {
    if (app.get('patternLength') > this.param.values.length) {
      var stepLength = this.width / app.get('totalBeats');
      var str = "M" + (stepLength * (app.get('patternLength') - 1)) + ", 0V" + this.height;
      var intersection = Raphael.pathIntersection(this.automationPathStr, str)[0];

      if (intersection) {
        this.param.values.push(this.param.max - (intersection.y / this.multiplier));
      } else {
        this.param.values.push(this.param.values[-1]);
      }
    } else {
      this.param.values.pop();
    }
  },
  handleClick: function (e) {
    var self = this;

    var x = this.normalizeX(e.pageX);
    var y = this.normalizeY(e.pageY);
    var point = this.canvas.circle(x, y, 5)
      .attr('fill', '#000')
      .drag(function(dx, dy, x, y) {
        self.trigger('drag', this, dx, dy, x, y);
        }, 
        null,
        this.setValues
      );
      
    if (_(this.points).any(function(point) {return x < point.attr('cx')})) {
      var i = _(this.points).indexOf(_(this.points).find(function(point) {return point.attr('cx') > x}));
      this.points.splice(i, 0, point);
      this.activePointIndex = i;
    } else {
      this.points.push(point);
      this.activePointIndex = this.points.length - 1;
    }

    this.drawPathFromPoints(true);
  },
  drawPathFromPoints: function(setValues) {
    var automationPathStr;
    this.automationPath.remove();

    if (this.points.length == 1) {
      automationPathStr = "M0, " + this.points[0].attr('cy') + "H" + this.totalWidth;
    } else {
      automationPathStr = "M0, " + this.points[0].attr('cy') + "H" + this.points[0].attr('cx');

      _(this.points.slice(1, this.points.length)).each(function(point) {
        automationPathStr += "L" + point.attr('cx') + ", " + point.attr('cy');
      });

      automationPathStr += "H" + this.totalWidth;
    }
    this.automationPathStr = automationPathStr;
    this.automationPath = this.canvas.path(this.automationPathStr);

    if (setValues) {
      this.setValues();
    }
  },
  handleDrag: function(point, dx, dy, x, y) {
    var bbox = {
      x: app.get('editingSteps') * this.width,
      x2: app.get('editingSteps') * this.width + this.width,
      y: 0,
      y2: this.height
    };

    x = this.normalizeX(x);
    y = this.normalizeY(y);

    if (Raphael.isPointInsideBBox(bbox, x, y)) {
      var i = _(this.points).indexOf(point);

      if (!(this.points[i-1] && x <= this.points[i-1].attr('cx')) && !(this.points[i+1] && x >= this.points[i+1].attr('cx')) && x > 0 && x < this.totalWidth) {
        this.points[i].attr({cx: x, cy: y});
        this.drawPathFromPoints();
      }
    }
  },
  setValues: function() {
    var values = this.getPathPoints();
    this.param.values = values;
  },
  getPathPoints: function() {
    var stepLength = this.width / app.get('totalBeats');
    var values = [];

    for (var i = 0; i < app.get('patternLength'); i++) {
      var str = "M" + stepLength * i + ", 0V" + this.height;
      var intersection = Raphael.pathIntersection(this.automationPathStr, str)[0];

      try {
        values.push(this.param.max - (intersection.y / this.multiplier));
      } catch(err) {
        values.push('undefined');
      }
    }

    _(values).each(function(value, i) {
      if (!value || value == 'undefined') {
        values[i] = (values[i-1] + values[i+1]) / 2;
      }
    });

    return values;
  },
  normalizeX: function(x) {
    return x - $(document).scrollLeft() - this.$el.offset().left + (this.width * app.get('editingSteps'));
  },
  normalizeY: function(y) {
    return y - $(document).scrollTop() - this.$el.offset().top;
  }
})