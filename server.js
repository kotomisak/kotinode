// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var fs = require('fs');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var config = require('config.json')('./app/config/config.json', process.env.NODE_ENV == 'dev' ? 'development' : 'production');
var kotoEventController = require('./app/controllers/kotoevent');
var kotiNodeAdminController = require('./app/controllers/kotinode_admin');
var demoTransparentAccount = require('./app/controllers/demoaccounts');
var logger = require('./app/utils/logger.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + "/public"));

var port = config.port;

mongoose.connect(config.mongo);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.mongo);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


// ROUTES FOR OUR API
// =============================================================================
var api_router = express.Router();              // get an instance of the express Router
var web_router = express.Router();

web_router.use(function (req, res, next) {
   console.log('Access WEB KoTi request');
    next();
});

// middleware to use for all requests
api_router.use(function(req, res, next) {
    //init api request id to header
    var rid = Math.floor((Math.random() * 1000000000000) + 1);
    req.headers['rid']= rid;

    //log basic incomming params
    logger.log(req,'params:'+JSON.stringify(req.params));
    logger.log(req,'query:'+JSON.stringify(req.query));
    logger.log(req,'headers:'+JSON.stringify(req.headers));
    logger.log(req,'method:'+req.method);
    logger.log(req,'route:'+req.url);
    next(); // make sure we go to the next routes and don't stop here
});


// ===== ROUTE to WEB ========

web_router.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/welcome/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

web_router.get('/kbforest', function(req, res) {
    fs.readFile(__dirname + '/public/kbforest/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

web_router.get('/kbsmart', function(req, res) {
    fs.readFile(__dirname + '/public/kbsmart/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

web_router.get('/project', function(req, res) {
    fs.readFile(__dirname + '/public/project/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});


// ===== ROUTE to SERVER API ========

// ----------------------------------------------------
// ADMIN
// ----------------------------------------------------
api_router.route('/kotinode/admin')
    .get(kotiNodeAdminController.empty)
    .post(kotiNodeAdminController.empty)
    .put(kotiNodeAdminController.empty)
    .patch(kotiNodeAdminController.empty)
    .delete(kotiNodeAdminController.reset)
    .purge(kotiNodeAdminController.reset)

// ----------------------------------------------------
// DEMO ACCOUNT
// ----------------------------------------------------

api_router.route('/kotinode/account')

    .get(demoTransparentAccount.getAccounts)


api_router.route('/kotinode/transaction')

    .get(demoTransparentAccount.getTransactions)

// ----------------------------------------------------
// KOTOEVENT
// ----------------------------------------------------
api_router.route('/kotinode/event')
    .get(function(req,res,next){kotoEventController.getEvents(req,res);})
    .post(kotoEventController.empty)
    .put(kotoEventController.empty)
    .patch(kotoEventController.empty)
    .delete(kotoEventController.empty)
    .purge(kotoEventController.empty);

api_router.route('/kotinode/event/fixed')
    .get(kotoEventController.getEventsFixed)
    .post(kotoEventController.empty)
    .put(kotoEventController.empty)
    .patch(kotoEventController.empty)
    .delete(kotoEventController.empty)
    .purge(kotoEventController.empty);

api_router.route('/kotinode/event/:kotoevent_id')
    .get(kotoEventController.empty)
    .put(kotoEventController.empty)
    .delete(kotoEventController.empty);



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', web_router);
app.use('/api', api_router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Kotinode at disposal on port ' + port);