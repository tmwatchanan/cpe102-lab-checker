var express = require('express');
var app = express();
var morgan = require('morgan'); // logging

var port = process.env.PORT || 8080; // process.env.PORT lets the port be set by Heroku
app.set('port', port);

// Allow CORS
var cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(morgan('dev'));
app.listen(app.get('port'), () => {
    console.log('Listening requests on port ' + port);
});

app.get('/github', function (req, res) {
    res.send('You are at /github endpoint.');
});
