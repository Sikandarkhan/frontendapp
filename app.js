var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require("path");
var cors = require('cors');

var PORT = process.env.PORT || 5005;

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
// middle ware
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// routes
var Index = require('./controllers/index.js');

app.use('/', Index);

module.exports = app;

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});