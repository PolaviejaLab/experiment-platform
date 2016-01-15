var express = require('express');
var router = express.Router();
var url = require('url');

var mongoose = require('mongoose');
var Experiment = mongoose.model('Experiment');

var experiment = require('../models/experiment.js');
var participant = require('../models/participant.js');

router.get('/experiment', experiment.list);

router.get('/experiment/(:experimentId)', experiment.findOne);

router.post('/experiment', experiment.create);
router.post('/experiment/(:experimentId)', experiment.update);
router.delete('/experiment/(:experimentId)', experiment.delete);


/**
 * Send CORS header based on ExperimentId
 */
router.use('/experiment/(:experimentId)/participant(/*)?', function (req, res, next) 
{
    Experiment.findOne({ _id: req.params.experimentId }, function (err, experiment) 
    {
        if(err) {
            res.sendStatus(500);
            return;
        }
        
        var parts = url.parse(experiment.url);
        
        res.header('Access-Control-Allow-Origin', parts['protocol'] + "//" + parts['hostname']);
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Vary', 'Origin');

        next();
    });
});


router.get('/experiment/(:experimentId)/participant', participant.list);
// Returns a participant with previous responses
// Seeing the responses should show password
router.get('/experiment/(:experimentId)/participant/(:participantId)', participant.findOne);
router.post('/experiment/(:experimentId)/participant', participant.create);
router.delete('/experiment/(:experimentId)/participant/(:participantId)', participant.delete);


// Start experiment
var mongoose = require('mongoose');
var Participant = mongoose.model('Participant');


/**
 * Returns the current time on the server in milliseconds
 */
router.get('/time', function(req, res) 
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    res.send(new Date().getTime().toString());
});


router.post('/experiment/(:experimentId)/participant/(:participantId)/start', function (req, res) 
{
    // Find relevant participant
    Participant.findOne({ _id: req.params.participantId }, function (err, participant) 
    {
        // Could not find participant, return error
        if (err) {
            res.status(404).json(err);
            return;
        }
        
        // The experiment is already over
        if (participant.finished) {
            res.status(409).json(
                { message: 'Experiment has already been terminated' }
            );
            return;
        }

        // The experiment has already started
        if (participant.started) {
            res.status(409).json(
                { message: 'Experiment is running' }
            );
            return;
        }

        // Start the participant
        Participant.update({ _id: req.params.participantId, started: null }, { $set: { started: Date.now() } }, {}, function (err, num_affected) {

            if (err) {
                res.status(410).json({ message: err });
                return;
            }

            res.status(200).json({ message: 'Started' });
            return;
        });
    });
});


router.post('/experiment/(:experimentId)/participant/(:participantId)/stop', function (req, res) 
{
    // Find relevant participant
    Participant.findOne({ _id: req.params.participantId }, function (err, participant) 
    {
        // Could not find participant, return error
        if (err) {
            res.status(404).json(err);
            return;
        }
        
        // The experiment is already over
        if (participant.finished) {
            res.status(409).json(
                { message: 'Experiment has already been terminated' }
            );
            return;
        }
        
        // The experiment has already started
        if (!participant.started) {
            res.status(409).json(
                { message: 'Experiment has not yet been started' }
            );
            return;
        }
        
        // Start the participant
        Participant.update({ _id: req.params.participantId, started: { '$ne': null }, finished: null }, { $set: { finished: Date.now() } }, {}, function (err, num_affected) {
            
            if (err) {
                res.status(410).json({ message: err });
                return;
            }
            
            res.status(200).json({ message: 'Finished' });
        });
    });
});

// Channel for server to client communication
//  router.get('/participant/(:id)/source');

// Channel for client to server communication
router.post('/experiment/(:experimentId)/participant/(:participantId)/sink', function (req, res) 
{
    // Find relevant participant
    Participant.findOne({ _id: req.params.participantId }, function (err, participant) 
    {
        // Could not find participant, return error
        if (err) {
            res.status(404).json(err);
            return;
        }
        
        // The experiment is already over
        if (participant.finished) {
            res.status(409).json(
                { message: 'Experiment has already been terminated' }
            );
            return;
        }
        
        // The experiment has already started
        if (!participant.started) {
            res.status(409).json(
                { message: 'Experiment has not yet been started' }
            );
            return;
        }
        
        // Update responses
        var data = req.body;
        var success = [];

        for (var i in data) {
            participant.responses.push(data[i])
            success.push(i);
        }
                
        participant.save(function(err, participant) {
            if (err) {
                res.status(410).json({ message: err });
                return;
            }
            
            res.status(200).json(success);
        });
    });
});

//router.post('/experiment/id/participant/id/finished')

module.exports = router;
