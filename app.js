var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());
app.set('views', __dirname);

app.get('/', function(req, res) {
  var dev = (process.env.DEV) ? true: false;
  res.render("home.ejs", {dev: dev});
});

var port = process.env.PORT || 4567;

app.listen(port, function() {
  console.log('Listening on port ' + port);
});