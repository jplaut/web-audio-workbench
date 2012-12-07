var express = require('express');
var app = express();

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(5555, 'localhost');
console.log('Listening on port 5555');