/*  NODE DEPENDENCIES
*/
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
// Set up routes
var routes = require('./routes/index');
var users = require('./routes/users');
var shift = require('./routes/shift');
var templateShift = require('./routes/template-shift');
var schedule = require('./routes/schedule');
var organization = require('./routes/organization');

// Set up app
var app = express();

// Mongoose connection to MongoLab DB.
var MONGOLAB_CONNECTION_STRING = 'zhifty:6170@ds051110.mongolab.com:51110/zhift';
mongoose.connect('mongodb://' + MONGOLAB_CONNECTION_STRING);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Database ready.");
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/shift', shift);
app.use('/shift/template', templateShift);
app.use('/schedule', schedule);
app.use('/org', organization);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Setting up port
var port = Number(process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.listen(port, process.env.OPENSHIFT_NODEJS_IP, function() {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});


module.exports = app;
