/*  NODE DEPENDENCIES
*/
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var errorHandler    = require('errorhandler');
var passport        = require('passport');
var session         = require('express-session');

// To use flash middleware for displaying messages in templates
var flash           = require('connect-flash');

// Set up routes
var routes = require('./routes/index')(passport);
var user = require('./routes/user');
var shift = require('./routes/shift');
var templateShift = require('./routes/template-shift');
var shift = require('./routes/shift');
var swap = require('./routes/swap');
var schedule = require('./routes/schedule');
var organization = require('./routes/organization');

// Set up app
var app = express();
app.use(session({
    secret: 'WAH505ECRET',
    resave: true,
    saveUninitialized: true}));

var db;
// Connecting to OpenShift
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    dbURL = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/zhift';
    db = require('mongoose').connect(dbURL, function() {
        console.log("Successfully connected to MongoDB at: \n", dbURL);
    });
}
// Mongoose connection to MongoLab DB.
else {
    var MONGOLAB_CONNECTION_STRING = 'zhifty:6170@ds051110.mongolab.com:51110/zhift';
    mongoose.connect('mongodb://' + MONGOLAB_CONNECTION_STRING);

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log("Database ready.");
    });
}

// Configure passport
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./config/passport');
initPassport(passport);

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
app.use(flash());

app.use('/', routes);
app.use('/user', user);
app.use('/shift', shift);
app.use('/shift/template', templateShift);
app.use('/schedule', schedule);
app.use('/org', organization);
app.use('/swap', swap);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

// Error middleware 
app.use(function(err, req, res, next) {
    if (err.status === 400) {
        console.log("errormessage: ", err.message); 
        res.status(400).send(err.message);
    } 
    else if (err.status === 401) {
        res.status(401).send(err.message);
    } 
    else if (err.status === 403) {
        res.status(403).send(err.message);
    } 
    else if (err.status === 404) {
        res.status(404).send(err.message);
    } 
    else if (err.status === 500) {
        res.status(500).send(err.message);
    } 
    else {
        return next(err);
    }
});

// development error handler
if (app.get('env') === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
// production error handler
else {
    app.use(function(err, req, res, next) {
        app.use(errorHandler());
    });
}

// Setting up port
var port = Number(process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.listen(port, process.env.OPENSHIFT_NODEJS_IP, function() {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});

module.exports = app;
