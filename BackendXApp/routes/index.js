var express = require('express');
var router = express.Router();

var experiment = require('../models/experiment.js');
var participant = require('../models/participant.js');

router.get('/experiment', experiment.list);
router.get('/experiment/(:id)', experiment.findOne);
router.post('/experiment', experiment.create);
router.post('/experiment/(:id)', experiment.update);
router.delete('/experiment/(:id)', experiment.delete);


router.get('/participant', participant.list);
// Returns a participant with previous responses
// Seeing the responses should show password
router.get('/participant/(:id)', participant.findOne);
router.post('/participant', participant.create);
router.delete('/participant/(:id)', participant.delete);


// Start experiment
var mongoose = require('mongoose');
var Participant = mongoose.model('Participant');


router.post('/participant/(:id)/start', function (req, res) {
    // Find relevant participant
    Participant.findOne({ _id: req.params.id }, function (err, participant) {
        
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
        Participant.update({ _id: req.params.id, started: null }, { $set: { started: Date.now() } }, {}, function (err, num_affected) {

            if (err) {
                res.status(410).json({ message: err });
                return;
            }

            res.status(200).json({ message: 'Started' });
        });
    });
});


router.post('/participant/(:id)/stop', function (req, res) {
    // Find relevant participant
    Participant.findOne({ _id: req.params.id }, function (err, participant) {
        
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
        Participant.update({ _id: req.params.id, started: { '$ne': null }, finished: null }, { $set: { finished: Date.now() } }, {}, function (err, num_affected) {
            
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
//  router.post('/participant/(:id)/sink');

//router.post('/experiment/id/participant/id/finished')

module.exports = router;
