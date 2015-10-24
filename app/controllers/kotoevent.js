var KotoEvent     = require('../models/kotoevent');
var moment      = require('moment');

// ----------------------------------------------------
// CRUD FOR LIST of EVENTS
// http://url:port/api/kotinode/event
// ----------------------------------------------------

// create kotievent accessed at POST http://url:port/api/kotinode
exports.postEvents = function(req, res) {
    console.log("/kotinode event post");
    var kotoevent = new KotoEvent();      // create a new instance of the KotoEvent model
    kotoevent.name = req.body.name;  // set the kotinode name (comes from the request)
    kotoevent.date = moment(req.body.date, "DD.MM.YYYY:ssZ").toDate();
    kotoevent.note = req.body.note;
    kotoevent.description = req.body.descriptioncc;


    // save the bear and check for errors
    kotoevent.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'KotoEvent created!' });
    });
};

// get all the kotinode items (accessed at GET http://url:port/api/kotinode
exports.getEvents = function(req,res) {
    KotoEvent.find(function(err, kotinode) {
        if (err)
            res.send(err);

        res.json(kotinode);
    });
};

// delete all kotinode (accessed at DELETE http://url:port/api/kotinode/)
exports.deleteEvents = function(req, res) {
    KotoEvent.remove({}, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ message: 'All KotoEvents deleted' });
    });
};


// ----------------------------------------------------
// CRUD for ONE EVENT
// http://url:port/api/kotinode/event/:kotoevent_id
// ----------------------------------------------------

exports.getEvent = function(req,res){
    KotoEvent.findById(req.params.kotoevent_id, function(err, bear) {
        if (err)
            res.send(err);
        res.json(bear);
    });
};

exports.putEvenet = function(req,res){
    // use our bear model to find the bear we want
    KotoEvent.findById(req.params.kotoevent_id, function(err, kotoevent) {

        if (err)
            res.send(err);

        kotoevent.name = req.body.name;  // update the kotinode info
        kotoevent.date = req.body.date;
        kotoevent.note = req.body.note;
        kotoevent.description = req.body.description;

        // save the bear
        kotoevent.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'KotoEvent updated!' });
        });

    });
};

exports.deleteEvent = function(req,res){
    KotoEvent.remove({
        _id: req.params.kotoevent_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ message: 'KotoEvent deleted' });
    });
};