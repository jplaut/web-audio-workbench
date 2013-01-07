var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 4567;

app.listen(port, function() {
  console.log('Listening on port ' + port);
});